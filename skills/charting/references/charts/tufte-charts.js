/* ===========================================================================
   tufte-charts.js — vanilla ES module. No library, no external scripts, no
   build step.

   Structure:
     1. Tiny SVG helper library (svgEl, svg, scaleLinear, path, ...)
     2. Tufte primitives (rangeFrameAxis, directLabel, marginalTicks)
     3. A shared hover tooltip (wired ONLY to the dense charts)
     4. DATA — one synthetic illustrative dataset per chart
     5. Thirty-two builder functions (+ ten anti-pattern contrasts), each
        rendering into its mount node
     6. A registry that draws every chart on load

   Palette mirrors tufte-charts.css. The CSS owns ink; JS sets geometry and,
   where a value must be computed (heatmap ramp), color.
   ========================================================================= */

/* The standard SVG namespace, required by createElementNS. This is an
   identifier the browser recognizes, not a network resource — the correct,
   readable form, and what every SVG-in-JS reference uses. */
const SVGNS = 'http://www.w3.org/2000/svg';

/* Palette constants (kept in sync with the CSS custom properties). */
const C = {
  paper:  '#fdfdfb',
  ink:    '#111111',
  muted:  '#6b6b6b',
  rule:   '#d8d8d2',
  accent: '#b0301c',
};

/* -------------------------------------------------------------------------
   1. SVG helper library
   ------------------------------------------------------------------------- */

/** Create a namespaced SVG element. attrs values are stringified; children
 *  may be nodes or text. `class` is accepted as a key. */
function svgEl(tag, attrs = {}, children = []) {
  const el = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    if (k === 'text') { el.textContent = String(v); continue; }
    el.setAttribute(k, String(v));
  }
  for (const child of [].concat(children)) {
    if (child == null) continue;
    el.appendChild(typeof child === 'string'
      ? document.createTextNode(child)
      : child);
  }
  return el;
}

/** Root <svg>. Uses a viewBox so charts scale down responsively; width/height
 *  set the intrinsic size. */
function svg(width, height, cls) {
  return svgEl('svg', {
    width, height,
    viewBox: `0 0 ${width} ${height}`,
    class: cls,
    role: 'img',
  });
}

/** A linear scale: maps a numeric domain [d0,d1] onto a pixel range [r0,r1]. */
function scaleLinear(domain, range) {
  const [d0, d1] = domain, [r0, r1] = range;
  const span = (d1 - d0) || 1;
  const f = (x) => r0 + ((x - d0) / span) * (r1 - r0);
  f.domain = domain; f.range = range;
  f.invert = (px) => d0 + ((px - r0) / (r1 - r0)) * span;
  return f;
}

/** min/max of an array via accessor. */
const extent = (arr, acc = (d) => d) => {
  let lo = Infinity, hi = -Infinity;
  for (const d of arr) { const v = acc(d); if (v < lo) lo = v; if (v > hi) hi = v; }
  return [lo, hi];
};

/** Build an SVG path "d" string from [{x,y}, ...]. */
function path(points, { close = false } = {}) {
  if (!points.length) return '';
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) d += `L${points[i].x},${points[i].y}`;
  if (close) d += 'Z';
  return d;
}

/* -------------------------------------------------------------------------
   2. Tufte primitives
   ------------------------------------------------------------------------- */

/** Range-frame axis: the axis line spans ONLY the data extent (not the full
 *  plot box), with tick marks at the supplied data values. This is the Tufte
 *  "range frame" — the frame itself reports the min and max of the data.
 *
 *  orient: 'bottom' (horizontal axis along y=pos) or 'left' (vertical, x=pos).
 *  scale: the pixel scale for the axis variable.
 *  ticks: data values to mark (e.g. [min, max, last]).
 *  format: value -> label string. */
function rangeFrameAxis(scale, { orient, pos, ticks, format = (v) => v, tickLen = 5 }) {
  const g = svgEl('g', { class: 'axis' });
  const [a, b] = scale.range;
  const lo = Math.min(a, b), hi = Math.max(a, b);

  if (orient === 'bottom') {
    g.appendChild(svgEl('line', { class: 'range-frame', x1: lo, y1: pos, x2: hi, y2: pos }));
    for (const t of ticks) {
      const x = scale(t);
      g.appendChild(svgEl('line', { x1: x, y1: pos, x2: x, y2: pos + tickLen }));
      g.appendChild(svgEl('text', {
        x, y: pos + tickLen + 11, 'text-anchor': 'middle', class: 'tick', text: format(t),
      }));
    }
  } else { // 'left'
    g.appendChild(svgEl('line', { class: 'range-frame', x1: pos, y1: lo, x2: pos, y2: hi }));
    for (const t of ticks) {
      const y = scale(t);
      g.appendChild(svgEl('line', { x1: pos - tickLen, y1: y, x2: pos, y2: y }));
      g.appendChild(svgEl('text', {
        x: pos - tickLen - 4, y: y + 3.5, 'text-anchor': 'end', class: 'tick', text: format(t),
      }));
    }
  }
  return g;
}

/** A direct label placed next to a mark, replacing a legend. */
function directLabel(x, y, text, { anchor = 'start', cls = 'label', dy = 3.5 } = {}) {
  return svgEl('text', { x, y: y + dy, 'text-anchor': anchor, class: cls, text });
}

/** Marginal ticks (a "rug"): short ticks on an axis, one per data value, so the
 *  axis carries the marginal distribution (the dot-dash plot). */
function marginalTicks(values, scale, { orient, pos, len = 6 }) {
  const g = svgEl('g', {});
  for (const v of values) {
    const p = scale(v);
    if (orient === 'bottom')
      g.appendChild(svgEl('line', { class: 'rug', x1: p, y1: pos, x2: p, y2: pos - len }));
    else
      g.appendChild(svgEl('line', { class: 'rug', x1: pos, y1: p, x2: pos + len, y2: p }));
  }
  return g;
}

/* -------------------------------------------------------------------------
   3. Shared hover tooltip — created once, reused by the dense charts.
   ------------------------------------------------------------------------- */

const tooltip = (() => {
  const el = document.createElement('div');
  el.className = 'tufte-tooltip';
  document.body.appendChild(el);
  return {
    show(html, evt) {
      el.textContent = html;
      el.classList.add('show');
      el.style.left = (evt.clientX + 12) + 'px';
      el.style.top  = (evt.clientY + 12) + 'px';
    },
    hide() { el.classList.remove('show'); },
  };
})();

/** Attach tooltip behavior to a mark. labelFn() -> string shown on hover. */
function hoverable(node, labelFn) {
  node.classList.add('hot');
  node.addEventListener('mousemove', (e) => tooltip.show(labelFn(), e));
  node.addEventListener('mouseleave', () => tooltip.hide());
  return node;
}

/* small deterministic helpers so the "synthetic" data is stable across loads */
function seeded(seed) {            // tiny LCG — repeatable pseudo-random
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 0xffffffff;
}
const round = (v, n = 0) => { const k = 10 ** n; return Math.round(v * k) / k; };

/* -------------------------------------------------------------------------
   4. DATA — one synthetic illustrative dataset per chart.
      All numbers are made up to demonstrate a form, not to report fact.
   ------------------------------------------------------------------------- */

const DATA = {};

/* #1 sparklines: a few short series + a tristate win/loss run. */
DATA.spark = {
  glucose: [82, 79, 85, 90, 88, 95, 102, 98, 91, 96, 99, 105, 101, 97, 93, 100],
  revenue: [12, 14, 13, 17, 16, 19, 22, 21, 24, 23, 27, 29],
  trades:  [1, 1, -1, 1, -1, -1, 1, 1, 1, -1, 1, 0, 1, -1, 1],
  rows: [
    { name: 'North',  series: [22, 24, 23, 27, 30, 29, 33, 36, 34, 38], last: 38 },
    { name: 'South',  series: [40, 38, 39, 35, 33, 34, 30, 28, 27, 25], last: 25 },
    { name: 'East',   series: [15, 16, 18, 17, 19, 22, 21, 24, 26, 28], last: 28 },
    { name: 'West',   series: [30, 31, 29, 32, 31, 33, 32, 34, 33, 35], last: 35 },
  ],
};

/* #2 slopegraph: before/after a policy change, ~8 categories. */
DATA.slope = {
  leftLabel: '2019', rightLabel: '2024', unit: '%',
  items: [
    { name: 'Finland',  a: 78, b: 86 },
    { name: 'Canada',   a: 71, b: 74 },
    { name: 'Germany',  a: 69, b: 81 },
    { name: 'Japan',    a: 66, b: 62 },
    { name: 'Brazil',   a: 58, b: 67 },
    { name: 'Egypt',    a: 54, b: 49 },
    { name: 'Kenya',    a: 47, b: 58 },
    { name: 'Peru',     a: 44, b: 41 },
  ],
};

/* #3 small multiples: monthly index for 9 product lines, shared scale. */
DATA.multiples = (() => {
  const rnd = seeded(7);
  const names = ['Cables', 'Sensors', 'Pumps', 'Valves', 'Motors', 'Gauges', 'Filters', 'Relays', 'Bearings'];
  return names.map((name, i) => {
    let v = 40 + rnd() * 20;
    const drift = (i - 4) * 1.4;             // some rise, some fall
    const series = Array.from({ length: 12 }, (_, m) => {
      v += drift + (rnd() - 0.5) * 9;
      return { m, v: Math.max(8, v) };
    });
    return { name, series };
  });
})();

/* #4 minimal boxplot: 5 measurement groups (already as summary stats). */
DATA.box = [
  { group: 'A', min: 12, q1: 22, med: 30, q3: 38, max: 52 },
  { group: 'B', min: 18, q1: 28, med: 33, q3: 41, max: 49 },
  { group: 'C', min: 9,  q1: 19, med: 24, q3: 31, max: 47 },
  { group: 'D', min: 21, q1: 34, med: 44, q3: 52, max: 63 },
  { group: 'E', min: 15, q1: 24, med: 28, q3: 35, max: 44 },
];

/* #5 dot-dash scatter: height vs reaction (synthetic), ~40 points. */
DATA.scatter = (() => {
  const rnd = seeded(19);
  return Array.from({ length: 42 }, () => {
    const x = 150 + rnd() * 45;                       // x: 150..195
    const y = 420 - (x - 150) * 2.1 + (rnd() - 0.5) * 70; // loose negative trend
    return { x: round(x, 1), y: round(y, 0) };
  });
})();

/* #6 range-frame line: a daily series across ~70 points. */
DATA.line = (() => {
  const rnd = seeded(33);
  let v = 100;
  return Array.from({ length: 70 }, (_, i) => {
    v += (rnd() - 0.46) * 4.2;
    return { t: i, v: round(v, 2) };
  });
})();

/* #7 Cleveland dot plot: per-category values, unsorted (builder sorts). */
DATA.dotplot = [
  { cat: 'Refrigerator', v: 612 },
  { cat: 'Water heater', v: 410 },
  { cat: 'Dryer',        v: 388 },
  { cat: 'Dishwasher',   v: 215 },
  { cat: 'Television',   v: 168 },
  { cat: 'Microwave',    v: 142 },
  { cat: 'Laptop',       v: 58  },
  { cat: 'Router',       v: 41  },
];

/* #8 candlestick + volume: ~32 trading days of OHLC + volume. */
DATA.ohlc = (() => {
  const rnd = seeded(51);
  let close = 50;
  return Array.from({ length: 32 }, (_, i) => {
    const open = close;
    const drift = (rnd() - 0.48) * 3.2;
    close = Math.max(20, open + drift);
    const high = Math.max(open, close) + rnd() * 1.8;
    const low  = Math.min(open, close) - rnd() * 1.8;
    const vol  = 200 + rnd() * 600 + Math.abs(drift) * 120;
    return { i, open: round(open, 2), high: round(high, 2), low: round(low, 2), close: round(close, 2), vol: round(vol) };
  });
})();

/* #9 tear-sheet: a daily return stream; the builder derives cum + drawdown,
   and a months×years grid for the heatmap. */
DATA.tear = (() => {
  const rnd = seeded(71);
  const daily = Array.from({ length: 252 }, () => (rnd() - 0.46) * 0.012); // ~1yr
  // monthly returns laid out as years (rows) x months (cols)
  const years = ['2021', '2022', '2023'];
  const monthly = years.map((y) =>
    Array.from({ length: 12 }, () => round((rnd() - 0.45) * 0.09, 4)));
  return { daily, years, monthly };
})();

/* #10 forest plot: effect sizes with CIs across studies. */
DATA.forest = {
  ref: 0, unit: 'log OR',
  rows: [
    { study: 'Aldridge 2018', est: 0.42, lo: 0.10, hi: 0.74, n: 240 },
    { study: 'Beck 2019',     est: 0.18, lo: -0.05, hi: 0.41, n: 410 },
    { study: 'Cho 2020',      est: 0.55, lo: 0.28, hi: 0.82, n: 180 },
    { study: 'Devi 2021',     est: -0.12, lo: -0.40, hi: 0.16, n: 320 },
    { study: 'Evans 2022',    est: 0.31, lo: 0.14, hi: 0.48, n: 760 },
    { study: 'Faraz 2023',    est: 0.24, lo: 0.02, hi: 0.46, n: 290 },
  ],
  pooled: { est: 0.27, lo: 0.15, hi: 0.39 },
};

/* #11 bullet graphs: KPI vs target over qualitative bands. */
DATA.bullet = [
  { label: 'Revenue',      unit: 'k', value: 275, target: 250, bands: [150, 225, 300], max: 320 },
  { label: 'Profit',       unit: '%', value: 18,  target: 26,  bands: [15, 22, 30],   max: 35  },
  { label: 'New users',    unit: 'k', value: 41,  target: 38,  bands: [25, 35, 45],   max: 50  },
  { label: 'Satisfaction', unit: '',  value: 4.3, target: 4.5, bands: [3.5, 4.2, 4.8], max: 5  },
];

/* #12 calendar / matrix heatmap: weekday x week, magnitude per cell. */
DATA.heatmap = (() => {
  const rnd = seeded(97);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeks = 18;
  const cells = [];
  for (let w = 0; w < weeks; w++)
    for (let d = 0; d < 7; d++) {
      // weekends quieter, a gentle mid-quarter ramp
      const base = (d >= 5 ? 0.2 : 0.6) + Math.sin(w / 5) * 0.25;
      cells.push({ w, d, day: days[d], v: round(Math.max(0, base + (rnd() - 0.5) * 0.5) * 100) });
    }
  return { days, weeks, cells };
})();

/* #13 horizon: 12 time series, ~44 points each, mean-reverting around 0 so
   every series has both positive and negative excursions to fold. */
DATA.horizon = (() => {
  const rnd = seeded(131);
  const names = ['AUD', 'BRL', 'CAD', 'CHF', 'CNY', 'EUR', 'GBP', 'INR', 'JPY', 'KRW', 'MXN', 'ZAR'];
  return names.map((name, i) => {
    let v = (rnd() - 0.5) * 2;
    const trend = (i - 6) * 0.05;
    const pts = Array.from({ length: 44 }, (_, t) => {
      v = (v + trend + (rnd() - 0.5) * 1.2) * 0.9; // drift, noise, mean-revert
      return { t, v: round(v, 3) };
    });
    return { name, pts };
  });
})();

/* #14 SPLOM: ~60 records, 4 variables with built-in correlation. */
DATA.splom = (() => {
  const rnd = seeded(211);
  const vars = ['mpg', 'hp', 'weight', 'accel'];
  const rows = Array.from({ length: 60 }, () => {
    const hp = 50 + rnd() * 200;
    const weight = 1500 + hp * 6 + (rnd() - 0.5) * 1100;
    const mpg = 46 - hp * 0.11 + (rnd() - 0.5) * 7;
    const accel = 14 - hp * 0.025 + (rnd() - 0.5) * 2.5;
    return { mpg: round(mpg, 1), hp: round(hp), weight: round(weight), accel: round(accel, 1) };
  });
  return { vars, rows };
})();

/* #15 parallel coordinates: ~42 records across 6 dimensions. */
DATA.parcoords = (() => {
  const rnd = seeded(307);
  const dims = ['carat', 'price', 'depth', 'table', 'clarity', 'cut'];
  const rows = Array.from({ length: 42 }, () => {
    const carat = 0.3 + rnd() * 2;
    const price = carat * 4200 + (rnd() - 0.5) * 2400;
    return {
      carat: round(carat, 2), price: round(price),
      depth: round(58 + rnd() * 8, 1), table: round(54 + rnd() * 10, 1),
      clarity: round(1 + rnd() * 7), cut: round(1 + rnd() * 4),
    };
  });
  return { dims, rows };
})();

/* #16 cycle plot: 12 months across 4 years; a seasonal macro shape plus a
   within-month upward trend so each month's subseries slopes. */
DATA.cycle = (() => {
  const rnd = seeded(401);
  const years = [2021, 2022, 2023, 2024];
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  const seasonal = [30, 33, 42, 55, 68, 80, 84, 79, 66, 52, 40, 33];
  const data = months.map((month, m) => ({
    month,
    series: years.map((year, k) => ({ year, v: round(seasonal[m] + k * 3.2 + (rnd() - 0.5) * 5, 1) })),
  }));
  return { months, years, data };
})();

/* #17 preattentive pop-out: a jittered grid of marks, exactly one key datum. */
DATA.popout = (() => {
  const rnd = seeded(503);
  const cols = 8, rows = 5, pts = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      pts.push({ x: c + (rnd() - 0.5) * 0.5, y: r + (rnd() - 0.5) * 0.5, key: false });
  pts[23].key = true; pts[23].label = 'key datum'; // rightmost column -> clear right margin
  return { cols, rows, pts };
})();

/* #18 reference band: a wandering series vs a fixed "normal range". */
DATA.refband = (() => {
  const rnd = seeded(607);
  let v = 100;
  const pts = Array.from({ length: 60 }, (_, t) => { v += (rnd() - 0.5) * 6; return { t, v: round(v, 1) }; });
  return { pts, lo: 90, hi: 112, label: 'normal range' };
})();

/* #19 gestalt grouping: three clusters separated by whitespace. */
DATA.gestalt = (() => {
  const rnd = seeded(701);
  const centers = [
    { cx: 0.26, cy: 0.32, name: 'Cluster A' },
    { cx: 0.74, cy: 0.30, name: 'Cluster B' },
    { cx: 0.50, cy: 0.74, name: 'Cluster C' },
  ];
  return centers.map((c) => ({
    ...c,
    pts: Array.from({ length: 18 }, () => ({ x: c.cx + (rnd() - 0.5) * 0.17, y: c.cy + (rnd() - 0.5) * 0.17 })),
  }));
})();

/* #20 figure-ground: a deviation series that crosses zero repeatedly. */
DATA.figureground = (() => {
  const rnd = seeded(809);
  let v = 0;
  return Array.from({ length: 56 }, (_, t) => { v = (v + (rnd() - 0.5) * 1.5) * 0.88; return { t, v: round(v, 3) }; });
})();

/* #21 KPI tiles: headline number + sparkline + signed delta. */
DATA.kpi = [
  { label: 'MRR',           value: '$48.2k', series: [38, 39, 41, 40, 43, 45, 44, 47, 48], delta: 6.1 },
  { label: 'Active users',  value: '12,840', series: [9, 9.5, 10, 10.4, 11, 11.3, 12, 12.4, 12.8], delta: 3.4 },
  { label: 'Churn',         value: '2.1%',   series: [3.0, 2.9, 2.7, 2.8, 2.5, 2.4, 2.3, 2.2, 2.1], delta: -0.3 },
  { label: 'p95 latency',   value: '184ms',  series: [150, 158, 170, 165, 176, 180, 179, 182, 184], delta: 4.2 },
  { label: 'NPS',           value: '52',     series: [44, 45, 47, 46, 48, 50, 49, 51, 52], delta: 2.0 },
];

/* #22 metric small-multiples board: ~6 mini series on a shared scale. */
DATA.board = (() => {
  const rnd = seeded(881);
  const names = ['Signups', 'Activation', 'Retention', 'Referral', 'Revenue', 'Support'];
  return names.map((name, i) => {
    let v = 30 + rnd() * 30;
    const drift = (i % 2 ? 1.0 : -0.6);
    const series = Array.from({ length: 16 }, (_, t) => { v = Math.max(5, v + drift + (rnd() - 0.5) * 7); return { t, v: round(v, 1) }; });
    return { name, series };
  });
})();

/* #23 bullet/gauge status board: measure vs target over bands. */
DATA.status = [
  { label: 'Uptime',      value: 99.2, target: 99.5, bands: [98, 99, 99.9], max: 100, unit: '%' },
  { label: 'API p99',     value: 420,  target: 350,  bands: [300, 450, 700], max: 800, unit: 'ms' },
  { label: 'Error rate',  value: 0.6,  target: 0.5,  bands: [0.4, 1.0, 2.0], max: 2.5, unit: '%' },
  { label: 'Queue depth', value: 1200, target: 1500, bands: [1000, 2000, 3000], max: 3500, unit: '' },
  { label: 'Disk used',   value: 62,   target: 75,   bands: [50, 75, 90], max: 100, unit: '%' },
];

/* #24 data table with inline graphics: a sparkline + a tiny bar series per row. */
DATA.dataTable = (() => {
  const rnd = seeded(911);
  const names = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-south-1', 'sa-east-1'];
  return names.map((name) => {
    let v = 40 + rnd() * 40;
    const trend = Array.from({ length: 12 }, () => { v = Math.max(5, v + (rnd() - 0.5) * 14); return round(v); });
    const bars = Array.from({ length: 7 }, () => round(20 + rnd() * 80));
    return { name, trend, bars, p95: round(80 + rnd() * 180), err: round(rnd() * 1.5, 2) };
  });
})();

/* #25 composite overview: a headline series, stat tiles, and an activity heatmap. */
DATA.overview = (() => {
  const rnd = seeded(953);
  let v = 100;
  const headline = Array.from({ length: 40 }, (_, t) => { v += (rnd() - 0.45) * 3; return { t, v: round(v, 1) }; });
  const tiles = [
    { label: 'Sessions',   value: '8,210', delta: 5.2 },
    { label: 'Conversion', value: '3.4%',  delta: 0.3 },
    { label: 'Avg order',  value: '$57',   delta: -1.1 },
  ];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], hours = 8, cells = [];
  for (let h = 0; h < hours; h++)
    for (let d = 0; d < 7; d++)
      cells.push({ h, d, day: days[d], v: round(Math.max(0, 0.5 + Math.sin((h + d) / 3) * 0.3 + (rnd() - 0.5) * 0.4) * 100) });
  return { headline, tiles, days, hours, cells };
})();

/* #26 vol smile/skew: implied vol vs moneyness across three expiries. */
DATA.volsmile = (() => {
  const expiries = [
    { label: '30d',  base: 0.22, skew: 0.16, curv: 0.55 },
    { label: '90d',  base: 0.20, skew: 0.10, curv: 0.34 },
    { label: '180d', base: 0.19, skew: 0.06, curv: 0.22 },
  ];
  const ms = []; for (let m = -0.30; m <= 0.301; m += 0.04) ms.push(round(m, 3));
  return expiries.map((e) => ({ ...e, pts: ms.map((m) => ({ m, iv: round(e.base + e.skew * (-m) + e.curv * m * m, 4) })) }));
})();

/* #29 regression: a noisy linear relationship; the builder fits OLS. */
DATA.regression = (() => {
  const rnd = seeded(1117);
  return Array.from({ length: 44 }, () => { const x = 2 + rnd() * 8; const y = 3 + 1.6 * x + (rnd() - 0.5) * 5; return { x: round(x, 2), y: round(y, 2) }; });
})();

/* #30 ML feature analysis: per-feature importance + signed SHAP samples. */
DATA.mlfeat = (() => {
  const rnd = seeded(1213);
  const names = ['recency', 'frequency', 'monetary', 'tenure', 'region', 'channel', 'device'];
  return names.map((name, i) => {
    const importance = round((names.length - i) * 0.12 + rnd() * 0.05, 3);
    const shap = Array.from({ length: 26 }, () => {
      const fval = rnd();                              // 0..1 feature value
      const impact = (fval - 0.5) * importance * 4 + (rnd() - 0.5) * 0.1;
      return { v: round(impact, 3), fval: round(fval, 2), j: round((rnd() - 0.5) * 2, 3) };
    });
    return { name, importance, shap };
  });
})();

/* #27 portfolio: holdings with weight % and risk-contribution %. */
DATA.portfolio = [
  { name: 'AAPL', w: 18, risk: 22 },
  { name: 'MSFT', w: 15, risk: 17 },
  { name: 'TLT',  w: 14, risk: 5  },   // bonds: big weight, small risk
  { name: 'NVDA', w: 12, risk: 21 },   // small weight, big risk
  { name: 'GLD',  w: 11, risk: 10 },
  { name: 'AMZN', w: 11, risk: 12 },
  { name: 'JPM',  w: 10, risk: 7  },
  { name: 'XOM',  w: 9,  risk: 6  },
];

/* #28 VaR & stress: a P&L return stream (left-skewed) + stress scenarios. */
DATA.varstress = (() => {
  const rnd = seeded(1319);
  const ret = Array.from({ length: 420 }, () => {
    const z = rnd() + rnd() + rnd() - 1.5;            // ~normal
    return round(z * 1.4 - 0.1 - (z < 0 ? z * z * 0.5 : 0), 3); // fatten the loss tail
  });
  const scenarios = [
    { name: 'Equity −20%',    impact: -14.5 },
    { name: 'Vol spike',      impact: -9.8 },
    { name: 'Rates +100bp',   impact: -8.2 },
    { name: 'Recovery rally', impact: 7.2 },
    { name: 'Credit +150bp',  impact: -6.1 },
    { name: 'Oil +30%',       impact: -4.7 },
    { name: 'USD +10%',       impact: 3.4 },
  ];
  return { ret, scenarios };
})();

/* #31 diverging: regional trade balance (signed, meaningful zero midpoint). */
DATA.diverging = [
  { region: 'East Asia',     v: 38 },
  { region: 'N. America',    v: -22 },
  { region: 'N. Europe',     v: 27 },
  { region: 'S. Europe',     v: -9 },
  { region: 'Middle East',   v: 31 },
  { region: 'S. America',    v: -14 },
  { region: 'Sub-Sah. Afr.', v: -6 },
  { region: 'S. Asia',       v: -19 },
  { region: 'Oceania',       v: 12 },
];

/* #32 annotated time series: a clean series + a few labeled events/thresholds. */
DATA.annotated = (() => {
  const rnd = seeded(1409);
  let v = 60;
  const series = Array.from({ length: 48 }, (_, t) => {
    // gentle base drift, with a visible step up after the "launch"
    v += (rnd() - 0.48) * 3 + (t === 12 ? 14 : 0) - (t === 30 ? 18 : 0);
    return { t, v: round(Math.max(10, v), 1) };
  });
  const events = [
    { t: 12, label: 'launch' },
    { t: 30, label: 'incident' },
    { t: 44, label: 'recovery' },
  ];
  return { series, events, target: 78, targetLabel: 'SLA target' };
})();

/* ── Anti-pattern datasets — used ONLY to contrast wrong vs right. ────────── */

/* small relative differences: truncation makes them look huge, zero shows them ~equal */
DATA.antiTrunc = [
  { k: 'Q1', v: 98 }, { k: 'Q2', v: 102 }, { k: 'Q3', v: 100 }, { k: 'Q4', v: 101 },
];
/* a 1:2:4 ratio — radius-encoding turns it into 1:4:16 by area */
DATA.antiBubble = [
  { k: 'A', v: 10 }, { k: 'B', v: 20 }, { k: 'C', v: 40 },
];
/* two unrelated series on very different scales (dual-axis can fake a correlation) */
DATA.antiDual = (() => {
  const rnd = seeded(1511);
  const sales = Array.from({ length: 16 }, (_, t) => round(120 + t * 6 + (rnd() - 0.5) * 18));
  const temp = Array.from({ length: 16 }, (_, t) => round(8 + t * 0.9 + (rnd() - 0.5) * 3, 1));
  return { sales, temp };
})();
/* near-equal shares: a pie can't be ranked by eye, a sorted bar ranks instantly */
DATA.antiPie = [
  { k: 'Email', v: 22 }, { k: 'Search', v: 21 }, { k: 'Direct', v: 20 },
  { k: 'Social', v: 19 }, { k: 'Referral', v: 18 },
];
/* 4 periods × 3 products; stacking floats product B (middle) on a varying base,
   so B's quarter-to-quarter pattern [18,22,16,24] is unreadable when stacked */
DATA.antiStack = [
  { k: 'Q1', a: 30, b: 18, c: 12 },
  { k: 'Q2', a: 22, b: 22, c: 20 },
  { k: 'Q3', a: 34, b: 16, c: 10 },
  { k: 'Q4', a: 20, b: 24, c: 16 },
];

/* -------------------------------------------------------------------------
   5. Builders
   ------------------------------------------------------------------------- */

/* --- #1 Sparklines ------------------------------------------------------- */

/** Build one inline word-sized line sparkline with an end dot + value. */
function sparkLine(values, { w = 90, h = 20, accentEnd = true } = {}) {
  const s = svg(w, h, 'spark');
  const x = scaleLinear([0, values.length - 1], [1, w - 1]);
  const y = scaleLinear(extent(values), [h - 2, 2]);
  const pts = values.map((v, i) => ({ x: x(i), y: y(v) }));
  // a Tufte sparkline carries no background fill — just the line + end dot
  s.appendChild(svgEl('path', { d: path(pts), class: 'series' }));
  const end = pts[pts.length - 1];
  s.appendChild(svgEl('circle', { cx: end.x, cy: end.y, r: 1.7, fill: accentEnd ? C.accent : C.ink }));
  return s;
}

/** Inline bar sparkline. */
function sparkBar(values, { w = 90, h = 20 } = {}) {
  const s = svg(w, h, 'spark');
  const bw = w / values.length;
  const y = scaleLinear([0, extent(values)[1]], [h, 2]);
  values.forEach((v, i) => {
    s.appendChild(svgEl('rect', {
      x: i * bw + 0.5, y: y(v), width: bw - 1, height: h - y(v),
      fill: i === values.length - 1 ? C.accent : C.muted,
    }));
  });
  return s;
}

/** Win/loss tristate sparkline: up/down/flat ticks on a center line. */
function sparkWinLoss(values, { w = 110, h = 20 } = {}) {
  const s = svg(w, h, 'spark');
  const bw = w / values.length, mid = h / 2;
  values.forEach((v, i) => {
    const x = i * bw + 0.5, bwi = bw - 1;
    if (v === 0) {
      s.appendChild(svgEl('rect', { x, y: mid - 1, width: bwi, height: 2, fill: C.muted }));
    } else {
      const up = v > 0;
      s.appendChild(svgEl('rect', {
        x, y: up ? 2 : mid, width: bwi, height: mid - 2,
        fill: up ? C.ink : C.accent,
      }));
    }
  });
  return s;
}

function buildSparklines(mount) {
  // (a) sparklines woven into a sentence — "data words"
  const p1 = document.createElement('p');
  p1.append('Fasting glucose drifted up over sixteen readings ');
  p1.append(sparkLine(DATA.spark.glucose));
  p1.append(` (last ${DATA.spark.glucose.at(-1)} mg/dL), while quarterly revenue `);
  p1.append(sparkBar(DATA.spark.revenue));
  p1.append(' climbed steadily and the trading desk ran ');
  p1.append(sparkWinLoss(DATA.spark.trades));
  p1.append(' nine up days to five down.');
  mount.appendChild(p1);
  // attach tooltips (dense chart — hover gives the exact series)
  [...p1.querySelectorAll('svg.spark')].forEach((el, k) => {
    const names = ['glucose mg/dL', 'revenue ($M)', 'win/loss run'];
    hoverable(el, () => names[k]);
  });

  // (b) the same sparkline form inside a table row — a "dataword" column
  const table = document.createElement('table');
  table.className = 'datawords';
  table.innerHTML = '<thead><tr><th>Region</th><th>Trend (10 mo)</th><th class="num">Latest</th></tr></thead>';
  const tb = document.createElement('tbody');
  for (const r of DATA.spark.rows) {
    const tr = document.createElement('tr');
    const td0 = document.createElement('td'); td0.textContent = r.name;
    const td1 = document.createElement('td'); td1.appendChild(sparkLine(r.series, { w: 120 }));
    const td2 = document.createElement('td'); td2.className = 'num'; td2.textContent = r.last;
    hoverable(td1.firstChild, () => `${r.name}: ${r.series.join(', ')}`);
    tr.append(td0, td1, td2);
    tb.appendChild(tr);
  }
  table.appendChild(tb);
  mount.appendChild(table);
}

/* --- #2 Slopegraph ------------------------------------------------------- */

function buildSlopegraph(mount) {
  const { items, leftLabel, rightLabel, unit } = DATA.slope;
  const W = 460, H = 460, padT = 40, padB = 24, leftX = 150, rightX = 310;
  const [lo, hi] = extent([...items.map((d) => d.a), ...items.map((d) => d.b)]);
  const y = scaleLinear([lo - 4, hi + 4], [H - padB, padT]);
  const s = svg(W, H);

  // column headers
  s.appendChild(directLabel(leftX, padT - 22, leftLabel, { anchor: 'end', cls: 'label muted' }));
  s.appendChild(directLabel(rightX, padT - 22, rightLabel, { anchor: 'start', cls: 'label muted' }));

  for (const d of items) {
    const ya = y(d.a), yb = y(d.b);
    const rising = d.b >= d.a;
    // one quiet palette: declines get the accent, everything else stays muted
    const stroke = rising ? C.muted : C.accent;
    s.appendChild(svgEl('line', { x1: leftX, y1: ya, x2: rightX, y2: yb, stroke, 'stroke-width': 1.2 }));
    s.appendChild(svgEl('circle', { cx: leftX, cy: ya, r: 2, fill: stroke }));
    s.appendChild(svgEl('circle', { cx: rightX, cy: yb, r: 2, fill: stroke }));
    // direct labels at BOTH ends — no legend
    s.appendChild(directLabel(leftX - 8, ya, `${d.name}  ${d.a}`, { anchor: 'end' }));
    s.appendChild(directLabel(rightX + 8, yb, `${d.b}${unit}  ${d.name}`, { anchor: 'start' }));
  }
  mount.appendChild(s);
}

/* --- #3 Small multiples -------------------------------------------------- */

function buildSmallMultiples(mount) {
  const panels = DATA.multiples;
  // shared y-scale across all nine panels — the whole point of small multiples
  const [lo, hi] = extent(panels.flatMap((p) => p.series), (d) => d.v);
  const grid = document.createElement('div');
  grid.className = 'small-multiples';

  panels.forEach((panel, idx) => {
    const W = 150, H = 92, padL = 4, padR = 8, padT = 16, padB = 14;
    const x = scaleLinear([0, 11], [padL, W - padR]);
    const y = scaleLinear([lo, hi], [H - padB, padT]);
    const s = svg(W, H);
    const pts = panel.series.map((d) => ({ x: x(d.m), y: y(d.v) }));

    // only the FIRST panel carries the y axis; the rest inherit the scale
    if (idx === 0) {
      s.appendChild(rangeFrameAxis(y, {
        orient: 'left', pos: padL, ticks: [lo, hi],
        format: (v) => round(v), tickLen: 3,
      }));
    }
    s.appendChild(svgEl('path', { d: path(pts), class: 'series' }));
    const end = pts.at(-1);
    s.appendChild(svgEl('circle', { cx: end.x, cy: end.y, r: 1.8, fill: C.accent }));
    s.appendChild(svgEl('text', { x: padL, y: 10, class: 'panel-title', text: panel.name }));
    grid.appendChild(s);
  });
  mount.appendChild(grid);
}

/* --- #4 Tufte minimal boxplot -------------------------------------------- */

function buildBoxplot(mount) {
  const groups = DATA.box;
  const W = 460, H = 300, padL = 40, padR = 20, padT = 20, padB = 36;
  const [lo, hi] = extent(groups.flatMap((g) => [g.min, g.max]));
  const y = scaleLinear([lo - 3, hi + 3], [H - padB, padT]);
  const x = scaleLinear([0, groups.length - 1], [padL + 30, W - padR - 30]);
  const s = svg(W, H);

  // a quiet left axis spanning the data range
  s.appendChild(rangeFrameAxis(y, { orient: 'left', pos: padL, ticks: [lo, Math.round((lo + hi) / 2), hi] }));

  groups.forEach((g, i) => {
    const cx = x(i);
    // NO box. Whiskers are two thin line segments with a gap; the median is a
    // dot offset slightly into that gap. The erased box IS the technique.
    s.appendChild(svgEl('line', { x1: cx, y1: y(g.min), x2: cx, y2: y(g.q1), class: 'series-muted' }));
    s.appendChild(svgEl('line', { x1: cx, y1: y(g.q3), x2: cx, y2: y(g.max), class: 'series-muted' }));
    // median dot, offset right so the eye reads center-of-distribution
    s.appendChild(svgEl('circle', { cx: cx + 3, cy: y(g.med), r: 2.6, class: 'mark' }));
    // group label below
    s.appendChild(svgEl('text', { x: cx, y: H - padB + 16, 'text-anchor': 'middle', class: 'label', text: g.group }));
  });
  mount.appendChild(s);
}

/* --- #5 Dot-dash scatter ------------------------------------------------- */

function buildDotDash(mount) {
  const pts = DATA.scatter;
  const W = 460, H = 360, padL = 46, padR = 22, padT = 18, padB = 40;
  const [xlo, xhi] = extent(pts, (d) => d.x);
  const [ylo, yhi] = extent(pts, (d) => d.y);
  const x = scaleLinear([xlo, xhi], [padL, W - padR]);
  const y = scaleLinear([ylo, yhi], [H - padB, padT]);
  const s = svg(W, H);

  // range-frame axes: lines span only the data extent, ticks at min & max
  s.appendChild(rangeFrameAxis(x, { orient: 'bottom', pos: H - padB, ticks: [xlo, xhi], format: (v) => round(v, 1) }));
  s.appendChild(rangeFrameAxis(y, { orient: 'left',   pos: padL,     ticks: [ylo, yhi], format: (v) => round(v) }));

  // the dot-dash: a marginal rug on each axis carries the 1-D distributions
  s.appendChild(marginalTicks(pts.map((d) => d.x), x, { orient: 'bottom', pos: H - padB, len: 6 }));
  s.appendChild(marginalTicks(pts.map((d) => d.y), y, { orient: 'left',   pos: padL,     len: 6 }));

  for (const d of pts) s.appendChild(svgEl('circle', { cx: x(d.x), cy: y(d.y), r: 2.2, class: 'mark' }));

  s.appendChild(directLabel(W - padR, H - padB + 24, 'height (cm)', { anchor: 'end', cls: 'label muted' }));
  s.appendChild(svgEl('text', { x: padL - 34, y: padT + 4, class: 'label muted', text: 'reaction (ms)' }));
  mount.appendChild(s);
}

/* --- #6 Range-frame line chart ------------------------------------------- */

function buildRangeLine(mount) {
  const d = DATA.line;
  const W = 560, H = 280, padL = 44, padR = 40, padT = 18, padB = 34;
  const [tlo, thi] = extent(d, (p) => p.t);
  const [vlo, vhi] = extent(d, (p) => p.v);
  const x = scaleLinear([tlo, thi], [padL, W - padR]);
  const y = scaleLinear([vlo, vhi], [H - padB, padT]);
  const s = svg(W, H, 'wide');
  const last = d.at(-1);

  // the frame reports the data: x spans [first,last], y spans [min,max],
  // y-ticks at min, max AND the last value (so the latest reading is legible)
  s.appendChild(rangeFrameAxis(x, { orient: 'bottom', pos: H - padB, ticks: [tlo, thi], format: (v) => `day ${v}` }));
  s.appendChild(rangeFrameAxis(y, {
    orient: 'left', pos: padL,
    ticks: [vlo, vhi, last.v].sort((a, b) => a - b),
    format: (v) => round(v),
  }));

  s.appendChild(svgEl('path', { d: path(d.map((p) => ({ x: x(p.t), y: y(p.v) }))), class: 'series' }));
  // end dot + direct label of the latest value, in the right margin
  s.appendChild(svgEl('circle', { cx: x(last.t), cy: y(last.v), r: 2.4, class: 'mark-accent' }));
  s.appendChild(directLabel(x(last.t) + 6, y(last.v), `${round(last.v)}`, { anchor: 'start', cls: 'label accent' }));
  mount.appendChild(s);
}

/* --- #7 Cleveland dot plot ----------------------------------------------- */

function buildDotPlot(mount) {
  const rows = [...DATA.dotplot].sort((a, b) => b.v - a.v); // sort for readability
  const W = 460, H = 28 * rows.length + 50, padL = 130, padR = 50, padT = 16, padB = 28;
  const [lo, hi] = extent(rows, (d) => d.v);
  const x = scaleLinear([0, hi], [padL, W - padR]);
  const rowY = (i) => padT + i * 28 + 6;
  const s = svg(W, H);

  // common x-scale, range-framed at bottom
  s.appendChild(rangeFrameAxis(x, { orient: 'bottom', pos: H - padB, ticks: [0, Math.round(hi / 2), hi] }));

  rows.forEach((d, i) => {
    const y = rowY(i);
    // faint dotted connector from the label to the dot — guides the eye, low ink
    s.appendChild(svgEl('line', { x1: padL, y1: y, x2: x(d.v), y2: y, stroke: C.rule, 'stroke-width': 1, 'stroke-dasharray': '1 3' }));
    s.appendChild(svgEl('circle', { cx: x(d.v), cy: y, r: 3, class: 'mark' }));
    s.appendChild(directLabel(padL - 10, y, d.cat, { anchor: 'end' }));
    s.appendChild(directLabel(x(d.v) + 8, y, `${d.v}`, { anchor: 'start', cls: 'value' }));
  });
  s.appendChild(directLabel(W - padR, H - padB + 24, 'kWh / year', { anchor: 'end', cls: 'label muted' }));
  mount.appendChild(s);
}

/* --- #8 Candlestick + volume (shared x-axis) ----------------------------- */

function buildCandles(mount) {
  const d = DATA.ohlc;
  const W = 560, padL = 44, padR = 16;
  const priceH = 220, volH = 70, gap = 10;
  const H = priceH + gap + volH + 28;
  const x = scaleLinear([-0.5, d.length - 0.5], [padL, W - padR]);
  const bw = (x(1) - x(0)) * 0.6;
  const [plo, phi] = extent(d.flatMap((c) => [c.low, c.high]));
  const yP = scaleLinear([plo, phi], [priceH, 12]);
  const yV = scaleLinear([0, extent(d, (c) => c.vol)[1]], [priceH + gap + volH, priceH + gap]);
  const s = svg(W, H, 'wide');

  // price axis (range frame) + one shared bottom x axis under the volume panel
  s.appendChild(rangeFrameAxis(yP, { orient: 'left', pos: padL, ticks: [plo, round((plo + phi) / 2, 1), phi], format: (v) => round(v, 1) }));
  s.appendChild(rangeFrameAxis(x, { orient: 'bottom', pos: H - 16, ticks: [0, d.length - 1], format: (i) => `day ${i + 1}` }));

  for (const c of d) {
    const cx = x(c.i), up = c.close >= c.open;
    // OHLC candle: thin high-low wick, body open..close.
    // up days hollow (paper fill), down days filled accent — quiet 2-state code
    s.appendChild(svgEl('line', { x1: cx, y1: yP(c.high), x2: cx, y2: yP(c.low), stroke: up ? C.ink : C.accent, 'stroke-width': 1 }));
    const bodyTop = yP(Math.max(c.open, c.close)), bodyBot = yP(Math.min(c.open, c.close));
    s.appendChild(svgEl('rect', {
      x: cx - bw / 2, y: bodyTop, width: bw, height: Math.max(1, bodyBot - bodyTop),
      fill: up ? C.paper : C.accent, stroke: up ? C.ink : C.accent, 'stroke-width': 1,
    }));
    // volume bar in the lower panel, sharing cx
    s.appendChild(svgEl('rect', { x: cx - bw / 2, y: yV(c.vol), width: bw, height: (priceH + gap + volH) - yV(c.vol), fill: C.muted, opacity: 0.55 }));
  }
  s.appendChild(svgEl('text', { x: padL, y: priceH + gap + 1, class: 'label muted', text: 'volume' }));
  mount.appendChild(s);
}

/* --- #9 Tear-sheet mini-dashboard ---------------------------------------- */

function buildTearSheet(mount) {
  const { daily, years, monthly } = DATA.tear;
  // derive cumulative wealth + drawdown from the daily stream
  const cum = []; let w = 1;
  for (const r of daily) { w *= (1 + r); cum.push(w); }
  let peak = -Infinity; const dd = cum.map((c) => { peak = Math.max(peak, c); return c / peak - 1; });

  const grid = document.createElement('div');
  grid.className = 'tear-sheet';

  /* panel A — cumulative returns line (range-frame) */
  const a = document.createElement('div');
  a.innerHTML = '<p class="panel-label">Cumulative return</p>';
  {
    const W = 250, H = 110, padL = 34, padR = 8, padT = 8, padB = 16;
    const x = scaleLinear([0, cum.length - 1], [padL, W - padR]);
    const [lo, hi] = extent(cum);
    const y = scaleLinear([lo, hi], [H - padB, padT]);
    const s = svg(W, H);
    s.appendChild(rangeFrameAxis(y, { orient: 'left', pos: padL, ticks: [lo, hi], format: (v) => `${round((v - 1) * 100)}%` }));
    s.appendChild(svgEl('path', { d: path(cum.map((c, i) => ({ x: x(i), y: y(c) }))), class: 'series' }));
    a.appendChild(s);
  }

  /* panel B — drawdown area (always <= 0) */
  const b = document.createElement('div');
  b.innerHTML = '<p class="panel-label">Drawdown</p>';
  {
    const W = 250, H = 110, padL = 34, padR = 8, padT = 8, padB = 16;
    const x = scaleLinear([0, dd.length - 1], [padL, W - padR]);
    const [lo] = extent(dd);
    const y = scaleLinear([lo, 0], [H - padB, padT]);
    const s = svg(W, H);
    s.appendChild(rangeFrameAxis(y, { orient: 'left', pos: padL, ticks: [lo, 0], format: (v) => `${round(v * 100)}%` }));
    const area = dd.map((c, i) => ({ x: x(i), y: y(c) }));
    area.push({ x: x(dd.length - 1), y: y(0) }, { x: x(0), y: y(0) });
    s.appendChild(svgEl('path', { d: path(area, { close: true }), fill: C.accent, opacity: 0.18, stroke: 'none' }));
    s.appendChild(svgEl('path', { d: path(dd.map((c, i) => ({ x: x(i), y: y(c) }))), stroke: C.accent, 'stroke-width': 1, fill: 'none' }));
    b.appendChild(s);
  }

  /* panel C — monthly-returns heatmap (years x months), full width */
  const c = document.createElement('div');
  c.className = 'full';
  c.innerHTML = '<p class="panel-label">Monthly returns</p>';
  {
    const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
    const cell = 34, padL = 40, padT = 16;
    const W = padL + months.length * cell + 4, H = padT + years.length * cell + 6;
    const s = svg(W, H);
    const all = monthly.flat();
    const mAbs = Math.max(...all.map(Math.abs)) || 1;       // diverging scale
    months.forEach((m, j) => s.appendChild(svgEl('text', { x: padL + j * cell + cell / 2, y: padT - 4, 'text-anchor': 'middle', class: 'tick', text: m })));
    years.forEach((yr, r) => {
      s.appendChild(svgEl('text', { x: padL - 6, y: padT + r * cell + cell / 2 + 4, 'text-anchor': 'end', class: 'tick', text: yr }));
      monthly[r].forEach((val, j) => {
        // diverging: losses brick, gains ink — lightness scaled by |return|
        const t = Math.abs(val) / mAbs;
        const fill = divergingColor(val, t);
        const rect = svgEl('rect', { x: padL + j * cell, y: padT + r * cell, width: cell - 2, height: cell - 2, fill, class: 'hot' });
        hoverable(rect, () => `${months[j]} ${yr}: ${round(val * 100, 1)}%`);
        s.appendChild(rect);
      });
    });
    c.appendChild(s);
  }

  grid.append(a, b, c);
  mount.appendChild(grid);
}

/* --- #10 Forest / interval plot ------------------------------------------ */

function buildForest(mount) {
  const { rows, pooled, ref } = DATA.forest;
  const W = 520, rowH = 30, padL = 150, padR = 60, padT = 16;
  const H = padT + (rows.length + 2) * rowH + 16;
  const all = [...rows, pooled];
  const [lo, hi] = extent(all.flatMap((d) => [d.lo, d.hi]));
  const x = scaleLinear([Math.min(lo, ref) - 0.05, Math.max(hi, ref) + 0.05], [padL, W - padR]);
  const s = svg(W, H, 'wide');

  // reference line at 0 (no effect) — a single quiet vertical
  s.appendChild(svgEl('line', { x1: x(ref), y1: padT, x2: x(ref), y2: H - 26, stroke: C.rule, 'stroke-width': 1 }));
  s.appendChild(svgEl('text', { x: x(ref), y: H - 12, 'text-anchor': 'middle', class: 'tick', text: `no effect (${ref})` }));

  rows.forEach((d, i) => {
    const y = padT + i * rowH + rowH / 2;
    // CI whisker + point estimate; dot area ~ study weight (secondary cue)
    s.appendChild(svgEl('line', { x1: x(d.lo), y1: y, x2: x(d.hi), y2: y, stroke: C.muted, 'stroke-width': 1 }));
    s.appendChild(svgEl('line', { x1: x(d.lo), y1: y - 3, x2: x(d.lo), y2: y + 3, stroke: C.muted }));
    s.appendChild(svgEl('line', { x1: x(d.hi), y1: y - 3, x2: x(d.hi), y2: y + 3, stroke: C.muted }));
    const r = 2.5 + (d.n / 760) * 3.5;
    s.appendChild(svgEl('circle', { cx: x(d.est), cy: y, r, class: 'mark' }));
    s.appendChild(directLabel(padL - 12, y, d.study, { anchor: 'end' }));        // direct label, no legend
    s.appendChild(directLabel(W - padR + 8, y, `${d.est > 0 ? '+' : ''}${d.est.toFixed(2)}`, { anchor: 'start', cls: 'value' }));
  });

  // pooled estimate as a diamond on its own row
  const yp = padT + rows.length * rowH + rowH / 2 + 6;
  const dpts = [
    { x: x(pooled.lo), y: yp }, { x: x(pooled.est), y: yp - 5 },
    { x: x(pooled.hi), y: yp }, { x: x(pooled.est), y: yp + 5 },
  ];
  s.appendChild(svgEl('path', { d: path(dpts, { close: true }), fill: C.accent }));
  s.appendChild(directLabel(padL - 12, yp, 'Pooled (RE)', { anchor: 'end', cls: 'label accent' }));
  s.appendChild(directLabel(W - padR + 8, yp, `${pooled.est.toFixed(2)}`, { anchor: 'start', cls: 'value' }));
  mount.appendChild(s);
}

/* --- #11 Bullet graph ---------------------------------------------------- */

function buildBullet(mount) {
  const items = DATA.bullet;
  const W = 480, rowH = 46, padL = 110, padR = 60, padT = 10;
  const H = padT + items.length * rowH + 8;
  const s = svg(W, H, 'wide');

  items.forEach((d, i) => {
    const yTop = padT + i * rowH, h = 18, ym = yTop + h / 2;
    const x = scaleLinear([0, d.max], [padL, W - padR]);
    // three faint qualitative bands (poor / ok / good), light -> slightly darker
    const shades = ['#eeede8', '#e2e1da', '#d4d3ca'];
    let prev = 0;
    d.bands.forEach((b, k) => {
      s.appendChild(svgEl('rect', { x: x(prev), y: yTop, width: x(b) - x(prev), height: h, fill: shades[k] }));
      prev = b;
    });
    // the measure bar — a thinner ink bar centered in the band
    s.appendChild(svgEl('rect', { x: padL, y: ym - 4, width: x(d.value) - padL, height: 8, fill: C.ink }));
    // target tick — a vertical accent marker
    s.appendChild(svgEl('line', { x1: x(d.target), y1: yTop - 2, x2: x(d.target), y2: yTop + h + 2, stroke: C.accent, 'stroke-width': 2 }));
    // labels: name at left, measured value at right
    s.appendChild(directLabel(padL - 12, ym, d.label, { anchor: 'end' }));
    s.appendChild(directLabel(W - padR + 8, ym, `${d.value}${d.unit}`, { anchor: 'start', cls: 'value' }));
  });
  mount.appendChild(s);
}

/* --- #12 Calendar / matrix heatmap --------------------------------------- */

function buildHeatmap(mount) {
  const { days, weeks, cells } = DATA.heatmap;
  const cell = 22, padL = 36, padT = 18;
  const W = padL + weeks * cell + 4, H = padT + days.length * cell + 8;
  const s = svg(W, H, 'wide');
  const vmax = extent(cells, (d) => d.v)[1];

  // axis labels (no chart border): weekdays on y, week index on x
  days.forEach((dn, r) => s.appendChild(svgEl('text', { x: padL - 6, y: padT + r * cell + cell / 2 + 4, 'text-anchor': 'end', class: 'tick', text: dn })));
  for (let wk = 0; wk < weeks; wk += 3)
    s.appendChild(svgEl('text', { x: padL + wk * cell + cell / 2, y: padT - 5, 'text-anchor': 'middle', class: 'tick', text: `w${wk + 1}` }));

  for (const cdat of cells) {
    const t = cdat.v / vmax;                         // 0..1 magnitude
    const fill = sequentialColor(t);                  // single-hue lightness ramp
    const rect = svgEl('rect', {
      x: padL + cdat.w * cell, y: padT + cdat.d * cell, width: cell - 2, height: cell - 2,
      fill, class: 'hot',
    });
    hoverable(rect, () => `${cdat.day}, week ${cdat.w + 1}: ${cdat.v}`);
    s.appendChild(rect);
  }
  mount.appendChild(s);
}

/* ===========================================================================
   Group A — Dense / multivariate (#13–16): pack maximum data per pixel.
   =========================================================================== */

/* --- #13 Horizon chart --------------------------------------------------- */

function buildHorizon(mount) {
  const series = DATA.horizon;
  const W = 560, padL = 56, padR = 40, rowH = 20, gap = 3, padT = 6;
  const H = padT + series.length * (rowH + gap) + 6;
  const s = svg(W, H, 'wide');
  const n = series[0].pts.length;
  const x = scaleLinear([0, n - 1], [padL, W - padR]);

  // one shared band step across all series so intensity is comparable
  const maxAbs = Math.max(...series.flatMap((ser) => ser.pts.map((p) => Math.abs(p.v))));
  const bands = 3, step = maxAbs / bands;
  // positive -> 3 grays (light→dark); negative folded up -> 3 bricks (light→dark)
  const posShades = ['#dfe1dd', '#9aa09a', '#3f463f'];
  const negShades = ['#e7c6bf', '#cf7561', '#8f2615'];

  series.forEach((ser, i) => {
    const top = padT + i * (rowH + gap);
    const base = top + rowH;                 // baseline (zero) at the row's bottom
    // each band k is the slab of value between k·step and (k+1)·step, drawn from
    // the baseline up and scaled to the full row height — darker bands sit on
    // top, so a tall peak shows nested darker shapes. This is the horizon fold.
    const layer = (signFn, shade, k) => {
      const top_ = ser.pts.map((p) => {
        const h = Math.max(0, Math.min(step, signFn(p.v) - k * step)) / step * rowH;
        return { x: x(p.t), y: base - h };
      });
      const area = [{ x: x(0), y: base }, ...top_, { x: x(n - 1), y: base }];
      s.appendChild(svgEl('path', { d: path(area, { close: true }), fill: shade, stroke: 'none' }));
    };
    for (let k = 0; k < bands; k++) {
      layer((v) => v, posShades[k], k);        // positive slabs
      layer((v) => -v, negShades[k], k);       // negative slabs (folded up, accent)
    }
    s.appendChild(svgEl('line', { x1: padL, y1: base, x2: W - padR, y2: base, stroke: C.rule, 'stroke-width': 0.5 }));
    s.appendChild(directLabel(padL - 8, top + rowH / 2, ser.name, { anchor: 'end', cls: 'label-sm' }));

    // dense chart: a transparent hit-rect gives a per-series hover read-out
    const peak = Math.max(...ser.pts.map((p) => p.v)), trough = Math.min(...ser.pts.map((p) => p.v));
    const hit = svgEl('rect', { x: padL, y: top, width: W - padR - padL, height: rowH, fill: 'transparent' });
    hoverable(hit, () => `${ser.name}: peak +${round(peak, 2)}, trough ${round(trough, 2)}`);
    s.appendChild(hit);
  });
  mount.appendChild(s);
}

/* --- #14 Scatterplot matrix (SPLOM) -------------------------------------- */

function buildSplom(mount) {
  const { vars, rows } = DATA.splom;
  const n = vars.length;                       // 4 variables -> 4×4 grid
  const cell = 104, padL = 46, padT = 14, inset = 11;
  const W = padL + n * cell + 8, H = padT + n * cell + 26;
  const s = svg(W, H, 'wide');
  const ext = {}; vars.forEach((v) => (ext[v] = extent(rows, (r) => r[v])));

  // faint cell-divider rules so the matrix grid reads (low ink, not a frame)
  for (let k = 0; k <= n; k++) {
    s.appendChild(svgEl('line', { x1: padL + k * cell, y1: padT, x2: padL + k * cell, y2: padT + n * cell, stroke: C.rule, 'stroke-width': 1, opacity: 0.5 }));
    s.appendChild(svgEl('line', { x1: padL, y1: padT + k * cell, x2: padL + n * cell, y2: padT + k * cell, stroke: C.rule, 'stroke-width': 1, opacity: 0.5 }));
  }

  for (let i = 0; i < n; i++) {                 // row -> y variable
    for (let j = 0; j < n; j++) {               // col -> x variable
      const cx0 = padL + j * cell, cy0 = padT + i * cell;
      if (i === j) {
        // diagonal: variable name + a tiny histogram of that variable
        const v = vars[i];
        s.appendChild(svgEl('text', { x: cx0 + cell / 2, y: cy0 + 16, 'text-anchor': 'middle', class: 'label', text: v }));
        const binN = 9, [lo, hi] = ext[v], counts = new Array(binN).fill(0);
        for (const r of rows) { let b = Math.floor((r[v] - lo) / ((hi - lo) || 1) * binN); b = Math.max(0, Math.min(binN - 1, b)); counts[b]++; }
        const cmax = Math.max(...counts);
        const hx = scaleLinear([0, binN], [cx0 + inset, cx0 + cell - inset]);
        const hy = scaleLinear([0, cmax], [cy0 + cell - inset, cy0 + cell / 2 + 6]);
        counts.forEach((c, b) => s.appendChild(svgEl('rect', { x: hx(b) + 0.5, y: hy(c), width: hx(1) - hx(0) - 1, height: hy(0) - hy(c), fill: C.rule })));
      } else {
        // off-diagonal: tiny scatter of var[j] (x) vs var[i] (y)
        const vx = vars[j], vy = vars[i];
        const sx = scaleLinear(ext[vx], [cx0 + inset, cx0 + cell - inset]);
        const sy = scaleLinear(ext[vy], [cy0 + cell - inset, cy0 + inset]);
        for (const r of rows) s.appendChild(svgEl('circle', { cx: sx(r[vx]), cy: sy(r[vy]), r: 2.2, fill: C.muted, opacity: 0.8 }));
      }
    }
  }
  // ticks ONLY on the outer edge — left column (y min/max) and bottom row (x min/max)
  for (let i = 0; i < n; i++) {
    const cy0 = padT + i * cell, [lo, hi] = ext[vars[i]];
    s.appendChild(svgEl('text', { x: padL - 6, y: cy0 + inset + 3, 'text-anchor': 'end', class: 'tick', text: round(hi) }));
    s.appendChild(svgEl('text', { x: padL - 6, y: cy0 + cell - inset + 3, 'text-anchor': 'end', class: 'tick', text: round(lo) }));
  }
  for (let j = 0; j < n; j++) {
    const cx0 = padL + j * cell, [lo, hi] = ext[vars[j]], yb = padT + n * cell + 12;
    // anchor each edge label inward (lo grows right, hi grows left) so adjacent
    // cells' numbers never collide; the small font keeps them clear of dividers
    s.appendChild(svgEl('text', { x: cx0 + inset, y: yb, 'text-anchor': 'start', class: 'tick-sm', text: round(lo) }));
    s.appendChild(svgEl('text', { x: cx0 + cell - inset, y: yb, 'text-anchor': 'end', class: 'tick-sm', text: round(hi) }));
  }
  mount.appendChild(s);
  // a one-line "how to read" note under the matrix
  const note = document.createElement('p');
  note.className = 'read-note';
  note.textContent = 'How to read: the diagonal names each variable (with its distribution); '
    + 'every other cell plots its column-variable on x against its row-variable on y; '
    + 'the min/max numbers sit on the outer edge.';
  mount.appendChild(note);
}

/* --- #15 Parallel coordinates -------------------------------------------- */

function buildParcoords(mount) {
  const { dims, rows } = DATA.parcoords;
  const W = 580, H = 300, padL = 46, padR = 46, padT = 30, padB = 24;
  const s = svg(W, H, 'wide');
  const axX = dims.map((_, i) => padL + i * ((W - padL - padR) / (dims.length - 1)));
  const sc = {}; dims.forEach((d) => (sc[d] = scaleLinear(extent(rows, (r) => r[d]), [H - padB, padT])));

  // records as thin, low-opacity polylines — density reads through overplotting
  for (const r of rows) {
    const poly = svgEl('path', {
      d: path(dims.map((d, i) => ({ x: axX[i], y: sc[d](r[d]) }))),
      fill: 'none', stroke: C.ink, 'stroke-width': 0.8, opacity: 0.22,
    });
    poly.style.cursor = 'crosshair';
    // hover brings a single record forward in the accent (not a 'hot' class —
    // CSS :hover would otherwise override the accent stroke)
    poly.addEventListener('mouseenter', () => { poly.setAttribute('stroke', C.accent); poly.setAttribute('opacity', '0.95'); poly.setAttribute('stroke-width', '1.5'); });
    poly.addEventListener('mousemove', (e) => tooltip.show(dims.map((d) => `${d} ${r[d]}`).join('  ·  '), e));
    poly.addEventListener('mouseleave', () => { poly.setAttribute('stroke', C.ink); poly.setAttribute('opacity', '0.22'); poly.setAttribute('stroke-width', '0.8'); tooltip.hide(); });
    s.appendChild(poly);
  }
  // axes: a vertical range-frame per dimension, label on top, min/max ticks
  dims.forEach((d, i) => {
    s.appendChild(svgEl('line', { class: 'range-frame', x1: axX[i], y1: padT, x2: axX[i], y2: H - padB }));
    s.appendChild(svgEl('text', { x: axX[i], y: padT - 10, 'text-anchor': 'middle', class: 'label', text: d }));
    const [lo, hi] = extent(rows, (r) => r[d]);
    s.appendChild(svgEl('text', { x: axX[i] + 4, y: padT + 3, class: 'tick', text: round(hi) }));
    s.appendChild(svgEl('text', { x: axX[i] + 4, y: H - padB, class: 'tick', text: round(lo) }));
  });
  mount.appendChild(s);
}

/* --- #16 Cycle plot (seasonal subseries) --------------------------------- */

function buildCyclePlot(mount) {
  const { months, years, data } = DATA.cycle;
  const W = 580, H = 240, padL = 40, padR = 16, padT = 16, padB = 28;
  const s = svg(W, H, 'wide');
  const [lo, hi] = extent(data.flatMap((m) => m.series.map((p) => p.v)));
  const y = scaleLinear([lo - 4, hi + 4], [H - padB, padT]);
  const slotW = (W - padL - padR) / months.length, innerPad = slotW * 0.18;

  s.appendChild(rangeFrameAxis(y, { orient: 'left', pos: padL, ticks: [lo, round((lo + hi) / 2), hi], format: (v) => round(v) }));
  data.forEach((m, mi) => {
    const x0 = padL + mi * slotW + innerPad, x1 = padL + (mi + 1) * slotW - innerPad;
    const xs = scaleLinear([0, years.length - 1], [x0, x1]);
    // faint within-month mean reference (the seasonal level for this month)
    const mean = m.series.reduce((a, p) => a + p.v, 0) / m.series.length;
    s.appendChild(svgEl('line', { x1: x0, y1: y(mean), x2: x1, y2: y(mean), stroke: C.rule, 'stroke-width': 1 }));
    // the within-month subseries: value across the four years (its slope = trend)
    const pts = m.series.map((p, k) => ({ x: xs(k), y: y(p.v) }));
    s.appendChild(svgEl('path', { d: path(pts), class: 'series' }));
    s.appendChild(svgEl('circle', { cx: pts.at(-1).x, cy: pts.at(-1).y, r: 1.6, fill: C.accent }));
    s.appendChild(svgEl('text', { x: (x0 + x1) / 2, y: H - padB + 15, 'text-anchor': 'middle', class: 'tick', text: m.month }));
  });
  mount.appendChild(s);
}

/* ===========================================================================
   Group B — Perception, used honestly (#17–20): perception to clarify the
   TRUE signal, never to distort it. Color rationale defers to the foundation
   skill graphical-perception-and-color.
   =========================================================================== */

/* --- #17 Preattentive pop-out -------------------------------------------- */

function buildPopout(mount) {
  const { cols, rows, pts } = DATA.popout;
  const W = 460, H = 280, padL = 22, padR = 96, padT = 24, padB = 24;
  const s = svg(W, H);
  const x = scaleLinear([-0.5, cols - 0.5], [padL, W - padR]);
  const y = scaleLinear([-0.5, rows - 0.5], [padT, H - padB]);
  const px = pts.map((p) => ({ ...p, cx: x(p.x), cy: y(p.y) }));

  // a field of identical muted open marks; one accent-filled mark is found
  // before conscious search — hue is the single preattentive channel at work
  for (const p of px) if (!p.key) s.appendChild(svgEl('circle', { cx: p.cx, cy: p.cy, r: 4, fill: 'none', stroke: C.muted, 'stroke-width': 1 }));
  const key = px.find((p) => p.key);
  s.appendChild(svgEl('circle', { cx: key.cx, cy: key.cy, r: 6, fill: C.accent }));

  // give the label a CLEAR ZONE: try right / left / above / below and take the
  // first placement that stays on-canvas and overlaps no other mark (so it
  // flips off the right edge instead of running into a neighbor)
  const lw = key.label.length * 6.3, lh = 12, r = 6, others = px.filter((p) => !p.key);
  const cand = [
    { anchor: 'start',  tx: key.cx + 11, ty: key.cy + 4,      box: [key.cx + 11, key.cy - 7, key.cx + 11 + lw, key.cy + 7] },
    { anchor: 'end',    tx: key.cx - 11, ty: key.cy + 4,      box: [key.cx - 11 - lw, key.cy - 7, key.cx - 11, key.cy + 7] },
    { anchor: 'middle', tx: key.cx,      ty: key.cy - r - 8,  box: [key.cx - lw / 2, key.cy - r - 8 - lh, key.cx + lw / 2, key.cy - r - 8] },
    { anchor: 'middle', tx: key.cx,      ty: key.cy + r + 16, box: [key.cx - lw / 2, key.cy + r + 4, key.cx + lw / 2, key.cy + r + 16] },
  ];
  const onCanvas = (b) => b[0] >= 4 && b[2] <= W - 4 && b[1] >= 4 && b[3] <= H - 4;
  const clear = (b) => others.every((p) => !(p.cx >= b[0] - 5 && p.cx <= b[2] + 5 && p.cy >= b[1] - 5 && p.cy <= b[3] + 5));
  const pick = cand.find((c) => onCanvas(c.box) && clear(c.box)) || cand[0];
  s.appendChild(svgEl('text', { x: pick.tx, y: pick.ty, 'text-anchor': pick.anchor, class: 'label accent', text: key.label }));
  mount.appendChild(s);
}

/* --- #18 Reference band -------------------------------------------------- */

function buildReferenceBand(mount) {
  const { pts, lo: blo, hi: bhi, label } = DATA.refband;
  const W = 580, H = 240, padL = 42, padR = 40, padT = 16, padB = 28;
  const s = svg(W, H, 'wide');
  const [tlo, thi] = extent(pts, (p) => p.t);
  const [vlo, vhi] = extent(pts, (p) => p.v);
  const x = scaleLinear([tlo, thi], [padL, W - padR]);
  const y = scaleLinear([Math.min(vlo, blo), Math.max(vhi, bhi)], [H - padB, padT]);
  const outside = (v) => v < blo || v > bhi;

  // the shaded "normal range" — the reference the eye compares against
  s.appendChild(svgEl('rect', { x: padL, y: y(bhi), width: (W - padR) - padL, height: y(blo) - y(bhi), fill: C.rule, opacity: 0.5 }));
  s.appendChild(directLabel(W - padR - 2, y(bhi) - 4, label, { anchor: 'end', cls: 'tick' }));
  // line muted inside the band; segments touching a deviation drawn in accent
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1], acc = outside(a.v) || outside(b.v);
    s.appendChild(svgEl('line', { x1: x(a.t), y1: y(a.v), x2: x(b.t), y2: y(b.v), stroke: acc ? C.accent : C.muted, 'stroke-width': acc ? 1.6 : 1 }));
  }
  for (const p of pts) if (outside(p.v)) s.appendChild(svgEl('circle', { cx: x(p.t), cy: y(p.v), r: 2.2, fill: C.accent }));
  s.appendChild(rangeFrameAxis(y, { orient: 'left', pos: padL, ticks: [Math.min(vlo, blo), blo, bhi, Math.max(vhi, bhi)].sort((p, q) => p - q), format: (v) => round(v) }));
  mount.appendChild(s);
}

/* --- #19 Gestalt grouping ------------------------------------------------ */

function buildGestalt(mount) {
  const groups = DATA.gestalt;
  const W = 460, H = 320, padL = 20, padR = 20, padT = 24, padB = 20;
  const s = svg(W, H);
  const x = scaleLinear([0, 1], [padL, W - padR]);
  const y = scaleLinear([0, 1], [H - padB, padT]);
  for (const g of groups) {
    const xs = g.pts.map((p) => p.x), ys = g.pts.map((p) => p.y);
    const cx = xs.reduce((a, b) => a + b, 0) / xs.length, cy = ys.reduce((a, b) => a + b, 0) / ys.length;
    const rxPix = (Math.max(...xs) - Math.min(...xs)) / 2 * (W - padR - padL) + 14;
    const ryPix = (Math.max(...ys) - Math.min(...ys)) / 2 * (H - padB - padT) + 14;
    // a faint shared tone behind each cluster — but the grouping is carried by
    // proximity; every point is the same ink, so closeness alone reads as a set
    s.appendChild(svgEl('ellipse', { cx: x(cx), cy: y(cy), rx: rxPix, ry: ryPix, fill: C.rule, opacity: 0.35 }));
    for (const p of g.pts) s.appendChild(svgEl('circle', { cx: x(p.x), cy: y(p.y), r: 3, fill: C.ink }));
    s.appendChild(directLabel(x(cx), y(Math.max(...ys)) - 16, g.name, { anchor: 'middle', cls: 'label muted' }));
  }
  mount.appendChild(s);
}

/* --- #20 Figure-ground baseline coloring --------------------------------- */

function buildFigureGround(mount) {
  const d = DATA.figureground;
  const W = 580, H = 220, padL = 40, padR = 24, padT = 16, padB = 24;
  const s = svg(W, H, 'wide');
  const [tlo, thi] = extent(d, (p) => p.t);
  const m = Math.max(...d.map((p) => Math.abs(p.v)));
  const x = scaleLinear([tlo, thi], [padL, W - padR]);
  const y = scaleLinear([-m, m], [H - padB, padT]);
  const y0 = y(0);

  // fill the area between curve and the zero baseline: above-zero in ink,
  // below-zero in accent. Sign becomes figure-ground; crossings are obvious.
  const addQuad = (p, q) => {
    const ink = (p.v + q.v) >= 0;
    const poly = [{ x: p.x, y: y0 }, { x: p.x, y: p.y }, { x: q.x, y: q.y }, { x: q.x, y: y0 }];
    s.appendChild(svgEl('path', { d: path(poly, { close: true }), fill: ink ? C.ink : C.accent, stroke: 'none', opacity: 0.92 }));
  };
  for (let i = 0; i < d.length - 1; i++) {
    const a = { x: x(d[i].t), v: d[i].v, y: y(d[i].v) };
    const b = { x: x(d[i + 1].t), v: d[i + 1].v, y: y(d[i + 1].v) };
    if ((a.v < 0) !== (b.v < 0) && a.v !== b.v) {                 // split at zero crossing
      const cx = a.x + (b.x - a.x) * (0 - a.v) / (b.v - a.v);
      const mid = { x: cx, v: 0, y: y0 };
      addQuad(a, mid); addQuad(mid, b);
    } else addQuad(a, b);
  }
  s.appendChild(svgEl('line', { x1: padL, y1: y0, x2: W - padR, y2: y0, stroke: C.ink, 'stroke-width': 1 }));
  s.appendChild(rangeFrameAxis(y, { orient: 'left', pos: padL, ticks: [-m, 0, m], format: (v) => round(v, 1) }));
  s.appendChild(directLabel(W - padR - 2, padT + 8, 'above 0', { anchor: 'end', cls: 'tick' }));
  s.appendChild(directLabel(W - padR - 2, H - padB - 4, 'below 0', { anchor: 'end', cls: 'tick accent' }));
  mount.appendChild(s);
}

/* ===========================================================================
   Group C — Dashboards (#21–25): real-world panels built from the same forms.
   =========================================================================== */

/* --- #21 KPI tile row ---------------------------------------------------- */

function buildKpiRow(mount) {
  const row = document.createElement('div');
  row.className = 'kpi-row';
  for (const k of DATA.kpi) {
    const tile = document.createElement('div');
    tile.className = 'kpi-tile';
    const lab = document.createElement('p'); lab.className = 'kpi-label'; lab.textContent = k.label;
    const num = document.createElement('div'); num.className = 'kpi-num'; num.textContent = k.value;
    tile.append(lab, num, sparkLine(k.series, { w: 124, h: 22 }));
    const up = k.delta >= 0;                         // sign-coded; color rationale -> color skill
    const delta = document.createElement('div');
    delta.className = 'kpi-delta ' + (up ? 'up' : 'down');
    delta.textContent = `${up ? '▲ +' : '▼ '}${k.delta}`;
    tile.appendChild(delta);
    row.appendChild(tile);
  }
  mount.appendChild(row);
}

/* --- #22 Metric small-multiples board ------------------------------------ */

function buildMetricBoard(mount) {
  const panels = DATA.board;
  const [lo, hi] = extent(panels.flatMap((p) => p.series), (d) => d.v); // shared scale
  const grid = document.createElement('div');
  grid.className = 'small-multiples';
  for (const panel of panels) {
    const W = 168, H = 84, padL = 6, padR = 42, padT = 16, padB = 12;
    const x = scaleLinear([0, panel.series.length - 1], [padL, W - padR]);
    const y = scaleLinear([lo, hi], [H - padB, padT]);
    const s = svg(W, H);
    const pts = panel.series.map((d) => ({ x: x(d.t), y: y(d.v) }));
    s.appendChild(svgEl('path', { d: path(pts), class: 'series' }));
    const end = pts.at(-1), lastV = panel.series.at(-1).v;
    s.appendChild(svgEl('circle', { cx: end.x, cy: end.y, r: 1.8, fill: C.accent }));
    s.appendChild(directLabel(end.x + 5, end.y, `${round(lastV)}`, { anchor: 'start', cls: 'value' })); // current value
    s.appendChild(svgEl('text', { x: padL, y: 10, class: 'panel-title', text: panel.name }));
    grid.appendChild(s);
  }
  mount.appendChild(grid);
}

/* --- #23 Bullet / gauge status board ------------------------------------- */

function buildBulletPanel(mount) {
  const items = DATA.status;
  const W = 480, rowH = 44, padL = 110, padR = 66, padT = 10;
  const H = padT + items.length * rowH + 8;
  const s = svg(W, H, 'wide');
  const shades = ['#eeede8', '#e2e1da', '#d4d3ca'];
  items.forEach((d, i) => {
    const yTop = padT + i * rowH, h = 16, ym = yTop + h / 2;
    const x = scaleLinear([0, d.max], [padL, W - padR]);
    let prev = 0;
    d.bands.forEach((b, k) => { s.appendChild(svgEl('rect', { x: x(prev), y: yTop, width: x(b) - x(prev), height: h, fill: shades[k] })); prev = b; });
    s.appendChild(svgEl('rect', { x: padL, y: ym - 4, width: x(d.value) - padL, height: 8, fill: C.ink }));
    s.appendChild(svgEl('line', { x1: x(d.target), y1: yTop - 2, x2: x(d.target), y2: yTop + h + 2, stroke: C.accent, 'stroke-width': 2 }));
    s.appendChild(directLabel(padL - 12, ym, d.label, { anchor: 'end' }));
    s.appendChild(directLabel(W - padR + 8, ym, `${d.value}${d.unit}`, { anchor: 'start', cls: 'value' }));
  });
  mount.appendChild(s);
}

/* --- #24 Tufte data table with inline graphics --------------------------- */

function buildDataTable(mount) {
  const table = document.createElement('table');
  table.className = 'datawords';
  table.innerHTML = '<thead><tr><th>Region</th><th>Latency trend</th><th>Daily load</th><th class="num">p95</th><th class="num">Err&nbsp;%</th></tr></thead>';
  const tb = document.createElement('tbody');
  for (const r of DATA.dataTable) {
    const tr = document.createElement('tr');
    const c0 = document.createElement('td'); c0.textContent = r.name;
    const c1 = document.createElement('td'); c1.appendChild(sparkLine(r.trend, { w: 110 }));
    const c2 = document.createElement('td'); c2.appendChild(sparkBar(r.bars, { w: 80 }));
    const c3 = document.createElement('td'); c3.className = 'num'; c3.textContent = `${r.p95}ms`;
    const c4 = document.createElement('td'); c4.className = 'num'; c4.textContent = r.err;
    tr.append(c0, c1, c2, c3, c4);
    tb.appendChild(tr);
  }
  table.appendChild(tb);
  mount.appendChild(table);
}

/* --- #25 Composite overview ---------------------------------------------- */

function buildOverview(mount) {
  const O = DATA.overview;
  const wrap = document.createElement('div');
  wrap.className = 'overview';

  // headline series (a range-frame line, dashboard-sized)
  const head = document.createElement('div');
  head.innerHTML = '<p class="kpi-label">Revenue &middot; 40 days</p>';
  {
    const W = 320, H = 120, padL = 36, padR = 12, padT = 10, padB = 18;
    const x = scaleLinear([0, O.headline.length - 1], [padL, W - padR]);
    const [lo, hi] = extent(O.headline, (p) => p.v);
    const y = scaleLinear([lo, hi], [H - padB, padT]);
    const s = svg(W, H);
    s.appendChild(rangeFrameAxis(y, { orient: 'left', pos: padL, ticks: [lo, hi], format: (v) => round(v) }));
    s.appendChild(svgEl('path', { d: path(O.headline.map((p) => ({ x: x(p.t), y: y(p.v) }))), class: 'series' }));
    const e = O.headline.at(-1);
    s.appendChild(svgEl('circle', { cx: x(e.t), cy: y(e.v), r: 2.2, fill: C.accent }));
    head.appendChild(s);
  }

  // stat tiles
  const tiles = document.createElement('div');
  tiles.className = 'stat-tiles';
  for (const t of O.tiles) {
    const up = t.delta >= 0;
    const d = document.createElement('div');
    const lab = document.createElement('p'); lab.className = 'kpi-label'; lab.textContent = t.label;
    const num = document.createElement('div'); num.className = 'kpi-num'; num.style.fontSize = '1.3rem'; num.textContent = t.value;
    const del = document.createElement('div'); del.className = 'kpi-delta ' + (up ? 'up' : 'down'); del.textContent = `${up ? '▲ +' : '▼ '}${t.delta}%`;
    d.append(lab, num, del);
    tiles.appendChild(d);
  }

  // activity heatmap (weekday × time-block)
  const heat = document.createElement('div');
  heat.className = 'full';
  heat.innerHTML = '<p class="kpi-label">Activity &middot; weekday &times; time block</p>';
  {
    const cell = 22, padL = 64, padT = 16, cols = O.days.length, rows = O.hours;
    const W = padL + cols * cell + 4, H = padT + rows * cell + 4;
    const s = svg(W, H, 'wide');
    const vmax = extent(O.cells, (c) => c.v)[1];
    O.days.forEach((dn, c) => s.appendChild(svgEl('text', { x: padL + c * cell + cell / 2, y: padT - 4, 'text-anchor': 'middle', class: 'tick-sm', text: dn[0] }))); // single-letter day, no overlap
    for (let h = 0; h < rows; h++) s.appendChild(svgEl('text', { x: padL - 6, y: padT + h * cell + cell / 2 + 3, 'text-anchor': 'end', class: 'tick', text: `${h * 3}:00` }));
    for (const cd of O.cells) {
      const rect = svgEl('rect', { x: padL + cd.d * cell, y: padT + cd.h * cell, width: cell - 2, height: cell - 2, fill: sequentialColor(cd.v / vmax), class: 'hot' });
      hoverable(rect, () => `${cd.day} ${cd.h * 3}:00 — ${cd.v}`);
      s.appendChild(rect);
    }
    heat.appendChild(s);
  }

  wrap.append(head, tiles, heat);
  mount.appendChild(wrap);
}

/* ===========================================================================
   Group E — Finance & risk (#26, #27, #28) and Statistics & ML (#29, #30).
   =========================================================================== */

/* --- #26 Options volatility — smile / skew ------------------------------- */

function buildVolSmile(mount) {
  const curves = DATA.volsmile;
  const W = 540, H = 320, padL = 50, padR = 72, padT = 18, padB = 38;
  const [mlo, mhi] = extent(curves[0].pts, (p) => p.m);
  const [ivlo, ivhi] = extent(curves.flatMap((c) => c.pts), (p) => p.iv);
  const x = scaleLinear([mlo, mhi], [padL, W - padR]);
  const y = scaleLinear([ivlo, ivhi], [H - padB, padT]);
  const s = svg(W, H, 'wide');

  s.appendChild(rangeFrameAxis(x, { orient: 'bottom', pos: H - padB, ticks: [mlo, 0, mhi], format: (v) => `${round(v * 100)}%` }));
  s.appendChild(rangeFrameAxis(y, { orient: 'left', pos: padL, ticks: [ivlo, round((ivlo + ivhi) / 2, 3), ivhi], format: (v) => `${round(v * 100)}%` }));
  // ATM reference (moneyness 0)
  s.appendChild(svgEl('line', { x1: x(0), y1: padT, x2: x(0), y2: H - padB, stroke: C.rule, 'stroke-dasharray': '2 4' }));
  s.appendChild(svgEl('text', { x: x(0), y: padT - 4, 'text-anchor': 'middle', class: 'tick', text: 'ATM' }));

  // one quiet palette: the front month (steepest skew — the point) gets accent
  const stroke = [C.accent, C.ink, C.muted];
  curves.forEach((c, i) => {
    const pts = c.pts.map((p) => ({ x: x(p.m), y: y(p.iv) }));
    s.appendChild(svgEl('path', { d: path(pts), fill: 'none', stroke: stroke[i], 'stroke-width': 1.5 }));
    s.appendChild(directLabel(pts.at(-1).x + 6, pts.at(-1).y, c.label, { anchor: 'start', cls: i === 0 ? 'label accent' : 'label' }));
  });
  s.appendChild(directLabel(W - padR, H - padB + 26, 'moneyness (K/S − 1)', { anchor: 'end', cls: 'label muted' }));
  // y-axis title as a rotated label down the left edge — clear of the tick column
  const midY = (padT + (H - padB)) / 2;
  s.appendChild(svgEl('text', { x: 12, y: midY, 'text-anchor': 'middle', class: 'label muted', text: 'implied vol', transform: `rotate(-90 12 ${midY})` }));
  mount.appendChild(s);
}

/* --- #29 Regression analysis (OLS + bands + residual strip) -------------- */

function buildRegression(mount) {
  const pts = DATA.regression;
  const W = 540, H = 360, padL = 46, padR = 24, padT = 20, mainB = 250, resTop = 274, resBot = 342;
  const [xlo, xhi] = extent(pts, (p) => p.x);
  const [ylo, yhi] = extent(pts, (p) => p.y);
  // ordinary least squares
  const n = pts.length, xbar = pts.reduce((a, p) => a + p.x, 0) / n, ybar = pts.reduce((a, p) => a + p.y, 0) / n;
  let Sxx = 0, Sxy = 0, Syy = 0;
  for (const p of pts) { Sxx += (p.x - xbar) ** 2; Sxy += (p.x - xbar) * (p.y - ybar); Syy += (p.y - ybar) ** 2; }
  const b1 = Sxy / Sxx, b0 = ybar - b1 * xbar;
  let SSE = 0; const resid = pts.map((p) => { const e = p.y - (b0 + b1 * p.x); SSE += e * e; return { x: p.x, e }; });
  const se = Math.sqrt(SSE / (n - 2)), R2 = 1 - SSE / Syy, t = 2.02;
  const x = scaleLinear([xlo, xhi], [padL, W - padR]);
  const y = scaleLinear([ylo, yhi], [mainB, padT]);
  const s = svg(W, H, 'wide');

  // confidence (inner, darker) + prediction (outer, lighter) bands
  const xs = []; for (let i = 0; i <= 40; i++) xs.push(xlo + (xhi - xlo) * i / 40);
  const fit = (xx) => b0 + b1 * xx;
  const seMean = (xx) => se * Math.sqrt(1 / n + (xx - xbar) ** 2 / Sxx);
  const sePred = (xx) => se * Math.sqrt(1 + 1 / n + (xx - xbar) ** 2 / Sxx);
  const band = (fn) => path([...xs.map((xx) => ({ x: x(xx), y: y(fit(xx) + t * fn(xx)) })), ...xs.map((xx) => ({ x: x(xx), y: y(fit(xx) - t * fn(xx)) })).reverse()], { close: true });
  s.appendChild(svgEl('path', { d: band(sePred), fill: C.rule, opacity: 0.35, stroke: 'none' }));
  s.appendChild(svgEl('path', { d: band(seMean), fill: C.rule, opacity: 0.65, stroke: 'none' }));

  s.appendChild(rangeFrameAxis(x, { orient: 'bottom', pos: mainB, ticks: [xlo, xhi], format: (v) => round(v, 1) }));
  s.appendChild(rangeFrameAxis(y, { orient: 'left', pos: padL, ticks: [ylo, yhi], format: (v) => round(v) }));
  s.appendChild(svgEl('line', { x1: x(xlo), y1: y(fit(xlo)), x2: x(xhi), y2: y(fit(xhi)), stroke: C.ink, 'stroke-width': 1.6 }));
  for (const p of pts) s.appendChild(svgEl('circle', { cx: x(p.x), cy: y(p.y), r: 2.4, fill: C.muted, opacity: 0.8 }));
  // direct labels of the fit statistics
  s.appendChild(directLabel(x(xlo) + 6, padT + 8, `ŷ = ${b0.toFixed(1)} + ${b1.toFixed(2)}x   ·   R² = ${R2.toFixed(2)}`, { anchor: 'start', cls: 'label' }));

  // residual strip beneath, sharing the x-axis
  const rm = Math.max(...resid.map((r) => Math.abs(r.e)));
  const ry = scaleLinear([-rm, rm], [resBot, resTop]);
  s.appendChild(svgEl('line', { x1: padL, y1: ry(0), x2: W - padR, y2: ry(0), stroke: C.muted, 'stroke-width': 1 }));
  for (const r of resid) {
    s.appendChild(svgEl('line', { x1: x(r.x), y1: ry(0), x2: x(r.x), y2: ry(r.e), stroke: C.rule, 'stroke-width': 1 }));
    s.appendChild(svgEl('circle', { cx: x(r.x), cy: ry(r.e), r: 1.6, fill: C.muted }));
  }
  s.appendChild(svgEl('text', { x: padL, y: resTop - 4, 'text-anchor': 'start', class: 'tick muted', text: 'residuals' }));
  mount.appendChild(s);
}

/* --- #30 ML feature analysis (importance dots + SHAP beeswarm) ----------- */

function buildMlFeat(mount) {
  const feats = [...DATA.mlfeat].sort((a, b) => b.importance - a.importance); // most important on top
  const W = 560, rowH = 34, padL = 92, padT = 24, padB = 22;
  const H = padT + feats.length * rowH + padB;
  const impMax = Math.max(...feats.map((f) => f.importance));
  const impX0 = padL, impX1 = 196, beeX0 = 240, beeX1 = W - 26;
  const shapMax = Math.max(...feats.flatMap((f) => f.shap.map((p) => Math.abs(p.v))));
  const imp = scaleLinear([0, impMax], [impX0, impX1]);
  const bee = scaleLinear([-shapMax, shapMax], [beeX0, beeX1]);
  const s = svg(W, H, 'wide');

  s.appendChild(svgEl('text', { x: impX0, y: padT - 9, 'text-anchor': 'start', class: 'tick muted', text: 'importance' }));
  s.appendChild(svgEl('text', { x: (beeX0 + beeX1) / 2, y: padT - 9, 'text-anchor': 'middle', class: 'tick muted', text: 'SHAP impact  (shade = feature value)' }));
  s.appendChild(svgEl('line', { x1: bee(0), y1: padT, x2: bee(0), y2: H - padB, stroke: C.rule, 'stroke-dasharray': '2 4' })); // impact = 0

  feats.forEach((f, i) => {
    const yc = padT + i * rowH + rowH / 2;
    s.appendChild(directLabel(padL - 10, yc, f.name, { anchor: 'end' }));            // direct label
    // importance as a Cleveland dot on a common scale, faint connector + value
    s.appendChild(svgEl('line', { x1: impX0, y1: yc, x2: imp(f.importance), y2: yc, stroke: C.rule, 'stroke-width': 1, 'stroke-dasharray': '1 3' }));
    s.appendChild(svgEl('circle', { cx: imp(f.importance), cy: yc, r: 3, fill: C.ink }));
    s.appendChild(directLabel(imp(f.importance) + 6, yc, f.importance.toFixed(2), { anchor: 'start', cls: 'value' }));
    // SHAP beeswarm: x = signed impact, vertical jitter within the row, shade = feature value
    for (const p of f.shap)
      s.appendChild(svgEl('circle', { cx: bee(p.v), cy: yc + p.j * rowH * 0.3, r: 2, fill: sequentialColor(0.2 + p.fval * 0.8), opacity: 0.85 }));
  });
  mount.appendChild(s);
}

/* --- #27 Portfolio positions & risk -------------------------------------- */

function buildPortfolio(mount) {
  const rows = [...DATA.portfolio].sort((a, b) => b.w - a.w);
  const W = 540, rowH = 30, padL = 70, padR = 96, padT = 32;
  const H = padT + rows.length * rowH + 14;
  const maxV = Math.max(...rows.flatMap((d) => [d.w, d.risk]));
  const x = scaleLinear([0, maxV], [padL, W - padR]);
  const s = svg(W, H, 'wide');
  const diamond = (cx, cy, r) => path([{ x: cx, y: cy - r }, { x: cx + r, y: cy }, { x: cx, y: cy + r }, { x: cx - r, y: cy }], { close: true });

  s.appendChild(rangeFrameAxis(x, { orient: 'bottom', pos: H - 10, ticks: [0, Math.round(maxV / 2), maxV], format: (v) => `${v}%` }));
  // header — two honest position encodings, direct-labeled (no legend hunt)
  s.appendChild(svgEl('rect', { x: padL, y: padT - 22, width: 18, height: 6, fill: C.ink }));
  s.appendChild(svgEl('text', { x: padL + 24, y: padT - 17, class: 'tick', text: 'weight' }));
  s.appendChild(svgEl('path', { d: diamond(padL + 118, padT - 19, 4), fill: C.accent }));
  s.appendChild(svgEl('text', { x: padL + 128, y: padT - 17, class: 'tick', text: 'risk contribution' }));

  rows.forEach((d, i) => {
    const yc = padT + i * rowH + rowH / 2;
    s.appendChild(svgEl('rect', { x: padL, y: yc - 4, width: x(d.w) - padL, height: 8, fill: C.ink }));     // weight bar (position)
    s.appendChild(svgEl('line', { x1: x(d.w), y1: yc, x2: x(d.risk), y2: yc, stroke: C.rule, 'stroke-width': 1, 'stroke-dasharray': '1 2' })); // the weight→risk gap
    s.appendChild(svgEl('path', { d: diamond(x(d.risk), yc, 4), fill: C.accent }));                          // risk marker (same scale)
    s.appendChild(directLabel(padL - 10, yc, d.name, { anchor: 'end' }));
    s.appendChild(directLabel(W - padR + 8, yc, `${d.w}% / ${d.risk}%`, { anchor: 'start', cls: 'value' }));
  });
  mount.appendChild(s);
}

/* --- #28 VaR & stress (P&L distribution + scenario tornado) -------------- */

function buildVarStress(mount) {
  const { ret, scenarios } = DATA.varstress;
  const W = 560, H = 400, padL = 44, padR = 22, padT = 22, histB = 178, torTop = 234, torBot = 388;
  const s = svg(W, H, 'wide');

  // ---- P&L histogram with VaR / CVaR ----
  const [rlo, rhi] = extent(ret), bins = 28, bw = (rhi - rlo) / bins, counts = new Array(bins).fill(0);
  for (const v of ret) { let b = Math.floor((v - rlo) / (rhi - rlo) * bins); b = Math.max(0, Math.min(bins - 1, b)); counts[b]++; }
  const cmax = Math.max(...counts);
  const x = scaleLinear([rlo, rhi], [padL, W - padR]);
  const y = scaleLinear([0, cmax], [histB, padT]);
  const sorted = [...ret].sort((a, b) => a - b);
  const VaR = sorted[Math.floor(0.05 * sorted.length)];
  const tail = sorted.filter((v) => v <= VaR), CVaR = tail.reduce((a, b) => a + b, 0) / tail.length;
  counts.forEach((c, b) => {
    const x0 = rlo + b * bw;
    s.appendChild(svgEl('rect', { x: x(x0) + 0.5, y: y(c), width: x(x0 + bw) - x(x0) - 1, height: histB - y(c), fill: x0 < VaR ? C.accent : C.muted, opacity: x0 < VaR ? 0.6 : 0.5 }));
  });
  s.appendChild(rangeFrameAxis(x, { orient: 'bottom', pos: histB, ticks: [rlo, 0, rhi], format: (v) => `${round(v, 1)}%` }));
  s.appendChild(svgEl('line', { x1: x(VaR), y1: padT, x2: x(VaR), y2: histB, stroke: C.ink, 'stroke-width': 1.2 }));
  s.appendChild(svgEl('line', { x1: x(CVaR), y1: padT + 12, x2: x(CVaR), y2: histB, stroke: C.accent, 'stroke-width': 1.2, 'stroke-dasharray': '3 2' }));
  s.appendChild(svgEl('text', { x: padL, y: padT - 8, 'text-anchor': 'start', class: 'tick muted', text: 'P&L distribution (daily %)' }));
  // direct value labels in the quiet right tail
  s.appendChild(directLabel(W - padR, padT + 4, `VaR 95% = ${round(VaR, 1)}%`, { anchor: 'end', cls: 'label' }));
  s.appendChild(directLabel(W - padR, padT + 20, `CVaR = ${round(CVaR, 1)}%`, { anchor: 'end', cls: 'label accent' }));

  // ---- stress tornado (sorted by magnitude) ----
  const sc = [...scenarios].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  const m = Math.max(...sc.map((d) => Math.abs(d.impact)));
  const tx = scaleLinear([-m, m], [186, W - 64]);
  const trowH = (torBot - torTop) / sc.length;
  s.appendChild(svgEl('text', { x: padL, y: torTop - 8, 'text-anchor': 'start', class: 'tick muted', text: 'Stress scenarios — P&L impact (%)' }));
  s.appendChild(svgEl('line', { x1: tx(0), y1: torTop, x2: tx(0), y2: torBot, stroke: C.muted, 'stroke-width': 1 }));
  sc.forEach((d, i) => {
    const yc = torTop + i * trowH + trowH / 2, x0 = tx(0), x1 = tx(d.impact);
    s.appendChild(svgEl('rect', { x: Math.min(x0, x1), y: yc - 6, width: Math.abs(x1 - x0), height: 12, fill: d.impact < 0 ? C.accent : C.ink, opacity: 0.85 }));
    s.appendChild(directLabel(176, yc, d.name, { anchor: 'end', cls: 'label-sm' }));
    s.appendChild(directLabel(W - 58, yc, `${d.impact > 0 ? '+' : ''}${d.impact}%`, { anchor: 'start', cls: 'value' }));
  });
  mount.appendChild(s);
}

/* ===========================================================================
   Group F — Encoding & annotation (#31, #32).
   =========================================================================== */

/* --- #31 Diverging color scale ------------------------------------------- */

function buildDiverging(mount) {
  const rows = [...DATA.diverging].sort((a, b) => b.v - a.v);  // surplus → deficit
  const W = 540, rowH = 26, padL = 112, padR = 60, padT = 22;
  const H = padT + rows.length * rowH + 20;
  const m = Math.max(...rows.map((d) => Math.abs(d.v)));
  const x = scaleLinear([-m, m], [padL, W - padR]);
  const s = svg(W, H, 'wide');
  // TRUE diverging ramp (CVD-safe blue↔orange): deep orange at large deficit ⟶
  // pale neutral at the zero midpoint ⟶ deep blue at large surplus. A value's
  // distance from zero shows through lightness/saturation, so color encodes
  // magnitude too (redundant with bar length). mix() interpolates in sRGB; the
  // hue/contrast rationale defers to graphical-perception-and-color.
  const NEUTRAL = '#efe9df', DEEP_POS = '#1b5e8c', DEEP_NEG = '#b4531a';
  const rampFill = (v) => mix(NEUTRAL, v >= 0 ? DEEP_POS : DEEP_NEG, 0.18 + 0.82 * Math.abs(v) / m);
  // zero reference line — the meaningful midpoint of a diverging scale
  s.appendChild(svgEl('line', { x1: x(0), y1: padT - 4, x2: x(0), y2: H - 14, stroke: C.muted, 'stroke-width': 1 }));
  s.appendChild(svgEl('text', { x: x(0), y: padT - 8, 'text-anchor': 'middle', class: 'tick', text: '0' }));
  rows.forEach((d, i) => {
    const yc = padT + i * rowH + rowH / 2, pos = d.v >= 0;
    s.appendChild(svgEl('rect', { x: Math.min(x(0), x(d.v)), y: yc - 6, width: Math.abs(x(d.v) - x(0)), height: 12, fill: rampFill(d.v) }));
    s.appendChild(directLabel(padL - 14, yc, d.region, { anchor: 'end' }));
    s.appendChild(directLabel(pos ? x(d.v) + 6 : x(d.v) - 6, yc, `${d.v > 0 ? '+' : ''}${d.v}`, { anchor: pos ? 'start' : 'end', cls: 'value' }));
  });
  s.appendChild(directLabel(W - padR, H - 2, 'trade balance ($B)', { anchor: 'end', cls: 'label muted' }));
  mount.appendChild(s);
}

/* --- #32 Annotated time series ------------------------------------------- */

function buildAnnotated(mount) {
  const { series, events, target, targetLabel } = DATA.annotated;
  const W = 560, H = 300, padL = 40, padR = 26, padT = 30, padB = 32;
  const [tlo, thi] = extent(series, (p) => p.t);
  const [vlo, vhi] = extent(series, (p) => p.v);
  const lo = Math.min(vlo, target), hi = Math.max(vhi, target);
  const x = scaleLinear([tlo, thi], [padL, W - padR]);
  const y = scaleLinear([lo, hi], [H - padB, padT]);
  const s = svg(W, H, 'wide');
  const pxPts = series.map((p) => ({ x: x(p.t), y: y(p.v) }));

  // sample the series polyline's y over an x-range → [topY (min), botY (max)],
  // so labels can be placed on whichever side is clear of the line
  const interpY = (xx) => {
    if (xx <= pxPts[0].x) return pxPts[0].y;
    if (xx >= pxPts.at(-1).x) return pxPts.at(-1).y;
    for (let i = 0; i < pxPts.length - 1; i++) {
      const a = pxPts[i], b = pxPts[i + 1];
      if (xx >= a.x && xx <= b.x) return a.y + (xx - a.x) / ((b.x - a.x) || 1) * (b.y - a.y);
    }
    return pxPts[0].y;
  };
  const lineExtent = (xa, xb) => {
    let top = Infinity, bot = -Infinity;
    for (let xx = xa; xx <= xb; xx += 2) { const yy = interpY(xx); top = Math.min(top, yy); bot = Math.max(bot, yy); }
    return [top, bot];
  };
  const topB = 11, botB = H - padB - 2, halfW = (str) => str.length * 12 * 0.3;

  s.appendChild(rangeFrameAxis(x, { orient: 'bottom', pos: H - padB, ticks: [tlo, thi], format: (v) => `day ${v}` }));
  s.appendChild(rangeFrameAxis(y, { orient: 'left', pos: padL, ticks: [lo, hi], format: (v) => round(v) }));

  // threshold line; its label sits at the top-left above the dashed line, where
  // the early series runs below the target (so the label is clear of the line)
  s.appendChild(svgEl('line', { x1: padL, y1: y(target), x2: W - padR, y2: y(target), stroke: C.accent, 'stroke-width': 1, 'stroke-dasharray': '4 3', opacity: 0.7 }));
  s.appendChild(svgEl('text', { x: padL + 4, y: y(target) - 5, 'text-anchor': 'start', class: 'label accent', text: `${targetLabel} (${target})` }));

  // the series
  s.appendChild(svgEl('path', { d: path(pxPts), class: 'series' }));

  // events: a marker on the line + a label placed CLEAR of the line — above the
  // line's highest point or below its lowest point across the label's x-span —
  // with a short leader connecting label to point (the leader may cross, the
  // label never does)
  for (const e of events) {
    const px = x(series[e.t].t), py = y(series[e.t].v);
    s.appendChild(svgEl('circle', { cx: px, cy: py, r: 3, class: 'mark' }));
    const hw = halfW(e.label);
    const xa = Math.max(pxPts[0].x, px - hw), xb = Math.min(pxPts.at(-1).x, px + hw);
    const [lt, lb] = lineExtent(xa, xb);
    const aboveBase = lt - 9, belowBase = lb + 18;
    let ly, above;
    if (aboveBase - 11 >= topB) { ly = aboveBase; above = true; }
    else if (belowBase <= botB) { ly = belowBase; above = false; }
    else { ly = aboveBase; above = true; }
    // faint, thin, dotted leader — clearly subordinate to the solid data line,
    // so it reads as an annotation guide, never as data
    s.appendChild(svgEl('line', { x1: px, y1: py, x2: px, y2: above ? ly + 3 : ly - 11, stroke: C.rule, 'stroke-width': 0.75, 'stroke-dasharray': '1 2' }));
    s.appendChild(svgEl('text', { x: px, y: ly, 'text-anchor': 'middle', class: 'label', text: e.label }));
  }
  mount.appendChild(s);
}

/* ===========================================================================
   Group G — ANTI-PATTERNS (NOT in the gallery numbering). The buildDont*
   functions below are INTENTIONALLY WRONG, shown ONLY so they can be
   recognized and avoided. Each is paired with a buildDo* that fixes the SAME
   data. Evidence: references/evidence-tufte-principles.md (Correll 2020 on
   axis truncation; Pandey 2015 on radius-vs-area).
   =========================================================================== */

/* ✗ ANTI-PATTERN — INTENTIONALLY INCORRECT. DO NOT COPY. Shown only to
   contrast with the ✓ version below. Truncating the y-axis inflates the
   PERCEIVED difference between near-equal bars (Correll 2020; Yang 2021). */
function buildDontTruncatedAxis(mount) {
  const d = DATA.antiTrunc;
  const W = 300, H = 190, padL = 36, padR = 12, padT = 14, padB = 26;
  const x = scaleLinear([0, d.length], [padL, W - padR]);
  const lo = Math.min(...d.map((b) => b.v)) - 1, hi = Math.max(...d.map((b) => b.v)); // ✗ truncated domain
  const y = scaleLinear([lo, hi], [H - padB, padT]);
  const s = svg(W, H);
  d.forEach((b, i) => {
    s.appendChild(svgEl('rect', { x: x(i) + 6, y: y(b.v), width: x(1) - x(0) - 12, height: (H - padB) - y(b.v), fill: C.ink }));
    s.appendChild(svgEl('text', { x: x(i) + (x(1) - x(0)) / 2, y: H - padB + 14, 'text-anchor': 'middle', class: 'tick', text: b.k }));
  });
  s.appendChild(rangeFrameAxis(y, { orient: 'left', pos: padL, ticks: [lo + 1, hi], format: (v) => round(v) }));
  mount.appendChild(s);
}

/* ✓ CORRECT — the SAME data on a zero baseline; the bars read as honestly ~equal. */
function buildDoZeroBaseline(mount) {
  const d = DATA.antiTrunc, hiV = Math.max(...d.map((b) => b.v));
  const W = 300, H = 190, padL = 36, padR = 12, padT = 14, padB = 26;
  const x = scaleLinear([0, d.length], [padL, W - padR]);
  const y = scaleLinear([0, hiV], [H - padB, padT]);   // ✓ baseline at 0
  const s = svg(W, H);
  d.forEach((b, i) => {
    s.appendChild(svgEl('rect', { x: x(i) + 6, y: y(b.v), width: x(1) - x(0) - 12, height: (H - padB) - y(b.v), fill: C.ink }));
    s.appendChild(svgEl('text', { x: x(i) + (x(1) - x(0)) / 2, y: H - padB + 14, 'text-anchor': 'middle', class: 'tick', text: b.k }));
  });
  s.appendChild(rangeFrameAxis(y, { orient: 'left', pos: padL, ticks: [0, hiV], format: (v) => round(v) }));
  mount.appendChild(s);
}

/* ✗ ANTI-PATTERN — INTENTIONALLY INCORRECT. DO NOT COPY. Sizing a circle's
   RADIUS by value makes AREA grow with value², exaggerating the big ones
   (Pandey 2015; Tufte's Lie Factor). */
function buildDontBubbleRadius(mount) {
  const d = DATA.antiBubble, maxV = Math.max(...d.map((b) => b.v)), cx = [70, 150, 232];
  const W = 300, H = 190, s = svg(W, H);
  d.forEach((b, i) => {
    const r = (b.v / maxV) * 46;                       // ✗ radius ∝ value  ⇒  area ∝ value²
    s.appendChild(svgEl('circle', { cx: cx[i], cy: H / 2 - 6, r, fill: C.muted, opacity: 0.8 }));
    s.appendChild(svgEl('text', { x: cx[i], y: H - 12, 'text-anchor': 'middle', class: 'tick', text: `${b.k} = ${b.v}` }));
  });
  mount.appendChild(s);
}

/* ✓ CORRECT — radius ∝ √value so AREA is proportional to value (better still,
   put the value on a position axis, which decodes most accurately). */
function buildDoBubbleArea(mount) {
  const d = DATA.antiBubble, maxV = Math.max(...d.map((b) => b.v)), cx = [70, 150, 232];
  const W = 300, H = 190, s = svg(W, H);
  d.forEach((b, i) => {
    const r = Math.sqrt(b.v / maxV) * 46;              // ✓ area ∝ value
    s.appendChild(svgEl('circle', { cx: cx[i], cy: H / 2 - 6, r, fill: C.muted, opacity: 0.8 }));
    s.appendChild(svgEl('text', { x: cx[i], y: H - 12, 'text-anchor': 'middle', class: 'tick', text: `${b.k} = ${b.v}` }));
  });
  mount.appendChild(s);
}

/* ✗ ANTI-PATTERN — INTENTIONALLY INCORRECT. DO NOT COPY. Two unrelated series
   on two independently auto-scaled y-axes can be slid until they "track"; the
   apparent correlation is an artifact of the axis choice, not the data. */
function buildDontDualAxis(mount) {
  const { sales, temp } = DATA.antiDual;
  const W = 320, H = 190, padL = 34, padR = 34, padT = 16, padB = 22;
  const x = scaleLinear([0, sales.length - 1], [padL, W - padR]);
  const yL = scaleLinear(extent(sales), [H - padB, padT]);   // ✗ left axis auto-scaled
  const yR = scaleLinear(extent(temp), [H - padB, padT]);    // ✗ right axis auto-scaled independently
  const s = svg(W, H);
  s.appendChild(svgEl('path', { d: path(sales.map((v, i) => ({ x: x(i), y: yL(v) }))), fill: 'none', stroke: C.ink, 'stroke-width': 1.4 }));
  s.appendChild(svgEl('path', { d: path(temp.map((v, i) => ({ x: x(i), y: yR(v) }))), fill: 'none', stroke: C.accent, 'stroke-width': 1.4 }));
  s.appendChild(svgEl('text', { x: padL, y: padT - 4, 'text-anchor': 'start', class: 'tick', text: 'sales' }));
  s.appendChild(svgEl('text', { x: W - padR, y: padT - 4, 'text-anchor': 'end', class: 'tick accent', text: 'temp' }));
  mount.appendChild(s);
}

/* ✓ CORRECT — the SAME two series as two small panels, each on its own scale
   (indexing both to 100 also works). Nothing forces a shared frame, so no
   spurious correlation is manufactured. */
function buildDoSmallPanels(mount) {
  const { sales, temp } = DATA.antiDual;
  const W = 320, H = 190, padL = 34, padR = 10;
  const s = svg(W, H);
  const panel = (vals, top, h, color, label) => {
    const x = scaleLinear([0, vals.length - 1], [padL, W - padR]);
    const y = scaleLinear(extent(vals), [top + h, top + 8]);
    s.appendChild(svgEl('path', { d: path(vals.map((v, i) => ({ x: x(i), y: y(v) }))), fill: 'none', stroke: color, 'stroke-width': 1.4 }));
    s.appendChild(svgEl('text', { x: padL, y: top + 6, 'text-anchor': 'start', class: 'tick', text: label }));
  };
  panel(sales, 6, 74, C.ink, 'sales');
  panel(temp, 98, 74, C.accent, 'temp');
  mount.appendChild(s);
}

/* ✗ ANTI-PATTERN — INTENTIONALLY INCORRECT. DO NOT COPY. A pie encodes each
   value as an ANGLE (and slice AREA) — both near the BOTTOM of the perceptual
   hierarchy (Cleveland & McGill 1984). With near-equal slices you cannot rank
   them by eye, and the color legend forces the gaze to ferry back and forth. */
function buildDontPie(mount) {
  const d = DATA.antiPie, total = d.reduce((s, b) => s + b.v, 0);
  const W = 300, H = 190, cx = 92, cy = H / 2, r = 72;
  const s = svg(W, H);
  let a0 = -Math.PI / 2;                                  // start at 12 o'clock, sweep clockwise
  d.forEach((b, i) => {
    const a1 = a0 + (b.v / total) * Math.PI * 2;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const large = (a1 - a0) > Math.PI ? 1 : 0;
    s.appendChild(svgEl('path', {
      d: `M${cx},${cy} L${round(x0, 1)},${round(y0, 1)} A${r},${r} 0 ${large} 1 ${round(x1, 1)},${round(y1, 1)} Z`,
      fill: mix('#e7e3da', '#555555', i / (d.length - 1)), stroke: C.paper, 'stroke-width': 1,
    }));
    a0 = a1;
  });
  // a color legend — the ferry-back-and-forth the ✓ version avoids; values
  // are intentionally withheld, because the whole point is you can't rank by eye.
  d.forEach((b, i) => {
    const ly = 28 + i * 26;
    s.appendChild(svgEl('rect', { x: 198, y: ly - 9, width: 11, height: 11, fill: mix('#e7e3da', '#555555', i / (d.length - 1)) }));
    s.appendChild(svgEl('text', { x: 215, y: ly, class: 'tick', text: b.k }));
  });
  mount.appendChild(s);
}

/* ✓ CORRECT — the SAME shares as sorted bars on one common length scale: the
   ranking reads instantly, the value is labeled in place, no legend. (A
   Cleveland dot plot — gallery #7 — is the equally good position-encoded fix.) */
function buildDoBarRank(mount) {
  const d = [...DATA.antiPie].sort((a, b) => b.v - a.v);
  const W = 300, H = 190, padL = 64, padR = 30, padT = 12, padB = 8;
  const rowH = (H - padT - padB) / d.length;
  const maxV = Math.max(...d.map((b) => b.v));
  const x = scaleLinear([0, maxV], [padL, W - padR]);     // common zero-based length scale
  const s = svg(W, H);
  d.forEach((b, i) => {
    const cy = padT + i * rowH + rowH / 2;
    s.appendChild(svgEl('text', { x: padL - 8, y: cy + 3.5, 'text-anchor': 'end', class: 'tick', text: b.k }));
    s.appendChild(svgEl('rect', { x: padL, y: cy - rowH * 0.3, width: x(b.v) - padL, height: rowH * 0.6, fill: C.ink }));
    s.appendChild(svgEl('text', { x: x(b.v) + 4, y: cy + 3.5, 'text-anchor': 'start', class: 'tick', text: b.v }));
  });
  mount.appendChild(s);
}

/* ✗ ANTI-PATTERN — INTENTIONALLY INCORRECT. DO NOT COPY. In a stacked bar only
   the BOTTOM series shares a common baseline. The middle series (accent) floats
   on a shifting base, so its value is decoded as an UNALIGNED length — lower on
   the perceptual hierarchy (Cleveland & McGill 1984). Try to read product B. */
function buildDontStacked(mount) {
  const d = DATA.antiStack;
  const SER = [['a', C.muted], ['b', C.accent], ['c', '#bcbcb7']]; // bottom→top; B is accent
  const W = 300, H = 190, padL = 30, padR = 12, padT = 14, padB = 24;
  const x = scaleLinear([0, d.length], [padL, W - padR]);
  const maxTot = Math.max(...d.map((b) => b.a + b.b + b.c));
  const y = scaleLinear([0, maxTot], [H - padB, padT]);
  const bw = x(1) - x(0) - 14;
  const s = svg(W, H);
  d.forEach((b, i) => {
    const bx = x(i) + 7;
    let base = 0;
    SER.forEach(([key, fill]) => {
      const yTop = y(base + b[key]), yBot = y(base);
      s.appendChild(svgEl('rect', { x: bx, y: yTop, width: bw, height: yBot - yTop, fill }));
      base += b[key];
    });
    s.appendChild(svgEl('text', { x: bx + bw / 2, y: H - padB + 14, 'text-anchor': 'middle', class: 'tick', text: b.k }));
  });
  s.appendChild(rangeFrameAxis(y, { orient: 'left', pos: padL, ticks: [0, maxTot], format: (v) => round(v) }));
  mount.appendChild(s);
}

/* ✓ CORRECT — the SAME data as GROUPED bars from a shared zero baseline. Now
   every product-B bar starts at zero, so B's quarter-to-quarter pattern reads
   directly (one small-multiple panel per series works equally well). */
function buildDoGrouped(mount) {
  const d = DATA.antiStack;
  const SER = [['a', C.muted], ['b', C.accent], ['c', '#bcbcb7']];
  const W = 300, H = 190, padL = 30, padR = 12, padT = 14, padB = 24;
  const x = scaleLinear([0, d.length], [padL, W - padR]);
  const maxV = Math.max(...d.flatMap((b) => [b.a, b.b, b.c]));
  const y = scaleLinear([0, maxV], [H - padB, padT]);
  const group = x(1) - x(0) - 12, bw = group / 3;
  const s = svg(W, H);
  d.forEach((b, i) => {
    const gx = x(i) + 6;
    SER.forEach(([key, fill], j) => {
      const bx = gx + j * bw;
      s.appendChild(svgEl('rect', { x: bx, y: y(b[key]), width: bw - 1.5, height: (H - padB) - y(b[key]), fill }));
    });
    s.appendChild(svgEl('text', { x: gx + group / 2, y: H - padB + 14, 'text-anchor': 'middle', class: 'tick', text: b.k }));
  });
  s.appendChild(rangeFrameAxis(y, { orient: 'left', pos: padL, ticks: [0, maxV], format: (v) => round(v) }));
  mount.appendChild(s);
}

/* -------------------------------------------------------------------------
   Color ramps (the only place JS computes color). Single-hue, monotonic
   lightness — the property the foundation skill says encodes magnitude.
   ------------------------------------------------------------------------- */

function lerp(a, b, t) { return a + (b - a) * t; }
function mix(c1, c2, t) {
  const h = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const [r1, g1, b1] = h(c1), [r2, g2, b2] = h(c2);
  const to = (n) => Math.round(n).toString(16).padStart(2, '0');
  return `#${to(lerp(r1, r2, t))}${to(lerp(g1, g2, t))}${to(lerp(b1, b2, t))}`;
}
/** sequential: light paper-tint -> dark brick, monotonic lightness. */
function sequentialColor(t) { return mix('#f1ede6', '#7a2417', Math.max(0, Math.min(1, t))); }
/** diverging: gains toward ink, losses toward brick; magnitude via lightness. */
function divergingColor(val, t) {
  const dark = val >= 0 ? '#2b2b2b' : '#7a2417';
  return mix('#f3f1ea', dark, Math.max(0.06, Math.min(1, t)));
}

/* -------------------------------------------------------------------------
   6. Registry — draw every chart into its mount node.
   ------------------------------------------------------------------------- */

const BUILDERS = {
  'chart-1':  buildSparklines,
  'chart-2':  buildSlopegraph,
  'chart-3':  buildSmallMultiples,
  'chart-4':  buildBoxplot,
  'chart-5':  buildDotDash,
  'chart-6':  buildRangeLine,
  'chart-7':  buildDotPlot,
  'chart-8':  buildCandles,
  'chart-9':  buildTearSheet,
  'chart-10': buildForest,
  'chart-11': buildBullet,
  'chart-12': buildHeatmap,
  'chart-13': buildHorizon,
  'chart-14': buildSplom,
  'chart-15': buildParcoords,
  'chart-16': buildCyclePlot,
  'chart-17': buildPopout,
  'chart-18': buildReferenceBand,
  'chart-19': buildGestalt,
  'chart-20': buildFigureGround,
  'chart-21': buildKpiRow,
  'chart-22': buildMetricBoard,
  'chart-23': buildBulletPanel,
  'chart-24': buildDataTable,
  'chart-25': buildOverview,
  'chart-26': buildVolSmile,
  'chart-27': buildPortfolio,
  'chart-28': buildVarStress,
  'chart-29': buildRegression,
  'chart-30': buildMlFeat,
  'chart-31': buildDiverging,
  'chart-32': buildAnnotated,
};

/* Anti-pattern contrasts — NOT part of the gallery numbering. The `Dont`
   builders are intentionally wrong (see their loud comments); they exist only
   so the "what not to do" section can show wrong beside right. */
const ANTI = {
  'anti-trunc-dont':  buildDontTruncatedAxis,
  'anti-trunc-do':    buildDoZeroBaseline,
  'anti-bubble-dont': buildDontBubbleRadius,
  'anti-bubble-do':   buildDoBubbleArea,
  'anti-dual-dont':   buildDontDualAxis,
  'anti-dual-do':     buildDoSmallPanels,
  'anti-pie-dont':    buildDontPie,
  'anti-pie-do':      buildDoBarRank,
  'anti-stack-dont':  buildDontStacked,
  'anti-stack-do':    buildDoGrouped,
};

function drawAll() {
  for (const [id, build] of Object.entries({ ...BUILDERS, ...ANTI })) {
    const mount = document.querySelector(`#${id} .mount`);
    if (!mount) { console.warn(`no mount for ${id}`); continue; }
    try { build(mount); }
    catch (err) { console.error(`build failed for ${id}`, err); }
  }
}

if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', drawAll);
else
  drawAll();

/* Export the primitives so the gallery doubles as a copyable reference. */
export { svgEl, svg, scaleLinear, path, rangeFrameAxis, directLabel, marginalTicks, DATA, drawAll };

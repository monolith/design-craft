/* Tiny SVG helpers so the dashboard example embeds REAL charting-skill forms
   (sparklines, small multiples, a Cleveland dot plot) in the shared palette —
   the visible hand-off to `charting` and `graphical-perception-and-color`. */
const NS = 'http://www.w3.org/2000/svg';
const INK = '#222', ACCENT = '#b0301c', RULE = '#e2e2dd', MUTED = '#6b6b6b';
function el(t, a = {}) { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; }
function txt(x, y, s, a = {}) { const e = el('text', { x, y, 'font-size': 9, fill: MUTED, ...a }); e.textContent = s; return e; }
function scale(d0, d1, r0, r1) { const s = (d1 - d0) || 1; return (x) => r0 + ((x - d0) / s) * (r1 - r0); }

function sparkline(vals, { w = 76, h = 22, stroke = INK } = {}) {
  const s = el('svg', { width: w, height: h, viewBox: `0 0 ${w} ${h}` });
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const x = scale(0, vals.length - 1, 1, w - 2), y = scale(lo, hi, h - 2, 2);
  s.appendChild(el('path', { d: vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(''), fill: 'none', stroke, 'stroke-width': 1.3 }));
  s.appendChild(el('circle', { cx: x(vals.length - 1).toFixed(1), cy: y(vals[vals.length - 1]).toFixed(1), r: 1.8, fill: ACCENT }));
  return s;
}

function smallMultiples(mount) {
  const series = [[3,4,3,5,4,6,5,7],[6,5,6,4,5,3,4,3],[2,3,4,4,5,6,7,8],[5,5,4,6,5,7,6,6],[4,3,5,4,6,5,7,6],[7,6,6,5,5,4,3,2]];
  const labels = ['us-east','us-west','eu-west','ap-south','sa-east','af-north'];
  const all = series.flat(), lo = Math.min(...all), hi = Math.max(...all);
  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px';
  series.forEach((vals, i) => {
    const w = 64, h = 28, s = el('svg', { width: w, height: h, viewBox: `0 0 ${w} ${h}` });
    const x = scale(0, vals.length - 1, 1, w - 2), y = scale(lo, hi, h - 3, 3);
    s.appendChild(el('path', { d: vals.map((v, j) => `${j ? 'L' : 'M'}${x(j).toFixed(1)},${y(v).toFixed(1)}`).join(''), fill: 'none', stroke: '#444', 'stroke-width': 1.2 }));
    s.appendChild(el('circle', { cx: x(vals.length - 1).toFixed(1), cy: y(vals[vals.length - 1]).toFixed(1), r: 1.5, fill: ACCENT }));
    const cell = document.createElement('div'), lab = document.createElement('div');
    lab.textContent = labels[i]; lab.style.cssText = 'font-size:9px;color:#6b6b6b';
    cell.appendChild(lab); cell.appendChild(s); grid.appendChild(cell);
  });
  mount.appendChild(grid);
}

function dotPlot(mount) {
  const data = [['/api', 92], ['/app', 74], ['/docs', 61], ['/blog', 38], ['/admin', 22]].sort((a, b) => b[1] - a[1]);
  const W = 156, rowH = 17, H = data.length * rowH + 6, max = 100;
  const s = el('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` });
  const x = scale(0, max, 56, W - 8);
  data.forEach(([k, v], i) => {
    const cy = 10 + i * rowH;
    s.appendChild(txt(52, cy + 3, k, { 'text-anchor': 'end', fill: '#444' }));
    s.appendChild(el('line', { x1: 56, y1: cy, x2: x(v).toFixed(1), y2: cy, stroke: RULE, 'stroke-width': 1 }));
    s.appendChild(el('circle', { cx: x(v).toFixed(1), cy, r: 3, fill: INK }));
    s.appendChild(txt(x(v) + 6, cy + 3, v, { fill: MUTED }));
  });
  mount.appendChild(s);
}

/* The Pudding move: a chart that breaks out wider than the prose, with the
   annotation baked in and colour reserved for the one data point that matters. */
function pudChart(mount) {
  const data = [8, 8.1, 8.4, 8.9, 9.4, 10, 10.7, 11.4, 12];
  const W = 600, H = 122, padL = 12, padR = 150, padT = 12, padB = 22;
  const s = el('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', height: 'auto' });
  const x = scale(0, data.length - 1, padL, W - padR), y = scale(8, 12, H - padB, padT);
  s.appendChild(el('line', { x1: padL, y1: y(8), x2: W - padR, y2: y(8), stroke: RULE, 'stroke-width': 1 }));
  s.appendChild(el('path', { d: data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(''), fill: 'none', stroke: INK, 'stroke-width': 1.6 }));
  const ex = x(data.length - 1), ey = y(data[data.length - 1]);
  s.appendChild(el('circle', { cx: ex, cy: ey, r: 3, fill: ACCENT }));
  s.appendChild(el('line', { x1: ex, y1: ey, x2: ex + 14, y2: ey, stroke: ACCENT, 'stroke-width': 1 }));
  s.appendChild(txt(ex + 18, ey - 1, '+2.5 in vs. 30 yrs ago', { fill: ACCENT, 'font-size': 11, 'font-weight': 700 }));
  s.appendChild(txt(ex + 18, ey + 13, 'same garment labelled "size 8"', { fill: MUTED, 'font-size': 10 }));
  s.appendChild(txt(padL, H - 6, '1995', { 'font-size': 9 }));
  s.appendChild(txt(W - padR - 22, H - 6, '2025', { 'font-size': 9 }));
  mount.appendChild(s);
}

document.querySelectorAll('.spark[data-v]').forEach((n) => n.appendChild(sparkline(n.dataset.v.split(',').map(Number), { w: +n.dataset.w || 76 })));
const sm = document.getElementById('dash-sm'); if (sm) smallMultiples(sm);
const dp = document.getElementById('dash-dot'); if (dp) dotPlot(dp);
const pud = document.getElementById('wild-pud-chart'); if (pud) pudChart(pud);

/* Panel 28 — "% of usability problems found" across review/testing scenarios.
   Bars = the headline number; whiskers = the observed range (the variance that makes
   "5 users = 85%" a floor, not a guarantee). Highlighted row is the famous claim. */
function testersChart(mount) {
  const rows = [
    ['1 expert (heuristic)', 35, 20, 51],
    ['5 experts', 66, null, null],
    ['5 users — average', 85, 55, 99],
    ['5 users — large open-task site', 35, null, null],
    ['15 users', 92, null, null],
  ];
  const W = 480, rh = 27, padL = 178, padR = 32, H = rows.length * rh + 16;
  const s = el('svg', { width: '100%', viewBox: `0 0 ${W} ${H}`, style: 'max-width:490px' });
  const x = scale(0, 100, padL, W - padR);
  s.appendChild(el('line', { x1: x(100).toFixed(1), y1: 8, x2: x(100).toFixed(1), y2: H - 8, stroke: RULE, 'stroke-width': 1 }));
  s.appendChild(txt(x(100).toFixed(1), H - 1, '100%', { 'text-anchor': 'middle', 'font-size': 8 }));
  rows.forEach(([lab, val, lo, hi], i) => {
    const cy = 16 + i * rh, hot = lab.indexOf('average') >= 0;
    s.appendChild(txt(padL - 8, cy + 3, lab, { 'text-anchor': 'end', 'font-size': 9, fill: INK }));
    s.appendChild(el('rect', { x: padL, y: cy - 5, width: Math.max(0, x(val) - padL).toFixed(1), height: 10, rx: 1, fill: hot ? ACCENT : INK, opacity: hot ? 0.9 : 0.62 }));
    if (lo != null) {
      const yw = cy - 10;
      s.appendChild(el('line', { x1: x(lo).toFixed(1), y1: yw, x2: x(hi).toFixed(1), y2: yw, stroke: MUTED, 'stroke-width': 1 }));
      [lo, hi].forEach((v) => s.appendChild(el('line', { x1: x(v).toFixed(1), y1: yw - 2.5, x2: x(v).toFixed(1), y2: yw + 2.5, stroke: MUTED, 'stroke-width': 1 })));
    }
    s.appendChild(txt(x(val) + 5, cy + 3, val + '%', { 'font-size': 9, fill: INK, 'font-weight': 700 }));
  });
  mount.appendChild(s);
}
const lt = document.getElementById('lr-testers'); if (lt) testersChart(lt);

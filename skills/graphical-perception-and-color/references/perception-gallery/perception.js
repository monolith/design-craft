/* ===========================================================================
   perception.js — vanilla ES module, zero dependencies, no build step.

   Seven "see-the-difference" demos for the graphical-perception-and-color
   skill. Each demonstrates ONE evidence-backed rule by contrast (wrong beside
   right / channel beside channel), and is captioned with its primary study in
   index.html. The forms are deliberately plain — this gallery is about colour
   and perception, not chart craft (that's the `charting` skill).

   Honest note: viridis/jet here are short anchor-point approximations of the
   real LUTs — enough to show monotonic vs non-monotonic lightness, not a
   substitute for the published colormaps. The deuteranopia simulation IS the
   real Machado et al. (2009) matrix, applied in linear RGB.
   ========================================================================= */

const SVGNS = 'http://www.w3.org/2000/svg';

/* ---- tiny SVG + DOM helpers ---- */
function svgEl(tag, attrs = {}, children = []) {
  const el = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    if (k === 'text') { el.textContent = String(v); continue; }
    el.setAttribute(k, String(v));
  }
  for (const c of [].concat(children)) {
    if (c == null) continue;
    el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return el;
}
function svg(w, h) { return svgEl('svg', { width: w, height: h, viewBox: `0 0 ${w} ${h}`, role: 'img' }); }
function scaleLinear([d0, d1], [r0, r1]) {
  const span = (d1 - d0) || 1;
  return (x) => r0 + ((x - d0) / span) * (r1 - r0);
}
function path(pts) { return pts.length ? 'M' + pts.map((p) => `${p.x},${p.y}`).join('L') : ''; }
function txt(x, y, s, attrs = {}) { return svgEl('text', { x, y, 'font-size': 9, fill: '#333', ...attrs, text: s }); }
/** Append a labelled panel (an <svg>) into a mount div; returns nothing. */
function panel(mount, label, node, note) {
  const fig = document.createElement('div');
  fig.className = 'panel';
  const lab = document.createElement('div'); lab.className = 'plabel'; lab.textContent = label;
  fig.appendChild(lab); fig.appendChild(node);
  if (note) { const n = document.createElement('div'); n.className = 'pnote'; n.textContent = note; fig.appendChild(n); }
  mount.appendChild(fig);
}

/* ---- colour math ---- */
function hexToRgb(h) { h = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); }
function rgbToHex(rgb) { return '#' + rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
function srgbToLinear(c) { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
function linearToSrgb(c) { const v = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; return v * 255; }
function relLum(hex) { const [r, g, b] = hexToRgb(hex).map(srgbToLinear); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
/** WCAG contrast ratio between two colours, 1–21. */
function contrast(h1, h2) { const a = relLum(h1) + 0.05, b = relLum(h2) + 0.05; return a > b ? a / b : b / a; }
function mix(h1, h2, t) { const a = hexToRgb(h1), b = hexToRgb(h2); return rgbToHex(a.map((v, i) => v + (b[i] - v) * t)); }
function rampSampler(anchors) {
  return (t) => {
    t = Math.max(0, Math.min(1, t));
    const seg = (anchors.length - 1) * t, i = Math.min(Math.floor(seg), anchors.length - 2);
    return mix(anchors[i], anchors[i + 1], seg - i);
  };
}
/** Machado, Oliveira & Fernandes (2009) deuteranopia matrix (severity 1.0),
 *  applied in LINEAR rgb — the correct pipeline, not a sRGB shortcut. */
function deuteranopia(hex) {
  const [r, g, b] = hexToRgb(hex).map(srgbToLinear);
  const M = [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]];
  return rgbToHex(M.map((row) => linearToSrgb(row[0] * r + row[1] * g + row[2] * b)));
}
const r1 = (x) => Math.round(x * 10) / 10;

const VIRIDIS = rampSampler(['#440154', '#414487', '#2a788e', '#22a884', '#7ad151', '#fde725']);
const JET = rampSampler(['#00008b', '#0000ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000', '#8b0000']);
const RDBU = rampSampler(['#b2182b', '#ef8a62', '#fddbc7', '#f7f7f7', '#d1e5f0', '#67a9cf', '#2166ac']); // ColorBrewer RdBu-7
const SEQ = rampSampler(['#eff3ff', '#08306b']);                                                          // single-hue blue

/* =========================================================================
   1. Perceptual hierarchy — the SAME values by four channels
   ========================================================================= */
function demoHierarchy(mount) {
  const d = [{ k: 'A', v: 48 }, { k: 'B', v: 33 }, { k: 'C', v: 52 }, { k: 'D', v: 39 }, { k: 'E', v: 45 }];
  const W = 150, H = 118, max = 52;
  // position (common scale)
  const pos = svg(W, H); const xp = scaleLinear([0, max], [16, W - 14]);
  d.forEach((b, i) => {
    const y = 16 + i * 20;
    pos.appendChild(svgEl('line', { x1: 16, y1: y, x2: W - 14, y2: y, stroke: '#eee', 'stroke-width': 1 }));
    pos.appendChild(svgEl('circle', { cx: xp(b.v), cy: y, r: 3.4, fill: '#222' }));
    pos.appendChild(txt(4, y + 3, b.k));
  });
  // length
  const len = svg(W, H); const xl = scaleLinear([0, max], [16, W - 14]);
  d.forEach((b, i) => {
    const y = 12 + i * 20;
    len.appendChild(svgEl('rect', { x: 16, y, width: xl(b.v) - 16, height: 11, fill: '#222' }));
    len.appendChild(txt(4, y + 9, b.k));
  });
  // area (radius ∝ √value, so area ∝ value — faithfully, yet still hard)
  const area = svg(W, H); const cx = [22, 52, 82, 112, 138];
  d.forEach((b, i) => {
    const r = Math.sqrt(b.v / max) * 22;
    area.appendChild(svgEl('circle', { cx: cx[i], cy: H / 2 - 6, r, fill: '#9aa0a6', opacity: 0.85 }));
    area.appendChild(txt(cx[i], H - 8, b.k, { 'text-anchor': 'middle' }));
  });
  // colour (shade)
  const col = svg(W, H);
  d.forEach((b, i) => {
    const x = 14 + i * 26;
    col.appendChild(svgEl('rect', { x, y: 36, width: 22, height: 22, fill: SEQ(b.v / max) }));
    col.appendChild(txt(x + 11, 74, b.k, { 'text-anchor': 'middle' }));
  });
  panel(mount, 'Position (common scale)', pos, 'order is exact');
  panel(mount, 'Length', len, 'still accurate');
  panel(mount, 'Area', area, 'a guess');
  panel(mount, 'Colour (shade)', col, 'a worse guess');
}

/* =========================================================================
   2. Categorical colour — ≤7 hues identifiable; hue-only legend ferries
   ========================================================================= */
function demoCategorical(mount) {
  const SET2 = ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f'];
  const twelve = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#b15928', '#bdbd22'];
  const W = 230, H = 130;
  const lines = (svgNode, palette, n, directLabel) => {
    const x = scaleLinear([0, 7], [10, W - (directLabel ? 44 : 12)]);
    for (let s = 0; s < n; s++) {
      const base = 18 + (s / n) * 90;
      const pts = Array.from({ length: 8 }, (_, i) => ({ x: x(i), y: base + Math.sin(i * 0.7 + s) * 6 }));
      svgNode.appendChild(svgEl('path', { d: path(pts), fill: 'none', stroke: palette[s], 'stroke-width': 2 }));
      if (directLabel) svgNode.appendChild(txt(x(7) + 3, pts[7].y + 3, 'S' + (s + 1), { fill: palette[s], 'font-size': 8 }));
    }
  };
  const good = svg(W, H); lines(good, SET2, 6, true);
  const bad = svg(W, H); lines(bad, twelve, 12, false);
  // hue-only legend on the bad one
  twelve.forEach((c, i) => {
    const lx = 12 + (i % 6) * 36, ly = H - 22 + Math.floor(i / 6) * 11;
    bad.appendChild(svgEl('rect', { x: lx, y: ly - 7, width: 8, height: 8, fill: c }));
    bad.appendChild(txt(lx + 11, ly, 'S' + (i + 1), { 'font-size': 7 }));
  });
  panel(mount, '6 series · direct-labelled', good, 'each line told apart at a glance');
  panel(mount, '12 series · hue-only legend', bad, 'identification collapses; eye ferries to the key');
}

/* =========================================================================
   3. Sequential — monotonic-lightness (viridis) vs rainbow (jet)
   ========================================================================= */
function demoSequential(mount) {
  const W = 230, H = 70, n = 60;
  const strip = (sampler) => {
    const s = svg(W, H); const cw = (W - 20) / n;
    for (let i = 0; i < n; i++) s.appendChild(svgEl('rect', { x: 10 + i * cw, y: 12, width: cw + 0.6, height: 34, fill: sampler(i / (n - 1)) }));
    s.appendChild(txt(10, 60, 'low')); s.appendChild(txt(W - 24, 60, 'high'));
    return s;
  };
  panel(mount, 'Viridis — lightness rises monotonically', strip(VIRIDIS), 'reads as ordered; detail preserved');
  panel(mount, 'Rainbow / jet', strip(JET), 'non-monotonic luminance → false bands, hidden detail');
}

/* =========================================================================
   4. Diverging vs sequential misused on signed data
   ========================================================================= */
function demoDiverging(mount) {
  const d = [-8, -5, -2, 0, 3, 6, -4, 7, -1];
  const W = 230, H = 80; const lim = 8;
  const row = (fn) => {
    const s = svg(W, H); const cw = (W - 20) / d.length;
    d.forEach((v, i) => {
      const x = 10 + i * cw;
      s.appendChild(svgEl('rect', { x, y: 18, width: cw - 2, height: 30, fill: fn(v) }));
      s.appendChild(txt(x + cw / 2 - 2, 62, String(v), { 'text-anchor': 'middle', 'font-size': 8 }));
    });
    return s;
  };
  panel(mount, 'Diverging — light at zero', row((v) => RDBU((v + lim) / (2 * lim))), 'sign and the zero crossing read instantly');
  panel(mount, 'Sequential on signed data', row((v) => SEQ((v + lim) / (2 * lim))), 'zero is not special; sign is lost');
}

/* =========================================================================
   5. Colour-vision deficiency — simulate, and encode lightness not hue
   ========================================================================= */
function demoCvd(mount) {
  const trap = ['#d73027', '#1a9850', '#fee08b', '#4575b4'];        // red & green: the classic trap
  const safe = ['#03396c', '#fdae61', '#999999', '#1a1a1a'];        // distinct in LIGHTNESS
  const labels = ['cat 1', 'cat 2', 'cat 3', 'cat 4'];
  const W = 150, H = 96;
  const bars = (palette, sim) => {
    const s = svg(W, H); const cw = (W - 20) / palette.length;
    palette.forEach((c, i) => {
      const fill = sim ? deuteranopia(c) : c;
      const h = 26 + i * 9;
      s.appendChild(svgEl('rect', { x: 12 + i * cw, y: H - 22 - h, width: cw - 4, height: h, fill }));
      s.appendChild(txt(12 + i * cw + (cw - 4) / 2, H - 8, labels[i], { 'text-anchor': 'middle', 'font-size': 7 }));
    });
    return s;
  };
  panel(mount, 'Red–green palette · normal', bars(trap, false));
  panel(mount, 'Same · deuteranopia (simulated)', bars(trap, true), 'red & green collapse — categories merge');
  panel(mount, 'Lightness-distinct · deuteranopia', bars(safe, true), 'still separable — differs in lightness, not just hue');
}

/* =========================================================================
   6. Contrast / WCAG — live-computed ratios, pass/fail at the real threshold
   ========================================================================= */
function demoContrast(mount) {
  const BG = '#fdfdfb';
  const W = 250, H = 150, s = svg(W, H);
  s.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: BG }));
  const marks = [
    { type: 'line', c: '#d8d8d2', need: 3, kind: 'data line' },
    { type: 'line', c: '#9a9a9a', need: 3, kind: 'data line' },
    { type: 'line', c: '#5a5a5a', need: 3, kind: 'data line' },
    { type: 'text', c: '#b3b3b3', need: 4.5, kind: 'body text' },
    { type: 'text', c: '#595959', need: 4.5, kind: 'body text' },
  ];
  marks.forEach((m, i) => {
    const y = 22 + i * 26, ratio = contrast(m.c, BG), pass = ratio >= m.need;
    if (m.type === 'line') s.appendChild(svgEl('line', { x1: 12, y1: y, x2: 120, y2: y, stroke: m.c, 'stroke-width': 2.5 }));
    else s.appendChild(txt(12, y + 4, 'Sample label', { fill: m.c, 'font-size': 13 }));
    s.appendChild(txt(132, y + 4, `${r1(ratio)}:1  ${m.kind} (need ${m.need})  ${pass ? '✓' : '✗'}`,
      { 'font-size': 9, fill: pass ? '#1a7f37' : '#b0301c' }));
  });
  panel(mount, 'Marks & text vs the background', s, 'ratio = (L1+0.05)/(L2+0.05); text ≥4.5:1, data marks ≥3:1');
}

/* =========================================================================
   7. Background brightness (not hue) — incl. dark done right vs washed out
   ========================================================================= */
function miniChart(bg, ink, accent, label) {
  const W = 124, H = 90, s = svg(W, H);
  s.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: bg }));
  const data = [3, 5, 4, 6, 5, 7, 6, 8];
  const x = scaleLinear([0, data.length - 1], [12, W - 10]);
  const y = scaleLinear([2, 9], [H - 16, 12]);
  s.appendChild(svgEl('path', { d: path(data.map((v, i) => ({ x: x(i), y: y(v) }))), fill: 'none', stroke: ink, 'stroke-width': 1.6 }));
  s.appendChild(svgEl('circle', { cx: x(7), cy: y(8), r: 3, fill: accent }));
  s.appendChild(txt(12, H - 5, label, { fill: ink, 'font-size': 8.5 }));
  return s;
}
function demoBackground(mount) {
  const beds = [
    { bg: '#ffffff', name: 'pure white' },
    { bg: '#f4f3ef', name: 'off-white' },
    { bg: '#d7e8d0', name: '"calming" green' },
    { bg: '#14171c', name: 'dark (re-contrasted)', dark: true },
  ];
  beds.forEach((b) => {
    const ink = b.dark ? '#e6e6e6' : '#222222', accent = b.dark ? '#ff8a6e' : '#b0301c';
    panel(mount, b.name, miniChart(b.bg, ink, accent, b.name), `text ${r1(contrast(ink, b.bg))}:1`);
  });
  // dark done wrong vs right
  panel(mount, 'dark · light-theme ink (wrong)', miniChart('#14171c', '#222222', '#b0301c', 'washed out'),
    `text ${r1(contrast('#222222', '#14171c'))}:1 ✗ (<4.5)`);
  panel(mount, 'dark · re-contrasted (right)', miniChart('#14171c', '#e6e6e6', '#ff8a6e', 'legible'),
    `text ${r1(contrast('#e6e6e6', '#14171c'))}:1 ✓`);
}

/* =========================================================================
   8. Palette library — ~10 palettes grouped by data type, with "use when"
   ========================================================================= */
function demoPalettes(mount) {
  const groups = [
    { head: 'Categorical (nominal — distinct things)', items: [
      { n: 'Okabe–Ito (8)', c: ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7', '#000000'], use: 'colourblind-safe categorical series, ≤8 — the safe default', cite: 'Okabe & Ito 2008' },
      { n: 'ColorBrewer Set2', c: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'], use: 'soft nominal categories, print-friendly, ≤8', cite: 'Harrower & Brewer 2003' },
      { n: 'Tableau 10', c: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac'], use: 'general dashboard categorical; familiar defaults', cite: 'Tableau' },
    ] },
    { head: 'Sequential (ordered low → high)', items: [
      { n: 'Viridis', c: ['#440154', '#414487', '#2a788e', '#22a884', '#7ad151', '#fde725'], use: 'continuous magnitude / heatmaps; perceptually uniform + CVD-safe', cite: 'Smith & van der Walt 2015' },
      { n: 'Cividis', c: ['#00204d', '#31446b', '#666970', '#958f78', '#cab969', '#ffe945'], use: 'sequential that must look ~identical to CVD viewers', cite: 'Nuñez et al. 2018' },
      { n: 'CB Blues (single-hue)', c: ['#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c'], use: 'one quantity, low→high; "darker = more"', cite: 'Harrower & Brewer 2003' },
      { n: 'CB YlOrRd (multi-hue)', c: ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026'], use: 'sequential needing wide perceptual range (intensity / heat)', cite: 'Harrower & Brewer 2003' },
    ] },
    { head: 'Diverging (signed, around a midpoint)', items: [
      { n: 'ColorBrewer RdBu', c: ['#b2182b', '#ef8a62', '#fddbc7', '#f7f7f7', '#d1e5f0', '#67a9cf', '#2166ac'], use: 'deviation above / below a reference; correlation', cite: 'Harrower & Brewer 2003' },
      { n: 'ColorBrewer BrBG', c: ['#a6611a', '#dfc27d', '#f5f5f5', '#80cdc1', '#018571'], use: 'diverging when red/green must be avoided (CVD-safer than RdYlGn)', cite: 'Harrower & Brewer 2003' },
    ] },
    { head: 'Neutral + one accent (when colour is NOT the data)', items: [
      { n: 'Gray + single accent', c: ['#222222', '#666666', '#999999', '#cccccc', '#b0301c'], use: 'reserve one accent for the single thing that matters; print / CVD-proof', cite: 'Tufte; WCAG 1.4.1' },
    ] },
  ];
  groups.forEach((g) => {
    const h = document.createElement('div'); h.className = 'pal-head'; h.textContent = g.head; mount.appendChild(h);
    g.items.forEach((p) => {
      const row = document.createElement('div'); row.className = 'pal-row';
      const strip = document.createElement('div'); strip.className = 'pal-strip';
      p.c.forEach((c) => { const sw = document.createElement('span'); sw.className = 'sw'; sw.style.background = c; strip.appendChild(sw); });
      const meta = document.createElement('div'); meta.className = 'pal-meta';
      const nm = document.createElement('b'); nm.textContent = p.n;                 // safe DOM, no innerHTML
      const ct = document.createElement('span'); ct.className = 'cite'; ct.textContent = p.cite;
      meta.append(nm, document.createTextNode(` — ${p.use} `), ct);
      row.appendChild(strip); row.appendChild(meta); mount.appendChild(row);
    });
  });
}

/* =========================================================================
   9. Colour in dashboards & lists — consistency, one accent, CVD-safe status
   ========================================================================= */
function demoDashboard(mount) {
  const W = 250, H = 152;
  const nums = ['1.2k', '340', '87%'], deltas = ['+4%', '−2%', '+1%'];
  const status = [{ t: 'API', s: 'good' }, { t: 'Queue', s: 'warn' }, { t: 'Disk', s: 'bad' }];
  const dotC = { good: '#1a7f37', warn: '#b8860b', bad: '#b0301c' };
  const glyph = { good: '●', warn: '▲', bad: '■' };           // shape backs the colour → CVD-safe
  const dash = (good) => {
    const s = svg(W, H);
    s.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#fdfdfb' }));
    const tile = good ? ['#3a3f45', '#3a3f45', '#3a3f45'] : ['#e15759', '#4e79a7', '#59a14f'];
    for (let i = 0; i < 3; i++) {
      const x = 8 + i * 80;
      s.appendChild(svgEl('rect', { x, y: 8, width: 72, height: 48, fill: 'none', stroke: '#e2e2dd' }));
      s.appendChild(txt(x + 6, 26, nums[i], { 'font-size': 13, fill: '#222', 'font-weight': 600 }));
      const sd = [4, 5, 4, 6, 5, 7], sx = scaleLinear([0, 5], [x + 6, x + 66]), sy = scaleLinear([3, 8], [50, 34]);
      s.appendChild(svgEl('path', { d: path(sd.map((v, j) => ({ x: sx(j), y: sy(v) }))), fill: 'none', stroke: tile[i], 'stroke-width': 1.4 }));
      s.appendChild(txt(x + 6, 44, deltas[i], { 'font-size': 8, fill: deltas[i][0] === '−' ? '#b0301c' : '#1a7f37' }));
    }
    status.forEach((r, i) => {
      const y = 82 + i * 20;
      if (good) {
        s.appendChild(txt(12, y, glyph[r.s], { fill: dotC[r.s], 'font-size': 10 }));
        s.appendChild(txt(28, y, r.t, { 'font-size': 10, fill: '#222' }));
        s.appendChild(txt(78, y, r.s.toUpperCase(), { 'font-size': 8, fill: '#555' }));   // word, not colour alone
      } else {
        s.appendChild(svgEl('circle', { cx: 14, cy: y - 3, r: 4, fill: dotC[r.s] }));      // hue-only RAG
        s.appendChild(txt(26, y, r.t, { 'font-size': 10, fill: '#222' }));
      }
    });
    return s;
  };
  panel(mount, 'Consistent palette · one accent · status = shape + word', dash(true),
    'tiles share one ink; a single accent flags "bad"; status reads without colour');
  panel(mount, 'Rainbow tiles · hue-only red-amber-green', dash(false),
    'every tile a different hue; RAG dots fail for ~8% of men (no shape or label)');
}

/* ---- registry ---- */
const DEMOS = {
  'demo-hierarchy': demoHierarchy,
  'demo-categorical': demoCategorical,
  'demo-sequential': demoSequential,
  'demo-diverging': demoDiverging,
  'demo-cvd': demoCvd,
  'demo-palettes': demoPalettes,
  'demo-contrast': demoContrast,
  'demo-background': demoBackground,
  'demo-dashboard': demoDashboard,
};
function drawAll() {
  for (const [id, build] of Object.entries(DEMOS)) {
    const mount = document.querySelector(`#${id} .mount`);
    if (!mount) { console.warn(`no mount for ${id}`); continue; }
    try { build(mount); } catch (err) { console.error(`build failed for ${id}`, err); }
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', drawAll);
else drawAll();

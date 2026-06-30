/* Visual review of the VERIFIED colour-theory findings (sub-topics 1 harmony +
   2 emotion only). Zero deps. Same palette as the perception gallery. */
const NS = 'http://www.w3.org/2000/svg';
const INK = '#222', ACCENT = '#b0301c', RULE = '#e2e2dd', MUTED = '#6b6b6b', GOOD = '#1a7f37';
function el(t, a = {}) { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; }
function tx(x, y, s, a = {}) { const e = el('text', { x, y, 'font-size': 10, fill: MUTED, ...a }); e.textContent = s; return e; }
function scale(d0, d1, r0, r1) { const s = (d1 - d0) || 1; return (x) => r0 + ((x - d0) / s) * (r1 - r0); }
function hexToRgb(h) { h = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); }
function lin(c) { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
function lum(h) { const [r, g, b] = hexToRgb(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
function contrast(a, b) { const L1 = lum(a) + 0.05, L2 = lum(b) + 0.05; return L1 > L2 ? L1 / L2 : L2 / L1; }
const r1 = (x) => Math.round(x * 10) / 10;

/* Finding 3 — Ecological Valence Theory preference curve (bar height = avg
   preference; peaks blue/cyan, troughs chartreuse / dark-yellow / brown). */
function evt(mount) {
  const h = [['#d7191c', .62, 'red'], ['#f07818', .50, 'orange'], ['#f0c419', .45, 'yellow'], ['#a8c100', .22, 'chartreuse'], ['#8a7a1e', .18, 'dk-yellow'], ['#2ca25f', .60, 'green'], ['#1fb6c1', .82, 'cyan'], ['#3a9bdc', .90, 'sky'], ['#2c63d8', .85, 'blue'], ['#7a3fb0', .60, 'purple'], ['#c0399a', .55, 'magenta'], ['#7a5230', .20, 'brown']];
  const W = 600, H = 168, padT = 22, padB = 32, cw = (W - 16) / h.length;
  const s = el('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', height: 'auto' });
  const y = scale(0, 1, H - padB, padT);
  s.appendChild(tx(8, 14, 'average preference (taller = more liked)', { 'font-size': 9 }));
  h.forEach(([c, p, name], i) => {
    const x = 8 + i * cw;
    s.appendChild(el('rect', { x: x + 3, y: y(p), width: cw - 7, height: (H - padB) - y(p), fill: c }));
    s.appendChild(el('rect', { x: x + 3, y: H - padB + 3, width: cw - 7, height: 9, fill: c }));
    s.appendChild(tx(x + cw / 2, H - padB + 23, name, { 'text-anchor': 'middle', 'font-size': 8 }));
  });
  mount.appendChild(s);
}

/* Finding 4 — colour-emotion is dimensional: place swatches on
   passive→active (x) and light→heavy (y). */
function emotion(mount) {
  const p = [['#d7191c', 'red', .88, .68], ['#f07818', 'orange', .78, .46], ['#f0c419', 'yellow', .70, .20], ['#2c63d8', 'blue', .26, .64], ['#3a9bdc', 'sky', .32, .30], ['#2ca25f', 'green', .42, .46], ['#7a3fb0', 'purple', .46, .70], ['#111111', 'black', .30, .94], ['#d9d4c7', 'beige', .34, .16]];
  const W = 430, H = 300, pad = 38;
  const s = el('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', height: 'auto', style: 'max-width:430px' });
  const x = scale(0, 1, pad, W - pad), y = scale(0, 1, pad, H - pad);
  s.appendChild(el('line', { x1: pad, y1: H - pad, x2: W - pad, y2: H - pad, stroke: RULE }));
  s.appendChild(el('line', { x1: pad, y1: pad, x2: pad, y2: H - pad, stroke: RULE }));
  s.appendChild(tx(W - pad, H - pad + 16, 'active →', { 'text-anchor': 'end', 'font-size': 9 }));
  s.appendChild(tx(pad, H - pad + 16, 'passive', { 'font-size': 9 }));
  s.appendChild(tx(pad - 6, pad + 2, 'light', { 'text-anchor': 'end', 'font-size': 9 }));
  s.appendChild(tx(pad - 6, H - pad, 'heavy', { 'text-anchor': 'end', 'font-size': 9 }));
  p.forEach(([c, name, px, py]) => {
    s.appendChild(el('circle', { cx: x(px), cy: y(py), r: 9, fill: c, stroke: '#fff', 'stroke-width': 1 }));
    s.appendChild(tx(x(px) + 12, y(py) + 3, name, { 'font-size': 9, fill: INK }));
  });
  mount.appendChild(s);
}

/* Finding 5 — 'romantic red' effect shrinks/reverses under pre-registration:
   a forest plot (charting-skill form) of the meta-analytic d's. */
function forest(mount) {
  const rows = [['Men rating women (all)', .26, .12, .40], ['Women rating men (all)', .13, .01, .25], ['Pre-registered only', -.10, -.24, .04]];
  const W = 560, rowH = 34, H = rows.length * rowH + 40, padL = 188, padR = 26;
  const s = el('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', height: 'auto' });
  const x = scale(-.3, .5, padL, W - padR);
  s.appendChild(el('line', { x1: x(0), y1: 16, x2: x(0), y2: H - 20, stroke: ACCENT, 'stroke-width': 1, 'stroke-dasharray': '3 3' }));
  s.appendChild(tx(x(0), 12, 'no effect (d=0)', { 'text-anchor': 'middle', 'font-size': 9, fill: ACCENT }));
  rows.forEach(([name, d, lo, hi], i) => {
    const cy = 32 + i * rowH;
    s.appendChild(tx(padL - 8, cy + 3, name, { 'text-anchor': 'end', 'font-size': 10, fill: INK }));
    s.appendChild(el('line', { x1: x(lo), y1: cy, x2: x(hi), y2: cy, stroke: INK, 'stroke-width': 1.4 }));
    s.appendChild(el('circle', { cx: x(d), cy, r: 4, fill: d <= 0 ? GOOD : INK }));
    s.appendChild(tx(x(hi) + 6, cy + 3, `d=${d}`, { 'font-size': 9 }));
  });
  s.appendChild(tx(x(.42), H - 6, 'larger claimed effect →', { 'text-anchor': 'end', 'font-size': 9 }));
  mount.appendChild(s);
}

[['evt', evt], ['emotion', emotion], ['forest', forest]].forEach(([id, fn]) => { const m = document.getElementById(id); if (m) fn(m); });
[['c-bad', '#2ca25f', '#d7191c'], ['c-good', '#eaf2fb', '#14418a']].forEach(([id, bg, fg]) => { const n = document.getElementById(id); if (n) n.textContent = r1(contrast(bg, fg)) + ':1'; });

/* established-science demos */
function mix(h1, h2, t) { const a = hexToRgb(h1), b = hexToRgb(h2), to = (n) => Math.round(n).toString(16).padStart(2, '0'); return '#' + a.map((v, i) => to(v + (b[i] - v) * t)).join(''); }
const VIR = ['#440154', '#414487', '#2a788e', '#22a884', '#7ad151', '#fde725'];
function viridis(t) { t = Math.max(0, Math.min(1, t)); const seg = (VIR.length - 1) * t, i = Math.min(Math.floor(seg), VIR.length - 2); return mix(VIR[i], VIR[i + 1], seg - i); }
function gradient(mount, mode) {
  const W = 560, H = 42, n = 64, cw = W / n, s = el('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', height: 'auto' });
  for (let i = 0; i < n; i++) { const t = i / (n - 1), c = mode === 'rgb' ? mix('#1a3df0', '#f5e000', t) : viridis(t); s.appendChild(el('rect', { x: (i * cw).toFixed(1), y: 0, width: cw + 0.6, height: H, fill: c })); }
  mount.appendChild(s);
}
{ const g1 = document.getElementById('grad-rgb'); if (g1) gradient(g1, 'rgb'); const g2 = document.getElementById('grad-vir'); if (g2) gradient(g2, 'viridis'); }

/* Colour wheel — the hue ring is real (opponent-process vision), but equal ANGLES
   are not equal perceptual STEPS. HSL spaces hue by maths (lumpy lightness); OKLCh
   (Ottosson 2020) spaces it perceptually (even lightness all the way round). */
function oklchToHex(L, C, hdeg) {
  const h = hdeg * Math.PI / 180, a = C * Math.cos(h), b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b, m_ = L - 0.1055613458 * a - 0.0638541728 * b, s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const R = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, G = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, B = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
  const enc = (c) => { c = Math.max(0, Math.min(1, c)); return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; };
  const to = (c) => Math.round(Math.max(0, Math.min(1, enc(c))) * 255).toString(16).padStart(2, '0');
  return '#' + to(R) + to(G) + to(B);
}
function hslToHex(H, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((H / 60) % 2) - 1)), m = l - c / 2;
  let r, g, b;
  if (H < 60) { r = c; g = x; b = 0; } else if (H < 120) { r = x; g = c; b = 0; } else if (H < 180) { r = 0; g = c; b = x; } else if (H < 240) { r = 0; g = x; b = c; } else if (H < 300) { r = x; g = 0; b = c; } else { r = c; g = 0; b = x; }
  const to = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return '#' + to(r) + to(g) + to(b);
}
function annSector(cx, cy, ri, ro, a0, a1) {
  const p = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [xo0, yo0] = p(ro, a0), [xo1, yo1] = p(ro, a1), [xi1, yi1] = p(ri, a1), [xi0, yi0] = p(ri, a0);
  return `M${xo0.toFixed(2)} ${yo0.toFixed(2)} A${ro} ${ro} 0 0 1 ${xo1.toFixed(2)} ${yo1.toFixed(2)} L${xi1.toFixed(2)} ${yi1.toFixed(2)} A${ri} ${ri} 0 0 0 ${xi0.toFixed(2)} ${yi0.toFixed(2)} Z`;
}
function colorWheel(mount, mode) {
  const S = 184, cx = S / 2, cy = S / 2, ro = S / 2 - 5, ri = ro * 0.55, n = 72, step = 2 * Math.PI / n;
  const s = el('svg', { viewBox: `0 0 ${S} ${S}`, width: S, height: S, style: 'max-width:100%;height:auto' });
  for (let i = 0; i < n; i++) {
    const a0 = i * step - Math.PI / 2 - step / 2, a1 = a0 + step, hdeg = (i / n) * 360;
    const col = mode === 'hsl' ? hslToHex(hdeg, 1, 0.5) : oklchToHex(0.70, 0.12, hdeg);
    s.appendChild(el('path', { d: annSector(cx, cy, ri, ro, a0, a1), fill: col }));
  }
  mount.appendChild(s);
}
{ const w1 = document.getElementById('wheel-hsl'); if (w1) colorWheel(w1, 'hsl'); const w2 = document.getElementById('wheel-oklch'); if (w2) colorWheel(w2, 'oklch'); }

/* Harmony schemes ON the (perceptually-uniform) wheel — the standard combinations the wheel
   is used to find. Markers sit on the ring at the scheme's hue angles; spokes through the
   centre show the geometric relationship (complement = a straight line, triad = three arms…). */
function schemeWheel(offsets) {
  const S = 112, cx = S / 2, cy = S / 2, ro = S / 2 - 7, ri = ro * 0.58, n = 48, step = 2 * Math.PI / n, base = 24;
  const s = svgT(S, S);
  for (let i = 0; i < n; i++) { const a0 = i * step - Math.PI / 2 - step / 2, a1 = a0 + step, hdeg = (i / n) * 360; s.appendChild(el('path', { d: annSector(cx, cy, ri, ro, a0, a1), fill: oklchToHex(0.72, 0.125, hdeg) })); }
  const rr = (ro + ri) / 2, pts = offsets.map((o) => { const hd = ((base + o) % 360 + 360) % 360, ang = (hd / 360) * 2 * Math.PI - Math.PI / 2; return { x: cx + rr * Math.cos(ang), y: cy + rr * Math.sin(ang), col: oklchToHex(0.6, 0.15, hd) }; });
  pts.forEach((p) => s.appendChild(el('line', { x1: cx, y1: cy, x2: p.x.toFixed(1), y2: p.y.toFixed(1), stroke: '#9a958c', 'stroke-width': 1, opacity: 0.55 })));
  pts.forEach((p) => s.appendChild(el('circle', { cx: p.x.toFixed(1), cy: p.y.toFixed(1), r: 5.5, fill: p.col, stroke: '#fff', 'stroke-width': 1.5 })));
  return s;
}
/* Monochromatic — one hue, varied by tint (+white) / tone (+grey) / shade (+black): markers
   along a single spoke at different lightness, since this scheme leans on lightness, not hue. */
function monoWheel() {
  const S = 112, cx = S / 2, cy = S / 2, ro = S / 2 - 7, ri = ro * 0.58, n = 48, step = 2 * Math.PI / n, base = 24;
  const s = svgT(S, S);
  for (let i = 0; i < n; i++) { const a0 = i * step - Math.PI / 2 - step / 2, a1 = a0 + step, hdeg = (i / n) * 360; s.appendChild(el('path', { d: annSector(cx, cy, ri, ro, a0, a1), fill: oklchToHex(0.72, 0.125, hdeg) })); }
  const ang = (base / 360) * 2 * Math.PI - Math.PI / 2;
  s.appendChild(el('line', { x1: cx, y1: cy, x2: (cx + ro * Math.cos(ang)).toFixed(1), y2: (cy + ro * Math.sin(ang)).toFixed(1), stroke: '#9a958c', 'stroke-width': 1, opacity: 0.45 }));
  [[0.84, 0.06], [0.62, 0.15], [0.42, 0.11]].forEach(([Ll, C], i) => { const rr = ri + (ro - ri) * (0.18 + i * 0.32), x = cx + rr * Math.cos(ang), y = cy + rr * Math.sin(ang); s.appendChild(el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 5.5, fill: oklchToHex(Ll, C, base), stroke: '#fff', 'stroke-width': 1.5 })); });
  return s;
}
{ const m = document.getElementById('scheme-wheels');
  if (m) [['Complementary', () => schemeWheel([0, 180])], ['Monochromatic', () => monoWheel()], ['Analogous', () => schemeWheel([-30, 0, 30])], ['Triadic', () => schemeWheel([0, 120, 240])], ['Split-complementary', () => schemeWheel([0, 150, 210])], ['Tetradic', () => schemeWheel([0, 90, 180, 270])]].forEach(([nm, mk]) => {
    const cell = h('div', { style: 'text-align:center' }); cell.appendChild(mk()); cell.appendChild(h('div', { style: 'font-size:9px;color:#6b6b6b;margin-top:2px;font-weight:600' }, nm)); m.appendChild(cell);
  }); }

/* Functional palette roles across multiple themes (live WCAG contrast per theme) */
function h(tag, props, ...kids) { const e = document.createElement(tag); for (const k in (props || {})) { if (k === 'style') e.style.cssText = props[k]; else if (k === 'class') e.className = props[k]; else e.setAttribute(k, props[k]); } for (const c of kids) { if (c == null) continue; e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); } return e; }
/* Light-airy professional family + an art/photography set. Off-white grounds (not
   pure white), near-black ink (not pure black), low-chroma neutrals. Colour is spent
   on two jobs: one bold EMPHASIS colour for important text (distinct from info and
   from severe/error), and an escalating STATE channel — info blends (a quiet slate
   that recedes), warning is gentle (a soft gold), severe stands clearly apart
   (saturated red, thickest rule). fg/muted/emphasis clear AA (>=4.5); state colours
   are graphical marks (>=3:1) backed by icon + word so they never rely on colour. */
/* One dominant GROUND (no separate "surface" colour — panels read by a hairline,
   the smallest effective difference) + ink. Everything else is a sliver. */
/* Deliberately WIDE range — distinct ground temperature/lightness AND a distinct
   accent hue per theme. */
const THEMES = [
  { name: 'White',     bg: '#f5f5f5', fg: '#16181d', muted: '#687078', emph: '#2748c8', link: '#0c7672', info: '#6f7c8c', warn: '#876009', sev: '#c4112b' },
  { name: 'Off-white', bg: '#faf8f3', fg: '#1c1a19', muted: '#6a6760', emph: '#6a3fb8', link: '#0c7672', info: '#6f7a8a', warn: '#876009', sev: '#c4112b' },
  { name: 'Linen',     bg: '#f7f0e3', fg: '#241f17', muted: '#6f6553', emph: '#a8431f', link: '#6e3fb0', info: '#5f7a86', warn: '#876009', sev: '#a8122e' },
  { name: 'Dark',      bg: '#15181d', fg: '#e8eaed', muted: '#99a0aa', emph: '#2bb3b0', link: '#9a86f0', info: '#7e8ca0', warn: '#b88f33', sev: '#ff7a6d' },
  { name: 'Paper',     bg: '#e8e7e2', fg: '#1a1a18', muted: '#55554f', emph: '#1d5bd6', link: '#0b685e', info: '#777e88', warn: '#876009', sev: '#c01620' },];
/* Colour register drawn from galleries, film and painting rather than SaaS-blue. */
const ART = [
  { name: 'Gallery',   bg: '#efe9e0', fg: '#22201b', muted: '#6c6457', emph: '#8e2f63', link: '#1f5fa8', info: '#6d7687', warn: '#876009', sev: '#9e2a24' },
  { name: 'Darkroom',  bg: '#1a1613', fg: '#ece2d4', muted: '#a89a88', emph: '#6cba8e', link: '#b094ea', info: '#788a9e', warn: '#b58c38', sev: '#f5786a' },
  { name: 'Corbusier Light', bg: '#efe7d6', fg: '#2f2624', muted: '#6f6657', emph: '#3a5a8e', link: '#0f4d40', info: '#727f83', warn: '#855810', sev: '#9c2128' },
  { name: 'Corbusier Dark',  bg: '#1a1613', fg: '#ece2d4', muted: '#a89a88', emph: '#7aa3d8', link: '#52c892', info: '#818d97', warn: '#bd9744', sev: '#f3a188' },
  { name: 'Corbusier Watercolour', bg: '#f9f8f4', fg: '#2e2a26', muted: '#79716a', emph: '#415aa0', link: '#2c7d62', info: '#788591', warn: '#905f15', sev: '#b8383a' },];
function renderThemes(mount, list) {
  list.forEach((t) => {
    const rule = mix(t.bg, t.fg, .14);   // the ONLY separator — a hairline = smallest effective difference
    const lv = (lvl, ico, label, bw, mv) => h('div', { class: 'talert', style: `background:${mix(lvl, t.bg, mv)};border-left:${bw}px solid ${lvl};color:${t.fg}` }, h('span', { style: `color:${lvl}` }, ico), ' ' + label);
    const chip = (lab, c) => h('span', { class: 'tchip' }, h('span', { class: 'dot', style: `background:${c}` }), lab);
    const tier = (lab, ...chips) => h('div', { class: 'tier' }, h('span', { class: 'tierlab', style: `color:${t.muted}` }, lab), ...chips);
    // one ground + ink dominate; everything else is a sliver — no wasted surface colour
    const budget = [[t.bg, 66], [t.fg, 26], [t.emph, 4], [t.info, 2], [t.warn, 1.3], [t.sev, 0.7]];
    const bar = h('div', { class: 'dombar' }, ...budget.map(([c, w]) => h('span', { class: 'domseg', style: `flex:${w};background:${c}` })));
    mount.appendChild(h('div', { class: 'theme', style: `background:${t.bg};color:${t.fg};border:1px solid ${rule}` },
      h('div', { class: 'tname' }, t.name),
      bar,
      h('div', { class: 'budgetlab', style: `color:${t.muted}` }, 'screen budget — one ground + ink dominate · supporting sparingly · alert reserved'),
      tier('Dominant', chip('ground', t.bg), chip('ink', t.fg)),
      tier('Supporting', chip('emphasis', t.emph), chip('info', t.info)),
      tier('Alert', chip('warn', t.warn), chip('severe', t.sev)),
      tier('Components', chip('link', t.link || t.emph)),
      h('div', { class: 'tui', style: `background:${t.bg};border:1px solid ${rule}` },
        h('div', { class: 'tuihdr', style: `border-color:${rule}` },
          h('span', { class: 'tuilogo', style: `background:${t.emph}` }),
          h('span', { class: 'tuibrand' }, 'Acme'),
          h('a', { class: 'tuinav active' }, 'Home'),
          h('a', { class: 'tuinav', style: `color:${t.muted}` }, 'Docs'),
          h('a', { class: 'tuinav', style: `color:${t.muted}` }, 'Billing')),
        h('div', { class: 'tuit' }, 'Account overview'),
        h('div', { class: 'tuis', style: `color:${t.muted}` }, 'general foreground, with one ', h('b', { style: `color:${t.emph}` }, 'emphasised phrase'), ' that stands out'),
        h('a', { class: 'tuilink', style: `color:${t.link || t.emph}` }, 'See the full report →'),
        lv(t.info, 'ⓘ', 'Info — sync completed', 2, .95),
        lv(t.warn, '▲', 'Warning — quota at 85%', 3, .9),
        lv(t.sev, '■', 'Severe — payment failed', 4, .82)),
      h('div', { class: 'tc', style: `color:${t.muted}` }, `text ${r1(contrast(t.fg, t.bg))}:1 · emph ${r1(contrast(t.emph, t.bg))} · info ${r1(contrast(t.info, t.bg))} · warn ${r1(contrast(t.warn, t.bg))} · sev ${r1(contrast(t.sev, t.bg))}`)
    ));
  });
}
/* Themed Tufte figures — each takes a theme and draws in ITS colours: ink for the
   data, emphasis for the one value worth noticing, alert hues only at a threshold. */
function svgT(w, h) { return el('svg', { viewBox: `0 0 ${w} ${h}`, width: '100%', height: 'auto' }); }
function chartLine(t) {
  const ink = t.fg, em = t.emph, mut = t.muted, rule = mix(t.bg, t.fg, .14);
  const d = [4, 4.4, 4.2, 5, 4.8, 5.6, 5.3, 6.2, 6.9], W = 320, H = 120, padL = 10, padR = 116, padT = 10, padB = 22;
  const s = svgT(W, H), x = scale(0, d.length - 1, padL, W - padR), y = scale(4, 7, H - padB, padT);
  s.appendChild(el('line', { x1: padL, y1: y(4), x2: W - padR, y2: y(4), stroke: rule, 'stroke-width': 1 }));
  s.appendChild(el('path', { d: d.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(''), fill: 'none', stroke: ink, 'stroke-width': 1.7 }));
  const ex = x(d.length - 1), ey = y(d[d.length - 1]);
  s.appendChild(el('circle', { cx: ex, cy: ey, r: 3, fill: em }));
  s.appendChild(el('line', { x1: ex, y1: ey, x2: ex + 12, y2: ey, stroke: em, 'stroke-width': 1 }));
  const a = el('text', { x: ex + 16, y: ey - 1, 'font-size': 11, fill: em, 'font-weight': 700 }); a.textContent = '+58% YoY'; s.appendChild(a);
  const b = el('text', { x: ex + 16, y: ey + 12, 'font-size': 9, fill: mut }); b.textContent = 'active users'; s.appendChild(b);
  const l1 = el('text', { x: padL, y: H - 6, 'font-size': 9, fill: mut }); l1.textContent = '2018'; s.appendChild(l1);
  const l2 = el('text', { x: W - padR - 22, y: H - 6, 'font-size': 9, fill: mut }); l2.textContent = '2026'; s.appendChild(l2);
  return s;
}
function chartSM(t) {
  const ink = t.fg, em = t.emph, mut = t.muted;
  const series = [[3, 4, 3, 5, 4, 6], [6, 5, 6, 4, 5, 3], [2, 3, 4, 4, 5, 6], [5, 5, 4, 6, 5, 7], [4, 3, 5, 4, 6, 5], [7, 6, 6, 5, 4, 3]];
  const labs = ['North', 'South', 'East', 'West', 'EU', 'APAC'];
  const all = series.flat(), lo = Math.min(...all), hi = Math.max(...all);
  const grid = document.createElement('div'); grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px';
  series.forEach((v, i) => {
    const w = 84, hh = 34, s = svgT(w, hh), x = scale(0, v.length - 1, 2, w - 2), y = scale(lo, hi, hh - 4, 4);
    s.appendChild(el('path', { d: v.map((q, j) => `${j ? 'L' : 'M'}${x(j).toFixed(1)},${y(q).toFixed(1)}`).join(''), fill: 'none', stroke: ink, 'stroke-width': 1.3 }));
    s.appendChild(el('circle', { cx: x(v.length - 1).toFixed(1), cy: y(v[v.length - 1]).toFixed(1), r: 1.6, fill: em }));
    const cell = document.createElement('div'), lab = document.createElement('div'); lab.textContent = labs[i]; lab.style.cssText = `font-size:9px;color:${mut}`;
    cell.appendChild(lab); cell.appendChild(s); grid.appendChild(cell);
  });
  return grid;
}
function chartDot(t) {
  const ink = t.fg, em = t.emph, mut = t.muted, rule = mix(t.bg, t.fg, .14);
  const d = [['Typography', 92], ['Layout', 74], ['Colour', 61], ['Motion', 38], ['Sound', 22]], W = 300, rowH = 19, H = d.length * rowH + 6;
  const s = svgT(W, H), x = scale(0, 100, 78, W - 12);
  d.forEach(([k, v], i) => {
    const cy = 11 + i * rowH;
    const lab = el('text', { x: 72, y: cy + 3, 'text-anchor': 'end', 'font-size': 9, fill: mut }); lab.textContent = k; s.appendChild(lab);
    s.appendChild(el('line', { x1: 78, y1: cy, x2: x(v).toFixed(1), y2: cy, stroke: rule, 'stroke-width': 1 }));
    s.appendChild(el('circle', { cx: x(v).toFixed(1), cy, r: 3, fill: i === 0 ? em : ink }));
  });
  return s;
}
function dashboard(t) {
  const ink = t.fg, em = t.emph, mut = t.muted, rule = mix(t.bg, t.fg, .14);
  const wrap = document.createElement('div');
  const kpis = document.createElement('div'); kpis.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:9px';
  [['Requests', '128k', [6, 6.2, 6, 6.5, 6.4, 6.8, 6.7, 7.2], em], ['Errors', '0.8%', [2, 2, 3, 2, 4, 3, 5, 6], t.sev], ['p95', '240ms', [9, 8, 8, 7, 7, 6, 6, 5], ink]].forEach(([lab, num, sp, accent]) => {
    const tile = document.createElement('div'); tile.style.cssText = `border:1px solid ${rule};border-radius:6px;padding:7px`;
    const l = document.createElement('div'); l.textContent = lab; l.style.cssText = `font-size:9px;text-transform:uppercase;letter-spacing:.4px;color:${mut}`;
    const n = document.createElement('div'); n.textContent = num; n.style.cssText = `font-size:16px;font-weight:700;color:${ink};font-variant-numeric:tabular-nums`;
    const w = 72, hh = 18, s = svgT(w, hh), lo = Math.min(...sp), hi = Math.max(...sp), x = scale(0, sp.length - 1, 1, w - 2), y = scale(lo, hi, hh - 2, 2);
    s.appendChild(el('path', { d: sp.map((v, j) => `${j ? 'L' : 'M'}${x(j).toFixed(1)},${y(v).toFixed(1)}`).join(''), fill: 'none', stroke: ink, 'stroke-width': 1.3 }));
    s.appendChild(el('circle', { cx: x(sp.length - 1).toFixed(1), cy: y(sp[sp.length - 1]).toFixed(1), r: 1.9, fill: accent }));
    tile.appendChild(l); tile.appendChild(n); tile.appendChild(s); kpis.appendChild(tile);
  });
  wrap.appendChild(kpis);
  [['API gateway', 'OK', t.info, '●'], ['Job queue', 'WARN', t.warn, '▲'], ['Disk usage', 'CRITICAL', t.sev, '■']].forEach(([k, w, c, g]) => {
    const row = document.createElement('div'); row.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:11px;padding:2px 0';
    const gl = document.createElement('span'); gl.textContent = g; gl.style.cssText = `color:${c};width:14px;text-align:center`;
    const nm = document.createElement('span'); nm.textContent = k; nm.style.color = ink;
    const wd = document.createElement('span'); wd.textContent = w; wd.style.cssText = `margin-left:auto;font-size:9px;color:${mut}`;
    row.appendChild(gl); row.appendChild(nm); row.appendChild(wd); wrap.appendChild(row);
  });
  return wrap;
}

/* ---- Tufte gallery forms. Each (t) => node; ink = t.fg, accent = t.emph, axes/labels =
   t.muted, alerts = t.warn/t.sev. Minimal, no chartjunk; sized for a ~160px gallery cell.
   Every form works on light AND dark grounds because all colours come from the theme. ---- */
function gtx(s, x, y, fill, sz, bold, anchor) { const a = { x, y, 'font-size': sz || 8.5, fill }; if (bold) a['font-weight'] = 700; if (anchor) a['text-anchor'] = anchor; const e = el('text', a); e.textContent = s; return e; }
function gSpark(t) {
  const d = [4, 5, 4.6, 6, 5.4, 7, 6.4, 8, 7.3, 9, 8.4], W = 160, H = 46, p = 5;
  const s = svgT(W, H), x = scale(0, d.length - 1, p, W - p - 26), y = scale(Math.min(...d), Math.max(...d), H - 8, p);
  s.appendChild(el('path', { d: d.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join(''), fill: 'none', stroke: t.fg, 'stroke-width': 1.3 }));
  const li = d.length - 1; s.appendChild(el('circle', { cx: x(li).toFixed(1), cy: y(d[li]).toFixed(1), r: 2, fill: t.emph }));
  s.appendChild(gtx(d[li] + 'k', W - 23, H / 2 + 3, t.emph, 10, true));
  return s;
}
function gWinLoss(t) {
  const d = [1, 1, -1, 1, -1, -1, 1, 1, 1, -1, 1, 1, -1, 1, 1, -1], W = 160, H = 46, mid = H / 2, bw = (W - 8) / d.length;
  const s = svgT(W, H);
  d.forEach((v, i) => s.appendChild(el('rect', { x: (4 + i * bw).toFixed(1), y: (v > 0 ? mid - 9 : mid + 1).toFixed(1), width: Math.max(1, bw - 1.6).toFixed(1), height: 8, fill: v > 0 ? t.fg : t.sev })));
  return s;
}
function gSlope(t) {
  const rows = [[3, 7], [6, 5], [4, 8], [8, 4], [5, 6.5]], W = 160, H = 96, p = 14, xL = 34, xR = W - 30;
  const s = svgT(W, H), y = scale(2.5, 8.5, H - p, p), maxd = Math.max(...rows.map((r) => r[1] - r[0]));
  rows.forEach(([a, b]) => { const hot = (b - a) === maxd, c = hot ? t.emph : mix(t.bg, t.fg, .55), sw = hot ? 1.7 : 1;
    s.appendChild(el('line', { x1: xL, y1: y(a).toFixed(1), x2: xR, y2: y(b).toFixed(1), stroke: c, 'stroke-width': sw }));
    s.appendChild(el('circle', { cx: xL, cy: y(a).toFixed(1), r: 1.8, fill: c })); s.appendChild(el('circle', { cx: xR, cy: y(b).toFixed(1), r: 1.8, fill: c })); });
  s.appendChild(gtx('2019', xL - 3, H - 2, t.muted, 8, false, 'middle')); s.appendChild(gtx('2026', xR, H - 2, t.muted, 8, false, 'middle'));
  return s;
}
function gBars(t) {
  const d = [['North', 82], ['South', 64], ['East', 71], ['West', 45], ['EU', 58]], W = 160, H = 96, rh = 17, x = scale(0, 100, 40, W - 8), mx = Math.max(...d.map((r) => r[1]));
  const s = svgT(W, H);
  d.forEach(([k, v], i) => { const cy = 12 + i * rh; s.appendChild(gtx(k, 36, cy + 3, t.muted, 8, false, 'end'));
    s.appendChild(el('rect', { x: 40, y: cy - 4, width: (x(v) - 40).toFixed(1), height: 8, fill: v === mx ? t.emph : mix(t.bg, t.fg, .62) })); });
  return s;
}
function gLolli(t) {
  const d = [['Q1', 30], ['Q2', 52], ['Q3', 44], ['Q4', 68]], W = 160, H = 96, p = 16, y = scale(0, 80, H - p, p), bw = (W - 36) / d.length, mx = Math.max(...d.map((r) => r[1]));
  const s = svgT(W, H);
  s.appendChild(el('line', { x1: 26, y1: (H - p).toFixed(1), x2: W - 6, y2: (H - p).toFixed(1), stroke: t.muted, 'stroke-width': .8, opacity: .5 }));
  d.forEach(([k, v], i) => { const x = 34 + i * bw;
    s.appendChild(el('line', { x1: x.toFixed(1), y1: (H - p).toFixed(1), x2: x.toFixed(1), y2: y(v).toFixed(1), stroke: mix(t.bg, t.fg, .6), 'stroke-width': 1 }));
    s.appendChild(el('circle', { cx: x.toFixed(1), cy: y(v).toFixed(1), r: 3, fill: v === mx ? t.emph : t.fg }));
    s.appendChild(gtx(k, x.toFixed(1), H - 3, t.muted, 8, false, 'middle')); });
  return s;
}
function gBox(t) {
  const groups = [[2, 3, 4, 5, 7], [3, 4, 5, 6, 8], [1, 2, 4, 6, 7], [4, 5, 6, 7, 9]], W = 160, H = 96, p = 12, y = scale(0, 10, H - p, p), bw = (W - 24) / groups.length;
  const s = svgT(W, H);
  groups.forEach((q, i) => { const x = 18 + i * bw + bw / 2, [lo, q1, med, q3, hi] = q, c = mix(t.bg, t.fg, .55);
    s.appendChild(el('line', { x1: x, y1: y(lo).toFixed(1), x2: x, y2: y(q1).toFixed(1), stroke: c, 'stroke-width': 1 }));
    s.appendChild(el('line', { x1: x, y1: y(q3).toFixed(1), x2: x, y2: y(hi).toFixed(1), stroke: c, 'stroke-width': 1 }));
    s.appendChild(el('circle', { cx: x, cy: y(med).toFixed(1), r: 2.2, fill: i === groups.length - 1 ? t.emph : t.fg })); });
  return s;
}
function gScatter(t) {
  const pts = [[2, 3], [3, 4], [4, 3.5], [5, 6], [6, 5], [7, 7], [8, 6.5], [3.5, 5], [6.5, 4.2], [5.5, 6.6]], W = 160, H = 96, p = 14, x = scale(1, 9, p + 6, W - 6), y = scale(2, 8, H - p, p);
  const s = svgT(W, H);
  pts.forEach(([px, py], i) => { s.appendChild(el('circle', { cx: x(px).toFixed(1), cy: y(py).toFixed(1), r: 2, fill: i === pts.length - 1 ? t.emph : t.fg, opacity: .85 }));
    s.appendChild(el('line', { x1: x(px).toFixed(1), y1: H - p + 2, x2: x(px).toFixed(1), y2: H - p + 5, stroke: t.muted, 'stroke-width': .8 }));
    s.appendChild(el('line', { x1: p, y1: y(py).toFixed(1), x2: p + 3, y2: y(py).toFixed(1), stroke: t.muted, 'stroke-width': .8 })); });
  return s;
}
function gHisto(t) {
  const d = [2, 5, 9, 14, 18, 16, 11, 6, 3, 1], W = 160, H = 96, p = 12, bw = (W - 12) / d.length, y = scale(0, Math.max(...d), H - p, p);
  const s = svgT(W, H);
  d.forEach((v, i) => { const x = 6 + i * bw; s.appendChild(el('rect', { x: x.toFixed(1), y: y(v).toFixed(1), width: Math.max(1, bw - 1).toFixed(1), height: ((H - p) - y(v)).toFixed(1), fill: i === 4 ? t.emph : mix(t.bg, t.fg, .6) })); });
  return s;
}
function gHorizon(t) {
  const d = [3, 5, 4, 7, 9, 6, 8, 11, 7, 5, 8, 10, 6, 4, 7, 9], W = 160, H = 46, p = 2, n = d.length, x = scale(0, n - 1, 0, W), bands = 3, mx = Math.max(...d), band = mx / bands;
  const s = svgT(W, H);
  for (let b = 0; b < bands; b++) { const yb = scale(b * band, (b + 1) * band, H - p, p), path = ['M0 ' + (H - p)];
    d.forEach((v, i) => { const vv = Math.max(b * band, Math.min((b + 1) * band, v)); path.push('L' + x(i).toFixed(1) + ' ' + yb(vv).toFixed(1)); });
    path.push('L' + W + ' ' + (H - p) + ' Z'); s.appendChild(el('path', { d: path.join(' '), fill: t.emph, opacity: 0.25 + b * 0.28 })); }
  return s;
}
function gBullet(t) {
  const W = 160, H = 42, x = scale(0, 100, 42, W - 6), val = 72, target = 85;
  const s = svgT(W, H);
  [[0, 50, .16], [50, 75, .28], [75, 100, .42]].forEach(([a, b, op]) => s.appendChild(el('rect', { x: x(a).toFixed(1), y: 10, width: (x(b) - x(a)).toFixed(1), height: 18, fill: mix(t.bg, t.fg, op) })));
  s.appendChild(el('rect', { x: x(0).toFixed(1), y: 15, width: (x(val) - x(0)).toFixed(1), height: 8, fill: t.fg }));
  s.appendChild(el('line', { x1: x(target).toFixed(1), y1: 8, x2: x(target).toFixed(1), y2: 30, stroke: t.emph, 'stroke-width': 2 }));
  s.appendChild(gtx('Rev', 38, 22, t.muted, 8, false, 'end'));
  return s;
}
function gCandle(t) {
  const d = [[5, 7, 4, 6], [6, 8, 5, 7], [7, 7.5, 6, 6.5], [6.5, 9, 6, 8], [8, 8.5, 7, 7.2], [7.2, 8, 6.5, 7.8], [7.8, 9.5, 7.5, 9], [9, 9.2, 8, 8.4]], W = 160, H = 96, p = 10, all = d.flat(), y = scale(Math.min(...all), Math.max(...all), H - p, p), bw = (W - 14) / d.length;
  const s = svgT(W, H);
  d.forEach(([o, hi, lo, c], i) => { const x = 10 + i * bw + bw / 2, up = c >= o, col = up ? t.fg : t.sev;
    s.appendChild(el('line', { x1: x, y1: y(hi).toFixed(1), x2: x, y2: y(lo).toFixed(1), stroke: col, 'stroke-width': 1 }));
    s.appendChild(el('rect', { x: (x - 3).toFixed(1), y: y(Math.max(o, c)).toFixed(1), width: 6, height: Math.max(1, Math.abs(y(o) - y(c))).toFixed(1), fill: up ? t.bg : col, stroke: col, 'stroke-width': 1 })); });
  return s;
}
function gForest(t) {
  const rows = [[.2, .05, .35], [.45, .3, .6], [-.1, -.25, .05], [.3, .12, .48]], W = 160, H = 96, x = scale(-.4, .7, 30, W - 8), y0 = 16, rh = 18;
  const s = svgT(W, H);
  s.appendChild(el('line', { x1: x(0).toFixed(1), y1: 8, x2: x(0).toFixed(1), y2: H - 8, stroke: t.emph, 'stroke-width': 1, 'stroke-dasharray': '2 2' }));
  rows.forEach(([d, lo, hi], i) => { const cy = y0 + i * rh;
    s.appendChild(el('line', { x1: x(lo).toFixed(1), y1: cy, x2: x(hi).toFixed(1), y2: cy, stroke: mix(t.bg, t.fg, .55), 'stroke-width': 1.2 }));
    s.appendChild(el('circle', { cx: x(d).toFixed(1), cy, r: 2.4, fill: t.fg })); });
  return s;
}
function gCal(t) {
  const W = 160, H = 82, cols = 10, rows = 5, cw = 12, gap = 2, ox = 8, oy = 8;
  const s = svgT(W, H);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const v = ((r * 7 + c * 3 + 5) % 10) / 9; s.appendChild(el('rect', { x: ox + c * (cw + gap), y: oy + r * (cw + gap), width: cw, height: cw, rx: 2, fill: mix(t.bg, t.emph, 0.1 + v * 0.82), stroke: mix(t.bg, t.fg, .12), 'stroke-width': 0.5 })); }
  return s;
}

/* Categorical multi-series line chart for the chart-palette demos. Direct end-labels
   (not a colour-only legend) keep series identifiable under CVD; a swatch strip of the
   full set sits below with the <=7-at-once caveat (Healey). ink/mut adapt to the ground. */
function chartCategorical(ink, mut, SER, TAB, label) {
  const W = 340, H = 206, padL = 8, padR = 56, padT = 12, plotB = 150;
  const s = svgT(W, H);
  const x = scale(0, SER[0].d.length - 1, padL, W - padR);
  const y = scale(0, 100, plotB, padT);
  s.appendChild(el('line', { x1: padL, y1: plotB, x2: W - padR, y2: plotB, stroke: mut, opacity: 0.5 }));
  const lx = x(SER[0].d.length - 1);
  SER.forEach((se) => {
    const dp = se.d.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ');
    s.appendChild(el('path', { d: dp, fill: 'none', stroke: se.c, 'stroke-width': 1.8 }));
  });
  /* de-collide the direct end-labels: order by height, enforce a minimum vertical gap,
     keep within the plot, and draw a faint leader where a label was nudged off its line */
  const ends = SER.map((se) => ({ name: se.name, c: se.c, ly: y(se.d[se.d.length - 1]) }));
  ends.sort((a, b) => a.ly - b.ly);
  const gap = 11; ends.forEach((e) => (e.labY = e.ly));
  for (let i = 1; i < ends.length; i++) if (ends[i].labY - ends[i - 1].labY < gap) ends[i].labY = ends[i - 1].labY + gap;
  if (ends.length && ends[ends.length - 1].labY > plotB) { ends[ends.length - 1].labY = plotB; for (let i = ends.length - 2; i >= 0; i--) if (ends[i + 1].labY - ends[i].labY < gap) ends[i].labY = ends[i + 1].labY - gap; }
  ends.forEach((e) => {
    s.appendChild(el('circle', { cx: lx.toFixed(1), cy: e.ly.toFixed(1), r: 2.2, fill: e.c }));
    if (Math.abs(e.labY - e.ly) > 1.5) s.appendChild(el('line', { x1: (lx + 2).toFixed(1), y1: e.ly.toFixed(1), x2: (lx + 6).toFixed(1), y2: e.labY.toFixed(1), stroke: e.c, 'stroke-width': 0.8, opacity: 0.6 }));
    const t2 = el('text', { x: (lx + 8).toFixed(1), y: (e.labY + 3).toFixed(1), 'font-size': 8.5, fill: ink, 'font-weight': 600 }); t2.textContent = e.name; s.appendChild(t2);
  });
  const sy = plotB + 24, sw = (W - padL * 2) / TAB.length;
  s.appendChild(tx(padL, sy - 6, label, { 'font-size': 8, fill: mut }));
  TAB.forEach((c, i) => s.appendChild(el('rect', { x: (padL + i * sw).toFixed(1), y: sy, width: (sw - 1).toFixed(1), height: 12, fill: c })));
  return s;
}

/* A real webpage with running text, with one of the figures above embedded in the
   page's own colours — the truest test of "spend colour only on need-to-know". */
function sampleWebpage(t, fig, cap) {
  const rule = mix(t.bg, t.fg, .14);
  const link = (s) => h('a', { class: 'sw-link', style: `color:${t.link || t.emph}` }, s);
  return h('div', { class: 'sw-page', style: `background:${t.bg};color:${t.fg};border:1px solid ${rule}` },
    h('div', { class: 'sw-hdr', style: `border-color:${rule}` },
      h('span', { class: 'sw-logo', style: `background:${t.emph}` }),
      h('span', { class: 'sw-brand' }, t.name),
      h('a', { class: 'sw-nav active' }, 'Journal'),
      h('a', { class: 'sw-nav', style: `color:${t.muted}` }, 'Work'),
      h('a', { class: 'sw-nav', style: `color:${t.muted}` }, 'About'),
      h('span', { style: 'margin-left:auto' }, link('Subscribe'))),
    h('div', { class: 'sw-body' },
      h('div', { class: 'sw-kicker', style: `color:${t.muted}` }, 'REPORT'),
      h('h1', { class: 'sw-title' }, 'On the discipline of restraint'),
      h('div', { class: 'sw-by', style: `color:${t.muted}` }, 'by A. Sholom · 6 min read'),
      h('p', { class: 'sw-p' }, 'Good design rarely announces itself. It works by removing whatever does not earn its place, until what remains reads at a glance. This page spends colour on almost nothing — ', h('b', { style: `color:${t.emph}` }, 'one idea per accent'), ' — and the figure below is drawn from the very same palette. The method is set out in ', link('the full essay'), '.'),
      h('h2', { class: 'sw-sub' }, 'The data, in the same colours'),
      h('figure', { class: 'sw-fig', style: `border-color:${rule}` }, fig, h('figcaption', { class: 'sw-figcap', style: `color:${t.muted}` }, cap)),
      h('p', { class: 'sw-p' }, 'The figure uses only the page colours: ink for the data, the emphasis accent for the one value worth noticing, and the alert hues only where a number crosses a threshold. Nothing is coloured that does not carry meaning, and every divider is a hairline.'),
      h('div', { class: 'sw-callout', style: `background:${mix(t.info, t.bg, .92)};border-color:${t.info}` }, h('b', { style: `color:${t.info}` }, 'Note  '), 'ground and ink fill ~90% of the screen; the rest is reserved for the figure and the rare emphasis.')),
    h('div', { class: 'sw-foot', style: `border-color:${rule};color:${t.muted}` }, '© ' + t.name + ' 2026 · ', link('Privacy'), ' · ', link('Contact')));
}
const SAMPLES = [
  ['White', (t) => chartLine(t), 'Active users, 2018–2026 — annotated range-frame line'],
  ['Off-white', (t) => dashboard(t), 'Service dashboard — KPIs, sparklines, status'],
  ['Linen', (t) => chartSM(t), 'Revenue by region — small multiples on a shared scale'],
  ['Dark', (t) => dashboard(t), 'Operations dashboard'],
  ['Gallery', (t) => chartDot(t), 'What readers notice first — a Cleveland dot plot'],
  ['Darkroom', (t) => dashboard(t), 'Studio throughput'],
  ['Paper', (t) => chartLine(t), 'Throughput, 2018–2026 — annotated line'],
  ['Corbusier Watercolour', (t) => chartDot(t), 'Corbusier watercolour on white matt — a Cleveland dot plot'],
  ['Corbusier Light', (t) => chartSM(t), 'Corbusier light on limestone — small multiples on a shared scale'],
  ['Corbusier Dark', (t) => chartLine(t), 'Corbusier dark on charcoal — an annotated range-frame line'],];
{ const pf = document.getElementById('preferred-themes'); if (pf) renderThemes(pf, ['Corbusier Watercolour', 'Corbusier Light', 'Corbusier Dark'].map((n) => ART.find((x) => x.name === n)));
  const tm = document.getElementById('themes'); if (tm) renderThemes(tm, THEMES); const at = document.getElementById('art-themes'); if (at) renderThemes(at, ART);
  const sp = document.getElementById('samples'); if (sp) SAMPLES.forEach(([n, mk, cap]) => { const t = [...THEMES, ...ART].find((x) => x.name === n); if (t) sp.appendChild(sampleWebpage(t, mk(t), cap)); }); }

/* ---- Chart palettes (light + dark): Corbusier for restraint, Tableau for many categories.
   These are for DATA, not chrome — they ride on top of whatever UI theme is in use. ---- */
function chartPanel(bg, labelText, labelColor, nodes) {
  const wrap = h('div', { style: `background:${bg};border-radius:8px;padding:13px 14px;flex:1 1 300px;min-width:286px` });
  wrap.appendChild(h('div', { style: `font-size:9.5px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;margin-bottom:10px;color:${labelColor}` }, labelText));
  nodes.forEach((n) => { const box = h('div', { style: 'margin-bottom:12px' }); box.appendChild(n); wrap.appendChild(box); });
  return wrap;
}
{ /* Corbusier charts — the same earth-tone family as the UI theme, light & dark, across Tufte forms */
  const m = document.getElementById('corb-charts');
  if (m) {
    const cl = [...THEMES, ...ART].find((x) => x.name === 'Corbusier Light');
    const cd = [...THEMES, ...ART].find((x) => x.name === 'Corbusier Dark');
    const cw = [...THEMES, ...ART].find((x) => x.name === 'Corbusier Watercolour');
    m.appendChild(chartPanel(cl.bg, 'light · on limestone', cl.muted, [chartLine(cl), chartDot(cl)]));
    m.appendChild(chartPanel(cd.bg, 'dark · on charcoal', cd.muted, [chartLine(cd), chartDot(cd)]));
    m.appendChild(chartPanel(cw.bg, 'watercolour · on white matt', cw.muted, [chartLine(cw), chartDot(cw)]));
  }
}
{ /* Tableau charts — the categorical fallback when the muted set can't separate enough series */
  const m = document.getElementById('tab-charts');
  if (m) {
    const DATA = [
      { name: 'North', d: [20, 27, 33, 40, 46, 54, 61, 69] }, { name: 'South', d: [35, 33, 39, 38, 45, 49, 52, 57] },
      { name: 'East', d: [60, 55, 51, 48, 43, 40, 37, 34] }, { name: 'West', d: [14, 21, 20, 29, 33, 41, 47, 51] },
      { name: 'Cloud', d: [44, 49, 47, 54, 59, 57, 64, 71] }, { name: 'Edge', d: [27, 29, 37, 35, 41, 39, 46, 49] },
    ];
    const LIGHT6 = ['#4e79a7', '#bf6f0a', '#e15759', '#3f8c86', '#4a8a40', '#b07aa1']; /* Tableau-10 hues, the orange/teal/green darkened to clear 3:1 as thin lines on a near-white ground */
    const DARK6 = ['#6fa8dc', '#f6a96b', '#f47c74', '#5cc8bf', '#7ec77a', '#c39bdb'];
    const LIGHT_TAB20 = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];
    const DARK_TAB20 = ['#64a9d8', '#b3d1e6', '#d89a64', '#e6cab3', '#67d567', '#b3e6b3', '#d86465', '#e6b3b3', '#a078c4', '#cdb8e0', '#bb8b81', '#dbc2bd', '#d864b5', '#e6b3d6', '#9e9e9e', '#cccccc', '#d7d864', '#e5e6b3', '#64cdd8', '#b3e1e6'];
    const sl = DATA.map((s, i) => ({ ...s, c: LIGHT6[i] })), sd = DATA.map((s, i) => ({ ...s, c: DARK6[i] }));
    m.appendChild(chartPanel('#f4f4f2', 'light · standard Tableau 20', '#6b6b6b', [chartCategorical('#26262a', '#6b6b6b', sl, LIGHT_TAB20, 'Tableau 20 — light · use ≤7 at once (Healey)')]));
    m.appendChild(chartPanel('#1a1a1a', 'dark · brightened Tableau 20', '#9e9e9e', [chartCategorical('#ece2d4', '#9e9e9e', sd, DARK_TAB20, 'Tableau 20 — dark · use ≤7 at once (Healey)')]));
  }
}

/* ---- Corbusier Tufte gallery — the 3 preferred options, each across 16 Tufte forms, light → dark ---- */
const TUFTE_FORMS = [
  ['Sparkline', gSpark], ['Win / loss', gWinLoss], ['Range-frame line', chartLine], ['Slopegraph', gSlope],
  ['Small multiples', chartSM], ['Bar chart', gBars], ['Cleveland dot plot', chartDot], ['Lollipop', gLolli],
  ['Boxplot (Tufte)', gBox], ['Dot-dash scatter', gScatter], ['Histogram', gHisto], ['Horizon', gHorizon],
  ['Bullet graph', gBullet], ['Candlestick', gCandle], ['Forest plot', gForest], ['Calendar heatmap', gCal],
];
{ const m = document.getElementById('corb-gallery');
  if (m) {
    ['Corbusier Watercolour', 'Corbusier Light', 'Corbusier Dark'].forEach((name) => {
      const th = [...THEMES, ...ART].find((x) => x.name === name);
      const panel = h('div', { style: `background:${th.bg};border-radius:9px;padding:15px 16px;margin-bottom:16px` });
      panel.appendChild(h('div', { style: `font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;margin-bottom:13px;color:${th.emph}` }, name + ' — ' + TUFTE_FORMS.length + ' Tufte forms'));
      const grid = h('div', { style: 'display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:15px 14px' });
      TUFTE_FORMS.forEach(([label, fn]) => {
        const cell = h('div', {});
        cell.appendChild(h('div', { style: `font-size:8.5px;color:${th.muted};margin-bottom:3px;letter-spacing:.2px` }, label));
        cell.appendChild(fn(th));
        grid.appendChild(cell);
      });
      panel.appendChild(grid); m.appendChild(panel);
    });
  } }

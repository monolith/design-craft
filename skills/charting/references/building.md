# Building & extending the gallery

This skill ships **working reference code**, not just principles. To add a chart,
replicate the gallery, or stand it up elsewhere, copy from the gallery — it is
designed to be lifted. This file is the technical contract a fresh session needs.

## What's here, technically

- `references/charts/` — the **zero-dependency** Tufte gallery: `tufte-charts.js`
  (a tiny SVG helper library + one builder function per chart), `tufte-charts.css`
  (the one quiet palette + type), `index.html` (one mount node per chart). No
  framework, no build step, nothing fetched at runtime.
- `references/showcase/` — the richer 3D / relational visuals. These use
  libraries, but the libraries are **vendored locally** in
  `references/showcase/lib/` (three.js, OrbitControls, vis-network, force-graph)
  alongside a bundled `world-countries-110m.geojson`. The page fetches nothing
  from the network at runtime.

**Everything in this skill runs fully offline** — no CDN, no `npm install`, no
internet. That is deliberate; see "Firewalled / offline" below.

## Add a chart (the whole loop)

1. **Copy the nearest builder** in `tufte-charts.js` (e.g. `buildDotPlot`) and
   adapt it. Each is ~15–30 lines and self-contained.
2. Build with the **helper primitives already in the file** — do not reinvent:
   - `svg(w,h,cls)` / `svgEl(tag, attrs, children)` — create SVG nodes.
   - `scaleLinear([d0,d1],[r0,r1])` — value→pixel; also `.invert`.
   - `path(points,{close})`, `extent(arr, accessor)`.
   - `rangeFrameAxis(scale,{orient,pos,ticks,format})` — the Tufte range frame.
   - `directLabel`, `marginalTicks` — labels-not-legends, axis rug.
   - `sequentialColor(t)`, `divergingColor(val,t)` — the *only* place JS sets color.
3. **Register** it: add `'chart-N': buildYourChart` to `BUILDERS`
   (or `'anti-x-dont' / 'anti-x-do'` to `ANTI`).
4. **Add the mount** in `index.html`: a card with `id="chart-N"` containing
   `<div class="mount"></div>`. The registry finds it by id.
5. If it is a new *form*, add a row to the **chart-chooser** and the **catalog**
   in `SKILL.md`. (Anti-patterns are deliberately kept OUT of both — they must
   never be selectable as a usable form.)

## House rules (match these, or the gallery stops being one thing)

- **Palette lives in CSS** (`tufte-charts.css` custom properties, mirrored in the
  JS `C` object). Don't introduce new hues; one quiet palette, one accent used
  for one idea.
- **Defer every color / contrast decision** to `[[graphical-perception-and-color]]`.
  This skill owns *form*, not color.
- Range-frame axes, direct labels, no chart border or background fill, minimal
  ticks — the core moves listed in `SKILL.md`.

## Theming (light & dark)

The gallery is **light by design.** Color and theme — including dark mode — are
owned by `[[graphical-perception-and-color]]`, not this skill, and there is
deliberately **no dark twin** of the charts: the *forms* are theme-independent, so
a dark copy would teach nothing new while doubling maintenance.

To re-theme for a dark (or any host) palette, change the colors in **both** places
they live — the CSS custom properties in `tufte-charts.css` *and* the `C` object in
`tufte-charts.js` (the JS sets some mark fills directly) — then **re-check contrast
against the new background**: ≥3:1 for marks and lines, ≥4.5:1 for text (WCAG). A
bright accent that reads on white can drop below 3:1 on dark (and vice-versa), and a
sequential ramp must be re-derived so its lightness still runs monotonically against
the new ground. Don't eyeball it — compute the ratios. The trace-timeline worked
example in `[[graphical-perception-and-color]]` walks a full light→dark re-contrast
pass, every color re-derived ("was 2.1:1 → 5.2:1").

## Using a charting library, and getting a current API

Prefer **vanilla SVG**: most 2D forms here need no library and it always works.
Reach for a library only when the data is genuinely 3D, relational, or too large
to hand-build. When you do, the library's API may have moved since your training
cutoff — so confirm it. Which path you take depends on whether you have network:

- **Online** (the context7 MCP tools are connected, *or* you have plain web
  access): confirm the *current* API before writing — resolve the library, pull
  its docs, don't trust memory. This is the default whenever you can reach the
  network. Used personally outside a firewall, you are here.
- **Firewalled / offline** (corporate network, airgapped, headless run): assume
  **no** network — no CDN, no context7, no package registry.
  - Use only what is **vendored** in `references/showcase/lib/`. The vendored
    file's own source / type definitions are the source of truth — read them
    directly instead of guessing the API from memory.
  - Prefer the **zero-dependency SVG path** to avoid the dependency entirely.
  - If you genuinely must add a new library, **vendor it** — download the
    minified file and commit it locally next to the others. Never add a CDN
    `<script src="https://…">`: it fails silently behind a firewall and breaks
    the "runs offline" guarantee.

**Detect which mode you're in — don't assume.** Try one cheap lookup (a context7
resolve, or a small web fetch). If it is blocked or times out, you are offline:
switch to the vendored / SVG path and say so in your reply. The same plugin is
used both behind firewalls and on the open internet, so probe every time rather
than hard-coding an assumption.

## Preview & verify

- Serve over **plain HTTP**, not `file://` — ES modules and the showcase's
  geojson both need an http origin: run `python3 -m http.server` inside
  `references/charts/` (or `references/showcase/`). This needs no internet.
- Before claiming a chart is done: run `node --check tufte-charts.js` (syntax),
  load the page, and watch the console — `drawAll` wraps each builder in
  try/catch and logs `build failed for <id>` if one throws. A clean console plus
  a visible chart is the bar; syntax-passing alone is not.

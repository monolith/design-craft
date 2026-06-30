---
name: typography
description: Use when choosing or setting type for a web page, app, dashboard, chart, or document — picking typefaces, sizes, line length and leading, type scale and hierarchy, pairing fonts, numerals for tables and charts, web-font loading/performance, or text accessibility. Also when judging claims about type (serif vs sans, "dyslexia fonts", "ugly fonts aid memory", which font reads faster). Evidence-based: separates proven findings from convention and myth, with named-expert sources where research runs out. Defers colour/contrast to graphical-perception-and-color, chart forms to charting, and page layout to interface-ux-and-layout. Part of the design-craft toolkit — developing-style is the art-director (it sets the theme/feel and coordinates); all the skills apply together on every piece, this one as a specialist lever.
---

# Typography (evidence-based)

## Overview

Most type advice is taste, folklore, or marketing. A smaller set is backed by controlled
studies and standards. This skill is the backed set, with confidence labels, so decisions
cite evidence — and so the big myths (serif reads better, ugly fonts aid memory, dyslexia
fonts help) get called out instead of repeated.

**Core principle.** **Legibility before personality.** What a face *says* (mood, freshness) is
real but is **taste, not performance** — controlled work finds no universal "faster" font and
shows reader preference does not predict reading speed. So spend the proven levers first —
**comfortable size, enough x-height, generous leading, a sane measure, conventional letterforms,
and clear hierarchy** — then choose a face for voice. Reach for a *second* typeface only after
weight/size/space/colour within one family run out.

**Confidence labels:** **[STRONG]** = controlled study or normative standard · **[CONVENTION]** =
established practice from a named authority/design system, weak or no controlled support ·
**[MYTH]** = the evidence contradicts the popular claim.

**How to apply (default posture).** The **[STRONG]** findings and WCAG criteria are *binding* — don't
relax one on your own. The labelled **defaults** (the recommended typefaces, tabular figures for data,
a ~16px body floor, the system-font stack) are the *starting point* — use them unless the brief says
otherwise. **[CONVENTION] / [taste]** items (scale ratios, pairings, which voice) are softer — follow
them unless there's a specific reason not to. Deviate only on request or a stated condition, and
**surface the trade-off** rather than switching silently. The user overrides anything.

## Boundary — how this composes with the sibling skills

Type, colour, layout, and charts are one toolkit; each skill owns one lever.

- **Contrast / luminance / colour** → **[[graphical-perception-and-color]]**. That skill owns WCAG
  contrast ratios and the palette role tokens. Here we set type *for* a colour theme (ink on ground,
  one reserved accent) but never re-derive contrast.
- **Chart forms & data-ink** → **[[charting]]**. That skill owns which chart and how minimal. Here we
  set the *type inside* it — axis/label sizes, tabular figures, direct labels.
- **Page layout, nav, hierarchy-of-blocks** → **[[interface-ux-and-layout]]**. That skill owns where
  blocks go and scanning patterns. Here we own the type that fills them.
- **Measure (line length)** is the one shared lever — it's a type property (set by font + size) that also
  constrains the grid. **We own the ~45–75-character target here;** **[[interface-ux-and-layout]]** references it.
- **Precedence with `frontend-design` (Anthropic) — design-craft sets the type, frontend-design builds it.** This skill owns the type decisions (faces, scale, measure, leading, pairing, the Modernist kit); `frontend-design` is the production-code implementer that renders them in clean, distinctive code. Lean on it for code quality, not for overriding the type. It enters a *type* decision only as a fallback when: this skill doesn't cover it (e.g. a required brand display face not in the kit — we still check legibility); the guidance is a weak lean (two sound pairings); the user rejects the options; or the user wants a drastic directional change (an expressive, experimental type voice). **Hard floor (never yields to frontend-design): legibility — minimum body sizes, no sub-AA contrast, no proportional figures in tables.** Evidence labels are unchanged.

Worked examples (the pairings, data figures, scale, and load-reducing settings, in the colour skill's
palettes) live in the visual gallery: [references/type-gallery/index.html](references/type-gallery/index.html).

## Quick reference (decision rules)

| Decision | Rule | Confidence |
|---|---|---|
| Serif vs sans for reading | No inherent difference under matched conditions — pick by voice, not "readability". | [STRONG / MYTH-buster] |
| "This font reads faster / feels better" | Preference does **not** predict reading speed; no universal fast font. Treat as taste. | [STRONG] |
| Body size | Comfortable size with enough **x-height**; ~**16px** web body floor; never below the legibility floor. | [STRONG floor / CONVENTION 16px] |
| Measure (line length) | Aim ~**45–75** characters; avoid ~100 (hurts comprehension). The "66" target is convention. | mixed; long-line harm=[STRONG] |
| Leading (line-height) | ~**1.4–1.6×** body size for prose; support 1.5× without breakage (WCAG 1.4.12). | CONVENTION / WCAG |
| Hierarchy | Distinct headings/levels — proven to aid scanning **and** recall. Build it. | [STRONG] |
| Second typeface | Only after weight/size/space/colour in one family are exhausted; then pair by **contrast**. | [CONVENTION] |
| Numbers in tables/charts | **Tabular lining** figures (`tnum`); disambiguated digits (slashed zero). | [CONVENTION + STRONG legibility] |
| ALL-CAPS body / wide tracking | Don't — no body-size benefit; tracking can slow skilled readers. Caps only help at tiny sizes. | [STRONG against] |
| "Dyslexia-friendly font" (OpenDyslexic) | No benefit; often **worse**. Use plain sans + size/spacing. | [MYTH] |
| "Ugly/hard fonts improve memory" | Failed replication. Don't degrade type to aid learning. | [MYTH] |
| Web-font loading | `font-display: swap` + **metric-matched fallback** (size-adjust) to kill layout shift; WOFF2; subset; budget the families/weights. | [CONVENTION / best-practice] |

## 1. Legibility — what's proven, what's myth

- **[STRONG / MYTH]** **No inherent serif-vs-sans advantage.** Fonts differing *only* in serifs show
  no legibility or reading-speed difference; Times and Helvetica are "interchangeable" at matched
  x-height (Arditi & Cho 2005; Daxer 2022). Any serif edge appears only at the acuity limit (very small
  or distant) and is attributed to **spacing**, not serifs. Pick serif or sans for *voice*, not "which reads better".
- **[STRONG]** **Preference ≠ reading speed, and there is no universal fast font.** Within one person,
  speed varies ~35% across fonts with no comprehension loss; preference correlates near-zero with speed
  (r≈−0.13) even with size controlled (Wallace et al., TOCHI 2022; Rello & Baeza-Yates 2016). So "looks
  fresher / feels nicer" is **taste**, labelled as such — never asserted as performance.
- **[STRONG against]** **ALL-CAPS** only helps at *tiny* sizes / low vision (the letters are physically
  bigger); the advantage vanishes at comfortable body sizes — so no caps for body text (Arditi & Cho 2007).
- **[STRONG against]** **Wide letter-spacing (tracking)** speeds single-*word* recognition but gives **no
  words-per-minute gain** and can **slow skilled readers** — don't add tracking to body text to "improve
  readability" (Korinth et al. 2020). Tracking is for caps/small-caps and tight display, not prose.
- **The real legibility levers** are size, x-height, spacing, and conventional letterforms (next sections).

## 2. Size, measure & leading

- **[STRONG] x-height, not point size, is the legibility metric.** The x-height fraction ranges 0.28–0.58
  of body size across faces (mean 0.46; Karow), so two fonts at the same px can differ ~2× in actual letter
  height. Choose **high-x-height** faces for UI/body/data and judge by x-height, not the px number.
- **[STRONG] The legibility floor (critical print size) ≈ 0.2° x-height** (~9pt Times at 40cm). Above it
  there's a broad **"fluent range" (~0.2°–2°, ≈4–40pt x-height)** where reading speed is flat — so once text
  clears the floor, bigger buys no speed, only comfort/emphasis (Legge; the "Does Print Size Matter" review).
- **[CONVENTION] ~16px web body floor** — widely taught (Material, iOS, Refactoring UI); comfortable, not a
  controlled constant. Treat as a default, and **set it in `rem`** so the user's zoom/base size is respected.
- **Measure (line length):** **[STRONG]** very long lines (~100 cpl) hurt comprehension vs ~55 (Dyson &
  Haselgrove 2001). The broad **~45–75 character** target (Bringhurst's "66") is **[CONVENTION]** and the
  literature is mixed — so treat 45–75 as a sane band, not a law. WCAG 1.4.8 (AAA) caps at 80.
- **Leading (line-height):** **[CONVENTION]** ~**1.4–1.6×** for prose, tighter for big display, looser for
  small/long measure (Material uses 1.5× body / ~1.2× display). **[WCAG 1.4.12, AA]** must not break when the
  user sets leading **1.5×**, paragraph spacing **2×**, letter-spacing **0.12em**, word-spacing **0.16em**.
- **[STRONG, for impaired readers]** Generous spacing is a real load lever: doubling line/word spacing raised
  reading speed ~26–46% and **more than halved errors** for low-vision (macular) readers (Blackmore-Wright 2013).

## 3. Type scale & hierarchy

- **[STRONG] Clear hierarchy aids scanning AND comprehension/recall** — not just looks. Eye-tracking shows the
  "layer-cake" scan (gaze rides headings/subheads) is the *most effective* scanning mode (NN/g); controlled
  reading studies show adding **headings raises recall and topic-structure memory** (Lorch & Lorch; Hyönä).
  **So build distinct, scannable hierarchy.** Tie page-level structure to **[[interface-ux-and-layout]]**.
- **[STRONG] Emphasis works by contrast — selective, not blanket.** When only *half* the topics carried
  headings, the signalled ones were remembered *even more*, the unsignalled *less* — marking everything dilutes
  the signal (Lorch). Emphasise the few things that matter; if everything's bold, nothing is.
- **[CONVENTION] Type scales / ramps / ratios are design decisions, not derived from evidence.** A strict
  constant-ratio "modular scale" is taste — major systems use **non-constant** ramps on purpose (Material 3's
  15-style role×size ramp; IBM Carbon's additive, non-geometric scale). Use a scale for *consistency*, not
  because a ratio is "correct". Hierarchy's first levers are **size, weight, space, and colour** — reach for a
  second typeface only when those run out (§4).

## 4. Pairing & functional differentiation

Pairing aesthetics have little controlled evidence — say so. The rules below are **[CONVENTION]** from named
authorities; the *value of hierarchy itself* (§3) is the [STRONG] part.

- **[CONVENTION — Lupton, Bringhurst] Pair by CONTRAST, not similarity.** Two faces that are clearly different
  read as intentional; almost-but-not-quite-the-same **clash** ("too close for comfort"). What matters is
  underlying *compatibility* (shared structure), not surface sameness — a square and a circle pair better than
  a square and a slightly-rounded square (Brown).
- **[CONVENTION — Tim Brown] One anchor, chosen first; make body text the anchor.** Body text is most of the
  content and text faces survive many sizes/resolutions where display faces fail — so pick the body face first
  and let everything reference it. **Two typefaces is usually plenty; rarely more than three.**
- **Weight/style/size/case/colour *within one family* is the first emphasis lever.** A single good family
  (or a superfamily) often needs no second face. Reach for a second family only when it earns a job.
- **[CONVENTION] Functional differentiation — typeface/style as a signal of *content type*.** Use a change of
  face to say "this is a different kind of thing": a **quiet sans** for UI chrome and axis labels, a **voice
  face** (serif or distinctive sans) for editorial headings, **monospace** for code and for aligning data, and
  **tabular lining figures** for numbers (§5). The contrast *communicates*; that's when a second face earns its place.
- **Superfamily vs cross-family.** A **superfamily** (one system spanning sans/serif/mono/condensed —
  **IBM Plex**, **Source Sans/Serif/Code**) gives functional contrast with guaranteed harmony: lowest-risk pairing.
  Cross-family (e.g. **Inter** body + **Newsreader**/**Lora** serif display; a grotesque + a serif) gives more
  voice for more risk. **Pitfall:** too many families, or two faces too similar to read as deliberate.

## 5. Numerals & data typography (composes with [[charting]])

- **[CONVENTION + mechanical fact] Tabular *lining* figures for any column of numbers** — tables, axes,
  dashboards. `font-variant-numeric: tabular-nums` (`tnum`) makes every digit the same width so columns align;
  `lining-nums` keeps them on the baseline. **Proportional** figures (`pnum`) and **old-style** figures (`onum`,
  with descenders) are for *running prose*, where even colour/rhythm beats column alignment — using them in a
  number column breaks vertical alignment (MDN; OpenType spec).
- **[STRONG] Small/glance legibility is driven by letterform clarity.** Chart/axis/table text is small and read
  at a glance, where *letter recognition is the bottleneck* (Legge). **Open apertures** measurably raise
  recognition for glance reading (closed apertures hurt; Beier & Oderkerk 2021, 2022), and **disambiguated
  digits** (slashed/dotted zero, distinct 1/l/I, 6/8) reduce misreads. Prefer faces built for this.
- **[CONVENTION — ONS] Chart-text size floor ≈ 14px**, 12px only in small multiples. Keep labels quiet (no
  heavy weights or ALL-CAPS competing with the data), let **direct-labelling** (owned by **[[charting]]**) carry series names over legends where possible,
  and let the type defer to the data-ink and the restrained palette (Tufte; the sibling skills).
- **Good data faces** ship these features: **IBM Plex Sans/Mono** (Carbon's data-viz anchor), **Inter**
  (tabular nums + slashed zero), **Source Sans**, **Atkinson Hyperlegible** (built for letterform
  disambiguation), and **monospace** (**JetBrains Mono**, **IBM Plex Mono**) where strict alignment or a
  "this is data/code" signal helps.

## 6. Cognitive load — type that's effortless to read

- **[STRONG / mechanism] Fluency lowers effort and reads as "I like it".** Easy-to-process text (legible,
  conventional letterforms, high figure-ground contrast, adequate size/spacing) lowers reading effort and lifts
  affect — and the brain misattributes the ease as liking (Reber/Winkielman; the UX skill's fluency findings).
  **The biggest load levers are the proven ones in §§1–2: size, x-height, contrast, spacing, conventional
  forms, restraint.** Reducing *extraneous* typographic load (low contrast, crowding, tight tracking, too-small
  text, long measure, justified rivers, decorative faces) frees attention for meaning.
- **[MYTH] "Harder-to-read / ugly fonts improve memory" (desirable difficulty).** The famous 2011 result
  (tiny n=28, just-significant) **failed to replicate** at scale — Sans Forgetica showed *no* memory benefit
  across ~300 participants and a 1-week test; the literature is mixed-to-null and sometimes shows a memory
  *cost* (Huff & Maxwell 2022, ~300 participants; also Geller; Taylor; review by Thiessen, Beier & Keage 2020). **Do not degrade type to aid
  learning.** Genuine desirable difficulties (e.g. self-testing) work; disfluent type does not.
- **[CONVENTION] Left-aligned / ragged-right** over justified for screen text — justification opens "rivers"
  and uneven spacing; WCAG 1.4.8 (AAA) explicitly says don't justify.

## 7. Web-font performance & rendering

- **[CONVENTION / best-practice] `font-display: swap`** shows text immediately in a fallback then swaps
  (FOUT) — avoid `block`'s invisible-text (FOIT) for body. Consider `optional` for non-critical faces.
- **[CONVENTION] Kill the swap layout shift (CLS) with a metric-matched fallback.** The swap jumps because the
  fallback and web font differ in size; tune a local fallback with `size-adjust` / `ascent-override` /
  `descent-override` / `line-gap-override` so it occupies the same space (tooling: **Fontaine**, Fontsource).
  Fontaine's own demo dropped CLS 0.34→0.013 (vendor demo, not an independent trial).
- **[STRONG-ish fact] Shared-CDN caching no longer helps.** Chrome (and other browsers) **partition the HTTP
  cache** by site, so a font fetched on site A is re-downloaded on site B (Google 2020). Combined with privacy,
  this favours **self-hosting**. Add `preconnect`/`preload` for the critical face.
- **[CONVENTION] Budget & format:** **WOFF2**, **subset** with `unicode-range`, and limit families/weights
  (each weight is bytes). **Variable fonts** save bytes when you use *many* weights/widths from one file but
  cost more for just one or two — decide by how many axes you actually ship.
- **[CONVENTION] The zero-latency default is the system-font stack** (`system-ui, -apple-system, "Segoe UI",
  Roboto, …`): no download, native rendering, instant — at the cost of cross-platform consistency. A fine
  default for UI; bring a web font when voice matters.
- **Always give every web font a named fallback chain**, not a bare generic — sans →
  `system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`; serif → `Georgia, "Times New Roman", serif`;
  mono → `ui-monospace, "SF Mono", Menlo, Consolas, monospace` — so a failed load degrades to a good system face, not Times.
- **This skill's galleries are fully self-hosted** — the fonts are bundled as Latin-subset WOFF2 in
  [references/type-gallery/fonts/](references/type-gallery/fonts/) with a generated `fonts.css`, so the examples render
  with **no network dependency** (the §7 self-hosting + subsetting advice, demonstrated). Regenerate with the fetch
  script if the kit changes.

## 8. Accessibility of type

- **[STRONG / normative — WCAG 2.x AA]** Build so users can override spacing and size without breakage:
  - **1.4.12 Text Spacing:** survive line-height **1.5×**, paragraph **2×**, letter **0.12em**, word **0.16em**.
  - **1.4.4 Resize Text:** usable at **200%** zoom, no lost content/function.
  - **1.4.10 Reflow:** no two-dimensional scrolling down to **320 CSS px** (≡ 1280px @ 400%).
  - Practical: size in **`rem`/`em`, not `px`**; never disable zoom (`user-scalable=no`).
- **1.4.8 Visual Presentation (AAA, aim for it):** measure ≤ 80 chars, leading ≥ 1.5×, **not justified**.
- **[MYTH] "Dyslexia-friendly fonts" (OpenDyslexic / Dyslexie).** Controlled studies show **no** reading-rate
  or accuracy benefit — and OpenDyslexic often reads **worse** than Arial/Verdana (Wery & Diliberto 2017; Rello
  & Baeza-Yates 2016). The British Dyslexia Association's own guidance recommends **plain sans-serif** (Arial,
  Verdana, Open Sans…) and never names a special font. **What actually helps:** larger size, generous
  line/letter spacing, shorter measure, good contrast, left-aligned — the same proven levers, for everyone.

## Recommended default — the Modernist kit, beauty-forward, on Corbusier

**The house default (use it on any open brief): the Modernist kit — Bricolage Grotesque (headings) +
Plus Jakarta Sans (body, UI, chart/table labels) + IBM Plex Mono (numbers, code, data) — set on a
[[graphical-perception-and-color]] Corbusier theme (Light / Dark / Watercolour).** Chosen to be *beautiful*
(a graphic designer would be proud of it) while staying modern, **not dated**, and aligned with the system:
Bricolage is a contemporary **grotesque** — the modernist typographic voice, same lineage as Corbusier's
architecture — confident and elegant at large sizes with no classical or vintage feel; Plus Jakarta Sans is a
sleek, quiet, screen-clean body; **Plex Mono keeps numbers tabular and data-honest** (Tufte). It looks gorgeous
on an editorial/brand page *and* holds up under dense data. Worked both ways — a beautiful editorial page and a
Tufte data page — in [references/type-gallery/default-modernist.html](references/type-gallery/default-modernist.html);
under heavy load (program/PM and quant data science, compact many-column tables) in
[references/type-gallery/data-dense.html](references/type-gallery/data-dense.html).

**This is the lean — hold it unless the user's need calls for something else** (then surface the trade-off, per
the default-posture rule at the top). Every pick is screen-built, free/open, with tabular figures, so it composes
with Tufte data-ink and the restrained palette. Beauty is taste — set on the legible, data-honest foundation above.

- **The default trio:** **Bricolage Grotesque · Plus Jakarta Sans · IBM Plex Mono** on a Corbusier theme.
- **More elegant / editorial voice:** swap the display to **Instrument Serif** (high-contrast, refined) or
  **Fraunces** (warm); keep Plus Jakarta + Plex Mono so reading and data never change. (See `sleek.html`.)
- **More geometric voice:** swap the display to **Space Grotesk**.
- **Uniform engineered system (data-dense products, docs):** the **IBM Plex superfamily** (Serif + Sans + Mono) —
  one harmonised system, lowest-risk; the prior default, now an alternative. (See `corbusier-type.html`.)
- **Need only one face:** **Plus Jakarta Sans** or **Inter** alone (or the **system-font stack** for zero-latency
  UI) — hierarchy by weight/size/space. *One family is often enough.*
- **Maximum letterform disambiguation** (dense data, low vision): **Atkinson Hyperlegible**. Chart text ≥ 14px.

Go more expressive (louder display faces, higher contrast) only when the brief asks for it — and keep the body
face quiet and legible regardless.

**Curated kits (1–3 faces that work together; all free/open, screen-built, with tabular figures).** The first is
the default above; the rest are for other registers. Sample pages: the default across the three Corbusier grounds
in [references/type-gallery/corbusier-type.html](references/type-gallery/corbusier-type.html); the others in
[references/type-gallery/pages.html](references/type-gallery/pages.html):

| Kit | Faces (display · body/UI · mono) | Register / message |
|---|---|---|
| **⭐ Modernist (DEFAULT)** | **Bricolage Grotesque · Plus Jakarta Sans · IBM Plex Mono** | the house lean — beautiful + modern + data-honest; brand, editorial **and** dense data |
| **Elegant** | **Instrument Serif** · Plus Jakarta · Plex Mono | exhibitions, luxury, refined editorial — *high-contrast, gorgeous* |
| **Warm editorial** | **Fraunces** · Plus Jakarta · Plex Mono | brands with personality — *crafted, friendly* |
| **Plex superfamily** | IBM Plex **Serif · Sans · Mono** | data-dense products, docs — *uniform, engineered* (prior default) |
| **One family** | **Plus Jakarta Sans** / Inter alone | clean, neutral, fast — *the cheapest robust default* |

Rule of thumb: **two faces is plenty, three is the ceiling, one is often enough** — pair by contrast, make the
**body face the anchor**, and add a face only when it earns a distinct job (§4).

## Common mistakes

- Choosing a face for "readability" when it's really voice. (No inherent serif/sans advantage — pick for tone, set it legibly.)
- Treating a font *preference* as proof it reads faster. (It doesn't predict speed.)
- ALL-CAPS or extra tracking on body text "to improve readability". (No benefit; can slow reading.)
- Proportional figures in a number column. (Use `tabular-nums` so digits align.)
- A strict modular ratio asserted as correct. (Scales are taste/consistency, not evidence.)
- Reaching for a second typeface before exhausting weight/size/space/colour. (One family usually suffices.)
- Sizing in `px` and disabling zoom. (Use `rem`; respect the user's size — WCAG 1.4.4/1.4.12.)
- Specifying a "dyslexia font" or degrading type "to aid memory". (Both are myths; use the proven levers.)
- Loading many families/weights with no `font-display` or metric-matched fallback. (FOUT/CLS and wasted bytes.)

## Citations (primary)

- Arditi & Cho (2005), *Vision Research* 45:2926 — serifs make no legibility/speed difference.
- Daxer et al. (2022), *Ophthalmic & Physiological Optics* 42:1180 — Times vs Helvetica interchangeable.
- Wallace et al. (2022), *ACM TOCHI* (10.1145/3502222) — ~35% within-person font speed variance; preference ≠ speed.
- Arditi & Cho (2007), *Vision Research* — uppercase advantage is size-dependent (tiny sizes only).
- Korinth, Gerstenberger & Fiebach (2020), *Frontiers in Psychology* — wide tracking helps words, not reading rate.
- Dyson & Haselgrove (2001), *IJHCS* 54:585 — 55 cpl beats 100 cpl on comprehension.
- Legge, Mansfield & Chung (2001) + Legge & Bigelow (2011) review — critical print size ≈0.2° x-height, fluent range, letter-recognition bottleneck.
- Karow (1993) — x-height fraction 0.28–0.58 across 1049 faces.
- Beier & Oderkerk (2021) — open apertures (a, c, e, r, s) raise glance recognition; Beier & Oderkerk (2022), *Applied Ergonomics* 101:103709 — closed letter counters impair recognition.
- Lorch & Lorch; Hyönä & Lorch — headings raise recall and topic-structure memory; signalling is contrastive.
- NN/g — layer-cake scanning is the most effective scan pattern.
- Tim Brown, *A Pocket Guide to Combining Typefaces* — anchor = body face; compatibility ≠ similarity.
- Ellen Lupton, *Thinking with Type* — pair by contrast; "too close for comfort".
- Material 3; IBM Carbon / IBM Plex; ONS Service Manual (14px chart floor) — type-scale & data conventions.
- MDN `font-variant-numeric`; OpenType spec — tabular/lining/old-style/proportional figures.
- W3C WCAG 2.2 — SC 1.4.4, 1.4.8, 1.4.10, 1.4.12 (exact thresholds).
- Wery & Diliberto (2017); Rello & Baeza-Yates (2016); British Dyslexia Association style guide — OpenDyslexic no benefit; plain sans recommended.
- Huff & Maxwell (2022), *Cognitive Research: Principles and Implications* — ~300-participant DRM replication, no memory benefit from Sans Forgetica; Geller et al.; Taylor et al.; Thiessen, Beier & Keage (2020) — disfluency-aids-memory failed to replicate.
- Blackmore-Wright et al. (2013), *PLoS ONE* — spacing raises low-vision reading speed ~26–46%, halves errors.
- web.dev / Chrome (font-display, metric overrides); Google (2020) HTTP cache partitioning; Fontaine — web-font performance.

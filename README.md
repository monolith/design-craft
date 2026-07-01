# Design Craft

**Evidence-based visual & interface design — seven evidence skills that compose into one toolkit, plus three style skills, art-directed by an orchestrator.**

Most design advice is taste or folklore. A smaller set is backed by controlled experiments and
standards. The **seven evidence skills** are that backed set, each with confidence labels so decisions cite
evidence instead of preference. **The shared label taxonomy (used across every skill):**

- **[STRONG]** — controlled study or normative standard (and, where a skill ran its own adversarial verifier, confirmed by it)
- **[ESTABLISHED]** / **[extracted]** — sourced but **not** adversarially re-verified in that skill's pass; trust one notch below [STRONG]. ([ESTABLISHED] = canonical external literature; [extracted] = surfaced from the skill's own research corpus — same band, different provenance.)
- **[CONVENTION]** — widely taught / named-authority practice; thin or mixed empirical support
- **[taste]** — no evidence either way; a declared aesthetic choice
- **[MYTH]** — the evidence contradicts the popular claim; do not use

Most skills ship a **zero-dependency worked gallery** (pure HTML/CSS/SVG, self-hosted fonts) so you
can see each rule on screen, and name the study or expert behind every claim. *(imagery's is a first-round set, refining via the like/not loop.)*

## The seven evidence skills

| Skill | Owns | One-line |
|---|---|---|
| **composition-and-design-theory** | arrangement, hierarchy, gestalt, figure-ground, meaning | Compose the whole field as one deliberate system so it reads as finished work, not a template. Fusion vs juxtaposition; a 41-plate gallery. |
| **graphical-perception-and-color** | colour, contrast, palettes, CVD, perception | Pick the *encoding* before the *colour*, and *contrast/brightness* before *hue*. Includes the Corbusier palette system + colour-wheel theory. |
| **charting** | chart forms, data-ink, Tufte | Pick the right chart for the question; render it clean and minimal. Sparklines → tear-sheets, a worked SVG gallery. |
| **interface-ux-and-layout** | page structure, navigation, grids, hierarchy, usability | Control where the eye goes first/next/last. Fluency, accessibility, usability heuristics — taste labelled as taste. |
| **typography** | type choice, size, measure, scale, pairing, web-font loading, text a11y | Legibility before personality. The Modernist default kit (Bricolage · Plus Jakarta · Plex Mono) on Corbusier. |
| **branding** | logo/identity design, brand colour intent, personality, redesign risk | Design or evaluate a visual identity by *fit* to objective, not a universal best. Evidence-ranked; a 12-plate gallery. |
| **imagery** | selecting / critiquing / directing photos & illustration, treatment, alt text | The image must *carry the message*. Select good photos, critique them, direct light treatment; the illustration direction is a **constructed scaffold** (Pohl / Favre / Ngai / Lupi, synthesised not copied). Does **not** generate photos. |

## How they compose (the wiring)

**The orchestrator is the art-director.** It sets the theme, mood, and concept, then deploys the specialists —
each owns **one lever** and **defers the rest** to its siblings (via `[[skill-name]]` links and explicit
"defers to" boundaries), so they never duplicate or contradict. On any given piece the evidence skills apply
together:

- **composition-and-design-theory** owns the *arrangement* — what goes where, hierarchy, gestalt, meaning —
  and defers colour, type, chart forms, and screen layout to the skills that own them.
- **graphical-perception-and-color** owns colour / contrast / encoding — the skill every other one defers colour to.
- **charting** owns chart *forms* and data-ink; defers all colour to colour, type-in-charts to typography.
- **typography** owns type; defers colour to colour, chart forms to charting, page layout to interface-ux —
  and *owns* the type inside charts/tables (tabular figures, ≥14px labels).
- **interface-ux-and-layout** owns page structure / nav / grids / usability; defers chart forms to charting and colour to colour.
- **branding** owns logo / identity / personality; defers colour science to colour and type selection to typography.
- **imagery** owns image selection / critique / treatment / alt text and the illustration direction; defers colour to colour, arrangement to composition, style-invention to developing-style. Does not generate photographs.

The shared house look is **Corbusier** (the colour skill's muted palette + the type skill's Modernist kit),
demonstrated end-to-end in the typography galleries (`default-modernist.html`, `data-dense.html`). Collisions
resolve by the **deference map**: the lever's owner wins on its lever; **a floor always outranks a look**; the
art-director breaks ties toward concept and mood — never through a floor.

## Three style skills (the layer on top)

Above the seven evidence skills sit three skills about *style* — all **strictly subordinate** to the four floors (AA contrast, chart honesty, legibility, focus/target/zoom). They add a look; they never break a rule, and all run the four-floor **pass-gate** before anything ships. They are three *look-sources*, one per intent:

| Skill | Owns | One-line |
|---|---|---|
| **house-style-templates** | *apply* design-craft's own house look (reference-only, no agent) | A library of **directional house-look templates** the art-director draws from. **⚠️ WORK IN PROGRESS — the templates are not built yet;** the most overridable layer, declared taste. |
| **developing-style** | *invent* a new, ownable style | An evidence-based, repeatable process for an original, distinctive style: learn the convention, then deviate — imitate-then-deviate from an *unfamiliar* domain, reduce to a small vocabulary, hold a few constants. Style-formation research bundled in `references/`. |
| **brand-absorption** | *follow* an existing brand (conditional) | Capture an existing brand's colour, type, logo, imagery, and structural "hand" into a binding Brand Direction for a facelift/reskin — so the work still reads as *them*, not the house style. |

Same input (study a reference), three intents: **house-style-templates applies** the house look, **developing-style deviates** to invent a new one, **brand-absorption preserves** an existing one.

## The worked galleries

Each skill's `references/` holds an offline HTML gallery. Serve any skill's gallery folder and open it:

```bash
# example: the typography galleries
cd skills/typography/references/type-gallery && python3 -m http.server 8143
# then open http://localhost:8143/  (and /default-modernist.html, /data-dense.html, /sleek.html, …)
```

Galleries by skill:
- `skills/composition-and-design-theory/references/gallery/` (41 worked plates)
- `skills/graphical-perception-and-color/references/perception-gallery/` and `…/color-theory-findings/`
- `skills/charting/references/` (Tufte gallery + showcases)
- `skills/interface-ux-and-layout/references/ux-gallery/` (components → whole pages)
- `skills/typography/references/type-gallery/` (specimens, kits, dense-data, self-hosted fonts in `fonts/`)
- `skills/branding/references/plates/` (12 identity plates)

Fonts are **self-hosted** (Latin-subset WOFF2 bundled in `type-gallery/fonts/` + a generated `fonts.css`),
so the typography examples render with **no network dependency**.

## Built on top of `frontend-design` (Anthropic) — install both

design-craft and `frontend-design` are a **designer → implementer** pair, not rivals. **design-craft sets the
design** — the UI, charting, colour, and type *decisions*. **`frontend-design` implements them** in clean,
distinctive, production-grade code, and is leaned on for code quality and technical execution. Install both.

**The precedence (encoded in every skill's boundary):**

| Question | Owner |
|---|---|
| What the design *is* — composition/arrangement, chart form, colour/theme, layout & hierarchy, type, brand identity, imagery | **design-craft** — leads on everything it covers |
| How it's *built* — production code, code quality, technical execution | **frontend-design** — implements design-craft's decisions |
| A *design* call where design-craft (a) doesn't cover it, (b) only weakly leans, (c) the user rejects its options, or (d) the user wants a drastic directional change | **frontend-design** — steps in as a fallback helper |
| Accessibility + chart honesty (WCAG contrast, CVD-safety, never-colour-alone, focus-visible, target size, legibility, chart integrity, alt-text/non-text-content) | **design-craft** — an **absolute floor**; a fallback never crosses it, only an explicit user override does |

In short: **design-craft decides the design and `frontend-design` builds it.** frontend-design is pulled into a
design decision only in the four fallback cases above — never through the accessibility/honesty floor. The
[STRONG]/[CONVENTION]/[MYTH] labels still tell the truth underneath: leading on a [CONVENTION] default (e.g.
Corbusier) is a house-standard call, not a proof claim.

> This is declared formally: `plugin.json` lists `frontend-design` in its **`dependencies`** field (with
> `marketplace: "claude-plugins-official"`), and this marketplace allowlists that cross-marketplace dep — so
> Claude Code **auto-installs `frontend-design`** when you install design-craft (requires Claude Code v2.1.110+).

## The agent team (`agents/`)

The plugin ships a matching **agent team** — one agent per skill plus an orchestrator — so a design can be produced *by the plugin, through its agents*, not by one skill-load:

- **`dc-orchestrator`** — runs the whole team. Its protocol every run: review what's available and **propose a direction, then CONFIRM it with the user before building** → assign each agent a **weight** by goal (luxury → branding leads; graphic/poster → composition; data/dashboard → charting; app → ux; new style → developing-style) and name the leading agent → brief every agent with that direction → build → **scored refinement loop** (each agent scores the result 0–10 and flags critical blockers; the gate passes only when the **leading agent ≥9**, **branding — and developing-style if a style was invented — ≥8**, **all others ≥7**, and **no blocker**) → an **art-director final pass** that scores the result against the confirmed direction and must hit **≥9**, else it refines again with shortfall feedback → render and ship. design-craft decides, frontend-design implements.
- **`dc-orchestrator`** is the **art-director** — it sets theme/feel and arbitrates; **`developing-style`** (invents a new, distinctive style when the brief needs one), **`graphic-composition`, `perception-and-color`, `tufte-charting`, `typesetting`, `ux`, `brand-design`, `imagery`** are the specialist levers; **`brand-capture`** is conditional (only when adopting an existing brand). **`house-style-templates`** is a **reference-only skill** — a library of directional house-look templates the art-director draws from — **not an agent**.

Collisions resolve by a **deference map** (each lever's owner wins on its lever; a floor always outranks a look or direction; the art-director breaks ties toward concept and mood, never through a floor). The four floors — AA contrast, chart honesty, legibility, focus-visible/≥44px — are absolute, plus **imagery's non-text-content/alt-text floor** on any piece with images.

## Install

This directory is both a plugin and a single-plugin marketplace.

```
# the companion (Anthropic, official marketplace)
/plugin install frontend-design

# this plugin
/plugin marketplace add /path/to/design-craft
/plugin install design-craft@design-craft
```

The ten skills then activate automatically — the seven evidence skills (composition, colour, charts, layout, type, branding, imagery); the three style skills when you are applying, inventing, or absorbing a look.

> Note: if you already have these as personal skills under `~/.claude/skills/`, remove those copies
> after installing the plugin to avoid duplicate skill names.

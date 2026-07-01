# Design Craft

**Evidence-based visual & interface design — four evidence skills that compose into one toolkit, plus two style skills on top.**

Most design advice is taste or folklore. A smaller set is backed by controlled experiments and
standards. These four skills are the backed set, each with confidence labels so decisions cite
evidence instead of preference:

- **[STRONG]** — controlled study or normative standard
- **[CONVENTION]** — established best practice from a named authority / design system (weak or no controlled support)
- **[MYTH]** — the evidence contradicts the popular claim

Every skill ships a **zero-dependency worked gallery** (pure HTML/CSS/SVG, self-hosted fonts) so you
can see each rule on screen, and names the study or expert behind every claim.

## The four skills

| Skill | Owns | One-line |
|---|---|---|
| **graphical-perception-and-color** | colour, contrast, palettes, CVD, perception | Pick the *encoding* before the *colour*, and *contrast/brightness* before *hue*. Includes the Corbusier palette system + colour-wheel theory. |
| **charting** | chart forms, data-ink, Tufte | Pick the right chart for the question; render it clean and minimal. Sparklines → tear-sheets, a worked SVG gallery. |
| **interface-ux-and-layout** | page structure, navigation, grids, hierarchy, usability | Control where the eye goes first/next/last. Fluency, accessibility, usability heuristics — taste labelled as taste. |
| **typography** | type choice, size, measure, scale, pairing, web-font loading, text a11y | Legibility before personality. The Modernist default kit (Bricolage · Plus Jakarta · Plex Mono) on Corbusier. |

## How they compose (the wiring)

Each skill owns **one lever** and **defers the rest** to its siblings, via `[[skill-name]]` links and
explicit "defers to" boundaries. So they never duplicate or contradict — they read as one system:

```
                 graphical-perception-and-color
                 (colour · contrast · palettes)
                   ▲            ▲            ▲
        colour ──┘     colour ──┘    colour ──┘
                 │            │            │
   charting ─────┤   typography├────── interface-ux-and-layout
  (chart forms)  │   (type)    │        (layout · nav · hierarchy)
        ▲        │      ▲      │              ▲
        └ chart forms ──┴──────┴── layout ────┘
```

- **charting** defers all colour/contrast to **graphical-perception-and-color**.
- **typography** defers colour to **graphical-perception-and-color**, chart forms to **charting**,
  page layout to **interface-ux-and-layout** — and *owns* the type inside charts/tables (tabular figures, ≥14px labels).
- **interface-ux-and-layout** defers chart forms to **charting** and colour to **graphical-perception-and-color**.
- The shared house style is **Corbusier** (the colour skill's muted palette + the type skill's Modernist kit),
  demonstrated end-to-end in the typography galleries (`default-modernist.html`, `data-dense.html`).

## Two style skills (the layer on top)

Above the four evidence skills sit two skills about *style* — both **strictly subordinate** to the four floors (AA contrast, chart honesty, legibility, focus/target/zoom). They add a look; they never break a rule, and both run the four-skill **pass-gate** before anything ships.

| Skill | Owns | One-line |
|---|---|---|
| **house-style-templates** | design-craft's own house look (reference-only, no agent) | A library of **directional house-look templates** the art-director draws from. **⚠️ WORK IN PROGRESS — the templates are not built yet;** the most overridable layer, declared taste. |
| **developing-style** | a method for creating a *new* style | An evidence-based, repeatable process for an original, distinctive style: learn the convention, then deviate — imitate-then-deviate from an *unfamiliar* domain, reduce to a small vocabulary, hold a few constants. Style-formation research bundled in `references/`. |

`house-style-templates` is a reference library of directional house-look templates (**still being built**); `developing-style` is the method to *invent* a new look.

## The worked galleries

Each skill's `references/` holds an offline HTML gallery. Serve any skill's gallery folder and open it:

```bash
# example: the typography galleries
cd skills/typography/references/type-gallery && python3 -m http.server 8143
# then open http://localhost:8143/  (and /default-modernist.html, /data-dense.html, /sleek.html, …)
```

Galleries by skill:
- `skills/graphical-perception-and-color/references/perception-gallery/` and `…/color-theory-findings/`
- `skills/charting/references/` (Tufte gallery + showcases)
- `skills/interface-ux-and-layout/references/ux-gallery/` (components → whole pages)
- `skills/typography/references/type-gallery/` (specimens, kits, dense-data, self-hosted fonts in `fonts/`)

Fonts are **self-hosted** (Latin-subset WOFF2 bundled in `type-gallery/fonts/` + a generated `fonts.css`),
so the typography examples render with **no network dependency**.

## Built on top of `frontend-design` (Anthropic) — install both

design-craft and `frontend-design` are a **designer → implementer** pair, not rivals. **design-craft sets the
design** — the UI, charting, colour, and type *decisions*. **`frontend-design` implements them** in clean,
distinctive, production-grade code, and is leaned on for code quality and technical execution. Install both.

**The precedence (encoded in every skill's boundary):**

| Question | Owner |
|---|---|
| What the design *is* — chart form, colour/theme, layout & hierarchy, type | **design-craft** — leads on everything it covers |
| How it's *built* — production code, code quality, technical execution | **frontend-design** — implements design-craft's decisions |
| A *design* call where design-craft (a) doesn't cover it, (b) only weakly leans, (c) the user rejects its options, or (d) the user wants a drastic directional change | **frontend-design** — steps in as a fallback helper |
| Accessibility + chart honesty (WCAG contrast, CVD-safety, never-colour-alone, focus-visible, target size, legibility, chart integrity) | **design-craft** — an **absolute floor**; a fallback never crosses it, only an explicit user override does |

In short: **design-craft decides the design and `frontend-design` builds it.** frontend-design is pulled into a
design decision only in the four fallback cases above — never through the accessibility/honesty floor. The
[STRONG]/[CONVENTION]/[MYTH] labels still tell the truth underneath: leading on a [CONVENTION] default (e.g.
Corbusier) is a house-standard call, not a proof claim.

> This is declared formally: `plugin.json` lists `frontend-design` in its **`dependencies`** field (with
> `marketplace: "claude-plugins-official"`), and this marketplace allowlists that cross-marketplace dep — so
> Claude Code **auto-installs `frontend-design`** when you install design-craft (requires Claude Code v2.1.110+).

## The agent team (`agents/`)

The plugin ships a matching **agent team** — one agent per skill plus an orchestrator — so a design can be produced *by the plugin, through its agents*, not by one skill-load:

- **`dc-orchestrator`** — runs the whole team. Its protocol every run: review what's available and **propose a direction, then CONFIRM it with the user before building** → assign each agent a **weight** by goal (luxury → branding leads; graphic/poster → composition; data/dashboard → charting; app → layout) and name the leading agent → brief every agent with that direction → build → **scored refinement loop** (each agent scores the result 0–10 and flags critical blockers; the gate passes only when the **leading agent ≥9**, **developing-style + branding ≥8**, **all others ≥7**, and **no blocker**) → a **director final pass** that scores the result against the confirmed direction and must hit **≥9**, else it refines again with shortfall feedback → render and ship. design-craft decides, frontend-design implements.
- **`dc-art-director`** (developing-style) sets theme/feel and arbitrates; **`graphic-composition`, `perception-and-color`, `tufte-charting`, `typesetting`, `ux`, `brand-design`** are the specialist levers; **`dc-brand-absorption`** is conditional (only when adopting an existing brand). **`house-style-templates`** is a **reference-only skill** — a library of directional house-look templates the art-director draws from — **not an agent**.

Collisions resolve by a **deference map** (each lever's owner wins on its lever; a floor always outranks a look or direction; the art-director breaks ties toward concept and mood, never through a floor). The four floors — AA contrast, chart honesty, legibility, focus-visible/≥44px — are absolute.

## Install

This directory is both a plugin and a single-plugin marketplace.

```
# the companion (Anthropic, official marketplace)
/plugin install frontend-design

# this plugin
/plugin marketplace add /path/to/design-craft
/plugin install design-craft@design-craft
```

The six skills then activate automatically — the four evidence skills on charts, colour, layout and type; the two style skills when you are shaping or inventing a look.

> Note: if you already have these as personal skills under `~/.claude/skills/`, remove those copies
> after installing the plugin to avoid duplicate skill names.

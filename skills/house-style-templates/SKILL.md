---
name: house-style-templates
description: "A reference library of design-craft's own house-look **templates** — five directional looks (Meridian · Ledger · Terminal · Deepfield · Prism/ATELIER) that the art-director (the orchestrator) and the builder draw from, and that anyone can reuse directly as a starting template. Use to pull a directional house-look baseline, to make something \"feel like design-craft,\" or to check a design coheres with the set. Templates are BASELINES — starting points a real design is expected to diverge from as the user's needs demand. **Reference-only — no dedicated agent**; strictly subordinate to the four floors and the evidence skills, and the most overridable layer (declared taste, not evidence)."
---

# House-Style Templates

## Overview

design-craft's **house look** — the recognizable "hand" that makes its output identifiable as one body of work, the way a painter's canvases read as theirs without needing a signature. This is the plugin's **one openly-subjective skill**: its authority is *taste*, declared as taste, not evidence. Everything here is **[CONVENTION] / house preference** — it makes no [STRONG] claims. It's a **reference / template library** — five directional house-look templates that the **art-director** (the orchestrator) and the builder draw from to assemble a coherent result, and that anyone can reuse as a starting template. **Reference-only: no dedicated agent** — the art-director owns applying it.

**Core principle — it adds a look; it never breaks a rule.** This is the *most overridable* layer in the plugin: it yields to the four floors, every evidence skill, and the user.

## The library — five directional templates

Each template is a complete directional baseline: register, when-to-pull / wrong-for, colour tokens, type kit, and the structural move-set. Full spec in its reference file.

| Template | File | Register | One-line identity |
|---|---|---|---|
| **Meridian** — the credible default | `references/meridian.md` | self-effacing | Clean, credible corporate: off-white, one reserved blue, hairlines; reads solid, then gets out of the way |
| **Ledger** — the engraved prospectus | `references/ledger.md` | expressive-but-restrained | Engraved heritage certificate / private-bank prospectus; quiet authority — the confidence is the restraint |
| **Terminal** — the warm phosphor deck | `references/terminal.md` | expressive | The front panel of a warm retro-computing/AI machine you operate; amber+green on near-black, all-mono |
| **Deepfield** — the deep-field notation plate | `references/deepfield.md` | expressive, cold, disciplined | Deep-sky observatory notation: bone marks on a warm void, one magenta signal, one gold spark |
| **Prism** — ATELIER, the colour-plate portfolio | `references/prism.md` | exuberant-yet-impeccable | Couture-constructivism: saturated geometric colour-mix on a bright field, luxury via impeccable execution |

## Choosing a template

Match the **register the brief needs**, not the subject matter:

- Must read **trusted, credible, calm** — and get out of the way → **Meridian**
- Must read **permanent, heritage, quietly expensive** → **Ledger**
- Wants **machine character** — the reader *operates* the page → **Terminal**
- Must read **measured, rigorous, precise** — cold over warm → **Deepfield**
- Must read **alive, bright, unmistakable** — range and confidence → **Prism**
- **No template fits, or the brief needs an ownable NEW look** → this skill steps aside; use `developing-style`
- **An existing brand must be followed** → this skill steps aside; use `brand-absorption`

**The brand boundary:** a brand *colour* or one-two fixed assets is a divergence input — pull the closest template and fold the asset in, within the floors. A brand *identity* — an established colour system + type + mark + tone the work must read as — is `brand-absorption`'s job, not a template's.

Two or three could plausibly fit most briefs — that's normal. Present the choice to the user (it's a direction call, see below); don't agonize toward a single "correct" answer.

## Baselines, not cages — divergence is expected

**A template is a starting point, not a finished design and not a compliance target.** Pulling one buys a proven register, palette, type kit, and move-set so the work doesn't start from a blank page. From there, the actual design **can — and is expected to — diverge** wherever the user's brief, content, audience, or taste demands: swap a face, extend the palette, drop signature moves that don't serve the content, restructure entirely. The user's needs always outrank template fidelity.

What to keep while a design still *claims* the template, so the claim stays honest:

- **The register** — a "Meridian" that shouts or a "Ledger" that feels urgent isn't a divergence, it's a different style. Fine to build — just stop calling it by the template's name.
- **The one-pop discipline** — one contrasting pop, spent once, is a house constant across all five.
- **A recognizable core of the move-set** — each reference file names its **held constants**; those are what make a hand a hand. If no constant survives, you're not diverging from a template, you're inventing a new style (→ `developing-style`, and that's a fine outcome).

When a brand colour arrives with the brief, it takes the template's **reserved-accent slot** by default; the **pop stays a separate, contrasting, once-spent colour**. If the brand colour collides with the template's pop, re-pick the pop (with `graphical-perception-and-color`) — never run two emphasis systems.

Divergences are decisions, not drift: note what was changed and why, so the user can see where the design left the baseline.

## User direction comes first

Choosing or applying a house template **is a direction choice, and direction belongs to the user** — it sets intent, mood, and register (self-effacing ↔ expressive). In a team run the art-director (the orchestrator) makes this call inside a direction already **confirmed with the user**; standalone, confirm the template choice with the user before building on it. **If no confirmed direction has been handed to you, ask first** — a template is never a substitute for the user's intent.

## The iron rule — subordinate to the four floors

This skill is **subordinate to** `graphical-perception-and-color`, `charting`, `interface-ux-and-layout`, and `typography`. It may **never contradict** them. Anything produced under this style **must pass their binding floors**. When the look and a binding rule collide, **the rule wins and the look bends** — every time.

A beautiful design that fails a binding rule is **not in this style.** Recognizable ≠ exempt. Violating the letter of those skills violates the spirit of this one.

## The pass-gate — run before shipping any design

A design is in-style only if it clears every **absolute floor** the evidence skills own. The **house
defaults** below are the starting point — they hold unless the brief or the user overrides them.

**Absolute floors (never yield — only an explicit user override).**

| From | Must hold |
|---|---|
| **colour** | WCAG **AA contrast** on every text/UI pair · **never colour alone** (pair with text/shape/icon) · **CVD-safe** |
| **typography** | legibility floor — **min body size**, AA body contrast |
| **charting** | **chart honesty** (no truncated bar/area baseline, no area/radius lie, no dual-axis trick) |
| **ux/layout** | **focus-visible** · adequate **target size** · survives text zoom / resize |

**House defaults (yield to the brief / user).**

| From | Default |
|---|---|
| **colour** | **off-white, not pure-white** grounds · ≤ ~7 categorical hues · one reserved accent · **one contrasting pop, spent once** |
| **typography** | **tabular figures** in tables/charts · measure ~45–75ch |
| **typography** + the house look | the chosen template's kit + scale |
| **charting** | data-ink minimal · chart marks stay quiet |
| **ux/layout** | clear hierarchy |

**Method:** don't eyeball contrast — *compute* it (WCAG ratio ≥ 4.5 normal text, ≥ 3 large/UI). The gate is pass/fail: a single **floor** fail means fix, not ship.

## Don't rationalize the look past the floor

| "But the look…" | Reality |
|---|---|
| "low-contrast grey *is* the aesthetic" | Sub-AA text fails colour. Darken it — the look survives a darker grey. |
| "pure white is cleaner" | Off-white is the rule. Pure-white grounds are out. |
| "colour-coded only is more elegant" | Add the text/shape/icon. Colour-alone fails CVD. |
| "a trimmed axis looks punchier" | That is a dishonest chart. Charting is absolute. |
| "the brand face is barely legible but on-brand" | Legibility wins; use it for display only, never body. |
| "the template does it this way" | A template is a baseline, never a licence. Floors and the user's brief outrank it. |

**Red flags — STOP:** "just this once below AA," "the floor doesn't apply to a hero," "it's only decorative," "the user will understand the colour anyway." Each means the look crossed a rule — **bend the look.**

## Provenance

All five templates were built in the design-craft style lab through scored multi-agent rounds: every page assembled from specialist-authored fragments, scored by all nine specialist lenses against per-round gates (none below 8.5, leads ≥9), and passed an art-director final review of ≥9 against an Anatoly-confirmed direction (final passes 9.2–9.5, Rounds 10–11, 2026-07). The reference docs are the distilled, binding essence of those builds; the live artifacts live in the lab repo (`design-craft-style/round10/`).

## Defers to

colour → `graphical-perception-and-color` · charts → `charting` · layout & navigation → `interface-ux-and-layout` · type → `typography`. This skill owns only the cohesive *look* that sits on top — and only ever within their floors.

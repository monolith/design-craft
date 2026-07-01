---
name: visual-style
description: Use when applying design-craft's own cohesive house look — the recognizable visual style that makes its output read as one body of work — to a page, app, dashboard, or component; or when asked to make something "feel like design-craft," match the set, or carry a consistent look / feel / visual identity. The plugin's subjective taste layer; strictly subordinate to the other four skills and never overrides them. Part of the design-craft toolkit — developing-style is the art-director (it sets the theme/feel and coordinates); all the skills apply together on every piece, this one as a specialist lever. [Style definition in development — see "The style".]
---

# Visual Style

## Overview

design-craft's **house look** — the recognizable "hand" that makes its output identifiable as one body of work, the way a painter's canvases read as theirs without needing a signature. This is the plugin's **one openly-subjective skill**: its authority is *taste*, declared as taste, not evidence. Everything here is **[CONVENTION] / house preference** — it makes no [STRONG] claims.

**Core principle — it adds a look; it never breaks a rule.** This is the *most overridable* layer in the plugin: it yields to all four evidence skills, and to the user.

## The iron rule — subordinate to the four skills

This skill is **subordinate to** `graphical-perception-and-color`, `charting`, `interface-ux-and-layout`, and `typography`. It may **never contradict** them. Anything produced under this style **must pass their binding floors**. When the look and a binding rule collide, **the rule wins and the look bends** — every time.

A beautiful design that fails a binding rule is **not in this style.** Recognizable ≠ exempt. Violating the letter of those skills violates the spirit of this one.

## The pass-gate — run before shipping any design

A design is in-style only if it clears every floor the four skills own:

| From | Must hold |
|---|---|
| **colour** | WCAG **AA contrast** on every text/UI pair · **never colour alone** (pair with text/shape/icon) · **CVD-safe** · **off-white, not pure-white** grounds · ≤ ~7 categorical hues · one reserved accent |
| **typography** | legibility floor (min body size, AA body contrast) · **tabular figures** in tables/charts · measure ~45–75ch · the kit + scale |
| **charting** | **chart honesty** (no truncated bar/area baseline, no area/radius lie, no dual-axis trick) · data-ink minimal · chart marks stay quiet |
| **ux/layout** | clear hierarchy · **focus-visible** · adequate **target size** · survives text zoom / resize |

**Method:** don't eyeball contrast — *compute* it (WCAG ratio ≥ 4.5 normal text, ≥ 3 large/UI). The gate is pass/fail: a single fail means fix, not ship.

## Don't rationalize the look past the floor

| "But the look…" | Reality |
|---|---|
| "low-contrast grey *is* the aesthetic" | Sub-AA text fails colour. Darken it — the look survives a darker grey. |
| "pure white is cleaner" | Off-white is the rule. Pure-white grounds are out. |
| "colour-coded only is more elegant" | Add the text/shape/icon. Colour-alone fails CVD. |
| "a trimmed axis looks punchier" | That is a dishonest chart. Charting is absolute. |
| "the brand face is barely legible but on-brand" | Legibility wins; use it for display only, never body. |

**Red flags — STOP:** "just this once below AA," "the floor doesn't apply to a hero," "it's only decorative," "the user will understand the colour anyway." Each means the look crossed a rule — **bend the look.**

## The style — IN DEVELOPMENT (do not invent it)

The signature treatment is being chosen with Anatoly through an iterative contact-sheet loop. **Not yet decided.** Round-1 candidate "hands" under review: **Blueprint** (exposed hairline structure), **Editorial** (serif display + spine rule), **Warm** (soft, rounded, approachable), **Ink & Rule** (austere mono + one accent), **Tonal Panel** (muted tonal steps). Once converged, this section receives the chosen treatment — its tokens, do/don'ts, and a worked **reference example** under `references/` — and the description's "[in development]" note is removed.

> Until then, this skill contributes only the **subordination rule + pass-gate above** — which are already binding.

## Defers to

colour → `graphical-perception-and-color` · charts → `charting` · layout & navigation → `interface-ux-and-layout` · type → `typography`. This skill owns only the cohesive *look* that sits on top — and only ever within their floors.

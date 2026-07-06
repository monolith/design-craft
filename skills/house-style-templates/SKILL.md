---
name: house-style-templates
description: "**[WORK IN PROGRESS — the directional style templates are not built yet; this skill is a scaffold, not a finished library.]** A reference library of design-craft's own house-look **templates** — cohesive-look designs across different **directional options** — that the art-director (the orchestrator) and the builder draw from to assemble a coherent result, and that anyone can reuse directly as a starting template. Use to pull a directional house-look reference, to make something \"feel like design-craft,\" or to check a design coheres with the set. **Reference-only — no dedicated agent**; strictly subordinate to the four floors and the evidence skills, and the most overridable layer (declared taste, not evidence). The template set is **not finished** — treat this as a scaffold, not a complete library."
---

# House-Style Templates

## Overview

> ⚠️ **WORK IN PROGRESS — not finished.** The directional style references/templates this skill is meant to hold have **not been built yet**. The *intent* below is settled; the *template set* is not. Don't rely on it as a completed style library — it's a scaffold, and it's the least-developed skill in the plugin.

design-craft's **house look** — the recognizable "hand" that makes its output identifiable as one body of work, the way a painter's canvases read as theirs without needing a signature. This is the plugin's **one openly-subjective skill**: its authority is *taste*, declared as taste, not evidence. Everything here is **[CONVENTION] / house preference** — it makes no [STRONG] claims. It's a **reference / template library** — directional house-look options (the style-lab's Meridian / Terminal / Ledger… lineage) that the **art-director** (the orchestrator) and the builder draw from to assemble a coherent result, and that anyone can reuse as a starting template. **Reference-only: no dedicated agent** — the art-director owns applying it.

**Core principle — it adds a look; it never breaks a rule.** This is the *most overridable* layer in the plugin: it yields to the four floors, every evidence skill, and the user.

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
| **colour** | **off-white, not pure-white** grounds · ≤ ~7 categorical hues · one reserved accent |
| **typography** | **tabular figures** in tables/charts · measure ~45–75ch |
| **typography** + the house look | the kit + scale |
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

**Red flags — STOP:** "just this once below AA," "the floor doesn't apply to a hero," "it's only decorative," "the user will understand the colour anyway." Each means the look crossed a rule — **bend the look.**

## The style — IN DEVELOPMENT (do not invent it)

The signature treatment is being chosen with Anatoly through an iterative contact-sheet loop. **Not yet decided.** Round-1 candidate "hands" under review: **Blueprint** (exposed hairline structure), **Editorial** (serif display + spine rule), **Warm** (soft, rounded, approachable), **Ink & Rule** (austere mono + one accent), **Tonal Panel** (muted tonal steps). Once converged, this section receives the chosen treatment — its tokens, do/don'ts, and a worked **reference example** under `references/` — and the description's "[in development]" note is removed.

> Until then, this skill contributes only the **subordination rule + pass-gate above** — which are already binding.

## Defers to

colour → `graphical-perception-and-color` · charts → `charting` · layout & navigation → `interface-ux-and-layout` · type → `typography`. This skill owns only the cohesive *look* that sits on top — and only ever within their floors.

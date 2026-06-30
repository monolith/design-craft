---
name: brand-absorption
description: Use when adopting, absorbing, or extracting an EXISTING brand's visual identity to set direction for a redesign, facelift, refresh, reskin, or any work that must stay inside a client's established look — capturing their colours, type, logo, imagery, tone, and the structural "hand" into a binding Brand Direction the rest of the design follows. Also when a redesign must still "read as them," or when matching brand guidelines you've been handed. NOT for inventing a new original style (→ developing-style), nor for designing/evaluating an identity from scratch or judging redesign risk (→ branding). Defers colour science to graphical-perception-and-color, type selection to typography, layout to interface-ux-and-layout. Part of the design-craft toolkit — developing-style is the art-director that coordinates the set; this is the toolkit's one conditional skill (it activates only for adopting an existing brand), and its Brand Direction binds the director and every specialist.
---

# Brand absorption

## Overview

Read an **existing** brand from its real materials and codify it into a **Brand Direction** the rest of
design-craft executes against — so a facelift, refresh, or any in-brand work still reads, unmistakably,
as *them* and not as your house style.

**Core principle: absorb what's in front of you, not what you remember.** A brand lives in its *current*
artifacts. Extract from those — not from recall, not from an "ideal" version, not from your own taste.
For a brand you've never seen this is the only option; for a famous one it is the *guard*, because your
memory of it may be a rebrand or two out of date.

**The rule that shapes the method [STRONG]:** a style is only *partially* measurable. Colour, type, and
texture are a **surface signature** you can extract (even with a script). Composition and meaning — the
brand's **"hand"** — are **not** capturable from the image; *"style is fully measurable from the image"*
is a flagged **[MYTH]** (style-transfer research → [[developing-style]]). So every absorption has two
halves, and the second is mandatory.

## Boundary — the fourth posture

design-craft has four ways to relate to a "look." Pick by verb:

| Skill | Verb | Use |
|---|---|---|
| **[[branding]]** | *design / evaluate* identity; judge **redesign risk** | making or grading an identity |
| **[[developing-style]]** | *invent* a new, original look | "like nothing else," ownable, from scratch |
| **[[visual-style]]** | *apply* design-craft's own house look | the default when no brand is given |
| **brand-absorption** (this) | ***read* an existing look, *set* direction** | facelift / reskin / inside a client's brand |

This skill **captures what they have and sets direction**; **[[branding]]** judges **how far you can
safely move it** (redesign-risk: committed audiences punish inconsistent change — Walsh, Winterich &
Mittal 2010). Absorption *feeds* branding; it doesn't replace it. Colour values → **[[graphical-perception-and-color]]**,
type selection → **[[typography]]**, layout → **[[interface-ux-and-layout]]**. Extractability evidence is
inherited from **[[developing-style]]**.

## The method

**1. Gather the real artifacts.** The live site (fetch or screenshot it), logo files, a brand-guidelines
PDF, app screens, packaging. Work from these. If you only "know" the brand from memory, go find the
current artifact and check — brands change.

**2. Extract the surface signature** (measurable):
- **Colour** — run `scripts/extract_palette.py LOGO_or_screenshot.png` for accurate hex + coverage %
  (it returns the working palette + a rough role hint; confirm roles by eye). Coverage tells you which
  colour is the *hero* vs a trace. Needs Pillow.
- **Type** — identify the display and text faces from rendered text; record weights, the scale (how big
  is "big"), measure, and the numerals. Face *selection* is [[typography]]'s job; here you *record* what
  they use.
- **Logo & space** — construction, lockups, clear-space, and what must never change (recolour,
  restretch, reset in a system font).
- **Imagery** — illustration vs photography, and the treatment (texture, duotone, halftone, "made by a
  person" vs slick stock), and how colour lives inside it.

**3. Name the "hand"** — *required, not skippable.* Write, in plain words, the compositional and tonal
logic a colour-picker can't see: how the brand *moves*. Editorial-calm or dense? Restrained-monochrome
or maximal? Earnest or dry? Warm-imperfect or precise? This is the half that survives a layout change and
the half most easily lost. **If you can't name it, you haven't absorbed the brand — you've sampled its pixels.**

**4. Capture the distinctive, not the floor.** Record what is *ownable* — the signals that make it
recognisable. Skip the generic table-stakes (good contrast, a clean grid): those are the [STRONG]
accessibility/fluency floor owed to every brand, not part of *this* identity.

## The output — a binding Brand Direction

Assemble the capture into one structured artifact — see
[references/brand-direction-template.md](references/brand-direction-template.md). Every element gets a
**do / don't** and a one-line **"this is *them*, not us"** that names the specific house-style trap to
avoid, with the real evidence attached (hex swatches, rendered type, the logo lockup, sample imagery,
voice samples). The test: anyone can hold a screen against it and judge fit in thirty seconds.

**Precedence — the inverse of the library rule.** Where the data-grid rule (interface-ux-and-layout §11)
says design-craft overrides a *library's* defaults, here **the absorbed Brand Direction overrides
design-craft's own defaults and house look.** When a Brand Direction exists, the colour, type, layout,
and composition skills serve *it*, and **[[visual-style]]** yields entirely. The Brand Direction states
this at its top; the art-director (**[[developing-style]]**) consumes it as the binding
constraint set for the work.

## Common mistakes

- **Working from memory, not the artifact** — reciting the brand you recall instead of the brand as it
  ships today (which may be a rebrand out of date). Go look.
- **Stopping at the surface** — a palette and two font names, no named "hand." That's the skin, not the
  brand; it's the [MYTH] trap.
- **Improving instead of absorbing** — "fixing" the quirks toward your own taste on a facelift. Deviation
  is **[[branding]]**'s call (measure commitment first), not a reflex.
- **A direction that isn't binding** — a tidy standalone brief the downstream work doesn't obey. State the
  precedence; hand it to the art-director.
- **Capturing the generic floor** as if it were the identity (good contrast isn't *their* brand).
- **Trusting the palette script's role labels** — they're coverage/saturation guesses; confirm by eye.

## Citations

Partial-extractability + the "fully measurable" [MYTH]: [[developing-style]]'s
`references/style-formation-research.md` (Gatys, Ecker & Bethge 2016, neural style transfer — surface
texture/colour, not composition). Redesign-risk: Walsh, Winterich & Mittal (2010), *Do logo redesigns
help or hurt your brand?* — via [[branding]]. The extraction *method* is **[CONVENTION]**
(design-practice craft), labelled as such, not asserted as proven.

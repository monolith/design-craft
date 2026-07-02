---
name: developing-style
description: Use when creating a NEW, original, distinctive visual style or identity from scratch — not applying an existing one; when a design keeps coming out generic, derivative, or "like every other site/app"; when a brief asks for something unlike convention, recognizable, ownable, "like nothing else"; or when deriving a new style by deviating from unfamiliar reference material. An evidence-based method (style-formation research, bundled): map the convention, imitate-then-deviate from an *unfamiliar* domain, reduce to a small vocabulary, hold a few constants. To absorb and *follow* an existing brand instead — a facelift or reskin — use brand-absorption, not this skill. A **specialist** skill: the design-craft orchestrator (which is the art-director) dispatches it when a brief needs a new, ownable look — this skill invents the style; it does not direct the team. Subordinate to the four design-craft floors.
---

# Developing Style

## Overview

A repeatable method for building **your own** distinct visual style — a personal or brand **identity of your choosing**, instead of adopting design-craft's predefined house look. **Distilled entirely from the bundled study of how style forms** ([`references/style-formation-research.md`](references/style-formation-research.md); full raw per-agent corpus — 23 source extractions + 75 adversarial verifications — in [`references/developing-style-corpus.md`](references/developing-style-corpus.md)); nothing here is house opinion.

> **The three look-source skills:** [[house-style-templates]] = apply design-craft's *own* house look (the default); **developing-style** (this skill) = invent *your own* new look; [[brand-absorption]] = lift and follow an *existing* brand's look. Same input (study a reference), opposite intent — developing-style studies it to **deviate**, brand-absorption studies it to **preserve**.

**Core principle — distinctiveness is deviation from convention.** A treatment reads as distinctive only by departing from the *surrounding* convention, not by any element in isolation. So the whole method reduces to: **learn the convention, then break from it.**

**Character is critical — never sacrifice it.** A distinctive character/personality is the whole point of an invented style. Do **NOT** reduce, tidy, or "clean" a style into something that reads as standard, basic, or generic web design — a tasteful-but-generic result is a **failure**, not a safe default. The **only** time a character-light, restrained look is acceptable is when the user **explicitly asks** for a basic / corporate / self-effacing look; otherwise character is non-negotiable. The classic way character dies: an ownable *vocabulary* (marks, motifs, colours) gets sprinkled onto an otherwise conventional nav→hero→cards→sections layout, so the page still reads standard. **Character must live in the structure, not just the surface** — if stripping the decorative vocabulary leaves an ordinary website, the character was never really there.

**And one device is not enough — the signature must be magnified across EVERY aspect.** Layout, composition, imagery, type, colour, spacing — all of it must carry the concept, not just one structural gimmick sitting on otherwise generic parts. A distinctive spine on a conventional grid with stock/instrument imagery still reads bland, because the character is concentrated in one place while everything around it is default. Push the organizing idea into the *whole* page: the grid itself, how blocks are massed and aligned, the imagery treatment, the type rhythm. Ask of each element: "does this express the concept, or is it a default I dropped in?" — a default anywhere leaks genericness into the whole. **The container shapes count too:** a rectangular dark "card" per section is a web default, not a form — an organic/biophilic style especially cannot group content in rectangles (nature has no rectangles); the containers themselves must express the concept (feathered pools, grown boundaries, soft edges), or the page reads standard no matter what fills them.

**A re-skin or a background texture is not a style.** A swapped palette or a texture laid over a default layout is still the default — distinctiveness must be *structural*. And on **skeuomorphism**: it *can* read dated when it's a lazy default, but it is a legitimate, often powerful tool for **character** when it genuinely fits the concept — **do not discount it.** Choose it, like every move, by fit, not reflex.

**Lean HARD into the theme.** A merely competent, restrained expression of the theme still reads generic — commit to it *fully*. Push the theme further than feels safe; that intensity is what differentiates a style from the others in the set. **Under-committing** — a tasteful, dialled-back take that gestures at the theme instead of fully inhabiting it — is a common way character dies even when the craft is clean. When in doubt: more theme, not less.

Labels: **[STRONG]** = peer-reviewed evidence (gate-verified 3-of-3) · **[CONVENTION]** = sound practice, thin evidence · **[extracted]** = primary-sourced, not gate-verified in this skill's pass · **[MYTH]** = claim that failed adversarial verification, do not use. Sources + the full proven/convention/myth split are in the reference.

## ⛔ Theme/style review gate — build nothing until the direction is confirmed

Before any build, scaffold, dispatched builder, or render: **propose the direction(s), write them down, and STOP for the user's explicit confirmation.** Whoever is directing the work — a dispatched agent *or you in the main session* — is bound by this; the gate is mechanical, not a thing to remember.

- **Handshake:** write a `DIRECTION.md` in the working directory (one row per piece — register · genre/world · mood · positioning · feeling — each `status: AWAITING CONFIRMATION`), post the table, **end the turn.** Build only after the user replies and every row reads `CONFIRMED`.
- **These do NOT count as confirmation of the directions** (name them so you can't rationalize past them): "try round N now" · "go" · "build it" · "use the plugin to its full ability" · "you have everything you need" · a prior round's directions · a planning note · a memory entry. A directive to *start* the run is not approval of the *directions* — the run begins *at* this gate.
- Spending the user's tokens (builders, renders, a fan-out) on an unconfirmed direction is a **cost violation**, not just a process slip.

Full protocol + subagent-halt behavior: the orchestrator agent's **GATE ZERO**.

## User direction comes first

This skill develops style **in service of the user's intent** — but unlike its sibling skills, **a vague or missing style direction is its activation condition, not a blocker**. It serves four modes: **(1) refine** a style the user is developing; **(2) lead** style development in the user's place when their direction is very vague; **(3) fill the gaps** a high-level direction leaves open; **(4) invent** the more distinctive look a user wants but can't name. When a confirmed direction exists (modes 1, 3), its register (self-effacing ↔ expressive) bounds the invention — a self-effacing intent gets a quiet signature (felt order, held constants), not a loud device. When direction is vague or open (modes 2, 4), develop candidate styles/directions and **put them to the user for confirmation** — through the art-director (the orchestrator) in a team run, directly when used standalone — before the design is built on them. Don't demand specificity the user doesn't have; don't treat the gap as license to skip confirmation.

**Don't go too literal.** A brief, concept, or theme *name* sets a **register and a feeling** — it is **not a list of motifs to depict**. Translating it literally — a "Ledger" theme built as accounting furniture, a "cloud/Nimbus" theme staged as weather clip-art, a name read as a genre the user never meant — produces **costume, not style**; the signature is the *form*, not the props. Take the register and the feeling from the intent, and deviate at the level of **structure and hand**, not by staging the concept's literal objects. When a name or word *seems* to name a genre, that's a **question for the user, not an instruction** (see the art-director's Step-1 rule against deriving direction from a name).

## When to use

- Inventing a signature look from a blank page; a brief that says "unlike anything," "recognizable," "ownable."
- Output keeps landing generic or derivative and you need to break the pattern.
- Deriving a new style by deviating from an *unfamiliar* reference. (To *follow* an existing brand faithfully instead → [[brand-absorption]].)

Not for: applying an already-decided style (→ [[house-style-templates]]); a throwaway layout with no identity stake.

## Floor — subordinate to the four floors

A style is valid only if everything it produces passes the four design-craft floors — AA contrast, chart honesty, legibility, focus/target-size/zoom. Run [[house-style-templates]]'s **pass-gate** before shipping. "Original" buys no exemption. *(Plugin floor, not a research claim — but absolute.)*

**Every invented style must hold one "pop" colour (house requirement — blocker, user-overridable).** Beyond the style's main colour, bake in **one** contrasting pop colour, spent sparingly on a **single key emphasis**. Pick it for contrast with the style's own register: **vibrant style → a muted / dull pop; restrained, dark, or monochrome style → a vibrant pop.** One per style · never the main colour · never a second general accent — a deliberate spark. Hold it as a constant on every style unless Anatoly waives it.

## The method — the research's levers, in order

1. **Map the convention first.** **[STRONG]** that a distinctive hand is *real and measurable* — attribution runs far above chance and distinctiveness is quantifiable (Gabora, r=.98, upheld). That the deviation is judged against the *surrounding* convention and is *time-relative* is the **weaker leg — [MEDIUM, single-source]** (Elgammal, whose time-machine measure is partly self-validating; the synthesis rates this cluster MEDIUM, not STRONG). Either way you cannot deviate from what you have not named — so list the category's defaults first. **[extracted]** A tool for *locating* a convention on formal axes (what "list the defaults" otherwise lacks): **Wölfflin's five opposed pairs** — linear/painterly, plane/recession, closed/open form, multiplicity/unity, absolute/relative clarity. Place the norm on each, then choose which axis to leave.

2. **[STRONG] Imitate-then-deviate from an *unfamiliar* domain.** The evidenced route to an original hand: deeply study a model from a domain you do *not* normally draw from, then deviate. Copying restructures your internal model of the task and yields output unlike the source. **The source must be UNFAMILIAR** — familiar high-quality exemplars cause *design fixation*, the opposite effect.

3. **[STRONG] Reduce to a small fixed vocabulary.** Self-imposed constraint and reduction are a documented lever for a recognizable hand ("less, but better"). A tight, repeatable move-set *is* the mechanism, not a limit on it. **This [STRONG] rests on a single verified master (Rams)** — thin; the inverted-U below now grounds it.
    - **[extracted] Constraint has a dose — inverted-U** (Cromwell & Acar, *Org. Psych. Review* 2024, integrative review of ~145 empirical studies): creative output peaks at *moderate* constraint — too little → complacency/cliché, too much → stifles. This is the empirical spine for the director's rule that **"always deviate" and "always reduce" are both failure modes**. *Caveat: the inverted-U is directional, not settled — extreme constraint may change the problem type rather than sit on one curve. Read it as a direction, not a law.*
    - **[extracted] How to deviate — paired constraints** (Stokes): one constraint **precludes** the conventional element, a second **specifies its substitute**; the recognizable style **emerges as that substitution chain**, and step one is deviating from a *well-structured* convention (Matisse negating Beaux-Arts). This is the procedure lever 1's "map the convention" was missing.
    - **[extracted] Widen the authority base past Rams:** Vignelli (≤6 typefaces across a whole career; the grid as *enabling* structure) and Sagmeister ("almost any limitation helps if known in advance").

4. **[STRONG] Put the signature in a few held *constants*.** Style is the set of constant features across a body of work; the individual hand lives in **constant, often minor handling repeated across everything** — not a single hero flourish. Pick a few constants; hold them everywhere.

5. **[CONVENTION] Novel *and* coherent.** Enduring originality is novelty **plus** forward influence (and is time-relative): the deviation must read against *today's* convention and still hold together — distinctive, not merely different.

## Myths — do NOT codify (failed verification)

- **[MYTH]** "Be first within a trend." Timing-of-originality / first-mover advantage is **unsupported**; originality matters, being early does not.
- **[MYTH]** "Style is unconscious / can't be taught." **Refuted** — it is a deliberate, teachable practice.
- **[MYTH]** "Style is fully measurable from the image." Texture/colour statistics capture a *surface* signature, **not** the compositional hand — the key caveat for [[brand-absorption]].
- **[extracted]** "10,000 hours / drilling builds a signature." **The opposite** (Macnamara & Hambrick 2019 meta-analysis): in *creative* domains, consistently practised, replicable behaviours are *detrimental* to distinctiveness — practice builds the hand, but originality requires deviating from the very conventions practice instils. Reinforces the core: learn *then* deviate.

## Absorbing an existing brand → [[brand-absorption]]

Lifting and *following* an existing brand (a facelift or reskin) is **[[brand-absorption]]**'s job, not this skill's — this skill *deviates* from references, it doesn't preserve them. But brand-absorption rests on a finding from the *same* style-formation research, worth stating here: style is only **partially** extractable — texture + colour + feature statistics (the basis of neural style-transfer) capture a brand's *surface* signature but **miss composition and semantics**. So a faithful absorption must pair the measured surface with an explicit, human-named account of the structural "hand"; surface stats alone are never enough.

## Open questions (the evidence did not settle these)

Dose-response of imitate-then-deviate for a *durable* signature; whether cross-domain "style as portable worldview" replicates; which specific constraints beyond reduction; extending the computational measure past surface texture. See the reference.

## Defers to

colour → `graphical-perception-and-color` · charts → `charting` · layout & navigation → `interface-ux-and-layout` · type → `typography`. Applies the house look via [[house-style-templates]]; absorbs an existing brand's look via [[brand-absorption]]. Evidence + sources: [`references/style-formation-research.md`](references/style-formation-research.md).

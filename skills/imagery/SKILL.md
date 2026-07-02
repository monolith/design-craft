---
name: imagery
description: Use when SELECTING, CRITIQUING, or DIRECTING images — photography and illustration — for a page, app, deck, editorial spread, or identity: picking a good photo, giving feedback on one, deciding photo-vs-illustration, directing tonal treatment, writing alt text, or making LIGHT programmatic illustration (SVG / Pillow). Does NOT generate photographs and is not a heavy photo editor. Evidence-based: separates proven findings [STRONG] from convention [CONVENTION] from myth [MYTH], with a named study behind every claim. Defers colour science to graphical-perception-and-color, arrangement/composition/figure-ground to composition-and-design-theory, type to typography, page layout to interface-ux-and-layout. Part of the design-craft toolkit — the orchestrator is the art-director (it sets the theme/feel and coordinates the whole set); all the skills apply together on every piece, this one as a specialist lever.
---

# Imagery (evidence-based)

## Overview

Most imagery advice is taste, folklore, or agency conversion-lore. A smaller set is backed by
perception and instructional science. This skill is that backed set — for **choosing** an image,
**critiquing** one, **directing** its treatment, deciding **photo vs illustration**, writing **alt
text**, and **light programmatic illustration** (SVG / Pillow). It does **not** generate photographs
and is not a heavy photo editor.

**Core principle — the image must carry the message.** The strongest, best-replicated result here is
that an image which does *not* advance the core point measurably **hurts** comprehension — decorative,
off-brief, "feel-good" pictures are not neutral, they cost. So every image earns its place by carrying
the message, or it is cut. (F1 — Mayer's coherence + seductive-details.) This is the skill's central
test, not a soft preference.

**Confidence labels:** **[STRONG]** = controlled study or normative standard · **[CONVENTION]** =
widely taught / named-authority practice, thin or mixed empirical support · **[extracted]** =
primary-sourced but not adversarially re-verified in this skill's pass ([ESTABLISHED]/[extracted] are
the same band) · **[taste]** = declared aesthetic choice, no evidence either way · **[MYTH]** = the
evidence contradicts the popular claim.

**Full research trail:** the perceptual/selection evidence (9 verified findings, 3 refuted, 25 sources) is
in [references/imagery-research.md](references/imagery-research.md); the §4 illustration direction is
synthesised from four illustrators' stated process in
[references/illustrator-synthesis-research.md](references/illustrator-synthesis-research.md) (10 findings, 20
sources). **Honest gap:** the evidence pass found **no** controlled evidence for tonal **treatment** or
**accessibility/alt-text** — those sections are sourced from the **WCAG standard** and **craft convention**,
labelled as such; the illustration technique is **[extracted]** from artists' own accounts, not controlled study.

**How this skill works — a critique/selection LOOP, not a lecture.** In practice imagery is iterative:
surface **actual candidate images** (selected from a source, or made in code), let the person react
**like / not** — with a reason where they have one — and refine toward that taste. Don't argue an image
in the abstract; put real options on the table and converge. The principles below are what you *bring*
to that loop, not a substitute for running it.

## User direction comes first

This skill applies its lever inside a **creative direction that belongs to the user** — intent, mood, and register (self-effacing ↔ expressive). In a design-craft team run the direction arrives from the art-director (the orchestrator), already **confirmed with the user**, in the shared brief. Used standalone, it comes from whoever invoked the skill. **If no confirmed direction has been handed to you, ask for it — the art-director in a team run, the user otherwise — before making any direction-shaping choice.** The skill's defaults and reflexes are never a substitute for the user's intent.

## Boundary — how this composes with the sibling skills

Imagery is one lever; it defers the rest.

- **Colour / contrast / palette-match / CVD** → **[[graphical-perception-and-color]]**. Treating an
  image to a palette, or checking text-over-image contrast, uses that skill's floor — this skill
  *directs* the treatment, colour *owns* the values.
- **Arrangement / figure-ground / where the image sits / cropping-for-composition** →
  **[[composition-and-design-theory]]**. This skill picks and treats the image; composition places it.
- **Type set over an image** → **[[typography]]** (legibility floor); **page/screen layout** →
  **[[interface-ux-and-layout]]**.
- **The house look / an invented illustration style** → the art-director draws on
  **[[house-style-templates]]** and **[[developing-style]]**; this skill executes image *selection and
  treatment* toward that direction, it does not set the overall theme (the orchestrator/art-director does).

## Quick reference (decision rules)

| Decision | Rule | Confidence |
|---|---|---|
| Should this image be here at all? | Only if it **carries the message**. Decorative/off-brief imagery measurably hurts comprehension — cut it. | [STRONG] |
| Stock "feel-good people" photo | Users **skip** generic-model stock as filler; it draws *less* attention than normal people. Avoid, or make it task-relevant. | [STRONG] |
| Set the mood | Image *content* reliably sets emotional register — choose the subject/scene for the feeling, deliberately. | [STRONG] |
| A person looking at something | Point the model's **gaze at the subject/product** — viewers follow it (~4×). But gaze moves *attention/intent*, **not liking**. | [STRONG] attention / [CONVENTION] intent |
| Smiling vs neutral model | Smiling lifts product evaluation & intent — **except luxury/premium**, where neutral reads more premium. | [STRONG, luxury boundary] |
| Cheap graphic vs none (luxury/premium) | **No graphic beats a cheap graphic.** A weak/cheap image cheapens a premium brand more than empty space does — **omit rather than cheapen**; only ship an asset that meets the register. Imagery may *lead* the asset creation for premium work, but never fills the gap with something cheap. | [CONVENTION, luxury] |
| Caption / label placement | Put it **near** the image, not far — corresponding words+picture together. | [STRONG] |
| "Compose on the rule of thirds" | Does **not** predict photo quality. A low-stakes framing heuristic at most, never a guarantee. | [MYTH as quality-predictor] |
| Photo vs illustration | Photo = concrete/credible; illustration = abstract/ownable/flexible. Illustration direction = a **constructed scaffold** (§4). | [CONVENTION] |
| Alt text | Informative image → describe its point; decorative → `alt=""`; functional → describe the action. | [STRONG — WCAG 1.1.1] |

## 1. Selecting & critiquing — the evidence

- **[STRONG] It must carry the message.** Adding interesting-but-irrelevant material — including
  decorative or off-brief pictures — reduces comprehension and transfer (coherence principle +
  seductive-details). Strongest for low-prior-knowledge / low-working-memory audiences; the *direction*
  is robust across 23/23 coherence tests. So the first question of any image is "what does it make the
  viewer understand or feel that advances the point?" — no answer, no image. (F1.)
- **[STRONG] Task-relevance, not presence, earns attention.** In goal-directed browsing users fixate
  **information-carrying** images (a real product, a diagram) and essentially **ignore** decorative
  "feel-good" imagery and **generic stock people** — model-looking stock draws *less* attention than
  ordinary people and functions as "pure filler." (F6, NN/g eyetracking.) *(Boundary: this is an
  attention channel — decorative imagery can still shape trust/mood through the separate
  aesthetic-usability channel; don't over-claim "decorative images do nothing".)*
- **[STRONG] Image content sets the emotional register.** Affective response to photographs is
  systematic enough to have been formally normed (the IAPS — 1000+ photos rated for valence/arousal).
  So choose the subject and scene *for the feeling* you want, deliberately. (F7.) *(Holds in aggregate
  and direction, not identically per person/culture.)*
- **[STRONG-conditional] Pictures aid memory when distinctive.** The picture-superiority effect is real
  but **not universal** — it weakens or reverses when the image is abstract, homogeneous, or its label
  isn't discriminative. Pictures help recall **most** when the depicted thing is distinct from its
  neighbours, **least** for an abstract or samey set. (F3.)
- **[STRONG] Gaze steers the eye.** A model's gaze directed at the subject/product makes viewers ~**4×**
  more likely to fixate it. Use gaze as a pointer to what matters. (F4.) **But [CONVENTION/single-study]
  gaze's payoff is narrow** — it nudges *attention* and *intent-to-buy*, **not liking** or
  willingness-to-pay, and the steer is **attenuated for a famous celebrity** (viewers linger on the star
  regardless). Don't assume a gaze-led layout makes the subject more *liked* — only more *looked-at*. (F5.)
- **[STRONG, luxury boundary] A smiling model** (vs neutral) raises product evaluation, appeal, and
  purchase intent — a persuasion effect, not just mood. **Reverses for luxury/premium**, where a neutral
  face reads more premium. (F8.) *(Cite the effect, not the "facial-mimicry" mechanism — that was refuted.)*
- **[STRONG] Captions and labels go NEAR the image**, not across the page — corresponding words and
  pictures presented together (spatial contiguity, the largest static-imagery effect). (F2.)
- **[MYTH as a quality-predictor] The rule of thirds** does not distinguish good photos from bad; highly
  aesthetic photos and museum paintings score about as "low" on it as photos that ignore it. Teach it, if
  at all, as a low-stakes framing *starting point* [CONVENTION] — never as a quality guarantee. (F9.)

## 2. The selection & critique process (run this in the loop)

Given a brief and candidate image(s), critique in this order — each step cites §1:

1. **Relevance** — what does it make the viewer understand/feel that advances the message? If nothing, reject. (F1)
2. **The stock-trap** — is it generic feel-good filler / model-stock? If so it will be skipped; replace with something task-relevant or specific. (F6)
3. **Emotional register** — does the subject/scene carry the *intended* feeling, not a generic one? (F7)
4. **Attention** — is the eye led to the point (gaze pointed at the subject, salient element = the subject)? (F4; and → [[composition-and-design-theory]] for figure-ground)
5. **Technical quality** *(craft [CONVENTION])* — in focus where it matters, exposure/lighting reads intentional, resolution & aspect fit the use, no compression mush.
6. **Caption/label** near the image. (F2)
7. **Accessibility** — can it carry alt text; does text-over-image hold contrast? (§5)

Return findings as a tight list — `[keep / treat / replace] — image → reason (cited rule)` — then put **revised candidates** back in front of the person and take the like/not read. Converge, don't lecture.

## 3. Treatment / tonal adjustment — light & code-feasible *(craft [CONVENTION]; no controlled evidence)*

Treatment unifies a set, matches a palette, or shifts mood. Keep it light; **colour values defer to
[[graphical-perception-and-color]]** (palette, contrast floor). What's cheaply doable **in code** vs
what needs a real editor:

- **Duotone / two-tone** — map shadows→one hue, highlights→another. Code-doable: **SVG
  `feComponentTransfer` / `feColorMatrix`**, or Pillow. Strong palette-unifier for a photo set. [CONVENTION]
- **Grayscale / desaturate** — Pillow `ImageEnhance.Color`, CSS `filter: grayscale()`. For a hushed,
  editorial, or "one accent pops" set. [CONVENTION]
- **Grain / texture** — SVG `feTurbulence` overlay, CSS grainy-gradient. Adds a made, analog feel;
  fights the slick-stock look. [CONVENTION]
- **Scrim / overlay** — a gradient or flat wash over an image so text on top holds **AA contrast**
  (this is the accessibility move, not decoration — see §5; contrast owned by [[graphical-perception-and-color]]). [STRONG floor]
- **Crop & aspect** — reframe for the use and the composition (crop-for-composition → [[composition-and-design-theory]]).
- **Contrast / curves / colour-grade** — light `ImageEnhance` / CSS `filter`; grade a set toward one
  palette. Heavy retouching / compositing / object removal is **out of scope** — that's a real editor. [CONVENTION]

Rule of thumb: **flat, systematic, reversible** treatments (duotone, grayscale, grain, scrim, grade)
are code-feasible and safe; anything needing local, per-pixel judgement (retouch, relight, composite)
is not this skill's job.

## 4. Photo vs illustration · the illustration direction · programmatic illustration

**Photo vs illustration** — measured evidence is thin (an open question in the research). Working
[CONVENTION]: **photography** for the concrete, credible, "this exists"; **illustration** for the
abstract, conceptual, ownable, flexible, or wherever a photo would only be generic stock. Decide by what
the message needs, not by default.

**The illustration direction — a *constructed scaffold*, synthesised (not copied) from four illustrators.**
Full record: [references/illustrator-synthesis-research.md](references/illustrator-synthesis-research.md).
Coen Pohl, Malika Favre, Victo Ngai, and Giorgia Lupi share one transferable structure: a **systematic
constructed scaffold + craft density + a distinctive authored hand**, spanning spare-geometric (Pohl,
Favre) to ornate/data-dense (Ngai, Lupi). The design-craft move is to **imitate that structure and
DEVIATE** — never adopt any one signature whole.

**In practice — the validated, ranked leans** *(vision-loop-tested + confirmed by Anatoly's like/not
across many subjects; full record + worked examples →
[references/imagery-gallery/APPROVED-LEANS.md](references/imagery-gallery/APPROVED-LEANS.md)):*
1. **Duotone blockprint** *(default favourite)* — two inks far apart in value, bold tapered wedges, carved
   rings, silhouettes in the light ink, faint grain (≤ 0.12, dark areas only). Reads as *made*, not rendered.
2. **Swiss / subtractive** — one hero form, huge negative space, three colours, flush-left type. The most
   abstract; wrong when the piece must *say* something (its beauty comes from dropping information).
3. **Isometric** — **niche only:** op-art / geometric abstraction, games / "little worlds", how-it-works
   explainers. Wins on dimensional, constructed, *playable* craft; **loses on mood & atmosphere** — a gradient
   or flat piece beats it on an evocative concept. Not for feeling or representational scenes.
4. **Flat-vector** — neutral default when a friendly, literal illustration is wanted.
5. **Blueprint / wireframe** — only when the subject literally *is* a schematic / wireframe / orbit diagram.

**Default to duotone or Swiss** unless the subject calls for a niche lean. **Always render → look → refine —
never author blind:** generate the SVG, rasterise it (`@resvg/resvg-js`, SVG→PNG, no system libs), *look* at
the result, and fix it before shipping — this is how every lean above was validated. Representational faces,
animals, and photographs stay **select-or-commission** (Anthropic has no image-generation model, so "generate"
here means code + this loop, nothing more).

**What a code-capable assistant genuinely BUILDS — the reproducible layer** *[extracted — artists' stated process]*:
- **Parametric isometric / axonometric construction** — build objects from a projection *system* and expose
  the scaffold; density is *constructed*, not hand-composed. Buildable in SVG/Python. *(Pohl, F1 — "treat illustration as construction".)*
- **Subtractive flat-colour figure-ground on a rigid grid** — 2–4 colour separations; **remove anything the
  piece survives without**; let negative space (the ground) carry as much meaning as the figure; fix a
  grid/module first, then place freely inside it. *(Favre, F2/F3 — "design by subtraction & suggestion"; "fix a rigid scaffold, improvise inside it".)*
- **Data visualisation is NOT this skill's — it is [[charting]]'s (Tufte).** Imagery illustrates
  (photographs and non-data illustration); for **any** chart, data mark, or data-driven graphic, defer
  **entirely** to [[charting]]. Do not build "data illustration" here. *(Lupi's data-humanism, F7–F9, informs
  charting, not imagery — kept in the research only as a lesson that a distinctive hand can ride a systematic
  base; the transferable, code-buildable illustration lanes are the geometric and flat ones above.)*
- **Planned, tested palettes + layer-compositing** — treat colour "like a designer, not a painter": plan and
  test a small palette, composite in layers. Colour values → [[graphical-perception-and-color]]. *(Ngai, F4.)*

**What you SELECT or COMMISSION, never generate — the irreducible hand** *[taste]*:
- Expressive, pressure-modulated **linework** and **hand-made textures** (nib-pen line quality, paper grain,
  anti-geometric fluid curves) — procedural geometry cannot convincingly fake these. *(Ngai, F5.)*
- The **judgement of where to cut** (Favre) and the **hand-sketch discovery** step (Lupi) are taste, even where
  the output is later code-built.

**How to DEVIATE into something ownable, not pastiche** *[taste; style-invention → [[developing-style]]]*:
- **Cross-combine moves no single artist uses together** — e.g. an isometric construction reduced to a
  Favre-few flat palette with one authored mark, or a flat figure-ground built on an isometric grid. The mix,
  not any single source, is the signature. *(Ngai's fuse-named-traditions method, F6; synthesis F10.)*
- **Fix a small constant set** — one projection, one palette logic, one mark treatment — held across everything.
  This *is* [[developing-style]]'s method (imitate an *unfamiliar* domain → reduce → hold constants): **hand
  style-invention to it.** This skill executes the *reproducible* build and *selects/commissions* the hand.

## 5. Accessibility & integrity — the floor this skill owns *(WCAG standard + craft)*

Imagery adds one floor to the design-craft set: **non-text content has a text alternative (WCAG 1.1.1,
Level A).** Owned here; never skipped.

- **Alt text by role** *(W3C alt-decision-tree)*: **informative** image → alt describes the *point* it
  makes, concisely (not "image of…"); **decorative** image → `alt=""` (empty, so assistive tech skips
  it); **functional** image (a link/button) → alt describes the *action*, not the picture; **complex**
  image (chart/diagram) → short alt + a **long description** nearby (and the data → [[charting]]). [STRONG — standard]
- **Text over images** — must hold **AA contrast** against the *actual* pixels behind every glyph; use a
  **scrim/overlay/gradient** (§3) or a solid panel, never "it's probably fine." Contrast values →
  [[graphical-perception-and-color]]; legibility → [[typography]]. [STRONG floor]
- **Never colour-alone / image-alone** — meaning carried by an image must also be available as text
  (composes with the colour floor). [STRONG floor]
- **Honest imagery** — no misleading crops, misrepresentative stock, or deceptive composites; imagery
  must not assert something false about the subject. [CONVENTION — integrity]

## Common mistakes

- **Decorative filler** — an image "to break up the text" that carries no message. It costs comprehension
  and gets skipped. (F1, F6)
- **Generic model-stock** — the smiling-diverse-team-around-a-laptop shot. Read as filler; replace with
  the real thing or something specific. (F6)
- **Assuming gaze = liking** — a gaze-led layout makes the subject *looked-at*, not *liked*. (F5)
- **Rule-of-thirds as a quality bar** — it isn't one. (F9)
- **Text on a busy photo with no scrim** — an AA-contrast break dressed as a design choice. (§5)
- **Missing or lazy alt text** — `alt="image"`, or `alt` describing the picture instead of its point. (§5)
- **Citing the folklore** — the refuted "3× recall," "authentic photos get 10% more time," and the
  "facial-mimicry" mechanism are **not** support; don't repeat them. (see research `Refuted`)

## References

- [references/imagery-research.md](references/imagery-research.md) — the 9 verified findings (F1–F9), 3
  refuted claims, 5 open questions, 25 sources. The perceptual/selection evidence base.
- [references/illustrator-synthesis-research.md](references/illustrator-synthesis-research.md) — the §4
  illustration direction, synthesised (not copied) from Coen Pohl, Malika Favre, Victo Ngai, Giorgia Lupi
  (10 findings, 20 sources; the reproducible-vs-commission split).
- [references/imagery-gallery/](references/imagery-gallery/) — a worked gallery of the **code-buildable
  illustration lanes** (isometric construction · flat-colour negative space · the synthesised deviation),
  generated parametrically by `build.py` (the generator *is* the proof the lanes are code-buildable). The
  vehicle for the like/not refinement loop.
- [references/imagery-gallery/APPROVED-LEANS.md](references/imagery-gallery/APPROVED-LEANS.md) — the two
  **validated** code-illustration leans (Swiss/subtractive · duotone-blockprint) that passed the vision-loop
  and like/not review on a real subject. **Never author blind:** always *generate → render (`@resvg/resvg-js`,
  SVG→PNG, no system libs) → look → refine*. Code-illustration is proven-good on flat/geometric/scene/poster
  subjects; representational people, animals, and photographs stay **select-or-commission** (Anthropic has no
  image-generation model — "generate" here means code + the vision-loop, nothing more).

---
name: graphical-perception-and-color
description: Use when choosing colors, palettes, backgrounds, contrast, or visual encodings for any chart, graph, plot, dashboard, or data visualization — or when judging claims about color and the eye/brain (dark mode, "easy on the eyes", blue light, eye strain). Evidence-based rules from graphical-perception and color science (Cleveland & McGill, Heer & Bostock, ColorBrewer, Healey, WCAG, CVD/colorblindness) that separate proven findings from convention and myth. Part of the design-craft toolkit — the orchestrator is the art-director (it sets the theme/feel and coordinates the whole set); all the skills apply together on every piece, this one as a specialist lever.
---

# Graphical Perception & Colour (evidence-based)

## Overview

Most chart/color advice is taste or folklore. A smaller set is backed by controlled
experiments and standards. This skill is the backed set, with confidence labels, so
decisions cite evidence instead of preference.

**Core principle:** Pick the *encoding* before the *color*, and pick *contrast/brightness*
before *hue*. The two most common real mistakes are (1) encoding magnitude with a channel
the eye reads poorly (area/color), and (2) fiddling with background hue when the actual
lever is luminance contrast.

**Confidence labels used below:** **[STRONG]** = controlled studies or a normative standard ·
**[ESTABLISHED]** = canonical, heavily-cited literature — sourced but *not* adversarially re-verified in
this skill's pass; one notch below [STRONG] · **[CONVENTION]** = widely taught, weak/mixed empirical
support · **[taste]** = no evidence either way, a declared aesthetic choice · **[MYTH]** = popular claim
the evidence contradicts. **[ESTABLISHED] and [extracted] denote the same sourced-but-not-verified-here
band** — [ESTABLISHED] from canonical external literature, [extracted] from a skill's own research corpus.

**Precedence with `frontend-design` (Anthropic) — design-craft sets the colour, frontend-design builds it.** This skill owns the colour decisions (palette system, theme, contrast, CVD); `frontend-design` is the production-code implementer that turns them into clean, distinctive code. Lean on it for code quality and technical execution — not for overriding the palette. It steps into a *colour* decision only as a fallback when: (1) this skill doesn't cover it — e.g. a brand's exact required logo hex that isn't in the palette logic (we still check it for contrast/CVD); (2) the guidance is only a weak lean — two accent hues both pass and read equally well; (3) the user rejects the options here; or (4) the user wants a drastic directional change — e.g. "bold neon," not the muted Corbusier default. **Hard floor (never yields to frontend-design; only an explicit user override crosses it, and then name the cost): WCAG contrast, never-colour-alone, CVD-safety.** The evidence labels below are unchanged — leading on Corbusier (a [CONVENTION]) is a house-standard call, not a proof claim.

**How to apply (default posture).** The **[STRONG]** rules and standards are *binding* — don't relax one on
your own. The labelled **defaults** — the **Corbusier** house palette (UI *and* charts), the palette-by-data-type
picks, off-white-not-pure-white, ≤ 7 categorical hues — are the *starting point*: reach for them unless the brief
says otherwise. **[CONVENTION] / [taste]** items are softer — follow them unless there's a specific reason not to.
**Deviate** — go vivid, swap the palette, break a convention — only when the user asks or a condition stated here
applies, and **surface the trade-off** instead of switching silently. The user can override anything; absent that,
hold the defaults.

**Worked example:** these rules applied to one real UI (the agent-run trace timeline) —
length-encoded magnitude, color-never-alone severity, a dark→light re-contrast pass, and an
honest "this part is taste" label — in [references/timeline-example.md](references/timeline-example.md).

**Visual gallery:** nine see-the-difference demos — the encoding hierarchy, categorical-hue limits,
viridis vs. rainbow, diverging, a live deuteranopia simulation, WCAG contrast computed on screen,
background brightness (incl. dark done right), **ten palettes with "use when,"** and **colour for
dashboards & lists** — each citing its study, in
[references/perception-gallery/index.html](references/perception-gallery/index.html).

**Colour-theory & UI palette system:** the newer harmony / preference / emotion evidence, established-science
demos (perceptual gradients, chromostereopsis, simultaneous contrast, Mach bands), and a full **functional
palette-role system** (dominance budget, escalating alerts, components, ten themed sample pages) — in
[references/color-theory-findings/index.html](references/color-theory-findings/index.html) — which also
demonstrates the colour wheel and its harmony schemes, the chart palettes, and the practical-colour topics
(screens, gradients, anti-patterns, modern design systems) drawn from established best practice.

**Full research trail:** the deep-research behind this skill — every claim with its confidence label, named study, one-line evidence, and adversarial verdict (26 findings across 3 research + 3 review workflows) — in [references/graphical-perception-and-color-research.md](references/graphical-perception-and-color-research.md). The **complete raw per-agent corpus** — all 78 source extractions and 225 adversarial verifications, verbatim — is in [references/graphical-perception-and-color-corpus.md](references/graphical-perception-and-color-corpus.md). Read either to audit any claim below against its source.

## User direction comes first

This skill applies its lever inside a **creative direction that belongs to the user** — intent, mood, and register (self-effacing ↔ expressive). In a design-craft team run the direction arrives from the art-director (the orchestrator), already **confirmed with the user**, in the shared brief. Used standalone, it comes from whoever invoked the skill. **If no confirmed direction has been handed to you, ask for it — the art-director in a team run, the user otherwise — before making any direction-shaping choice.** The skill's defaults and reflexes are never a substitute for the user's intent.

## Quick Reference (decision rules)

| Decision | Rule | Confidence |
|---|---|---|
| Encode a quantity | Use **position** on a common scale; then length. Avoid **area** (bubble size) and **color** for values you need read accurately. | [STRONG] |
| Bubble/dot size | OK only for *secondary, approximate* magnitude; viewers underestimate area. Add a position/axis for the value that matters. | [STRONG] |
| Categorical palette | ≤ **5–7** hues for reliable rapid identification; 3–6 series is safe. | [STRONG] |
| Don't rely on color alone | Also distinguish by **shape/label/position** (WCAG 1.4.1). Label series directly; avoid hue-only legends. | [STRONG] |
| Sequential/continuous | Perceptually-uniform map with **monotonic lightness** (Viridis/Cividis). | [STRONG] |
| Rainbow/jet | Don't use for ordered/continuous data. | [STRONG] |
| Colorblind safety | Assume ~8% of male viewers have CVD; ensure marks differ in **lightness**, not just hue; simulate deuteranopia. | [STRONG] |
| Contrast: text | 4.5:1 (normal), 3:1 (≥18pt or 14pt bold). | [STRONG] |
| Contrast: data marks/lines | **3:1** vs the **background** if needed to read the chart (WCAG 1.4.11); marks need not contrast with *each other*. | [STRONG] |
| Background hue ("paper", green) | Hue is preference; it does **not** reduce strain independent of brightness. | [MYTH to claim otherwise] |
| Background brightness | Avoid a blazing pure-white field; lower absolute luminance while keeping high text/mark contrast. | [STRONG-ish] |
| Light vs dark mode | For glanceable **charts**, no clear winner — offer both. Light wins only for **small dense text**. | mixed; text=[STRONG] |
| Blue-light filters "for eye health" | Don't bother; blue light affects **sleep at night**, not daytime eye strain. | [MYTH / STRONG] |

## 1. Encoding effectiveness — the perceptual hierarchy

Cleveland & McGill (1984) ranked how *accurately* people decode visual encodings of a
quantity, and Heer & Bostock (2010) reproduced it. Best → worst:

**position (common scale) > position (unaligned) > length > angle/slope > area > volume > color/shading**

- **[STRONG]** Area is 4th of 6 and *systematically underestimated* (Stevens' power law,
  exponent ~0.7–0.8 → big values look smaller than they are). Squares/circles fare worst
  because viewers approximate area via one side's length.
- **Implication:** encoding a primary quantity by **bubble/dot area** is among the weakest
  choices. If the number matters, put it on a **position axis** (or use length/height).
  Reserve area for a rough secondary cue.
- **Caveat:** the ranking is an *aggregate* default, not a per-person law (individual
  variation exists). It's a strong default, not an excuse to skip thinking.

Frameworks that operationalize this (Bertin's visual variables; Munzner's marks & channels)
derive from these same studies — use them, but know the empirical root is the ranking above.

**[CONVENTION, not law]** Tufte's "data-ink ratio / chartjunk" minimalism: controlled
studies (Bateman 2010; Borgo 2012) found *no* comprehension penalty from tasteful
embellishment, and recall was sometimes better. "Remove all non-data ink" is a style, not
a proven rule. Don't invoke it as evidence. (Few's critique of those studies' scope also
stands — so: genuinely unsettled, treat as taste.)

## 2. Categorical (qualitative) color

- **[STRONG]** Only ~**5–7** colors are reliably identified in *rapid visual search*
  (Healey 1996). For 3–6 data series you're safe; beyond ~7, identification degrades.
- **Ready-made categorical sets:** Okabe–Ito (CVD-safe), ColorBrewer qualitative, and **Tableau 10 / 20**
  (Maureen Stone — tuned for categorical separation with reasonable CVD spacing, and shipping light- and
  dark-ground variants). Good defaults when you need named, distinct series colours — still cap rapid-ID at ~7.
- ColorBrewer "qualitative" schemes vary hue at near-constant lightness (Harrower & Brewer
  2003). Good for nominal categories — but most qualitative schemes are **hard for
  colorblind viewers** (see §4).
- **[STRONG]** WCAG 1.4.1 *Use of Color*: never let hue be the *only* differentiator. Add
  shape, direct labels, or position. A hue-only legend (match line to swatch) is a known
  failure pattern — label series in place. **The threshold that makes "distinguish by lightness"
  actually satisfy 1.4.1:** the lightness difference must itself reach **≥3:1 contrast** — below that it
  doesn't count as the non-colour cue, so add shape/label/position (W3C 1.4.1 Understanding).

## 3. Sequential / diverging (continuous magnitude as color)

- **[STRONG]** The most important property of a continuous colormap is a **monotonic,
  perceptually-uniform increase in lightness** (Kovesi 2015; Nuñez 2018). Lightness carries
  fine detail; hue/chroma alone don't.
- **[STRONG]** **Rainbow/jet is harmful** for ordered data (Borland & Taylor 2007): no
  perceived value order, non-monotonic luminance hides detail, and false boundaries appear
  where hue changes fast. Use **Viridis** (or **Cividis**, tuned to look the same to CVD
  viewers). Nuance — **rainbow isn't *always* wrong**: it aids pure hue-segmentation, discrete colour
  *bands* can even help gradient reading (viewers use band size/frequency as a proxy), and its harms are
  task-dependent (Ware, Stone, Szafir & Rhyne 2023, *Rainbow Colormaps Are Not All Bad*; a 37,000-figure
  cross-discipline survey confirms both its prevalence and that dependence). Still: never use it to show a
  **magnitude you must read as a value**.
- **[caveat — "uniform" isn't universally best]** Perceptual uniformity is a strong *default*, not a
  law. For **gradient-steepness discrimination Viridis tested *worst*** of three maps (cool-warm 2.86%
  and rainbow 3.05% JND both beat Viridis 3.61%; Reda 2019), and single-hue maps can be faster though
  less accurate (Cho et al. 2019, n=35). Keep Viridis/Cividis as the default, but the best map is
  **task- and span-dependent** — test it when the read is critical.
- **[bounding]** **CIELAB distance ≠ uniform perception.** Equal CIELAB steps don't guarantee equal
  *feature detectability* — CIELAB over-weights chroma for small features (Ware, Turton, Bujack et al.
  2018), and is uniform only at **low spatial frequency**, so trust its lightness (not its chroma/hue)
  at fine detail (Kovesi 2015). Judge a colormap behaviourally, not from colour-space spacing.
- **[diverging]** Interpolate gradients in a **perceptual space** (naive RGB gives grey dead-zones) —
  but even piecewise-linear **CIELAB** leaves a **Mach band at a diverging map's white midpoint**
  (luminance reverses there); Moreland's polar **Msh** interpolation smooths it (Moreland 2009, the
  coolwarm map). Comparisons that straddle a diverging map's centre also cost accuracy (Liu & Heer 2018).
- Sequential = ordered low→high (lightness-dominated). Diverging = emphasize a midpoint/break
  (hue+lightness both sides). Match the scheme type to the data (ColorBrewer typology).
- **Convention worth knowing:** "darker = more" is a real viewer expectation (dark-is-more
  bias) — orient sequential ramps accordingly.

## 4. Color vision deficiency (CVD / "colorblindness")

- **[STRONG]** Affects up to ~**8% of men** (Northern-European upper bound; global ~2.6%)
  and ~0.5% of women; red-green (deuteranomaly) is most common.
- Design rule: encode differences in **lightness**, not just hue; red-green pairs are the
  classic trap. Sequential lightness ramps survive CVD; most qualitative hue sets don't.
- **Always simulate** deuteranopia/protanopia/tritanopia (Color Oracle, colorbrewer2.org's
  safe filter, Coblis). "Safe" is also *class-count dependent* — a ramp safe at 5 steps can
  fail at 9.

## 5. Contrast & legibility (the only binding standard: WCAG 2.x)

- **[STRONG / normative]** Contrast ratio = (L1+0.05)/(L2+0.05) on relative luminance
  L = 0.2126R + 0.7152G + 0.0722B (linearized). Range 1:1–21:1.
  - Text: **4.5:1**; large text (≥18pt or ≥14pt bold): **3:1**.
  - **Non-text / graphical objects (SC 1.4.11): 3:1** — this covers chart lines, points, bars, and
    data-bearing gridlines against their **background**. W3C's Understanding text is explicit that
    adjacent data lines/marks **do *not* need to contrast with each other** — only with the background;
    distinguishing neighbouring marks by 3:1 is good practice, not a 1.4.11 requirement.
  - Exemptions: purely decorative elements, and "essential" color-as-data (e.g. heatmap
    gradients) are exempt from 1.4.11.
- **[STRONG] Luminance contrast — not colour contrast — drives reading** (the mechanism behind this
  skill's "contrast/brightness before hue"). Visual-search time, fixation count, and fixation duration
  all rise sharply as **luminance** contrast drops, *even when colour contrast stays high*; at
  equiluminance (hues differ, luminance matched) acuity collapses and edges destabilise (Mullen 1985;
  luminance-search evidence, *Displays* S0141938204000046). Spend the contrast budget on lightness first.
- **Reference/threshold/gridlines:** 3:1 *if a reader must use them to read a value*; if the
  chart labels values directly, faint decorative gridlines are exempt. Decide per chart on
  "is this required to understand the content?"
- **[DRAFT — not a standard]** APCA (perceptual Lc, polarity/size-aware) was **removed from
  the WCAG 3 draft in 2023**; WCAG 3 has *no* contrast method as of 2026 and is years away.
  You may use APCA's nicer model for tuning, but **conform to WCAG 2 as the pass/fail gate.** In
  production the two majors already split — **Radix** specs text in APCA Lc (Lc 60 / 90), **Material 3**
  maps tone to WCAG-2 ratios (3:1, 7:1) — so "which metric" is an unsettled, system-dependent
  convention (Radix docs; Material 3 docs).
- Practical: thin lines and small marks need higher contrast (no normative thickness number
  exists). A tinted/colored background shrinks the palette that passes 3:1 — retest every
  series against the actual background.

## 6. Background & eye comfort (where most folklore lives)

- **[MYTH]** "Green / black / <tint> is easy on the eyes." No sound evidence a *hue* is
  intrinsically restful. The one study favoring green didn't equate luminance, so its effect
  is brightness, not color — and its pupil data actually argues against its own conclusion.
- **[STRONG, but it's brightness not hue]** "Don't use pure white" is real *only* because a
  full-screen blast of high-luminance white is a lot of light. The fix is **lower absolute
  brightness + keep high contrast**, achievable with off-white/light-gray — the tint itself
  isn't the mechanism. Luminance contrast drives legibility and comfort more than hue.
- **Light vs dark mode:**
  - **[STRONG]** *Positive polarity* (dark text on light) improves acuity/proofreading for
    **small, dense text** in normal light — brighter background → smaller pupil → more depth
    of field → sharper retinal image (Buchner & Baumgartner 2007; Piepenbrock 2013/2014).
    Caveat: this is an **emissive-screen / luminance** effect, not a hard technology law — the old
    print/CRT legibility rankings don't transfer to LCDs (the polarity ranking actually *reversed* on CRT).
  - **[mixed]** For **glanceable chart/dashboard** tasks there's **no clear polarity winner**
    (While & Sarvghad 2024). Dark mode helps in dim rooms, photophobia, and cloudy-media low
    vision (Legge 1985; Dobres 2017).
  - **[STRONG, replicated]** *Preference ≠ performance*: people prefer dark mode but read
    prose better in light. So **offer both**; don't force one as "better."
- **[MYTH]** "Screen blue light strains/damages eyes." American Academy of Ophthalmology:
  no evidence of damage; they don't recommend blue-light glasses. Digital eye strain is
  dry-eye from reduced blinking — fix with the **20-20-20 rule**, not color.
- **[STRONG, but irrelevant by day]** Blue light *does* shift circadian rhythm at night
  (melanopsin/ipRGCs, ~480nm; St Hilaire/Lockley 2022). That's a sleep concern, not a
  daytime eye-comfort one.

## Colour harmony, preference & emotion (newer evidence)

All reinforce *"contrast/lightness before hue."*

- **[CONVENTION / against]** Classical **harmony rules** (complementary, analogous, triadic,
  split-complementary) have **no validated power to predict preference** — controlled studies
  disagree on which even holds (Schloss & Palmer 2011 find *similarity* preferred; Forni et al. 2025
  find the *contrast* region preferred), and the foundational harmonisation algorithm concedes there
  is no empirical definition of a harmonic set (Cohen-Or et al. 2006). Don't cite a hue-wheel scheme as evidence.
- **The colour wheel — [STRONG] the ring, [CONVENTION] the spokes.** The wheel is real: hue is
  encoded by two **opponent channels** (red–green, blue–yellow; Hering 1878, modelled psychophysically by
  Hurvich & Jameson 1957 and confirmed in opponent neurons by De Valois 1958), so a hue circle is genuine
  perceptual structure — *not* arbitrary. Two caveats:
  **(a)** draw it in a **perceptually-uniform** space (**OKLCh / CIELAB**; Ottosson 2020, the model
  modern tooling uses), because **HSL/RGB equal angles are not equal perceptual steps** — that ring's
  WCAG lightness swings from ≈0.07 at blue to ≈0.93 at yellow (yellows look pale, blues dark);
  **(b)** the **harmony spokes** off it are the convention above. The standard combinations the wheel is
  used to find: **complementary** (opposite, 180° — max contrast), **monochromatic** (one hue varied by
  *tint* +white / *tone* +grey / *shade* +black — leans on lightness, not hue), **analogous** (neighbours,
  ±30° — calm), **triadic** (thirds, 120° — balanced multi-category), **split-complementary** (the two hues
  flanking the complement), **tetradic** (two complementary pairs). These are the same combinations
  interactive pickers (Canva, Adobe Color) expose. Treat them as a *vocabulary* and a reliable way to
  *space categorical hues apart* — **not** a predictor of a good pairing. Read the scheme off the wheel for
  candidates, then pick the actual colours by lightness contrast + CVD-safety + liked-hue, and verify.
- **[STRONG]** What predicts preference for a colour **pair** is **component-colour preference +
  lightness contrast** — a model with figure/ground preference + lightness difference explains ~81% of
  pair-preference variance (Schloss & Palmer 2011). Pick individually-liked colours and ensure lightness contrast.
- **[STRONG]** **Single-colour preference follows learned object associations** (Ecological Valence
  Theory): a no-free-parameter model predicts adult preference at r ≈ 0.89, **peaking at blue/cyan**
  (sky, clean water) and **troughing at chartreuse / dark-yellow / brown** (decay) (Palmer & Schloss 2010).
  Draw accents from liked hues; avoid the chartreuse–olive–brown trough.
- **Colour→emotion** associations are real, systematic and broadly cross-cultural (132-study review;
  30-nation study, cross-nation r ≈ .88), on valence/arousal/warm-cool/light-heavy/active-passive
  dimensions **[STRONG]** — **but many-to-many**, so "one colour = one emotion (blue = trust)" is a
  **[MYTH]** (Jonauskaite 2020; Ou 2018). Emotion tracks **lightness & saturation** as much as hue.
- **[MYTH]** "Romantic red" (incidental red raises attractiveness) — meta-analytic d ≈ 0.13–0.26 with
  strong publication bias and **pre-registered nulls** (Lehmann, Elliot & Calin-Jageman 2018). Treat pop
  "colour psychology" as taste until shown otherwise.

## 7. Evidence vs. myth (fast lookup)

| Popular claim | Verdict |
|---|---|
| "Bubble size is a fine way to show amounts" | Weak — area is underestimated; prefer position. [STRONG against] |
| "Use a rainbow colormap for a heatmap" | No — harmful for ordered data. [STRONG against] |
| "You can use ~12 categorical colors" | Not for rapid ID — cap ~7. [STRONG] |
| "Remove all non-data ink (chartjunk)" | Taste, not proven. [CONVENTION] |
| "Green/sepia/paper background is easier on the eyes" | Myth (it's brightness, not hue). [MYTH] |
| "Pure white is bad for your eyes" | Only via brightness/glare, not the color. [partial] |
| "Dark mode is better / easier on the eyes" | No clear winner for charts; preference≠performance. [mixed] |
| "Blue light from screens hurts your eyes" | Myth (AAO); it affects night sleep only. [MYTH] |
| "APCA is the new accessibility standard" | No — non-normative draft; use WCAG 2. [STRONG against] |
| "Colour-harmony rules predict what looks good" | No — convention; preference = component-pref + lightness contrast. [CONVENTION] |
| "Equal steps on the HSL/RGB colour wheel = equal visual steps" | No — that ring is perceptually lumpy; use a uniform wheel (OKLCh/CIELAB). [STRONG against] |
| "One colour means one emotion (blue = trust)" | Associations are real but many-to-many. [MYTH for 1:1] |
| "Red makes people/things more attractive" | Weak, publication-biased, pre-registered nulls. [MYTH] |

## Palettes — pick by data type

Match the palette's **type** to the data first, then pick within it. Prefer
colourblind-safe defaults (Okabe–Ito, viridis) unless you have a reason not to. Full
swatches + citations are in the visual gallery; this is the quick pick.

- **Categorical** (nominal — distinct things):
  - **Okabe–Ito (8)** — the colourblind-safe default for ≤ 8 series. [Okabe & Ito 2008]
  - **ColorBrewer Set2 / Dark2** — soft, print-friendly nominal categories. [Harrower & Brewer 2003]
  - **Tableau 10 / 20** — familiar dashboard defaults with reasonable CVD spacing; prefer Okabe–Ito when CVD-safety must be guaranteed.
- **Sequential** (ordered low → high):
  - **Viridis / Cividis** — perceptually uniform, CVD-safe; the default for heatmaps and continuous magnitude. [Smith & van der Walt 2015; Nuñez 2018]
  - **ColorBrewer single-hue (Blues, Greens)** — one quantity, "darker = more."
  - **ColorBrewer multi-hue (YlOrRd, YlGnBu)** — when you need wider perceptual range.
- **Diverging** (signed, around a midpoint):
  - **ColorBrewer RdBu / PuOr** — deviation above/below a reference; correlation.
  - **ColorBrewer BrBG** — diverging when red/green must be avoided (safer than RdYlGn). [Harrower & Brewer 2003]
- **Neutral + one accent** (when colour is *not* the data):
  - **Gray scale + a single accent** — reserve the accent for the one thing that matters; print- and CVD-proof. [WCAG 1.4.1]

Rule of thumb: **≤ 7 categorical hues**, distinguished by *lightness* (not hue alone),
and a diverging scale only when there's a real midpoint — otherwise sequential.

## Colour in dashboards & lists

Most people building visualizations are building these, and they have specific colour
failure modes. (The dashboard / list *forms* live in the **charting** skill; this is
their *colour*.)

- **One palette across all tiles, one reserved accent.** A dashboard where every tile
  is a different hue reads as noise. Keep the marks one quiet ink and spend a *single*
  accent on the one thing that should jump out (an alert, a breach).
- **Never encode status by hue alone.** Red-amber-green dots are the most common
  dashboard sin — ~8% of men can't separate the red from the green. Back the colour
  with a **shape or a word** (●/▲/■, or "OK / WARN / FAIL"). [WCAG 1.4.1]
- **Lists & tables: keep colour quiet.** Inline status dots (with a label), faint data
  bars, or a single-hue heat fill in the cell — not a rainbow. Colour is the cue; the
  numbers are the figure.
- **Consistency is meaning.** If green means "good" in one tile, it must mean good
  everywhere on the screen. Re-using a hue for two meanings is a silent bug.

## Functional UI colour roles (theme palettes)

For UI *chrome* (not data encoding), assign colour to **roles** and spend it sparingly. The
*structure* is design-system **[CONVENTION]**; the load-bearing parts are evidence-backed. Worked
across ten themes in the colour-theory gallery.

- **Dominance budget — 2–3 dominant tones fill the screen.** One **ground** + one **ink** do ~90% of
  the work; everything chromatic is a sliver. Use an **off-white ground (not pure white)** + **near-black
  ink (not pure black)** — §6: drop luminance, keep contrast.
- **Smallest effective difference for separation.** Separate panels/cards with a **hairline**, not a
  second fill — don't spend a colour where a line will do. (Tufte restraint = **[taste]**, not proven
  comprehension; see §1 — but it does keep the field calm, which the next point needs.)
- **One reserved emphasis colour** for important *text*, distinct from info and from the error red.
  **Reserving it is sound [ESTABLISHED — vision science, but *not* adversarially verified in this skill's
  research]:** a single distinct mark is found *preattentively* only against a **calm field** (Healey &
  Enns; Treisman) — if everything is coloured, nothing pops. (Pop-out is real, but this research's
  preattentive topic produced no surviving verified claim, so don't over-weight the label.)
- **Escalating alert channel: info < warning < severe.** Info blends, warning is gentle, **severe must
  be the most prominent** — by hue *and* contrast — each backed by an icon + word (never colour alone, 1.4.1).
- **Components reuse the palette:** header/nav from ground + ink, links from the accent.
- **Real-world role systems to model this on [CONVENTION]:** **Radix** ships every colour as a fixed
  **12-step scale** with semantic roles — 1–2 app/subtle backgrounds, 3–5 component bg
  (normal/hover/active), 6–8 borders, 9–10 solid, 11–12 text — a concrete instance of the dominance/role
  budget above. **Material 3's HCT** does the same mechanically: because **tone (= luminance) can be held
  fixed while hue and chroma vary** (which RGB/HSL can't), a token system can *guarantee* contrast
  independent of hue (tones 50/98 → 3:1, 30/98 → 7:1).

**Build notes (each verified by on-screen contrast audit):**
- **On a dark ground a gold/amber "warning" out-contrasts a red "severe"** — amber is intrinsically more
  luminous than red. To keep severe the most prominent alert on dark themes you must **mute the warn or
  brighten the severe**; don't assume red wins (re-tests §5).
- **Audit every token against the *actual* ground.** A saturated blue accent that clears AA on a white
  ground can fall to **~3.7:1 on a darker newsprint ground** — so compute the ratio per theme and
  **re-tune the token's lightness until it clears**, rather than trusting a hex that passed elsewhere.
- **Pure white is the brightest possible ground.** Offer it if asked, but the §6 default is an **off-white**
  — reserve pure white for when maximum crispness is wanted over comfort.

**A tasteful default — lean "Corbusier," especially with Tufte.** On an open brief ("just make it look
good"), default to the **muted-architectural register**: a warm *low-chroma* ground, near-black ink,
**earth-muted supporting colours** (ochre, sienna, slate, dusty ultramarine) at modest saturation, with the
loud hues held **in reserve** for the one emphasis + the alert channel. This is taste, but taste that stacks
three evidence-backed effects: a low-chroma ground minimizes **simultaneous-contrast** shifts so accents read
true (see the simultaneous-contrast demo on the reference page); **rare, reserved accents** are what make
preattentive **pop-out** work (a mark is only found fast against a calm field); and **lightness-before-hue**
(§§3–6) is carried by ink-on-ground. It
also **pairs naturally with Tufte** — data-ink minimalism wants the page quiet and colour spent only where it
carries meaning, and a hushed earth palette *is* that discipline in colour. Go vivid / saturated / primary-led
only when the brief explicitly asks for energy or play; loud-everywhere fights the calm field that pop-out and
Tufte both depend on. (Modelled by the **Corbusier Light / Dark / Watercolour** themes — Le Corbusier's *Polychromie Architecturale*.)

**What the research backs — this part is *finding*, not taste.** The palette's internal **harmony logic** is peer-reviewed, not just house preference: an NCS analysis of Le Corbusier's actual 1931 Salubra keyboards — **Serra et al. 2016** (*Color Research & Application*; 312 four-colour combinations) — found he combined colours by **equal chromaticness (saturation) + contrast in blackness (lightness) + warm-cool contrast**, *not* classic complementary-hue contrast. That is the citable reason the muted set coheres, and it aligns with this skill's own **lightness-before-hue** rule. Empirically, designers also **prefer pale, low-saturation colours** (Serra, Manav & Gouaich 2021), which supports the restrained register. **Honest limits (this part stays [CONVENTION]):** Le Corbusier's spatial claims — blue recedes / red fixes the wall; blue calms / red excites — are his *design doctrine*, **not** validated colour physiology; and the harmony rules were verified for *reflective paint/wallpaper*, so whether they transfer to emissive **RGB screens**, and the **WCAG contrast** of these low-saturation tones, are **not** established — *choosing* Corbusier as the on-screen default therefore remains a house-standard call. Full evidence (8 verified findings, 4 refuted, cited): [references/corbusier-palette-research.md](references/corbusier-palette-research.md).

**Chart colour follows the same split — light, dark & watercolour.** Corbusier is a *family*: light, dark +
watercolour UI themes **and** matching **chart** palettes (the same earth tones, brightened on the dark ground
so marks stay ≥3:1). For charts, default to that restrained set — ink carries the data, one accent marks what
matters (Tufte). **Switch the chart — only the chart — to a proven categorical set** when you need more
mutually-distinct categories than the muted palette can give, or when Corbusier's hues clash with the surrounding
UI: **Okabe–Ito** if CVD-safety is critical (§4), otherwise **Tableau 10 / 20** (Maureen Stone). Tableau is
**chart-only, never UI chrome**, and also ships light + dark (the dark variant brightened for
dark grounds) — pick the one that matches the ground. Either way: cap rapidly-identified series at **~7**
(Healey, §2) and **direct-label** so colour is never the sole cue.

## Common mistakes

- Sizing marks by **area/value** and treating size as the precise readout. (Add a position axis.)
- Choosing a **background hue** for "comfort." (Choose brightness + contrast; hue is taste.)
- A **hue-only legend** forcing match-the-color. (Label/shape-code in place — WCAG 1.4.1.)
- Picking colors that look distinct **to you** but collapse under **deuteranopia**. (Simulate.)
- Tuning data colors for a dark theme, then flipping the background and leaving them washed
  out. (Re-check **3:1** against the *actual* background after any background change.)
- Citing **Tufte/chartjunk** as if it were empirical law. (It's convention.)
- Adding **blue-light filtering** "for eye health." (No evidence; ignore for daytime tools.)

## Citations (primary)

- Cleveland & McGill (1984), *JASA* 79(387):531–554 — graphical perception ranking.
- Heer & Bostock (2010), *CHI* — crowdsourced replication; area/position results.
- Healey (1996), *IEEE Vis* — ~5–7 rapidly-identifiable colors.
- Harrower & Brewer (2003), *Cartographic Journal* — ColorBrewer typology + CVD notes.
- Borland & Taylor (2007), *IEEE CG&A* — rainbow colormap harmful.
- Kovesi (2015), arXiv:1509.03700 — uniform-lightness colormap design.
- Nuñez, Anderton & Renslow (2018), *PLOS ONE* — Cividis; CVD prevalence.
- Machado, Oliveira & Fernandes (2009), *IEEE TVCG* — CVD simulation matrices (deuteranopia).
- Okabe & Ito (2008) — Color Universal Design colourblind-safe qualitative palette.
- Smith & van der Walt (2015) — viridis perceptually-uniform colormap.
- Munzner (2014), *Visualization Analysis & Design* — marks & channels.
- Bateman et al. (2010), *CHI* — chartjunk has no comprehension penalty.
- W3C WCAG 2.1/2.2 — SC 1.4.1, 1.4.3, 1.4.11 (Understanding docs).
- Roselli (2026), "WCAG3 Contrast as of April 2026"; Myndex APCA docs — APCA status.
- Buchner & Baumgartner (2007); Piepenbrock et al. (2013, 2014), *Ergonomics* — polarity.
- While & Sarvghad (2024), arXiv:2409.10841 — polarity no clear winner for charts.
- Legge et al. (1985); Dobres et al. (2017) — when dark mode helps.
- St Hilaire … Lockley (2022), *PNAS* 119(51) — circadian spectral sensitivity.
- American Academy of Ophthalmology — blue light / eye strain position.
- Schloss & Palmer (2011), *Atten. Percept. Psychophys.* — colour-pair preference = component-pref + lightness contrast.
- Palmer & Schloss (2010), *PNAS* 107:8877 — Ecological Valence Theory of colour preference (WAVE, r≈.89).
- Cohen-Or et al. (2006), *SIGGRAPH* — colour harmonisation (no empirical definition of harmony).
- Hering (1878), *Zur Lehre vom Lichtsinne*; Hurvich & Jameson (1957), *Psychological Review* 64:384–404 — opponent-process colour vision (psychophysical hue-cancellation; the hue circle's real basis). Physiological confirmation: De Valois et al. (1958), opponent cells in macaque LGN.
- Forni et al. (2025), arXiv:2508.15777 — colour-pair preference peaks in the contrast region near complementary hues (no universal harmony rule).
- Stone (Tableau) — Tableau 10 / 20 categorical palettes; separation-tuned qualitative colours with CVD spacing, light & dark variants.
- Ottosson (2020), "A perceptual colour space for image processing" (OKLab / OKLCh) — perceptually-uniform hue wheel.
- Jonauskaite et al. (2020), *Psychological Science* — 30-nation colour-emotion (cross-nation r≈.88).
- Ou et al. (2018), *Color Res. Appl.* (CIE TC1-86) — universal colour-emotion & harmony models.
- Lehmann, Elliot & Calin-Jageman (2018), *Evolutionary Psychology* — "romantic red" meta-analysis (weak/null).
- Healey & Enns (2012), *IEEE TVCG*; Treisman (1985) — preattentive pop-out / feature search.
- Ware, Stone, Szafir & Rhyne (2023), *IEEE CG&A* — "Rainbow Colormaps Are Not All Bad"; task-dependent, discrete bands can aid gradient reading.
- Mullen (1985), *J. Physiology* 359:381 — equiluminant contrast-sensitivity collapse (colour carries far less spatial detail than luminance) — basis for "luminance drives reading."
- Reda et al. (2019), *IEEE VIS* — preregistered JND; Viridis worst of three for gradient-steepness discrimination.
- Cho et al. (2019), *Appl. Sci.* (n=35) — colormap speed vs accuracy (single-hue fastest, Viridis most accurate).
- Ware, Turton, Bujack et al. (2018), *IEEE TVCG* — CIELAB distance ≠ colormapped feature-detection thresholds.
- Liu & Heer (2018), *CHI* — colormap perception; uniformity benefit is span-dependent.
- Moreland (2009), *ISVC* — diverging "coolwarm" map; polar Msh interpolation removes the white-midpoint Mach band.
- Radix (2026) docs; Material 3 docs — live production split: APCA Lc steps vs WCAG-2 tonal ratios.

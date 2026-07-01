# Graphical Perception & Colour: Research Synthesis

**Purpose.** Raw material and audit trail for the `design-craft` skill
[[graphical-perception-and-color]] — the evidence base that lets colour, contrast, and
encoding decisions cite a study instead of a preference. Feeds [[developing-style]] and the
whole design-craft toolkit as the colour-science floor.

**Method.** Recovered from the original deep-research runs (each: fan-out web search → fetch
→ extract falsifiable claims → **3-vote adversarial verification, 2/3 refutes kill a claim** →
synthesise). Three research passes plus three artifact-review passes:

| Pass | Date | Scope | Sources | Claims | Verified | Confirmed→killed | Synthesised |
|---|---|---|---|---|---|---|---|
| **1 — Encoding / CVD / colormap** | 2026-06-21 | topics 1–5 of the original brief | 26 | 119 | 25 | 23 → 2 | 12 findings |
| **2 — Harmony / emotion** | 2026-06-26 | colour harmony + colour psychology | 28 | 131 | 25 | 25 → 0 | 5 findings |
| **3 — Screen / contrast / systems** | 2026-06-26 | polarity, gradients, WCAG, design-system tokens | 24 | 105 | 25 | 24 → 1 | 9 findings |
| Review A — adversarial (7 dimensions) | 2026-06-26 | verify the built skill + page | — | — | — | 13 fixes + 2 known | — |
| Review B — round 2 | 2026-06-26 | re-check after fixes | — | — | — | 3 fixes | — |
| Review C — gallery | 2026-06-26 | verify the visual gallery | — | — | — | 4 fixes | — |

Totals across the three research passes: **~12.4M tokens, 321 agent calls, 78 sources
fetched, 355 claims extracted, 75 adversarially verified, 72 survived, 3 killed, 26 findings.**

**Snapshot date:** 2026-07-01 (reconstructed). The contrast-standard material (WCAG vs APCA)
and the design-system token rules (Radix, Material 3) are the time-sensitive parts — re-check
against current W3C / vendor docs before quoting numbers. The vision-science findings
(encoding hierarchy, luminance-drives-legibility, colour-emotion associations) are stable.

## How to read the labels

- **[STRONG]** — controlled peer-reviewed study or a normative standard. Binding; don't relax on a whim.
- **[CONVENTION]** — established best practice from a named authority (a design system, a canonical text); thin or no controlled evidence. The default starting point; deviate with reason.
- **[MYTH]** — the popular claim failed verification or the evidence contradicts it. Do **not** codify.
- **Verdict** = the adversarial vote the claim survived on: `3-0` unanimous, `2-1` split-but-survived, `merged` (several verified claims combined), `REFUTED` (killed 0-3 / 1-2).
- Source quality is carried inline; arXiv preprints and MDPI / n-small studies are flagged where they carry weight.

**Noise-stripped.** Everything below is drawn from the *synthesised* verdict fields of the
research runs — no rate-limit / retry / tool-call / token-count / orchestration text survives
into this document.

---

## Part 1 — Encoding & graphical perception

### 1.1 The encoding-accuracy hierarchy is empirically settled — [STRONG] · verdict 3-0
Position along a common scale is decoded most accurately, then length, then angle/slope, then
**area**, with shading/colour-saturation least accurate. The ranking drives chart
recommendations (dot/bar over pie; framed-rectangle over shaded map).
*Cleveland & McGill 1984, JASA 79(387):531–554.* Evidence: the foundational study that set out
to give graphical methods a scientific footing and ranked the elementary perceptual tasks by
decoding accuracy. **Caveat:** arXiv 2212.10533 ("The Risks of Ranking") challenges the
*universality* of one fixed ranking across individuals — not the aggregate order, and not
"position beats area." Treat as a strong aggregate default, not a per-person law.

### 1.2 The hierarchy replicated at scale — [STRONG] · verdict 3-0
Heer & Bostock (2010) reproduced the ranking via Mechanical Turk: position significantly beat
length; area performed worse than angle and far worse than position; the type-ranking held, and
crowdsourced perception experiments were validated as viable.
*Heer & Bostock 2010, CHI (Best-Paper nominee).* Their new rectangular-area experiment found
1:1 squares performed **worst** because viewers approximate area via one side's length —
Stevens' power-law area underestimation (exponent ≈0.7–0.8) is the mechanism.

### 1.3 Practical implication: don't encode magnitude by area — [STRONG] · verdict 3-0 (merged)
Encoding a primary quantity by dot/bubble **area** is among the least accurate choices — 4th of
6, below all position encodings and below angle, and systematically underestimated. Prefer
position (a common axis) or length; reserve area for secondary/approximate magnitude only.
*Cleveland & McGill 1984 + Heer & Bostock 2010 + Stevens' law.* The directly load-bearing rule
for a screen chart.

### 1.4 Munzner's marks & channels rests on the studies, not opinion — [STRONG] · verdict 3-0 (+2-1)
Munzner's "marks and channels" framework (ranking channels by data type) derives from Cleveland
& McGill's magnitude ranking, Bertin's visual-variable vocabulary, and Stevens's measurement
scales — an empirical/theoretical scaffold, not taste.
*Munzner 2014, Visualization Analysis & Design, Ch.5.* The 2-1 split reflected only that the
cited quote named Cleveland & McGill explicitly while Bertin/Stevens attribution came from
corroborating course notes.

### 1.5 Chartjunk / data-ink is convention, not law — [CONVENTION] · verdict 3-0 (merged)
"Eliminate all non-data ink" is Tufte's prescription, **not** a uniformly supported empirical
finding. Controlled studies found *no* comprehension penalty from embellishment (and sometimes
better recall); the broader literature is mixed by task.
*Bateman et al. 2010 (CHI, n=20): no interpretation-accuracy difference between embellished and
minimalist charts, better long-term recall for embellished. Borgo et al. 2012 (IEEE TVCG): no
raised cognitive load. Li & Moacdieh 2014 (HFES): mixed by task.* **Caveat:** Few's
generalizability critique (small n, "plain" charts possibly poorly designed) stands — so
genuinely unsettled; treat as taste. Do **not** over-read the null as "embellishment is good."

*(One claim killed here — REFUTED 1-2: that a viewing-time limit moderates embellishment's
effect on recall. Not established.)*

---

## Part 2 — Categorical (qualitative) colour

### 2.1 Only ~5–7 categorical colours survive rapid search — [STRONG] · verdict 3-0
For marks that must be found *rapidly* (preattentive search), only about 5–7 distinct colours
are reliably identified at low error — clean at 3 and 5, degrading toward 7–9. This bounds
categorical-palette size: **~3–6 data series is safely within range.**
*Healey 1996, IEEE Vis '96 (38 observers), corroborated verbatim by the peer-reviewed "Survey of
Colormaps in Visualization" (PMC4959790).* **Scope note:** counter-claims of 12–13+
distinguishable colours address *static discrimination/naming* (a different task), not rapid
search, and don't refute this.

### 2.2 ColorBrewer's three-type typology is the foundational palette-matching frame — [STRONG] · verdict 3-0
**Sequential** (ordered low→high, lightness-dominated), **diverging** (critical midpoint via
hue+lightness change), **qualitative** (nominal, hue-driven with near-constant lightness) — match
palette *type* to data *type* first.
*Harrower & Brewer 2003, The Cartographic Journal 40(1):27–37 (ColorBrewer.org); traces to Brewer
1994.* The "darker = more" convention is independently supported by Schloss-lab "dark-is-more
bias" work (PMC7683863).

*(One claim killed here — REFUTED 0-3: that ColorBrewer's 12-class cap and the "cartographers
seldom use >7 classes" rule of thumb bounds human categorical-colour discrimination. The
cap is an editorial/design choice, not a perceptual limit.)*

---

## Part 3 — Sequential / diverging & colormap science

### 3.1 Monotonic, perceptually-uniform lightness is the #1 colormap property — [STRONG] · verdict 3-0 (merged)
A good continuous colormap needs a monotonic, perceptually-uniform *lightness* increase, because
perceptual contrast — especially of fine (high-spatial-frequency) detail — is dominated by
lightness difference, not hue or chroma. Non-monotonic lightness creates false gradients.
*Kovesi 2015 (arXiv:1509.03700): "the most important factor… is that the incremental change in
perceptual lightness… is uniform"; vendor maps have "perceptual flat spots that can hide a
feature as large as one tenth of the total data range." Nuñez et al. 2018 (PLOS ONE).* **Caveat:**
Kovesi is an arXiv preprint (not formally peer-reviewed) but foundational and shipped in
matplotlib/Julia/R; the lightness-dominance mechanism is independently confirmed by
spatio-chromatic CSF science (chromatic sensitivity is low-pass, luminance band-pass).

### 3.2 CIELAB is uniform only at low spatial frequency — [STRONG] · verdict 3-0
CIELAB is designed to be perceptually uniform for large uniform patches, so it does **not**
guarantee uniformity for fine detail in real data images — earlier colormap work erred by
trusting CIELAB chroma/hue uniformity at high frequency. Cividis is built in CIECAM02-UCS with
enforced uniform-lightness increments.
*Kovesi 2015; Nuñez et al. 2018 (Cividis via cmaputil). Corroborated by S-CIELAB (Zhang &
Wandell).* **Nuance:** CIELAB remains usable — you just can't trust its chroma/hue uniformity at
fine detail; Kovesi's fix works *within* CIELAB by enforcing uniform lightness.

### 3.3 Rainbow / jet is harmful for ordered data — [STRONG] · verdict 3-0 (merged)
Three failures: (a) no perceptual ordering (viewers can't infer value order without a legend);
(b) uncontrolled non-monotonic luminance hides fine detail; (c) false boundaries where hue
changes fast, flattened regions where it changes slowly.
*Borland & Taylor 2007, IEEE CG&A 27(2):14–17 ("Rainbow Color Map (Still) Considered Harmful").
Corroborated Rogowitz & Treinish 1998, Liu & Heer.* **Qualification:** "cannot infer order" is
slightly too absolute — memorised ROYGBIV + a legend recovers order (Bujack et al. 2023, "Rainbow
Colormaps Are Not All Bad"), and rainbow aids *hue-segmentation* tasks. Safe takeaway: **avoid
rainbow for magnitude/ordered data.**

### 3.4 Gradients must be interpolated in a perceptual space — but even CIELAB banding appears at a diverging midpoint — [STRONG mechanism / CONVENTION] · verdict 3-0 (merged)
Naive RGB interpolation gives grey dead-zones; but naive piecewise-linear **CIELAB**
interpolation still produces a visible Mach-band at a diverging map's white midpoint (where
luminance reverses). Interpolating in Moreland's polar **Msh** space smooths it. Diverging maps
also incur measurable error for comparisons that straddle the central hue boundary.
*Moreland 2009 (ISVC — basis of the coolwarm map): "piecewise linear interpolations in CIELAB…
cause Mach bands in the white part of diverging color maps." Liu & Heer 2018 (CHI): blue-orange
diverging shows errors across the central hue boundary.*

### 3.5 "Perceptually-uniform is always better" is a MYTH — [MYTH / contrary] · verdict 3-0 (merged)
Colormap superiority is task- and span-dependent. For gradient-steepness discrimination **viridis
was the WORST** of three maps; for network tasks a single-hue blue map was **fastest** (viridis
most accurate but slower — a speed/accuracy tradeoff); a 37,961-figure review reframes rainbow as
"for and against," impairing performance only for some task types.
*Reda 2019 (IEEE VIS, preregistered JND): cool-warm 2.86% and rainbow 3.05% JND both beat viridis
3.61%. Cho et al. 2019 (MDPI Appl. Sci., n=35): blue fastest but most error-prone, viridis most
accurate. Gehrke/Bujack et al. 2022 (ISPRS J.). Liu & Heer 2018: uniformity benefit is
span-dependent.* **Caveat:** Cho is MDPI, n=35 — a labelled contrary data point, not a universal.

### 3.6 CIELAB-distance uniformity ≠ uniform perception — [contrary / bounding] · verdict 3-0 (merged)
Uniform colour-space distance does **not** guarantee uniform feature detection; discriminability
should be measured behaviourally, not assumed from CIELAB spacing.
*Ware, Turton, Bujack et al. 2018 (IEEE TVCG): empirically rejected the hypothesis that CIELAB
models colormapped feature-detection thresholds — reduced chromatic-term weights fit better,
because CIELAB over-weights chroma for small features. Liu & Heer 2018: perceptual-space +
colour-naming predicts performance better than either alone, "though overall accuracy is poor" —
and colour-naming was the better predictor.*

---

## Part 4 — Colour vision deficiency (CVD)

### 4.1 CVD affects up to ~8% of men; design CVD-safe by default — [STRONG] · verdict 3-0 (+2-1)
CVD affects up to ~8% of men and ~0.5% of women (>600M people); deuteranomaly (red-green) is by
far the most common. Viridis is the perceptual "gold standard" but optimised for normal vision;
**Cividis** is purpose-built to give near-identical interpretation to normal-vision and CVD
viewers.
*Nuñez, Anderton & Renslow 2018 (PLOS ONE 13(7):e0199239).* **Caveat (the 2-1):** 8% is a
Northern-European upper bound; global pooled prevalence ≈2.6% (Asian men ~4–5%, African men
~2–4%). Tool rule: simulate deuteranopia/protanopia/tritanopia (Color Oracle, colorbrewer2.org
safe filter) to validate any palette.

### 4.2 CVD-safety varies by ColorBrewer scheme type — [STRONG, heuristic] · verdict 2-1
A concrete rule: **all sequential** schemes are usable by red-green-CVD readers (they carry
visible lightness differences); **most diverging** hue pairs were chosen CVD-safe (EXCEPT
red-yellow-green and full-spectral); **almost all qualitative** schemes are hard for CVD readers.
*Harrower & Brewer 2003 (verbatim).* **Caveat (medium confidence):** the ratings were
"approximate," theory-based + n=1 tester, and are **class-count-conditional** — a sequential ramp
can lose its "safe" flag at 8–9 classes. Verify the specific class count in colorbrewer2.org.

---

## Part 5 — Contrast & WCAG (the normative floor)

### 5.1 Luminance contrast — not hue — drives legibility — [STRONG / MYTH-buster] · verdict 3-0 (merged)
Search time, fixation count and fixation duration all rise sharply as luminance contrast falls
**even when hue contrast is high**; strong hue contrast alone does *not* make UI text readable
(the equiluminant case). This is *why* WCAG/APCA define contrast by luminance.
*Displays (Elsevier) 2004: with colour contrast held high, search metrics "increased strongly
with decreasing luminance contrast." Mullen 1985 (J. Physiol. 359:381): chromatic contrast
sensitivity is low-pass, acuity ~11–12 cyc/deg vs luminance ~50–60 cyc/deg. NASA Color Usage
Guidelines: "a minimum luminance contrast of 3.0 should always be present."* **Minor scope
note:** near luminance threshold, hue alone can sustain ~300 wpm reading (Knoblauch/Arditi 1991)
— so "regardless of hue" is mildly overstated, but the low-luminance-contrast anti-pattern holds.

### 5.2 WCAG normatively forbids colour as the only channel — [STRONG / normative] · verdict 3-0 (merged)
SC 1.4.1 (Level A) requires that colour is not the *only* visual means of conveying information —
colour-coding alone is non-conformant; pair with text/shape/icon/pattern. A hue pair counts as an
**additional** non-colour distinction only when its relative-luminance contrast ratio is ≥3:1.
*W3C, WCAG 2.1/2.2 Understanding SC 1.4.1 (verbatim normative text).* The remedy list is
illustrative, not exhaustive. The APCA debate critiques the contrast *formula*, not whether WCAG
states this rule.

### 5.3 The APCA-vs-WCAG-2 contrast dispute is live in production — [CONVENTION] · verdict 3-0 (merged)
The two majors chose differently: **Radix** specifies text steps in **APCA Lc** (Lc 60 / Lc 90);
**Material 3** maps tonal distance to **WCAG-2 ratios** (3:1, 7:1). So "which contrast metric" is
itself an unsettled, system-dependent convention. APCA is the candidate for the still-draft WCAG
3 / Silver.
*Radix docs (live 2026-06-26); Material 3 docs.* **Important limit:** the surviving evidence
documents the *adoption choices* — **no** verified claim adjudicated which metric better predicts
real-world legibility. That empirical core is open.

---

## Part 6 — Background, screens & eye-comfort

### 6.1 Positive polarity (dark-on-light) reads better for small dense text — [STRONG / MYTH-buster] · verdict 3-0 (+2-1)
For normal-vision adults on emissive screens, light mode out-reads dark mode; the advantage is
luminance-driven (brighter background → smaller pupil → sharper retinal image). Print/CRT
legibility rankings do **not** transfer to LCD/sRGB panels.
*Piepenbrock, Mayr & Buchner 2014 (Ergonomics 57(11), PMID 25135324): "better proofreading… with
positive than with negative polarity." Huang et al. 2014 (Applied Ergonomics, 308 participants):
LCDs favour positive-polarity contrastive combinations; CRTs favoured negative. NN/g concurs.*
**Bounding caveat (the 2-1):** the LCD-vs-CRT gap is more precisely a *luminance* confound
(Buchner & Baumgartner) than a technology law — CRTs were dimmer. Real boundary conditions where
dark mode helps (low light, photophobia, cataract) do **not** contradict the normal-vision
proofreading result. Frame as "positive polarity reads best on emissive screens."

> **Recovery gap — flagged honestly.** The three research passes verified only the *small-dense-text
> polarity* result above. They did **NOT** produce verified claims for the rest of what SKILL.md §6
> asserts: the **"green / tint is easy on the eyes" myth**, the **"blue light harms eyes" myth**
> (AAO position), **circadian / melanopsin / ipRGC** night effects (St Hilaire & Lockley 2022), the
> **20-20-20** dry-eye rule, **dark-mode-helps-in-dim-rooms** (Legge 1985; Dobres 2017), and the
> **no-clear-polarity-winner-for-charts** result (While & Sarvghad 2024). Every pass explicitly
> listed these as open questions / zero-surviving-claim gaps. That SKILL.md content is sound but
> was sourced editorially, **not** via the 3-vote research recovered here — do not attribute it to
> this audit trail.

---

## Part 7 — Colour harmony

### 7.1 Classical harmony rules don't predict preference — [CONVENTION / MYTH] · verdict 3-0 (merged)
Complementary / analogous / triadic / split-complementary are aesthetic **convention** with no
validated power to predict human preference. The foundational harmonisation algorithm itself
concedes no formal/empirical definition of a harmonic set exists; controlled studies don't even
agree on which rule holds.
*Cohen-Or et al. 2006 (SIGGRAPH): "currently there is no formulation that defines a harmonic
set… artists rely on experience and intuition" (8 rotatable hue-wheel templates, relative not
absolute). Schloss & Palmer 2011: pair preference and harmony both **increase with hue
SIMILARITY** — strong-contrast pairs neither preferred nor harmonious. Forni et al. 2025
(arXiv:2508.15777, N=346): preference favours the **CONTRAST** region ~160–220°, and "hue
independence cannot be reasonably upheld."* The Schloss-Palmer (similarity) vs Forni (contrast)
tension is itself the best evidence that no single geometric rule generalises. **Caveats:**
Cohen-Or uses non-perceptual HSV; Forni is a non-peer-reviewed preprint in HSL, online sample.

### 7.2 What actually predicts pair preference: component-preference + lightness contrast — [STRONG] · verdict 3-0
Pick individually-liked colours and ensure adequate lightness contrast, rather than chasing a
hue-wheel scheme. "Harmony" is a correlated-but-distinct construct (harmony↔preference r=+.79).
*Schloss & Palmer 2011 (Atten. Percept. Psychophys. 73:551–571): a model of figure-preference +
ground-preference + lightness-difference explains **80.8%** of pair-preference variance.* Single
primary source, but peer-reviewed and foundational; numbers verified verbatim.

---

## Part 8 — Colour preference & emotion

### 8.1 Single-colour preference follows learned object associations (Ecological Valence Theory) — [STRONG] · verdict 3-0 (merged)
Preference tracks the average affective valence of objects associated with a colour (learned, not
innate). The parameter-free WAVE predicts adult preference at **r=+0.893 (~80% variance)**,
**peaking at blue/cyan** (sky, clean water) and **troughing at chartreuse / dark-yellow / brown**
(decay). Draw accents from liked hues; avoid the chartreuse-olive-brown trough.
*Palmer & Schloss 2010 (PNAS 107:8877–8882). EVT beat Hurlbert & Ling's innate cone-contrast
account (~37% vs ~80% variance).* **Replication caveat:** ~80% is an in-sample US-adult fit;
Taylor & Franklin 2012 found ~61% in British observers with large sex differences — treat the
blue-peak/brown-trough *pattern* as STRONG and the exact r as best-case.

### 8.2 Colour→emotion associations are real and systematic — but MANY-to-many — [STRONG for associations; MYTH for 1:1] · verdict 3-0 (merged)
Associations are empirically real, systematic, broadly cross-cultural (cross-nation r≈.88),
organised on stable dimensions (valence/arousal/power ≈ warm-cool / heavy-light / active-passive)
and driven mainly by **lightness & saturation**, not hue identity alone. But they are
many-to-many and partly culture-modulated — which falsifies "one colour = one emotion (blue =
trust)."
*Jonauskaite & Mohr 2025 (Psychon. Bull. Rev., 132 studies / 42,266 participants / 64 countries):
red→arousing/high-power (love AND anger), yellow/orange→positive high-arousal,
green/blue/blue-green→positive low-arousal; "most correspondences were many-to-many." Jonauskaite
et al. 2020 (Psychological Science, 30 nations): universal core r=.88, but nation predicts above
it. Ou et al. 2018 (Color Res. Appl., CIE TC1-86): emotion computable at r≈.78–.81; harmony less
so (r≈.72). Matches Valdez & Mehrabian 1994.* **Key limit (authors' own):** these are *abstract
associations* — translation to experienced emotion / behaviour in a real UI is untested.

### 8.3 "Romantic red" is the cautionary MYTH — [MYTH / weak-to-null] · verdict 3-0 (merged)
That incidental red raises perceived attractiveness is weak, publication-biased, and not robustly
established — the textbook overstated colour-psychology effect.
*Lehmann, Elliot & Calin-Jageman 2018 (Evolutionary Psychology, meta-analysis, 41 studies / 6,682
participants): men-rating-women d=0.26 (0.19 without outlier); women-rating-men d=0.13; **pre-
registered studies d=−0.10** vs unregistered d=0.21; significant publication bias (ES-SE r=.52).
Lehmann & Calin-Jageman 2017: two pre-registered replications returned essentially null in both
directions.* Two of three authors (including the replicators) concluded the true effect is "very
small, potentially nonexistent." This does **not** undermine §8.2's broad association evidence —
it discredits a specific causal over-claim.

---

## Part 9 — Design-system colour (modern practice)

### 9.1 Semantic colour tokens via a numbered scale — [CONVENTION / best-practice] · verdict 3-0
Modern systems assign colour to fixed roles via a numbered scale, not ad-hoc hex. **Radix**
fixes every colour to a 12-step scale, one UI role per step range: 1–2 app/subtle backgrounds,
3–5 component backgrounds, 6–8 borders, 9–10 solid backgrounds, 11–12 text.
*Radix Colors docs (live 2026-06-26), stable since ~2022.* Labelled convention (what the system
*does*), not proven science.

### 9.2 Material 3's HCT ties tonal distance to a contrast ratio — [CONVENTION w/ perceptual basis] · verdict 3-0 (merged)
M3 is built on HCT (hue, chroma, tone), where **tone = CIELAB L\*** can be held fixed while hue/
chroma vary. This maps tonal *distance* to a contrast ratio independent of hue: tones 50/98 ≈
3:1, tones 30/98 ≈ 7:1.
*Material 3 docs. Mechanism is sound because L\* is a monotonic bijection of relative luminance.*
**Caveats:** tone is perceptual lightness (not raw luminance); equal tonal distance doesn't
uniquely fix a ratio (M3 publishes specific pairs); the stated 3:1/7:1 are conservative floors.

---

## Part 10 — Adversarial-review corrections (verdicts on the built skill)

Review A (adversarial, 7 dimensions) confirmed **13** fixes; Reviews B/C confirmed **3** and
**4** more. The scientifically-substantive ones, folded back into the science above:

- **[major] Opponent-process citation is psychophysical, not physiological.** Hurvich & Jameson
  (1957) is a *psychophysical* hue-cancellation model of behavioural reports — not physiology.
  Physiological confirmation is **De Valois et al. (1958)** (opponent cells in macaque LGN). The
  page/skill originally mis-attributed it and garbled the venue (JOSA 47:546). *Fixed.*
- **[minor] Chartreuse lightness number overstated.** HSL chartreuse (#80ff00) computes to WCAG
  relative luminance **0.76, not 0.80**, and is not the bright extreme — the blue ≈0.07 figure is
  exact. *Fixed.*
- **[minor] Chromostereopsis vs equiluminance conflated.** Chromostereopsis is strictly the
  *depth/float* effect (long vs short wavelengths refract differently); the edge "shimmer/vibrate"
  is a separate equiluminant-boundary effect. Don't attribute both to chromostereopsis.
- **[minor] Forni 2025 was cited in SKILL.md but not on the page / not in the skill's own source
  list** — an arXiv preprint carrying a load-bearing "contrast preferred" counter-claim; flagged
  for traceability.
- **CVD accent collapses (real, hue-only → not icon-mitigated):** under deuteranopia the
  **Gallery** theme's emph (plum) and link (teal) collapse to ΔE≈6.6; under tritanopia
  **Corbusier**'s emph (ultramarine) and link (teal-green) collapse to ΔE≈10.7. Alert-channel
  hue-collapses are acceptable *because* the skill mandates icon+word (WCAG 1.4.1), but
  emph-vs-link relies on hue and is a genuine finding.
- **Known-intentional (not defects):** the **"Paper"** theme is a deliberate verbatim newsprint
  grab, knowingly sub-AA (emph ~3.74, sev ~4.32, warn ~3.22) with info out-prominent over warn —
  kept as an honest real-world outlier. The alert-escalation contrast order also inverts under CVD
  on several themes; mitigated by icon+word.
- Data-mark contrast nits confirmed on the built galleries (three LIGHT6 Tableau lines <3:1 on
  #f4f4f2; Corbusier-Light muted 3.33:1 used for 8px axis text; a calendar-heatmap v=0 cell at
  ~1.15:1) — implementation fixes, not science.

---

## Part 11 — Myths (do NOT codify)

- **[MYTH] "Perceptually-uniform colormaps are always better."** False — task/span-dependent;
  viridis was *worst* for gradient-steepness discrimination (§3.5).
- **[MYTH] "One colour = one emotion" (blue = trust).** Associations are real but many-to-many
  and lightness/saturation-driven (§8.2).
- **[MYTH] "Romantic red" — red boosts attractiveness.** Weak, publication-biased, pre-registered
  nulls (§8.3).
- **[MYTH] "Colour-harmony rules predict what looks good."** Convention; preference = component-
  preference + lightness contrast (§7).
- **[MYTH] "Strong hue contrast alone makes text readable."** No — luminance contrast drives
  legibility; equiluminant text is an anti-pattern (§5.1).
- **[MYTH] "Dark mode reads better."** Not for small dense text on emissive screens — positive
  polarity wins (§6.1).
- **[REFUTED 0-3] "Blue-text-on-red-background forces greater accommodative effort"** — the one
  physiological claim for a saturated blue/red on-screen anti-pattern was killed. The anti-pattern
  survives only via the general luminance-contrast principle, not this mechanism.
- **[REFUTED] "≤7 classes is a human categorical-colour limit derived from ColorBrewer's cap"** —
  the 12-class cap is editorial, not perceptual (the real ~5–7 bound is Healey's, §2.1).
- **[MYTH — see also §6 recovery gap] "Green / paper tint is easy on the eyes," "blue light harms
  eyes."** SKILL.md treats both as myths (correctly), but this was **not** established by the
  recovered 3-vote research — sourced editorially.

---

## Part 12 — Open questions & unrecovered sub-topics

Stated honestly: these were requested in the briefs but produced **zero surviving verified
claims** across all three passes, or were never researched via the 3-vote harness. They are
gaps in *this audit trail*, regardless of whether SKILL.md speaks to them.

1. **Preattentive channels beyond colour count** (Treisman/Wolfe/Healey & Enns/Itti & Koch) —
   which channels (hue, luminance, size, motion, orientation) are genuinely preattentive and how
   many values each supports. Only the ~5–7 categorical-colour bound survived.
2. **Simultaneous contrast, Mach bands (as a deliberate tool), chromostereopsis, figure-ground /
   Gestalt** — no standalone verified findings (they appear only as mechanism inside other claims).
3. **60-30-10 dominance ratio** — no source, evidence, or authoritative citation survived
   verification in *either* the harmony or the screen pass. Treat as unsupported folklore.
4. **Which contrast metric (APCA Lc vs WCAG-2) better predicts real legibility** — only the
   adoption split was documented; the empirical core is open.
5. **Blue light / ipRGC / melanopsin / circadian; the "green is easy on the eyes" claim;
   dark-mode-for-charts; 20-20-20; off-white-vs-pure-white background comfort** — the entire
   §7-brief screen-comfort question. All three passes list this as an explicit gap.
6. **On-screen saturated pure-blue / pure-red text, chromatic aberration, S-cone acuity, gamma,
   gamut, sub-pixel** — after the blue-red accommodation claim was refuted, nothing survives here
   beyond the general "luminance contrast drives legibility."
7. **Cross-cultural portability of EVT / WAVE and colour-emotion**, and whether abstract
   associations translate to *experienced* emotion in a real dashboard — flagged by the authors
   themselves.

---

## Part 13 — Cross-check against the shipping skill

How the recovered research maps onto the current
[SKILL.md](../SKILL.md) and
[references/color-theory-findings/findings.js](color-theory-findings/findings.js).

**Reflected in SKILL.md (recovered research → skill, faithful):**
- Encoding hierarchy, area-underestimation, position-over-area (§1 → SKILL §1). ✓
- Chartjunk = convention, Bateman/Borgo (§1.5 → SKILL §1). ✓
- ~5–7 categorical, Healey; ColorBrewer typology (§2 → SKILL §2). ✓
- Monotonic-lightness colormaps, rainbow harmful, Viridis/Cividis, CIELAB-frequency caveat
  (§3 → SKILL §3). ✓
- CVD ~8%, deuteranomaly, simulate; sequential-safe / qualitative-unsafe (§4 → SKILL §4). ✓
- WCAG luminance formula, 4.5/3:1 text, 3:1 non-text (1.4.11), never-colour-alone (1.4.1), APCA
  removed-from-WCAG-3-draft (§5 → SKILL §5). ✓
- Positive-polarity for small dense text; luminance-before-hue (§5.1, §6.1 → SKILL §6). ✓
- Harmony rules unvalidated (Cohen-Or/Schloss-Palmer/Forni); pair-pref = component + lightness
  (§7 → SKILL "Colour harmony"). ✓
- EVT/WAVE r≈.89, blue-peak/brown-trough; colour-emotion many-to-many (Jonauskaite/Ou); romantic-
  red null (§8 → SKILL "Colour harmony, preference & emotion"). ✓
- Tableau/Okabe-Ito/design-system tokens; the reserved-accent / dominance-budget palette-role
  system (§9 → SKILL "Functional UI colour roles"). ✓ (structure is [CONVENTION], correctly
  labelled.)

**In SKILL.md but NOT backed by the recovered 3-vote research (sourced editorially — verify
before treating as audited):**
- The **blue-light / AAO / circadian / 20-20-20** material and the **"green tint is easy on the
  eyes" myth** (SKILL §6). *Zero surviving claims in any pass — see §6 recovery gap and §12.5.*
- **Dark-mode-no-clear-winner-for-charts** (While & Sarvghad 2024) and **dark-mode-helps** (Legge,
  Dobres) — not in the recovered passes.
- The **opponent-process colour-wheel** science (Hering; Hurvich & Jameson 1957 *psychophysical*;
  De Valois 1958; **Ottosson 2020 / OKLCh** perceptual uniformity; HSL non-uniformity). Added
  during the build and checked only by the *adversarial review* (which corrected the
  Hurvich-Jameson mis-citation and the chartreuse number, §10) — **not** by a research pass.
- **Preattentive pop-out as the basis for the reserved-accent rule** (Healey & Enns; Treisman) —
  asserted in SKILL §"Functional UI colour roles"; the pop-out mechanism itself was an
  unrecovered gap (§12.1).

**In the recovered research but thinner / absent in SKILL.md (candidate additions):**
- The **"perceptually-uniform is NOT always better"** contrary evidence (Reda 2019 viridis-worst;
  Cho 2019 speed/accuracy) — SKILL mentions rainbow nuance but not the viridis-worst finding.
- **CIELAB-distance ≠ uniform perception** (Ware/Turton/Bujack 2018; colour-naming predicts better
  than perceptual space) — a real bound on the "just use a uniform colormap" default; not in SKILL.
- **Moreland Msh** diverging-midpoint Mach-band fix — SKILL covers diverging but not this
  interpolation subtlety.
- The explicit **APCA-vs-WCAG-2 adoption split** (Radix=APCA Lc 60/90 vs M3=WCAG ratios) — SKILL
  notes APCA's draft status but not the concrete production split.

---

## Sources (grouped, as fetched during the runs)

**Encoding / frameworks (primary):**
- Cleveland & McGill 1984, JASA 79(387):531–554 · Heer & Bostock 2010, CHI (idl.uw.edu / ACM
  1753326) · Munzner 2014, *Visualization Analysis & Design* (cs.ubc.ca/~tmm/vadbook) ·
  Bateman et al. 2010, CHI · Li & Moacdieh 2014, HFES · Borgo et al. 2012, IEEE TVCG ·
  "The Risks of Ranking," arXiv 2212.10533.

**Categorical / colormap science (primary + foundational preprint):**
- Healey 1996, IEEE Vis '96 · Harrower & Brewer 2003, Cartographic Journal 40(1) (ColorBrewer) ·
  Borland & Taylor 2007, IEEE CG&A 27(2) · Kovesi 2015, arXiv:1509.03700 · Nuñez, Anderton &
  Renslow 2018, PLOS ONE 13(7):e0199239 (Cividis) · Moreland 2009, ISVC (coolwarm/Msh) ·
  Reda 2019, IEEE VIS · Cho et al. 2019, MDPI Appl. Sci. 9(20):4228 · Gehrke/Bujack et al. 2022,
  ISPRS J. · Ware, Turton, Bujack et al. 2018, IEEE TVCG · Liu & Heer 2018, CHI (idl.uw.edu
  quantitative-color) · Bujack et al. 2023, "Rainbow Colormaps Are Not All Bad."

**Contrast / legibility / screens (primary + normative + design-system):**
- W3C WCAG 2.1/2.2 Understanding SC 1.4.1 (Use of Color), SC 1.4.3, SC 1.4.11 · Mullen 1985,
  J. Physiol. 359:381 · Displays (Elsevier) 2004 (luminance vs colour contrast search) · NASA
  Color Usage Guidelines · Piepenbrock, Mayr & Buchner 2014, Ergonomics 57(11) (PMID 25135324) ·
  Huang et al. 2014, Applied Ergonomics · Buchner & Baumgartner (polarity = luminance) ·
  Knoblauch/Arditi 1991, JOSA A 8(2) · Radix Colors docs · Material Design 3 docs (m3.material.io).

**Harmony / preference / emotion (primary + one preprint):**
- Cohen-Or et al. 2006, SIGGRAPH (colour harmonisation) · Schloss & Palmer 2011, Atten. Percept.
  Psychophys. 73:551–571 · Palmer & Schloss 2010, PNAS 107:8877–8882 (EVT/WAVE) · Forni, Darmon &
  Benzaquen 2025, arXiv:2508.15777 (preprint) · Jonauskaite et al. 2020, Psychological Science
  31:1245–1260 (30-nation) · Jonauskaite & Mohr 2025, Psychon. Bull. Rev. (132-study review) ·
  Ou et al. 2018, Color Res. Appl. (CIE TC1-86) · Valdez & Mehrabian 1994 · Lehmann, Elliot &
  Calin-Jageman 2018, Evolutionary Psychology (romantic-red meta-analysis) · Lehmann &
  Calin-Jageman 2017, Social Psychology 48(3) (pre-registered replications, OSF j3fyq) ·
  Taylor & Franklin 2012 (EVT cross-cultural).

**Not from the recovered runs — present in SKILL.md, cited there editorially (see §13):**
- Hering 1878; Hurvich & Jameson 1957 (psychophysical); De Valois et al. 1958; Ottosson 2020
  (OKLab/OKLCh) · While & Sarvghad 2024, arXiv:2409.10841 · Legge et al. 1985; Dobres et al. 2017 ·
  St Hilaire … Lockley 2022, PNAS 119(51) · American Academy of Ophthalmology (blue-light
  position) · Healey & Enns 2012; Treisman 1985 (preattentive).

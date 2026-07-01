# Charting (Tufte) — Deep-Research Evidence: RECOVERED RAW SYNTHESIS

> **What this is.** The full raw deep-research behind the `charting` skill, **reconstructed
> from Claude Code session transcripts** (session `7c93f7f4`, workflows `wf_bc6191f6-1e1`
> and its sibling `wf_10a0e5d0-ac4`). The shipped skill kept only a ~32-line distilled
> summary ([evidence-tufte-principles.md](evidence-tufte-principles.md)); this file restores
> the complete claim-by-claim evidence, verdicts, caveats, and source list so the skill ships
> the whole record, not the abstract.
> **Reconstructed 2026-07-01 from a run dated ~2026-06-26.** All operational noise
> (rate-limits, retries, token counts, orchestration chatter) has been stripped; only
> substantive findings and evidence remain. Nothing here is invented — where the raw run was
> incomplete or self-contradictory, that is stated plainly.

**The research question (verbatim).** *"Edward Tufte's principles for designing information
displays, and the current empirical evidence for each — to inform an evidence-based
data-visualization design skill that labels every rule as proven [STRONG], convention, or
myth, and applies to on-screen/web UIs (dashboards, tables, time-series), not just print."*
Nine numbered sub-questions were fact-checked: (1) data-ink / chartjunk, (2) sparklines,
(3) small multiples, (4) data density, (5) layering & smallest-effective-difference,
(6) micro/macro, (7) graphical integrity (Lie Factor / truncated axes / area encoding),
(8) text-graphic integration & direct labeling, (9) tables vs. graphics for small data.
*For each: separate what controlled studies support from Tufte's taste/convention; give
primary citations; flag popular claims the evidence contradicts.*

**Method (the canonical run, `wf_bc6191f6-1e1`).** A fan-out/adversarial workflow:
**6 angles → 24 sources fetched → 104 claims extracted → 25 adversarially verified
(3-vote, need 2/3 to kill) → 24 confirmed / 1 killed → 9 findings after synthesis-merge.**
**107 agent calls.** A sibling run the same night (`wf_10a0e5d0-ac4`, 105 agents, 5 angles,
23 sources, 103 claims, 25 verified, 23 confirmed / **2 killed**) was flagged internally as a
structured-output test and synthesized only 1 finding — but its **two extra kills are recovered
in Part 9**, because refuted claims are the most valuable output. Across both runs the headline
is *"~25 verified, ~2–3 refuted."*

**Snapshot date:** ~2026-06-26. One item (the zero-baseline rule) was flagged **time-sensitive**
even then — a CHI 2026 follow-up was already reported to be shifting it further toward
"task-dependent." Re-check before quoting the zero-baseline rule as settled.

## How to read the labels

- **[STRONG]** — confirmed by controlled studies (usually several, converging) or a normative
  standard. Binding.
- **[CONVENTION]** — taught and sensible, but the controlled evidence is weak, mixed, or
  *contradicts* the strict form. Deviate with reason; don't state it as a law.
- **[unvalidated]** — no controlled evidence surfaced **either way**. This is **not** a myth —
  it is Tufte's taste/aesthetic, undecided by evidence. Label it "convention," never "[STRONG]."
- **[MYTH]** — a popular claim the evidence actively contradicts. Do not codify.
- Adversarial verdict on each verified item: **VERIFIED (n-0 / 2-1)** or **REFUTED (0-3 / 1-2)**,
  with the vote and reason. Source quality: **primary** (peer-reviewed study / Tufte's own words)
  · **secondary** (serious report) · **blog** (practitioner, credible but not peer-reviewed) ·
  **unreliable** (paywall stub / no extractable claim).

---

## Part 1 — Graphical integrity (the best-supported tier) — [STRONG]

Tufte's *perceptual* integrity claims are the empirical bedrock of the whole skill: controlled
studies repeatedly confirm them. This is the one area where "Tufte was right" is a defensible
research statement, not taste.

### 1.1 Truncated / non-zero axes reliably inflate *perceived* magnitude — [STRONG] · VERIFIED 3-0
**Claim.** A truncated or non-zero y-axis makes viewers perceive the differences between values
as larger/more severe than they are; the effect is robust and persistent. Backs the convention
that magnitude-encoding bar charts default to a **zero baseline**.
**Evidence (three independent primary studies, four merged claims).**
- **Correll, Bertini & Franconeri, "Truncating the Y-Axis: Threat or Menace?" (CHI 2020, n=40):**
  more truncation → more perceived severity, **F(2,76)=89, p<0.0001**, persistent across chart designs.
- **Pandey et al., "How Deceptive are Deceptive Visualizations?" (CHI 2015, N=250):** the
  truncated bar drew a "how much bigger" rating of **2.77 [2.26,3.28] vs 1.45 [1.27,1.62]** for
  the control, **p=0.0003**. Across all three distortion techniques (truncated axis,
  area-as-quantity, aspect ratio) deceptive charts inflated comparative responses **58.5%–129.5%,
  all p<0.001** — "large, not marginal."
- **Yang, Vargas Restrepo, Stanley & Marsh, "Truncating Bar Graphs Persistently Misleads Viewers"
  (Journal of Applied Research in Memory & Cognition, 2021):** five studies, a robust "truncation
  effect," **83.5% of participants show it**; an explicit warning just before judging "reduced but
  did not eliminate" it.
**Verdict.** VERIFIED 3-0. The single most solid Tufte-aligned finding in the corpus.

### 1.2 Encoding magnitude by radius instead of area exaggerates perception — [STRONG] · VERIFIED 3-0
**Claim.** Mapping a quantity to a circle's **radius** (so value scales ~quadratically with size)
significantly exaggerates perceived magnitude. Confirms Tufte's area / "Lie Factor" principle:
magnitude should map to **area**, not linear extent.
**Evidence.** **Pandey et al. (CHI 2015, N=330):** the radius-encoded bubble chart was rated
**2.71 [2.27,3.15] vs 1.71 [1.45,1.98]** for the area-faithful control, **p=0.0007, r=0.34**. The
paper: "When the quantity is mapped to the area … the visualization is less susceptible to deception."
**Caveat.** Primary empirical support is essentially this one controlled study (the paper never
names Tufte). Confidence is high because it converges with classic perception literature —
**Flannery 1971**, and **Cleveland & McGill** ranking area as a low-accuracy channel.
**Verdict.** VERIFIED 3-0.

### 1.3 MYTH-BUSTER: break-marks / gradient fades do NOT fix a truncated axis — [MYTH] · VERIFIED 3-0
**Claim.** Adding an "honesty" cue to a truncated axis — a broken-axis mark or a gradient fade at
the bottom — does **not** meaningfully reduce the exaggeration. The popular belief that a break
mark makes a truncated axis honest is **not supported**.
**Evidence.** **Correll, Bertini & Franconeri (CHI 2020)** compared a standard truncated bar, a
broken-axis bar, and a gradient-bottom bar: **"no significant difference … among visualization
designs, F(2,60)=3.1, p=0.05,"** with null post-hoc Bonferroni pairwise tests. Authors: "the
subjective impact of axis truncation is persistent … even for designs with explicit visual cues."
**Caveat.** p=0.05 is a *borderline* null, not a strong one, and this CHI 2020 paper is the single
canonical test of the question. Treat as "the honesty-cue belief is unsupported," not "proven false."
**Verdict.** VERIFIED 3-0. → This is why the shipped anti-pattern says break-marks don't rescue a
truncated axis.

### 1.4 The blanket "bars must always start at zero" rule is NOT universal — [CONVENTION] · VERIFIED 3-0
**Claim.** Truncation inflates *perceived* effect size (see 1.1) but does **not** degrade *accuracy*
on additive-difference ("gap") tasks; for relative-growth/percentage tasks, truncation that
preserves data relations (monotonic) is fine, while truncation that breaks them (non-monotonic)
impairs performance. Whether truncation is honest or deceptive **depends on task and communicative
intent**, not a fixed convention.
**Evidence (four merged claims, two primary sources).**
- **Correll, Bertini & Franconeri (CHI 2020):** "we resist the interpretation … that all charts
  with quantitative axes should include 0."
- **Long & Kay, "To Cut or Not To Cut? A Systematic Exploration of Y-Axis Truncation"
  (CHI 2024, pre-registered):** "for comparing and estimating the difference between the lengths of
  two bars, truncating the y-axis does not affect task performance"; for relative growth,
  "truncating monotonically has similar performance to no truncation, while truncating
  non-monotonically is very likely to impair performance."
- *Citation note (RESOLVED 2026-07):* the paper (DOI 10.1145/3613904.3642102) is by **Sheng Long &
  Matthew Kay** (Northwestern / mucollective), verified against the ACM record — so **"Long & Kay 2024"
  is correct**. One source-scoping agent mis-titled the same DOI as "Hofman et al. 2024"; that was a
  scoping error, not a real alternative attribution.
**Key non-contradiction (do not miss this).** 1.1 and 1.4 do NOT conflict. 1.1 measures a
*perception* variable (inflated), 1.4 measures a *task-accuracy* variable (unharmed on gap tasks).
Conflating the two DVs produces the false impression that the studies disagree — they don't.
**Verdict.** VERIFIED 3-0. **But the clean "bars need zero / lines & dot plots don't" dichotomy was
REFUTED (1-2) — see Part 9.**

---

## Part 2 — Data-ink / chartjunk minimalism (partly contradicted) — [CONVENTION], not law

Tufte's most famous prescription — "maximize the data-ink ratio, erase chartjunk" — is the tier
that the evidence **weakens**. It is sound taste, not a proven comprehension rule. The research
strengthens the *reason* to label it [CONVENTION].

### 2.1 Removing "chartjunk" is NOT proven to help, and embellishment is not uniformly harmful — [CONVENTION] · VERIFIED 3-0
**Claim.** Controlled experiments find embellished charts are interpreted **as accurately** as plain
ones, are **recalled significantly better** after a 2–3 week delay, and aid memory — at a measurable
cost to **visual-search speed**. Effects are conditional (time pressure, task), not a uniform help or
harm. This contradicts a strict reading of "maximize data-ink."
**Evidence (six merged claims, four primary sources).**
- **Bateman et al., "Useful Junk?" (CHI 2010, N=20; 14 Nigel-Holmes-embellished vs. plain charts):**
  interpretation accuracy "no worse" for embellished; long-term (2–3 wk) recall significantly better
  — subject **t9=2.56 p=.015**, categories **t9=5.03 p≈.000**, trend **t9=1.95 p=.042**, value
  message **t9=2.41 p=.020**.
- **Borgo et al., "An Empirical Study on Using Visual Embellishments in Visualization"
  (IEEE TVCG 18(12):2759–2768, 2012; dual-task):** embellishments "can help participants better
  remember the information" but "can have a negative impact on the speed of visual search" — an
  explicit task-dependent tradeoff.
- **Li & Moacdieh, "Is 'chart junk' useful?" (HFES 2014; extension of Bateman):** chart type (plain
  vs. embellished) significantly affected short-term recall; time limit affected comprehension —
  effect **conditional**.
- **Parsons & Shukla (IEEE VIS 2020) / Akbaba et al., "Practitioners' Perspectives on Chartjunk"
  (arXiv 2009.02634, 2020)** summarize the field: "extreme minimalism is not always best, and visual
  embellishments can be useful depending on the context."
**Caveats.** Small N (Bateman N=20, 10/group, one-tailed tests; Li & Moacdieh similar). The
"embellishment helps" result is specific to **Nigel-Holmes-style decoration against sometimes-weak
plain comparators — do NOT generalize to "all decoration is good."** **Stephen Few's** blog critique
("the chartjunk debate," practitioner-quality) disputes *over-generalization* of Bateman, not the
narrow accuracy/recall finding; and Bateman's "value message" recall blends *persuasion* with
comprehension. **Corroborating (not standalone-verified):** Borkin et al. 2013 ("What Makes a
Visualization Memorable?") and Haroz et al. 2015 were cited by verifier agents as directionally
consistent, not as separate findings.
**Verdict.** VERIFIED 3-0. → Keep the skill's existing label: data-ink/chartjunk minimalism is
**[CONVENTION] / taste**, not a proven law.

### 2.2 Viewers *prefer* non-minimalist bar graphs — [CONVENTION, preference only] · VERIFIED 3-0
**Claim.** Given the same data, viewers clearly **preferred** standard non-minimalist bars over
Tufte's high-data-ink minimalist versions. **IMPORTANT: this is aesthetic preference/attitude, NOT
comprehension or recall.**
**Evidence.** **Inbar, Tractinsky & Meyer, "Minimalism in information visualization: Attitudes
towards maximizing the data-ink ratio" (ECCE 2007, ACM DOI 10.1145/1362550.1362587, 87 students):**
"a clear preference of non-minimalist bar-graphs, suggesting low acceptance of minimalist design
principles such as high data-ink ratio." **Nuance:** a *moderately* minimal graph drew ~41%
preference; only the **extreme** Tufte version was rejected — so the finding is against maximalist
minimalism, not against restraint per se.
**Caveat.** Single primary source; **preference axis only** — does not show minimalism harms
understanding. Confidence: medium.
**Verdict.** VERIFIED 3-0 (two merged claims).

---

## Part 3 — Chart-form choice (small multiples; tables vs. graphics)

### 3.1 Small multiples beat a single dense chart only CONDITIONALLY — [STRONG] · VERIFIED 3-0
**Claim.** Grids of small repeated charts outperform a single overlaid/dense chart **only for
comparisons across a LARGE visual span and "dispersed" discrimination tasks.** A single
shared-space line graph **wins** for SMALL-span, "local" tasks (e.g., finding the maximum). No
design is universally superior — the choice depends on the comparison task. Directly refutes
"small multiples always win."
**Evidence (three merged claims).**
- **Javed, McDonnel & Elmqvist, "Graphical Perception of Multiple Time Series"
  (IEEE TVCG 16(6):927–934, InfoVis 2010; controlled, 4 techniques):** split-charts (small
  multiples, horizon graphs) "generally more efficient for comparisons across time series with a
  large visual span"; shared-space line graphs "more efficient for comparisons over smaller visual
  spans." By task: split-space faster for **Discrimination (dispersed)**; shared-space faster for
  **Maximum (local)**.
- **Gleicher, "Considerations for Visualizing Comparison" (IEEE VIS/TVCG 2018; taxonomy of
  juxtaposition = small multiples / superposition = overlay / explicit encoding):** "neither
  superposition nor juxtaposition designs naturally scale to many items … Juxtaposition with many
  items separates them, hindering some kinds of comparison."
**Verdict.** VERIFIED 3-0. → Backs the skill's "small multiples for large-span comparison; a shared
line for local read" guidance, and the chart-chooser's task-first framing.

### 3.2 Tables vs. graphics for small data — [unvalidated for Tufte's specific claim]
**Claim tested.** Tufte's "tables often beat graphics for small datasets."
**Finding.** **No controlled study validated Tufte's specific claim.** What exists is
**cognitive-fit theory**, which explains *when* tables vs. graphs win by matching representation to
task — not a validation of Tufte's rule:
- **Vessey, "Cognitive Fit: A Theory-Based Analysis of the Graphs Versus Tables Literature"
  (Decision Sciences 22(2), 1991)** — the theory (source was a paywall stub, 0 extractable claims).
- **Vessey & Galletta, "Cognitive Fit: An Empirical Study of Information Acquisition"
  (Information Systems Research 2(1), 1991)** — tables suit symbolic/lookup tasks, graphs suit
  spatial/trend tasks.
**Label.** [unvalidated] — Tufte's taste, undecided by evidence, NOT a myth.

---

## Part 4 — Sparklines & data density

### 4.1 Sparkline DEFINITION is solid; EFFECTIVENESS is unvalidated — [STRONG def / unvalidated effect] · VERIFIED 3-0
**Claim (definition).** A sparkline is "a small intense, simple, word-sized graphic with typographic
resolution," meant to sit **inline** in text, tables, headlines, maps or spreadsheets rather than
stand alone as a boxed figure. Definitional (Tufte coined it in *Beautiful Evidence*, 2006).
**Evidence.** Tufte's own page, verbatim: *"A sparkline is a small intense, simple, word-sized graphic
with typographic resolution"* and *"sparkline graphics can be everywhere a word or number can be:
embedded in a sentence, table, headline, map, spreadsheet, graphic."*
**The gap.** **No controlled study on sparkline effectiveness vs. alternatives (tables, full charts)
surfaced.** The closest real literature is **Goffin et al.** on *word-scale visualizations* —
"Exploring the Placement and Design of Word-Scale Visualizations" (IEEE VIS/TVCG 2014) and "Exploring
the Effect of Word-Scale Visualizations on Reading Behavior" (CHI 2015 EA) — but these study
*placement and reading behavior*, not a head-to-head "do sparklines beat a table" test. So the
**design rules remain Tufte's taste, empirically unvalidated.**
**Verdict.** VERIFIED 3-0 for the definition; effectiveness is [unvalidated].

### 4.2 Data density / "data density index" — [unvalidated]; clutter has a measured cost
**Claim tested.** Denser is better; is there a legibility ceiling?
**Finding.** **No evidence that Tufte's "data density index" predicts comprehension** either way —
denser-is-better is aesthetic/convention. The one adjacent empirical result is on **clutter, not
density-as-virtue**: **Moacdieh & Sarter, "The Effects of Data Density, Display Organization, and
Stress on Search Performance: An Eye-Tracking Study of Clutter" (IEEE Transactions on Human-Machine
Systems, 2017)** — high density plus poor organization degrades visual search, especially under
stress. That cuts *against* naive "denser is better," and says nothing validating a density index.
**Label.** [unvalidated] for the density-index claim.

---

## Part 5 — Annotation / labelling

### 5.1 Direct / redundant labeling measurably improves comprehension — [CONVENTION→supported] · VERIFIED 3-0
**Claim.** Adding **redundant numeric data labels** directly on line and bar charts (in addition to
axes) made them read **significantly more accurately and faster**, and they were perceived as more
efficient. Direct evidence that non-minimal, redundant labeling can *help* — counter to a strict
cognitive-load/minimalism prior.
**Evidence.** **Kopp, Riekert & Utz, "When cognitive fit outweighs cognitive load: Redundant data
labels in charts increase accuracy and speed of information extraction" (Computers in Human Behavior
86:367–376, 2018):** redundant-labeled charts were answered "significantly more accurate and faster"
and perceived "significantly more efficient," explained by cognitive-fit theory.
**Caveats.** Single study; benefit is **task-type dependent** ("can improve"); and it tests redundant
**numeric** labels — *adjacent to but not identical to* Tufte's specific "direct label at the element
vs. separate keyed legend" claim (see Open Questions). Confidence: medium.
**Verdict.** VERIFIED 3-0. → This is the one positively-validated labeling finding, and the basis for
the shipped "annotated time series" chart (#32) and the "direct labeling over legends" core move.

---

## Part 6 — Colour in charts → defers to `graphical-perception-and-color`

This run treated **colour/contrast as out of scope** and pointed at the sibling
`graphical-perception-and-color` skill for it. The only colour-relevant material surfaced here is
**Cleveland & McGill's perceptual-accuracy ranking**, and it appeared *as corroborating context*,
not as a standalone verified finding:

- In Finding 1.2 (area/radius), verifiers cited **Cleveland & McGill** ranking **area/angle as
  low-accuracy channels** to reinforce that area-encoding is deception-prone.
- **Provenance note for the coverage map:** the shipped
  [evidence-tufte-principles.md](evidence-tufte-principles.md) added a **standalone Cleveland & McGill
  finding** ("pie slices and stacked inner bands are decoded inaccurately; angle/area/unaligned length
  rank below aligned position and length"). That standalone finding is **not one of the 9 synthesized
  findings of this run** — it was elevated from corroborating context (and/or the parallel
  graphical-perception run) during reconciliation. It is sound and canonical (Cleveland & McGill,
  "Graphical Perception," JASA 1984), but flag it as **reconciled-in, not adversarially verified in
  the Tufte run.**

All actual palette/lightness/hue/CVD decisions are the colour skill's call; charting only chooses the
*form* and defers the ramp.

---

## Part 7 — Dashboards, micro/macro, layering — [unvalidated]

The question asked specifically about on-screen dashboards, micro/macro reading, and layering &
smallest-effective-difference. **No controlled evidence surfaced for any of these as Tufte framed
them:**
- **(6) Micro/macro readings** (dense displays rewarding both overview and close inspection) — no study.
- **(5) Layering & separation / "smallest effective difference"** — no study.
- Dashboard-specific comprehension — not tested here; the transferable evidence is indirect (small
  multiples 3.1, direct labeling 5.1, clutter cost 4.2, integrity 1.x).
**Label all [unvalidated]** — Tufte taste, not disproven, not proven. The shipped dashboard forms
(#21–25) rest on the *verified* moves (small multiples, direct labels, integrity), not on a validated
"dashboard principle."

---

## Part 8 — Evidence gaps (label [unvalidated], NOT myth)

Absence of evidence here is **not** evidence the rules are wrong — it means they are unvalidated, so
the skill labels them "convention/aesthetic," neither [STRONG] nor [MYTH]:

1. **Sparkline effectiveness** vs. tables or full charts — only the definition is solid (Part 4.1).
2. **Data-density index / legibility ceiling** — no comprehension evidence either way (Part 4.2).
3. **Layering & smallest-effective-difference** — no controlled study (Part 7).
4. **Micro/macro reading** — no controlled study (Part 7).
5. **Tables-beat-graphics for small data** — cognitive-fit theory explains *when*, but does not
   validate Tufte's specific claim (Part 3.2).

---

## Part 9 — Refuted / killed claims (the adversarial casualties — the most valuable output)

Three distinct claims were killed across the two runs. These are the highest-value results because
they mark exactly where the popular framing breaks.

### R1 — "Bars need zero, but lines & dot plots don't" (the clean dichotomy) — REFUTED 1-2 *(canonical run)*
**Killed claim.** *"The zero-baseline rule the study validates applies specifically to BAR graphs;
for line graphs and dot plots, which don't encode value by length/area, truncation may be
appropriate and a zero baseline may not be necessary."*
**Why killed.** The tidy bars-vs-lines split **failed adversarial verification (1-2)**. The evidence
base does not cleanly license "lines never need zero" — the zero-baseline question for **line charts
specifically** is unsettled. Source: Yang et al. 2021 (JARMAC).
**Takeaway.** Treat the bars-vs-lines split as **convention plus partial evidence, not settled.** Do
not state "line charts never need a zero baseline" as fact.

### R2 — Long & Kay's truncation *recommendation*, as a blanket designer rule — REFUTED 0-3 *(sibling run)*
**Killed claim.** *"When a task is unaffected by truncation (e.g., comparing gaps) a designer may
truncate to align visuals to the task, but for ratio/growth tasks they should use monotonic
truncation rather than no/non-monotonic truncation."* Source: Long & Kay 2024 (CHI, DOI
10.1145/3613904.3642102).
**Why killed (0-3).** Voted down in the sibling run as over-stated *as a normative designer rule*.
Note the runs partly disagree: the canonical run **verified a carefully-scoped version** of this as
Finding 1.4 (task-dependent, descriptive), while the sibling run killed the **prescriptive**
"designers should truncate" framing. Reconcile as: the *descriptive* task-dependence is supported; the
*prescription* to truncate is not a settled rule.

### R3 — "Embellishment is cost-free once datasets grow" — REFUTED 0-3 *(sibling run)*
**Killed claim.** *"An extension of Bateman's 'useful junk' work, using larger datasets (10+ points)
and comparing Nigel-Holmes embellished vs. plain grayscale charts, found chart type significantly
affected short-term recall — i.e., embellishment is not cost-free once datasets grow, complicating
Bateman 2010's clean 'no comprehension penalty' result."* Source: Li & Moacdieh 2014 (HFES,
DOI 10.1177/1541931214581316).
**Why killed (0-3).** Voted down *as stated* — but note this is a framing casualty, not a reversal:
the canonical run **incorporated Li & Moacdieh into Finding 2.1** as evidence the chartjunk effect is
**conditional** (time pressure / dataset size). So the substance survives; the specific "not cost-free"
phrasing did not clear the bar. This is the clearest example in the corpus of the same source being
*killed in one framing and kept in another* — a caution against over-reading any single verdict.

---

## Part 10 — Open questions (carry forward)

1. **Sparklines:** any controlled evidence that word-sized inline graphics beat a small table or a
   full chart for a real task? None surfaced — the design rules are unvalidated Tufte taste.
2. **Direct labeling vs. separate legend:** Kopp 2018 validates redundant *numeric* labels; does
   placing series labels **at the element** specifically beat a separate keyed legend in controlled
   studies? Not established.
3. **Data density:** is there a measured legibility ceiling, and does Tufte's "data density index"
   predict comprehension at all — or is denser-is-better purely aesthetic? No evidence either way.
4. **Tables vs. graphics for small datasets:** does Tufte's "tables often win" hold in any controlled
   comparison? No supporting study surfaced.
5. **Bars-vs-lines zero baseline:** the clean dichotomy failed verification (R1) — what does current
   evidence actually say about zero baselines for **line** charts specifically?
6. **Time-sensitivity:** the "start at zero" question is actively evolving. A **CHI 2026** follow-up,
   *"Taking Truncation to Task,"* was reported to corroborate task-dependence **and** that direct data
   labels mitigate truncation error. Re-check this rule before quoting it as settled.

---

## Part 11 — How the evidence maps to the shipped anti-patterns

The four floors and the "what not to do" section trace directly to Part 1/2/3:
- **Truncated y-axis ✗ → zero baseline ✓** — Finding 1.1 (Correll 2020, Pandey 2015, Yang 2021);
  break-marks don't rescue it — Finding 1.3. *Nuance from 1.4: honest-vs-deceptive is task-dependent,
  but for length-encoded bars the zero-baseline default stands.*
- **Radius-sized bubble ✗ → area (or position) ✓** — Finding 1.2 (Pandey 2015; Cleveland & McGill
  area = low-accuracy).
- **Pie / stacked-inner-band comparison ✗ → sorted bars / dot plot / small multiples ✓** — Cleveland &
  McGill 1984 (reconciled-in, Part 6) + small-multiples conditionality (Finding 3.1).
- **Chartjunk is taste, not law** — Findings 2.1/2.2: the anti-pattern section is *restraint*, and the
  skill honestly labels data-ink minimalism [CONVENTION], not proven comprehension.

---

## Coverage map — recovered vs. shipped

**Already reflected in the shipped skill** (SKILL.md / evidence-tufte-principles.md):
- Graphical integrity STRONG tier (truncation 1.1, area/radius 1.2, break-mark myth 1.3,
  task-dependent zero baseline 1.4) → shipped anti-patterns 1–3 and the "honesty floor."
- Data-ink/chartjunk as [CONVENTION] (2.1, 2.2) → shipped Overview + "keep chart marks quiet."
- Small-multiples conditionality (3.1) → shipped chart-chooser (task-first) and forms #3/#13/#22.
- Direct/redundant labeling helps (5.1) → shipped "direct labeling over legends" + chart #32.
- Cleveland & McGill ranking → shipped evidence doc (added as a standalone Tier-1 bullet).
- Evidence gaps + open questions → shipped as the [unvalidated] labels.

**Recovered here but NOT in the shipped distilled doc (the gaps this file closes):**
- The **full statistics** on every finding (F-values, p-values, N, effect sizes) — the distilled doc
  kept only headline numbers; the complete numbers are in Parts 1–5.
- **Finding 2.2** (Inbar preference study) full nuance: moderate-minimal drew ~41%, only *extreme*
  minimalism rejected — the shipped doc compresses this to one line.
- **R2 and R3** — the **two extra refuted claims from the sibling run** (`wf_10a0e5d0-ac4`). The
  shipped doc mentions only the single canonical-run refutation (R1). These two, and the note that the
  runs disagreed on framing, are recovered here for the first time.
- **Goffin et al.** word-scale-visualization sources — the actual (adjacent) sparkline literature that
  exists; the shipped doc just says "none found."
- **Moacdieh & Sarter 2017** clutter/eye-tracking study — the one empirical result bearing on data
  density; absent from the shipped doc.
- **Akbaba et al. 2020** (practitioners' perspectives on chartjunk) and the **Borkin 2013 / Haroz 2015**
  corroboration chain — context absent from the distilled doc.
- The **provenance caveat** that the standalone Cleveland & McGill finding was reconciled-in, not
  verified within the Tufte run (Part 6) — not stated in the shipped doc.
- The **Long & Kay vs. "Hofman et al." citation discrepancy** in the raw material (1.4).

**Not recovered / not present (honest limits):**
- **No per-agent raw text beyond the synthesis.** The 107 agent transcripts contain the intermediate
  search/fetch/vote work; the 25 verified claims were **merged into the 9 findings**, and the merge is
  faithful (each finding lists its merged-claim count). The ~11 budget-dropped and pre-verification
  claims were not individually reconstructed — they did not clear verification and are not evidence.
- **No new sources beyond the 24** fetched (listed below). The run did not fetch, e.g., Borkin 2013 or
  Haroz 2015 directly — they appear only as verifier corroboration, so they are cited as context, not
  as primary evidence.
- The **CHI 2026 follow-up** ("Taking Truncation to Task") is referenced second-hand in the run's own
  caveats; it was not fetched and is not verified here.

---

## Sources (the 24 fetched, by angle, with quality)

**Angle — Tufte canon & definitions**
- [primary] Tufte, "Sparkline theory and practice" — edwardtufte.com
- [secondary] Tufte, *Envisioning Information* (full PDF)
- [secondary] "Principles of Information Display for Visualization Practitioners" (NASA NAS-94-002, 1994)
- [blog] chartbuddy.io — Tufte's principles for graphical integrity
- [blog] simplexct.com — data-ink ratio
- [blog] thedoublethink.com — visualizing quantitative information

**Angle — Chartjunk / data-ink empirical studies**
- [primary] Bateman et al. 2010, "Useful Junk?" (CHI) — vis.csail.mit.edu
- [primary] Borgo et al. 2012, "Visual Embellishments in Visualization" (IEEE TVCG 18(12)) — PubMed 26357185
- [primary] Li & Moacdieh 2014, "Is 'chart junk' useful?" (HFES) — DOI 10.1177/1541931214581316
- [secondary] "Useful Chartjunk: The Chartjunk Debate" (scribd)
- [primary] Inbar, Tractinsky & Meyer 2007, "Minimalism in information visualization" (ECCE) — ResearchGate
- [primary] Akbaba et al. 2020, "Practitioners' Perspectives on Chartjunk" (arXiv 2009.02634)

**Angle — Graphical integrity & axis truncation**
- [primary] Correll, Bertini & Franconeri 2020, "Truncating the Y-Axis: Threat or Menace?" (CHI) — DOI 10.1145/3313831.3376222
- [primary] Pandey et al. 2015, "How Deceptive are Deceptive Visualizations?" (CHI) — DOI 10.1145/2702123.2702608
- [primary] Yang et al. 2021, "Truncating Bar Graphs Persistently Misleads Viewers" (JARMAC) — DOI S2211368120300978
- [primary] Long & Kay 2024, "To Cut or Not To Cut?" (CHI; scoped elsewhere as "Hofman et al.") — DOI 10.1145/3613904.3642102

**Angle — Small multiples & direct labeling**
- [primary] Javed, McDonnel & Elmqvist 2010, "Graphical Perception of Multiple Time Series" (IEEE TVCG 16(6))
- [primary] Kopp, Riekert & Utz 2018, "When cognitive fit outweighs cognitive load" (Computers in Human Behavior 86) — DOI S0747563218302012
- [primary] Gleicher 2018, "Considerations for Visualizing Comparison" (IEEE VIS/TVCG) — graphics.cs.wisc.edu

**Angle — Sparklines effectiveness**
- [primary] Goffin et al. 2014, "Exploring the Placement and Design of Word-Scale Visualizations" (IEEE VIS/TVCG) — PubMed 26356943
- [primary] Goffin et al. 2015, "Exploring the Effect of Word-Scale Visualizations on Reading Behavior" (CHI EA) — DOI 10.1145/2702613.2732778

**Angle — Tables vs. graphics & data-density ceiling**
- [unreliable] Vessey 1991, "Cognitive Fit: … Graphs Versus Tables Literature" (Decision Sciences 22(2)) — paywall stub, 0 claims
- [primary] Moacdieh & Sarter 2017, "Data Density, Display Organization, and Stress on Search Performance" (IEEE THMS) — ieeexplore 7971994
- [primary] Vessey & Galletta 1991, "Cognitive Fit: An Empirical Study of Information Acquisition" (Information Systems Research 2(1)) — ResearchGate 220079435

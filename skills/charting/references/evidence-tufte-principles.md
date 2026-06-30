# Tufte principles — empirical evidence (deep-research findings, 2026-06-26)

Source: deep-research workflow (107 agents, 24 sources fetched, 104 claims → 25 adversarially verified, 24 confirmed / 1 killed). Full raw result was at `/tmp/.../tasks/wkmoalu7z.output`. **Purpose:** reconcile these verdicts into the `graphical-perception-and-color` skill's evidence labels (and the charting skill's integrity notes). Use the skill's existing scheme: **[STRONG]** = controlled studies / standard · **[CONVENTION]** = taught, weak/mixed support · **[unvalidated]** = no controlled evidence either way (NOT "myth").

## Three tiers

### Tier 1 — best supported [STRONG]: graphical integrity / perceptual distortion
- **Truncated / non-zero axes reliably inflate *perceived* magnitude.** Correll, Bertini & Franconeri, "Truncating the Y-Axis: Threat or Menace?" (CHI 2020, n=40): more truncation → more perceived severity, F(2,76)=89, p<.0001. Pandey et al., "How Deceptive are Deceptive Visualizations?" (CHI 2015, N=250). Yang et al., "Truncating Bar Graphs Persistently Misleads Viewers" (J. Applied Research in Memory & Cognition 2021): robust across 5 studies, 83.5% show the effect.
- **Encoding magnitude by radius instead of area exaggerates perception** (confirms Tufte's area / "Lie Factor" point). Pandey et al. (CHI 2015, N=330): radius-encoded 2.71 vs area-faithful 1.71, p=.0007. Converges with Cleveland & McGill (area = low-accuracy channel).
- **MYTH-BUSTER:** break-marks / gradient-fade "honesty" cues do **NOT** meaningfully reduce the truncation exaggeration. Correll 2020: "no significant difference … even for designs with explicit visual cues" (F(2,60)=3.1, p=.05 — borderline null, single canonical test).
- **Pie slices and stacked inner bands are decoded inaccurately.** Cleveland & McGill, "Graphical Perception" (JASA 1984): *angle* and *area* (pie slices) and *unaligned position/length* (the floating middle of a stacked bar) rank below aligned position and length. Fix: sorted bars / dot plots for ranking; grouped bars or small multiples to compare an inner series. [STRONG — foundational ranking; backs charting anti-patterns #4 (pie) and #5 (stacked).]

### Tier 2 — partly contradicted → [CONVENTION], not law: data-ink / chartjunk minimalism
- "Remove all non-data ink to aid comprehension" is **not proven and is partly contradicted.** Bateman et al. "Useful Junk?" (CHI 2010, N=20): embellished charts interpreted as accurately as plain, and recalled significantly **better** after 2–3 weeks. Borgo et al. (IEEE TVCG 2012): embellishment aids memory but **costs visual-search speed** (task-dependent tradeoff). Li & Moacdieh (HFES 2014): effect conditional on time pressure. Inbar et al. (ECCE 2007, N=87): viewers **prefer** non-minimalist bars (aesthetic preference only — not comprehension).
- Caveats: small N (Bateman N=20, one-tailed); the "embellishment helps" result is specific to Nigel-Holmes-style decoration vs sometimes-weak plain comparators — **do not generalize to "all decoration is good."** Few's critique disputes over-generalization, not the narrow accuracy/recall finding.
- **So:** keep our existing label — Tufte's data-ink/chartjunk minimalism is **[CONVENTION]**, taste, not a proven comprehension rule. The research strengthens this.

### Tier 3 — task-dependent (relabel, don't state as universal)
- **"Bars must always start at zero" is NOT universal.** Truncation inflates *perceived* effect size but does **not** degrade *accuracy* on additive-difference tasks (Long & Kay, "To Cut or Not To Cut?", CHI 2024, pre-registered). Honest-vs-deceptive depends on **task and intent**. NOTE: the two findings don't conflict — one measures *perception* (inflated), the other *task accuracy* (unharmed). The clean "bars need zero / lines don't" dichotomy **failed** verification (1-2 vote) → treat as convention, not settled.
- **Small multiples beat a single dense chart only conditionally** — for large visual span / "dispersed" discrimination; a shared-space line chart wins for small-span / "local" tasks like finding a maximum. Javed et al. (IEEE TVCG 2010); Gleicher (IEEE VIS 2018). "Small multiples always win" is false.
- **Direct / redundant labeling measurably helps** (medium confidence, single study): redundant numeric data labels read more accurately and faster (Kopp, Riekert & Utz, Computers in Human Behavior 2018) — cognitive-fit beats cognitive-load here. Caveat: tests redundant *numeric* labels, adjacent to but not identical to Tufte's direct-label-vs-legend claim.

## Evidence gaps — label [unvalidated] (Tufte taste, but NOT disproven)
No controlled evidence surfaced for: sparkline **effectiveness** vs tables/full charts (only Tufte's *definition* is solid); a data-density **legibility ceiling** / "data density index"; **layering & smallest-effective-difference**; **micro/macro** reading; **tables-beat-graphics for small data** (Vessey's cognitive-fit theory explains *when* tables vs graphs win by task, but doesn't validate Tufte's specific claim).

## Open questions (carry forward)
- Sparklines: any controlled evidence they beat a small table / full chart? None found.
- Direct labeling *at the element* vs a separate keyed legend specifically — not established (Kopp tests numeric labels).
- Zero baseline for **line** charts specifically — the bars-vs-lines split failed verification; unclear.
- Time-sensitive: the "start at zero" question is actively evolving (Long & Kay 2024; a reported CHI 2026 follow-up corroborates task-dependence + that direct data labels mitigate truncation error).

## Primary sources
Cleveland & McGill 1984 (JASA) · Bateman 2010 (CHI) · Borgo 2012 (IEEE TVCG) · Li & Moacdieh 2014 (HFES) · Inbar 2007 (ECCE) · Parsons & Shukla 2020 (IEEE VIS) · Pandey 2015 (CHI) · Correll, Bertini & Franconeri 2020 (CHI) · Yang et al. 2021 (JARMAC) · Long & Kay 2024 (CHI) · Javed, McDonnel & Elmqvist 2010 (IEEE TVCG) · Gleicher 2018 (IEEE VIS) · Kopp, Riekert & Utz 2018 (Computers in Human Behavior) · Vessey 1991 (Decision Sciences) · Tufte, "Sparkline theory and practice" (edwardtufte.com).

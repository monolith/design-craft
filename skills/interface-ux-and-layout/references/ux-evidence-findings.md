# Web UX & interface design — empirical evidence (deep-research findings, 2026-06-26)

Source: deep-research workflow (110 agents, 27 sources, 120 claims → 25 verified, 23 confirmed / 2 killed). Full raw was at `/tmp/.../tasks/w2uoavnuq.output`. **Purpose:** evidence base for the UX/interface skill (#3). Labels: **[STRONG]** = normative standard or settled psychophysics · **[CONVENTION]** = taught, weak/observational support · **[MYTH]** = the evidence contradicts the popular framing.

## Headline
Only the **accessibility/contrast cluster is truly [STRONG]**. Most other UX "laws" are **[CONVENTION]** — expert heuristics or observational eye-tracking, not controlled comprehension trials. **No confirmed UX claim conflicts with the data-viz skill**; the synergies (contrast, luminance-not-hue, redundant/direct labeling, restraint-as-convention) all hold and none of the data-viz myths were reintroduced.

## [STRONG] — accessibility & contrast (the only clean [STRONG] cluster)
- **WCAG 2.1 AA contrast:** ≥4.5:1 normal text, ≥3:1 large (≥18pt or 14pt bold). (W3C SC 1.4.3)
- **Contrast is computed from relative luminance, explicitly NOT hue.** (W3C) — directly reinforces the data-viz "luminance not hue" finding.
- **Color must never be the sole carrier of information** (W3C SC 1.4.1) — = data-viz "don't rely on color alone / direct-label."
- **Apple's contrast guidance is drawn verbatim from WCAG AA.** Convergent normative sources.
- **Synergy:** zero conflict with data-viz; both treat contrast/luminance/redundant-encoding identically.

## [STRONG] psychophysics, but [MYTH] as usually framed
- **Hick's law** RT = a + b·log₂(n) is settled (Hick 1952 / Hyman 1953). **BUT** "every added choice reliably slows users" is **[MYTH]** — the slope is not invariant; it depends on stimulus–response compatibility and ranges from **zero** upward (Proctor & Schneider 2018). Hick's law does NOT license blanket "fewer menu items is always faster."

## Scanning & reading — [STRONG]-descriptive, [CONVENTION]-prescriptive
- **People scan, not read** word-by-word [STRONG-descriptive] (Nielsen 1997; NN/g eye-tracking).
- **F-pattern** (two top horizontal passes + left-edge vertical) is real **but is a FALLBACK FAILURE state** of text-heavy pages WITHOUT formatting — **not a reading mode to design toward** [MYTH to design for it]. (NN/g)
- **Layer-cake pattern** (gaze lands on clear descriptive headings) is the *effective* scan mode — so write strong headings/subheads. The gaze descriptions are [STRONG-descriptive]; the prescriptions (front-load, use headings) are [CONVENTION] (no controlled task-success RCT).

## [CONVENTION] — real, widely taught, weak/observational support
- **Response-time thresholds:** ~0.1s = feels instantaneous; ~10s = limit of held attention. Miller (1968) called these "best calculated guesses," not lab constants. For continuous direct-manipulation the threshold is lower (~60ms, sub-100ms). Label the 0.1s as a *discrete*-response convention.
- **Touch/control sizing:** Apple **44×44pt is the DEFAULT control size, NOT a universal minimum** (documented min 28×28pt iOS). [STRONG] as a platform spec but [MYTH] as "the minimum." (passed only 2-1 — present the default-vs-min subtlety.)
- **Spacing/proximity & whitespace** for grouping and hierarchy — Gestalt proximity applied; Material spacing is design-system *documentation*, not experiments. [CONVENTION].
- **Aesthetic-usability effect:** the STRONG form ("beautiful = perceived more usable") is a **PRE-USE first-impression** phenomenon (Kurosu & Kashimura 1995; Tractinsky 1997). It did **NOT inflate measured POST-use usability** when independently manipulated (Grishin & Gillan 2019). So: beauty buys first-impression trust, not actual ease — consistent with the data-viz note.

## REFUTED this round (do NOT assert without re-checking)
- **The 1.0s "flow of thought" limit failed verification (0-3)** — even though it lives in the same NN/g article as the confirmed 0.1s/10s limits. Don't repeat the classic "0.1/1/10 triad" without re-sourcing the 1.0s.
- **"Broad-shallow menus beat narrow-deep (Landauer & Nachbar 1985)"** refuted (0-3).

## Coverage gaps — NO verified claims; mark [CONVENTION] pending dedicated sourcing
60-30-10 color rule · dark-mode performance · mega-menus · breadcrumbs · search-vs-browse · Z-pattern · line-length/measure · typographic scale · grid systems · Doherty threshold (~400ms) · Material 48dp · Fitts's law specifics · Norman's affordances/signifiers · flat-vs-skeuomorphic "modern" aesthetics. (Absence of evidence ≠ evidence of absence — carry as [CONVENTION], don't assert as proven.)

## Data-viz consistency (the cross-check Anatoly asked for)
No confirmed UI claim contradicts the data-viz skill. Synergies hold: contrast, luminance-not-hue, redundant/direct labeling, restraint-as-convention. None of the data-viz myths (hue/eye-strain, blue light, dark-mode winner) were reintroduced. The aesthetic-psychology companion run (`wf_6f45d79f-81a`) extends this with fluency/prototypicality/color-emotion.

## Primary sources
W3C WCAG 2.1 (1.4.3, 1.4.1) · Apple HIG Accessibility · Hick 1952 / Hyman 1953 / Proctor & Schneider 2018 (QJEP) · Miller 1968 (AFIPS) · Card, Robertson & Mackinlay 1991 (CHI) · Nielsen 1997 + NN/g F-pattern/layer-cake/text-scanning eye-tracking · Kurosu & Kashimura 1995 (CHI) · Tractinsky 1997 (CHI) · Grishin & Gillan 2019 · Material Design (layout/spacing) · NN/g Gestalt proximity.

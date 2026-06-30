# Practical interface design — navigation, inspection, targets, attention (deep-research findings, 2026-06-26)

Source: deep-research workflow `wgmv1wpra` (loosened criteria — controlled studies first, named design-authority conventions where none exist). **Purpose:** fills the practical gaps the first UX run left open (it had covered fluency, first impressions, accessibility/contrast, page scanning). Labels: **[STRONG]** = controlled study or normative standard · **[CONVENTION]** = named-authority best practice, weak/observational support · **[MYTH]** = evidence contradicts the popular framing.

## Headline
Four of six practical clusters are now grounded — **navigation/IA, usability-inspection methods, Fitts's-Law/target-sizing, and visual-attention/eye-tracking** — with controlled studies plus one normative standard (WCAG 2.2). **Forms/interaction-states/response-time** and **grids/spacing/typography** remain unevidenced and are carried as [CONVENTION] pending a named-authority follow-up. No claim conflicts with the data-viz/colour skill.

## Navigation & IA — [STRONG]
- **Hidden / hamburger navigation measurably hurts.** NN/g controlled remote test (179 participants, 6 sites): hidden nav cut content discoverability **>20%**, made desktop task completion **≥39% slower** (15% slower on mobile vs combo), and was used far less (desktop hidden 27% vs visible/combo 48–50%; mobile hidden 57% vs combo 86%). **Prefer visible or combo nav; reserve fully-hidden nav for genuinely space-constrained mobile.** (nngroup.com/articles/hamburger-menus)
- **Broader, shallower IA beats narrow-deep.** Jacko & Salvendy (1996), controlled (breadth {2,8} × depth {2,3,6}): reaction time, error rate, and perceived complexity all rose significantly with depth and/or breadth. Favour broad-shallow. (Perceptual & Motor Skills 82:1187)

## Usability inspection — [STRONG]
- **Heuristic evaluation needs 3–5 evaluators.** A single expert finds only **20–51%** of known problems (evaluators' problem sets barely overlap); ~5 evaluators catch about **two-thirds**; returns flatten by ~10 (spend extra budget on other methods). (Nielsen & Molich 1990)
- **Severity ratings: aggregate ~4 raters.** One evaluator's severity score is unreliable; the mean of ~4 lands within half a rating point of "true" severity 95% of the time.
- **[MYTH / contested]** "**Five users find ~85% of problems**" is unreliable in practice. Faulkner (2003): random 5-user sets ranged **55–99%** (mean ~85% — the problem is *variance*); 10 users → 80% floor, 20 → 95%. Spool & Schroeder (2001): on a production e-commerce site with open-ended browsing, the first five users caught only **~35%**. Five users is a floor for cheap iteration, **not** a guarantee — test more on large, complex, open-task sites.

## Target sizing & Fitts's Law — [STRONG]
- **Empirical touch-target minimum ≈ 1 cm.** Parhi (2006, n=20, controlled): ≥**9.2 mm** for discrete actions, ≥**9.6 mm** for serial actions; error rate stops improving above ~9.6 mm. This underlies the platform conventions (Apple **44 pt**, Material **48 dp**) — which are *defaults*, not the measured minimum.
- **[STRONG / normative] WCAG 2.2 SC 2.5.8 Target Size (Minimum), AA:** **24×24 CSS px** minimum, OR an undersized target conforms via the **spacing exception** (a 24px-diameter circle on each target must not intersect another). Minimum-size-OR-spacing.
- **Fitts's Law** (movement time falls as targets get larger / closer) is among the most robust models in experimental psychology **[STRONG relationship]**; the layout *prescriptions* are **[CONVENTION]**: place frequent targets near the pointer (context menus at the cursor), enlarge targets that need long travel; bigger targets are faster with fewer errors. (Soukoreff & MacKenzie 2004)

## Visual attention & scanning — descriptive [STRONG], prescriptive [CONVENTION]
- **F-shaped scan** (two top horizontal sweeps + a left-edge vertical) is confirmed by NN/g eye-tracking — but it is the **DEFAULT when text is unformatted**, i.e. a **symptom of weak hierarchy, not a layout to design toward.** In LTR languages, top-and-left content is read more than right-and-bottom.
- **Position biases attention:** earlier lines and the leftmost words draw disproportionate fixations (users often read only the first ~2 words / ~11 characters of a heading or link). **Front-load information-bearing words** in headings/subheads/links; avoid generic "click here" / "more."
- **Redirect the eye with hierarchy:** prominent headings, bolded key phrases, bullet lists, trimmed copy, visual grouping. NN/g ranks scan patterns worst→best: **F-pattern (worst) < spotted < layer-cake < commitment (best).**

## Still open (carry as [CONVENTION]; named-authority follow-up in progress)
- **Forms:** label placement (top/left/inline), single- vs multi-column, inline vs after-submit validation, error wording, required/optional marking.
- **Response-time thresholds:** Miller 1968 ("best guesses"), Doherty & Thadani 400ms, Google RAIL (100ms/1s/10s).
- **Interaction states:** default/hover/focus/active/disabled; WCAG 2.2 SC 2.4.7 focus-visible, 2.4.11 focus-not-obscured; loading/skeleton/empty/error states.
- **Grids & spacing & type:** column grids, 8-pt spacing, line length ~45–75 characters, vertical rhythm / modular scale, responsive breakpoints — name the source (Material 3 / HIG / GOV.UK / Refactoring UI / Butterick) for each.
- **Nav details:** top-bar vs left-rail, breadcrumbs, tabs, mega-menus, search-vs-browse.
- **Attention models:** bottom-up saliency (Itti & Koch; Wolfe; Treisman), banner blindness, Z-pattern / Gutenberg diagram (evidence or myth?), edges/corners as "infinite" Fitts targets.

## Primary sources
NN/g hamburger-menus + hidden-navigation-methodology · Jacko & Salvendy 1996 (Perceptual & Motor Skills 82:1187) · Nielsen & Molich 1990 (CHI) · Faulkner 2003 (Behav. Res. Methods 35:379) · Spool & Schroeder 2001 (CHI) · Parhi 2006 (MobileHCI) · WCAG 2.2 SC 2.5.8 · Soukoreff & MacKenzie 2004 (IJHCS) · NN/g F-shaped-pattern + text-scanning-patterns eye-tracking.

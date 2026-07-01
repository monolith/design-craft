---
name: interface-ux-and-layout
description: Use when structuring, laying out, or improving a web page, app screen, or dashboard — page structure, navigation and menus, grids, spacing, visual hierarchy, data tables and data grids, third-party component libraries / UI kits, usability, guiding the eye, or making a UI easy to use and interact with. Also when judging why a layout feels cluttered, confusing, hard to navigate, or unpolished. Practical interface craft grounded in evidence (fluency, accessibility, usability heuristics) with taste labelled as taste. Defers chart forms to charting and colour to graphical-perception-and-color. Part of the design-craft toolkit — the orchestrator is the art-director (it sets the theme/feel and coordinates the whole set); all the skills apply together on every piece, this one as a specialist lever.
---

# Interface UX & layout

## Overview

Practical craft for building pages and dashboards people can actually use: how to
**structure a screen, place navigation, set a grid, guide the eye, and make interaction
clear.** Grounded in evidence where it exists, and labelled as taste where it doesn't —
because most layout and navigation "rules" are taught wisdom, not proven law, and the value
of this skill is saying *which is which.*

**The spine (the *why* under every rule below):**
- **[STRONG] Accessibility/contrast** is the one hard floor — a standard, not an opinion.
- **[STRONG] Processing fluency** is the mechanism: the easier a screen is to find your way
  around, read, and act on, the better it feels and the more it gets used. Hierarchy, alignment,
  convention, restraint, whitespace, clear nav — all of it is, at root, *lowering the cost of
  finding, understanding, and acting.*

So the practical sections are organised around three jobs: **lay it out → help them navigate →
guide the eye and the hand.** Full evidence detail lives in the two research references; this
file is the craft.

**Confidence labels:** [STRONG] = controlled studies / normative standard · [CONVENTION] = taught,
weak/observational support · [extracted] = primary-sourced but not adversarially vote-verified in
this skill's research · [MYTH] = evidence contradicts the popular framing · [taste] = no
evidence either way; an aesthetic choice, labelled as such.

**Full research trail:** built from three deep-research runs (~331 agents). Distilled findings in [references/ux-evidence-findings.md](references/ux-evidence-findings.md), [references/aesthetic-preference-findings.md](references/aesthetic-preference-findings.md), and [references/ux-practical-findings.md](references/ux-practical-findings.md); the **complete raw per-agent corpus** — 83 source extractions + 225 adversarial verifications, verbatim — is in [references/interface-ux-and-layout-corpus.md](references/interface-ux-and-layout-corpus.md).

## Boundary — and how the three skills compose

- **Chart / graph / dashboard *forms*** → **[[charting]]**
- **Colour, palettes, contrast values, dark mode, CVD** → **[[graphical-perception-and-color]]**
- **Producing distinctive, polished frontend code** → **frontend-design** (the implementation layer — builds design-craft's decisions in code)

This skill owns **structure, navigation, grids, usability, eye-flow, and interaction.** A real
dashboard uses all three: *this* skill lays out the screen and orders the scan, **charting**
supplies the sparklines/small-multiples, **graphical-perception-and-color** picks the inks and the
reserved accent. The worked gallery deliberately uses all three together so they read as one toolkit.

**Precedence with `frontend-design` (Anthropic) — design-craft sets the UX, frontend-design builds it.** This skill owns the layout decisions — structure, navigation, hierarchy, grids, spacing, eye-flow. `frontend-design` is the production-code implementer that turns them into clean, distinctive code; lean on it for code quality, not for overriding the layout. It enters a *layout* decision only as a fallback when: this skill doesn't cover it (e.g. a novel interaction pattern with no template here); the guidance is a weak lean (two equally-sound arrangements); the user rejects the options; or the user wants a drastic directional change (an experimental, unconventional layout). **Hard floor (never yields to frontend-design): focus-visible, adequate target size, layout that survives text-zoom/resize, basic usability.** Evidence labels are unchanged.

## Quick reference

| The job | Do this | Confidence |
|---|---|---|
| Structure a page | Conventional skeleton (global nav, one main column or a sidebar shell, footer); one clear focal point above the fold. | [CONVENTION] |
| Place navigation | Persistent global nav in a conventional spot; show an **active "you are here"**; ≤ ~7 top-level items. | [CONVENTION]; recognition>recall [usability] |
| Set a grid | Align everything to a few columns + one spacing step; keep text measure ~45–75 chars. | [CONVENTION]; exact numbers [taste] |
| Guide the eye | One entry point → focal → path, built from size/weight/**contrast**/whitespace; reserve one accent for the single critical thing. | fluency [STRONG]; pop-out [STRONG] |
| Make it usable | Visible system status, recognition over recall, undo over confirm, consistency, error prevention. | [CONVENTION] (Nielsen heuristics) |
| Size the hit targets | Frequent/important actions: bigger, closer, edge-anchored (Fitts's law). | [STRONG] (specifics a gap) |
| Every control & view | Visible states (hover/**focus**/active/disabled) and empty/loading/error states; feedback < ~0.1s. | [CONVENTION] + focus=[STRONG/a11y] |
| Show a table of data | Default to a **Tufte-styled table** (→ [[charting]]); use a data grid (AG Grid) **only** when the user asks for filtering/interaction or the grid's machinery adds *substantial* UX value. Even then keep the Tufte look, pin the identity column, keep filter/sort state visible. | Tufte [STRONG]; threshold [CONVENTION]; a11y floor [STRONG] |
| Pull in a component library | Framework is free (React/Rails/Vue). Prefer **headless** libs (Radix, Headless UI, TanStack) you style freely; **styled kits** (MUI, Ant, Bootstrap) ship a look — gatekeep, then make design-craft govern and the kit yield wherever it allows. | [CONVENTION]; a11y floor [STRONG] |
| Don't | Design *for* the F-pattern; assume "fewer choices = faster"; treat "beautiful" as "usable"; assert 60-30-10 / golden ratio / Z-pattern as fact. | [MYTH] / [taste] |

## 1. Page & screen structure

- **Anatomy:** global nav/header · (optional) sidebar · a primary content region with **one focal
  point** · secondary/supporting content · footer. Decide the focal point first; everything else
  supports it.
- **Patterns:** *single-column* (articles, forms, marketing) · *sidebar app-shell* (tools, docs,
  consoles) · *dashboard grid* (monitoring) · *card grid* (catalogues). Pick by task, not by taste.
- **Above the fold** still matters for *first impression and orientation* (not a hard "everything
  important up top" rule). Put the one thing that orients the user where the eye lands first.
- **Responsive:** multi-column reflows to a single stack; nav collapses; touch targets grow. Design
  the stack order deliberately — it's the true reading order.
- **[CONVENTION] Concrete breakpoints** (Material 3 window size classes): Compact <600 · Medium
  600–839 · Expanded 840–1199 · Large 1200–1599 · Extra-large ≥1600 dp; target pane count ≈ 1 / 1 /
  2 / 2 / 3; as width grows, swap the bottom **navigation bar → side navigation rail**.
- Most of this is **[CONVENTION]**; the *why it works* (conventional = fluent) is [STRONG].

## 2. Navigation & wayfinding

Good navigation answers three questions at all times: **where am I, where can I go, how do I get back.**

- **Global nav** persistent and in a conventional place (top bar or left rail). **Show the active
  item** — the single most common wayfinding miss.
- **[STRONG] Keep primary nav visible — don't hide it behind a ☰.** In NN/g's controlled test (179
  participants, 6 sites) hidden/hamburger nav cut content **discoverability >20%**, made desktop tasks
  **≥39% slower**, and was used far less than visible/combo (desktop 27% vs 48–50%). Reserve fully-hidden
  nav for genuinely space-constrained mobile; prefer visible or combo elsewhere.
- **[CONVENTION] Moderate breadth + shallow depth beats narrow-deep — but extreme breadth also costs.**
  Reaction time and error rate rise with breadth *and* with depth (Jacko &amp; Salvendy 1996, controlled),
  and Larson &amp; Czerwinski (1998) found a **16×16 tree beat the broadest-shallowest** layout. So favour
  fewer levels *and moderate* breadth — the *direction* holds; the "more alternatives per screen is
  cost-free" *mechanism* does not (see §8).
- **Top vs side:** top bar for few sections / marketing; **left rail** for many sections / apps and
  dashboards (scales vertically, room for grouping).
- **Breadcrumbs** for deep hierarchies (where am I + one-click up). **Tabs** for switching views of
  the *same* object. **Search** when the space is large or users know the target; **browse** when
  they don't — most apps need both.
- **Recognition over recall** [usability]: show choices and labels; don't make people remember
  paths or codes.
- Keep top-level choices few and stable. ("Fewer is faster" is **not** a law — see §8 — but a
  *stable, learnable* nav is fluency.)
- The *visible-nav* finding is **[STRONG]**; the *broad-shallow direction* is **[CONVENTION]** (its
  cost-free mechanism is refuted — §8). Finer specifics (mega-menus, breadcrumbs-always,
  search-vs-browse defaults) remain **[taste]** — don't assert.

## 3. Grids & alignment

- **Align everything to a few columns.** A shared left edge / column structure reads as order and
  eases processing (= fluency). Misalignment reads as "broken," even when nothing is.
- **One spacing step** (e.g. a 4/8px scale) for gaps and padding; the regularity is the point.
- **[upheld] Gestalt proximity is the mechanism under spacing.** Items set close together read as a
  group; a larger gap reads as a boundary — proximity groups the related and separates the unrelated
  (verified via Material 3 spacing). Whitespace establishes hierarchy; it isn't filler.
- **Measure** (line length) ~45–75 characters is the common convention; the exact number is **[taste]**.
- **Gutters and breakpoints**: consistent gutters; reflow columns → stack at narrow widths.
- Grids are **[CONVENTION]/[taste]** as systems (12-column, modular scale) — useful defaults, not
  proven law. The *alignment-as-order* benefit is the fluency mechanism [STRONG-adjacent].

## 4. Guiding the eye (navigating the human eye)

The core of "easy to use" is controlling *where the eye goes first, next, and last.* You have four
controls — **size, weight, contrast, and whitespace** — plus one power tool: **preattentive pop-out.**

- **One entry point.** The largest/highest-contrast element wins the first fixation — make it the
  thing you want seen first. If everything is loud, nothing leads. **But designed salience is only
  one of five sources that steer eye-landing** — the others are the viewer's goals, priming, reward,
  and learned page structure (Wolfe, guided search). So "the loudest element wins" competes with what
  the user came to do: salience proposes, goals dispose.
- **A path, not a pile.** After the focal point, a clear second tier and consistent alignment let
  the eye flow in a deliberate order. Whitespace **separates** (groups) and **directs** (channels).
- **Pop-out for the one critical thing** [STRONG]: a single mark differing on one channel (colour,
  size, orientation, motion) against a calm field is found *pre-attentively* — before conscious search. This is
  the hand-off to **[[graphical-perception-and-color]]** (which channel, which contrast) and the
  perception gallery's pop-out demo. Spend it once; reserve the accent.
- **Reading patterns, honestly:** the **F-pattern** is a *failure* state of unformatted text, **not
  a target** [MYTH to design for it]; the **layer-cake** (gaze lands on clear headings) is the mode
  to support — write strong headings. The **Z-pattern** for sparse landing pages is **[taste]** —
  use it, don't cite it.
- **[CONVENTION] Banner blindness.** Don't put important content in ad-shaped boxes or the right
  rail — the avoidance is *learned and location-based*, not about the pixels (NN/g eyetracking;
  Benway 1998). If it matters, it goes in the main column and mustn't look like an ad.

## 5. Usability heuristics

Nielsen's 10 are **[CONVENTION]** — durable expert heuristics, not controlled trials. Use them as a
checklist; don't claim them as proof.

1. **Visibility of system status** — always show what's happening (loading, saved, progress).
2. **Match the real world** — user language and familiar concepts, not system jargon.
3. **User control & freedom** — clear exits; **undo/redo** beats a confirm dialog.
4. **Consistency & standards** — the same control means the same thing everywhere.
5. **Error prevention** — make the bad action hard (disable, constrain, confirm destructive ones).
6. **Recognition over recall** — show options; don't tax memory.
7. **Flexibility** — accelerators for experts, defaults for novices.
8. **Minimalist** — every extra element competes with the essential (= fluency/§complexity).
9. **Help users recover from errors** — plain-language messages that say what to do next.
10. **Help & docs** — available, searchable, task-oriented.

**Fitts's law [STRONG psychophysics]:** time-to-target rises with distance and falls with size —
so make frequent/important controls **bigger and closer**, and exploit **screen edges/corners**
(infinite width). The model is among the most robust in experimental psychology; the layout *prescriptions*
(place frequent targets near the pointer, enlarge far ones) are **[CONVENTION]** (Soukoreff &amp; MacKenzie 2004).

- **[STRONG] Target-size minimum ≈ 1 cm.** Parhi (2006, controlled): ≥**9.2 mm** discrete / **9.6 mm** serial
  for thumb use; error rate stops improving past ~9.6 mm. **WCAG 2.2 SC 2.5.8 (AA): 24×24 CSS px** minimum, or
  pass via the **spacing exception** (a 24px circle on each target must not overlap another). Apple **44 pt** /
  Material **48 dp** are comfortable *defaults*, not the floor.

**Usability testing & inspection [STRONG]:** **heuristic evaluation needs 3–5 evaluators** — one expert finds
only **20–51%** of problems, ~5 catch about two-thirds (Nielsen &amp; Molich 1990); aggregate ~4 raters for severity.
The popular **"5 users finds 85%"** is a high-variance *floor*, not a guarantee — random 5-user sets ranged
55–99% (Faulkner 2003) and caught only ~35% on a large open-task site (Spool &amp; Schroeder 2001). **[MYTH as a guarantee]**

## 6. Interaction & states

- **Every interactive element needs visible states:** default · **hover** · **focus (keyboard —
  this is accessibility, [STRONG])** · active/pressed · disabled. A control with no states reads as
  not-interactive.
- **Every data view needs three states besides "full":** **empty** (first run / no data — say what
  to do), **loading** (don't freeze silently), **error** (what happened + recovery). Designing only
  the happy path is the most common app-UX gap.
- **Feedback fast:** for direct manipulation, response should feel immediate (~0.1s convention; even
  lower for drag); if it can't, show progress.
- **[CONVENTION, data-backed] Sub-second response is a productivity lever, not just polish.** Below
  ~1 s, throughput rises non-linearly (180 transactions/hr @3s → 252 @1.0s → 371 @0.3s), and a faster
  response saves the user *more* time than the latency cut itself — a slow response breaks the held
  sequence of the action they were mid-way through (Doherty & Thadani, IBM 1982).
- **Forgiveness over interrogation:** prefer undo to "Are you sure?"; preserve user input on error.
- **Progressive disclosure:** summary first, detail on demand — reduces complexity without losing it.
- **[STRONG-adjacent] Affordance/signifiers.** Clickable things must *look* clickable: NN/g
  eyetracking found weak or absent clickability signifiers **measurably cut efficiency and attention**
  (significant, p<.05). Flat design is fine *if* interactive elements still read as interactive — the
  failure is removing the cues, not the style itself.

## Forms

The skill's biggest gap — a form is a screen with its own strong evidence base.

- **[STRONG] One column.** Single-column layouts beat multi-column — multiple columns break the
  vertical scan and get misread across questions. Exception: naturally grouped short fields
  (City / State / Zip) may share a row.
- **[CONVENTION] Labels above the field**, left-aligned. **Never use the placeholder as the label** —
  it vanishes on focus and fails accessibility.
- **[STRONG] Validate inline, on *blur*** — not per-keystroke (premature, nags mid-entry) and not
  submit-only (drives abandonment). Baymard: inline validation ≈ **22% higher success, ~42% faster
  completion, ~47% fewer eye fixations**.
- **[CONVENTION] Put the error adjacent to the field and preserve the bad input** — never clear the form.
- **Compliance pays:** compliant forms hit **78% first-try submission vs 42%** for non-compliant ones
  (Seckler et al. 2014, CHI).

## 7. Dashboards (where all three skills meet)

- **Scan order:** people start top-left and move right/down — put the headline status there; least
  urgent bottom-right.
- **Overview, then detail on demand:** a glanceable top tier (KPI tiles + sparklines), denser detail
  below; drill-down rather than everything-at-once.
- **One palette, one reserved accent** (→ colour skill). Consistent meaning: if red = bad in one
  tile it's bad everywhere.
- **Use the real forms** (→ charting): KPI tile = big number + **sparkline** + signed delta; trends
  = **small multiples** on a shared scale; status = colour **+ icon + word** (never hue alone).
- **Density without clutter** (micro/macro): trust the reader with detail; don't thin the data to
  look "clean."

## 8. Myths & refuted — do not assert

- **[MYTH]** "Every added option slows the user." Hick's law is real but its slope can be ~zero
  depending on stimulus-response compatibility (Proctor & Schneider 2018). A stable, learnable nav
  matters more than raw item count.
- **[MYTH]** "Design for the F-pattern." It's a failure state, not a goal (§4).
- **[MYTH as sold, but contested]** "Beautiful is more usable." It's largely a *first-impression*
  halo; isolated, it did **not** raise *measured* usability (Grishin & Gillan 2019). The other side:
  **[extracted]** Sonderegger & Sauer 2010 (*Applied Ergonomics*) found a functionally identical but
  *attractive* phone produced **shorter task-completion times.** So treat beauty↔performance as
  *contested*, not a settled null — but don't use looks to excuse a bad flow.
- **[STRONG] Appearance *does* drive trust — a separate axis from usability.** In Fogg et al. 2003
  (Stanford, N=2,684; Prominence-Interpretation Theory), visual "design look" was the single
  most-cited credibility factor — **46.1% of comments, ahead of every content factor.** Looks buy
  *perceived* credibility even where they don't buy measured usability.
- **[RESOLVED — mechanism refuted, direction holds]** "broad-shallow menus beat narrow-deep": the
  *mechanism* ("more alternatives per screen is cost-free") is refuted; the *direction* (moderate
  breadth + shallow depth over narrow-deep) still stands — see §2. *(The old "1.0s flow-of-thought"
  threshold stays unverified as an exact number, but sub-second response is separately evidenced as a
  throughput lever — see §6.)*
- **[CONVENTION] Touch-target gloss, corrected.** Apple's **44×44 pt is the minimum *tappable /
  hit-target* area**; the separate **28 pt** figure is the minimum *visual control footprint* — not a
  relaxation of the touch target, and the two must not be conflated. The real accessibility floors are
  unchanged: **WCAG 2.5.8 = 24 CSS px**, Parhi ≈ **9.6 mm** (§5).

## 9. Honest taste — label, never assert as proven

No verified evidence surfaced for: **60-30-10 colour split · exact line measure · 12-column /
modular-scale grids · Z-pattern · breadcrumbs-vs-not · mega-menus · search-vs-browse defaults ·
dark-mode "better" performance.** Fine as defaults — present them as taste, not fact.
**Colour-emotion** ("blue = trust") returned **zero** verified claims across two runs; treat as taste
and defer to the colour skill.

- **Golden ratio / symmetry — not "no evidence," but evidence *against* them as beauty drivers.**
  People do **not** prefer the golden rectangle (Devlin; Berkeley Haas found a preferred range of
  **1.414–1.732**, not φ). Symmetry raises appeal for *abstract blocks* but **not on real web pages**,
  and it **reverses for art experts** — so this is nearer **[MYTH]** / context-dependent than open.
  **[extracted]**
- **Clickability-cue *strength* is NOT taste** — it's evidenced (NN/g eyetracking; see §6). The flat
  vs. skeuomorphic *style* is free to choose; whether interactive elements still *look* interactive is not.

## 10. Data tables & data grids

**Default: a table is a Tufte object, not a grid.** Most tables exist to be *read and compared*, so
they belong to the data-ink discipline in **[[charting]]**: minimal rules (often none — alignment and
whitespace separate the rows), no zebra-stripe chrome, dense but legible, right-aligned tabular
numerals, a sparkline or bar *inside* a cell where a trend earns it. Style the table that way first.
**[STRONG for data-ink; → [[charting]], [[typography]], [[graphical-perception-and-color]]]**

**Escalate to a data grid (AG Grid, TanStack Table) only when one of these holds:**
- the user **asks for** a filterable / sortable / interactive table, or
- the grid's machinery — **virtual scroll over thousands of rows, multi-column filtering, column
  reorder/resize/pin, inline editing at scale** — adds *substantial* UX value the static table can't.

If neither holds, stay with the Tufte table. A data grid for a 20-row read-only table is overkill:
you pay bundle size, complexity, and an accessibility debt for operations no one uses. **[CONVENTION]**

**[STRONG] The accessibility cost is part of that decision.** A native `<table>` with `<th scope>` is
accessible for free. A data grid renders generic `<div>`s and **must re-earn** it: ARIA
`grid`/`row`/`gridcell` roles, `aria-sort`, and `aria-rowcount`/`aria-colcount` (virtualization means
the DOM holds only the visible rows — the screen reader needs the *real* totals). The keyboard model
is the **composite-widget / WAI-ARIA APG *grid* pattern**: one tab stop, arrow keys move the active
cell, Enter/F2 edits, Esc cancels. Libraries ship this but you must enable it and *test with a screen
reader* — assume it's off until proven on. The plain table avoids all of it; that is another reason
not to reach for a grid casually.

**Even when a grid is justified, design-craft still rules the look and feel — AG Grid yields, not the
reverse.** The library supplies *behaviour* (sort, filter, virtual scroll, inline edit); it does **not**
get to dictate colour, type, spacing, or interaction. Override its defaults to match the design system
**wherever the library allows**:
- **data-ink & density** — hairline or no row rules, a quiet header, density over decoration (→ [[charting]]);
- **palette** — one reserved accent, status as colour **+ icon/word, never hue alone** (→ [[graphical-perception-and-color]]);
- **type** — the project type scale and **tabular, right-aligned numerals** (→ [[typography]]);
- **interaction** — the focus / empty / loading / error states and hit-target sizes from this skill.

AG Grid's default skin — heavy borders, full gridlines, zebra fills, toolbar chrome — is the opposite
of all that; strip it back. Accept a library default **only** where it genuinely can't be restyled — and
treat that friction as one more mark against reaching for the grid in the first place. **The grid is a
behaviour engine; the design is still yours.**

**Once a grid is justified, hold the line on these** (a strong model proposes them unaided — they are
correct; the failure mode is dropping them under deadline):
- **Keep the user oriented:** sticky header; **pin the identity column** (the one that says *which* row
  this is) so it survives horizontal scroll. Unpinned identity at tens of thousands of rows = editing
  the wrong record.
- **Never hide filter/sort state:** show active filters as removable chips and the sort arrow on the
  column. The signature data-grid failure — a filter is on, the user forgot, and reads a subset as the
  whole set. Distinguish the empty states: *"no data yet"* vs *"nothing matches your filter — clear it."*
  **[CONVENTION] (visibility of system status, §5)**
- **Inline edit is explicit or trust erodes:** editable cells look editable, read-only cells inert;
  validate at the cell; show per-cell saving/saved/error; keep the bad value visible (don't silently
  revert); undo over confirm; spreadsheet keys (Enter commit, Esc cancel, Tab next) because people
  expect Excel — recognition over recall.
- **Selection scope unambiguous:** "select all" must say *all 40,000 matching* vs *the rows loaded* —
  bulk edits and deletes ride on this.
- **Persist the user's column layout** (order/width/visibility/sort) with a visible "reset to default."
- **Defaults off:** row grouping, pivot, integrated charts, the full tool-panel sidebar, fill-handle,
  auto-save-per-keystroke — real power features, clutter as defaults; enable them per user, not globally.

**Two calls a model will guess on — decide them on purpose:**
- **Client vs server data.** Keep all rows in the browser while the set *fits in memory and sorts fast*
  — instant sort/filter, simplest code; good to roughly the tens of thousands. Go server-side only when
  the set is too big to ship, unbounded, or streaming — and then say so in the UI, because a filter
  becomes a request, not an instant redraw. *(Engineering judgment, not a fixed number — [taste].)*
- **Pagination vs virtual scroll.** Virtual scroll for *scanning/monitoring* (a blotter, a feed); bounded
  pages or "load more" for *reference* data you cite, link to, or review to completion — pages give a
  sense of place and a stable address. **[taste / contextual]**

## 11. Third-party components & UI kits

The **framework** is agnostic — React, Rails/Hotwire, Vue, Svelte, Next render the page; they impose no
colour, type, or UX. design-craft applies unchanged, and the *code* is **frontend-design**'s job. What
needs judgement is the **components** you pull in, and they split in two:

- **Headless / unstyled** (Radix, Headless UI, React Aria, TanStack Table/Query, Stimulus) — give you
  *behaviour + accessibility* with **no look**. They **cooperate** with design-craft: prefer them, style
  freely. The friendliest path.
- **Styled / opinionated kits** (Material UI, Ant Design, Bootstrap, Chakra; AG Grid's default theme) —
  ship their *own* look and UX defaults. Treat every one like AG Grid (§10):
  1. **Gatekeep** — is the kit's weight and opinion *earned*, or would headless primitives + your own
     styling cost less and look like *you*?
  2. **design-craft governs, the kit yields** — colour → [[graphical-perception-and-color]], type →
     [[typography]], data-ink → [[charting]], layout / states / hit-targets → this skill. Override the
     kit's defaults **wherever it allows**; accept a default **only** where it genuinely can't be
     restyled — and count that friction against adopting it.

**[STRONG] floor regardless:** never assume a kit's default theme clears contrast, focus-visible, and
target-size — *verify it*. A polished-looking kit can still fail the floor.

**The rule in one line:** *frameworks are free; headless libraries cooperate; styled kits must be tamed —
the design is always yours.*

## Patterns the best teams converge on

Distilled from six design-respected sites (recreated in their *verified* palettes — gallery
section H). None of these are [STRONG] science; they're **established best practice / well-executed
taste**. But the convergence is informative — the teams widely held up as "good design" keep
reaching for the same moves:

- **Reserve the accent.** A monochrome or near-monochrome base with one accent held *back* — the
  loudest element is *contrast*, not hue. Vercel keeps its blue out of the flow (the primary button
  is an inverted near-white fill); Aesop and Apple let a single photo or CTA carry all the colour.
  → reinforces §4 + reserved accent. **[CONVENTION / taste]**
- **Let one big headline do the hierarchy.** A large, tight-tracked display headline over a small
  quiet label, on a clean type scale — Apple (80→48px, weight 600), Vercel — beats spreading
  emphasis across boxes, rules, and colour. → type scale + hierarchy. **[STRONG mechanism; the exact
  scale is taste]**
- **Calm by subtraction.** Off-pure neutrals (cream *not* white, charcoal *not* black), `radius:0`,
  no shadow, hairline dividers, whitespace as the separator — Aesop gets ~80% of "quiet and
  expensive" from those four decisions alone. → restraint + whitespace. **[CONVENTION]**
- **An editorial register reads as crafted.** A serif/display voice, a per-item duotone, and a short
  hairline that *leads* into a label — Stripe Press. Use when the content *is* the product.
  → editorial layout + figure-ground. **[taste, well-executed]**
- **Docs = sticky side-nav + quiet divider + reserved accent.** Tailwind: a left rail that scrolls
  independently, a faint gutter rule as the divider, one accent, code blocks with a language chip.
  The reference layout for reference content. → navigation & wayfinding. **[CONVENTION]**
- **Integrate text and graphics.** Narrow prose at a comfortable measure, a chart that breaks
  *wider* to say "now look, don't read," colour reserved for the data, and the takeaway annotated
  *inside* the chart — The Pudding. The bridge to **[[charting]]**. → integrated graphics. **[STRONG
  for text+graphics integration]**

## Applying this (plain language for non-designers)

Most people asking won't know the vocabulary. Reason in the rules; **speak in plain outcomes.** Order:
1. **Pass the floor** — contrast and not-colour-alone. Non-negotiable.
2. **Structure** — conventional skeleton; one clear focal point; nav where people expect it, with an
   active state.
3. **Guide the eye** — one accent for the critical thing; whitespace to group; strong headings.
4. **States & feedback** — design empty/loading/error, not just the happy path; show status.
5. **When you hit a [taste] item, say it's taste** and give a sensible default — don't dress it as a rule.

## Worked gallery

[references/ux-gallery/index.html](references/ux-gallery/index.html) — ~30 interface fragments in the
**same visual system as the charting and colour galleries** (shared palette/type), many showing
*weak vs. better*, grouped: page structure & layout · navigation & wayfinding · grids & alignment ·
guiding the eye · usability heuristics · interaction & states · a real Tufte-styled dashboard that
embeds **actual sparklines, small multiples, and the colour-role status system.** Each captioned with
its evidence and confidence label. Pure HTML/CSS/SVG, zero dependencies, renders offline.

**Real-world exemplars** (gallery section H): key moves stripped from six design-respected sites
and recreated in their *verified* palettes — **Vercel** (monochrome canvas, accent held in reserve),
**Apple** (one giant headline carries the hierarchy), **Aesop** (calm by subtraction: cream-not-white,
`radius:0`, no shadow, hairlines), **Stripe Press** (serif + per-card duotone), **Tailwind** (docs
nav + hatched-gutter shell), **The Pudding** (narrow prose + a chart that breaks out). Same principles
as above, executed by teams that do this well.

## References

- [references/ux-evidence-findings.md](references/ux-evidence-findings.md) — deep-research evidence
  base for UX/interface claims (proven/convention/myth + refuted list + gaps).
- [references/aesthetic-preference-findings.md](references/aesthetic-preference-findings.md) — why
  people intuitively like a UI (processing fluency, prototypicality, first impressions).
- [references/ux-practical-findings.md](references/ux-practical-findings.md) — navigation, inspection,
  targets, attention (the practical gaps the first run left open).
- [references/interface-ux-and-layout-corpus.md](references/interface-ux-and-layout-corpus.md) — the
  **full raw per-agent corpus**: 83 source extractions + 225 adversarial verifications, verbatim from
  ~437 research agents across four workflows (the distilled docs above were synthesised from this).
- **[[charting]]** · **[[graphical-perception-and-color]]** — the sibling skills this composes with.

## Common mistakes

- No **active nav state** / no wayfinding — users can't tell where they are.
- **No focal point** — everything competes; the eye has no entry. (One focal point; reserve the accent.)
- **Happy-path only** — no empty/loading/error states.
- **Designing for the F-pattern** instead of writing strong headings.
- Citing **[taste]** (60-30-10, golden ratio, Z-pattern) as evidence.
- **Misalignment / ad-hoc spacing** — reads as broken even when it works.
- Skipping the **contrast / not-colour-alone floor** as "just accessibility" — it's the one [STRONG] rule.
- A dashboard where **every tile shouts** — no reserved accent, so the real alert can't pop.
- Reaching for a **data grid** when a Tufte-styled `<table>` would do — paying bundle weight + an
  accessibility debt for operations no one asked for; or, having used a grid, leaving its **filter
  state hidden** so users read a filtered subset as the whole dataset.
- Shipping a **styled UI kit's default theme** (MUI, Bootstrap) unchanged — the product ends up looking
  like the library, not like you. Prefer headless primitives + your own styling, or tame the kit.

## Citations (primary)

WCAG 2.1/2.2 (SC 1.4.1/1.4.3/1.4.11; **2.5.8 target size**) · Reber, Schwarz & Winkielman 2004 (fluency) ·
Lindgaard 2006; Tuch 2012; Reinecke 2013 (complexity, first impressions) · Hekkert (MAYA) · Hick 1952 /
Proctor & Schneider 2018 (Hick's law limits) · Fitts 1954; **Soukoreff & MacKenzie 2004** · **Parhi 2006**
(MobileHCI — touch-target minimum) · **NN/g hamburger-menus / hidden-navigation** (visible-nav) · **Jacko &
Salvendy 1996** (broad-shallow) · **Nielsen & Molich 1990** (heuristic eval 3–5); **Faulkner 2003** / **Spool &
Schroeder 2001** ("5 users" variance) · Nielsen (10 heuristics; F-pattern/layer-cake eye-tracking) · Grishin &
Gillan 2019 (aesthetic-usability bound) · **WAI-ARIA Authoring Practices Guide — *Grid* pattern**
(data-grid roles & keyboard navigation). Full detail + refuted/gaps in the reference files
([ux-evidence-findings](references/ux-evidence-findings.md), [ux-practical-findings](references/ux-practical-findings.md),
[aesthetic-preference-findings](references/aesthetic-preference-findings.md)).

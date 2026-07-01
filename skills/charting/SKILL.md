---
name: charting
description: Use when choosing and building charts for the web — picking the right chart form for a question and rendering it as clean, data-ink-minimal SVG. Covers the canonical Tufte forms (sparklines, slopegraph, small multiples, minimal boxplot, dot-dash scatter, range-frame line, Cleveland dot plot, candlestick, tear-sheet, forest plot, bullet graph, calendar heatmap), dense multivariate forms (horizon chart, scatterplot matrix, parallel coordinates, cycle plot), perception-honest forms that clarify the true signal (preattentive pop-out, reference band, gestalt grouping, figure-ground baseline coloring), dashboard compositions (KPI tile row, metric small-multiples board, bullet status panel, inline-graphic data table, composite overview), domain charts (options volatility smile/skew, regression with bands, ML feature importance + SHAP, portfolio positions & risk, VaR & stress), the craft moves that make a chart honest and legible, and a zero-dependency worked gallery. Defers all color/contrast decisions to graphical-perception-and-color. Part of the design-craft toolkit — the orchestrator is the art-director (it sets the theme/feel and coordinates the whole set); all the skills apply together on every piece, this one as a specialist lever.
---

# Charting — Tufte chart forms & craft

## Overview

This skill is about **chart forms and craft**: which graphical form answers a
given question, and how to draw it so the ink is mostly data. It is the "shape"
half of data visualization.

It deliberately does **not** decide color, palette size, background, or contrast
— those are evidence questions answered by **[[graphical-perception-and-color]]**.
When you reach a color or luminance decision here, defer to that skill. (Rule of
thumb it already gives you: encode magnitude by *position* first, *length* next,
*area/color* last; and pick lightness/contrast before hue.)

**Precedence with `frontend-design` (Anthropic) — charting sets the chart, frontend-design builds it.** For anything that *is* a chart or data visualization, this skill is the authority: chart form, data-ink, encoding, honesty, and annotation are design-craft's call and are **not** restyled for aesthetics. `frontend-design` is the production-code implementer — it writes the clean, distinctive code that renders these charts and styles the page *around* them, never the chart marks themselves. It enters a *chart* decision only as a fallback when this skill doesn't cover it (e.g. a bespoke non-analytical data-art piece) or the user asks for a drastic restyle — and even then **chart honesty is an absolute floor**: no truncated bar/area baselines, no area/radius encoding of a single quantity, no dual-axis correlation tricks.

**The interface *around* a chart** — page layout, app chrome, scan order — is **[[interface-ux-and-layout]]**'s call (a sibling design-craft skill), implemented in code by `frontend-design`. Keep the chart marks quiet and data-ink-minimal even when the surrounding page is bold; pointing "make it distinctive" energy at the chart itself is how you get the chartjunk the anti-patterns below forbid. Unlike colour, frontend-design is **not** a hard dependency here — the charts render standalone without it.

Everything below is demonstrated, offline and dependency-free, in the worked
gallery: [references/charts/index.html](references/charts/index.html).

**Full research trail:** the deep-research behind this skill — 9 findings with full statistics, the **3 refuted claims**, and all 24 sources (from a 107-agent run + a 105-agent sibling) — in [references/charting-research.md](references/charting-research.md); the short distilled version is [references/evidence-tufte-principles.md](references/evidence-tufte-principles.md). The **complete raw per-agent corpus** — all 47 source extractions and 150 adversarial verifications, verbatim — is in [references/charting-research-corpus.md](references/charting-research-corpus.md).

## The core moves

These are the moves common to every form in the gallery. They are the skill.

- **Erase non-data ink.** No chart border, no background fill, no heavy
  gridlines, no redundant tick labels. If a stroke isn't carrying data or the
  minimum scaffolding to read data, delete it. *Example:* a price chart needs a
  line and two end numbers, not a four-sided box around it.
- **Range frames & marginal ticks.** Let the axis report the data. Draw the axis
  line only across the data's actual span, and put ticks at the meaningful
  values (min, max, last). Push the per-point distribution onto the axis itself
  as a *rug* of marginal ticks. *Example:* instead of gridlines every 10 units,
  a tick at the lowest reading and the highest tells you the range at a glance.
- **Direct labeling over legends.** Put each series' name next to the series, not
  in a color key the eye has to ferry back and forth. *Example:* in a slopegraph,
  the country name sits at the end of its own line — you never decode a legend.
- **Smallest effective difference.** Make distinctions just visible enough to
  read, no louder. One quiet palette; one accent used for a single idea.
  *Example:* down-days in brick red, everything else gray — not a rainbow.
- **Small multiples.** Repeat one small chart across categories on a *shared
  scale*; the reader learns the design once and then compares nine panels at a
  glance. *Example:* the same little line drawn for each of nine product lines.
- **Sparklines.** Word-sized, axis-free graphics that sit *inline* with text or
  in a table cell, so a trend reads at the resolution of typography. *Example:*
  "glucose drifted up ▁▂▃▅▇ this week" inside the sentence itself.
- **Micro/macro density.** Trust the reader with detail. A dense panel
  (tear-sheet, heatmap, candlestick) shows the overview *and* rewards a close
  look — don't thin the data to make it "clean." *Example:* a returns heatmap
  shows 36 months at once and still lets you find the worst one.

## Choosing the form — decide first, ask only what changes the answer

Selection is the first job; rendering is second. When the user names a form or a
reference, use it. When they don't — "graph this," "show me the numbers" — **read
the data and the request and derive the choice**; don't guess silently, and don't
interrogate.

**Assume zero charting knowledge.** Most users have never heard of Tufte and don't
know chart names — they won't name a form or a reference, and asking them to is
useless. The vocabulary below (task types, form names, gallery #s) is **your**
internal reasoning aid; **never make the user use it.** Ask about their *data and
goal* in plain words, and describe each option by **what it shows and looks like**,
not by its name — say "a ranked bar chart, longest on top," not "a Cleveland dot
plot." Do the charting reasoning yourself; hand the user a plain choice.

### 1. Read the data (derive these — infer, don't assume)

- **Task** — what question is being answered? *comparison · trend over time ·
  distribution · relationship/correlation · ranking · part-to-whole · deviation
  from a norm · flow/spatial.*
- **Shape** — how many variables, and of what type (*categorical · ordinal ·
  quantitative · temporal · geospatial*)? how many series / categories? how many
  data points? is one axis time?
- **Context** — where it lives (*inline in text · a dashboard tile · a report
  figure · print*), glance vs. precise read, expert vs. general audience.

### 2. Task × shape → a shortlist

| If the task is… | …and the shape is… | Lead form(s) |
|---|---|---|
| Trend over time | one series | Range-frame line (#6); inline → Sparkline (#1) |
| Trend over time | many series | Small multiples (#3); very many → Horizon (#13) |
| Compare / rank categories | one value each | Cleveland dot plot (#7) / sorted bars — **never a pie** |
| Distribution & spread | a few groups | Minimal boxplot (#4) |
| Relationship | two variables | Dot-dash scatter (#5); many variables → SPLOM (#14) |
| Part-to-whole | the *total* is the point | Bar; stacked **only** for totals, not inner bands |
| Deviation from a norm | a series vs. a known range | Reference band (#18) / figure-ground (#20) |
| One measure vs. a target | a single KPI | Bullet graph (#11) |
| Many estimates + uncertainty | per-item interval | Forest plot (#10) |
| Headline metrics, at a glance | several KPIs | KPI tile row (#21) + sparklines |
| Seasonal vs. year-over-year | a seasonal series | Cycle plot (#16) |

Context shifts the pick *within* a task: a glance wants tiles + sparklines where an
analyst wants the dense tear-sheet (#9); inline-in-text wants a sparkline where a
dashboard wants small multiples. The full per-form detail is in the catalog below;
this table is the triage *into* it.

### 3. Ask only the questions that change the answer

If a load-bearing fact is missing, ask — the **fewest** questions that move the
choice, not a survey. Highest-leverage, in order:

Phrase them in plain words (your internal mapping is in parentheses — don't say it):

1. **"What's the main thing you want someone to see in this?"** *(→ fixes the task)*
2. **"Is this something changing over time, or separate things you're comparing?"** *(→ line/sparkline vs. bar/dot)*
3. **"Roughly how many things are you showing — a handful, or dozens?"** *(→ single chart vs. small multiples vs. horizon)*
4. **"Do you want a quick visual impression or exact numbers — and where will this go (in a sentence, on a dashboard, in a report)?"** *(→ sparkline/tiles vs. full chart; inline vs. dashboard)*

Two or three of these is almost always enough to land the form. Don't ask all four
if the data already answers some.

### 4. Present 1–3 options, with one clear winner

Don't dump the catalog, and don't silently commit a load-bearing choice. Recommend
**one** form as the likely best, offer **at most two** alternatives, and name the
**single** thing that would flip the pick:

> **My suggestion:** `<plain description — what the chart shows and looks like>` —
> `<one line on why it fits>`.
> Could also work: `<plain description B>` if `<condition>`; `<plain description C>`
> if `<condition>`.
> One thing that would change this: `<the disambiguating question, in plain words>`.

Describe the charts, not their names — "a row of small trend lines, one per
product" reads to anyone; "small multiples" doesn't. (Keep the form name in *your*
head so you can build it; just don't put it in front of the user.)

If the user gives no further detail, **build the suggested chart with sensible
defaults rather than stalling** — and state, in one plain line, the assumption you
made.

## Chart chooser

| You want to show… | Use this form | Gallery # |
|---|---|---|
| A trend inline with text / in a table cell | **Sparkline** (line / bar / win-loss) | 1 |
| How a ranking changed between two states | **Slopegraph** | 2 |
| The same metric across many categories | **Small multiples** | 3 |
| Distribution & spread across a few groups | **Minimal boxplot** | 4 |
| Relationship between two variables + their spread | **Dot-dash scatter** | 5 |
| One time series, latest value emphasized | **Range-frame line** | 6 |
| Ranked values across labeled categories | **Cleveland dot plot** | 7 |
| Price action with traded volume | **Candlestick + volume** | 8 |
| A compact multi-metric performance summary | **Tear-sheet dashboard** | 9 |
| Many estimates with uncertainty intervals | **Forest / interval plot** | 10 |
| One measure vs. a target, with context bands | **Bullet graph** | 11 |
| Magnitude over a period × category grid | **Calendar / matrix heatmap** | 12 |
| Many time series in tiny vertical space | **Horizon chart** | 13 |
| Every pairwise relationship among a few variables | **Scatterplot matrix (SPLOM)** | 14 |
| Patterns across many records over several dimensions | **Parallel coordinates** | 15 |
| Trend *within* a season (year-over-year per month) | **Cycle plot** | 16 |
| One key datum to be found instantly in a field | **Preattentive pop-out** | 17 |
| Deviations from a known normal range | **Reference band** | 18 |
| Clusters that should read as groups at a glance | **Gestalt grouping** | 19 |
| Sign and crossings of a deviation series | **Figure-ground baseline coloring** | 20 |
| A row of headline metrics with trend + delta | **KPI tile row** | 21 |
| Many metrics monitored side by side | **Metric small-multiples board** | 22 |
| Several KPIs vs. targets as a status board | **Bullet / gauge status panel** | 23 |
| A table whose rows need a trend, not just numbers | **Data table with inline graphics** | 24 |
| One screen mixing a headline, tiles, and a heatmap | **Composite overview** | 25 |
| Implied vol across strikes & expiries (skew/smile) | **Options volatility smile** | 26 |
| Holdings by weight vs. their risk contribution | **Portfolio positions & risk** | 27 |
| Tail loss from a distribution and from scenarios | **VaR & stress** | 28 |
| A fitted relationship with uncertainty + residuals | **Regression analysis** | 29 |
| Which model features matter and how they push | **ML feature analysis** (importance + SHAP) | 30 |
| Signed values around a meaningful zero/midpoint | **Diverging color scale** | 31 |
| A trend with events / thresholds called out in place | **Annotated time series** | 32 |

Reach for **position** encodings (dot plot, scatter, slopegraph) before length,
and length before area/color. When the answer needs a color ramp (heatmap,
tear-sheet), hand that decision to **[[graphical-perception-and-color]]**.

## Worked gallery

Open [references/charts/index.html](references/charts/index.html) — thirty-two
hand-authored SVG charts, one quiet palette, zero dependencies, rendering over
plain HTTP. The builder for each (in
[references/charts/tufte-charts.js](references/charts/tufte-charts.js)) is
commented as a copyable reference implementation; the shared theme lives in
[references/charts/tufte-charts.css](references/charts/tufte-charts.css).

To add a chart, replicate the gallery, or run it **behind a firewall / offline**,
see [references/building.md](references/building.md) — the technical contract
(helper primitives, the add-a-chart loop, and online vs. airgapped library use).

1. **Sparklines** — datawords inline + in a table row; no axes, end-dot value.
2. **Slopegraph** — two ranked columns, direct end-labels, declines in accent.
3. **Small multiples** — 3×3 of one line chart, shared y-scale, one labeled axis.
4. **Minimal boxplot** — the box erased; median dot, offset quartile whiskers.
5. **Dot-dash scatter** — range-frame axes carrying marginal rug ticks.
6. **Range-frame line** — axes span only the data; ticks at min, max, last.
7. **Cleveland dot plot** — sorted dots on a common x-scale, faint connectors.
8. **Candlestick + volume** — two panels sharing one x-axis, no grid.
9. **Tear-sheet** — cumulative line + drawdown area + monthly-returns heatmap.
10. **Forest plot** — point estimates + CI whiskers, reference line at zero.
11. **Bullet graph** — measure bar vs. target tick over faint qualitative bands.
12. **Calendar heatmap** — weekday × week grid, single-hue lightness ramp, hover.

### Dense / multivariate (13–16)

Pack maximum data per pixel — micro/macro density without clutter.

13. **Horizon chart** — twelve series folded into intensity bands (negatives in accent); a dozen series in one chart's height.
14. **Scatterplot matrix (SPLOM)** — every pairwise scatter of four variables; diagonal carries the name + a tiny histogram, ticks only on the outer edge.
15. **Parallel coordinates** — six axes, records as thin low-opacity polylines; overplotting reveals density, hover lifts one record.
16. **Cycle plot** — each month's year-over-year subseries against a faint month-mean reference: a trend within a season.

### Perception, used honestly (17–20)

These use visual perception to make the **true signal** easier to see — never to
distort it. No misleading area, no truncated baseline, no rainbow on ordered
data. Each names the perceptual principle it leans on; the **color** rationale
(why the accent hue, what contrast) defers to **[[graphical-perception-and-color]]**.

17. **Preattentive pop-out** — one accent mark in a field of identical muted marks is found before conscious search (pop-out via a single channel).
18. **Reference band** — a shaded normal range as the comparison baseline; only the genuine out-of-range points are drawn in accent.
19. **Gestalt grouping** — identical marks read as three sets purely by proximity / common region (whitespace does the grouping, not color).
20. **Figure-ground baseline coloring** — area above zero in ink, below in accent, so sign and every crossing read as figure against ground.

### Dashboards (21–25)

The same forms, assembled into real panels. Density without clutter; every tile
defers its color choices to **[[graphical-perception-and-color]]**.

21. **KPI tile row** — headline number + inline sparkline + signed delta per metric (delta sign-coded: up ink, down accent).
22. **Metric small-multiples board** — six mini series on one shared scale, each labeled with its current value.
23. **Bullet / gauge status panel** — a stacked column of bullet graphs (measure vs. target over faint bands) as a status board.
24. **Data table with inline graphics** — a real table whose rows carry a trend sparkline and a tiny bar series (datawords in a table).
25. **Composite overview** — one screen: a headline sparkline, a few stat tiles, and a small activity heatmap in a single panel.

### Finance & risk (26–28)

26. **Options volatility smile / skew** — implied-vol curves vs. moneyness for three expiries; the smirk is skew, the U is smile, front month in accent.
27. **Portfolio positions & risk** — weight bars sorted desc with an accent risk-contribution diamond on the *same* scale; the weight→risk gap shows where size ≠ risk.
28. **VaR & stress** — a P&L histogram with VaR/CVaR thresholds and a shaded loss tail, beside a sorted stress-scenario tornado.

### Statistics & ML (29, 30)

29. **Regression analysis** — scatter + OLS line + nested confidence/prediction bands + a residual strip, slope and R² labeled.
30. **ML feature analysis** — sorted importance dots beside a per-feature SHAP beeswarm (position = importance, spread = signed impact, shade = feature value).

### Encoding & annotation (31, 32)

31. **Diverging color scale** — sorted signed values on a diverging scale around a zero reference line; length carries magnitude, hue carries sign.
32. **Annotated time series** — a clean line with events and a threshold labeled directly in place (no legend); range-frame axes.

## Chart catalog — Shows · Key components · Use when

A per-chart index so you can pick and build the right form. Covers all 32 gallery
charts plus the 6 library-backed showcase visuals (38 total).

1. **Sparklines** — **Shows:** a metric's recent shape at word size. · **Data needed:** one short numeric series (per metric/row). · **Use when:** the user asks to show a trend inline with text or in a table cell, at a glance. · **Key components:** inline line/bar/win-loss SVG, no axes, faint min–max band, end dot for the latest value.
2. **Slopegraph** — **Shows:** how ranked values moved between two states. · **Data needed:** a before/after value per item (~5–15 items). · **Use when:** the user asks how items changed or re-ranked between two points in time. · **Key components:** two value columns, one connecting line per item, direct labels both ends, declines in accent.
3. **Small multiples** — **Shows:** one metric's shape across many categories. · **Data needed:** one comparable series per category. · **Use when:** the user asks to compare the same metric's trend across many categories. · **Key components:** 3×3 grid of identical mini line charts, one shared y-scale, only the first panel axis-labeled.
4. **Minimal boxplot** — **Shows:** distribution and spread across a few groups. · **Data needed:** a distribution (or 5-number summary) per group, ~3–8 groups. · **Use when:** the user asks to compare spread/median/outliers across a few groups. · **Key components:** no box — two whisker segments (min–q1, q3–max) with a gap, an offset median dot.
5. **Dot-dash scatter** — **Shows:** a two-variable relationship plus each variable's 1-D spread. · **Data needed:** (x,y) pairs. · **Use when:** the user asks for the relationship between two variables and how each is distributed. · **Key components:** range-frame axes spanning only the data, a marginal rug of ticks on both axes, plain dots.
6. **Range-frame line** — **Shows:** one time series with its latest value emphasized. · **Data needed:** one numeric series over time. · **Use when:** the user asks to show the trend of a single series and call out its current value. · **Key components:** axes spanning only the data extent, ticks at min/max/last, accent end-dot + direct value label.
7. **Cleveland dot plot** — **Shows:** ranked magnitudes across labeled categories. · **Data needed:** N categories × one value. · **Use when:** the user asks which categories are highest/lowest, or to rank items. · **Key components:** sorted rows, one dot per category on a common x-scale, faint dotted connector to the label, value label.
8. **Candlestick + volume** — **Shows:** price action with traded volume. · **Data needed:** OHLC bars + volume over time. · **Use when:** the user asks to chart a security's price action with volume. · **Key components:** two panels sharing one x-axis; OHLC candles (up hollow, down filled accent) over muted volume bars.
9. **Tear-sheet** — **Shows:** a compact multi-metric performance summary. · **Data needed:** a return series (cumulative, drawdown, monthly are derived). · **Use when:** the user asks for a one-glance portfolio/strategy performance summary. · **Key components:** a small grid of cumulative-return line, drawdown area, and a months×years returns heatmap (hover).
10. **Forest / interval plot** — **Shows:** many estimates with their uncertainty. · **Data needed:** an estimate + CI (lo/hi) per item, optional pooled value. · **Use when:** the user asks to compare many estimates/effects with their confidence intervals. · **Key components:** stacked rows, point estimate + CI whisker each, a reference line at 0, a pooled diamond, direct labels.
11. **Bullet graph** — **Shows:** one measure against its target with context. · **Data needed:** a measure, a target, and qualitative thresholds. · **Use when:** the user asks to show a KPI against its goal in one line. · **Key components:** faint qualitative bands, an ink measure bar, an accent target tick, direct value.
12. **Calendar / matrix heatmap** — **Shows:** magnitude over a period×category grid. · **Data needed:** a value per (period × category) cell. · **Use when:** the user asks to spot patterns or outliers across a dense time/category grid. · **Key components:** weekday×week cells, single-hue lightness ramp, axis labels, hover value.
13. **Horizon chart** — **Shows:** many time series in tiny vertical space. · **Data needed:** many (10+) time series in comparable units. · **Use when:** the user asks to compare a large number of time series at once in little space. · **Key components:** each series folded into 3 intensity bands (negatives folded up in accent), one shared band step, direct row labels, hover.
14. **Scatterplot matrix (SPLOM)** — **Shows:** every pairwise relationship among a few variables. · **Data needed:** a table of records × 3–5 numeric variables. · **Use when:** the user asks to explore correlations among several variables at once. · **Key components:** n×n grid of small scatters, diagonal = variable name + histogram, faint cell dividers, outer-edge ticks only, a "how to read" note.
15. **Parallel coordinates** — **Shows:** patterns across many records over several dimensions. · **Data needed:** records × many (6+) numeric dimensions. · **Use when:** the user asks to find clusters or outliers across many dimensions at once. · **Key components:** one vertical range-frame axis per dimension, each record a thin low-opacity polyline, hover lifts one to accent.
16. **Cycle plot** — **Shows:** a trend within a season. · **Data needed:** a seasonal series over multiple cycles (e.g. months × years). · **Use when:** the user asks to separate the seasonal pattern from the year-over-year trend. · **Key components:** per-month subseries lines across years, a faint month-mean reference per slot, months left→right.
17. **Preattentive pop-out** — **Shows:** one key datum found instantly in a field. · **Data needed:** many marks + one flagged key item. · **Use when:** the user asks to make a single value stand out / be found instantly. · **Key components:** a field of identical muted open marks, exactly one accent-filled mark, a collision-avoided direct label.
18. **Reference band** — **Shows:** deviations from a known normal range. · **Data needed:** a series over time + a known normal range (lo/hi). · **Use when:** the user asks to flag where a value goes outside its expected/normal range. · **Key components:** a shaded normal-range band, the series line, points/segments outside the band in accent.
19. **Gestalt grouping** — **Shows:** clusters that should read as groups. · **Data needed:** (x,y) points with a group label. · **Use when:** the user asks to show that data falls into natural clusters. · **Key components:** well-separated clusters, a faint shared tone (ellipse) per group, identical ink marks (grouping by proximity, not color), cluster labels.
20. **Figure-ground baseline coloring** — **Shows:** sign and crossings of a deviation series. · **Data needed:** a signed series over time (deviations from zero). · **Use when:** the user asks to emphasize positive vs. negative runs and where a series crosses zero. · **Key components:** area filled to a zero baseline, above in ink and below in accent, split at exact zero crossings.
21. **KPI tile row** — **Shows:** a row of headline metrics with trend and change. · **Data needed:** per metric a current value, a short series, and a delta. · **Use when:** the user asks for a dashboard header of headline numbers. · **Key components:** tiles, each a big number + inline sparkline + signed delta (up ink, down accent).
22. **Metric small-multiples board** — **Shows:** many metrics monitored side by side. · **Data needed:** several time series in comparable units. · **Use when:** the user asks for a board monitoring many metrics side by side. · **Key components:** a grid of mini time-series on a shared scale, each labeled with its current value, accent end-dot.
23. **Bullet / gauge status panel** — **Shows:** several KPIs vs. targets as a status board. · **Data needed:** several (measure, target, bands) rows. · **Use when:** the user asks for a status board of KPIs against their targets. · **Key components:** a stacked column of bullet graphs (bands + measure bar + target tick), direct value labels.
24. **Data table with inline graphics** — **Shows:** a table whose rows need a trend, not just numbers. · **Data needed:** rows with numeric columns + a per-row series. · **Use when:** the user asks for a table that also shows each row's trend. · **Key components:** a real HTML table with an inline trend sparkline and a tiny bar series per row plus numeric columns.
25. **Composite overview** — **Shows:** one dashboard screen mixing forms. · **Data needed:** a headline series + a few stats + a grid of values. · **Use when:** the user asks for a single-screen dashboard mixing a trend, tiles, and a heatmap. · **Key components:** a headline range-frame sparkline, a few stat tiles, and a small activity heatmap in one panel.
26. **Options volatility smile / skew** — **Shows:** implied vol across strikes and expiries. · **Data needed:** implied vol by strike/moneyness for one or more expiries. · **Use when:** the user asks to show option skew/smile or the vol term structure. · **Key components:** IV-vs-moneyness curves (one per expiry), an ATM reference line, front month in accent, direct expiry labels, range-frame axes.
27. **Portfolio positions & risk** — **Shows:** holdings by weight vs. their risk contribution. · **Data needed:** per holding a weight % and a risk-contribution %. · **Use when:** the user asks to compare position size against risk contribution (where size ≠ risk). · **Key components:** weight bars sorted desc, an accent risk-contribution diamond on the same scale, a dotted weight→risk gap connector, direct w%/risk% labels.
28. **VaR & stress** — **Shows:** loss risk from a distribution and from scenarios. · **Data needed:** a P&L return distribution + scenario impact values. · **Use when:** the user asks to show tail loss (VaR/CVaR) and stress-scenario sensitivities. · **Key components:** a P&L histogram with VaR + CVaR lines and a shaded loss tail, plus a sorted stress-scenario tornado (gains ink, losses accent), direct VaR/CVaR labels.
29. **Regression analysis** — **Shows:** a fitted linear relationship with uncertainty and fit quality. · **Data needed:** (x,y) pairs + a fitted model. · **Use when:** the user asks to show a regression fit, its uncertainty, and residuals. · **Key components:** scatter + OLS line, nested confidence/prediction bands, a residual strip sharing the x-axis, direct slope/R² label.
30. **ML feature analysis** — **Shows:** which features matter and how they push predictions. · **Data needed:** per-feature importance + per-row SHAP values. · **Use when:** the user asks which model features matter and in which direction they push predictions. · **Key components:** sorted importance Cleveland dots (most important on top) beside a per-feature SHAP beeswarm (x = signed impact, shade = feature value), zero line.
31. **Diverging color scale** — **Shows:** signed values around a meaningful midpoint. · **Data needed:** a signed value per category (positive/negative around zero). · **Use when:** the user asks to compare surpluses vs. deficits / above vs. below a target. · **Key components:** sorted horizontal bars from a zero reference line, length = magnitude, a diverging two-hue scale for sign (surplus vs. deficit), direct value labels.
32. **Annotated time series** — **Shows:** a trend with key events and thresholds called out in place. · **Data needed:** one numeric series over time + a few dated events/thresholds. · **Use when:** the user asks to mark events ("launch", "incident") or a target line directly on a trend. · **Key components:** a clean range-frame line, a dashed threshold line labeled in place, event markers on the line with short stems and direct labels (no legend).

Showcase visuals (library-backed; see [references/showcase/index.html](references/showcase/index.html)):

33. **Trade-flow globe** — **Shows:** global trade balances + bilateral flows on a rotatable globe. · **Data needed:** per-country net balance + bilateral flow volumes + country geometry. · **Use when:** the user asks to show trade surplus/deficit and flows between countries geographically. · **Key components:** outline globe, diverging country tint, flow arcs, click-to-focus readout.
34. **3D scatter** — **Shows:** cluster structure in three quantitative dimensions. · **Data needed:** (x,y,z) points (+ optional cluster label). · **Use when:** the user asks to show clusters in three dimensions that 2D hides. · **Key components:** three.js + OrbitControls, ~300 points in three colored Gaussian clusters, labelled x/y/z axes, orbit to rotate.
35. **3D surface** — **Shows:** a continuous height field z = f(x, y). · **Data needed:** z values over an (x,y) grid. · **Use when:** the user asks to show a surface, terrain, or a smooth two-input function. · **Key components:** three.js + OrbitControls, a grid mesh height- and light-shaded, a faint wireframe overlay.
36. **File relationship network** — **Shows:** how files reference one another. · **Data needed:** nodes + edges (+ node attributes like directory/in-degree). · **Use when:** the user asks to show how items reference or connect to each other. · **Key components:** vis-network force-directed graph, nodes = files colored by directory and sized by in-degree, edges = references, hover fades non-neighbors.
37. **Radial sunburst (flat SVG)** — **Shows:** a nested hierarchy's size breakdown. · **Data needed:** a tree of (name, size, children). · **Use when:** the user asks to show part-of-whole across a hierarchy (directory sizes, taxonomy). · **Key components:** hand-built SVG annular sectors, ring = depth, angle = size, branch hues, hover isolates a branch — deliberately 2D for non-spatial hierarchical data.
38. **Agent run timeline** — **Shows:** a live token-consumption monitoring timeline (the full-color animated counterpart to the static port removed from the vanilla gallery). · **Data needed:** timestamped events with magnitude + state (active/error/heartbeat). · **Use when:** the user asks for a real-time monitoring view of agent/system load over time. · **Key components:** heartbeat markers, a breathing live pulse, a hard-kill reference line, token magnitude over time — rich and animated, hence library-backed.

## Showcase (library-backed)

A richer companion to the zero-dependency Tufte gallery, in
[references/showcase/index.html](references/showcase/index.html). These visuals
intentionally depart from the gallery's flat-SVG minimalism and use 3D **only
where the data is genuinely spatial or relational** — never as decoration on
2D data. All libraries are vendored locally; the page fetches nothing at runtime.

1. **Trade-flow globe** — three.js + OrbitControls: faint country borders on a restrained dark sphere; ~31 economies tinted by net trade balance on a diverging scale; thin great-circle flow arcs weighted by volume; rotate + click a country to focus its flows, partners, and balance.
2. **3D scatter** — three.js + OrbitControls: ~300 points in three colored clusters with labelled axes.
3. **3D surface** — three.js + OrbitControls: a height field z=f(x,y) over a grid, height- and light-shaded.
4. **File relationship network** — vis-network: a force-directed graph of files (nodes) and references (edges), colored by directory, sized by in-degree.
5. **Radial sunburst** — hand-built SVG (flat on purpose): a nested directory tree, ring = depth, angle = size, hover to isolate a branch.
6. **Agent run timeline** — a faithful, full-color animated reproduction of a live token-consumption monitoring timeline (heartbeat markers, live pulse, hardkill line); rich and animated, hence in the showcase.

## Anti-patterns — what not to do (and the fix)

⚠️ **The ✗ patterns below are DELIBERATELY WRONG** — shown only to be recognized
and avoided. **NEVER reproduce a ✗ pattern.** Each is paired with the ✓ correct
version; when building a chart, always use the ✓ pattern. These charts live in a
visually distinct red-bordered section at the bottom of
[references/charts/index.html](references/charts/index.html) (builders named
`buildDont*` / `buildDo*`), and they are deliberately **kept out of the
chart-chooser and catalog above** so they are never selected as a usable form.
Evidence: [references/evidence-tufte-principles.md](references/evidence-tufte-principles.md).

1. **Truncated y-axis** ✗ → **zero baseline** ✓.
   - ✗ **Wrong:** starting the bar axis above zero. **Why:** a non-zero baseline reliably inflates the *perceived* magnitude of the differences — near-equal bars look dramatically different (Correll, Bertini & Franconeri 2020; Yang et al. 2021). Break-marks/fades do **not** fix it (Correll 2020).
   - ✓ **Right:** start the bar axis at **zero**; the bars read as the ~equal values they are.
2. **Bubble sized by radius** ✗ → **sized by area (or use position)** ✓.
   - ✗ **Wrong:** setting circle **radius ∝ value**, so area grows with value² and big values are exaggerated ~quadratically (Pandey et al. 2015; Tufte's Lie Factor).
   - ✓ **Right:** set **radius ∝ √value** so *area* is proportional to value — better still, put the value on a **position axis** (the most accurately decoded channel).
3. **Dual y-axis manufacturing a correlation** ✗ → **two small panels (or index both to 100)** ✓.
   - ✗ **Wrong:** two series on two independently-scaled y-axes; the apparent "tracking" is an artifact of axis choice, not the data.
   - ✓ **Right:** give each series its **own small panel** on its own scale, or **index both to 100** — nothing forces a shared frame, so no spurious correlation.
4. **Pie chart for comparison** ✗ → **sorted bars / dot plot** ✓.
   - ✗ **Wrong:** encoding values as pie slices when the reader must *rank or compare* them. **Why:** angle and area are near the *bottom* of the perceptual hierarchy (Cleveland & McGill 1984), so near-equal slices can't be ordered by eye, and a color legend forces back-and-forth ferrying. Worse with many slices or 3D.
   - ✓ **Right:** put the values on a **common length scale** — sorted bars or a Cleveland dot plot — where the ranking reads instantly and each value is labeled directly.
5. **Stacked bars to compare the inner series** ✗ → **grouped bars / small multiples** ✓.
   - ✗ **Wrong:** stacking series when the reader needs to compare a *middle* one across categories. **Why:** only the bottom segment shares a common baseline; inner segments float on a shifting base and are decoded as *unaligned* lengths — the less-accurate case in Cleveland & McGill.
   - ✓ **Right:** **grouped bars** or **small multiples** put every series on a shared zero baseline, so each series' across-category pattern reads directly. (Stacking is fine for part-to-whole *totals* — just not for comparing the inner bands.)
6. **Inverted / flipped axis** ✗ → **conventional orientation, labelled** ✓.
   - ✗ **Wrong:** running the value axis in reverse (e.g. a "deaths" line that climbs *downward*). **Why:** readers decode the *shape*, not the ticks — an inverted line-area chart made **~79% of viewers draw the opposite conclusion, vs 2.5% for the control** (Pandey et al. 2015), and inverted axes are among the strongest real-world deceivers (Rho et al. 2024).
   - ✓ **Right:** keep the conventional up-is-more orientation; if a reversed scale is genuinely required, label it unmistakably and drop the area fill.
7. **Aspect-ratio manipulation** ✗ → **honest ratio; bank to ~45°** ✓.
   - ✗ **Wrong:** stretching or squashing a line chart to exaggerate or flatten a trend. **Why:** aspect-ratio distortion was the **single strongest distortion measured** in the research corpus (r=0.66, beating truncation's 0.37 and radius' 0.34; Pandey et al. 2015).
   - ✓ **Right:** choose height:width honestly — Cleveland's **"banking to 45°"**: set the ratio so the average line segment slopes ≈45°, which maximizes slope discrimination (Heer & Agrawala 2006).
8. **Irregular time-axis spacing** ✗ → **equal spacing per unit time** ✓.
   - ✗ **Wrong:** placing time points at unequal x-spacing (skipping gaps, bunching recent points). **Why:** irregular x-axis spacing was the **top deceiver among 14 graph types** (odds ratio ~15, far exceeding 3D or truncation; Rho et al. 2024).
   - ✓ **Right:** space the axis by real elapsed time (a true time scale), so slope and rate read truthfully.

### What the evidence refuted — don't overstate the rules above

Three popular framings **failed adversarial verification** and are deliberately *not* claimed here (full verdicts in [references/charting-research.md](references/charting-research.md), Part 9):
- The clean **"bars need zero, but lines & dot plots don't" dichotomy** failed (1-2). The zero-baseline default holds for **length-encoded bars** (anti-pattern #1); for **line charts specifically** it is unsettled — don't state "lines never need a zero baseline" as fact.
- Truncation's **task-dependence is real** (Long & Kay 2024 — gap-comparison tasks are unharmed), but "designers *should* truncate when the task allows" is **not** a settled prescriptive rule (refuted 0-3). Honesty stays the floor.
- Chartjunk's cost is **conditional** (time pressure, dataset size; Li & Moacdieh 2014) — don't claim embellishment is "cost-free." This is exactly why data-ink minimalism is labelled **[CONVENTION]**, not law.
- **Embellishment measurably *hurts* precise comparison** — in relative-magnitude tasks *every* embellishment except below-zero bars raised reading error vs plain bars, **including merely rounding the bar tops** (Skau, Harrison & Kosara 2015); the cost is task-specific (absolute single-bar reading is only hurt by area-encoding). So "[CONVENTION]" cuts both ways: decoration is *not* free for tasks that need accurate reading.
- **"Chartjunk aids memory" is image *recognition*, not comprehension** — memorability rises with embellishment and density (Borkin et al. 2013), but the authors are explicit it's recognition of the *image*, not understanding, and may interfere with it. Don't cite it to justify decoration on an analytical chart.

### Evidence notes from the deep-research corpus (some extracted, not vote-verified)

Beyond the labels above, the full corpus ([references/charting-research-corpus.md](references/charting-research-corpus.md)) surfaced findings worth carrying — a few adversarially **[upheld]**, several primary-sourced **[extracted]** claims not put to the verification vote:
- **Sparklines are measured, and it's mixed** (not "unvalidated"): an inline sparkline gave **no accuracy gain over text alone**, but its information was *more salient* — when text and graphic conflicted, readers took the sparkline's answer far more often (Goffin et al. 2015). Use them for glanceable salience, not precise reading.
- **Data density has a measured floor ≈24px** [upheld]: value-estimation error is flat above ~24px and rises linearly below it, and ~24px *minimized* estimation time (Heer, Kong & Agrawala 2009, *Sizing the Horizon*). Bigger isn't better — but don't shrink a data-bearing chart below ~24px tall.
- **For clutter, organization beats raw density** [extracted]: high density roughly doubled search time, but *organization* predicted misses more strongly than density did (Moacdieh & Sarter 2017). Layering/arrangement is the dominant lever — a hedge on the "trust the reader with detail" move above.
- **Annotation: more is preferred, and placement by type matters** [extracted]: readers preferred the most-annotated charts (no clutter penalty), and uptake depends on placement — facts by the axis, statistics at the data point, trend statements in the title; mismatch cut uptake ~11× (Stokes, Hearst et al.). Extends "direct-label over legend."
- **The one dashboard data-ink test is confounded** [weak]: high-data-ink displays gave faster out-of-range detection on a live monitor (Blasio & Bisantz 2002), but the high-ink display was a numeric table vs gauges — so treat dashboard data-ink as still unvalidated.
- **Context — most real-world chart deception is *not* a visual trick** [extracted]: in misleading COVID-chart posts, only ~11% violated design guidelines and <1% involved actual visual misreading; deception ran through framing/reasoning (CHI 2023). The honesty floor prevents a real but minority slice of harm — necessary, not sufficient.

## References

Each link is described by the chart type(s) it covers.

1. <http://motioninsocial.com/tufte/> — every Tufte minimal form in one R page: **minimal boxplot, range frame, dot-dash scatter, slopegraph, sparklines**. The best single overview of the craft moves above.
2. <https://charliepark.org/slopegraphs/> — the definitive **slopegraph** explainer (before/after ranked comparison): when to use it, why it works, how to lay it out.
3. <https://jrnold.github.io/ggthemes/reference/theme_tufte.html> — a minimal-ink chart **theme** (no border, no grid, range-frame axes); applies to *any* chart type, not one form.
4. <https://ibecav.github.io/CGPfunctions/articles/Using-newggslopegraph.html> — a **slopegraph** implementation with automatic direct end-labeling (the "no legend" move, mechanized).
5. <https://r-graph-gallery.com/web-time-series-and-facetting.html> — **small multiples / faceted time series**: faceting one design across categories on a shared scale.
6. <https://github.com/htmlwidgets/sparkline> — inline **sparklines**: line, bar, win/loss (tristate), box, and bullet variants.
7. <https://github.com/lnxgrl/matplotlib_tufte> — a Tufte data-ink **style sheet** for matplotlib; the data-ink-minimal treatment for *any* chart type.
8. <https://github.com/ahupp/etframes> — **range-frame axes and dot-dash (marginal rug) scatter** plots, ported to matplotlib.
9. <https://github.com/ranaroussi/quantstats> — a portfolio **tear-sheet**: dense multi-panel performance report including the **monthly-returns heatmap**.
10. <https://quantopian.github.io/pyfolio/notebooks/single_stock_example/> — the canonical **tear-sheet** layout (cumulative returns, drawdown, rolling stats, monthly **heatmap**).
11. <https://github.com/matplotlib/mplfinance> — **candlestick / OHLC** charts with stacked **volume/indicator panels** sharing one x-axis.
12. <https://github.com/perspective-dev/perspective> — a dense streaming **pivot grid + heatmap** for high-volume tabular data (the micro/macro density case at scale).
13. <https://python.arviz.org/projects/plots/en/stable/gallery/> — Bayesian plots: **forest plots** (interval small-multiples), posterior densities, and ridge plots.
14. <https://rstudio.github.io/tufte/> — the Tufte handout **layout** (sidenotes, margin figures); document typography that informs chart **captions and labels**, not a chart form itself.

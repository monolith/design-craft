# design-craft — direction parameters & orchestrator question protocol (design)

> Design working-doc produced by a 14-agent review workflow (2026-07-01): mapped every specialist
> skill's real "levers", designed a parameter schema + orchestrator elicitation protocol against that
> map, and adversarially checked it. This is the source of record for the parameter work; the
> distilled decision lives in the conversation. Not yet implemented in `agents/dc-orchestrator.md`.

## Review summary — what exists vs the gap

**Already there.** `dc-orchestrator` Step 1 *proposes* a free-form prose "direction" over four axes
(genre/reference-world, mood, positioning, the feeling the viewer leaves with) and stops for confirm/
redirect; Step 2 derives a structural signature, assigns each `dc-*` agent a weight, and names ONE
goal-matched leading agent (luxury→branding, poster→composition, data→charting, app→layout,
adopt→brand-absorption). Four floors are absolute; a deference map resolves collisions; a scored loop
refines to a gate. The **underlying levers are already rich** — every specialist exposes concrete,
mood-sensitive dials. The machinery to *execute* precise direction exists.

**The gap Anatoly is closing.** There is no **parameter vocabulary** and no **elicitation protocol**.
Today the user *reacts* to a paragraph the orchestrator writes; he cannot proactively *give* precise
direction ("luxury / corporate / mystical", "denser", "warmer", "own gold") through named dials, and
the orchestrator has no scripted way to *ask* for them in language a non-designer answers. He wants
both: (a) parameters he can set, (b) the orchestrator asking the right questions — plain English,
concrete examples — where **every parameter binds to a real specialist lever** (a decorative dial no
one reads is a defect) and **floors are never parameters**.

## The load-bearing idea — two axes, not one

- **Purpose = the job** (dashboard / poster / app / logo / marketing / adopt-a-brand). This picks
  **which specialist leads**.
- **Mood = the feel** (luxury / corporate / mystical / …). This **colours every specialist's brief**
  but does not change who leads.

**Rule: goal picks the lead, mood colours everyone.** A luxury dashboard is still *charting-led*, just
with a luxury brief (airy, one deep-gold accent, protect-the-feel ON) — NOT branding-led. Mood may flip
the lead only on brand-forward/marketing artifacts.

**Mood is a preset**: one word pre-fills every finer dial and biases the weights, so the user can answer
in one word *or* fine-tune on top. That is how you get precise direction without a 20-question intake.

## Parameter set (tiered; each dial names the lever it drives)

### CORE (always asked)
| Dial | Options | Binds to |
|---|---|---|
| **purpose** (artifact + brand-source fork) | data-report/dashboard · poster/cover/editorial · app/tool/form · brand/logo identity · marketing/landing · **adopt-existing-brand** | Step-2 leading-agent pick; layout page-pattern + nav; charting form-family + whether a chart belongs; developing-style objective emphasis. `adopt-existing` IS the brand-absorption activation gate. |
| **mood** | luxury · corporate · mystical · brutalist · editorial · playful · (free word) | developing-style name-the-feel + protect-the-feel; branding mood→Aaker (gates saturation/value/hue/B&W/symmetry/typeface-completeness); colour register/temp/ground/accent seed; type kit+expressiveness; layout ornament; composition clarity↔mystery; developing-style hand. **Sets the default for every dial below.** |

### REFINING (one-tap, preset-defaulted)
| Dial | Options | Binds to |
|---|---|---|
| **density** | airy · balanced · dense | layout whitespace; charting glance↔analyst + annotation; composition active-space; type leading+measure. *Bounded by real content volume.* |
| **distinctiveness** | safe/familiar · balanced · ownable/unlike-anything | developing-style convention↔deviation + deviation-dose (ownable → runs the full invent-a-style method); branding differentiate↔conform + congruity + descriptiveness + typeface-completeness; composition grid stated↔ghost↔broken; layout headless↔kit; developing-style hand-bend. *Bounded by novel-AND-coherent.* |
| **energy** (volume) | calm · balanced · loud | developing-style restraint↔boldness; composition scale-drama + axis energy; type display expressiveness. *(colour bindings removed — see fixes)* |

### ADVANCED (optional expert bundle; each rides the preset default)
warmth (warm/neutral/cool) · ground polarity (light/dark) · colour-intensity (muted/modest/vivid) ·
signature accent hue · type voice (quiet/some/expressive) · material-ornament (minimal/some/rich) ·
read-depth (instant/layered) · distinctiveness-source (unfamiliar domain — only if distinctiveness=ownable).
Full `binds_to` per dial recorded in the workflow output (see below).

## Preset library (mood → dial bundle + leading agent)

- **luxury** — *Rolex on black velvet.* airy · calm · warm · cream ground (never pure white) · muted-reserved single deep-gold · expressive serif (body stays quiet) · rich ornament · Aaker=sophistication · complete typeface (trust intact). Lead: branding (flips to charting for a luxury dashboard, luxury brief).
- **corporate** — *bank's quarterly PDF.* balanced · calm · cool · off-white · modest blue/cyan · quiet-neutral · minimal (strict data-ink) · Aaker=competence · conform to category leader. Lead: charting (report) / layout (app).
- **mystical** — *tarot card / niche perfume.* airy · dark ground (accent brightened to clear AA) · cool violet/indigo · expressive · rich-atmospheric (ornament AS signature) · read-depth=layered · ownable (full invent method) · Aaker=sophistication+excitement. Lead: composition.
- **brutalist** — *xeroxed punk flyer.* dense · loud · heavy grotesque/mono · exposed structure · one loud accent or mono · Aaker=ruggedness · extreme scale drama. Lead: composition.
- **editorial** — *Vogue spread.* airy, one dominant hero · balanced-to-loud · warm off-white · expressive display + reading body · Aaker=sophistication/sincerity. Lead: composition + typography.
- **playful** — *kids' learning app.* balanced · loud · warm · vivid-saturated (the sanctioned exit from the muted default) · friendly rounded · Aaker=excitement+sincerity. Lead: layout (app) / composition (graphic).

## Question protocol (non-designer phrasing, concrete examples)

1. **What are we making — fresh look or match an existing brand? And what MUST appear?** → purpose + brand-fork + content contract. *(dashboard vs movie poster vs settings screen vs logo; "redo Coca-Cola's page so it still reads as Coke" = match. If MATCH → collect artifacts, brand-absorption leads, SKIP taste questions.)* **not skippable**
2. **Which vibe is closest? Pick one word — we fine-tune after.** → mood preset. *(Aesop=luxury, bank=corporate, tarot=mystical, punk poster=brutalist, magazine=editorial, kids app=playful.)* **not skippable**
3. *(skippable)* **Room to breathe, or pack it in?** → density *(Apple page vs Bloomberg terminal; real content volume overrides the vibe).*
4. *(skippable)* **Safe & familiar, or unmistakably its own thing?** → distinctiveness *(banks look alike on purpose vs Liquid Death).*
5. *(skippable)* **Calm, or loud & energetic?** → energy *(spa site vs flash-sale banner).*
6. *(optional expert)* **Fine-tune details or take the preset?** → the advanced bundle, each shown with its preset default to confirm or nudge.
7. **Playback: "[artifact] · [mood], [energy], [density], [distinctiveness], [warmth/ground] — led by [agent]. Build, or change one thing?"** → LOCKS, or redirects a single dial. **not skippable**

**Stop rule.** Stop asking the moment the direction is stateable in one sentence and confirmed (~6
substantive questions max). If the user says **"you pick"** at any point, fill all remaining dials from
the preset and jump straight to the Q7 playback — never interrogate a delegating user. Forced core = 2
substantive + 1 confirm.

## Propagation (answers → build)

- **Leading agent** from *purpose* (the job), pinned top weight + strictest ≥9 gate. `adopt-existing` →
  brand-absorption leads, captures mood/distinctiveness/hand/colour/type from real artifacts; its Brand
  Direction overrides the preset and binds everyone; developing-style yields.
- **Mood** raises secondary weights and fills every dial default; **refining dials** scale their
  specialists; **distinctiveness=ownable** authorizes developing-style's full invent-a-style method.
- **dc-orchestrator writes ONE shared brief** from the FINAL dial values — a named line per specialist.
  Every dial lists its consumer, so a dial no one reads is a defect.
- **mood→Aaker** translation is mandatory before briefing branding (luxury→sophistication;
  corporate→competence; mystical→sophistication+excitement; brutalist→ruggedness;
  editorial→sophistication/sincerity; playful→excitement+sincerity), with guard mappings
  (layered→abstract+incomplete-typeface but blocked for finance/health/legal; loud+exciting→asymmetric;
  reserved+luxury→low-sat/B&W for status; safe→conform / ownable→differentiate).
- **charting stays mood-deaf**: it reads only density, which idea gets the accent, annotation richness,
  form-family. Mood lives *around* the chart (page, frame, colour, type), never in the geometry —
  honesty + data-ink are floors.
- **Floors** (AA contrast + never-colour-alone + CVD-safety · chart honesty · legibility + tabular
  figures + measure · focus-visible + ≥44px + zoom) are never dials, never spoken as choices, and
  re-test every token against the *actual* ground after any warmth/ground/colour change.

## Adversarial check — verdict NEEDS-FIXES, top fixes to fold in

1. **Split colour OUT of `energy`.** `energy` and `colour-intensity` both write saturation/spend/accent-
   reserve — a double-write, and to a non-designer "loud" and "vivid" are the same question.
   colour-intensity owns colour; energy keeps only restraint↔boldness + type-expressiveness + composition
   emphasis.
2. **Don't let `energy` over-merge scale-drama + axis.** energy=calm currently forces gentle hierarchy,
   which kills luxury's "one monumental hero on a quiet field" (the Monolith). Let mood presets pin
   composition scale-drama and axis independently.
3. **De-conflict `read-depth` vs `distinctiveness` on branding.** Both write descriptiveness +
   typeface-completeness. Give those to distinctiveness alone; read-depth owns clarity↔mystery +
   naturalness/sign-type.
4. **Add a short brand-path branch** (purpose = brand/logo): ask the 3 branding gates mood→Aaker does
   NOT cover — communication objective (recognition vs affect vs high-image), brand familiarity
   (new vs established), category valence/structure (negative category? dominant leader? hedonic vs
   utilitarian). Half of branding's levers otherwise fire on guesses (e.g. a negative-valence brand
   wrongly gets a descriptive mark).
5. **Keep deviation-latitude** (strict facelift vs loose refresh) in the adopt-existing flow — a user
   call, not artifact-readable; must not be dropped by "skip the taste questions."
6. **Delete the "explicit user override can touch a floor" clause.** Floors are absolute at every
   setting, override included.
7. **Make refining Q3–5 genuine one-tap preset-accepts** and label Q6 as the 7-dial bundle it is, so
   forced core stays at 2 and the engaged path never exceeds ~5 before confirm.

## Orchestrator edits (deferred until direction is locked)

Edit `agents/dc-orchestrator.md`: (A) add two non-negotiables (direction via parameters; every param
binds to a lever + floors never params); (B) replace Step-1 free-prose-first with the tiered dial table
+ preset library + question protocol + propose-then-confirm/stop rule/adopt-existing branch, keeping the
four-axis paragraph as the interview's *output*; (C) retitle Step 2 to derive from confirmed dial values
+ add the dial→brief propagation table + mood→Aaker block + weight-scaling + brand-absorption override +
charting-is-mood-deaf reminder; (D) add "floors are never dials" clause; (E) `dc-orchestrator.md` gets a
step-0 "consume the confirmed dials, write one shared brief with a named line per specialist, verify
every dial has a consumer before dispatch."

*Full per-dial `binds_to`, the three design angles (minimal/expressive/interview-ux), and the raw critic
output are in the workflow task result (run wf_364d5602-aeb).*

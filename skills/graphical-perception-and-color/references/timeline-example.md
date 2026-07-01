# Worked example — agent-run trace timeline

One real UI with this skill's rules applied. Read it for the **reasoning**, not the
palette: the value of each choice is the rule it satisfies, not the hex code. Copying
our colors into a different chart, on a different background, would break the very
contrast guarantees that make them correct here.

Source of the snippets below: `app/assets/stylesheets/application.css` in the
trace-timeline dashboard (the `/timeline` and tree views).

The UI ships two themes from one set of CSS variables: a **dark** default and a
**paper** (light) theme scoped to the timeline page. Several examples below are about
what flipping between them forced us to re-check — which is exactly where the skill
earns its keep.

---

## 1. Magnitude is encoded by length, never by color or area — §1 [STRONG]

Each root row carries a thin per-root cost bar:

```css
/* cost bar: a thin length-encoded magnitude cue per root (length is the most
   accurately-decoded channel — Cleveland & McGill). Quiet by design, not chartjunk. */
.root-row .cost-bar span { display: block; height: 100%; background: #5b6b7a; }
```

- **Rule:** position-on-a-common-scale > **length** > … > area > color. Length is near
  the top of the perceptual hierarchy; area and color are the bottom.
- **Why it's right:** the bar's *width* carries the number, so the eye reads it
  accurately. The fill color (`#5b6b7a`) is a single quiet slate — it carries *nothing*,
  by design. We did not size a dot by token count or tint it hotter for "more"; either
  would have pushed a primary quantity onto a channel the skill ranks worst.

## 2. Severity is never carried by color alone — WCAG 1.4.1 [STRONG]

Token chips and I/O-size warnings escalate across **four** redundant channels:

```css
.tok.iosize-warn        { background: #f59e0b; color: #1a1206; }   /* hue   */
.tok.iosize-alert-bold  { font-weight: 700; }                      /* weight */
.tok.iosize-alert-pulse { animation: tokpulse 1.3s ...; }          /* motion */
.tok.tok-na             { background:#2a3038; color:#8b94a1; }      /* "no data" ≠ a number */
```

- **Rule:** never let hue be the *only* differentiator (WCAG 1.4.1, *Use of Color*).
- **Why it's right:** a red-green colorblind viewer (≈8% of men, §4) still sees the
  escalation — the **number itself is always printed**, weight increases, and the worst
  tier pulses. The `tok-na` chip is a separate case worth copying: missing per-turn data
  is shown as a *muted chip*, not a zero, so "we don't know" never masquerades as "none."

## 3. We flipped the background and re-derived every color — §5 [STRONG]

This is the skill's own *Common mistakes* entry — "tune colors for dark, flip the
background, leave them washed out" — caught before it shipped. The entire paper-theme
block exists to re-pass contrast against the light surface:

```css
body.paper .iosize-alert { color: #991b1b; } /* was #ef4444 — 3.0:1 → 6.7:1 */
body.paper .status-running { color: #166534; } /* was #4ade80 — 1.4:1 → 5.8:1 */
body.paper .err-msg { color: #b91c1c; }        /* was #ff7777 — 2.1:1 → 5.2:1 */
body.paper .file-link { color: #1558c0; }      /* was #1f6feb — 3.7:1 → 4.5:1 */
body.paper .tok { background:#475569; color:#fff; } /* chip 6.2:1 vs paper; text 7.6:1 */
```

- **Rule:** WCAG 2 — text ≥ 4.5:1, graphical marks ≥ 3:1, measured against the
  *actual adjacent* color (background **and** neighbors).
- **Why it's right:** the dark-theme green `#4ade80` reads at **1.4:1** on ivory — all
  but invisible. Every status, link, badge, and banner was recomputed; the `was X:1 → Y:1`
  comments are the audit trail. The modal viewer stays dark and is explicitly overridden,
  so its dark-tuned colors are never dropped onto the light page.

## 4. The page is newsprint gray, not pure white — §6 [STRONG-ish]

```css
body.paper { --bg: #e8e7e2; } /* dim neutral-gray paper (not bright white, not cream) */
```

- **Rule:** avoid a blazing pure-white field; lower *absolute luminance* while keeping
  high text contrast. The mechanism is **brightness, not hue**.
- **Why it's right:** `#e8e7e2` is a dimmed neutral gray, so the field throws less light
  than `#ffffff` while ink-black text still clears 4.5:1 easily. Comfort here comes from
  the lowered luminance — see the next point for the part that is *not* evidence.

## 5. Honest label: "Tufte / paper" is taste, not a comfort claim — §6 [MYTH-aware]

The CSS comments call this the "Tufte ivory" / "paper-white" theme. Per this skill,
that naming is **aesthetic, not evidence-backed**:

- The skill marks "a background *hue* is easier on the eyes" as a **[MYTH]** — the one
  study favoring a restful color didn't equate brightness, so its effect was luminance,
  not hue.
- It also marks Tufte's data-ink/chartjunk minimalism as **[CONVENTION, not law]** —
  controlled studies found no comprehension penalty from tasteful embellishment.

So the warm newsprint tone is a **brand/taste choice we like**, and we say so. The
comfort benefit (point 4) is real but comes from *lower brightness*, which an off-white
or light gray would deliver just as well. We don't claim the ivory hue rests the eye.
Naming the taste *as* taste — instead of dressing it up as ergonomics — is the discipline
this skill is built around.

---

## Beyond this skill (noted, not governed)

Two timeline choices are good practice but sit outside this skill's color/encoding scope:

- **Tabular figures** (`font-variant-numeric: tabular-nums`) so digits align in columns —
  a typography rule, not a perception one.
- **Heartbeat marks identified by a static halo, with a slow pulse as a secondary "live"
  cue** — motion is supplementary, never the sole identifier (same spirit as 1.4.1, but
  about animation rather than color).

If you extend the skill later, these are candidates for a typography/motion section;
today they're called out so a reader doesn't mistake them for rules the skill backs.

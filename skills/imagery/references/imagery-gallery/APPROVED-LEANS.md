# Validated code-illustration leans

Two leans that passed the render → look → refine (vision-loop) test and Anatoly's like/not
review on **two** unrelated subjects — the Indiana travel poster (`variations.html`) *and* the
NASA→Mars poster (`mars.html`). Winning the same pair on both a landscape brief and a space brief
is the point: **they generalize.** These are the **endorsed** directions for imagery's
*code-buildable* illustration — reusable as starting templates. Both are flat, geometric, no faces
(code-illustration's proven-good zone).

Generators: `indiana_variations.py` (five Indiana leans) and `mars_variations.py` (five Mars leans);
the two below are the keepers from each.

---

## Lean A — Swiss / subtractive  (Indiana `v2.svg`::v2 · Mars `m1.svg`::m1)

**Favre pole — "less, but better."** One dominant form, huge negative space, three colours, a
single small subject on the horizon, type set flush-left on a grid.

Why it works: the restraint *is* the design. One big flat disc (sun/planet), one confident
ground curve, one tiny recognizable subject, and a lot of empty field. Reads as gallery-grade
editorial rather than a busy scene. Fails if you add a second focal point.

Mechanism: pick ONE hero shape → let it dominate ~⅓ of the field → everything else is a whisper
→ flush-left grotesque title anchoring one corner.

## Lean B — Duotone blockprint  (Indiana `v5.svg`::v5 · Mars `m2.svg`::m2)

**The treatment lane — two inks + carved marks.** A dark ground and one warm light, bold tapered
ray-wedges, a disc with concentric "carved" rings, subject silhouettes in the light ink, a faint
grain over the dark field only.

Why it works: two inks force clarity; the woodcut/screenprint character reads as *made*, not
rendered. High contrast carries it. Fails if the two inks are close in value (the first pass was
murky navy-on-tan) or the grain is turned up past ~0.15 (it muddies the light ink).

Mechanism: two colours far apart in value → bold tapered wedges (wide at the outer end) → carved
rings/lines *into* the shapes → silhouettes in the light ink → grain ≤ 0.12, dark areas only.

---

**Shared rules (both leans):** flat/geometric only, no representational faces or animals; palette
defers to [[graphical-perception-and-color]]; always **render → look → refine** before shipping
(renderer: `@resvg/resvg-js`, SVG→PNG, no system libs) — never author blind.

# Code-illustration leans — ranked

Tested via the render → look → refine vision-loop **and** Anatoly's like/not review across several
unrelated subjects: the Indiana travel poster (`variations.html`), the NASA→Mars poster (`mars.html`),
a "smart home" system brief (`system.html`), a cozy little-world (`world.html`), isometric art
(`iso_art.html`), a website+nav-menu illustration (`website.html`), and a "mountain" concept piece
across all styles (`mountain.html`). Renderer for the loop: **`@resvg/resvg-js`** (SVG→PNG, no system
libs) — **never author blind.**

## Anatoly's ranking — the default order

1. **Duotone blockprint** — the favorite (won both the mountain and the website).
2. **Swiss / subtractive** — second.
3. **Isometric** — distant third; **niche only** (see Lean 3). Loses on mood/atmosphere.
4. **Flat-vector** — neutral "polished default"; not a favorite. Use when a friendly, literal illustration is wanted.
5. **Blueprint / wireframe** — **use only when the subject literally IS a blueprint / technical schematic** (a wireframe, an orbit diagram, an engineering readout). Never as a general style.

**Default to duotone or Swiss** for any code-illustration unless the subject specifically calls for a niche lean.
All are flat/geometric, no representational faces or animals; palette defers to
[[graphical-perception-and-color]].

---

## Lean 1 — Duotone blockprint  *(favorite)*
Examples: Indiana `v5.svg`, Mars `m2.svg`, website `ws2.svg`, mountain `mt3.svg`.

**Two inks + carved marks.** A dark ground and one warm light, bold tapered ray-wedges, discs with
concentric "carved" rings, subject silhouettes in the light ink, a faint grain over the dark field only.

Why it works: two inks force clarity; the woodcut/screenprint character reads as *made*, not rendered.
High contrast carries it. Fails if the two inks are close in value (a murky navy-on-tan first pass) or the
grain is turned up past ~0.12 (it muddies the light ink).

Mechanism: two colours far apart in value → bold tapered wedges (wide at the outer end) → carved
rings/lines *into* the shapes → silhouettes in the light ink → grain ≤ 0.12, dark areas only.

## Lean 2 — Swiss / subtractive
Examples: Indiana `v2.svg`, Mars `m1.svg`, website `ws1.svg`, mountain `mt2.svg`.

**"Less, but better."** One dominant form, huge negative space, three colours, a single small subject,
type flush-left on a grid. The restraint *is* the design. Reads gallery-grade/editorial. Its beauty comes
from subtraction — which also makes it the **most abstract**; it drops information as it gains elegance, so
it's wrong for briefs that must *say* something (see `system.html`). Fails if you add a second focal point.

Mechanism: pick ONE hero shape → it dominates ~⅓ of the field → everything else is a whisper → flush-left
grotesque title anchoring one corner.

## Lean 3 — Isometric  *(niche only)*
Best use: op-art / geometric abstraction (`iso_art.html` — tumbling blocks, wave field) and
games / "little worlds" (`world.html`). Also: system/how-it-works explainers (`system.html`).

**Wins** on dimensional clarity, playful "made-object" craft, and *explorable worlds* — where the 3-D
world itself is the product. **Loses** on atmosphere and mood: iso is structurally un-atmospheric (flat
lighting, no depth-of-field, no sky drama), so on an evocative concept piece the gradient/painterly and
flat-layered styles beat it outright (proven on `mountain.html`). Use iso when you want the subject as a
crafted, tangible object or a world to explore — **not** for feeling or representational scenes.

## Lean 4 — Blueprint / wireframe  *(literal-subject only)*
Examples where it fits: an orbit diagram (`mars.html` m4), a UX wireframe (`website.html` ws5), a
technical readout (map `mb.svg`).

Cyan linework on a navy grid, monospace labels, dashed construction lines. **Only** reach for it when the
thing being illustrated genuinely *is* a schematic/blueprint/wireframe. As a general art style it reads
cold and technical — skip it otherwise.

---

**Shared rules:** flat/geometric only, no representational faces or animals; palette defers to
[[graphical-perception-and-color]]; always **render → look → refine** before shipping — never author blind.

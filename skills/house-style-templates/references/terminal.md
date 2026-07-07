# Terminal — The Warm Phosphor Deck

**Identity (one line):** The page is the front panel of a warm retro-computing × gaming × futuristic-AI machine you *operate*, not a brochure you scroll — the lineage rendered fresh (crisp flat structure + subtle phosphor bloom), never a dated CRT costume.

**Register:** EXPRESSIVE — the character is the point; lean hard, every region carries the concept. Mood: warm, tactile, confident, playful ("read it down to the byte").

> **This is a baseline, not the design.** A template sets the starting register, palette, and move-set; the actual design is expected to diverge from it wherever the user's brief, content, or audience demands. See "Baselines, not cages" in SKILL.md.

## Pull it when

- Dashboards and control panels — operational UIs where a machine read is a feature, not a costume
- Dev tools, CLIs, and SDK docs — an audience already fluent in the terminal register
- Technical and gaming brands — personality-forward products unafraid of character
- AI / infra / data products — data-forward marketing that wants a signature, not a template

**Rule of thumb:** pull Terminal when personality is the goal and the reader wants to *operate* something; reach for a quieter slot when the brief needs neutrality, trust, or calm above character.

## Wrong choice for

- Banks, fintech-trust, healthcare — they ask for institutional calm, not machine swagger (→ `meridian.md`)
- Luxury, fashion, formal corporate — register clash (→ `ledger.md`)
- High-density long-form reading — all-mono at length taxes the reader
- Low-vision-first / maximum-calm briefs — glow, scanlines, and dense chrome fight a pure-calm brief

**Dev-tool docs sit in both lists — resolve it structurally:** keep the deck chrome (bays, legends, lamps, channel codes) and relax the all-mono voice to a proportional body face on long reading surfaces. The character lives in the structure, not the costume; note the divergence.

## The vocabulary — colour

| Token | Value | Role |
|---|---|---|
| canvas | `#060806` / `#0a0d0a` / `#0f140d` | phosphor near-black deck plate (three depths) |
| amber | `#FFC35A` | display/heading glow |
| green | `#4BE884` | THE live signal — interactive elements, lamps, data, chart ink |
| magenta | `#FF4D9D` | the ONE vibrant pop, spent exactly once page-wide |

## The vocabulary — type

- **All-mono, no proportional face:** IBM Plex Mono 600 (display) + 400 (body); JetBrains Mono 500 (instrument/tabular readouts)

## The vocabulary — structure (the fixed move-set)

- **Bracket-frame instrument bays** — every region is an engraved bay
- **Silkscreen legends + `CH·NN` channel codes** labelling each bay
- **Indicator lamps** for live state; **keycap controls**; **segment readouts**
- **Device bezel** framing the page; **telemetry foot**
- On long pages: movement banks — display-scale amber-ghost Roman numerals framed by dotted bus-bars
- **Mark:** scale-robust bracket-chip, green on deck plate

**The character lives in the structure:** strip the colour and the marks, and a control panel must still remain.

## Held constants (the core — what must survive for it to still be Terminal)

The operable-machine structure (bracket-frame bays + silkscreen legends/channel codes + lamps/keycaps/readouts) · phosphor near-black ground · the amber/green signal split · mono as the instrument voice. The all-mono *body* rule and the dense chrome are swappable at length, within the floors.

## Discipline

- One magenta pop live once; flat "spent once" documentation chips are reference, not a second emphasis.
- All four floors hold (AA computed on the dark wells, chart honesty, legibility, focus/44px). The look bends to the rule, always.

## The built page — ships with this skill

**[`templates/terminal.html`](templates/terminal.html)** is the complete, self-contained working design this doc distills — open it to see every token, move, and floor in use. Provenance: built and gate-passed through scored multi-agent review (all nine specialist lenses, lowest 8.5; art-director final pass 9.4 against a locked, user-confirmed direction).

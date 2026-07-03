---
name: generative-imagery
description: Use when a design needs an image, background, texture, or illustration that must be GENERATED (not selected or commissioned) — atmospheric hero art, duotone or textural grounds, mood imagery, on-brief placeholders — and you have no image-generation model of your own. Free, keyless generation via Pollinations.ai. NOT for accurate in-image text, logos, real people or brands, charts, or anything where a wrong detail (hands, letters, counts) breaks it.
---

# Generative Imagery (Pollinations.ai)

## Overview
design-craft has no image-generation model of its own — [[imagery]] can only **select** or **commission**. This skill fills that gap with **free, keyless** generation via **Pollinations.ai**: a plain GET URL returns a JPEG. Use it for atmospheric, illustrative, or textural assets — but generated output is only worth shipping if it meets the design's register (see the no-cheap-graphic rule below).

## Governing rules (non-negotiable)
1. **Availability gate — check first.** Not every user can reach Pollinations. **Probe reachability before generating** (`scripts/generate.py --check`). **If it is unreachable, do NOT generate** — build the design **without** generated imagery (fall back to local/code illustration via [[imagery]], or to nothing). A design must never depend on this service.
2. **Generate only from the team's requirements — never a naked prompt.** Assemble the prompt from precise requirements the art-director and the relevant skills contribute, so the image **fits**: palette/contrast ([[graphical-perception-and-color]]), theme/mood/branding (the director + [[branding]] / [[developing-style]]), size/aspect/placement ([[interface-ux-and-layout]] / [[composition-and-design-theory]]), styling. **This holds even when the skill is invoked directly via slash** — a direct call still gathers the fit-requirements from the team; it does not skip them.
3. **Local-first — keep use LOW.** Generated imagery is **embellishment**. If a local/code treatment (duotone SVG, programmatic illustration via [[imagery]]) is sufficient, **do not generate.** Reach for it only when local craft genuinely cannot do the job.
4. **The art-director reviews every result.** A generated image ships **only if the art-director judges it good enough and on-register.** Not good enough → discard it (see no-cheap-graphic). The director owns this gate.
5. **Supporting, never the concept.** Generated images may **only support** the design — **never be the concept, never dominate it.** The plugin's value is the design craft (structure, composition, type, colour, the invented style); a piece carried by an AI image undercuts that value. Keep generated imagery subordinate — a ground, a texture, a supporting figure — not the star.

## When to use
- A design needs a hero image, background, texture, duotone/illustrative asset, or mood image and there's nothing good to select.
- You want a real, on-brief asset instead of a grey placeholder box.

**NOT for:** accurate text inside the image, logos, real people or brands, diagrams/charts (use [[charting]]), or anything where a wrong detail (hands, letters, counts) breaks it — AI image models fail at these. Composite real type/logos over a generated background instead.

## Quick reference (verified live 2026-07-02)
Keyless GET — no API key, no auth:
- **Image:** `https://image.pollinations.ai/prompt/{URL-encoded prompt}?width=W&height=H&seed=N&nologo=true&model=sana`
- **Models:** `GET https://image.pollinations.ai/models` — **check this live before use.** Currently `["sana"]`; the `flux`/`turbo` models in older docs are NOT currently served. Do not hardcode a model that isn't in the list.
- **Text:** `https://text.pollinations.ai/{URL-encoded prompt}` — plain-text completion.
- Output is **JPEG**. `nologo=true` drops the watermark. `seed` makes a result reproducible.

**Helper:** `scripts/generate.py "prompt" --out FILE [--width 768 --height 512 --seed 42]` — URL-encodes the prompt, calls the API, verifies the response is an image, saves the file. Stdlib only (no deps). `--list-models` prints the live model list.

## Prompt-craft for design quality
- Name the **style** explicitly: `duotone`, `minimal poster`, `flat vector`, `cinematic`, `risograph`, `blueprint`, `isometric`, `matte painting`, `line engraving`.
- Name the **palette / mood / composition**: e.g. "teal duotone, minimal, lots of negative space, low horizon, soft light."
- Set aspect via `width`/`height`. Lock a look with one `seed`; vary the seed to explore.
- Describe the **look**, never literal text or logos.

## What actually works (craft — reusable)
- **Generate the theme's MATERIAL / TEXTURE / atmosphere, not its literal OBJECT.** A photo of the theme's *device* (a CRT for a terminal, a leaf for a botanical style, a coin for finance) reads as **dated costume** and clashes with the design's own vocabulary — exactly what to avoid. An abstract, treated **surface / grain / ground** delivers the same payoff (the lit material a flat drawing can't fake) while staying supporting and on-register.
- **Treat and colour-match the result to the design's own key values.** Match the generated image's peak values to the palette's *live* values, and match its framing to the design's spatial vocabulary — flat / head-on for a flat design; a receding 3D "data-plane" reads as generic stock. Then it reads as **one material with the design**, not imported stock.
- **Place it as ground / texture in negative space** — dimmed, behind opaque content, contained in a frame — so it adds material depth without competing with the data or risking the AA floor (keep text off it, or keep the texture faint enough that overlaid captions still clear AA).

## Vision-loop — never ship blind
Generate → **Read the image** → judge it against the confirmed direction → refine the prompt → regenerate. One prompt rarely lands; 2–4 iterations do. (Same loop [[imagery]] and the render pipeline use — authoring blind is the mistake.)

## Integration — the design-craft floors and rules still apply
- **Honor the confirmed direction + palette.** Defer colour to [[graphical-perception-and-color]]; composition and figure-ground to [[composition-and-design-theory]].
- **Alt-text floor (WCAG 1.1.1):** every meaningful generated image gets real alt text; decorative → `alt=""`. Shared with [[imagery]].
- **No cheap graphic for a luxury brand.** If the output reads cheap or off-register, iterate the prompt or **omit it — no graphic beats a cheap one.** For premium work, judge hard, or fall back to select/commission via [[imagery]].

## Common mistakes / limits
- Hardcoding a model (`flux`) that `/models` doesn't list → falls back or fails. Check live.
- Trusting in-image text, numerals, hands, faces, logos — they come out wrong. Generate the *background/mood*; composite the exact text over it.
- It's an external service: needs network, can be slow or briefly down. Degrade gracefully; never block a build on it.
- Be rate-limit-polite — space out bulk calls, reuse a `seed`.

## Verified
2026-07-02: keyless GET returned a clean 768×512 **duotone-teal mountain poster** (on-prompt, no watermark) via `model=sana`; the text endpoint returned plain text. Free, no key. `scripts/generate.py` reproduces it.

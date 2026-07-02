---
name: generative-imagery
description: Use when a design needs an image, background, texture, or illustration that must be GENERATED (not selected or commissioned) — atmospheric hero art, duotone or textural grounds, mood imagery, on-brief placeholders — and you have no image-generation model of your own. Free, keyless generation via Pollinations.ai. NOT for accurate in-image text, logos, real people or brands, charts, or anything where a wrong detail (hands, letters, counts) breaks it.
---

# Generative Imagery (Pollinations.ai)

## Overview
design-craft has no image-generation model of its own — [[imagery]] can only **select** or **commission**. This skill fills that gap with **free, keyless** generation via **Pollinations.ai**: a plain GET URL returns a JPEG. Use it for atmospheric, illustrative, or textural assets — but generated output is only worth shipping if it meets the design's register (see the no-cheap-graphic rule below).

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

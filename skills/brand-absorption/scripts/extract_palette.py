#!/usr/bin/env python3
"""Extract a brand's working colour palette from an image (logo, screenshot, hero).

The measurable half of brand absorption: pull the dominant colours and how much of
the frame each one owns, so you start from evidence instead of guessing hex values
by eye. It does NOT name roles for you with any authority — the role column is a
rough hint (by coverage + saturation), and you must confirm it against the live
brand. Colour statistics are a *surface* signature; they cannot see composition or
meaning. (See the skill's [MYTH] note on "style is fully measurable from the image".)

Dependency: Pillow (`pip install Pillow`) — nothing else. Pillow's median-cut
quantizer does the clustering; no numpy/sklearn.

Usage:
    python extract_palette.py LOGO.png
    python extract_palette.py hero.jpg --colors 6 --json
    python extract_palette.py shot.png --ignore-bg   # drop the dominant flat background

Output: each colour as hex + RGB + share of pixels + a rough role hint, most
prominent first. With --json, a machine-readable list for piping into a brief.
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter


def _load_pillow():
    try:
        from PIL import Image  # noqa: PLC0415
    except ImportError:
        sys.exit(
            "This helper needs Pillow. Install it with:  pip install Pillow\n"
            "(It is the only dependency — the clustering uses Pillow's own median-cut quantizer.)"
        )
    return Image


def _luminance(rgb: tuple[int, int, int]) -> float:
    """Perceived lightness 0..1 (sRGB-weighted). Used only for the rough role hint."""
    r, g, b = (c / 255 for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def _saturation(rgb: tuple[int, int, int]) -> float:
    """HSV-style saturation 0..1. Used only for the rough role hint."""
    r, g, b = rgb
    mx, mn = max(r, g, b), min(r, g, b)
    return 0.0 if mx == 0 else (mx - mn) / mx


def extract(path: str, colors: int = 6, ignore_bg: bool = False, max_side: int = 400):
    """Return a list of palette entries, most-covered first.

    Each entry: {hex, rgb, share, role_hint}. `share` sums to ~1.0 across entries.
    """
    Image = _load_pillow()
    img = Image.open(path).convert("RGB")

    # Downscale for speed; coverage ratios are unaffected by uniform scaling.
    w, h = img.size
    if max(w, h) > max_side:
        scale = max_side / max(w, h)
        img = img.resize((max(1, int(w * scale)), max(1, int(h * scale))))

    # Median-cut into a small adaptive palette, then count how many pixels map to each.
    quant = img.quantize(colors=colors, method=Image.Quantize.MEDIANCUT)
    pal = quant.getpalette()  # flat [r,g,b, r,g,b, ...]
    # get_flattened_data() on new Pillow; getdata() on older — support both.
    pixels = quant.get_flattened_data() if hasattr(quant, "get_flattened_data") else quant.getdata()
    counts = Counter(pixels)  # palette-index -> pixel count

    entries = []
    for idx, count in counts.items():
        rgb = (pal[idx * 3], pal[idx * 3 + 1], pal[idx * 3 + 2])
        entries.append({"rgb": rgb, "count": count})

    if ignore_bg and len(entries) > 1:
        # Drop the single most-covered colour (usually a flat page/background fill).
        entries.sort(key=lambda e: e["count"], reverse=True)
        entries = entries[1:]

    total = sum(e["count"] for e in entries) or 1
    entries.sort(key=lambda e: e["count"], reverse=True)

    out = []
    for i, e in enumerate(entries):
        rgb = e["rgb"]
        share = e["count"] / total
        out.append(
            {
                "hex": "#{:02X}{:02X}{:02X}".format(*rgb),
                "rgb": list(rgb),
                "share": round(share, 4),
                "role_hint": _role_hint(rgb, share, rank=i),
            }
        )
    return out


def _role_hint(rgb, share, rank: int) -> str:
    """A *guess*, not a verdict. Confirm every one of these against the live brand."""
    lum, sat = _luminance(rgb), _saturation(rgb)
    if rank == 0 and sat < 0.18:
        return "likely background / canvas"
    if lum > 0.85:
        return "likely light surface / paper"
    if lum < 0.15:
        return "likely text / ink"
    if sat > 0.55:
        return "likely accent / brand colour"
    return "supporting / neutral"


def main() -> None:
    ap = argparse.ArgumentParser(description="Extract a brand colour palette from an image.")
    ap.add_argument("image", help="path to a logo, screenshot, or hero image")
    ap.add_argument("--colors", type=int, default=6, help="how many palette colours to pull (default 6)")
    ap.add_argument("--ignore-bg", action="store_true", help="drop the dominant flat background colour")
    ap.add_argument("--json", action="store_true", help="emit JSON instead of a table")
    args = ap.parse_args()

    palette = extract(args.image, colors=args.colors, ignore_bg=args.ignore_bg)

    if args.json:
        print(json.dumps(palette, indent=2))
        return

    print(f"\nPalette from {args.image}  (most prominent first)\n")
    print(f"  {'HEX':<9} {'SHARE':>6}  {'RGB':<16} ROLE HINT (confirm by eye)")
    print("  " + "-" * 62)
    for c in palette:
        rgb = "({}, {}, {})".format(*c["rgb"])
        print(f"  {c['hex']:<9} {c['share'] * 100:5.1f}%  {rgb:<16} {c['role_hint']}")
    print("\n  Role hints are guesses from coverage + saturation — verify against the live brand.")
    print("  Colour is the surface signature only; it cannot capture the brand's compositional 'hand'.\n")


if __name__ == "__main__":
    main()

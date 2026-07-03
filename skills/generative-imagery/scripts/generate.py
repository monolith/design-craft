#!/usr/bin/env python3
"""Generate an image via Pollinations.ai (free, keyless) and save it. Stdlib only.

    python generate.py "a teal duotone mountain, minimal poster" --out hero.jpg \
        --width 768 --height 512 --seed 42
    python generate.py --list-models

Describe the LOOK (style, palette, mood, composition) — not literal text or logos;
AI image models get in-image text, hands, faces, and logos wrong. Composite real
type over a generated background instead.
"""
import argparse
import sys
import urllib.parse
import urllib.request

IMAGE_BASE = "https://image.pollinations.ai/prompt/"
MODELS_URL = "https://image.pollinations.ai/models"
UA = {"User-Agent": "design-craft/generative-imagery"}


def generate(prompt, out, width=1024, height=1024, seed=None, model="sana", nologo=True, timeout=120):
    params = {"width": width, "height": height, "nologo": str(bool(nologo)).lower()}
    if seed is not None:
        params["seed"] = seed
    if model:
        params["model"] = model
    url = IMAGE_BASE + urllib.parse.quote(prompt, safe="") + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        content_type = r.headers.get("Content-Type", "")
        data = r.read()
    if not content_type.startswith("image/"):
        sys.exit(f"Pollinations did not return an image (Content-Type: {content_type!r}). "
                 f"First bytes: {data[:200]!r}")
    with open(out, "wb") as f:
        f.write(data)
    print(f"saved {out} ({len(data)} bytes, {content_type})")
    return out


def list_models(timeout=20):
    with urllib.request.urlopen(urllib.request.Request(MODELS_URL, headers=UA), timeout=timeout) as r:
        print(r.read().decode())


def available(timeout=8):
    """True if Pollinations is reachable. CHECK THIS BEFORE GENERATING — if it
    returns False, do NOT generate: build the design without generated imagery."""
    try:
        with urllib.request.urlopen(urllib.request.Request(MODELS_URL, headers=UA), timeout=timeout):
            return True
    except Exception:
        return False


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Generate an image via Pollinations.ai (free, keyless).")
    ap.add_argument("prompt", nargs="?", help="describe the LOOK, not literal text/logos")
    ap.add_argument("--out", default="pollinations.jpg")
    ap.add_argument("--width", type=int, default=1024)
    ap.add_argument("--height", type=int, default=1024)
    ap.add_argument("--seed", type=int, default=None)
    ap.add_argument("--model", default="sana", help="must be in /models (see --list-models)")
    ap.add_argument("--list-models", action="store_true", help="print the live model list and exit")
    ap.add_argument("--check", action="store_true", help="probe availability; print available/unavailable, exit 0 if reachable else 1")
    a = ap.parse_args()
    if a.check:
        ok = available()
        print("available" if ok else "unavailable")
        sys.exit(0 if ok else 1)
    if a.list_models:
        list_models()
        sys.exit(0)
    if not a.prompt:
        ap.error("prompt required (or use --list-models)")
    generate(a.prompt, a.out, a.width, a.height, a.seed, a.model)

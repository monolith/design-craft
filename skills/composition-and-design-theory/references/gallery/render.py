#!/usr/bin/env python3
"""Render the composition plates (self-contained HTML) to PNG previews.

Build-time tool only — the shipped gallery is the HTML; PNGs are review previews.
Each plate declares its pixel size with an HTML comment:  <!-- size: 1080x1350 -->

Usage:
    python3 render.py                # render every plate-*.html into previews/
    python3 render.py plate-grid.html  # render one
"""
import glob
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
PREVIEWS = os.path.join(HERE, "previews")
# Durable copy of the headless-Chromium runtime libs (see research dir).
LIBS = os.path.expanduser("~/design-craft-research/.render-libs")
SCALE = "2"  # device pixel ratio for crisp previews

SIZE_RE = re.compile(r"<!--\s*size:\s*(\d+)x(\d+)\s*-->", re.I)


def find_chromium() -> str:
    hits = sorted(glob.glob(os.path.expanduser(
        "~/.cache/ms-playwright/chromium-*/chrome-linux64/chrome")))
    if not hits:
        sys.exit("chromium not found under ~/.cache/ms-playwright")
    return hits[-1]


def render(html_path: str, chromium: str) -> None:
    with open(html_path, encoding="utf-8") as fh:
        m = SIZE_RE.search(fh.read())
    w, h = (m.group(1), m.group(2)) if m else ("1080", "1350")
    name = os.path.splitext(os.path.basename(html_path))[0]
    out = os.path.join(PREVIEWS, name + ".png")
    env = dict(os.environ, LD_LIBRARY_PATH=LIBS)
    subprocess.run([
        chromium, "--headless", "--disable-gpu", "--no-sandbox",
        "--hide-scrollbars", "--default-background-color=00000000",
        "--virtual-time-budget=2500",  # let inline scripts paint before capture (avoids race)
        f"--force-device-scale-factor={SCALE}",
        f"--window-size={w},{h}",
        f"--screenshot={out}", "file://" + os.path.abspath(html_path),
    ], env=env, check=True, capture_output=True)
    print(f"{name}: {w}x{h} @{SCALE}x -> {out}")


def main() -> None:
    os.makedirs(PREVIEWS, exist_ok=True)
    chromium = find_chromium()
    args = sys.argv[1:]
    if args:
        files = [os.path.join(HERE, a) for a in args]
    else:
        files = sorted(glob.glob(os.path.join(HERE, "plate-*.html")))
    for f in files:
        render(f, chromium)


if __name__ == "__main__":
    main()

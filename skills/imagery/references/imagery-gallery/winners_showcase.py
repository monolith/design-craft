#!/usr/bin/env python3
"""Reference showcase — the validated code-illustration leans, shown on their winning subjects.
Reads the winning SVGs and lays them out by lean. Run: python3 winners_showcase.py -> showcase.html
"""
def rd(f):
    return open(f).read()

LEANS=[
 ("Swiss / subtractive","One dominant form, huge negative space, three colours, a single subject, flush-left type. "
  "Won the poster/identity briefs on both subjects. Beautiful — and the most abstract (subtraction removes meaning as it adds beauty).",
  [("Indiana",("v2.svg")),("NASA → Mars",("m1.svg"))]),
 ("Duotone blockprint","Two inks far apart in value, bold tapered ray-wedges, carved rings, silhouettes in the light ink, "
  "a whisper of grain. Won on both subjects. Reads as made, not rendered.",
  [("Indiana",("v5.svg")),("NASA → Mars",("m2.svg"))]),
]

sections=""
for name,desc,items in LEANS:
    cards="".join(f'<figure><div class="p">{rd(svg)}</div><figcaption>{sub}</figcaption></figure>' for sub,svg in items)
    sections+=f'<section><h2>{name}</h2><p class="d">{desc}</p><div class="row">{cards}</div></section>'

HTML=f'''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>design-craft imagery — validated leans</title>
<style>
 body{{margin:0;background:#0f0d10;color:#efe7d6;font-family:system-ui,sans-serif;line-height:1.5}}
 header{{max-width:980px;margin:0 auto;padding:44px 28px 8px}}
 h1{{font-family:Georgia,serif;font-size:26px;margin:0 0 8px}}
 header p{{max-width:70ch;color:#b3a992;margin:0}}
 .tag{{display:inline-block;margin-top:14px;font-size:11.5px;color:#9a9078;border:1px solid #2c2a26;border-radius:20px;padding:4px 12px}}
 section{{max-width:980px;margin:0 auto;padding:26px 28px}}
 h2{{font-size:17px;margin:0 0 4px}} .d{{color:#b3a992;font-size:13px;margin:0 0 16px;max-width:78ch}}
 .row{{display:grid;grid-template-columns:1fr 1fr;gap:24px}}
 figure{{margin:0}} .p svg{{width:100%;height:auto;display:block;border-radius:8px;box-shadow:0 6px 26px #000a}}
 figcaption{{padding:8px 2px 0;color:#9a9078;font-size:12px}}
 footer{{max-width:980px;margin:0 auto;padding:12px 28px 60px;color:#6f6857;font-size:11.5px;border-top:1px solid #201e1a}}
</style></head><body>
<header><h1>Imagery — validated code-illustration leans</h1>
<p>Two leans passed the render → look → refine loop and the like/not review on two unrelated subjects
(a landscape brief and a space brief). Winning the same pair on both is the point: <b>they generalise</b>.
Everything else is context-specific (system briefs → isometric/blueprint; ornament → deco). Code-illustration
is proven-good on flat / geometric / scene / poster work; representational faces, animals, and photographs stay
select-or-commission.</p>
<span class="tag">flat · geometric · no faces · rendered &amp; checked, never authored blind</span></header>
{sections}
<footer>Generators: <code>indiana_variations.py</code> · <code>mars_variations.py</code>. Full method + mechanism:
<code>APPROVED-LEANS.md</code>. Renderer: <code>@resvg/resvg-js</code> (SVG→PNG, no system libs).</footer>
</body></html>'''
open("showcase.html","w").write(HTML)
print(f"wrote showcase.html ({len(HTML)} bytes)")

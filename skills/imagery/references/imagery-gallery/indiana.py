#!/usr/bin/env python3
"""Indiana travel poster — flat WPA/mid-century style, fully code-built (SVG).
The vision-loop test: generate -> render to PNG -> look -> adjust. Run: python3 indiana.py
Writes indiana.svg (for rendering) and indiana.html (for the browser).
"""
# palette — warm dusk travel-poster
SKY_TOP="#33465e"; SKY_MID="#c9713f"; SKY_LOW="#f0cf94"
SUN="#f4c95d"; RAY="#f0b84e"
HILL_FAR="#8a9257"; HILL_MID="#657045"; HILL_NEAR="#4e5c38"
FIELD="#c9a24b"; FURROW="#a9863a"
BARN="#a6432b"; BARN_DK="#83341f"; TRIM="#f0e9db"; SILO="#d9c9a8"; SILO_TOP="#b7a785"
TREE="#3f4c30"; INK="#26281f"; CREAM="#f0e9db"; BAND="#26281f"

W,H=300,420
def R(): return round

svg=[]
svg.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">')
# defs: sky gradient
svg.append(f'''<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="{SKY_TOP}"/><stop offset="0.55" stop-color="{SKY_MID}"/>
<stop offset="1" stop-color="{SKY_LOW}"/></linearGradient></defs>''')
# sky
svg.append(f'<rect width="{W}" height="255" fill="url(#sky)"/>')
# sun rays (WPA sunburst) behind sun
import math
scx,scy=214,150
for k in range(12):
    a=k*2*math.pi/12
    x1=scx+math.cos(a)*30; y1=scy+math.sin(a)*30
    x2=scx+math.cos(a)*120; y2=scy+math.sin(a)*120
    ang=math.atan2(y2-y1,x2-x1); px=math.cos(ang+math.pi/2)*5; py=math.sin(ang+math.pi/2)*5
    svg.append(f'<polygon points="{x1-px:.1f},{y1-py:.1f} {x2:.1f},{y2:.1f} {x1+px:.1f},{y1+py:.1f}" fill="{RAY}" opacity="0.35"/>')
# sun
svg.append(f'<circle cx="{scx}" cy="{scy}" r="34" fill="{SUN}"/>')
# clouds — fluffy multi-lobe, warm cream, upper-left (in front of the rays)
CLOUD="#f3ddb4"
def cloud(cx,cy,s):
    lobes=[(0,0,1.0),(-1.15,0.12,0.72),(1.15,0.1,0.78),(-0.5,-0.42,0.66),(0.55,-0.36,0.6)]
    p=[f'<ellipse cx="{cx+dx*s*13:.1f}" cy="{cy+dy*s*13:.1f}" rx="{s*15*r:.1f}" ry="{s*11*r:.1f}" fill="{CLOUD}" opacity="0.9"/>' for dx,dy,r in lobes]
    p.append(f'<rect x="{cx-s*22:.1f}" y="{cy:.1f}" width="{s*44:.1f}" height="{s*11:.1f}" fill="{CLOUD}" opacity="0.9"/>')
    return "".join(p)
svg.append(cloud(70,84,0.95))
svg.append(cloud(126,120,0.6))
# far rolling hills
svg.append(f'<path d="M0 232 C 55 214 105 244 150 232 S 250 210 300 234 L300 300 L0 300 Z" fill="{HILL_FAR}"/>')
# mid hills
svg.append(f'<path d="M0 256 C 70 240 120 266 175 254 S 260 240 300 258 L300 320 L0 320 Z" fill="{HILL_MID}"/>')
# --- barn + silo on the mid hill, left of centre ---
bx,by=52,214   # barn top-left of body
# silo (behind barn, right)
svg.append(f'<rect x="{bx+72}" y="{by-6}" width="20" height="52" fill="{SILO}"/>')
svg.append(f'<path d="M{bx+72} {by-6} Q{bx+82} {by-20} {bx+92} {by-6} Z" fill="{SILO_TOP}"/>')
svg.append(f'<rect x="{bx+72}" y="{by+8}" width="20" height="2.5" fill="{SILO_TOP}"/>')
# barn body
svg.append(f'<rect x="{bx}" y="{by}" width="66" height="46" fill="{BARN}"/>')
# gambrel roof (4-sided)
svg.append(f'<polygon points="{bx-4},{by} {bx+14},{by-16} {bx+33},{by-24} {bx+52},{by-16} {bx+70},{by} " fill="{BARN_DK}"/>')
# white trim: door + hayloft + X-brace
svg.append(f'<rect x="{bx+25}" y="{by+18}" width="16" height="28" fill="{TRIM}"/>')
svg.append(f'<path d="M{bx+25} {by+18} L{bx+41} {by+46} M{bx+41} {by+18} L{bx+25} {by+46}" stroke="{BARN}" stroke-width="1.6"/>')
svg.append(f'<rect x="{bx+29}" y="{by-8}" width="8" height="8" fill="{TRIM}"/>')
svg.append(f'<rect x="{bx}" y="{by}" width="66" height="3" fill="{TRIM}"/>')
# a couple of trees (silhouette) right side
for tx,ty,ts in ((236,250,1.0),(258,256,0.72)):
    svg.append(f'<rect x="{tx-2:.0f}" y="{ty:.0f}" width="4" height="{16*ts:.0f}" fill="{BARN_DK}"/>')
    svg.append(f'<circle cx="{tx}" cy="{ty-6*ts:.0f}" r="{13*ts:.0f}" fill="{TREE}"/>')
    svg.append(f'<circle cx="{tx-9*ts:.0f}" cy="{ty+1:.0f}" r="{9*ts:.0f}" fill="{TREE}"/>')
    svg.append(f'<circle cx="{tx+9*ts:.0f}" cy="{ty+1:.0f}" r="{9*ts:.0f}" fill="{TREE}"/>')
# --- foreground field with converging corn rows (perspective) ---
svg.append(f'<path d="M0 300 C 80 286 220 286 300 300 L300 345 L0 345 Z" fill="{FIELD}"/>')
vpx,vpy=150,300
for fx in range(-2,10):
    bxp=fx*40
    svg.append(f'<path d="M{bxp} 346 L{vpx} {vpy}" stroke="{FURROW}" stroke-width="1.6" opacity="0.7"/>')
# corn stalks along the front — even, small, a stalk with paired leaves
for i in range(13):
    x=14+i*22.3
    svg.append(f'<path d="M{x:.0f} 343 l0 -8 M{x:.0f} 338 q-4 -1 -5 -5 M{x:.0f} 340 q4 -1 5 -5" stroke="{HILL_NEAR}" stroke-width="1.3" fill="none" stroke-linecap="round"/>')
# --- title band ---
svg.append(f'<rect x="0" y="345" width="{W}" height="75" fill="{BAND}"/>')
svg.append(f'<rect x="24" y="356" width="252" height="2" fill="{SUN}"/>')
svg.append(f'<text x="150" y="392" text-anchor="middle" font-family="Georgia, \'Times New Roman\', serif" font-weight="700" font-size="46" letter-spacing="4" fill="{CREAM}">INDIANA</text>')
svg.append(f'<text x="150" y="410" text-anchor="middle" font-family="Georgia, serif" font-size="11" letter-spacing="5" fill="{SUN}">CROSSROADS OF AMERICA</text>')
svg.append('</svg>')
SVG="\n".join(svg)
open("indiana.svg","w").write(SVG)
HTML=f'<!doctype html><html><head><meta charset="utf-8"><title>Indiana — travel poster</title><style>body{{margin:0;background:#111;display:grid;place-items:center;min-height:100vh}}svg{{width:min(90vw,480px);height:auto;box-shadow:0 8px 40px #0008}}</style></head><body>{SVG}</body></html>'
open("indiana.html","w").write(HTML)
print(f"wrote indiana.svg ({len(SVG)} bytes) + indiana.html")

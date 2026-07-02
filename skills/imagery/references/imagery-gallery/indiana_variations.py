#!/usr/bin/env python3
"""Indiana poster — FIVE leans the imagery skill can take, same subject.
Each maps to a lane/pole in the illustration direction. Fully code-built SVG.
Run: python3 indiana_variations.py -> v1..v5.svg + variations.html
Leans: 1 WPA narrative · 2 Swiss/subtractive (Favre) · 3 Art-Deco symmetric ·
       4 Isometric 'Crossroads' (Pohl) · 5 Duotone blockprint (treatment).
"""
import math
W,Hh=300,420
def mul(h,f):
    h=h.lstrip("#"); r,g,b=(int(h[i:i+2],16) for i in (0,2,4))
    return "#%02x%02x%02x"%tuple(max(0,min(255,int(c*f))) for c in (r,g,b))
def T(x,y,s,txt,fill,fam="Georgia, serif",w="700",ls="4",anchor="middle"):
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-family="{fam}" font-weight="{w}" font-size="{s}" letter-spacing="{ls}" fill="{fill}">{txt}</text>'
def wrap(inner): return f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{Hh}" viewBox="0 0 {W} {Hh}">{inner}</svg>'

# ---------- 1) WPA narrative (warm dusk) ----------
def v1(p):
    SKY_TOP="#33465e";SKY_MID="#c9713f";SKY_LOW="#f0cf94";SUN="#f4c95d";RAY="#f0b84e"
    HF="#8a9257";HM="#657045";FIELD="#c9a24b";FUR="#a9863a";BARN="#a6432b";BD="#83341f"
    TRIM="#f0e9db";SILO="#d9c9a8";ST="#b7a785";TREE="#3f4c30";CREAM="#f0e9db";BAND="#26281f";HN="#4e5c38"
    s=[f'<defs><linearGradient id="{p}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{SKY_TOP}"/><stop offset="0.55" stop-color="{SKY_MID}"/><stop offset="1" stop-color="{SKY_LOW}"/></linearGradient></defs>']
    s.append(f'<rect width="{W}" height="255" fill="url(#{p}sky)"/>')
    cx,cy=214,150
    for k in range(12):
        a=k*math.pi/6;x1=cx+math.cos(a)*30;y1=cy+math.sin(a)*30;x2=cx+math.cos(a)*120;y2=cy+math.sin(a)*120
        ang=math.atan2(y2-y1,x2-x1);px=math.cos(ang+math.pi/2)*5;py=math.sin(ang+math.pi/2)*5
        s.append(f'<polygon points="{x1-px:.1f},{y1-py:.1f} {x2:.1f},{y2:.1f} {x1+px:.1f},{y1+py:.1f}" fill="{RAY}" opacity="0.32"/>')
    s.append(f'<circle cx="{cx}" cy="{cy}" r="34" fill="{SUN}"/>')
    def cloud(a,b,sc):
        L=[(0,0,1),(-1.15,0.12,0.72),(1.15,0.1,0.78),(-0.5,-0.42,0.66),(0.55,-0.36,0.6)]
        return "".join(f'<ellipse cx="{a+dx*sc*13:.1f}" cy="{b+dy*sc*13:.1f}" rx="{sc*15*r:.1f}" ry="{sc*11*r:.1f}" fill="#f3ddb4" opacity="0.9"/>' for dx,dy,r in L)+f'<rect x="{a-sc*22:.1f}" y="{b:.1f}" width="{sc*44:.1f}" height="{sc*11:.1f}" fill="#f3ddb4" opacity="0.9"/>'
    s.append(cloud(70,84,0.95));s.append(cloud(126,120,0.6))
    s.append(f'<path d="M0 232 C 55 214 105 244 150 232 S 250 210 300 234 L300 300 L0 300 Z" fill="{HF}"/>')
    s.append(f'<path d="M0 256 C 70 240 120 266 175 254 S 260 240 300 258 L300 320 L0 320 Z" fill="{HM}"/>')
    bx,by=52,214
    s.append(f'<rect x="{bx+72}" y="{by-6}" width="20" height="52" fill="{SILO}"/><path d="M{bx+72} {by-6} Q{bx+82} {by-20} {bx+92} {by-6} Z" fill="{ST}"/>')
    s.append(f'<rect x="{bx}" y="{by}" width="66" height="46" fill="{BARN}"/>')
    s.append(f'<polygon points="{bx-4},{by} {bx+14},{by-16} {bx+33},{by-24} {bx+52},{by-16} {bx+70},{by}" fill="{BD}"/>')
    s.append(f'<rect x="{bx+25}" y="{by+18}" width="16" height="28" fill="{TRIM}"/><path d="M{bx+25} {by+18} L{bx+41} {by+46} M{bx+41} {by+18} L{bx+25} {by+46}" stroke="{BARN}" stroke-width="1.6"/>')
    s.append(f'<rect x="{bx}" y="{by}" width="66" height="3" fill="{TRIM}"/>')
    for tx,ty,ts in ((236,250,1.0),(258,256,0.72)):
        s.append(f'<rect x="{tx-2:.0f}" y="{ty:.0f}" width="4" height="{16*ts:.0f}" fill="{BD}"/><circle cx="{tx}" cy="{ty-6*ts:.0f}" r="{13*ts:.0f}" fill="{TREE}"/><circle cx="{tx-9*ts:.0f}" cy="{ty+1:.0f}" r="{9*ts:.0f}" fill="{TREE}"/><circle cx="{tx+9*ts:.0f}" cy="{ty+1:.0f}" r="{9*ts:.0f}" fill="{TREE}"/>')
    s.append(f'<path d="M0 300 C 80 286 220 286 300 300 L300 345 L0 345 Z" fill="{FIELD}"/>')
    for fx in range(-2,10):
        s.append(f'<path d="M{fx*40} 346 L150 300" stroke="{FUR}" stroke-width="1.6" opacity="0.7"/>')
    for i in range(13):
        x=14+i*22.3;s.append(f'<path d="M{x:.0f} 343 l0 -8 M{x:.0f} 338 q-4 -1 -5 -5 M{x:.0f} 340 q4 -1 5 -5" stroke="{HN}" stroke-width="1.3" fill="none" stroke-linecap="round"/>')
    s.append(f'<rect y="345" width="{W}" height="75" fill="{BAND}"/><rect x="24" y="356" width="252" height="2" fill="{SUN}"/>')
    s.append(T(150,392,46,"INDIANA",CREAM,ls="4"));s.append(T(150,410,11,"CROSSROADS OF AMERICA",SUN,fam="Georgia, serif",w="400",ls="5"))
    return wrap("".join(s))

# ---------- 2) Swiss / subtractive (Favre pole) ----------
def v2(p):
    BG="#efe7d6";SUN="#d8863a";LAND="#2f3b34";BARN="#b23a24";CREAM="#efe7d6";INK="#22261f"
    s=[f'<rect width="{W}" height="{Hh}" fill="{BG}"/>']
    # one big sun circle, offset upper-right, flat
    s.append(f'<circle cx="212" cy="150" r="86" fill="{SUN}"/>')
    # single confident hill curve dividing land
    s.append(f'<path d="M0 250 C 90 214 210 214 300 250 L300 {Hh} L0 {Hh} Z" fill="{LAND}"/>')
    # one barn silhouette on the horizon, minimal
    bx,by=64,214
    s.append(f'<rect x="{bx}" y="{by}" width="40" height="30" fill="{BARN}"/><polygon points="{bx-3},{by} {bx+20},{by-15} {bx+43},{by}" fill="{BARN}"/>')
    s.append(f'<rect x="{bx+46}" y="{by-8}" width="11" height="38" fill="{BARN}"/>')
    # title: flush-left, gridded, sans
    s.append(T(30,352,40,"INDIANA",CREAM,fam="Helvetica, Arial, sans-serif",w="700",ls="1",anchor="start"))
    s.append(T(31,372,11,"CROSSROADS OF AMERICA",SUN,fam="Helvetica, Arial, sans-serif",w="700",ls="3",anchor="start"))
    s.append(f'<line x1="30" y1="360" x2="270" y2="360" stroke="{SUN}" stroke-width="1.5"/>')
    return wrap("".join(s))

# ---------- 3) Art-Deco symmetric ----------
def v3(p):
    BG="#123b3a";GOLD="#d8a94b";GOLD_D="#b98a35";CREAM="#efe2c4";DK="#0d2a29"
    s=[f'<rect width="{W}" height="{Hh}" fill="{BG}"/>']
    # deco border frame with stepped corners
    s.append(f'<rect x="14" y="14" width="{W-28}" height="{Hh-28}" fill="none" stroke="{GOLD}" stroke-width="2"/>')
    s.append(f'<rect x="20" y="20" width="{W-40}" height="{Hh-40}" fill="none" stroke="{GOLD_D}" stroke-width="1"/>')
    # symmetric stepped sunrise fan (centre)
    cx,cy=150,232
    for k,rr in enumerate(range(150,40,-22)):
        col=GOLD if k%2==0 else GOLD_D
        s.append(f'<path d="M{cx-rr} {cy} A {rr} {rr} 0 0 1 {cx+rr} {cy} Z" fill="{col}" opacity="0.9"/>')
    s.append(f'<path d="M{cx-40} {cy} A 40 40 0 0 1 {cx+40} {cy} Z" fill="{CREAM}"/>')
    # deco rays above the fan (thin symmetric spokes)
    for a in (-62,-40,-20,0,20,40,62):
        rad=math.radians(a-90);x2=cx+math.cos(rad)*118;y2=cy+math.sin(rad)*118
        s.append(f'<line x1="{cx}" y1="{cy-2}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{GOLD}" stroke-width="2.2" opacity="0.7"/>')
    # stylised wheat sheaf at the horizon (symmetric)
    def stalk(dx,ln,rot):
        x=cx+dx;return f'<g transform="rotate({rot} {x} {cy}) "><rect x="{x-1.4}" y="{cy-ln}" width="2.8" height="{ln}" fill="{GOLD_D}"/>'+"".join(f'<ellipse cx="{x}" cy="{cy-ln+8+j*7}" rx="4" ry="2.4" fill="{GOLD}"/>' for j in range(4))+'</g>'
    for dx,ln,rot in ((-30,52,-16),(-15,60,-8),(0,66,0),(15,60,8),(30,52,16)):
        s.append(stalk(dx,ln,rot))
    # base band
    s.append(f'<rect x="20" y="{cy}" width="{W-40}" height="{Hh-40-cy}" fill="{DK}"/>')
    s.append(T(150,300,15,"◆",GOLD,ls="0"))
    s.append(T(150,352,40,"INDIANA",CREAM,fam="Georgia, serif",w="700",ls="8"))
    s.append(T(150,376,10,"CROSSROADS OF AMERICA",GOLD,fam="Georgia, serif",w="400",ls="6"))
    return wrap("".join(s))

# ---------- 4) Isometric 'Crossroads' (Pohl pole) ----------
def v4(p):
    BG="#e7ddc7";ROAD="#6d6a63";ROAD_L="#8a877e";CORN="#c9a24b";CORN_D="#a9863a"
    SOY="#7d8a4f";SOY_D="#657045";BARN="#a6432b";BD="#83341f";SILO="#d9c9a8";INK="#26281f";CREAM="#efe7d6"
    C30=math.cos(math.radians(30));S30=math.sin(math.radians(30))
    ox,oy,sc=150,150,20
    def P(x,y,z=0): return (ox+(x-y)*C30*sc, oy+((x+y)*S30-z)*sc)
    def face(pts,col,st="none",sw=0):
        d=" ".join(f"{a:.1f},{b:.1f}" for a,b in pts);return f'<polygon points="{d}" fill="{col}" stroke="{st}" stroke-width="{sw}"/>'
    s=[f'<rect width="{W}" height="{Hh}" fill="{BG}"/>']
    # four field quadrants (diamonds) + roads crossing
    # quadrant fields
    def tile(x0,y0,x1,y1,col,cold,rows):
        s.append(face([P(x0,y0),P(x1,y0),P(x1,y1),P(x0,y1)],col))
        for r in range(1,rows):
            t=r/rows;s.append(f'<line x1="{P(x0,y0+(y1-y0)*t)[0]:.1f}" y1="{P(x0,y0+(y1-y0)*t)[1]:.1f}" x2="{P(x1,y0+(y1-y0)*t)[0]:.1f}" y2="{P(x1,y0+(y1-y0)*t)[1]:.1f}" stroke="{cold}" stroke-width="1" opacity="0.6"/>')
    tile(-6,-6,-0.7,-0.7,CORN,CORN_D,6)
    tile(0.7,-6,6,-0.7,SOY,SOY_D,6)
    tile(-6,0.7,-0.7,6,SOY,SOY_D,6)
    tile(0.7,0.7,6,6,CORN,CORN_D,6)
    # roads (cross) — the 'crossroads'
    s.append(face([P(-6,-0.7),P(6,-0.7),P(6,0.7),P(-6,0.7)],ROAD))
    s.append(face([P(-0.7,-6),P(0.7,-6),P(0.7,6),P(-0.7,6)],ROAD))
    # dashed centre-lines
    for t in [i*0.5 for i in range(-11,12)]:
        a=P(t,0);b=P(t+0.28,0);s.append(f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" stroke="{CREAM}" stroke-width="1.2"/>')
        a=P(0,t);b=P(0,t+0.28);s.append(f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" stroke="{CREAM}" stroke-width="1.2"/>')
    # a barn + silo prism on the far corn quadrant
    def box(gx,gy,w,d,h,col):
        top=mul(col,1.28);Lf=mul(col,0.72);Rf=mul(col,0.92)
        s.append(face([P(gx,gy,h),P(gx+w,gy,h),P(gx+w,gy+d,h),P(gx,gy+d,h)],top))
        s.append(face([P(gx,gy,0),P(gx,gy+d,0),P(gx,gy+d,h),P(gx,gy,h)],Lf))
        s.append(face([P(gx,gy,0),P(gx+w,gy,0),P(gx+w,gy,h),P(gx,gy,h)],Rf))
    box(-4.4,-4.4,2.2,1.4,1.6,BARN)
    # roof ridge on barn
    a=P(-4.4,-3.7,1.6);b=P(-2.2,-3.7,2.3);c=P(-2.2,-4.4,2.3);e=P(-4.4,-4.4,1.6)
    s.append(face([a,b,c,e],BD));a2=P(-2.2,-3.7,2.3);b2=P(-2.2,-3.7,1.6)
    box(-2.0,-4.2,0.8,0.8,2.0,SILO)
    # title band
    s.append(f'<rect y="345" width="{W}" height="75" fill="{INK}"/><rect x="24" y="356" width="252" height="2" fill="{CORN}"/>')
    s.append(T(150,392,42,"INDIANA",CREAM,ls="4"));s.append(T(150,410,10.5,"CROSSROADS OF AMERICA",CORN,w="400",ls="5"))
    return wrap("".join(s))

# ---------- 5) Duotone blockprint (treatment lane) ----------
def v5(p):
    NAVY="#1c2b46";CREAM="#f2e4ba";CREAM_D="#e0cf9e"
    s=[f'<defs><filter id="{p}g" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0"/></filter></defs>']
    s.append(f'<rect width="{W}" height="{Hh}" fill="{CREAM}"/>')
    s.append(f'<rect width="{W}" height="252" fill="{NAVY}"/>')
    cx,cy=150,120
    # bold tapered cream ray-wedges (woodcut sunburst)
    for k in range(14):
        a=k*2*math.pi/14
        ix=cx+math.cos(a)*48; iy=cy+math.sin(a)*48; ox2=cx+math.cos(a)*140; oy2=cy+math.sin(a)*140
        pxi=math.cos(a+math.pi/2)*2.4; pyi=math.sin(a+math.pi/2)*2.4
        pxo=math.cos(a+math.pi/2)*7.0; pyo=math.sin(a+math.pi/2)*7.0
        s.append(f'<polygon points="{ix-pxi:.1f},{iy-pyi:.1f} {ox2-pxo:.1f},{oy2-pyo:.1f} {ox2+pxo:.1f},{oy2+pyo:.1f} {ix+pxi:.1f},{iy+pyi:.1f}" fill="{CREAM}"/>')
    s.append(f'<circle cx="{cx}" cy="{cy}" r="46" fill="{CREAM}"/>')
    for rr in (38,29,20):
        s.append(f'<circle cx="{cx}" cy="{cy}" r="{rr}" fill="none" stroke="{NAVY}" stroke-width="2.4"/>')
    # cream land + a navy ridge
    s.append(f'<path d="M0 252 C 80 238 220 238 300 252 L300 300 L0 300 Z" fill="{NAVY}"/>')
    # bold blockprint corn — droop leaves + tassel, clearly corn
    for i in range(9):
        x=22+i*32
        s.append(f'<path d="M{x} 344 L{x} 300 M{x} 300 l-4 -8 M{x} 300 l4 -8 M{x} 300 l0 -9" stroke="{NAVY}" stroke-width="2.2" fill="none" stroke-linecap="round"/>')  # tassel
        s.append(f'<path d="M{x} 316 q-13 2 -16 14 M{x} 324 q13 2 16 14 M{x} 332 q-12 2 -14 12" stroke="{NAVY}" stroke-width="2.4" fill="none" stroke-linecap="round"/>')  # drooping leaves
        s.append(f'<ellipse cx="{x+5}" cy="322" rx="3.2" ry="6" fill="{NAVY}"/>')  # cob
    s.append(f'<rect y="344" width="{W}" height="76" fill="{NAVY}"/>')
    s.append(f'<rect x="24" y="355" width="252" height="2" fill="{CREAM_D}"/>')
    s.append(T(150,390,44,"INDIANA",CREAM,fam="Georgia, serif",w="700",ls="3"))
    s.append(T(150,409,10.5,"CROSSROADS OF AMERICA",CREAM_D,fam="Georgia, serif",w="400",ls="5"))
    # light grain, sky only
    s.append(f'<rect width="{W}" height="252" filter="url(#{p}g)" opacity="0.12"/>')
    return wrap("".join(s))

VARS=[("v1","WPA narrative","warm dusk, sunburst, barn — the classic travel-poster idiom",v1),
      ("v2","Swiss / subtractive","one sun, one hill, one barn, huge negative space (Favre pole)",v2),
      ("v3","Art-Deco symmetric","stepped sunrise fan, wheat sheaf, gold border — ornate & symmetric",v3),
      ("v4","Isometric 'Crossroads'","the motto made literal — iso crossing roads + crop quadrants (Pohl pole)",v4),
      ("v5","Duotone blockprint","two inks + grain + carved marks — the treatment lane, woodcut feel",v5)]
for key,name,desc,fn in VARS:
    open(f"{key}.svg","w").write(fn(key))
WIN={"v5":"★ FAVOURITE · duotone","v2":"② 2ND · Swiss"}
def badge(k): return f'<span class="badge">{WIN[k]}</span>' if k in WIN else ''
cards="".join(f'<figure class="{"win" if key in WIN else ""}"><div class="p">{fn(key)}</div><figcaption>{badge(key)}<b>{name}</b><span>{desc}</span></figcaption></figure>' for key,name,desc,fn in VARS)
HTML=f'''<!doctype html><html><head><meta charset="utf-8"><title>Indiana — five leans</title><style>
body{{margin:0;background:#181613;color:#efe7d6;font-family:system-ui,sans-serif}}
h1{{text-align:center;font-weight:600;padding:34px 0 4px;font-size:24px}}
.sub{{text-align:center;color:#b7ac97;margin:0 0 24px;font-size:13px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:26px;max-width:1180px;margin:0 auto;padding:0 26px 60px}}
figure{{margin:0}} .p svg{{width:100%;height:auto;display:block;border-radius:6px;box-shadow:0 6px 26px #0009}}
figcaption{{padding:10px 2px}} figcaption b{{display:block;font-size:14px}} figcaption span{{display:block;color:#b7ac97;font-size:11.5px;margin-top:2px;line-height:1.4}}
 .win .p svg{{outline:2.5px solid #f4c95d;outline-offset:3px}} .badge{{display:inline-block;background:#f4c95d;color:#1a1712;font-size:9px;font-weight:700;letter-spacing:0.5px;padding:2px 8px;border-radius:9px;margin-bottom:5px}}
</style></head><body><h1>Indiana — five leans, one skill</h1>
<p class="sub">Same subject, five leans. <b>★ duotone = the favourite; ② Swiss = second</b> — the two banked winners; the rest were not picked.</p>
<div class="grid">{cards}</div></body></html>'''
open("variations.html","w").write(HTML)
print(f"wrote variations.html + {len(VARS)} svgs")

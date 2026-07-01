#!/usr/bin/env python3
"""NASA → Mars poster — FIVE leans, same subject. Fully code-built SVG.
Includes the two validated leans (Swiss-subtractive, duotone-blockprint) plus three
space-appropriate directions. Run: python3 mars_variations.py -> m1..m5.svg + mars.html
Leans: 1 Swiss/subtractive · 2 Duotone blockprint · 3 Retro NASA space-age ·
       4 Blueprint/technical trajectory · 5 Isometric Mars base (Pohl).
"""
import math
W,Hh=300,420
def mul(h,f):
    h=h.lstrip("#"); r,g,b=(int(h[i:i+2],16) for i in (0,2,4))
    return "#%02x%02x%02x"%tuple(max(0,min(255,int(c*f))) for c in (r,g,b))
def T(x,y,s,txt,fill,fam="Georgia, serif",w="700",ls="4",anchor="middle"):
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-family="{fam}" font-weight="{w}" font-size="{s}" letter-spacing="{ls}" fill="{fill}">{txt}</text>'
def wrap(inner): return f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{Hh}" viewBox="0 0 {W} {Hh}">{inner}</svg>'
def stars(seed,n,x0,y0,x1,y1,col,rmax=1.3):
    s=[];v=seed
    for _ in range(n):
        v=(v*1103515245+12345)&0x7fffffff;fx=x0+(v%1000)/1000*(x1-x0)
        v=(v*1103515245+12345)&0x7fffffff;fy=y0+(v%1000)/1000*(y1-y0)
        v=(v*1103515245+12345)&0x7fffffff;r=0.5+(v%100)/100*rmax
        s.append(f'<circle cx="{fx:.1f}" cy="{fy:.1f}" r="{r:.1f}" fill="{col}" opacity="0.85"/>')
    return "".join(s)

# ---------- 1) Swiss / subtractive ----------
def m1(p):
    BG="#141019";MARS="#c1502e";MARS_D="#7f3320";CAP="#e9ddc9";CREAM="#efe7d6";DUST="#d98a5a"
    s=[f'<defs><clipPath id="{p}c"><circle cx="206" cy="150" r="94"/></clipPath></defs>']
    s.append(f'<rect width="{W}" height="{Hh}" fill="{BG}"/>')
    s.append(stars(7,46,10,10,300,300,CREAM,1.1))
    s.append(f'<circle cx="206" cy="150" r="94" fill="{MARS}"/>')
    s.append(f'<g clip-path="url(#{p}c)"><circle cx="252" cy="182" r="104" fill="{MARS_D}" opacity="0.55"/>')
    s.append(f'<ellipse cx="176" cy="120" rx="26" ry="12" fill="{MARS_D}" opacity="0.35"/>')
    s.append(f'<ellipse cx="206" cy="66" rx="30" ry="13" fill="{CAP}" opacity="0.85"/></g>')
    # thin trajectory arc from lower-left up to Mars + a tiny rocket
    s.append(f'<path d="M20 372 Q 60 250 150 214 T 206 150" fill="none" stroke="{CREAM}" stroke-width="1.4" stroke-dasharray="2 5" opacity="0.8"/>')
    rx,ry=150,214
    s.append(f'<g transform="translate({rx} {ry}) rotate(-32)"><path d="M0 -7 L3 4 L0 2 L-3 4 Z" fill="{CREAM}"/><circle cx="0" cy="-2" r="1.3" fill="{DUST}"/></g>')
    # flush-left type
    s.append(T(28,352,52,"MARS",CREAM,fam="Helvetica, Arial, sans-serif",w="700",ls="2",anchor="start"))
    s.append(T(30,374,10.5,"NASA · TO THE RED PLANET",DUST,fam="Helvetica, Arial, sans-serif",w="700",ls="3",anchor="start"))
    s.append(f'<line x1="30" y1="360" x2="252" y2="360" stroke="{MARS}" stroke-width="1.5"/>')
    return wrap("".join(s))

# ---------- 2) Duotone blockprint ----------
def m2(p):
    NAVY="#161a33";AMBER="#f0c159";AMBER_D="#d3a53c"
    s=[f'<defs><filter id="{p}g" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0"/></filter></defs>']
    s.append(f'<rect width="{W}" height="{Hh}" fill="{NAVY}"/>')
    s.append(stars(11,40,10,10,290,330,AMBER,1.2))
    # Mars disc, amber, carved rings, upper-right
    mx,my=214,104
    s.append(f'<circle cx="{mx}" cy="{my}" r="46" fill="{AMBER}"/>')
    for rr in (38,29,20): s.append(f'<circle cx="{mx}" cy="{my}" r="{rr}" fill="none" stroke="{NAVY}" stroke-width="2.2"/>')
    # bold rocket ascending, centre-left, amber silhouette + navy carved detail
    rx=110
    s.append(f'<path d="M{rx} 120 q14 26 14 74 l-28 0 q0 -48 14 -74 Z" fill="{AMBER}"/>')      # body
    s.append(f'<circle cx="{rx}" cy="176" r="7" fill="{NAVY}"/>')                                # window
    s.append(f'<path d="M{rx-14} 194 l-12 20 l16 -6 l10 0 Z" fill="{AMBER}"/><path d="M{rx+14} 194 l12 20 l-16 -6 l-10 0 Z" fill="{AMBER}"/>')  # fins
    s.append(f'<path d="M{rx-9} 214 q9 22 9 22 q0 0 9 -22 Z" fill="{AMBER}"/>')                  # nozzle+flame
    s.append(f'<path d="M{rx} 120 q6 12 8 30 M{rx} 120 q-6 12 -8 30" stroke="{NAVY}" stroke-width="1.6" fill="none"/>')  # carved lines
    # title
    s.append(f'<rect y="344" width="{W}" height="76" fill="{NAVY}"/><rect x="24" y="355" width="252" height="2" fill="{AMBER_D}"/>')
    s.append(T(150,390,44,"MARS",AMBER,fam="Georgia, serif",w="700",ls="6"))
    s.append(T(150,409,10.5,"NASA · JOURNEY TO MARS",AMBER_D,fam="Georgia, serif",w="400",ls="4"))
    s.append(f'<rect width="{W}" height="344" filter="url(#{p}g)" opacity="0.1"/>')
    return wrap("".join(s))

# ---------- 3) Retro NASA space-age (JPL 'Visions of the Future') ----------
def m3(p):
    s=[f'<defs><linearGradient id="{p}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a3b4e"/><stop offset="0.6" stop-color="#c56a44"/><stop offset="1" stop-color="#e39a5e"/></linearGradient></defs>']
    GROUND="#a6432b";GROUND_D="#8a341f";DUNE="#bd5a34";DOME="#e7ddc9";DOME_S="#c9bfa7";GLASS="#6fa0b3";MOON="#d9c3a8";CREAM="#f0e6d2";RUST="#7a2f1c"
    s.append(f'<rect width="{W}" height="248" fill="url(#{p}sky)"/>')
    s.append(f'<circle cx="70" cy="70" r="18" fill="{MOON}"/><circle cx="242" cy="52" r="10" fill="{MOON}" opacity="0.8"/>')
    s.append(stars(5,26,10,10,290,150,CREAM,0.9))
    # layered dunes
    s.append(f'<path d="M0 210 C 70 190 150 214 300 196 L300 260 L0 260 Z" fill="{DUNE}"/>')
    s.append(f'<path d="M0 236 C 90 220 210 246 300 230 L300 300 L0 300 Z" fill="{GROUND}"/>')
    # domed base: two glass domes + connecting tube
    def dome(cx,base,rw,rh):
        return (f'<ellipse cx="{cx}" cy="{base}" rx="{rw}" ry="{rw*0.28:.0f}" fill="{DOME_S}"/>'
                f'<path d="M{cx-rw} {base} A {rw} {rh} 0 0 1 {cx+rw} {base} Z" fill="{GLASS}" opacity="0.55"/>'
                f'<path d="M{cx-rw} {base} A {rw} {rh} 0 0 1 {cx+rw} {base}" fill="none" stroke="{DOME}" stroke-width="2.4"/>'
                f'<line x1="{cx}" y1="{base-rh}" x2="{cx}" y2="{base}" stroke="{DOME}" stroke-width="1.2" opacity="0.7"/>')
    s.append(f'<rect x="96" y="232" width="60" height="8" fill="{DOME_S}"/>')  # tube
    s.append(dome(84,238,30,30))
    s.append(dome(168,240,22,22))
    # a little rover in the distance
    rvx=232
    s.append(f'<rect x="{rvx}" y="228" width="22" height="9" rx="2" fill="{RUST}"/><circle cx="{rvx+5}" cy="238" r="3.2" fill="{RUST}"/><circle cx="{rvx+17}" cy="238" r="3.2" fill="{RUST}"/><rect x="{rvx+7}" y="222" width="9" height="6" fill="{RUST}"/>')
    # antenna
    s.append(f'<line x1="120" y1="232" x2="120" y2="204" stroke="{DOME}" stroke-width="1.6"/><circle cx="120" cy="203" r="2.4" fill="{CREAM}"/>')
    # title band retro
    s.append(f'<rect y="300" width="{W}" height="120" fill="{RUST}"/>')
    s.append(f'<rect x="26" y="316" width="248" height="1.5" fill="{DOME}"/><rect x="26" y="360" width="248" height="1.5" fill="{DOME}"/>')
    s.append(T(150,352,50,"MARS",CREAM,fam="Georgia, serif",w="700",ls="10"))
    s.append(T(150,386,10.5,"NASA · EXPLORE THE RED PLANET",MOON,fam="Georgia, serif",w="400",ls="2"))
    return wrap("".join(s))

# ---------- 4) Blueprint / technical trajectory ----------
def m4(p):
    NAVY="#0e2947";GRID="#183a5e";LINE="#cfe6ff";EARTH="#4a8fd0";MARS="#d0714a";SUN="#f0c95a";CREAM="#e6f1ff";MONO="ui-monospace, 'DejaVu Sans Mono', monospace"
    s=[f'<rect width="{W}" height="{Hh}" fill="{NAVY}"/>']
    for gx in range(0,W+1,24): s.append(f'<line x1="{gx}" y1="0" x2="{gx}" y2="345" stroke="{GRID}" stroke-width="0.6"/>')
    for gy in range(0,346,24): s.append(f'<line x1="0" y1="{gy}" x2="{W}" y2="{gy}" stroke="{GRID}" stroke-width="0.6"/>')
    sx,sy=150,210;r1,r2=66,120
    # orbits
    s.append(f'<circle cx="{sx}" cy="{sy}" r="{r1}" fill="none" stroke="{LINE}" stroke-width="1" opacity="0.55"/>')
    s.append(f'<circle cx="{sx}" cy="{sy}" r="{r2}" fill="none" stroke="{LINE}" stroke-width="1" opacity="0.4"/>')
    # transfer ellipse (dashed) — perihelion at Earth orbit (left), aphelion at Mars orbit (right)
    a=(r1+r2)/2;c=(r2-r1)/2;b=math.sqrt(a*a-c*c)
    s.append(f'<ellipse cx="{sx+c}" cy="{sy}" rx="{a}" ry="{b:.1f}" fill="none" stroke="{CREAM}" stroke-width="1.6" stroke-dasharray="5 4"/>')
    # sun, earth (perihelion left), mars (aphelion right)
    s.append(f'<circle cx="{sx}" cy="{sy}" r="9" fill="{SUN}"/>')
    ex,ey=sx-r1,sy;mx,my=sx+r2,sy
    s.append(f'<circle cx="{ex}" cy="{ey}" r="6" fill="{EARTH}"/><circle cx="{mx}" cy="{my}" r="8" fill="{MARS}"/>')
    # rocket marker on transfer (top of ellipse)
    tx,ty=sx+c,sy-b
    s.append(f'<g transform="translate({tx} {ty:.1f}) rotate(90)"><path d="M0 -6 L3 4 L-3 4 Z" fill="{CREAM}"/></g>')
    # crosshair ticks on sun
    s.append(f'<line x1="{sx-14}" y1="{sy}" x2="{sx+14}" y2="{sy}" stroke="{LINE}" stroke-width="0.7" opacity="0.6"/><line x1="{sx}" y1="{sy-14}" x2="{sx}" y2="{sy+14}" stroke="{LINE}" stroke-width="0.7" opacity="0.6"/>')
    # labels (monospace)
    s.append(T(ex,ey+20,9,"EARTH",EARTH,fam=MONO,w="400",ls="1"))
    s.append(T(mx,my-14,9,"MARS",MARS,fam=MONO,w="400",ls="1"))
    s.append(T(sx,sy+22,8,"SUN",SUN,fam=MONO,w="400",ls="1"))
    s.append(T(sx+c,sy-b-8,8,"HOHMANN TRANSFER · ~259 d",CREAM,fam=MONO,w="400",ls="0.5"))
    s.append(T(20,26,8,"FIG. 1 — EARTH→MARS TRANSFER ORBIT",mul(LINE,0.9),fam=MONO,w="400",ls="0.5",anchor="start"))
    # title band
    s.append(f'<rect y="345" width="{W}" height="75" fill="#0a1e35"/><rect x="24" y="356" width="252" height="1.5" fill="{MARS}"/>')
    s.append(T(150,388,26,"MARS TRANSFER",CREAM,fam=MONO,w="700",ls="1"))
    s.append(T(150,406,8.5,"NASA · MISSION TRAJECTORY",mul(LINE,0.85),fam=MONO,w="400",ls="3"))
    return wrap("".join(s))

# ---------- 5) Isometric Mars base (Pohl) ----------
def m5(p):
    s=[f'<defs><linearGradient id="{p}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a2b34"/><stop offset="1" stop-color="#c96b41"/></linearGradient></defs>']
    GROUND="#b4552f";GROUND_T="#c96b41";GROUND_L="#8f3f22";DOME="#dfe6ea";DOME_G="#7fa6b5";PANEL="#2f3b63";PANEL_T="#3f4f83";METAL="#c9c2b4";METAL_D="#9a9384";RUST="#7a2f1c";CREAM="#f0e6d2";FLAME="#f0a24e"
    s.append(f'<rect width="{W}" height="345" fill="#2a1119"/>')
    s.append(f'<rect width="{W}" height="248" fill="url(#{p}sky)"/>')
    s.append(f'<circle cx="240" cy="58" r="14" fill="#d9c3a8"/>')
    s.append(stars(9,22,10,10,290,140,CREAM,0.8))
    C30=math.cos(math.radians(30));S30=math.sin(math.radians(30));ox,oy,sc=150,196,22
    def P(x,y,z=0): return (ox+(x-y)*C30*sc, oy+((x+y)*S30-z)*sc)
    def face(pts,col): return f'<polygon points="{" ".join(f"{a:.1f},{b:.1f}" for a,b in pts)}" fill="{col}"/>'
    # ground diamond
    s.append(face([P(-5,-5),P(5,-5),P(5,5),P(-5,5)],GROUND))
    for g in range(-4,5):
        s.append(f'<line x1="{P(g,-5)[0]:.1f}" y1="{P(g,-5)[1]:.1f}" x2="{P(g,5)[0]:.1f}" y2="{P(g,5)[1]:.1f}" stroke="{GROUND_L}" stroke-width="0.6" opacity="0.5"/>')
        s.append(f'<line x1="{P(-5,g)[0]:.1f}" y1="{P(-5,g)[1]:.1f}" x2="{P(5,g)[0]:.1f}" y2="{P(5,g)[1]:.1f}" stroke="{GROUND_L}" stroke-width="0.6" opacity="0.5"/>')
    def box(gx,gy,w,d,h,col):
        top=mul(col,1.28);Lf=mul(col,0.72);Rf=mul(col,0.92)
        return (face([P(gx,gy,h),P(gx+w,gy,h),P(gx+w,gy+d,h),P(gx,gy+d,h)],top)
               +face([P(gx,gy,0),P(gx,gy+d,0),P(gx,gy+d,h),P(gx,gy,h)],Lf)
               +face([P(gx,gy,0),P(gx+w,gy,0),P(gx+w,gy,h),P(gx,gy,h)],Rf))
    def dome(gx,gy,rg,hd):
        cx,cy=P(gx,gy,0)
        rx=rg*sc*1.15;ry=rg*sc*0.58
        base=f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="{DOME_G}"/>'
        d=f'<path d="M{cx-rx:.1f} {cy:.1f} A {rx:.1f} {rg*sc*1.15:.1f} 0 0 1 {cx+rx:.1f} {cy:.1f} Z" fill="{DOME}" opacity="0.9"/>'
        rim=f'<path d="M{cx-rx:.1f} {cy:.1f} A {rx:.1f} {rg*sc*1.15:.1f} 0 0 1 {cx+rx:.1f} {cy:.1f}" fill="none" stroke="{DOME_G}" stroke-width="1.6"/>'
        return base+d+rim
    # solar panels (tilted flat rects) back-left
    for i in range(2):
        gx=-4+ i*1.6
        s.append(face([P(gx,-3.6,0.4),P(gx+1.3,-3.6,0.4),P(gx+1.3,-2.4,0.9),P(gx,-2.4,0.9)],PANEL))
    # connecting tube + two domes
    s.append(box(-1.6,-1.0,3.2,0.5,0.5,METAL))       # tube
    s.append(dome(-2.4,-1.4,1.5,1.5))
    s.append(dome(1.8,0.0,1.1,1.1))
    # lander (box on legs + nozzle) front-right
    s.append(box(2.2,2.2,1.4,1.4,1.4,METAL_D))
    lx,ly=P(2.9,2.9,0)
    s.append(f'<path d="M{lx-6:.1f} {ly:.1f} l-7 12 M{lx+6:.1f} {ly:.1f} l7 12" stroke="{METAL_D}" stroke-width="2" fill="none"/>')
    s.append(f'<path d="M{lx-4:.1f} {P(2.9,2.9,0)[1]-2:.1f} l8 0 l-2 6 l-4 0 Z" fill="{RUST}"/>')
    # flag/antenna
    fx,fy=P(-3.5,3.5,0)
    s.append(f'<line x1="{fx:.1f}" y1="{fy:.1f}" x2="{fx:.1f}" y2="{fy-30:.1f}" stroke="{METAL}" stroke-width="1.6"/><rect x="{fx:.1f}" y="{fy-30:.1f}" width="14" height="9" fill="{RUST}"/>')
    # title
    s.append(f'<rect y="345" width="{W}" height="75" fill="#1c1220"/><rect x="24" y="356" width="252" height="2" fill="{GROUND_T}"/>')
    s.append(T(150,390,40,"MARS BASE",CREAM,ls="3"))
    s.append(T(150,409,10,"NASA · FIRST SETTLEMENT",GROUND_T,w="400",ls="4"))
    return wrap("".join(s))

VARS=[("m1","Swiss / subtractive","one huge Mars, a whisper of a trajectory, deep-space negative space (validated lean)",m1),
      ("m2","Duotone blockprint","two inks + carved rings + grain, a bold ascending rocket (validated lean)",m2),
      ("m3","Retro NASA space-age","JPL 'Visions of the Future' — glass domes, dunes, two moons, warm dusk",m3),
      ("m4","Blueprint / technical","the Earth→Mars transfer orbit as a schematic; monospace, engineering register",m4),
      ("m5","Isometric Mars base","the settlement built from an iso projection — domes, lander, panels (Pohl pole)",m5)]
for key,name,desc,fn in VARS:
    open(f"{key}.svg","w").write(fn(key))
cards="".join(f'<figure><div class="p">{fn(key)}</div><figcaption><b>{name}</b><span>{desc}</span></figcaption></figure>' for key,name,desc,fn in VARS)
HTML=f'''<!doctype html><html><head><meta charset="utf-8"><title>NASA → Mars — five leans</title><style>
body{{margin:0;background:#0d0b12;color:#efe7d6;font-family:system-ui,sans-serif}}
h1{{text-align:center;font-weight:600;padding:34px 0 4px;font-size:24px}}
.sub{{text-align:center;color:#9a90a7;margin:0 0 24px;font-size:13px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:26px;max-width:1180px;margin:0 auto;padding:0 26px 60px}}
figure{{margin:0}} .p svg{{width:100%;height:auto;display:block;border-radius:6px;box-shadow:0 6px 26px #000a}}
figcaption{{padding:10px 2px}} figcaption b{{display:block;font-size:14px}} figcaption span{{display:block;color:#9a90a7;font-size:11.5px;margin-top:2px;line-height:1.4}}
</style></head><body><h1>NASA → Mars — five leans, one skill</h1>
<p class="sub">Same subject, five directions. Two are the validated leans you liked; three suit the space brief.</p>
<div class="grid">{cards}</div></body></html>'''
open("mars.html","w").write(HTML)
print(f"wrote mars.html + {len(VARS)} svgs")

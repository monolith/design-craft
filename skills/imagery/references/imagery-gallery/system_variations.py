#!/usr/bin/env python3
"""'Smart solar home — how it works' — a SYSTEM/explainer brief, not a hero poster.
Shows a different lean winning: isometric (built for systems) vs blueprint vs flat-diagram,
with Swiss-subtractive as a foil that DELETES the system. Run: python3 system_variations.py
Leans: 1 Isometric (Pohl) · 2 Blueprint/technical · 3 Flat diagram · 4 Swiss/subtractive (foil).
"""
import math
W,Hh=300,420
def mul(h,f):
    h=h.lstrip("#"); r,g,b=(int(h[i:i+2],16) for i in (0,2,4))
    return "#%02x%02x%02x"%tuple(max(0,min(255,int(c*f))) for c in (r,g,b))
def T(x,y,s,txt,fill,fam="Georgia, serif",w="700",ls="4",anchor="middle"):
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-family="{fam}" font-weight="{w}" font-size="{s}" letter-spacing="{ls}" fill="{fill}">{txt}</text>'
def wrap(inner): return f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{Hh}" viewBox="0 0 {W} {Hh}">{inner}</svg>'

# ---------- 1) Isometric (Pohl) — the winner for a system brief ----------
def s1(p):
    SKY0="#bfe0e6";SKY1="#e9eef0";GRASS="#8bab5a";GRASS_D="#6f9047";WALL="#e7dcc6";DOOR="#a6432b"
    ROOF="#7a4a3a";PANEL="#26314f";PANEL_L="#3a4a74";BATT="#d8853a";CAR="#3c6e8f";CHG="#4e5c38"
    METAL="#c9c2b4";INK="#26281f";CREAM="#f0e6d2";FLOW="#f0b84e"
    s=[f'<defs><linearGradient id="{p}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{SKY0}"/><stop offset="1" stop-color="{SKY1}"/></linearGradient></defs>']
    s.append(f'<rect width="{W}" height="345" fill="url(#{p}sky)"/>')
    # sun
    s.append(f'<circle cx="248" cy="60" r="24" fill="#f4c95d"/>')
    for k in range(10):
        a=k*math.pi/5;s.append(f'<line x1="{248+math.cos(a)*30:.1f}" y1="{60+math.sin(a)*30:.1f}" x2="{248+math.cos(a)*40:.1f}" y2="{60+math.sin(a)*40:.1f}" stroke="#f4c95d" stroke-width="2.4" stroke-linecap="round"/>')
    C30=math.cos(math.radians(30));S30=math.sin(math.radians(30));ox,oy,sc=150,180,26
    def P(x,y,z=0): return (ox+(x-y)*C30*sc, oy+((x+y)*S30-z)*sc)
    def face(pts,col,op=1.0): return f'<polygon points="{" ".join(f"{a:.1f},{b:.1f}" for a,b in pts)}" fill="{col}" opacity="{op}"/>'
    def quadpt(A,B,Cc,D,u,v):
        ab=(A[0]+(B[0]-A[0])*u,A[1]+(B[1]-A[1])*u);dc=(D[0]+(Cc[0]-D[0])*u,D[1]+(Cc[1]-D[1])*u)
        return (ab[0]+(dc[0]-ab[0])*v,ab[1]+(dc[1]-ab[1])*v)
    # ground
    s.append(face([P(-4.6,-4.6),P(4.6,-4.6),P(4.6,4.6),P(-4.6,4.6)],GRASS))
    # driveway strip (front-right)
    s.append(face([P(1.4,3.2),P(4.4,3.2),P(4.4,4.4),P(1.4,4.4)],mul(GRASS_D,0.9)))
    # --- house body ---
    gx,gy,w,d,h=-2.2,-2.2,3.2,2.6,2.0
    top=mul(WALL,1.24);Lf=mul(WALL,0.74);Rf=mul(WALL,0.92)
    s.append(face([P(gx,gy,0),P(gx,gy+d,0),P(gx,gy+d,h),P(gx,gy,h)],Lf))       # left wall
    s.append(face([P(gx,gy+d,0),P(gx+w,gy+d,0),P(gx+w,gy+d,h),P(gx,gy+d,h)],Rf)) # right wall (front)
    # door + windows on front wall (right face)
    Fr=[P(gx,gy+d,0),P(gx+w,gy+d,0),P(gx+w,gy+d,h),P(gx,gy+d,h)]
    dr=[quadpt(Fr[0],Fr[1],Fr[2],Fr[3],0.12,1),quadpt(Fr[0],Fr[1],Fr[2],Fr[3],0.32,1),quadpt(Fr[0],Fr[1],Fr[2],Fr[3],0.32,0.45),quadpt(Fr[0],Fr[1],Fr[2],Fr[3],0.12,0.45)]
    s.append(face(dr,DOOR))
    for wu in (0.55,0.8):
        win=[quadpt(Fr[0],Fr[1],Fr[2],Fr[3],wu,0.4),quadpt(Fr[0],Fr[1],Fr[2],Fr[3],wu+0.13,0.4),quadpt(Fr[0],Fr[1],Fr[2],Fr[3],wu+0.13,0.7),quadpt(Fr[0],Fr[1],Fr[2],Fr[3],wu,0.7)]
        s.append(face(win,PANEL_L))
    # --- gable roof (ridge along x) ---
    A=P(gx,gy,h);B=P(gx+w,gy,h);Cc=P(gx+w,gy+d,h);Dp=P(gx,gy+d,h)
    R1=P(gx,gy+d/2,h+1.4);R2=P(gx+w,gy+d/2,h+1.4)
    s.append(face([Dp,Cc,R2,R1],mul(ROOF,0.9)))     # front slope
    s.append(face([A,B,R2,R1],mul(ROOF,1.15)))      # back slope (visible top)
    s.append(face([A,Dp,R1],mul(ROOF,1.0)))         # left gable
    # solar panels on the back (sun-facing) slope
    Sl=[A,B,R2,R1]  # quad
    for gu in range(3):
        for gv in range(2):
            u0=0.1+gu*0.28;v0=0.15+gv*0.4
            pn=[quadpt(*Sl,u0,v0),quadpt(*Sl,u0+0.22,v0),quadpt(*Sl,u0+0.22,v0+0.3),quadpt(*Sl,u0,v0+0.3)]
            s.append(face(pn,PANEL))
            s.append(f'<polygon points="{" ".join(f"{a:.1f},{b:.1f}" for a,b in pn)}" fill="none" stroke="{PANEL_L}" stroke-width="0.7"/>')
    # --- battery wall unit (left of house) ---
    def box(gx,gy,w,d,h,col):
        return (face([P(gx,gy,h),P(gx+w,gy,h),P(gx+w,gy+d,h),P(gx,gy+d,h)],mul(col,1.26))
               +face([P(gx,gy,0),P(gx,gy+d,0),P(gx,gy+d,h),P(gx,gy,h)],mul(col,0.74))
               +face([P(gx,gy+d,0),P(gx+w,gy+d,0),P(gx+w,gy+d,h),P(gx,gy+d,h)],mul(col,0.92)))
    s.append(box(-3.6,0.2,0.5,0.9,1.1,BATT))
    # --- EV + charger on driveway ---
    s.append(box(2.2,3.4,1.5,0.8,0.5,CAR))
    s.append(box(2.5,3.55,0.9,0.5,0.85,mul(CAR,1.12)))
    cx0,cy0=P(1.7,3.5,0)
    s.append(f'<rect x="{cx0-2:.1f}" y="{cy0-22:.1f}" width="4" height="22" fill="{CHG}"/><rect x="{cx0-3:.1f}" y="{cy0-26:.1f}" width="6" height="6" fill="{BATT}"/>')
    # --- energy flow: sun -> panels -> battery -> house -> car (dotted) ---
    pn_c=quadpt(*Sl,0.5,0.5)
    for (x1,y1),(x2,y2) in [((248,60),(pn_c[0],pn_c[1])),(pn_c,P(-3.35,0.65,1.1)),(P(-3.35,0.65,0.5),P(gx,gy+1.3,0.8)),(P(gx+w,gy+2.0,0.4),P(2.9,3.7,0.6))]:
        s.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{FLOW}" stroke-width="1.5" stroke-dasharray="2 4" opacity="0.75"/>')
    # a tree
    tx,ty=P(3.6,-3.2,0)
    s.append(f'<rect x="{tx-2:.0f}" y="{ty-16:.0f}" width="4" height="18" fill="#6b4a2f"/><circle cx="{tx:.0f}" cy="{ty-20:.0f}" r="13" fill="{GRASS_D}"/><circle cx="{tx-9:.0f}" cy="{ty-14:.0f}" r="9" fill="{GRASS_D}"/><circle cx="{tx+9:.0f}" cy="{ty-14:.0f}" r="9" fill="{GRASS_D}"/>')
    # title
    s.append(f'<rect y="345" width="{W}" height="75" fill="{INK}"/><rect x="24" y="356" width="252" height="2" fill="#f4c95d"/>')
    s.append(T(150,390,34,"SMART HOME",CREAM,ls="2"));s.append(T(150,409,10,"SOLAR · STORED · CONNECTED",PANEL_L,w="400",ls="3"))
    return wrap("".join(s))

# ---------- 2) Blueprint / technical ----------
def s2(p):
    NAVY="#0e2947";GRID="#183a5e";LINE="#cfe6ff";SUN="#f0c95a";PANEL="#7fb0e0";BATT="#e0a54a";HOUSE="#9fd0a0";CAR="#e08a6a";CREAM="#e6f1ff";MONO="ui-monospace, 'DejaVu Sans Mono', monospace"
    s=[f'<rect width="{W}" height="{Hh}" fill="{NAVY}"/>']
    for gx in range(0,W+1,24): s.append(f'<line x1="{gx}" y1="0" x2="{gx}" y2="345" stroke="{GRID}" stroke-width="0.6"/>')
    for gy in range(0,346,24): s.append(f'<line x1="0" y1="{gy}" x2="{W}" y2="{gy}" stroke="{GRID}" stroke-width="0.6"/>')
    def node(x,y,r,col,lab):
        s.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="none" stroke="{col}" stroke-width="1.6"/><circle cx="{x}" cy="{y}" r="{r-5}" fill="{col}" opacity="0.25"/>')
        s.append(T(x,y+r+12,8,lab,col,fam=MONO,w="400",ls="0.5"))
    def link(x1,y1,x2,y2,val):
        s.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{CREAM}" stroke-width="1.3" stroke-dasharray="4 3"/>')
        mx,my=(x1+x2)/2,(y1+y2)/2;s.append(T(mx,my-4,7.5,val,mul(LINE,0.9),fam=MONO,w="400",ls="0"))
    node(150,70,18,SUN,"SUN")
    node(150,150,16,PANEL,"PV ARRAY")
    node(74,240,15,BATT,"BATTERY")
    node(226,240,15,HOUSE,"HOME LOADS")
    node(150,315,14,CAR,"EV")
    link(150,88,150,134,"~7 kW")
    link(138,160,86,228,"charge")
    link(162,160,214,228,"5 kW")
    link(80,254,140,305,"night")
    link(216,254,162,308,"L2 22 kW")
    s.append(T(20,26,8,"FIG. 2 — RESIDENTIAL SOLAR + STORAGE FLOW",mul(LINE,0.9),fam=MONO,w="400",ls="0.5",anchor="start"))
    s.append(f'<rect y="345" width="{W}" height="75" fill="#0a1e35"/><rect x="24" y="356" width="252" height="1.5" fill="{SUN}"/>')
    s.append(T(150,388,26,"SMART HOME",CREAM,fam=MONO,w="700",ls="1"));s.append(T(150,406,8.5,"ENERGY SYSTEM · SCHEMATIC",mul(LINE,0.85),fam=MONO,w="400",ls="3"))
    return wrap("".join(s))

# ---------- 3) Flat diagram (infographic) ----------
def s3(p):
    BG="#f2ece0";SUN="#e8a53a";PANEL="#3a4a74";HOUSE="#c9b79a";ROOF="#a6432b";BATT="#4e8a5a";CAR="#3c6e8f";INK="#33302a";FLOW="#e8a53a";CREAM="#f2ece0";DK="#33302a"
    s=[f'<rect width="{W}" height="345" fill="{BG}"/>']
    # sun top-left
    s.append(f'<circle cx="56" cy="60" r="22" fill="{SUN}"/>')
    for k in range(8):
        a=k*math.pi/4;s.append(f'<line x1="{56+math.cos(a)*27:.1f}" y1="{60+math.sin(a)*27:.1f}" x2="{56+math.cos(a)*36:.1f}" y2="{60+math.sin(a)*36:.1f}" stroke="{SUN}" stroke-width="2.6" stroke-linecap="round"/>')
    # house (flat side view) centre
    hx,hy=118,150
    s.append(f'<rect x="{hx}" y="{hy}" width="88" height="66" fill="{HOUSE}"/>')
    s.append(f'<polygon points="{hx-6},{hy} {hx+44},{hy-34} {hx+94},{hy}" fill="{ROOF}"/>')
    # roof panels
    s.append(f'<polygon points="{hx+8},{hy-6} {hx+42},{hy-29} {hx+46},{hy-23} {hx+14},{hy-1}" fill="{PANEL}"/>')
    s.append(f'<polygon points="{hx+48},{hy-22} {hx+80},{hy-1} {hx+50},{hy-1}" fill="{PANEL}" opacity="0.85"/>')
    s.append(f'<rect x="{hx+36}" y="{hy+34}" width="18" height="32" fill="{ROOF}"/><rect x="{hx+14}" y="{hy+14}" width="16" height="14" fill="{SUN}" opacity="0.55"/><rect x="{hx+60}" y="{hy+14}" width="16" height="14" fill="{SUN}" opacity="0.55"/>')
    # battery (left of house)
    s.append(f'<rect x="70" y="176" width="26" height="40" rx="3" fill="{BATT}"/><rect x="76" y="184" width="14" height="4" fill="{CREAM}"/><rect x="76" y="192" width="14" height="4" fill="{CREAM}"/>')
    # EV (right)
    s.append(f'<rect x="228" y="196" width="46" height="16" rx="4" fill="{CAR}"/><rect x="236" y="186" width="28" height="12" rx="3" fill="{CAR}"/><circle cx="240" cy="214" r="5" fill="{DK}"/><circle cx="262" cy="214" r="5" fill="{DK}"/>')
    # flow arrows + labels
    def arrow(x1,y1,x2,y2,lab):
        s.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{FLOW}" stroke-width="2.6"/>')
        ang=math.atan2(y2-y1,x2-x1)
        s.append(f'<polygon points="{x2},{y2} {x2-9*math.cos(ang-0.4):.1f},{y2-9*math.sin(ang-0.4):.1f} {x2-9*math.cos(ang+0.4):.1f},{y2-9*math.sin(ang+0.4):.1f}" fill="{FLOW}"/>')
        s.append(T((x1+x2)/2,(y1+y2)/2-6,8.5,lab,INK,fam="Helvetica, Arial, sans-serif",w="700",ls="0"))
    arrow(70,74,120,116,"sunlight")
    arrow(96,196,110,196,"store")
    arrow(206,196,226,204,"charge")
    s.append(T(150,250,10,"① solar → ② battery → ③ home + car",INK,fam="Helvetica, Arial, sans-serif",w="400",ls="0.5"))
    s.append(f'<rect y="345" width="{W}" height="75" fill="{DK}"/><rect x="24" y="356" width="252" height="2" fill="{SUN}"/>')
    s.append(T(150,388,30,"SMART HOME",CREAM,fam="Helvetica, Arial, sans-serif",w="700",ls="1"));s.append(T(150,407,9.5,"HOW YOUR SOLAR HOME WORKS",SUN,fam="Helvetica, Arial, sans-serif",w="400",ls="2"))
    return wrap("".join(s))

# ---------- 4) Swiss / subtractive (FOIL — beautiful, but deletes the system) ----------
def s4(p):
    BG="#efe7d6";SUN="#e8a53a";LAND="#2f3b34";HOUSE="#b23a24";CREAM="#efe7d6"
    s=[f'<rect width="{W}" height="{Hh}" fill="{BG}"/>']
    s.append(f'<circle cx="212" cy="140" r="80" fill="{SUN}"/>')
    s.append(f'<path d="M0 250 C 90 214 210 214 300 250 L300 {Hh} L0 {Hh} Z" fill="{LAND}"/>')
    hx,hy=70,214
    s.append(f'<rect x="{hx}" y="{hy}" width="44" height="30" fill="{HOUSE}"/><polygon points="{hx-3},{hy} {hx+22},{hy-16} {hx+47},{hy}" fill="{HOUSE}"/>')
    s.append(T(30,352,38,"SMART HOME",CREAM,fam="Helvetica, Arial, sans-serif",w="700",ls="1",anchor="start"))
    s.append(T(31,372,10.5,"SOLAR · STORED · CONNECTED",SUN,fam="Helvetica, Arial, sans-serif",w="700",ls="3",anchor="start"))
    s.append(f'<line x1="30" y1="360" x2="270" y2="360" stroke="{SUN}" stroke-width="1.5"/>')
    return wrap("".join(s))

VARS=[("s1","Isometric (Pohl)","the winner here — the whole system in one legible 3-D scene: panels, battery, home, EV, energy flow",s1),
      ("s2","Blueprint / technical","the same system as an engineering schematic — nodes + labelled flows",s2),
      ("s3","Flat diagram","a flat infographic — side-view house, flow arrows, numbered steps",s3),
      ("s4","Swiss / subtractive (foil)","the reigning poster champ — gorgeous, but it DELETES the system the brief asked for",s4)]
for key,name,desc,fn in VARS:
    open(f"{key}.svg","w").write(fn(key))
cards="".join(f'<figure><div class="p">{fn(key)}</div><figcaption><b>{name}</b><span>{desc}</span></figcaption></figure>' for key,name,desc,fn in VARS)
HTML=f'''<!doctype html><html><head><meta charset="utf-8"><title>Smart home — where OTHER leans win</title><style>
body{{margin:0;background:#15130f;color:#efe7d6;font-family:system-ui,sans-serif}}
h1{{text-align:center;font-weight:600;padding:34px 0 4px;font-size:23px}}
.sub{{text-align:center;color:#9a9078;margin:0 0 24px;font-size:13px;max-width:640px;margin-left:auto;margin-right:auto;line-height:1.5}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:26px;max-width:1050px;margin:0 auto;padding:0 26px 60px}}
figure{{margin:0}} .p svg{{width:100%;height:auto;display:block;border-radius:6px;box-shadow:0 6px 26px #000a}}
figcaption{{padding:10px 2px}} figcaption b{{display:block;font-size:14px}} figcaption span{{display:block;color:#9a9078;font-size:11.5px;margin-top:2px;line-height:1.4}}
</style></head><body><h1>A system brief — where a different lean wins</h1>
<p class="sub">"How a smart solar home works." The two poster-winners are bold-single-image leans — so on an
explainer brief they lose to leans built for structure. Isometric carries the whole system; Swiss-subtractive
(the reigning champ) is still beautiful but deletes exactly what the brief needs.</p>
<div class="grid">{cards}</div></body></html>'''
open("system.html","w").write(HTML)
print(f"wrote system.html + {len(VARS)} svgs")

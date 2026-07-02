#!/usr/bin/env python3
"""ILLUSTRATION of a 'website + nav menu' as a subject — five leans, for comparison.
(Not a functional UI — a stylised depiction, like the Indiana / Mars / little-world sets.)
Run: python3 website_variations.py -> ws1..ws5.svg + website.html
Leans: Swiss-subtractive · duotone · isometric · flat-vector · blueprint-wireframe.
"""
import math, html
W,H=360,330
def mul(h,f):
    h=h.lstrip("#"); r,g,b=(int(h[i:i+2],16) for i in (0,2,4))
    return "#%02x%02x%02x"%tuple(max(0,min(255,int(c*f))) for c in (r,g,b))
def wrap(inner): return f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">{inner}</svg>'
def R(x,y,w,h,fill,r=0,st="none",sw=0,op=1.0):
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{r}" fill="{fill}" stroke="{st}" stroke-width="{sw}" opacity="{op}"/>'
def T(x,y,s,t,fill,fam,w="700",ls="3",anc="middle"):
    return f'<text x="{x}" y="{y}" text-anchor="{anc}" font-family="{fam}" font-weight="{w}" font-size="{s}" letter-spacing="{ls}" fill="{fill}">{html.escape(t)}</text>'
SERIF="Georgia, serif"; SANS="Helvetica, Arial, sans-serif"; MONO="ui-monospace, 'DejaVu Sans Mono', monospace"

# ---------- 1) Swiss / subtractive ----------
def ws1():
    BG="#efe7d6"; INK="#26241f"; ACC="#c2622f"; PALE="#ded4c0"
    s=[R(0,0,W,H,BG)]
    # thin browser outline, huge whitespace, one accent = the menu + hero
    s.append(R(46,44,268,196,"none",r=10,st=INK,sw=1.4))
    for i in range(3): s.append(f'<circle cx="{62+i*10}" cy="58" r="2.6" fill="{INK}"/>')
    # the menu: a logo dot + three short strokes (a whisper) + one accent CTA
    s.append(f'<circle cx="66" cy="86" r="5" fill="{INK}"/>')
    for i in range(3): s.append(R(150+i*30,84,18,3.5,INK))
    s.append(R(272,79,30,14,ACC,r=7))
    # one bold hero block + a single headline line
    s.append(R(66,120,150,20,ACC))
    s.append(R(66,152,120,5,mul(INK,2.3)))
    s.append(R(66,164,84,5,mul(INK,2.3)))
    s.append(T(180,300,15,"SWISS · SUBTRACTIVE",INK,SANS,w="700",ls="2"))
    return wrap("".join(s))

# ---------- 2) Duotone blockprint ----------
def ws2():
    CREAM="#f0e2c0"; NAVY="#1b2740"; AMBER="#e59a5c"; AM_D="#c97e42"
    s=[f'<defs><filter id="wg" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/></filter></defs>',R(0,0,W,H,CREAM)]
    s.append(R(44,42,272,200,NAVY,r=10))
    s.append(R(44,42,272,26,mul(NAVY,1.3),r=10))
    for i in range(3): s.append(f'<circle cx="{62+i*11}" cy="55" r="3" fill="{AMBER}"/>')
    # nav menu (amber)
    s.append(R(58,80,30,12,AMBER,r=2))
    for i in range(3): s.append(R(150+i*30,83,20,5,AMBER))
    s.append(R(272,78,34,15,AMBER,r=3))
    # hero + content in amber
    s.append(R(58,110,150,16,AMBER))
    s.append(R(58,134,110,6,AM_D)); s.append(R(58,146,84,6,AM_D))
    s.append(R(214,108,90,58,AMBER)); s.append(f'<circle cx="234" cy="130" r="9" fill="{NAVY}"/><path d="M214 166 L246 138 L268 158 L286 146 L304 166 Z" fill="{NAVY}"/>')
    for i in range(3): s.append(R(58+i*88,180,78,50,AMBER,r=2))
    s.append(R(0,0,W,H,"transparent",0)); s.append(f'<rect x="44" y="42" width="272" height="200" rx="10" filter="url(#wg)" opacity="0.1"/>')
    s.append(T(180,300,15,"DUOTONE · blockprint",NAVY,SERIF,w="700",ls="2"))
    return wrap("".join(s))

# ---------- 3) Isometric ----------
def ws3():
    s=[f'<defs><linearGradient id="isk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e7eef4"/><stop offset="1" stop-color="#f3eee6"/></linearGradient></defs>',R(0,0,W,H,"url(#isk)")]
    C30=math.cos(math.radians(30)); ox,oy,sc=176,120,15.5
    def P(x,y,z=0): return (ox+(x-y)*C30*sc, oy+((x+y)*0.5-z)*sc)
    def face(pts,col): return f'<polygon points="{" ".join(f"{a:.1f},{b:.1f}" for a,b in pts)}" fill="{col}"/>'
    def onplane(gx,gy,w,h,col,z=0):  # a rect lying on the iso screen-plane
        return face([P(gx,gy,z),P(gx+w,gy,z),P(gx+w,gy+h,z),P(gx,gy+h,z)],col)
    WHITE="#ffffff"; CHROME="#dfe6ee"; INDIGO="#6d5efc"; CORAL="#f2775f"; TEAL="#3fb6b0"; GREY="#c3ccd8"; INK="#3a4055"
    # thickness (side faces) — browser is 12 x 8.4 units
    gw,gh=12,8.4
    s.append(face([P(0,gh,0),P(gw,gh,0),P(gw,gh,-0.7),P(0,gh,-0.7)],mul(CHROME,0.7)))
    s.append(face([P(gw,0,0),P(gw,gh,0),P(gw,gh,-0.7),P(gw,0,-0.7)],mul(CHROME,0.85)))
    # top surface (screen)
    s.append(onplane(0,0,gw,gh,WHITE))
    s.append(onplane(0,0,gw,1.5,CHROME))                       # chrome bar
    for i in range(3): s.append(face([P(0.5+i*0.5,0.6,0),P(0.8+i*0.5,0.6,0),P(0.8+i*0.5,0.9,0),P(0.5+i*0.5,0.9,0)],mul(CHROME,0.72)))
    # nav menu row
    s.append(onplane(0.6,1.9,2.0,0.8,INDIGO))                  # logo
    for i in range(3): s.append(onplane(4.4+i*1.6,2.1,1.1,0.4,GREY))
    s.append(onplane(9.6,1.9,1.8,0.8,CORAL))                   # CTA
    # hero
    s.append(onplane(0.6,3.4,4.6,0.9,mul(INK,1.9)))
    s.append(onplane(0.6,4.6,3.4,0.35,GREY)); s.append(onplane(0.6,5.15,2.6,0.35,GREY))
    s.append(onplane(0.6,5.9,2.2,0.7,INDIGO))                  # hero CTA
    s.append(onplane(6.6,3.4,4.8,3.0,TEAL))                    # hero image
    # content cards
    for i in range(3): s.append(onplane(0.6+i*3.9,7.0,3.4,1.1,mul(CHROME,1.02)))
    # floating menu dropdown (raised chips) off the nav — the 'menu'
    for k in range(3):
        s.append(onplane(4.2,2.0,2.6,0.7,WHITE,z=1.4+k*0.9))
        s.append(onplane(4.5,2.2,1.8,0.3,GREY,z=1.4+k*0.9))
    T_INK="#3a4055"
    s.append(T(180,300,15,"ISOMETRIC",T_INK,SANS,w="700",ls="3"))
    return wrap("".join(s))

# ---------- 4) Flat vector / friendly ----------
def ws4():
    BG="#eef2f8"; WHITE="#ffffff"; CHR="#eaf0f6"; INDIGO="#5b6cf0"; CORAL="#f47560"; TEAL="#33b8a4"; GOLD="#f2c14e"; GREY="#cdd6e2"; INK="#2b3350"
    s=[R(0,0,W,H,BG)]
    s.append(f'<rect x="40" y="46" width="280" height="200" rx="14" fill="{WHITE}"/>')
    s.append(f'<path d="M40 60 q0 -14 14 -14 h252 q14 0 14 14 v6 h-280 Z" fill="{CHR}"/>')
    for i,c in enumerate((CORAL,GOLD,TEAL)): s.append(f'<circle cx="{58+i*12}" cy="57" r="3.4" fill="{c}"/>')
    s.append(R(96,52,150,10,mul(CHR,0.9),r=5))
    # nav menu
    s.append(f'<circle cx="62" cy="86" r="7" fill="{INDIGO}"/>'); s.append(R(74,82,20,8,INK,r=2))
    for i in range(3): s.append(R(150+i*30,84,22,5,GREY,r=2.5))
    s.append(R(268,78,42,17,CORAL,r=8))
    # hero
    s.append(R(58,116,140,15,INK,r=3)); s.append(R(58,138,150,7,GREY,r=3)); s.append(R(58,150,110,7,GREY,r=3))
    s.append(R(58,168,66,20,INDIGO,r=9))
    s.append(R(214,112,96,64,TEAL,r=8)); s.append(f'<circle cx="236" cy="134" r="9" fill="#fff" opacity="0.9"/><path d="M214 176 L244 148 L266 168 L284 156 L310 176 Z" fill="#fff" opacity="0.85"/>')
    for i,c in enumerate((CORAL,TEAL,GOLD)):
        x=58+i*88; s.append(R(x,200,78,44,mul(BG,1.03),r=8)); s.append(R(x+10,210,24,24,c,r=6)); s.append(R(x+42,212,26,5,GREY,r=2)); s.append(R(x+42,222,20,5,GREY,r=2))
    s.append(T(180,300,15,"FLAT VECTOR · friendly",INK,SANS,w="700",ls="2"))
    return wrap("".join(s))

# ---------- 5) Blueprint / wireframe ----------
def ws5():
    NAVY="#0e2947"; GRID="#173a5e"; LINE="#cfe6ff"; ACC="#7fd0e0"; MUT="#5f86ab"
    s=[R(0,0,W,H,NAVY)]
    for gx in range(0,W+1,20): s.append(f'<line x1="{gx}" y1="0" x2="{gx}" y2="270" stroke="{GRID}" stroke-width="0.5"/>')
    for gy in range(0,271,20): s.append(f'<line x1="0" y1="{gy}" x2="{W}" y2="{gy}" stroke="{GRID}" stroke-width="0.5"/>')
    def box(x,y,w,h,lab=None,dash=False):
        da=' stroke-dasharray="4 3"' if dash else ''
        out=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="none" stroke="{LINE}" stroke-width="1.1"{da}/>'
        if lab: out+=T(x+4,y+11,7.5,lab,MUT,MONO,w="400",ls="0.5",anc="start")
        return out
    s.append(box(44,44,272,200))
    s.append(f'<line x1="44" y1="70" x2="316" y2="70" stroke="{LINE}" stroke-width="1.1"/>')
    for i in range(3): s.append(f'<circle cx="{58+i*11}" cy="57" r="3" fill="none" stroke="{ACC}" stroke-width="1"/>')
    s.append(box(56,78,34,14,"LOGO"))
    for i in range(3): s.append(f'<line x1="{150+i*30}" y1="86" x2="{170+i*30}" y2="86" stroke="{ACC}" stroke-width="1.4"/>')
    s.append(T(150,74,7,"NAV MENU",MUT,MONO,w="400",ls="0.5",anc="start"))
    s.append(box(272,78,34,15,dash=True)); s.append(T(289,101,7,"CTA",ACC,MONO,w="400",ls="0.5"))
    s.append(box(56,108,148,60,"HERO")); s.append(f'<line x1="64" y1="150" x2="150" y2="150" stroke="{ACC}" stroke-width="1"/><line x1="64" y1="158" x2="120" y2="158" stroke="{ACC}" stroke-width="1"/>')
    s.append(box(214,108,92,60)); s.append(f'<line x1="214" y1="168" x2="306" y2="108" stroke="{MUT}" stroke-width="0.8"/><line x1="306" y1="168" x2="214" y2="108" stroke="{MUT}" stroke-width="0.8"/>'); s.append(T(260,142,7,"IMG",MUT,MONO,w="400",ls="0.5"))
    for i in range(3): s.append(box(56+i*88,180,78,50,"CARD"))
    s.append(T(20,26,8,"FIG. — WEB PAGE / NAV",MUT,MONO,w="400",ls="0.5",anc="start"))
    s.append(T(180,300,15,"BLUEPRINT · wireframe",LINE,MONO,w="700",ls="1"))
    return wrap("".join(s))

VARS=[("ws1","Swiss / subtractive","the page reduced to one hero block + a whisper of a menu — beautiful, near-abstract",ws1),
      ("ws2","Duotone blockprint","two inks + grain — the browser as a bold screenprint",ws2),
      ("ws3","Isometric","the page as a tilted 3-D panel with a menu dropdown floating off it — the classic iso UI illo",ws3),
      ("ws4","Flat vector / friendly","the default SaaS illustration — rounded, colourful, a real-feeling nav + hero + cards",ws4),
      ("ws5","Blueprint / wireframe","the page as a UX wireframe — cyan linework, labelled regions, monospace",ws5)]
for k,n,d,fn in VARS: open(f"{k}.svg","w").write(fn())
cards="".join(f'<figure><div class="p">{fn()}</div><figcaption><b>{n}</b><span>{d}</span></figcaption></figure>' for k,n,d,fn in VARS)
HTML=f'''<!doctype html><html><head><meta charset="utf-8"><title>A website menu — five illustration leans</title><style>
body{{margin:0;background:#0f0d12;color:#efe7d6;font-family:system-ui,sans-serif}}
h1{{text-align:center;font-weight:600;padding:34px 0 4px;font-size:23px}} .s{{text-align:center;color:#9a90a7;margin:0 0 24px;font-size:13px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:26px;max-width:1160px;margin:0 auto;padding:0 26px 60px}}
figure{{margin:0}} .p svg{{width:100%;height:auto;display:block;border-radius:8px;box-shadow:0 6px 26px #000a}}
figcaption{{padding:10px 2px}} figcaption b{{display:block;font-size:14px}} figcaption span{{display:block;color:#9a90a7;font-size:11.5px;margin-top:2px;line-height:1.4}}
</style></head><body><h1>A website + nav menu — five illustration leans</h1>
<p class="s">The same subject (a web page with its menu) as an ILLUSTRATION, one per lean — for comparison.</p>
<div class="grid">{cards}</div></body></html>'''
open("website.html","w").write(HTML)
print(f"wrote website.html + {len(VARS)} svgs")

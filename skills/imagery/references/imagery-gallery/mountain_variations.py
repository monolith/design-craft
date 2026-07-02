#!/usr/bin/env python3
"""One art CONCEPT — 'a mountain' — as an art piece in FIVE styles, incl. isometric.
So iso-as-art can be compared to the other styles on the SAME concept.
Run: python3 mountain_variations.py -> mt1..mt5.svg + mountain.html
Styles: isometric-faceted · Swiss-minimal · duotone-print · flat-layered · gradient-painterly.
"""
import math, html
W,H=340,360
def mul(h,f):
    h=h.lstrip("#"); r,g,b=(int(h[i:i+2],16) for i in (0,2,4))
    return "#%02x%02x%02x"%tuple(max(0,min(255,int(c*f))) for c in (r,g,b))
def wrap(inner): return f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">{inner}</svg>'
def poly(pts,col,st="none",sw=0):
    return f'<polygon points="{" ".join(f"{a:.1f},{b:.1f}" for a,b in pts)}" fill="{col}" stroke="{st}" stroke-width="{sw}" stroke-linejoin="round"/>'
def T(t,fill,fam,ls="3"): return f'<text x="170" y="344" text-anchor="middle" font-family="{fam}" font-weight="700" font-size="13" letter-spacing="{ls}" fill="{fill}">{html.escape(t)}</text>'
SERIF="Georgia, serif"; SANS="Helvetica, Arial, sans-serif"; MONO="ui-monospace, 'DejaVu Sans Mono', monospace"

# ---------- 1) Isometric faceted ----------
def mt1():
    s=[f'<defs><linearGradient id="isk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ea"/><stop offset="1" stop-color="#eef2ee"/></linearGradient></defs>']
    s.append(f'<rect width="{W}" height="{H}" fill="url(#isk)"/>')
    ROCK="#6f7f95"; ROCK_D="#4a566a"; SNOW="#f2f6fa"; SNOW_D="#d6e0ea"; GRND="#8ea77e"; SUN="#f4c95d"
    s.append(f'<circle cx="256" cy="72" r="22" fill="{SUN}" opacity="0.9"/>')
    C30=math.cos(math.radians(30)); ox,oy,sc=170,232,20
    def P(x,y,z=0): return (ox+(x-y)*C30*sc, oy+((x+y)*0.5-z)*sc)
    # ground diamond
    s.append(poly([P(-4.2,-4.2),P(4.2,-4.2),P(4.2,4.2),P(-4.2,4.2)],GRND))
    s.append(poly([P(-4.2,-4.2),P(4.2,-4.2),P(4.2,4.2),P(-4.2,4.2)],"none",st=mul(GRND,0.85),sw=1))
    def peak(cx,cy,b,h,lit,dark):
        apex=P(cx,cy,h); L=P(cx-b,cy+b); F=P(cx+b,cy+b); Rt=P(cx+b,cy-b)
        mLF=((L[0]+F[0])/2,(L[1]+F[1])/2); mFR=((F[0]+Rt[0])/2,(F[1]+Rt[1])/2)
        out=poly([apex,L,mLF],mul(lit,1.08))+poly([apex,mLF,F],lit)          # left face 2 facets
        out+=poly([apex,F,mFR],dark)+poly([apex,mFR,Rt],mul(dark,0.9))       # right face 2 facets
        # snow cap
        aL=(apex[0]+(L[0]-apex[0])*0.34,apex[1]+(L[1]-apex[1])*0.34)
        aF=(apex[0]+(F[0]-apex[0])*0.34,apex[1]+(F[1]-apex[1])*0.34)
        aR=(apex[0]+(Rt[0]-apex[0])*0.34,apex[1]+(Rt[1]-apex[1])*0.34)
        out+=poly([apex,aL,aF],SNOW)+poly([apex,aF,aR],SNOW_D)
        return out
    s.append(peak(-1.4,0.6,1.6,4.2,mul(ROCK,1.05),mul(ROCK_D,1.05)))         # small peak behind-left
    s.append(peak(0.6,-0.4,2.7,7.2,ROCK,ROCK_D))                             # main peak
    s.append(T("ISOMETRIC · faceted",'#3a4356',SANS,ls="2"))
    return wrap("".join(s))

# ---------- 2) Swiss / subtractive ----------
def mt2():
    BG="#e9ebe6"; PEAK="#2e3a42"; SUN="#d98a3f"; SNOW="#e9ebe6"; INK="#26281f"
    s=[f'<rect width="{W}" height="{H}" fill="{BG}"/>']
    s.append(f'<circle cx="232" cy="120" r="62" fill="{SUN}"/>')
    s.append(poly([(40,256),(150,84),(260,256)],PEAK))                        # one clean peak
    s.append(poly([(126,122),(150,84),(174,122),(160,132),(150,120),(140,132)],SNOW))  # tiny snow notch
    s.append(f'<line x1="40" y1="256" x2="300" y2="256" stroke="{PEAK}" stroke-width="2"/>')
    s.append(T("SWISS · subtractive",INK,SANS,ls="2"))
    return wrap("".join(s))

# ---------- 3) Duotone blockprint ----------
def mt3():
    CREAM="#f0e2c0"; NAVY="#1b2740"; CORAL="#d9673a"; NAVY_L="#33456a"
    s=[f'<defs><filter id="mg" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/></filter></defs>',f'<rect width="{W}" height="{H}" fill="{CREAM}"/>']
    s.append(f'<circle cx="238" cy="96" r="40" fill="{CORAL}"/>')
    for rr in (32,24,16): s.append(f'<circle cx="238" cy="96" r="{rr}" fill="none" stroke="{CREAM}" stroke-width="2"/>')
    s.append(poly([(30,262),(140,110),(250,262)],CORAL))                      # back peak coral
    s.append(poly([(96,262),(190,120),(300,262)],NAVY))                       # front peak navy
    s.append(poly([(168,150),(190,120),(212,150),(198,158),(190,146),(182,158)],CREAM))  # snow
    # carved contour lines on the navy peak
    for yy in (180,210,240): s.append(f'<path d="M{190-(yy-120)*0.72:.0f} {yy} L190 {yy-14} L{190+(yy-120)*0.72:.0f} {yy}" fill="none" stroke="{CREAM}" stroke-width="1.4" opacity="0.6"/>')
    s.append(f'<rect width="{W}" height="300" filter="url(#mg)" opacity="0.1"/>')
    s.append(T("DUOTONE · blockprint",NAVY,SERIF,ls="2"))
    return wrap("".join(s))

# ---------- 4) Flat vector layered ----------
def mt4():
    s=[f'<defs><linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6c88f"/><stop offset="0.5" stop-color="#f0dcc0"/><stop offset="1" stop-color="#eef1f2"/></linearGradient></defs>']
    s.append(f'<rect width="{W}" height="{H}" fill="url(#fsky)"/>')
    s.append(f'<circle cx="180" cy="108" r="34" fill="#f7ead0"/>')
    L=["#b9c6cf","#8ba0af","#5f7788","#3a5060","#24333f"]   # far -> near
    ridges=[
      "M0 168 C 70 150 120 176 180 158 S 300 150 340 172 L340 300 L0 300 Z",
      "M0 196 C 60 178 130 206 190 190 S 300 182 340 200 L340 300 L0 300 Z",
      "M0 224 Q 90 196 170 222 T 340 224 L340 300 L0 300 Z",
      "M0 252 C 80 236 150 262 210 248 S 320 250 340 258 L340 300 L0 300 Z",
    ]
    for i,d in enumerate(ridges):
        s.append(f'<path d="{d}" fill="{L[i]}"/>')
        if i==2: s.append('<path d="M150 216 L170 200 L190 216 L182 220 L170 210 L158 220 Z" fill="#e8eef2"/>')  # snow on a mid peak
        s.append(f'<ellipse cx="{120+i*40}" cy="{178+i*28}" rx="80" ry="9" fill="#ffffff" opacity="0.18"/>')  # mist
    s.append(T("FLAT VECTOR · layered",'#2a3742',SANS,ls="2"))
    return wrap("".join(s))

# ---------- 5) Gradient / painterly ----------
def mt5():
    s=[f'''<defs>
     <linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2350"/><stop offset="0.45" stop-color="#7b3b78"/><stop offset="0.8" stop-color="#e0714e"/><stop offset="1" stop-color="#f4b26a"/></linearGradient>
     <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffe6b0"/><stop offset="1" stop-color="#ffe6b0" stop-opacity="0"/></radialGradient>
     <linearGradient id="mfar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a86"/><stop offset="1" stop-color="#a86a72"/></linearGradient>
     <linearGradient id="mnear" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a52"/><stop offset="1" stop-color="#241a3a"/></linearGradient>
     <filter id="soft"><feGaussianBlur stdDeviation="1.4"/></filter></defs>''']
    s.append(f'<rect width="{W}" height="{H}" fill="url(#dsky)"/>')
    s.append('<circle cx="180" cy="150" r="120" fill="url(#glow)"/>')
    s.append('<circle cx="180" cy="150" r="30" fill="#ffe9c4"/>')
    s.append('<path d="M0 176 C 80 150 140 186 200 164 S 320 156 340 180 L340 300 L0 300 Z" fill="url(#mfar)" opacity="0.9" filter="url(#soft)"/>')
    s.append('<path d="M0 226 C 70 196 150 236 210 214 S 320 214 340 232 L340 300 L0 300 Z" fill="url(#mnear)" filter="url(#soft)"/>')
    s.append('<path d="M150 212 L172 190 L196 214 L184 218 L172 204 L160 218 Z" fill="#efe0f0" opacity="0.85"/>')  # faint snow glow
    s.append('<ellipse cx="170" cy="250" rx="150" ry="16" fill="#e0714e" opacity="0.15"/>')
    s.append(T("GRADIENT · painterly",'#f4e3c8',SERIF,ls="2"))
    return wrap("".join(s))

VARS=[("mt1","Isometric · faceted","the mountain as a low-poly 3-D solid — dimensional, constructed, toy-like",mt1),
      ("mt2","Swiss · subtractive","one triangle, one sun, a horizon line — the most reduced, most abstract",mt2),
      ("mt3","Duotone · blockprint","two inks + carved contours + grain — a bold screenprint",mt3),
      ("mt4","Flat vector · layered","overlapping flat ridges + mist — the classic editorial landscape",mt4),
      ("mt5","Gradient · painterly","soft dusk gradients + glow — atmospheric, moody, the most 'fine-art'",mt5)]
for k,n,d,fn in VARS: open(f"{k}.svg","w").write(fn())
WIN={"mt3":"★ FAVOURITE · duotone","mt2":"② 2ND · Swiss"}
def badge(k): return f'<span class="badge">{WIN[k]}</span>' if k in WIN else ''
cards="".join(f'<figure class="{"win" if k in WIN else ""}"><div class="p">{fn()}</div><figcaption>{badge(k)}<b>{n}</b><span>{d}</span></figcaption></figure>' for k,n,d,fn in VARS)
HTML=f'''<!doctype html><html><head><meta charset="utf-8"><title>A mountain — five art styles</title><style>
body{{margin:0;background:#100e14;color:#efe7d6;font-family:system-ui,sans-serif}}
h1{{text-align:center;font-weight:600;padding:34px 0 4px;font-size:23px}} .s{{text-align:center;color:#9a90a7;margin:0 0 24px;font-size:13px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:26px;max-width:1120px;margin:0 auto;padding:0 26px 60px}}
figure{{margin:0}} .p svg{{width:100%;height:auto;display:block;border-radius:8px;box-shadow:0 6px 26px #000a}}
figcaption{{padding:10px 2px}} figcaption b{{display:block;font-size:14px}} figcaption span{{display:block;color:#9a90a7;font-size:11.5px;margin-top:2px;line-height:1.4}}
 .win .p svg{{outline:2.5px solid #f4c95d;outline-offset:3px}} .badge{{display:inline-block;background:#f4c95d;color:#1a1712;font-size:9px;font-weight:700;letter-spacing:0.5px;padding:2px 8px;border-radius:9px;margin-bottom:5px}}
</style></head><body><h1>A mountain — one concept, five art styles</h1>
<p class="s">One concept, five art styles. <b>★ duotone = the favourite; ② Swiss = second.</b> Iso wins constructed/geometric, loses on mood.</p>
<div class="grid">{cards}</div></body></html>'''
open("mountain.html","w").write(HTML)
print(f"wrote mountain.html + {len(VARS)} svgs")

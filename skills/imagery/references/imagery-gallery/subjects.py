#!/usr/bin/env python3
"""Imagery — code-generated illustrations on REAL subjects (the capability test, not abstract demos).
Three concrete pieces across the strong code lanes. Run: python3 subjects.py -> subjects.html
"""
import math, html
GROUND="#efe9dd"; INK="#2b2a26"; PALE="#ded4c3"; OCHRE="#c0872f"; SIENNA="#a65733"
SLATE="#5c6b6d"; ULTRA="#3c4f79"; CREAM="#e8dcc4"; RUST="#9c4a2a"
def _mul(h,f):
    h=h.lstrip("#"); r,g,b=(int(h[i:i+2],16) for i in (0,2,4))
    return "#%02x%02x%02x"%tuple(max(0,min(255,int(c*f))) for c in (r,g,b))
def poly(pts,fill,stroke=INK,sw=1.3,op=1.0):
    d=" ".join(f"{x:.1f},{y:.1f}" for x,y in pts)
    return f'<polygon points="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" opacity="{op}"/>'
C30,S30=math.cos(math.radians(30)),math.sin(math.radians(30))
def iso(x,y,z,s=17): return ((x-y)*C30*s,((x+y)*S30-z)*s)

# ---------------- 1) isometric workspace (Pohl lane) ----------------
def box(ox,oy,gx,gy,w,d,h,col,z0=0,s=17):
    def P(x,y,z):
        px,py=iso(gx+x,gy+y,z,s); return (ox+px,oy+py)
    top=_mul(col,1.30); L=_mul(col,0.72); R=_mul(col,0.92)
    return "".join([
        poly([P(0,0,z0+h),P(w,0,z0+h),P(w,d,z0+h),P(0,d,z0+h)],top),
        poly([P(0,0,z0),P(0,d,z0),P(0,d,z0+h),P(0,0,z0+h)],L),
        poly([P(0,0,z0),P(w,0,z0),P(w,0,z0+h),P(0,0,z0+h)],R)]), P

def plate_workspace():
    ox,oy=150,196; s=17; out=[]
    # desk
    faces,P=box(ox,oy,0,0,9,5,0.5,_mul(SLATE,1.15),s=s); out.append(faces)
    # monitor (screen box on a stand) at the back
    st,_=box(ox,oy,3.7,0.6,1.6,0.5,0.5,INK,z0=0.5,s=s); out.append(st)
    scr,SP=box(ox,oy,2.9,0.4,3.2,0.4,2.2,_mul(INK,1.25),z0=1.0,s=s); out.append(scr)
    a=SP(0,0,1.0);b=SP(3.2,0,1.0);c=SP(3.2,0,3.2-0.0);e=SP(0,0,3.2-0.0)  # screen glow (approx front face)
    out.append(poly([SP(0.12,0,1.15),SP(3.08,0,1.15),SP(3.08,0,3.05),SP(0.12,0,3.05)],ULTRA,stroke="none",sw=0))
    # keyboard (flat box)
    kb,_=box(ox,oy,2.7,2.4,3.6,1.3,0.18,PALE,z0=0.5,s=s); out.append(kb)
    # a stack of books, left
    for i,(bc) in enumerate((RUST,OCHRE,ULTRA)):
        bk,_=box(ox,oy,0.5+i*0.12,0.8,1.9,2.6,0.34,bc,z0=0.5+i*0.34,s=s); out.append(bk)
    # mug, right
    mug,_=box(ox,oy,7.3,2.7,0.9,0.9,1.0,CREAM,z0=0.5,s=s); out.append(mug)
    # plant pot + leaves, right-back
    pot,PP=box(ox,oy,7.4,0.6,1.1,1.1,1.0,SIENNA,z0=0.5,s=s); out.append(pot)
    lx,ly=PP(0.55,0.55,1.5)
    for ang,r in ((-40,26),(-8,32),(28,24),(-70,20),(60,18)):
        ax=lx+r*math.cos(math.radians(ang-90)); ay=ly+r*math.sin(math.radians(ang-90))
        out.append(poly([(lx,ly),(ax-6,ay+3),(ax,ay-4),(ax+6,ay+3)],_mul(SLATE,1.05),stroke=_mul(SLATE,0.7),sw=1))
    return "".join(out)

# ---------------- 2) geometric flat fox — recognizable, few colours (Favre lane) ----------------
def plate_fox():
    out=[f'<rect width="300" height="300" fill="{GROUND}"/>']
    cx=150
    # ears (outer sienna + inner ink)
    out.append(poly([(96,96),(74,34),(140,90)],SIENNA))
    out.append(poly([(204,96),(226,34),(160,90)],SIENNA))
    out.append(poly([(104,88),(90,50),(130,86)],_mul(INK,1.2)))
    out.append(poly([(196,88),(210,50),(170,86)],_mul(INK,1.2)))
    # face (big inverted triangle)
    out.append(poly([(90,92),(210,92),(150,214)],SIENNA))
    # side cheek fluff (cream) — Favre-ish flat shapes
    out.append(poly([(90,92),(150,150),(112,178)],CREAM,stroke=_mul(SIENNA,0.7),sw=1))
    out.append(poly([(210,92),(150,150),(188,178)],CREAM,stroke=_mul(SIENNA,0.7),sw=1))
    # muzzle / chin (cream inverted triangle)
    out.append(poly([(120,150),(180,150),(150,214)],_mul(CREAM,1.03),stroke=_mul(SIENNA,0.7),sw=1))
    # eyes (ink almonds as triangles)
    out.append(poly([(116,120),(138,124),(122,134)],INK))
    out.append(poly([(184,120),(162,124),(178,134)],INK))
    # nose
    out.append(poly([(140,178),(160,178),(150,194)],INK))
    return "".join(out)

# ---------------- 3) a year of focus — HONEST bars + humanistic layer (Lupi x charting) ----------------
def plate_year():
    # 12 months, deep-work hours/day avg (honest length encoding from 0), colour = dominant mode,
    # a sienna ring = a standout month. Legend carries the why. Form defers to charting.
    data=[("J",4.2,"steady",0),("F",5.0,"steady",0),("M",6.1,"deep",0),("A",3.4,"scattered",0),
          ("M",5.6,"deep",0),("J",6.8,"deep",1),("J",2.9,"scattered",0),("A",4.4,"steady",0),
          ("S",6.4,"deep",1),("O",5.1,"steady",0),("N",4.0,"scattered",0),("D",3.1,"scattered",0)]
    col={"deep":ULTRA,"steady":SLATE,"scattered":OCHRE}
    out=[f'<rect width="300" height="300" fill="{GROUND}"/>']
    x0,y0,bw,gap,hmax,maxh=34,52,15,6.4,8,140
    def H(v): return v/hmax*maxh
    base=y0+maxh
    for hv in (0,2,4,6,8):                       # honest y ticks, minimal
        yy=base-H(hv)
        out.append(f'<line x1="{x0-4}" y1="{yy:.1f}" x2="266" y2="{yy:.1f}" stroke="{_mul(GROUND,0.82)}" stroke-width="1"/>')
        out.append(f'<text x="{x0-8}" y="{yy+3:.1f}" text-anchor="end" font-size="8.5" fill="{_mul(INK,1.7)}" font-family="ui-monospace,monospace">{hv}</text>')
    for i,(m,v,cat,star) in enumerate(data):
        bx=x0+i*(bw+gap); top=base-H(v)
        out.append(f'<rect x="{bx:.1f}" y="{top:.1f}" width="{bw}" height="{H(v):.1f}" fill="{col[cat]}"/>')
        if star:
            out.append(f'<circle cx="{bx+bw/2:.1f}" cy="{top-8:.1f}" r="3.6" fill="none" stroke="{SIENNA}" stroke-width="1.7"/>')
        out.append(f'<text x="{bx+bw/2:.1f}" y="{base+13:.0f}" text-anchor="middle" font-size="9" fill="{_mul(INK,1.5)}" font-family="ui-monospace,monospace">{m}</text>')
    out.append(f'<line x1="{x0-4}" y1="{base:.1f}" x2="266" y2="{base:.1f}" stroke="{INK}" stroke-width="1.4"/>')
    ly=244
    for lx,(c,l) in zip((36,104,176),((ULTRA,"deep"),(SLATE,"steady"),(OCHRE,"scattered"))):
        out.append(f'<rect x="{lx}" y="{ly-8}" width="10" height="10" fill="{c}"/><text x="{lx+14}" y="{ly}" font-size="10" fill="{INK}" font-family="ui-monospace,monospace">{l}</text>')
    out.append(f'<circle cx="252" cy="{ly-3}" r="5" fill="none" stroke="{SIENNA}" stroke-width="1.7"/>')
    out.append(f'<text x="150" y="272" text-anchor="middle" font-size="9.5" fill="{_mul(INK,1.55)}" font-family="ui-monospace,monospace">avg deep-work hrs/day · ring = a breakthrough month</text>')
    return "".join(out)

def card(t,lane,svg,note):
    return (f'<figure class="card"><svg viewBox="0 0 300 300" role="img" aria-label="{html.escape(t)}">'
            f'<rect width="300" height="300" fill="{GROUND}"/>{svg}</svg>'
            f'<figcaption><b>{html.escape(t)}</b><em>{html.escape(lane)}</em>'
            f'<span class="note">{note}</span></figcaption></figure>')

CARDS=[
 card("Isometric workspace","Pohl lane · constructed from a projection system",plate_workspace(),
      "Desk, monitor, keyboard, books, mug, plant — every object an extruded iso prism. Recognisable scene, fully code-built."),
 card("Geometric fox","Favre lane · flat, few colours, negative space",plate_fox(),
      "A recognisable subject in 3 flat Corbusier colours + ink. Angular geometry does the drawing; the ground is active. The <i>where-to-cut</i> is taste."),
 card("A year of focus","Lupi × charting · honest bars + humanistic layer",plate_year(),
      "Honest length encoding from 0 (form → charting); imagery adds colour=mode + a ring = a breakthrough month + a legend that carries the why. Palette → colour skill."),
]
HTML=f'''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Imagery — generated on real subjects</title>
<style>
 body{{margin:0;background:{_mul(GROUND,0.94)};color:{INK};font-family:"Plus Jakarta Sans",system-ui,sans-serif;line-height:1.5}}
 header,.grid{{max-width:1000px;margin:0 auto;padding:0 28px}}
 header{{padding-top:46px}} h1{{font-family:"Bricolage Grotesque",Georgia,serif;font-size:27px;margin:0 0 6px}}
 header p{{max-width:74ch;color:{_mul(INK,1.5)}}}
 .grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:22px;margin:20px auto 60px}}
 .card{{background:{GROUND};border:1px solid {_mul(GROUND,0.82)};border-radius:10px;overflow:hidden;margin:0}}
 .card svg{{width:100%;height:auto;display:block}}
 figcaption{{padding:12px 15px 15px;font-size:13px;border-top:1px solid {_mul(GROUND,0.86)}}}
 figcaption em{{display:block;font-style:normal;color:{_mul(INK,1.6)};font-size:11.5px;margin:3px 0 6px}}
 figcaption .note{{display:block;font-size:11.5px;color:{_mul(INK,1.35)};line-height:1.45}}
</style></head><body>
<header><h1>Imagery — generated on real subjects</h1>
<p>Not abstract demos: three concrete illustrations, each produced entirely by <code>subjects.py</code>
(no image model, no editor). This is the actual output of the code-buildable lanes on real subjects — the
capability test. The hand pole (expressive linework, painterly texture) is still select-or-commission.</p></header>
<div class="grid">{"".join(CARDS)}</div></body></html>'''
open("subjects.html","w",encoding="utf-8").write(HTML)
print(f"wrote subjects.html ({len(HTML)} bytes, {len(CARDS)} illustrations)")

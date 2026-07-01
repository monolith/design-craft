#!/usr/bin/env python3
"""One famous subject (Frida Kahlo), THREE illustration styles — for the style pick.
Same person; the variable is the STYLE. Recognisability rides on iconic signals (flower crown,
connected unibrow, centre-part dark hair, direct gaze, red lips). Run: python3 portrait.py -> portrait.html
"""
import math, html
GROUND="#efe9dd"; INK="#2b2a26"; SKIN="#cf9d6f"; SKIN_D="#a97a4f"; SKIN_L="#dcb184"
HAIR="#231f1d"; LIP="#9c4a2a"; LEAF="#5b7052"; OCHRE="#c0872f"; SIENNA="#a65733"
ULTRA="#3c4f79"; CREAM="#e8dcc4"; RUST="#8f4327"
def _mul(h,f):
    h=h.lstrip("#"); r,g,b=(int(h[i:i+2],16) for i in (0,2,4))
    return "#%02x%02x%02x"%tuple(max(0,min(255,int(c*f))) for c in (r,g,b))
def poly(p,fill,stroke="none",sw=0):
    d=" ".join(f"{x:.1f},{y:.1f}" for x,y in p)
    return f'<polygon points="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"/>'
def flower(cx,cy,r,petal,centre=CREAM,n=6):
    s=[]
    for k in range(n):
        a=k*2*math.pi/n
        s.append(f'<circle cx="{cx+r*0.6*math.cos(a):.1f}" cy="{cy+r*0.6*math.sin(a):.1f}" r="{r*0.52:.1f}" fill="{petal}"/>')
    s.append(f'<circle cx="{cx}" cy="{cy}" r="{r*0.44:.1f}" fill="{centre}"/>')
    return "".join(s)
def crown(y=104):
    s=[]
    # leaves behind
    for lx in (84,150,216):
        s.append(f'<ellipse cx="{lx}" cy="{y+6}" rx="20" ry="9" fill="{LEAF}" transform="rotate({-18 if lx<150 else 18} {lx} {y+6})"/>')
    for (lx,col,r) in ((88,SIENNA,17),(120,OCHRE,15),(150,RUST,19),(180,OCHRE,15),(212,ULTRA,17)):
        s.append(flower(lx,y,r,col))
    return "".join(s)

def face_signals(line=False):
    """the shared iconic marks drawn ON TOP of any style's base."""
    st = f' stroke="{INK}" stroke-width="2.4"' if line else ""
    s=[]
    # connected unibrow (the signal) — one filled shape spanning both brows
    s.append(f'<path d="M112 150 Q130 138 150 144 Q170 138 188 150 Q170 146 150 150 Q130 146 112 150 Z" fill="{HAIR}"/>')
    # eyes
    for ex in (129,171):
        s.append(f'<ellipse cx="{ex}" cy="163" rx="12" ry="7.5" fill="#fff" stroke="{HAIR}" stroke-width="1.4"/>')
        s.append(f'<circle cx="{ex}" cy="163" r="4.6" fill="{HAIR}"/>')
    # nose
    s.append(f'<path d="M150 156 L145 188 Q150 192 155 188 Z" fill="{SKIN_D}" opacity="0.55"/>')
    # subtle moustache
    s.append(f'<path d="M136 198 Q150 202 164 198" fill="none" stroke="{_mul(HAIR,1.4)}" stroke-width="2" opacity="0.5"/>')
    # lips
    s.append(f'<path d="M132 205 Q150 200 168 205 Q150 218 132 205 Z" fill="{LIP}"/>')
    s.append(f'<path d="M132 205 Q150 209 168 205" fill="none" stroke="{_mul(LIP,0.7)}" stroke-width="1.4"/>')
    return "".join(s)

# ---------------- STYLE 1 — flat vector ----------------
def style_flat():
    s=[f'<rect width="300" height="300" fill="{GROUND}"/>']
    s.append(f'<path d="M150 250 q-58 0 -58 40 l116 0 q0 -40 -58 -40 Z" fill="{ULTRA}"/>')          # shoulders/blouse
    s.append(f'<rect x="140" y="222" width="20" height="34" fill="{SKIN}"/>')                        # neck
    s.append(f'<path d="M150 96 q-72 0 -72 96 q0 60 72 60 q72 0 72 -60 q0 -96 -72 -96 Z" fill="{HAIR}"/>')  # hair mass
    s.append(f'<ellipse cx="150" cy="168" rx="54" ry="64" fill="{SKIN}"/>')                          # face
    s.append(f'<path d="M150 104 l-7 26 l14 0 Z" fill="{GROUND}"/>')                                 # centre part
    s.append(f'<ellipse cx="150" cy="176" rx="54" ry="30" fill="{SKIN_L}" opacity="0.35"/>')         # cheek light
    s.append(crown()); s.append(face_signals())
    return "".join(s)

# ---------------- STYLE 2 — faceted low-poly ----------------
def style_facet():
    s=[f'<rect width="300" height="300" fill="{GROUND}"/>']
    s.append(f'<path d="M150 250 q-58 0 -58 40 l116 0 q0 -40 -58 -40 Z" fill="{ULTRA}"/>')
    s.append(f'<rect x="140" y="222" width="20" height="34" fill="{SKIN}"/>')
    # faceted hair (a few dark triangles)
    for tri,c in (([(78,150),(150,92),(150,168)],_mul(HAIR,1.25)),([(222,150),(150,92),(150,168)],HAIR),
                  ([(78,150),(96,206),(150,168)],_mul(HAIR,0.8)),([(222,150),(204,206),(150,168)],_mul(HAIR,1.1)),
                  ([(150,92),(120,86),(96,120)],_mul(HAIR,1.35)),([(150,92),(180,86),(204,120)],_mul(HAIR,0.9))):
        s.append(poly(tri,c))
    # faceted face: triangles across the skin with varied shades
    F=[(102,150),(150,110),(198,150),(150,150),(126,196),(174,196),(150,226),(120,168),(180,168)]
    facets=[([F[0],F[1],F[3]],SKIN_L),([F[1],F[2],F[3]],SKIN),([F[0],F[3],F[7]],_mul(SKIN,0.94)),
            ([F[2],F[3],F[8]],SKIN_L),([F[3],F[7],F[4]],SKIN),([F[3],F[8],F[5]],_mul(SKIN,0.96)),
            ([F[3],F[4],F[5]],SKIN_L),([F[4],F[5],F[6]],SKIN_D),([F[7],F[4],F[6]],_mul(SKIN,0.9)),([F[8],F[5],F[6]],_mul(SKIN,0.9))]
    for tri,c in facets: s.append(poly(tri,c,stroke=_mul(SKIN,0.8),sw=0.6))
    s.append(crown()); s.append(face_signals())
    return "".join(s)

# ---------------- STYLE 3 — line-art (single weight, minimal fill) ----------------
def style_line():
    s=[f'<rect width="300" height="300" fill="{GROUND}"/>']
    W=f'fill="none" stroke="{INK}" stroke-width="2.3" stroke-linejoin="round" stroke-linecap="round"'
    s.append(f'<path d="M150 96 q-72 0 -72 96 q0 60 72 60 q72 0 72 -60 q0 -96 -72 -96 Z" {W}/>')    # hair contour
    s.append(f'<ellipse cx="150" cy="168" rx="54" ry="64" {W}/>')                                    # face
    s.append(f'<path d="M150 104 l-6 24 M150 104 l6 24" {W}/>')                                      # centre part
    s.append(f'<path d="M150 250 q-58 0 -58 40 M150 250 q58 0 58 40 M150 250 l0 -28" {W}/>')         # shoulders/neck
    # crown as line loops + a couple accent-filled flowers
    for lx in (88,120,180,212):
        s.append(f'<circle cx="{lx}" cy="104" r="15" {W}/>')
    s.append(flower(150,104,19,SIENNA))                                                              # one filled accent flower
    s.append(f'<circle cx="88" cy="104" r="6" fill="{OCHRE}"/><circle cx="212" cy="104" r="6" fill="{OCHRE}"/>')
    # signals in line: unibrow, eyes, nose, lips (lips filled as the one warm accent)
    s.append(f'<path d="M112 150 Q150 140 188 150" {W}/>')
    for ex in (129,171):
        s.append(f'<path d="M{ex-12} 163 Q{ex} 155 {ex+12} 163 Q{ex} 171 {ex-12} 163 Z" {W}/><circle cx="{ex}" cy="163" r="3.4" fill="{INK}"/>')
    s.append(f'<path d="M150 156 L146 186 Q150 190 154 186" {W}/>')
    s.append(f'<path d="M132 205 Q150 200 168 205 Q150 216 132 205 Z" fill="{LIP}" stroke="{INK}" stroke-width="2"/>')
    return "".join(s)

def card(name, svg, note):
    return (f'<figure class="card"><svg viewBox="0 0 300 300" role="img" aria-label="Frida Kahlo — {name}">'
            f'{svg}</svg><figcaption><b>{html.escape(name)}</b><span class="note">{note}</span></figcaption></figure>')

CARDS=[
 card("Style 1 — Flat vector", style_flat(), "Bold flat colour planes, few colours, clean shapes. The Favre lane, applied to a face."),
 card("Style 2 — Faceted low-poly", style_facet(), "The face broken into triangular facets with shaded planes — crystalline, constructed (the geometric lane)."),
 card("Style 3 — Line-art", style_line(), "Single-weight line, mostly negative space, one warm accent (the lips + a flower). The sparest, most editorial."),
]
HTML=f'''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Frida Kahlo — one subject, three styles</title>
<style>
 body{{margin:0;background:{_mul(GROUND,0.94)};color:{INK};font-family:"Plus Jakarta Sans",system-ui,sans-serif;line-height:1.5}}
 header,.grid{{max-width:1000px;margin:0 auto;padding:0 28px}}
 header{{padding-top:46px}} h1{{font-family:"Bricolage Grotesque",Georgia,serif;font-size:27px;margin:0 0 6px}}
 header p{{max-width:74ch;color:{_mul(INK,1.5)}}}
 .grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:22px;margin:20px auto 60px}}
 .card{{background:{GROUND};border:1px solid {_mul(GROUND,0.82)};border-radius:10px;overflow:hidden;margin:0}}
 .card svg{{width:100%;height:auto;display:block}}
 figcaption{{padding:12px 15px 15px;font-size:13px;border-top:1px solid {_mul(GROUND,0.86)}}}
 figcaption .note{{display:block;font-size:11.5px;color:{_mul(INK,1.4)};line-height:1.45;margin-top:4px}}
</style></head><body>
<header><h1>Frida Kahlo — one subject, three styles</h1>
<p>Same person, three code-built illustration styles — the variable is the <b>style</b>, not the subject.
Recognisability rides on the iconic signals (flower crown, connected unibrow, centre-part hair, red lips),
not photoreal likeness. Tell me which style you'd want to build out; that becomes the direction.</p></header>
<div class="grid">{"".join(CARDS)}</div></body></html>'''
open("portrait.html","w",encoding="utf-8").write(HTML)
print(f"wrote portrait.html ({len(HTML)} bytes, {len(CARDS)} styles)")

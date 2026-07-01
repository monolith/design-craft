#!/usr/bin/env python3
"""
Imagery gallery generator — the CODE-REPRODUCIBLE illustration lanes from the imagery skill's §4,
built parametrically (the generator IS the proof the lanes are code-buildable). Zero-dependency output.
Lanes: A isometric construction (Pohl) · B flat-colour negative space (Favre) · C data-encoded marks (Lupi)
· D the synthesised deviation (isometric geometry carrying data-encoded marks, one palette, one mark).
Run: python3 build.py  ->  index.html
"""
import math, html

# --- Corbusier-muted palette (composes with graphical-perception-and-color) -------------------
GROUND = "#efe9dd"   # warm off-white
INK    = "#2b2a26"   # off-black
PALE   = "#ded4c3"
OCHRE  = "#c0872f"
SIENNA = "#a65733"
SLATE  = "#5c6b6d"
ULTRA  = "#3c4f79"
CREAM  = "#e8dcc4"

# --- isometric projection: 3d (x,y,z) grid units -> 2d screen ---------------------------------
COS30 = math.cos(math.radians(30)); SIN30 = math.sin(math.radians(30))
def iso(x, y, z, s=22):
    return ((x - y) * COS30 * s, ((x + y) * SIN30 - z) * s)
def poly(pts, fill, stroke=INK, sw=1.4, extra=""):
    d = " ".join(f"{px:.1f},{py:.1f}" for px, py in pts)
    return f'<polygon points="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" {extra}/>'

def iso_box(ox, oy, w, d, h, z0=0, top=CREAM, left=SLATE, right=SLATE, sw=1.4, shade=True, s=22):
    """One extruded prism -> three faces (top, left, right), back-to-front safe for a single box."""
    def P(x, y, z):
        px, py = iso(x, y, z, s); return (ox + px, oy + py)
    lf = left if not shade else _mul(left, 0.86)
    rf = right if not shade else _mul(right, 1.0)
    tp = P(0, 0, z0 + h); tp2 = P(w, 0, z0 + h); tp3 = P(w, d, z0 + h); tp4 = P(0, d, z0 + h)
    lb = P(0, 0, z0); lb2 = P(0, d, z0); lt = P(0, d, z0 + h); lt2 = P(0, 0, z0 + h)
    rb = P(0, 0, z0); rb2 = P(w, 0, z0); rt = P(w, 0, z0 + h); rt2 = P(0, 0, z0 + h)
    out = []
    out.append(poly([P(0,0,z0+h),P(w,0,z0+h),P(w,d,z0+h),P(0,d,z0+h)], top, sw=sw))       # top
    out.append(poly([P(0,0,z0),P(0,d,z0),P(0,d,z0+h),P(0,0,z0+h)], lf, sw=sw))            # left face (y depth)
    out.append(poly([P(0,0,z0),P(w,0,z0),P(w,0,z0+h),P(0,0,z0+h)], rf, sw=sw))            # right face (x width)
    return "".join(out), P

def _mul(hexc, f):
    hexc = hexc.lstrip("#"); r,g,b = (int(hexc[i:i+2],16) for i in (0,2,4))
    return "#%02x%02x%02x" % tuple(max(0,min(255,int(c*f))) for c in (r,g,b))

# ============================ LANE A — isometric construction (Pohl) ==========================
def plate_iso_tower():
    ox, oy = 150, 210; s = 20; out = []
    # terraced tower: stacked shrinking boxes; windows on the two visible faces
    levels = [(0,0,6,6,3, SIENNA), (0.6,0.6,4.8,4.8,3, SIENNA), (1.2,1.2,3.6,3.6,3, SIENNA), (1.8,1.8,2.4,2.4,4, OCHRE)]
    z = 0
    for (dx,dy,w,d,h,col) in levels:
        faces,P = iso_box(ox, oy, w, d, h, z0=0, top=_mul(col,1.28), left=_mul(col,0.72), right=_mul(col,0.95), s=s)
        # shift origin per level so it stacks & steps in
        pass
    # simpler: draw stacked, recomputing origin by projecting the level base
    z = 0
    for (dx,dy,w,d,h,col) in levels:
        bx, by = iso(dx, dy, z, s)
        faces,_ = iso_box(ox+bx, oy+by, w, d, h, z0=0, top=_mul(col,1.30), left=_mul(col,0.70), right=_mul(col,0.95), s=s)
        out.append(faces)
        # windows: small dark rects on the right (x) face, gridded
        def P(x,y,zz): p=iso(x,y,zz,s); return (ox+bx+p[0], oy+by+p[1])
        for wi in range(1, int(w)):
            for hi in range(1, int(h)):
                a=P(wi,0,hi-0.25); b=P(wi+0.55,0,hi-0.25); c=P(wi+0.55,0,hi+0.35); e=P(wi,0,hi+0.35)
                out.append(poly([a,b,c,e], INK, stroke="none", sw=0, extra='opacity="0.55"'))
        z += h
    return "".join(out)

def plate_iso_cluster():
    ox, oy = 165, 235; s = 18; out = []
    # a 3x3 grid of extruded prisms, varying heights — a mini block, back-to-front order
    heights = [[2,5,3],[4,2,6],[3,6,2]]
    cols = [[SLATE,ULTRA,SLATE],[ULTRA,SLATE,ULTRA],[SLATE,ULTRA,SLATE]]
    order = sorted([(gx,gy) for gy in range(3) for gx in range(3)], key=lambda t:(t[0]+t[1]))
    for (gx,gy) in order:
        h = heights[gy][gx]; col = cols[gy][gx]
        bx,by = iso(gx*2.1, gy*2.1, 0, s)
        faces,_ = iso_box(ox+bx, oy+by, 1.8, 1.8, h, top=_mul(col,1.32), left=_mul(col,0.70), right=_mul(col,0.94), s=s)
        out.append(faces)
    # a faint construction-outline of one taller prism, floating right (Pohl "expose the scaffold")
    bx,by = iso(6.6, 0.6, 0, s)
    fx, fy = ox+bx, oy+by
    def P(x,y,z): p=iso(x,y,z,s); return (fx+p[0], fy+p[1])
    edges = [((0,0,0),(1.8,0,0)),((1.8,0,0),(1.8,1.8,0)),((1.8,1.8,0),(0,1.8,0)),((0,1.8,0),(0,0,0)),
             ((0,0,0),(0,0,7)),((1.8,0,0),(1.8,0,7)),((1.8,1.8,0),(1.8,1.8,7)),((0,1.8,0),(0,1.8,7)),
             ((0,0,7),(1.8,0,7)),((1.8,0,7),(1.8,1.8,7)),((1.8,1.8,7),(0,1.8,7)),((0,1.8,7),(0,0,7))]
    for a,b in edges:
        pa,pb = P(*a),P(*b)
        out.append(f'<line x1="{pa[0]:.1f}" y1="{pa[1]:.1f}" x2="{pb[0]:.1f}" y2="{pb[1]:.1f}" stroke="{OCHRE}" stroke-width="1.1" opacity="0.9"/>')
    return "".join(out)

# ============================ LANE B — flat-colour negative space (Favre) =====================
def plate_rubin():
    # Rubin's vase: the SAME contour reads as a vase (figure) OR two faces (ground) — one shape, double duty.
    cx = 150; out = []
    out.append(f'<rect x="30" y="30" width="240" height="240" fill="{OCHRE}"/>')
    # vase silhouette (centered) in ground colour; its edges are two facing profiles
    def profile(sign):
        # a face profile curve from top to bottom, mirrored by sign
        p = f"M {cx} 44 "
        pts = [(0,44),(-16,64),(-8,96),(-30,120),(-30,150),(-14,176),(-22,210),(-6,240),(0,256)]
        d = f"M {cx+pts[0][0]*sign:.0f} {pts[0][1]} "
        d += f"C {cx-8*sign:.0f} 58 {cx-22*sign:.0f} 60 {cx-16*sign:.0f} 78 "
        d += f"C {cx-8*sign:.0f} 100 {cx-34*sign:.0f} 104 {cx-30*sign:.0f} 126 "
        d += f"C {cx-27*sign:.0f} 150 {cx-40*sign:.0f} 158 {cx-24*sign:.0f} 182 "
        d += f"C {cx-12*sign:.0f} 202 {cx-30*sign:.0f} 214 {cx-14*sign:.0f} 238 "
        d += f"L {cx+30*sign:.0f} 256 L {cx:.0f} 256 Z"
        return d
    # vase = union of the two mirrored halves, filled in ground colour
    out.append(f'<path d="{profile(1)}" fill="{GROUND}" stroke="none"/>')
    out.append(f'<path d="{profile(-1)}" fill="{GROUND}" stroke="none"/>')
    # base + rim to read as a vessel
    out.append(f'<rect x="{cx-34}" y="248" width="68" height="12" fill="{GROUND}"/>')
    out.append(f'<rect x="{cx-30}" y="40" width="60" height="10" fill="{GROUND}"/>')
    return out

def plate_negative_gaze():
    # bold flat: a crescent — two overlapping discs, the negative bite IS the subject (subtraction).
    out = []
    out.append(f'<rect x="30" y="30" width="240" height="240" fill="{ULTRA}"/>')
    out.append(f'<defs><mask id="cres"><rect x="30" y="30" width="240" height="240" fill="white"/>'
               f'<circle cx="178" cy="132" r="86" fill="black"/></mask></defs>')
    out.append(f'<circle cx="140" cy="150" r="92" fill="{CREAM}" mask="url(#cres)"/>')
    # one reserved accent dot (the "one shape does double duty" — reads as a moon + an eye)
    out.append(f'<circle cx="120" cy="150" r="9" fill="{SIENNA}"/>')
    return out

# ============================ LANE C — data-encoded marks (Lupi) ==============================
def plate_data_week():
    # "A week of focus": 7 days, each a shaped polygon in a grid cell.
    # size(radius)=hours; colour=dominant category; notch=a qualitative flag (a hard day).
    data = [  # day, hours, category, hard?
        ("M",6.5,"deep",False),("T",4.0,"meet",True),("W",7.5,"deep",False),
        ("T",5.0,"admin",False),("F",6.0,"deep",True),("S",2.5,"admin",False),("S",1.5,"meet",False)]
    catcol = {"deep":ULTRA,"meet":OCHRE,"admin":SLATE}
    out = []; x0=40; y0=90; cw=32
    out.append(f'<rect x="30" y="30" width="240" height="240" fill="{GROUND}"/>')
    for i,(day,hrs,cat,hard) in enumerate(data):
        cx = x0 + i*cw + 8; cy = y0 + 60
        r = 6 + hrs*3.4
        # polygon mark: hexagon sized by hours, coloured by category
        pts = []
        n = 6
        for k in range(n):
            a = math.pi/2 + k*2*math.pi/n
            pts.append((cx + r*math.cos(a), cy - r*math.sin(a)))
        out.append(poly(pts, catcol[cat], stroke=INK, sw=1.3))
        if hard:  # qualitative flag: a small sienna notch = "a hard day"
            out.append(f'<circle cx="{cx:.0f}" cy="{cy-r-7:.0f}" r="3.4" fill="{SIENNA}"/>')
        out.append(f'<text x="{cx:.0f}" y="{y0+150:.0f}" text-anchor="middle" font-size="11" fill="{INK}" font-family="ui-monospace,monospace">{day}</text>')
    # bespoke legend (carries the grammar — the WHY, not just keys)
    ly = 250
    out.append(f'<text x="40" y="{ly}" font-size="10.5" fill="{INK}" font-family="ui-monospace,monospace">size = hours · colour = focus type · </text>')
    out.append(f'<circle cx="222" cy="{ly-3.5:.0f}" r="3.4" fill="{SIENNA}"/>')
    out.append(f'<text x="230" y="{ly}" font-size="10.5" fill="{INK}" font-family="ui-monospace,monospace">= a hard day</text>')
    return out

# ============================ LANE D — the synthesised deviation ==============================
def plate_deviation():
    # isometric geometry CARRYING data-encoded marks: iso "bars", height+colour = a data value.
    # one projection (iso) + one encoding (data->height/colour) + one palette (few) + one mark (prism).
    ox, oy = 150, 232; s = 20; out = []
    vals = [3,6,2,7,4,5]  # a series
    cats = [ULTRA,OCHRE,ULTRA,SIENNA,ULTRA,OCHRE]
    order = list(range(6))
    # lay them on a 2x3 iso grid, back-to-front
    cells = [(gx,gy) for gy in range(2) for gx in range(3)]
    cells = sorted(cells, key=lambda t:(t[0]+t[1]))
    for idx,(gx,gy) in enumerate(cells):
        v = vals[idx]; col = cats[idx]
        bx,by = iso(gx*2.3, gy*2.3, 0, s)
        faces,_ = iso_box(ox+bx, oy+by, 1.7, 1.7, v, top=_mul(col,1.32), left=_mul(col,0.70), right=_mul(col,0.95), s=s)
        out.append(faces)
    return "".join(out)

# ===================================== assemble ==============================================
def card(num, title, artist, svg_inner, note, viewbox="0 0 300 300"):
    return f'''<figure class="card">
  <svg viewBox="{viewbox}" role="img" aria-label="{html.escape(title)}">
    <rect x="0" y="0" width="300" height="300" fill="{GROUND}"/>
    {svg_inner}
  </svg>
  <figcaption><span class="n">{num}</span> <b>{html.escape(title)}</b>
  <em>{html.escape(artist)}</em><span class="note">{note}</span></figcaption>
</figure>'''

PLATES = [
    card("A1","Isometric construction — a terraced tower","Pohl · build from a projection system, expose the scaffold",
         plate_iso_tower(),"[extracted] Fully code-built: iso projection + extruded prisms + gridded windows. Density is <b>constructed</b>, not hand-composed."),
    card("A2","Isometric block cluster + exposed wireframe","Pohl · construction is the illustration",
         plate_iso_cluster(),"[extracted] Same projection; the ochre wireframe shows the scaffold Pohl leaves visible. Palette/subject taste is the layer above."),
    card("B1","Figure-ground — Rubin's vase","Favre · one shape does double duty; ground carries meaning",
         "".join(plate_rubin()),"[extracted] One contour reads as a vase <i>or</i> two faces. Negative space is the subject. <b>Where</b> to cut is the taste layer."),
    card("B2","Subtraction — the crescent bite","Favre · remove anything the piece survives without",
         "".join(plate_negative_gaze()),"[extracted] A disc subtracted from a disc; the absence is the image + one reserved accent. Reads as moon / eye."),
    card("C1","Data-encoded marks — a week of focus","Lupi · derive the encoding from the data; the legend carries the WHY",
         "".join(plate_data_week()),"[extracted] size=hours, colour=focus type, a sienna notch = a hard day. Bespoke encoding + a legend that carries qualitative meaning."),
    card("D1","The deviation — isometric marks carrying data","Synthesis · combine moves no single artist uses together",
         plate_deviation(),"[taste] iso geometry (Pohl) + data→height/colour (Lupi) + a few-palette (Favre) + one mark. Not any one signature — the <b>ownable</b> lane. Style-invention → developing-style."),
]

HTML = f'''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Imagery — illustration direction (code-buildable lanes)</title>
<style>
  :root {{ --ground:{GROUND}; --ink:{INK}; }}
  * {{ box-sizing:border-box; }}
  body {{ margin:0; background:{_mul(GROUND,0.94)}; color:{INK};
    font-family:"Plus Jakarta Sans",system-ui,-apple-system,sans-serif; line-height:1.5; }}
  header {{ max-width:1100px; margin:0 auto; padding:48px 28px 8px; }}
  h1 {{ font-family:"Bricolage Grotesque",Georgia,serif; font-size:30px; letter-spacing:-.01em; margin:0 0 6px; }}
  header p {{ max-width:70ch; margin:.3em 0; color:{_mul(INK,1.5)}; }}
  .key {{ font:12.5px/1.6 ui-monospace,monospace; color:{_mul(INK,1.7)}; margin-top:10px; }}
  .grid {{ max-width:1100px; margin:14px auto 60px; padding:0 28px; display:grid;
    grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:22px; }}
  .card {{ margin:0; background:{GROUND}; border:1px solid {_mul(GROUND,0.82)}; border-radius:10px; overflow:hidden; }}
  .card svg {{ width:100%; height:auto; display:block; }}
  figcaption {{ padding:12px 15px 15px; font-size:13.5px; border-top:1px solid {_mul(GROUND,0.86)}; }}
  figcaption .n {{ font:600 12px ui-monospace,monospace; color:{OCHRE}; margin-right:6px; }}
  figcaption b {{ font-weight:600; }}
  figcaption em {{ display:block; font-style:normal; color:{_mul(INK,1.6)}; font-size:12px; margin:3px 0 7px; }}
  figcaption .note {{ display:block; font-size:12px; color:{_mul(INK,1.35)}; line-height:1.45; }}
  footer {{ max-width:1100px; margin:0 auto; padding:0 28px 60px; color:{_mul(INK,1.7)}; font-size:12.5px; }}
</style></head><body>
<header>
  <h1>Imagery — the illustration direction, built in code</h1>
  <p>Round 1 of the like/not loop. Each plate is generated parametrically by <code>build.py</code> — the generator
  <b>is</b> the proof these lanes are code-buildable (no image generation, no editor). The <i>hand</i> layer
  (expressive linework, hand textures) is deliberately <b>not</b> attempted here — that's the select-or-commission pole.</p>
  <p class="key">Lanes: <b>A</b> isometric construction (Pohl) · <b>B</b> flat-colour negative space (Favre) ·
  <b>C</b> data-encoded marks (Lupi) · <b>D</b> the synthesised deviation. Palette = Corbusier-muted.</p>
</header>
<div class="grid">
{"".join(PLATES)}
</div>
<footer>React per plate or per lane — <b>like / not</b>, and which way to push (denser? sparser? bolder palette?
more geometric? more ornament?). Round 2 refines toward what lands. Style invention itself → <code>developing-style</code>.</footer>
</body></html>'''

open("index.html", "w", encoding="utf-8").write(HTML)
print(f"wrote index.html ({len(HTML)} bytes, {len(PLATES)} plates)")

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
    # Tufte-HONEST base (form defers to charting: a Cleveland dot plot — position=hours, honest baseline,
    # data-ink minimal), given only the imagery HUMANISTIC layer on top: colour=category (from the colour
    # skill's palette) + a sienna ring = a qualitative flag (a hard day) + a legend that carries the WHY.
    data = [("Mon",6.5,"deep",False),("Tue",4.0,"meet",True),("Wed",7.5,"deep",False),
            ("Thu",5.0,"admin",False),("Fri",6.0,"deep",True),("Sat",2.5,"admin",False),("Sun",1.5,"meet",False)]
    catcol = {"deep":ULTRA,"meet":OCHRE,"admin":SLATE}
    out = [f'<rect x="0" y="0" width="300" height="300" fill="{GROUND}"/>']
    x0, x1, y0, row, hmax = 76, 268, 60, 23, 8
    def X(h): return x0 + (h/hmax)*(x1-x0)
    ybot = y0 + 7*row - row + 12
    for hv in range(0, 9, 2):                       # honest, minimal x-axis
        xx = X(hv)
        out.append(f'<line x1="{xx:.1f}" y1="{y0-9:.0f}" x2="{xx:.1f}" y2="{ybot:.0f}" stroke="{_mul(GROUND,0.8)}" stroke-width="1"/>')
        out.append(f'<text x="{xx:.1f}" y="{ybot+12:.0f}" text-anchor="middle" font-size="9" fill="{_mul(INK,1.7)}" font-family="ui-monospace,monospace">{hv}h</text>')
    for i,(day,hrs,cat,hard) in enumerate(data):
        yy = y0 + i*row
        out.append(f'<line x1="{x0}" y1="{yy}" x2="{X(hrs):.1f}" y2="{yy}" stroke="{_mul(GROUND,0.76)}" stroke-width="1.4"/>')   # leader = honest position
        out.append(f'<circle cx="{X(hrs):.1f}" cy="{yy}" r="5.4" fill="{catcol[cat]}" stroke="{INK}" stroke-width="1"/>')
        if hard:
            out.append(f'<circle cx="{X(hrs):.1f}" cy="{yy}" r="9.6" fill="none" stroke="{SIENNA}" stroke-width="1.7"/>')
        out.append(f'<text x="{x0-9}" y="{yy+3.6:.0f}" text-anchor="end" font-size="10.5" fill="{INK}" font-family="ui-monospace,monospace">{day}</text>')
    ly = 256                                         # legend carries the WHY, not just keys
    for lx,(col,lab) in zip((46,104,162),((ULTRA,"deep"),(OCHRE,"meet"),(SLATE,"admin"))):
        out.append(f'<circle cx="{lx}" cy="{ly-3.5}" r="5" fill="{col}" stroke="{INK}" stroke-width="1"/><text x="{lx+9}" y="{ly}" font-size="10" fill="{INK}" font-family="ui-monospace,monospace">{lab}</text>')
    out.append(f'<circle cx="220" cy="{ly-3.5}" r="7" fill="none" stroke="{SIENNA}" stroke-width="1.7"/><text x="231" y="{ly}" font-size="10" fill="{INK}" font-family="ui-monospace,monospace">a hard day</text>')
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

# ==================== §1 — selecting & critiquing (diagrammatic principle demos) ==============
def _lines(x, y, n, w=86):
    return "".join(f'<rect x="{x}" y="{y+i*10:.0f}" width="{w-(i%3)*16}" height="4" rx="2" fill="{_mul(INK,2.5)}"/>' for i in range(n))
def _tag(x, y, txt, col):
    return f'<rect x="{x-22}" y="{y}" width="44" height="15" rx="7.5" fill="{col}"/><text x="{x}" y="{y+11:.0f}" text-anchor="middle" font-size="9.5" fill="#fff" font-family="ui-monospace,monospace">{txt}</text>'

def plate_carry_message():
    out = [f'<rect width="300" height="300" fill="{GROUND}"/>']
    for x, good in ((22, False), (166, True)):
        out.append(f'<rect x="{x}" y="40" width="112" height="204" rx="5" fill="{CREAM}" stroke="{_mul(GROUND,0.8)}"/>')
        out.append(_lines(x+12, 56, 3))
        if good:
            out.append(f'<rect x="{x+12}" y="96" width="88" height="62" rx="3" fill="{GROUND}" stroke="{_mul(GROUND,0.75)}"/>')
            out.append(f'<polyline points="{x+22},148 {x+44},128 {x+64},134 {x+92},106" fill="none" stroke="{ULTRA}" stroke-width="3"/>')
            out.append(_tag(x+56, 218, "READ", ULTRA))
        else:
            out.append(f'<circle cx="{x+56}" cy="128" r="25" fill="none" stroke="{_mul(SLATE,1.25)}" stroke-width="8" opacity=".45"/>')
            out.append(_tag(x+56, 218, "SKIP", SIENNA))
        out.append(_lines(x+12, 170, 4))
    return "".join(out)

def plate_stock_trap():
    out = [f'<rect width="300" height="300" fill="{GROUND}"/>']
    # generic stock "team" — low attention (dots land AWAY); an informative mark — attention lands ON it
    out.append(f'<rect x="24" y="60" width="120" height="120" rx="6" fill="{PALE}"/>')
    for i,cx in enumerate((54,84,114)):
        out.append(f'<circle cx="{cx}" cy="118" r="13" fill="{_mul(SLATE,1.15)}"/><rect x="{cx-14}" y="134" width="28" height="34" rx="8" fill="{_mul(SLATE,1.15)}"/>')
    out.append(f'<text x="84" y="196" text-anchor="middle" font-size="10" fill="{_mul(INK,1.6)}" font-family="ui-monospace,monospace">generic stock</text>')
    for dx,dy in ((160,70),(184,90),(150,150),(200,160),(176,200),(210,120)):  # attention scattered off it
        out.append(f'<circle cx="{dx}" cy="{dy}" r="6" fill="{OCHRE}" opacity=".5"/>')
    out.append(f'<rect x="176" y="96" width="64" height="64" rx="6" fill="{GROUND}" stroke="{ULTRA}" stroke-width="2"/><text x="208" y="132" text-anchor="middle" font-size="26" fill="{ULTRA}">42%</text>')
    out.append(f'<circle cx="208" cy="128" r="30" fill="none" stroke="{ULTRA}" stroke-width="2.5" opacity=".8"/>')  # attention ON the informative mark
    out.append(f'<text x="208" y="196" text-anchor="middle" font-size="10" fill="{_mul(INK,1.6)}" font-family="ui-monospace,monospace">informative</text>')
    return "".join(out)

def plate_gaze():
    out = [f'<rect width="300" height="300" fill="{GROUND}"/>']
    # a simple profile face looking right toward the subject; fixation follows the gaze (~4x on the subject)
    out.append(f'<path d="M70 92 q-30 6 -30 58 q0 54 40 66 l0 26 l40 0 l0 -30 q22 -14 22 -46" fill="{CREAM}" stroke="{INK}" stroke-width="2"/>')
    out.append(f'<circle cx="96" cy="140" r="6" fill="{INK}"/>')  # eye
    out.append(f'<line x1="104" y1="138" x2="196" y2="126" stroke="{OCHRE}" stroke-width="2" stroke-dasharray="4 4"/>')
    out.append(f'<polygon points="196,126 186,121 187,131" fill="{OCHRE}"/>')
    out.append(f'<rect x="196" y="104" width="66" height="52" rx="5" fill="{GROUND}" stroke="{ULTRA}" stroke-width="2"/><text x="229" y="136" text-anchor="middle" font-size="12" fill="{ULTRA}" font-family="ui-monospace,monospace">the point</text>')
    out.append(f'<text x="150" y="230" text-anchor="middle" font-size="11" fill="{_mul(INK,1.5)}" font-family="ui-monospace,monospace">point the gaze at the subject (~4× fixations)</text>')
    return "".join(out)

def plate_caption():
    out = [f'<rect width="300" height="300" fill="{GROUND}"/>']
    # good: caption NEAR ; bad: caption FAR (split attention)
    out.append(f'<rect x="24" y="52" width="110" height="74" rx="4" fill="{ULTRA}"/>')
    out.append(f'<rect x="24" y="130" width="110" height="9" rx="2" fill="{_mul(INK,2.2)}"/>')
    out.append(_tag(79, 150, "NEAR", ULTRA))
    out.append(f'<rect x="166" y="52" width="110" height="60" rx="4" fill="{_mul(SLATE,1.15)}"/>')
    out.append(f'<rect x="166" y="214" width="110" height="9" rx="2" fill="{_mul(INK,2.2)}"/>')  # caption far below
    out.append(f'<path d="M221 116 L221 208" stroke="{SIENNA}" stroke-width="1.5" stroke-dasharray="3 4"/>')
    out.append(_tag(221, 168, "FAR", SIENNA))
    out.append(f'<text x="150" y="252" text-anchor="middle" font-size="11" fill="{_mul(INK,1.5)}" font-family="ui-monospace,monospace">corresponding words + picture, together</text>')
    return "".join(out)

def plate_rot():
    out = [f'<rect width="300" height="300" fill="{GROUND}"/>']
    out.append(f'<rect x="34" y="54" width="232" height="150" rx="4" fill="{CREAM}"/>')
    out.append(f'<circle cx="160" cy="128" r="22" fill="{OCHRE}"/><path d="M34 174 Q150 150 266 178 L266 204 L34 204 Z" fill="{SIENNA}"/>')
    for i in (1,2):  # rule-of-thirds grid
        out.append(f'<line x1="{34+232*i/3:.0f}" y1="54" x2="{34+232*i/3:.0f}" y2="204" stroke="{INK}" stroke-width="1" opacity=".35"/>')
        out.append(f'<line x1="34" y1="{54+150*i/3:.0f}" x2="266" y2="{54+150*i/3:.0f}" stroke="{INK}" stroke-width="1" opacity=".35"/>')
    out.append(f'<text x="150" y="238" text-anchor="middle" font-size="13" font-weight="700" fill="{SIENNA}" font-family="ui-monospace,monospace">[MYTH]</text>')
    out.append(f'<text x="150" y="256" text-anchor="middle" font-size="10.5" fill="{_mul(INK,1.5)}" font-family="ui-monospace,monospace">the grid does not predict photo quality</text>')
    return "".join(out)

# ==================== §3 — treatment (real SVG filters on a code "photo stand-in") ============
FDEFS = f'''<defs>
 <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{SLATE}"/><stop offset="1" stop-color="{CREAM}"/></linearGradient>
 <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1"><stop offset=".4" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".66"/></linearGradient>
 <filter id="gray"><feColorMatrix type="saturate" values="0"/></filter>
 <filter id="duo"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="table" tableValues="0.20 0.91"/><feFuncG type="table" tableValues="0.29 0.85"/><feFuncB type="table" tableValues="0.47 0.75"/></feComponentTransfer></filter>
 <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .42 0" result="a"/><feComposite in="a" in2="SourceGraphic" operator="in" result="g"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="g"/></feMerge></filter>
</defs>'''
def scene(flt="", accent=None, scrim=False, label=""):
    f = f' filter="url(#{flt})"' if flt else ""
    s = [FDEFS, f'<g transform="translate(30,50)"><g{f}>',
         f'<rect width="240" height="150" fill="url(#sky)"/>',
         f'<circle cx="172" cy="52" r="24" fill="{OCHRE}"/>',
         f'<path d="M0 150 L0 92 Q70 66 130 96 T240 90 L240 150 Z" fill="{SIENNA}"/>',
         f'<path d="M0 150 L0 120 Q96 94 240 124 L240 150 Z" fill="{_mul(SIENNA,0.66)}"/>', '</g>']
    if accent:  # one reserved accent kept in colour over a grayscale base
        s.append(f'<circle cx="172" cy="52" r="24" fill="{accent}"/>')
    if scrim:
        s.append(f'<rect width="240" height="150" fill="url(#scrim)"/>')
        s.append(f'<text x="16" y="132" font-size="22" font-weight="700" fill="#fff" font-family="Bricolage Grotesque,serif">Readable.</text>')
    s.append('</g>')
    return "".join(s)

# ==================== §5 — accessibility & integrity =========================================
def plate_alt_roles():
    out = [f'<rect width="300" height="300" fill="{GROUND}"/>']
    roles = [("informative","alt = the point it makes",ULTRA,44),
             ("decorative",'alt = "" (skipped)',_mul(SLATE,1.2),120),
             ("functional","alt = the action",OCHRE,196),
             ("complex","short alt + long desc → charting",SIENNA,272)]
    for lab,alt,col,y in roles:
        out.append(f'<rect x="24" y="{y-16}" width="40" height="40" rx="5" fill="{col}"/>')
        out.append(f'<text x="76" y="{y-2}" font-size="12.5" font-weight="600" fill="{INK}" font-family="ui-monospace,monospace">{lab}</text>')
        out.append(f'<text x="76" y="{y+14}" font-size="11" fill="{_mul(INK,1.5)}" font-family="ui-monospace,monospace">{alt}</text>')
    return "".join(out)

def plate_text_contrast():
    out = [FDEFS, f'<rect width="300" height="300" fill="{GROUND}"/>']
    # left: text on busy image, NO scrim -> fails ; right: WITH scrim -> passes
    out.append(f'<g transform="translate(20,60)"><rect width="118" height="118" rx="4" fill="url(#sky)"/><circle cx="86" cy="34" r="18" fill="{OCHRE}"/><path d="M0 118 L0 74 Q60 56 118 78 L118 118 Z" fill="{SIENNA}"/>')
    out.append(f'<text x="10" y="70" font-size="16" font-weight="700" fill="#fff" font-family="Bricolage Grotesque,serif">Hard to</text><text x="10" y="90" font-size="16" font-weight="700" fill="#fff" font-family="Bricolage Grotesque,serif">read</text></g>')
    out.append(_tag(79, 190, "FAILS", SIENNA))
    out.append(f'<g transform="translate(162,60)"><rect width="118" height="118" rx="4" fill="url(#sky)"/><circle cx="86" cy="34" r="18" fill="{OCHRE}"/><path d="M0 118 L0 74 Q60 56 118 78 L118 118 Z" fill="{SIENNA}"/><rect width="118" height="118" fill="url(#scrim)"/>')
    out.append(f'<text x="10" y="90" font-size="16" font-weight="700" fill="#fff" font-family="Bricolage Grotesque,serif">Legible</text></g>')
    out.append(_tag(221, 190, "AA ✓", ULTRA))
    out.append(f'<text x="150" y="248" text-anchor="middle" font-size="11" fill="{_mul(INK,1.5)}" font-family="ui-monospace,monospace">scrim/overlay so text holds AA (→ colour)</text>')
    return "".join(out)

def plate_honest():
    out = [f'<rect width="300" height="300" fill="{GROUND}"/>']
    # honest baseline vs a misleading truncated one (integrity; the chart floor)
    for x, trunc, tag, tc in ((22, True, "MISLEADS", SIENNA), (166, False, "HONEST", ULTRA)):
        out.append(f'<rect x="{x}" y="46" width="112" height="150" rx="4" fill="{CREAM}"/>')
        base = 150 if trunc else 186   # truncated baseline exaggerates the difference
        vals = [0.55, 0.62, 0.7]
        for i,v in enumerate(vals):
            bh = (base-56)*v if not trunc else (base-56)*v
            top = base - ( (v-0.5)*300 if trunc else v*128 )
            out.append(f'<rect x="{x+18+i*30}" y="{top:.0f}" width="20" height="{base-top:.0f}" fill="{ULTRA}"/>')
        out.append(f'<line x1="{x+10}" y1="{base}" x2="{x+102}" y2="{base}" stroke="{INK}" stroke-width="1.5"/>')
        out.append(f'<text x="{x+56}" y="{base+16:.0f}" text-anchor="middle" font-size="9" fill="{_mul(INK,1.7)}" font-family="ui-monospace,monospace">{"baseline ≠ 0" if trunc else "baseline = 0"}</text>')
        out.append(_tag(x+56, 210, tag, tc))
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

SECTIONS = [
 ("§1 · Selecting &amp; critiquing (the evidence)",
  "Mostly about photographs the skill <i>selects</i> (it doesn't generate them) — shown as principle diagrams.", [
    card("1a","Carry the message","coherence [STRONG] — off-brief images hurt comprehension", plate_carry_message(),
         "Left: decorative filler → skipped. Right: a message-carrying image → read. Every image earns its place, or it's cut."),
    card("1b","Task-relevance, not presence","stock-trap [STRONG]", plate_stock_trap(),
         "Generic model-stock draws attention AWAY (it's filler); an informative mark holds it. Replace stock with the real thing."),
    card("1c","Gaze steers the eye","gaze-cueing [STRONG] ~4×", plate_gaze(),
         "Point the model's gaze at the subject — viewers follow it. (It moves attention/intent, <i>not liking</i>.)"),
    card("1d","Captions go near","spatial contiguity [STRONG]", plate_caption(),
         "Corresponding words + picture together; a far caption splits attention."),
    card("1e","Rule of thirds","[MYTH] as a quality predictor", plate_rot(),
         "The ROT grid does not distinguish good photos from bad — a low-stakes framing heuristic at most."),
 ]),
 ("§3 · Treatment (light, code-feasible)",
  "Real SVG filters on a code ‘photo stand-in’. Colour values defer to the colour skill.", [
    card("3a","Duotone","[CONVENTION] · SVG feColorMatrix + feComponentTransfer", scene("duo"),
         "Shadows → one hue, highlights → another. A strong palette-unifier for a photo set. Fully code-built."),
    card("3b","Grayscale + one accent","[CONVENTION] · one reserved accent pops", scene("gray", accent=OCHRE),
         "Desaturate the field, keep a single accent in colour — composes with the colour skill's reserved-accent rule."),
    card("3c","Grain / texture","[CONVENTION] · SVG feTurbulence", scene("grain"),
         "An analog, made feel; fights the slick-stock look."),
    card("3d","Scrim for legibility","[STRONG floor] · text over image holds AA", scene(scrim=True),
         "A gradient scrim so text on top holds contrast — the accessibility move, not decoration. Contrast → colour skill."),
 ]),
 ("§4 · Illustration direction",
  "A constructed scaffold synthesised from Pohl / Favre / Ngai / Lupi (not copied). Code builds the scaffold; the hand is select-or-commission.", [
    card("A","Isometric block cluster + exposed wireframe","Pohl · construction is the illustration",
         plate_iso_cluster(),"[extracted] Iso projection + extruded prisms; the ochre wireframe shows the scaffold Pohl leaves visible. <i>(A1 tower dropped.)</i>"),
    card("B1","Figure-ground — Rubin's vase","Favre · one shape does double duty; ground carries meaning",
         "".join(plate_rubin()),"[extracted] One contour reads as a vase <i>or</i> two faces. Negative space is the subject. <b>Where</b> to cut is the taste layer."),
    card("B2","Subtraction — the crescent bite","Favre · remove anything the piece survives without",
         "".join(plate_negative_gaze()),"[extracted] A disc subtracted from a disc; the absence is the image + one reserved accent. Reads as moon / eye."),
    card("C","Data-illustration ON an honest chart","Lupi × Tufte · humanistic layer over a Cleveland dot plot",
         "".join(plate_data_week()),"[extracted] Form + honesty defer to <b>charting</b> (position=hours, honest baseline, data-ink). Imagery adds only the humanistic layer: colour=category, the sienna ring = a hard day, a legend that carries the <i>why</i>. Palette from the <b>colour skill</b>."),
    card("D","The deviation — isometric marks carrying data","Synthesis · combine moves no single artist uses together",
         plate_deviation(),"[taste] iso geometry (Pohl) + data→height/colour + a few-palette + one mark. <i>Decorative data-texture, not a chart to read precisely — for exact values, use <b>charting</b>.</i> The ownable lane; style-invention → developing-style."),
 ]),
 ("§5 · Accessibility &amp; integrity (the floor this skill owns)",
  "Non-text content has a text alternative (WCAG 1.1.1); text over image holds AA; imagery is honest.", [
    card("5a","Alt text by role","[STRONG · WCAG 1.1.1]", plate_alt_roles(),
         "Informative → the point it makes; decorative → alt=&quot;&quot;; functional → the action; complex → short alt + long description (→ charting)."),
    card("5b","Text over image","[STRONG floor] · AA contrast", plate_text_contrast(),
         "No scrim → fails AA; scrim/overlay → passes. Never ‘probably fine’. Contrast values → the colour skill."),
    card("5c","Honest imagery","[CONVENTION · integrity]", plate_honest(),
         "No deceptive crops or truncated baselines that misrepresent — imagery must not assert something false."),
 ]),
]

sections_html = "".join(
  f'<section><h2>{t}</h2><p class="sub">{sub}</p><div class="grid">{"".join(cards)}</div></section>'
  for (t, sub, cards) in SECTIONS)

HTML = f'''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Imagery — worked gallery (the whole skill, in code)</title>
<style>
  * {{ box-sizing:border-box; }}
  body {{ margin:0; background:{_mul(GROUND,0.94)}; color:{INK};
    font-family:"Plus Jakarta Sans",system-ui,-apple-system,sans-serif; line-height:1.5; }}
  header, section {{ max-width:1120px; margin:0 auto; padding:0 28px; }}
  header {{ padding-top:48px; }}
  h1 {{ font-family:"Bricolage Grotesque",Georgia,serif; font-size:30px; letter-spacing:-.01em; margin:0 0 6px; }}
  header p {{ max-width:76ch; margin:.3em 0; color:{_mul(INK,1.5)}; }}
  h2 {{ font-family:"Bricolage Grotesque",Georgia,serif; font-size:19px; margin:40px 0 2px;
    padding-top:22px; border-top:1px solid {_mul(GROUND,0.8)}; }}
  .sub {{ margin:.2em 0 4px; color:{_mul(INK,1.55)}; font-size:13.5px; max-width:80ch; }}
  .grid {{ margin:14px 0 8px; display:grid; grid-template-columns:repeat(auto-fill,minmax(288px,1fr)); gap:20px; }}
  .card {{ margin:0; background:{GROUND}; border:1px solid {_mul(GROUND,0.82)}; border-radius:10px; overflow:hidden; }}
  .card svg {{ width:100%; height:auto; display:block; }}
  figcaption {{ padding:11px 14px 14px; font-size:13px; border-top:1px solid {_mul(GROUND,0.86)}; }}
  figcaption .n {{ font:600 12px ui-monospace,monospace; color:{OCHRE}; margin-right:6px; }}
  figcaption b {{ font-weight:600; }}
  figcaption em {{ display:block; font-style:normal; color:{_mul(INK,1.6)}; font-size:11.5px; margin:3px 0 6px; }}
  figcaption .note {{ display:block; font-size:11.5px; color:{_mul(INK,1.35)}; line-height:1.45; }}
  footer {{ max-width:1120px; margin:0 auto; padding:34px 28px 64px; color:{_mul(INK,1.7)}; font-size:12.5px; }}
</style></head><body>
<header>
  <h1>Imagery — the whole skill, built in code</h1>
  <p>A worked gallery across the imagery skill: <b>§1</b> selecting &amp; critiquing (the evidence) ·
  <b>§3</b> treatment (real SVG filters) · <b>§4</b> the illustration direction (synthesised from four illustrators) ·
  <b>§5</b> accessibility. Every plate is generated by <code>build.py</code> — the generator <b>is</b> the proof
  the buildable lanes are buildable. No photographs are generated; the <i>hand</i> layer (linework, textures) is
  the select-or-commission pole and isn't attempted. Palette throughout = Corbusier (the colour skill's set).</p>
</header>
{sections_html}
<footer>React per plate or per section — <b>like / not</b>, and which way to push. The like/not loop refines toward
what lands. Data-illustration composes with <code>charting</code>; colour with <code>graphical-perception-and-color</code>;
style-invention with <code>developing-style</code>.</footer>
</body></html>'''

open("index.html", "w", encoding="utf-8").write(HTML)
print(f"wrote index.html ({len(HTML)} bytes, {sum(len(c) for _,_,c in SECTIONS)} plates in {len(SECTIONS)} sections)")

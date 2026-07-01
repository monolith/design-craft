#!/usr/bin/env python3
"""'A little world' (cozy floating island — game/app key art) — where ISOMETRIC wins.
The appeal IS the explorable 3-D world; minimal deletes the desire, not just the data.
Run: python3 iso_world.py -> iw.svg (iso winner) ws.svg (Swiss foil) du.svg (duotone foil) + world.html
"""
import math
def mul(h,f):
    h=h.lstrip("#"); r,g,b=(int(h[i:i+2],16) for i in (0,2,4))
    return "#%02x%02x%02x"%tuple(max(0,min(255,int(c*f))) for c in (r,g,b))
W,Hh=360,410
def wrap(inner): return f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{Hh}" viewBox="0 0 {W} {Hh}">{inner}</svg>'

# palette
SKY0="#bfe0ea"; SKY1="#eaf1ec"; GRASS="#8fbe5c"; GRASS_D="#6f9a45"; GRASS_T="#a5cf72"
SOIL="#a9744a"; SOIL_D="#7e5233"; ROCK="#8a6a4c"; WATER="#69b0cf"; WATER_D="#4d94b6"
WALL="#f0e6d2"; WALL_S="#d9cbb0"; ROOF="#c25b3a"; ROOF_D="#9c4529"; DOOR="#7a4f30"
LH="#efe7d6"; LH_R="#c94b34"; TRUNK="#6b4a2f"; TREE="#4e8140"; TREE_D="#3c6733"; TREE_L="#63a052"
CREAM="#f4 efe".replace(" ",""); CREAM="#f4efe4"; INK="#2c2a26"; GOLD="#f4c95d"; PATH="#d8c39a"

C30=math.cos(math.radians(30)); S30=math.sin(math.radians(30))
OX,OY,SC=180,150,17
def P(x,y,z=0): return (OX+(x-y)*C30*SC, OY+((x+y)*S30-z)*SC)
def poly(pts,col,st="none",sw=0,op=1.0):
    return f'<polygon points="{" ".join(f"{a:.1f},{b:.1f}" for a,b in pts)}" fill="{col}" stroke="{st}" stroke-width="{sw}" stroke-linejoin="round" opacity="{op}"/>'

def iso_world():
    s=[f'<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{SKY0}"/><stop offset="1" stop-color="{SKY1}"/></linearGradient></defs>']
    s.append(f'<rect width="{W}" height="{Hh}" fill="url(#sk)"/>')
    # sun + clouds
    s.append(f'<circle cx="300" cy="58" r="22" fill="{GOLD}"/>')
    def cloud(a,b,sc):
        L=[(0,0,1),(-1.1,0.1,0.7),(1.1,0.1,0.75),(-0.5,-0.4,0.62),(0.55,-0.34,0.58)]
        return "".join(f'<ellipse cx="{a+dx*sc*12:.1f}" cy="{b+dy*sc*12:.1f}" rx="{sc*14*r:.1f}" ry="{sc*10*r:.1f}" fill="#ffffff" opacity="0.85"/>' for dx,dy,r in L)
    s.append(cloud(66,70,0.9)); s.append(cloud(250,110,0.55))
    g=4.2
    # ---- floating island body (soil cliff + taper) ----
    B=P(1.2,1.2,-9.5)   # bottom point
    s.append(poly([P(-g,g,0),P(g,g,0),P(g,g,-1.4),P(-g,g,-1.4)],SOIL))          # front-left cliff
    s.append(poly([P(g,g,0),P(g,-g,0),P(g,-g,-1.4),P(g,g,-1.4)],mul(SOIL,0.82)))# front-right cliff
    s.append(poly([P(-g,g,-1.4),P(g,g,-1.4),B],SOIL_D))                          # taper left
    s.append(poly([P(g,g,-1.4),P(g,-g,-1.4),B],mul(SOIL_D,0.85)))               # taper right
    for rx,ry in [(-2.4,g),(0.2,g),(2.6,g),(g,-2.0),(g,0.6)]:                    # rock striations
        a=P(rx,ry,-0.5); b=P(rx if ry==g else g, ry if rx==g else g, -1.2)
        s.append(f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{(a[0]+B[0])/2:.1f}" y2="{(a[1]+B[1])/2+6:.1f}" stroke="{SOIL_D}" stroke-width="1" opacity="0.5"/>')
    # ---- top grass surface ----
    s.append(poly([P(-g,-g,0),P(g,-g,0),P(g,g,0),P(-g,g,0)],GRASS))
    s.append(poly([P(-g,-g,0),P(g,-g,0),P(g,g,0),P(-g,g,0)],"none",st=GRASS_D,sw=1.2))
    # grass edge highlight
    s.append(poly([P(-g,-g,0),P(g,-g,0),P(g,-g,0.12),P(-g,-g,0.12)],GRASS_T))
    # ---- pond (front-left) + waterfall off the edge ----
    pond=[P(-2.6,1.6),P(-1.2,1.0),P(-0.2,1.8),P(-1.0,2.8),P(-2.6,2.6)]
    s.append(poly(pond,WATER,st=WATER_D,sw=1))
    wx=P(-1.0,2.8,0); we=P(-1.0,g,0)
    s.append(f'<path d="M{wx[0]-6:.1f} {wx[1]:.1f} L{we[0]-6:.1f} {we[1]:.1f} L{B[0]-3:.1f} {B[1]-30:.1f} L{we[0]+2:.1f} {we[1]:.1f} L{wx[0]+4:.1f} {wx[1]:.1f} Z" fill="{WATER}" opacity="0.75"/>')
    # ---- path ----
    s.append(f'<path d="M{P(2.4,-2.4)[0]:.1f} {P(2.4,-2.4)[1]:.1f} Q {P(0,0)[0]:.1f} {P(0,0)[1]:.1f} {P(1.5,2.6)[0]:.1f} {P(1.5,2.6)[1]:.1f}" fill="none" stroke="{PATH}" stroke-width="6" stroke-linecap="round" opacity="0.9"/>')

    # ---- helpers for objects ----
    def box(gx,gy,w,d,h,col,z0=0):
        return (poly([P(gx,gy,z0+h),P(gx+w,gy,z0+h),P(gx+w,gy+d,z0+h),P(gx,gy+d,z0+h)],mul(col,1.22))
               +poly([P(gx,gy,z0),P(gx,gy+d,z0),P(gx,gy+d,z0+h),P(gx,gy,z0+h)],mul(col,0.74))
               +poly([P(gx,gy+d,z0),P(gx+w,gy+d,z0),P(gx+w,gy+d,z0+h),P(gx,gy+d,z0+h)],mul(col,0.92)))
    def cottage(gx,gy):
        out=box(gx,gy,1.5,1.3,1.0,WALL)
        A=P(gx,gy,1.0);Bp=P(gx+1.5,gy,1.0);Cp=P(gx+1.5,gy+1.3,1.0);Dp=P(gx,gy+1.3,1.0)
        R1=P(gx,gy+0.65,1.7);R2=P(gx+1.5,gy+0.65,1.7)
        out+=poly([Dp,Cp,R2,R1],mul(ROOF,0.9))          # front roof
        out+=poly([A,Bp,R2,R1],mul(ROOF,1.12))          # back roof
        out+=poly([A,Dp,R1],ROOF_D)                     # gable
        # door + window on front (right) face
        fr=[P(gx,gy+1.3,0),P(gx+1.5,gy+1.3,0),P(gx+1.5,gy+1.3,1.0),P(gx,gy+1.3,1.0)]
        def q(u,v):
            ab=(fr[0][0]+(fr[1][0]-fr[0][0])*u,fr[0][1]+(fr[1][1]-fr[0][1])*u)
            dc=(fr[3][0]+(fr[2][0]-fr[3][0])*u,fr[3][1]+(fr[2][1]-fr[3][1])*u)
            return (ab[0]+(dc[0]-ab[0])*v,ab[1]+(dc[1]-ab[1])*v)
        out+=poly([q(0.15,1),q(0.4,1),q(0.4,0.4),q(0.15,0.4)],DOOR)
        out+=poly([q(0.6,0.35),q(0.85,0.35),q(0.85,0.7),q(0.6,0.7)],"#8fb7c4")
        return out
    def tree(gx,gy,sc=1.0):
        b=P(gx,gy,0); tp=P(gx,gy,0.6*sc)
        out=f'<rect x="{b[0]-1.6:.1f}" y="{tp[1]:.1f}" width="3.2" height="{(b[1]-tp[1]):.1f}" fill="{TRUNK}"/>'
        for dx,dy,r,c in [(0,-2,10,TREE),(-6,2,8,TREE_D),(6,2,8,TREE_L),(0,4,7,TREE_D)]:
            out+=f'<circle cx="{tp[0]+dx*sc:.1f}" cy="{tp[1]-6*sc+dy*sc:.1f}" r="{r*sc:.1f}" fill="{c}"/>'
        return out
    def lighthouse(gx,gy):
        b=P(gx,gy,0); tw=17; th=52
        out=poly([(b[0]-tw/2,b[1]),(b[0]+tw/2,b[1]),(b[0]+tw*0.32,b[1]-th),(b[0]-tw*0.32,b[1]-th)],LH,st=mul(LH,0.8),sw=0.6)
        for k in range(3):
            yy=b[1]-6-k*16; w2=tw/2-k*1.9
            out+=f'<rect x="{b[0]-w2:.1f}" y="{yy:.1f}" width="{2*w2:.1f}" height="6" fill="{LH_R}"/>'
        lr=b[1]-th
        out+=f'<rect x="{b[0]-6:.1f}" y="{lr-10:.1f}" width="12" height="10" fill="{mul(LH,0.85)}"/>'
        out+=f'<rect x="{b[0]-4:.1f}" y="{lr-8:.1f}" width="8" height="6" fill="{GOLD}"/>'
        out+=poly([(b[0]-7,lr-10),(b[0]+7,lr-10),(b[0],lr-20)],LH_R)
        return out
    def hill(gx,gy,r):  # a raised grassy mound
        c=P(gx,gy,0)
        return (f'<ellipse cx="{c[0]:.1f}" cy="{c[1]-6:.1f}" rx="{r*1.7:.1f}" ry="{r*0.9:.1f}" fill="{GRASS_D}"/>'
               +f'<ellipse cx="{c[0]:.1f}" cy="{c[1]-11:.1f}" rx="{r*1.5:.1f}" ry="{r*0.8:.1f}" fill="{GRASS}"/>')

    # ---- place objects back-to-front (increasing x+y) ----
    s.append(hill(-2.4,-2.6,15))
    s.append(tree(-3.1,-1.4,0.9))
    s.append(lighthouse(2.6,-2.9))
    s.append(tree(0.3,-3.0,0.8))
    s.append(tree(3.0,-0.6,0.85))
    s.append(cottage(-2.4,-0.9))
    s.append(tree(-3.2,1.4,0.8))
    s.append(cottage(1.4,0.7))
    s.append(tree(3.1,2.2,0.9))
    s.append(tree(0.0,3.0,0.85))
    # title
    s.append(f'<text x="180" y="392" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="20" letter-spacing="3" fill="{INK}">A LITTLE WORLD</text>')
    return wrap("".join(s))

# ---------- Swiss / subtractive foil ----------
def swiss_world():
    BG="#eef2f0"; ISLE="#3a5a4a"; SUN="#e2a44e"; INK="#26302b"
    s=[f'<rect width="{W}" height="{Hh}" fill="{BG}"/>']
    s.append(f'<circle cx="250" cy="120" r="70" fill="{SUN}"/>')
    s.append(f'<ellipse cx="150" cy="250" rx="120" ry="30" fill="{ISLE}"/>')
    s.append(f'<path d="M150 250 q-16 40 -6 66 q12 -8 12 -30 q0 22 12 30 q10 -26 -6 -66 Z" fill="{ISLE}"/>')  # taper
    s.append(f'<rect x="120" y="232" width="18" height="14" fill="{ISLE}"/><polygon points="118,232 129,222 140,232" fill="{ISLE}"/>')  # one house
    s.append(f'<text x="30" y="360" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="30" letter-spacing="1" fill="{INK}">A LITTLE</text>')
    s.append(f'<text x="30" y="388" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="30" letter-spacing="1" fill="{INK}">WORLD</text>')
    return wrap("".join(s))

# ---------- Duotone foil ----------
def duo_world():
    CREAM="#efe2c2"; INK="#1d2b3a"; INK2="#33506a"
    s=[f'<rect width="{W}" height="{Hh}" fill="{CREAM}"/>']
    s.append(f'<circle cx="250" cy="96" r="52" fill="{INK}"/>')
    for rr in (43,33,23): s.append(f'<circle cx="250" cy="96" r="{rr}" fill="none" stroke="{CREAM}" stroke-width="2.2"/>')
    s.append(f'<ellipse cx="170" cy="250" rx="128" ry="34" fill="{INK}"/>')
    s.append(f'<path d="M170 250 q-20 46 -8 76 q14 -10 14 -34 q0 24 14 34 q12 -30 -8 -76 Z" fill="{INK}"/>')
    # a couple of blocky houses + trees in the ink
    for hx,hw in ((120,16),(196,14)):
        s.append(f'<rect x="{hx}" y="228" width="{hw}" height="16" fill="{INK2}"/><polygon points="{hx-3},228 {hx+hw/2},216 {hx+hw+3},228" fill="{INK2}"/>')
    for tx in (150,214):
        s.append(f'<rect x="{tx-1.5}" y="230" width="3" height="12" fill="{INK2}"/><circle cx="{tx}" cy="226" r="9" fill="{INK2}"/>')
    s.append(f'<text x="180" y="384" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="26" letter-spacing="3" fill="{INK}">A LITTLE WORLD</text>')
    return wrap("".join(s))

VARS=[("iw","Isometric — the winner","the whole cozy world in one dimensional, explorable scene: island, cottages, lighthouse, pond, waterfall",iso_world),
      ("ws","Swiss / subtractive (foil)","beautiful and empty — an island ICON. The 'world to explore' that sells a game is gone.",swiss_world),
      ("du","Duotone print (foil)","bold and graphic, but flat — the coziness and depth that make a little world inviting don't survive two inks.",duo_world)]
for key,name,desc,fn in VARS: open(f"{key}.svg","w").write(fn())
cards="".join(f'<figure><div class="p">{fn()}</div><figcaption><b>{name}</b><span>{desc}</span></figcaption></figure>' for key,name,desc,fn in VARS)
HTML=f'''<!doctype html><html><head><meta charset="utf-8"><title>Where isometric wins</title><style>
body{{margin:0;background:#14120f;color:#efe7d6;font-family:system-ui,sans-serif}}
h1{{text-align:center;font-weight:600;padding:34px 0 4px;font-size:23px}} .s{{text-align:center;color:#9a9078;margin:0 0 24px;font-size:13px;max-width:640px;margin-left:auto;margin-right:auto;line-height:1.5}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:26px;max-width:1050px;margin:0 auto;padding:0 26px 60px}}
figure{{margin:0}} .p svg{{width:100%;height:auto;display:block;border-radius:8px;box-shadow:0 6px 26px #000a}}
figcaption{{padding:10px 2px}} figcaption b{{display:block;font-size:14px}} figcaption span{{display:block;color:#9a9078;font-size:11.5px;margin-top:2px;line-height:1.4}}
</style></head><body><h1>Where isometric wins — a "little world"</h1>
<p class="s">Key art for a cozy island game/app. Here the product IS the explorable 3-D world — so minimal doesn't
just lose information, it loses the <i>desire</i>. Even a minimalist picks the iso.</p>
<div class="grid">{cards}</div></body></html>'''
open("world.html","w").write(HTML)
print(f"wrote world.html + {len(VARS)} svgs")

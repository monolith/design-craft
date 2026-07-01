#!/usr/bin/env python3
"""Isometric as an ARTISTIC tool (not a diagram) — impossible geometry & geometric abstraction.
Op-art tumbling blocks · an iso wave field · a Monument-Valley scene · a Penrose impossible triangle.
Run: python3 iso_art.py -> a1..a4.svg + iso_art.html
"""
import math
def clamp(c): return max(0,min(255,int(c)))
def mul(h,f):
    h=h.lstrip("#"); r,g,b=(int(h[i:i+2],16) for i in (0,2,4))
    return "#%02x%02x%02x"%(clamp(r*f),clamp(g*f),clamp(b*f))
def lerp(c1,c2,t):
    a=[int(c1.lstrip('#')[i:i+2],16) for i in (0,2,4)]; b=[int(c2.lstrip('#')[i:i+2],16) for i in (0,2,4)]
    return "#%02x%02x%02x"%tuple(clamp(a[k]+(b[k]-a[k])*t) for k in range(3))
def ramp(cols,t):
    t=max(0,min(1,t)); n=len(cols)-1; seg=t*n; i=min(int(seg),n-1); return lerp(cols[i],cols[i+1],seg-i)
W,Hh=360,380
def wrap(inner): return f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{Hh}" viewBox="0 0 {W} {Hh}">{inner}</svg>'
def poly(pts,col,st="none",sw=0):
    return f'<polygon points="{" ".join(f"{a:.1f},{b:.1f}" for a,b in pts)}" fill="{col}" stroke="{st}" stroke-width="{sw}" stroke-linejoin="round"/>'
C30=math.cos(math.radians(30)); S30=0.5
def title(t,fill): return f'<text x="180" y="366" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="13" letter-spacing="3" fill="{fill}">{t}</text>'

# ---------- A1 · tumbling blocks (op-art tessellation) ----------
def a1():
    PAL=["#e07a5f","#f2cc8f","#81b29a","#5c6b8a","#8a5a83"]
    s=[f'<rect width="{W}" height="{Hh}" fill="#20232e"/>']
    s2=6.0; cols,rows=22,26; x0,y0=40,20
    def cube(cx,cy,base):
        top=[(cx,cy-s2*0.5),(cx+s2*C30,cy),(cx,cy+s2*0.5),(cx-s2*C30,cy)]
        left=[(cx-s2*C30,cy),(cx,cy+s2*0.5),(cx,cy+s2*1.5),(cx-s2*C30,cy+s2)]
        right=[(cx,cy+s2*0.5),(cx+s2*C30,cy),(cx+s2*C30,cy+s2),(cx,cy+s2*1.5)]
        return poly(top,mul(base,1.28))+poly(left,mul(base,0.66))+poly(right,mul(base,0.95))
    for r in range(rows):
        for c in range(cols):
            cx=x0+c*s2*1.732+(r%2)*s2*C30; cy=y0+r*s2*1.5
            if -20<cx<380 and 0<cy<340:
                s.append(cube(cx,cy,ramp(PAL,(c/cols*0.6+r/rows*0.4))))
    s.append(f'<rect width="{W}" height="{Hh}" fill="#20232e" opacity="0"/>')  # keep bg id
    s.append(title("TUMBLING BLOCKS · op-art",'#e8e2d4'))
    return wrap("".join(s))

# ---------- A2 · isometric wave field ----------
def a2():
    PAL=["#3a2f6b","#6b3f8a","#c2537a","#f0925e","#f4c95d"]
    s=[f'<rect width="{W}" height="{Hh}" fill="#141026"/>']
    N=16; OX,OY,SC=180,120,10.5
    def P(x,y,z): return (OX+(x-y)*C30*SC, OY+((x+y)*S30-z)*SC)
    cells=[]
    for i in range(N):
        for j in range(N):
            di=i-(N-1)/2; dj=j-(N-1)/2; d=math.sqrt(di*di+dj*dj)
            h=2.6+2.3*math.sin(d*0.9-0.4)
            cells.append((i,j,h))
    cells.sort(key=lambda c:(c[0]+c[1]))
    for i,j,h in cells:
        base=ramp(PAL,(h-0.3)/5.2); gx,gy=i-N/2,j-N/2
        top=[P(gx,gy,h),P(gx+1,gy,h),P(gx+1,gy+1,h),P(gx,gy+1,h)]
        left=[P(gx,gy+1,0),P(gx,gy+1,h),P(gx+1,gy+1,h),P(gx+1,gy+1,0)]
        right=[P(gx+1,gy,0),P(gx+1,gy,h),P(gx+1,gy+1,h),P(gx+1,gy+1,0)]
        s.append(poly(left,mul(base,0.66))+poly(right,mul(base,0.86))+poly(top,mul(base,1.22)))
    s.append(title("ISOMETRIC WAVE FIELD",'#efe7d6'))
    return wrap("".join(s))

# ---------- A3 · Monument Valley scene ----------
def a3():
    s=[f'<defs><linearGradient id="mvsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8f7bb0"/><stop offset="0.55" stop-color="#d69a9a"/><stop offset="1" stop-color="#f0c79a"/></linearGradient></defs>']
    s.append(f'<rect width="{W}" height="{Hh}" fill="url(#mvsky)"/>')
    ROSE="#d98b8b"; SAND="#ecd2a6"; TEAL="#6fae9f"; PLUM="#7d6597"; CREAM="#f4efe4"; WHITE="#fbf7ef"; POP="#e2624a"; INK="#3a2f45"
    OX,OY,SC=180,150,20
    def P(x,y,z): return (OX+(x-y)*C30*SC, OY+((x+y)*S30-z)*SC)
    def box(gx,gy,w,d,h,col,z0=0):
        return (poly([P(gx,gy,z0+h),P(gx+w,gy,z0+h),P(gx+w,gy+d,z0+h),P(gx,gy+d,z0+h)],mul(col,1.2))
               +poly([P(gx,gy,z0),P(gx,gy+d,z0),P(gx,gy+d,z0+h),P(gx,gy,z0+h)],mul(col,0.72))
               +poly([P(gx,gy+d,z0),P(gx+w,gy+d,z0),P(gx+w,gy+d,z0+h),P(gx,gy+d,z0+h)],mul(col,0.9)))
    # soft moon
    s.append(f'<circle cx="270" cy="66" r="26" fill="#f7e6c8" opacity="0.9"/>')
    # back tall tower
    s.append(box(-2.4,-2.4,1.8,1.8,4.4,PLUM))
    s.append(box(-2.6,-2.6,2.2,2.2,0.4,mul(PLUM,1.25),z0=4.4))
    # a stepped stair descending front-left
    for k in range(4):
        s.append(box(-2.4+ -0.0, -0.6+k*0.0, 1.0,1.0,1.0,TEAL,z0=3.2-k*0.8) if False else box(-3.4-k*0.0,-0.4+k*0.9,1.0,1.0,0.9,TEAL,z0=3.0-k*0.8))
    # main platform (mid)
    s.append(box(-0.6,-0.6,2.6,2.6,2.4,ROSE))
    s.append(box(-0.8,-0.8,3.0,3.0,0.35,mul(ROSE,1.22),z0=2.4))
    # connecting bridge to a small tower (front-right)
    s.append(box(2.0,0.4,2.0,0.7,0.35,SAND,z0=2.0))
    s.append(box(3.6,-0.2,1.3,1.3,3.0,SAND))
    s.append(box(3.5,-0.3,1.5,1.5,0.35,mul(SAND,1.2),z0=3.0))
    # arch on the main platform
    ax,ay=P(0.7,0.7,2.75)
    s.append(f'<path d="M{ax-20:.1f} {ay:.1f} q0 -26 20 -26 q20 0 20 26" fill="none" stroke="{CREAM}" stroke-width="6"/>')
    # a tiny white figure on the platform
    fx,fy=P(0.6,0.6,2.75)
    s.append(f'<ellipse cx="{fx:.1f}" cy="{fy-13:.1f}" rx="4.4" ry="5" fill="{WHITE}"/><polygon points="{fx-4.5:.1f},{fy:.1f} {fx+4.5:.1f},{fy:.1f} {fx:.1f},{fy-12:.1f}" fill="{WHITE}"/><circle cx="{fx:.1f}" cy="{fy-15:.1f}" r="2.4" fill="{POP}"/>')
    s.append(title("MONUMENT · impossible architecture",'#3a2f45'))
    return wrap("".join(s))

# ---------- A4 · Penrose impossible triangle ----------
def a4():
    s=[f'<rect width="{W}" height="{Hh}" fill="#efe7d6"/>']
    # build a tribar from cubes along three arms (isometric closure illusion)
    BASE="#4a6fa5"; OX,OY,SC=180,150,18
    def P(x,y,z): return (OX+(x-y)*C30*SC, OY+((x+y)*S30-z)*SC)
    def cube(gx,gy,gz):
        col=BASE
        return (poly([P(gx,gy,gz+1),P(gx+1,gy,gz+1),P(gx+1,gy+1,gz+1),P(gx,gy+1,gz+1)],mul(col,1.25))
               +poly([P(gx,gy,gz),P(gx,gy+1,gz),P(gx,gy+1,gz+1),P(gx,gy,gz+1)],mul(col,0.68))
               +poly([P(gx,gy+1,gz),P(gx+1,gy+1,gz),P(gx+1,gy+1,gz+1),P(gx,gy+1,gz+1)],mul(col,0.92)))
    n=4
    cubes=[]
    for i in range(n+1): cubes.append((i,0,0))          # arm A: +x along y=0,z=0
    for k in range(1,n+1): cubes.append((n,0,k))        # arm B: up (+z) at x=n,y=0
    for k in range(1,n+1): cubes.append((n-k,0,n))      # arm C: back (-x) at z=n -> returns over the start (impossible closure)
    # draw far-to-near: sort by (gx+gy - gz) ascending so higher/near cubes overlap and close the illusion
    cubes.sort(key=lambda c:(c[0]+c[1]-c[2]))
    for gx,gy,gz in cubes: s.append(cube(gx,gy,gz))
    s.append(title("PENROSE TRIANGLE · the impossible",'#2c2a26'))
    return wrap("".join(s))

VARS=[("a1","Op-art tumbling blocks","a gradient tessellation — the projection makes cubes pop in and out; pure decorative illusion",a1),
      ("a2","Isometric wave field","a grid of gradient columns as a frozen ripple — generative sculpture, beauty from pure geometry",a2),
      ("a3","Monument Valley scene","serene pastel impossible-architecture — iso as the language of poetic, playable art",a3)]
# a4 (Penrose triangle) attempted but the cube-arm closure didn't cohere into a true impossible loop — omitted.
for k,n,d,fn in VARS: open(f"{k}.svg","w").write(fn())
cards="".join(f'<figure><div class="p">{fn()}</div><figcaption><b>{n}</b><span>{d}</span></figcaption></figure>' for k,n,d,fn in VARS)
HTML=f'''<!doctype html><html><head><meta charset="utf-8"><title>Isometric as an artistic tool</title><style>
body{{margin:0;background:#100e14;color:#efe7d6;font-family:system-ui,sans-serif}}
h1{{text-align:center;font-weight:600;padding:34px 0 4px;font-size:23px}} .s{{text-align:center;color:#9a90a7;margin:0 0 24px;font-size:13px;max-width:660px;margin-left:auto;margin-right:auto;line-height:1.5}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:26px;max-width:1080px;margin:0 auto;padding:0 26px 60px}}
figure{{margin:0}} .p svg{{width:100%;height:auto;display:block;border-radius:8px;box-shadow:0 6px 26px #000a}}
figcaption{{padding:10px 2px}} figcaption b{{display:block;font-size:14px}} figcaption span{{display:block;color:#9a90a7;font-size:11.5px;margin-top:2px;line-height:1.4}}
</style></head><body><h1>Isometric as an artistic tool</h1>
<p class="s">Not a diagram — art. Impossible geometry and geometric abstraction, where the projection's flatness
(parallel lines, no perspective) is the whole source of the beauty and the illusion.</p>
<div class="grid">{cards}</div></body></html>'''
open("iso_art.html","w").write(HTML)
print(f"wrote iso_art.html + {len(VARS)} svgs")

#!/usr/bin/env python3
"""US sunset / timezone / daylight map — FOUR leans, same (correct) science.
Data computed once (NOAA); only the visual treatment changes. 2026-07-01 21:00 EDT.
Run: python3 map_variations.py -> md.svg mw.svg mb.svg mu.svg + map_variations.html
Leans: dark dashboard · Swiss editorial · blueprint technical · duotone print.
"""
import math
# ---------- solar math (NOAA) ----------
def jd(y,mo,d,h):
    if mo<=2: y-=1; mo+=12
    A=y//100; B=2-A+A//4
    return math.floor(365.25*(y+4716))+math.floor(30.6001*(mo+1))+d+B-1524.5+h/24.0
def sp(J):
    T=(J-2451545.0)/36525.0
    L0=(280.46646+T*(36000.76983+T*0.0003032))%360
    M=357.52911+T*(35999.05029-0.0001537*T); Mr=math.radians(M)
    e=0.016708634-T*(0.000042037+0.0000001267*T)
    C=(1.914602-T*(0.004817+0.000014*T))*math.sin(Mr)+(0.019993-0.000101*T)*math.sin(2*Mr)+0.000289*math.sin(3*Mr)
    tl=L0+C; om=125.04-1934.136*T; lam=tl-0.00569-0.00478*math.sin(math.radians(om))
    eps=23+(26+(21.448-T*(46.815+T*(0.00059-T*0.001813)))/60)/60+0.00256*math.cos(math.radians(om))
    decl=math.degrees(math.asin(math.sin(math.radians(eps))*math.sin(math.radians(lam))))
    yv=math.tan(math.radians(eps/2))**2; L0r=math.radians(L0)
    EoT=4*math.degrees(yv*math.sin(2*L0r)-2*e*math.sin(Mr)+4*e*yv*math.sin(Mr)*math.cos(2*L0r)-0.5*yv*yv*math.sin(4*L0r)-1.25*e*e*math.sin(2*Mr))
    return decl,EoT
decl_i,EoT_i=sp(jd(2026,7,2,1.0)); decl_d,EoT_d=sp(jd(2026,7,1,12.0))
def elev(lat,lon):
    tst=(60+EoT_i+4*lon)%1440; ha=tst/4-180
    la,dr,har=math.radians(lat),math.radians(decl_i),math.radians(ha)
    cz=math.sin(la)*math.sin(dr)+math.cos(la)*math.cos(dr)*math.cos(har)
    return 90-math.degrees(math.acos(max(-1,min(1,cz))))
def sset(lat,lon,tz):
    la,dr=math.radians(lat),math.radians(decl_d)
    ch=(math.cos(math.radians(90.833))-math.sin(la)*math.sin(dr))/(math.cos(la)*math.cos(dr))
    if abs(ch)>1: return None
    H=math.degrees(math.acos(ch)); ss=(720-4*lon-EoT_d)+4*H
    return (ss+tz*60)%1440
def hhmm(m):
    h=int(m//60)%24; mm=int(round(m%60))
    if mm==60: mm=0; h=(h+1)%24
    return f"{h%12 or 12}:{mm:02d}{'a' if h<12 else 'p'}"

W,H=560,460
def proj(lon,lat): return (46+(lon+125)*8.0, 62+(49.5-lat)*9.4)
US=[(-124.7,48.4),(-124.2,43.0),(-124.0,40.4),(-122.4,37.8),(-120.6,34.5),(-117.1,32.5),(-114.7,32.7),(-111.0,31.3),(-108.2,31.3),(-106.5,31.8),(-103.0,29.0),(-99.5,27.5),(-97.4,25.9),(-95.0,29.0),(-93.8,29.7),(-90.0,29.2),(-88.0,30.3),(-84.3,30.0),(-82.8,27.8),(-81.1,25.2),(-80.1,25.8),(-80.6,28.4),(-81.4,30.7),(-79.2,33.2),(-75.9,36.9),(-75.5,38.4),(-74.0,40.5),(-71.1,41.5),(-70.0,41.7),(-70.8,43.1),(-67.0,44.9),(-69.2,47.4),(-71.5,45.0),(-76.5,43.6),(-79.0,43.3),(-82.5,41.7),(-83.0,42.3),(-82.5,45.0),(-84.7,45.9),(-87.0,45.1),(-88.0,46.9),(-90.9,46.8),(-95.2,49.0),(-104.0,49.0),(-116.0,49.0),(-123.0,49.0)]
USP="M"+" L".join(f"{x:.1f} {y:.1f}" for x,y in [proj(*p) for p in US])+" Z"
TERM=[]
for i in range(0,51):
    lat=24.5+25*i/50
    if elev(lat,-125)>0 and elev(lat,-66.5)<0:
        a,b=-125.0,-66.5
        for _ in range(44):
            m=(a+b)/2
            if elev(lat,m)>0: a=m
            else: b=m
        TERM.append(proj((a+b)/2,lat))
CITIES=[("Seattle",47.61,-122.33,-7,-1,"end"),("San Francisco",37.77,-122.42,-7,-1,"end"),("Los Angeles",34.05,-118.24,-7,-1,"end"),
("Phoenix",33.45,-112.07,-7,0,"middle"),("Denver",39.74,-104.99,-6,1,"start"),("Salt Lake City",40.76,-111.89,-6,-1,"end"),
("Dallas",32.78,-96.80,-5,0,"middle"),("Chicago",41.88,-87.63,-5,1,"start"),("Minneapolis",44.98,-93.27,-5,1,"start"),
("New Orleans",29.95,-90.07,-5,0,"middle"),("Miami",25.76,-80.19,-4,1,"start"),("Atlanta",33.75,-84.39,-4,1,"start"),
("New York",40.71,-74.01,-4,1,"start"),("Boston",42.36,-71.06,-4,1,"start")]
ZONES=[("PT",-125,-114.5,"6:00","−7"),("MT",-114.5,-101.5,"7:00","−6"),("CT",-101.5,-85.0,"8:00","−5"),("ET",-85.0,-66.5,"9:00","−4")]

def tsp(x,y,s,t,fill,fam,w="400",ls="0",anc="start"):
    return f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="{anc}" font-family="{fam}" font-weight="{w}" font-size="{s}" letter-spacing="{ls}" fill="{fill}">{t}</text>'

def render(st):
    p=st["id"]; S=st; s=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">']
    defs=f'<clipPath id="{p}us"><path d="{USP}"/></clipPath><filter id="{p}soft"><feGaussianBlur stdDeviation="3.5"/></filter>'
    if S.get("day_grad"): defs+=f'<linearGradient id="{p}day" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{S["day2"]}"/><stop offset="1" stop-color="{S["day"]}"/></linearGradient>'
    if S.get("grain"): defs+=f'<filter id="{p}gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0"/></filter>'
    s.append(f'<defs>{defs}</defs>')
    s.append(f'<rect width="{W}" height="{H}" fill="{S["bg"]}"/>')
    # header
    s.append(tsp(46,36,S["h_size"],S["title"],S["ink"],S["fh"],w="700",ls=S.get("h_ls","0")))
    s.append(tsp(514,34,S["sub_size"],S["sub"],S["mut"],S["fb"],w="400",ls="0.5",anc="end"))
    s.append(f'<line x1="46" y1="48" x2="514" y2="48" stroke="{S["rule"]}" stroke-width="1"/>')
    # blueprint grid
    if S.get("grid"):
        for gx in range(0,W+1,24): s.append(f'<line x1="{gx}" y1="56" x2="{gx}" y2="300" stroke="{S["grid_c"]}" stroke-width="0.5"/>')
        for gy in range(56,301,24): s.append(f'<line x1="0" y1="{gy}" x2="{W}" y2="{gy}" stroke="{S["grid_c"]}" stroke-width="0.5"/>')
    # land
    land = f'url(#{p}day)' if S.get("day_grad") else S["day"]
    if S.get("land_fill",True): s.append(f'<path d="{USP}" fill="{land}"/>')
    s.append(f'<g clip-path="url(#{p}us)">')
    # timezone bands
    if S.get("tz")=="bands":
        for name,l0,l1,_,_ in ZONES:
            x0=proj(l0,49.5)[0]; x1=proj(l1,49.5)[0]
            s.append(f'<rect x="{x0:.1f}" y="56" width="{x1-x0:.1f}" height="245" fill="{S["tzc"][name]}" opacity="{S.get("tz_op",0.34)}"/>')
    if S.get("tz") in ("bands","lines"):
        for _,l0,l1,_,_ in ZONES[1:]:
            x=proj(l0,49.5)[0]; s.append(f'<line x1="{x:.1f}" y1="56" x2="{x:.1f}" y2="300" stroke="{S["tz_line"]}" stroke-width="0.8" stroke-dasharray="3 4" opacity="0.5"/>')
    # night
    night=TERM[:]+[proj(-60,24.5+25*(len(TERM)-1)/50 if False else 25),proj(-60,49)]
    # simpler: extend to east edge using first/last term y
    ny0=TERM[0][1]; ny1=TERM[-1][1]
    night=TERM[:]+[(proj(-60,25)[0],ny1),(proj(-60,25)[0],ny0)]
    s.append(f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x,y in night)}" fill="{S["night"]}" opacity="{S["night_op"]}"/>')
    if S.get("stars"):
        v=999
        for _ in range(55):
            v=(v*1103515245+12345)&0x7fffffff; fx=180+(v%330)
            v=(v*1103515245+12345)&0x7fffffff; fy=60+(v%235)
            s.append(f'<circle cx="{fx}" cy="{fy}" r="0.7" fill="{S["star_c"]}" opacity="0.5"/>')
    s.append('</g>')
    # terminator
    tp="M"+" L".join(f"{x:.1f} {y:.1f}" for x,y in TERM)
    if S.get("glow"):
        s.append(f'<g clip-path="url(#{p}us)"><path d="{tp}" fill="none" stroke="{S["glow2"]}" stroke-width="11" opacity="0.5" filter="url(#{p}soft)"/><path d="{tp}" fill="none" stroke="{S["term"]}" stroke-width="2.4"/></g>')
    else:
        da=' stroke-dasharray="5 4"' if S.get("term_dash") else ''
        s.append(f'<g clip-path="url(#{p}us)"><path d="{tp}" fill="none" stroke="{S["term"]}" stroke-width="2.2"{da}/></g>')
    # outline
    s.append(f'<path d="{USP}" fill="none" stroke="{S["outline"]}" stroke-width="{S.get("ow",1.2)}" opacity="{S.get("oo",0.85)}"/>')
    # zone labels + current time
    for name,l0,l1,tm,off in ZONES:
        xc=(proj(l0,49.5)[0]+proj(l1,49.5)[0])/2
        s.append(tsp(xc,72,10.5,name,S["ink"],S["fb"],w="700",ls="1",anc="middle"))
        lab = f"{tm} PM" if not S.get("mono_time") else f"UTC{off}"
        s.append(tsp(xc,84,8.5,lab,S["accent"],S["fm"],anc="middle"))
    # cities
    for name,lat,lon,tz,dx,anc in CITIES:
        x,y=proj(lon,lat); up=elev(lat,lon)>0
        s.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="2.4" fill="{S["dot_day"] if up else S["dot_night"]}" stroke="{S["bg"]}" stroke-width="0.7"/>')
        lx=x+dx*7; yo=-6 if name in ("Phoenix","Dallas","New Orleans") else 3
        s.append(tsp(lx,y+yo,8.2,name,S["ink"],S["fb"],anc=anc))
        s.append(tsp(lx,y+yo+9,7.8,"↓ "+hhmm(sset(lat,lon,tz)),S["accent"],S["fm"],anc=anc))
    # grain
    if S.get("grain"): s.append(f'<rect width="{W}" height="300" filter="url(#{p}gr)" opacity="0.09"/>')
    # legend
    ly=316; s.append(f'<line x1="46" y1="{ly}" x2="514" y2="{ly}" stroke="{S["rule"]}" stroke-width="1"/>')
    def chip(x,col,txt,op=1.0):
        s.append(f'<rect x="{x}" y="{ly+14}" width="13" height="11" rx="2" fill="{col}" opacity="{op}"/>')
        s.append(tsp(x+19,ly+23,9.5,txt,S["ink"],S["fb"])); return x+19+len(txt)*5.6+20
    lx=chip(46,S["day"],"daylight now"); lx=chip(lx,S["night"],"night now",0.9)
    s.append(f'<line x1="{lx}" y1="{ly+20}" x2="{lx+15}" y2="{ly+20}" stroke="{S["term"]}" stroke-width="2.4"/>')
    s.append(tsp(lx+21,ly+23,9.5,"sunset line (now)",S["ink"],S["fb"]))
    s.append(tsp(46,ly+46,8.2,"Sunset times: NOAA solar equations, 2026-07-01 (±1 min). Zones show current local clock time.",S["mut"],S["fb"]))
    s.append(tsp(46,ly+60,8.2,"Daylight for 2026-07-02 01:00 UTC (9 PM EDT). Zone bands approximate — real ones follow state lines.",S["mut"],S["fb"]))
    s.append('</svg>')
    return "".join(s)

SANS="Helvetica, Arial, sans-serif"; SERIF="Georgia, serif"; MONO="ui-monospace, 'DejaVu Sans Mono', monospace"
STYLES=[
 dict(id="md",name="Dark dashboard",note="modern data-app: glowing terminator on a night field, colour-coded zones",
   bg="#0d1120",title="Where the sun is now",sub="live · US",h_size=18,h_ls="0",sub_size=10,
   fh=SERIF,fb=SANS,fm=MONO,ink="#e8eef7",mut="#8c98b0",accent="#f4c95d",rule="#28304a",
   day="#2f5468",day2="#5a86a0",day_grad=True,tz="bands",tzc={"PT":"#3f6f7a","MT":"#4a5f86","CT":"#6a5a86","ET":"#86566f"},
   tz_line="#e8eef7",night="#0b1020",night_op=0.9,stars=True,star_c="#cdd6ee",glow=True,glow2="#e2673a",term="#f0a24e",
   outline="#9fb4cf",dot_day="#f4c95d",dot_night="#6f7fa8"),
 dict(id="mw",name="Swiss editorial",note="light print infographic: pale land, hairline zones, one accent line, quiet labels",
   bg="#efe7d6",title="Where the sun is now",sub="US · sunset, daylight",h_size=19,h_ls="0",sub_size=10,
   fh=SERIF,fb=SANS,fm=SANS,ink="#26241f",mut="#8a8168",accent="#c2622f",rule="#d6ccb8",
   day="#ddd3c0",day_grad=False,tz="lines",tz_line="#b8ad95",
   night="#8f9ca3",night_op=0.4,stars=False,glow=False,term="#d8702f",outline="#26241f",ow=1.0,oo=0.9,
   dot_day="#26241f",dot_night="#8a8168"),
 dict(id="mb",name="Blueprint technical",note="engineering readout: cyan linework on a navy grid, UTC offsets, dashed terminator",
   bg="#0e2947",title="FIG. — US SUNSET / TERMINATOR",sub="01:00 UTC · 2026-07-02",h_size=13,h_ls="0.5",sub_size=8.5,
   fh=MONO,fb=MONO,fm=MONO,ink="#e6f1ff",mut="#7f9dc0",accent="#7fd0e0",rule="#1d3e63",
   day="#123a5e",day_grad=False,land_fill=True,grid=True,grid_c="#173a5e",tz="lines",tz_line="#cfe6ff",mono_time=True,
   night="#0a1e35",night_op=0.7,stars=False,glow=False,term_dash=True,term="#cfe6ff",outline="#7fd0e0",ow=1.1,oo=0.9,
   dot_day="#7fd0e0",dot_night="#4a6f96"),
 dict(id="mu",name="Duotone print",note="two inks + grain: coral day, navy night, screenprint poster register",
   bg="#f0e2c0",title="WHERE THE SUN IS NOW",sub="US · JUL 1, 9 PM ET",h_size=17,h_ls="1",sub_size=9,
   fh=SERIF,fb=SANS,fm=MONO,ink="#1b2740",mut="#5a5a4a",accent="#c14f2a",rule="#cbb98d",
   day="#e59a5c",day_grad=False,tz="lines",tz_line="#1b2740",
   night="#1b2740",night_op=0.92,stars=True,star_c="#f0e2c0",glow=False,term="#c14f2a",outline="#1b2740",ow=1.4,oo=0.9,
   grain=True,dot_day="#1b2740",dot_night="#c14f2a"),
]
for st in STYLES: open(f"{st['id']}.svg","w").write(render(st))
cards="".join(f'<figure><div class="p">{render(st)}</div><figcaption><b>{st["name"]}</b><span>{st["note"]}</span></figcaption></figure>' for st in STYLES)
HTML=f'''<!doctype html><html><head><meta charset="utf-8"><title>US sun map — four leans</title><style>
body{{margin:0;background:#0d0b12;color:#efe7d6;font-family:system-ui,sans-serif}}
h1{{text-align:center;font-weight:600;padding:34px 0 4px;font-size:23px}} .s{{text-align:center;color:#9a90a7;margin:0 0 24px;font-size:13px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:26px;max-width:1160px;margin:0 auto;padding:0 26px 60px}}
figure{{margin:0}} .p svg{{width:100%;height:auto;display:block;border-radius:6px;box-shadow:0 6px 26px #000a}}
figcaption{{padding:10px 2px}} figcaption b{{display:block;font-size:14px}} figcaption span{{display:block;color:#9a90a7;font-size:11.5px;margin-top:2px;line-height:1.4}}
</style></head><body><h1>US sunset map — four leans, one science</h1>
<p class="s">Identical NOAA-computed data (sunset times, zones, day/night terminator). Only the visual lean changes.</p>
<div class="grid">{cards}</div></body></html>'''
open("map_variations.html","w").write(HTML)
print(f"wrote map_variations.html + {len(STYLES)} svgs")

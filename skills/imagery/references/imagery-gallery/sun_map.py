#!/usr/bin/env python3
"""A website (nav menu + hero map): US time zones + actual sunset times + daylight,
for 2026-07-01 21:00 EDT (= 2026-07-02 01:00 UTC). Science via NOAA solar equations.
Run: python3 sun_map.py -> sun_map.svg + sun_map.html
"""
import math

# ---------------- solar math (NOAA) ----------------
def julian_day(y,mo,d,hour_utc):
    if mo<=2: y-=1; mo+=12
    A=y//100; B=2-A+A//4
    return math.floor(365.25*(y+4716))+math.floor(30.6001*(mo+1))+d+B-1524.5+hour_utc/24.0
def solar_params(JD):
    T=(JD-2451545.0)/36525.0
    L0=(280.46646+T*(36000.76983+T*0.0003032))%360
    M=357.52911+T*(35999.05029-0.0001537*T); Mr=math.radians(M)
    e=0.016708634-T*(0.000042037+0.0000001267*T)
    C=(1.914602-T*(0.004817+0.000014*T))*math.sin(Mr)+(0.019993-0.000101*T)*math.sin(2*Mr)+0.000289*math.sin(3*Mr)
    truelong=L0+C; omega=125.04-1934.136*T
    lam=truelong-0.00569-0.00478*math.sin(math.radians(omega))
    eps0=23+(26+(21.448-T*(46.815+T*(0.00059-T*0.001813)))/60)/60
    eps=eps0+0.00256*math.cos(math.radians(omega))
    decl=math.degrees(math.asin(math.sin(math.radians(eps))*math.sin(math.radians(lam))))
    yv=math.tan(math.radians(eps/2))**2; L0r=math.radians(L0)
    EoT=4*math.degrees(yv*math.sin(2*L0r)-2*e*math.sin(Mr)+4*e*yv*math.sin(Mr)*math.cos(2*L0r)-0.5*yv*yv*math.sin(4*L0r)-1.25*e*e*math.sin(2*Mr))
    return decl,EoT
JD_inst=julian_day(2026,7,2,1.0); decl_i,EoT_i=solar_params(JD_inst)   # the 9pm-EDT instant
JD_date=julian_day(2026,7,1,12.0); decl_d,EoT_d=solar_params(JD_date)  # for the date's sunset
def elevation(lat,lon,utc_hours,decl,EoT):
    tst=(utc_hours*60+EoT+4*lon)%1440; ha=tst/4-180
    latr,dr,har=math.radians(lat),math.radians(decl),math.radians(ha)
    cz=math.sin(latr)*math.sin(dr)+math.cos(latr)*math.cos(dr)*math.cos(har)
    return 90-math.degrees(math.acos(max(-1,min(1,cz))))
def elev_i(lat,lon): return elevation(lat,lon,1.0,decl_i,EoT_i)
def sunset_local_min(lat,lon,tz):
    latr,dr=math.radians(lat),math.radians(decl_d)
    cosH=(math.cos(math.radians(90.833))-math.sin(latr)*math.sin(dr))/(math.cos(latr)*math.cos(dr))
    if cosH<-1 or cosH>1: return None
    H=math.degrees(math.acos(cosH))
    solar_noon=720-4*lon-EoT_d; sunset_utc=solar_noon+4*H
    return (sunset_utc+tz*60)%1440
def hhmm(m):
    h=int(m//60)%24; mm=int(round(m%60));
    if mm==60: mm=0; h=(h+1)%24
    ap="a" if h<12 else "p"; h12=h%12 or 12
    return f"{h12}:{mm:02d}{ap}"

# ---------------- projection ----------------
W,H=560,540
def proj(lon,lat): return (50+(lon+125)*8.0, 100+(49.5-lat)*10.0)

# ---------------- US outline (approx lower-48) ----------------
US=[(-124.7,48.4),(-124.2,43.0),(-124.0,40.4),(-122.4,37.8),(-120.6,34.5),(-117.1,32.5),
(-114.7,32.7),(-111.0,31.3),(-108.2,31.3),(-106.5,31.8),(-103.0,29.0),(-99.5,27.5),(-97.4,25.9),
(-95.0,29.0),(-93.8,29.7),(-90.0,29.2),(-88.0,30.3),(-84.3,30.0),(-82.8,27.8),(-81.1,25.2),
(-80.1,25.8),(-80.6,28.4),(-81.4,30.7),(-79.2,33.2),(-75.9,36.9),(-75.5,38.4),(-74.0,40.5),
(-71.1,41.5),(-70.0,41.7),(-70.8,43.1),(-67.0,44.9),(-69.2,47.4),(-71.5,45.0),(-76.5,43.6),
(-79.0,43.3),(-82.5,41.7),(-83.0,42.3),(-82.5,45.0),(-84.7,45.9),(-87.0,45.1),(-88.0,46.9),
(-90.9,46.8),(-95.2,49.0),(-104.0,49.0),(-116.0,49.0),(-123.0,49.0)]
def us_path():
    p=[proj(*US[0])]; return "M"+" L".join(f"{x:.1f} {y:.1f}" for x,y in [proj(*pt) for pt in US])+" Z"

# ---------------- terminator (day/night boundary at the instant) ----------------
term=[]
for i in range(0,51):
    lat=24.5+(49.5-24.5)*i/50
    if elev_i(lat,-125)>0 and elev_i(lat,-66.5)<0:
        a,b=-125.0,-66.5
        for _ in range(44):
            m=(a+b)/2
            if elev_i(lat,m)>0: a=m
            else: b=m
        term.append(((a+b)/2,lat))
term_pts=[proj(lo,la) for lo,la in term]

# ---------------- cities ----------------
CITIES=[("Seattle",47.61,-122.33,-7),("San Francisco",37.77,-122.42,-7),("Los Angeles",34.05,-118.24,-7),
("Phoenix",33.45,-112.07,-7),("Denver",39.74,-104.99,-6),("Salt Lake City",40.76,-111.89,-6),
("Dallas",32.78,-96.80,-5),("Chicago",41.88,-87.63,-5),("Minneapolis",44.98,-93.27,-5),
("New Orleans",29.95,-90.07,-5),("Miami",25.76,-80.19,-4),("Atlanta",33.75,-84.39,-4),
("New York",40.71,-74.01,-4),("Boston",42.36,-71.06,-4)]
# left/right label placement to reduce overlap (dx sign, anchor)
PLACE={"Seattle":(-1,"end"),"San Francisco":(-1,"end"),"Los Angeles":(-1,"end"),"Phoenix":(0,"middle"),
"Denver":(1,"start"),"Salt Lake City":(-1,"end"),"Dallas":(0,"middle"),"Chicago":(1,"start"),
"Minneapolis":(1,"start"),"New Orleans":(0,"middle"),"Miami":(1,"start"),"Atlanta":(1,"start"),
"New York":(1,"start"),"Boston":(1,"start")}

# ---------------- colours ----------------
NIGHT="#0b1020"; PANEL="#141a2e"; DAY="#2f5468"; DAY_W="#5a86a0"; LAND="#22384a"
GLOW="#f0a24e"; GLOW2="#e2673a"; INK="#e8eef7"; MUT="#8c98b0"
GOLD="#f4c95d"; LINE="#3a4a6a"; SUN="#f4c95d"; NAVBG="#0d1324"
TZ={"PT":"#3f6f7a","MT":"#4a5f86","CT":"#6a5a86","ET":"#86566f"}

s=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">']
s.append(f'<defs>'
 f'<clipPath id="us"><path d="{us_path()}"/></clipPath>'
 f'<linearGradient id="day" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{DAY_W}"/><stop offset="1" stop-color="{DAY}"/></linearGradient>'
 f'<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0e1c"/><stop offset="1" stop-color="#10152a"/></linearGradient>'
 f'<filter id="soft"><feGaussianBlur stdDeviation="4"/></filter></defs>')
s.append(f'<rect width="{W}" height="{H}" fill="url(#sky)"/>')

# ---------- website nav menu ----------
s.append(f'<rect width="{W}" height="56" fill="{NAVBG}"/>')
s.append(f'<circle cx="34" cy="28" r="9" fill="{SUN}"/>')
for k in range(8):
    a=k*math.pi/4; s.append(f'<line x1="{34+math.cos(a)*12:.1f}" y1="{28+math.sin(a)*12:.1f}" x2="{34+math.cos(a)*15:.1f}" y2="{28+math.sin(a)*15:.1f}" stroke="{SUN}" stroke-width="1.6"/>')
s.append(f'<text x="52" y="33" font-family="Georgia, serif" font-weight="700" font-size="17" letter-spacing="2" fill="{INK}">DAYLIGHT</text>')
navx=176
for lab in ["Map","Sunset","Zones","Data"]:
    on = lab=="Map"
    s.append(f'<text x="{navx}" y="33" font-family="Helvetica, Arial, sans-serif" font-size="12" letter-spacing="0.5" fill="{INK if on else MUT}" font-weight="{"700" if on else "400"}">{lab}</text>')
    if on: s.append(f'<rect x="{navx}" y="40" width="24" height="2" fill="{SUN}"/>')
    navx+= len(lab)*7.2+22
s.append(f'<rect x="404" y="14" width="144" height="28" rx="14" fill="#1a2340" stroke="{LINE}" stroke-width="1"/>')
s.append(f'<circle cx="418" cy="28" r="3.2" fill="{GOLD}"/>')
s.append(f'<text x="430" y="32" font-family="ui-monospace, monospace" font-size="10" letter-spacing="0.3" fill="{INK}">JUL 1 · 9:00 PM ET</text>')

# ---------- hero title ----------
s.append(f'<text x="50" y="82" font-family="Georgia, serif" font-weight="700" font-size="19" fill="{INK}">Where the sun is right now</text>')

# ---------- map: base land (day) ----------
s.append(f'<path d="{us_path()}" fill="url(#day)"/>')
# time-zone bands (approx boundaries; real ones follow state lines) — coloured overlays clipped to US
zones=[("PT",-125,-114.5),("MT",-114.5,-101.5),("CT",-101.5,-85.0),("ET",-85.0,-66.5)]
s.append(f'<g clip-path="url(#us)">')
for name,l0,l1 in zones:
    x0=proj(l0,49.5)[0]; x1=proj(l1,49.5)[0]
    s.append(f'<rect x="{x0:.1f}" y="90" width="{x1-x0:.1f}" height="270" fill="{TZ[name]}" opacity="0.34"/>')
# zone boundary lines
for _,l0,l1 in zones[1:]:
    x=proj(l0,49.5)[0]; s.append(f'<line x1="{x:.1f}" y1="90" x2="{x:.1f}" y2="360" stroke="{INK}" stroke-width="0.8" stroke-dasharray="3 4" opacity="0.4"/>')
# ---------- night side (east of terminator), clipped to US ----------
night=term_pts[:]+[(proj(-60,term[-1][1])),(proj(-60,term[0][1]))]
s.append(f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x,y in night)}" fill="{NIGHT}" opacity="0.9"/>')
# stars on the night side
v=12345
for _ in range(60):
    v=(v*1103515245+12345)&0x7fffffff; fx=200+(v%320)
    v=(v*1103515245+12345)&0x7fffffff; fy=95+(v%260)
    s.append(f'<circle cx="{fx}" cy="{fy}" r="0.7" fill="#cdd6ee" opacity="0.5"/>')
s.append('</g>')
# ---------- dusk glow + terminator line (the moving sunset) ----------
tpath="M"+" L".join(f"{x:.1f} {y:.1f}" for x,y in term_pts)
s.append(f'<g clip-path="url(#us)"><path d="{tpath}" fill="none" stroke="{GLOW2}" stroke-width="12" opacity="0.5" filter="url(#soft)"/>'
 f'<path d="{tpath}" fill="none" stroke="{GLOW}" stroke-width="2.4" opacity="0.95"/></g>')
# US outline stroke
s.append(f'<path d="{us_path()}" fill="none" stroke="#9fb4cf" stroke-width="1.2" opacity="0.8"/>')

# zone labels + current local time in each zone
zt={"PT":"6:00 PM","MT":"7:00 PM","CT":"8:00 PM","ET":"9:00 PM"}
for name,l0,l1 in zones:
    xc=(proj(l0,49.5)[0]+proj(l1,49.5)[0])/2
    s.append(f'<text x="{xc:.0f}" y="108" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="11" letter-spacing="1" fill="{INK}">{name}</text>')
    s.append(f'<text x="{xc:.0f}" y="120" text-anchor="middle" font-family="ui-monospace, monospace" font-size="8.5" fill="{GOLD}">{zt[name]}</text>')

# ---------- cities: dot + sunset time ----------
for name,lat,lon,tz in CITIES:
    x,y=proj(lon,lat); ss=sunset_local_min(lat,lon,tz); up=elev_i(lat,lon)>0
    dot = GOLD if up else "#6f7fa8"
    s.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="2.6" fill="{dot}" stroke="#0b1020" stroke-width="0.8"/>')
    dx,anc=PLACE[name]; lx=x+dx*7
    tx = "middle" if anc=="middle" else anc
    yo = -6 if name in ("Phoenix","Dallas","New Orleans") else 3
    s.append(f'<text x="{lx:.1f}" y="{y+yo:.1f}" text-anchor="{tx}" font-family="Helvetica, Arial, sans-serif" font-size="8.5" fill="{INK}">{name}</text>')
    s.append(f'<text x="{lx:.1f}" y="{y+yo+9:.1f}" text-anchor="{tx}" font-family="ui-monospace, monospace" font-size="8" fill="{GOLD}">↓ {hhmm(ss)}</text>')

# ---------- legend / footer ----------
ly=380
s.append(f'<rect x="50" y="{ly}" width="468" height="1" fill="{LINE}"/>')
# swatches
lx=50
def sw(x,col,txt,op=1.0):
    s.append(f'<rect x="{x}" y="{ly+16}" width="14" height="12" rx="2" fill="{col}" opacity="{op}"/>')
    s.append(f'<text x="{x+20}" y="{ly+26}" font-family="Helvetica, Arial, sans-serif" font-size="10" fill="{INK}">{txt}</text>')
    return x+20+len(txt)*6.0+22
lx=sw(lx,DAY,"daylight now")
lx=sw(lx,NIGHT,"night now",0.95)
s.append(f'<line x1="{lx}" y1="{ly+22}" x2="{lx+16}" y2="{ly+22}" stroke="{GLOW}" stroke-width="2.4"/>')
s.append(f'<text x="{lx+22}" y="{ly+26}" font-family="Helvetica, Arial, sans-serif" font-size="10" fill="{INK}">sunset line (now)</text>')
lx=lx+22+ len("sunset line (now)")*6.0+22
s.append(f'<text x="{lx}" y="{ly+26}" font-family="ui-monospace, monospace" font-size="9.5" fill="{GOLD}">↓ = today\'s sunset</text>')
# zone chips row
s.append(f'<text x="50" y="{ly+52}" font-family="Helvetica, Arial, sans-serif" font-size="10" fill="{MUT}">Time zones:</text>')
zx=124
for name,_,_ in [(n,a,b) for n,a,b in zones]:
    s.append(f'<rect x="{zx}" y="{ly+42}" width="12" height="12" rx="2" fill="{TZ[name]}"/>')
    s.append(f'<text x="{zx+17}" y="{ly+52}" font-family="Helvetica, Arial, sans-serif" font-size="10" fill="{INK}">{name}</text>')
    zx+=64
# method / caveats footer
foot=[
 "At 9 PM EDT the East is dark; the terminator sits near the Great Lakes; the West is still lit.",
 "Sunset times: NOAA solar equations, 2026-07-01 (±1 min). Daylight at 01:00 UTC, Jul 2.",
 "Zone bands approximate. Arizona keeps MST, so Phoenix reads as Pacific in summer.",
]
for i,f in enumerate(foot):
    s.append(f'<text x="50" y="{ly+80+i*14}" font-family="Helvetica, Arial, sans-serif" font-size="8" fill="{MUT}">{f}</text>')
s.append('</svg>')
SVG="".join(s)
open("sun_map.svg","w").write(SVG)
open("sun_map.html","w").write(f'<!doctype html><html><head><meta charset="utf-8"><title>DAYLIGHT · US sun map</title><style>body{{margin:0;background:#080b16;display:grid;place-items:center;min-height:100vh}}svg{{width:min(96vw,760px);height:auto;box-shadow:0 10px 50px #000}}</style></head><body>{SVG}</body></html>')
# console sanity table
print("wrote sun_map.svg + sun_map.html")
print(f"decl_inst={decl_i:.2f}  EoT_inst={EoT_i:.2f}   decl_date={decl_d:.2f} EoT_date={EoT_d:.2f}")
for name,lat,lon,tz in CITIES:
    print(f"  {name:15s} sunset {hhmm(sunset_local_min(lat,lon,tz))}  elev@9pmET {elev_i(lat,lon):+5.1f}  {'DAY' if elev_i(lat,lon)>0 else 'night'}")

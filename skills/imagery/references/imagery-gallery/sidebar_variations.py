#!/usr/bin/env python3
"""Web-app SIDEBAR / nav rail — five leans, same app.
Brand · search · Menu group · Workspace group · active item · badge · user row.
Run: python3 sidebar_variations.py -> sd.svg sl.svg sc.svg se.svg sb.svg + sidebar.html
Leans: dark SaaS · light Swiss · bold/friendly · editorial-warm · brutalist-mono.
"""
import math, html
W,H=340,480; RAIL=232
def mul(h,f):
    h=h.lstrip("#"); r,g,b=(int(h[i:i+2],16) for i in (0,2,4))
    return "#%02x%02x%02x"%tuple(max(0,min(255,int(c*f))) for c in (r,g,b))
IC={
 'home':'M3 12 L12 3.5 L21 12 M5.5 10 V20 H18.5 V10',
 'chart':'M4 20 H20 M7.5 20 V13 M12 20 V6 M16.5 20 V10',
 'grid':'M4 4 H10 V10 H4 Z M14 4 H20 V10 H14 Z M4 14 H10 V20 H4 Z M14 14 H20 V20 H14 Z',
 'chat':'M4 5 H20 V15 H9.5 L6 19 V15 H4 Z',
 'calendar':'M4 6 H20 V20 H4 Z M4 10.5 H20 M8.5 4 V8 M15.5 4 V8',
 'users':'M8.5 11 a3 3 0 1 0 0 -6 a3 3 0 0 0 0 6 M3 20 c0.5 -4 3 -5.5 5.5 -5.5 s5 1.5 5.5 5.5 M16 6.6 a2.4 2.4 0 1 0 0.1 0 M14.6 14 c3 -0.4 5.4 1 5.7 5',
 'folder':'M3 7 H9 L11 9 H21 V19 H3 Z',
 'search':'M10 10 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M15 15 L19.5 19.5',
 'plus':'M12 5 V19 M5 12 H19','chev':'M9 6 L15 12 L9 18',
}
def icon(name,x,y,s,col,sw=1.7):
    sc=s/24.0
    if name=='gear':
        cx,cy=x+s/2,y+s/2; r=s*0.15; out=[f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="none" stroke="{col}" stroke-width="{sw}"/>']
        for k in range(8):
            a=k*math.pi/4; out.append(f'<line x1="{cx+math.cos(a)*r*1.5:.1f}" y1="{cy+math.sin(a)*r*1.5:.1f}" x2="{cx+math.cos(a)*r*2.7:.1f}" y2="{cy+math.sin(a)*r*2.7:.1f}" stroke="{col}" stroke-width="{sw}" stroke-linecap="round"/>')
        return "".join(out)
    return f'<g transform="translate({x} {y}) scale({sc:.3f})"><path d="{IC[name]}" fill="none" stroke="{col}" stroke-width="{sw/sc:.2f}" stroke-linecap="round" stroke-linejoin="round"/></g>'
def tx(x,y,s,t,fill,fam,w="400",ls="0",anc="start"):
    return f'<text x="{x:.0f}" y="{y:.0f}" text-anchor="{anc}" font-family="{fam}" font-weight="{w}" font-size="{s}" letter-spacing="{ls}" fill="{fill}">{html.escape(t)}</text>'

MENU=[("home","Dashboard",None,True),("chart","Analytics",None,False),("grid","Projects",None,False),("chat","Messages","3",False),("calendar","Calendar",None,False)]
WORK=[("users","Team",None,False),("folder","Files",None,False),("gear","Settings",None,False)]

def render(S):
    p=S["id"]; r=S.get("radius",8); sharp=S.get("sharp",False); rr=0 if sharp else r
    fB=S["fbrand"]; fT=S["ftext"]
    s=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">']
    s.append(f'<rect width="{W}" height="{H}" fill="{S["content"]}"/>')
    # faint app content sliver
    s.append(f'<rect x="{RAIL+12}" y="20" width="{W-RAIL-24}" height="16" rx="{rr}" fill="{mul(S["content"],1.08 if S["dark"] else 0.94)}"/>')
    for cy in (54,110,166):
        s.append(f'<rect x="{RAIL+12}" y="{cy}" width="{W-RAIL-24}" height="44" rx="{rr}" fill="{mul(S["content"],1.06 if S["dark"] else 0.96)}"/>')
    # rail
    s.append(f'<rect x="0" y="0" width="{RAIL}" height="{H}" fill="{S["rail"]}"/>')
    if S.get("rail_bd"): s.append(f'<line x1="{RAIL}" y1="0" x2="{RAIL}" y2="{H}" stroke="{S["rail_bd"]}" stroke-width="1"/>')
    # brand
    s.append(f'<rect x="18" y="22" width="24" height="24" rx="{0 if sharp else 6}" fill="{S["brand_bg"]}"/>')
    s.append(icon("grid",21,25,18,S["brand_mk"],sw=2))
    s.append(tx(52,39,15.5,"Nimbus",S["ink"],fB,w="700",ls=S.get("brand_ls","0")))
    # search
    s.append(f'<rect x="16" y="60" width="200" height="30" rx="{0 if sharp else 8}" fill="{S["search_bg"]}" stroke="{S["search_bd"]}" stroke-width="1"/>')
    s.append(icon("search",26,68,15,S["mut"],sw=1.6))
    s.append(tx(48,79,11.5,"Search…",S["mut"],fT))
    def section(label,items,y0):
        yy=y0
        s.append(tx(20,yy,9.5,label,S["sec"],fT,w="700",ls="1.5")); yy+=16
        for name,lab,badge,active in items:
            rowy=yy
            ic_col=S["ink"]; tcol=S["ink"]
            if active:
                if S["active"]=="pill": s.append(f'<rect x="12" y="{rowy-2}" width="208" height="30" rx="{0 if sharp else 8}" fill="{S["pill"]}"/>'); ic_col=S["acc_ink"]; tcol=S["acc_ink"]
                elif S["active"]=="bar": s.append(f'<rect x="12" y="{rowy-2}" width="208" height="30" rx="{0 if sharp else 8}" fill="{S["pill"]}"/>'); s.append(f'<rect x="12" y="{rowy-2}" width="3.5" height="30" fill="{S["accent"]}"/>'); ic_col=S["accent"]; tcol=S["ink"]
                elif S["active"]=="invert": s.append(f'<rect x="12" y="{rowy-2}" width="208" height="30" fill="{S["accent"]}"/>'); ic_col=S["acc_ink"]; tcol=S["acc_ink"]
            else:
                ic_col=S["mut_ic"]; tcol=S["mut_tx"]
            s.append(icon(name,24,rowy+2,19,ic_col,sw=1.7))
            s.append(tx(52,rowy+18,13,lab,tcol,fT,w=S.get("aw","600") if active else "500"))
            if badge:
                bx=196; s.append(f'<rect x="{bx}" y="{rowy+3}" width="20" height="16" rx="{0 if sharp else 8}" fill="{S["badge_bg"]}"/>')
                s.append(tx(bx+10,rowy+15,10,badge,S["badge_ink"],fT,w="700",anc="middle"))
            yy+=34
        return yy
    y=section("MENU",MENU,116)
    section("WORKSPACE",WORK,y+8)
    # divider + user row
    s.append(f'<line x1="14" y1="422" x2="218" y2="422" stroke="{S["divider"]}" stroke-width="1"/>')
    s.append(f'<circle cx="30" cy="450" r="14" fill="{S["ava"]}"/>')
    s.append(tx(30,455,12,"AR",S["ava_ink"],fT,w="700",anc="middle"))
    s.append(tx(52,447,12.5,"Anatoly R.",S["ink"],fT,w="600"))
    s.append(tx(52,461,10,"Admin",S["mut"],fT))
    s.append(icon("chev",198,441,18,S["mut"],sw=1.8))
    s.append('</svg>')
    return "".join(s)

SANS="'Plus Jakarta Sans', Helvetica, Arial, sans-serif"; SERIF="Georgia, 'Times New Roman', serif"; MONO="ui-monospace, 'DejaVu Sans Mono', monospace"
STYLES=[
 dict(id="sd",name="Dark SaaS",note="the default app-nav aesthetic — dark rail, violet accent, filled active pill",dark=True,
  rail="#15171f",content="#0e0f15",ink="#eef0f6",mut="#8890a6",mut_ic="#7d859c",mut_tx="#aab2c6",sec="#5b6076",
  accent="#7c6cff",acc_ink="#ffffff",active="pill",pill="#7c6cff",brand_bg="#7c6cff",brand_mk="#fff",
  search_bg="#1d2030",search_bd="#262a3c",badge_bg="#7c6cff",badge_ink="#fff",divider="#242838",ava="#2a2f45",ava_ink="#c9cffe",
  fbrand=SANS,ftext=SANS),
 dict(id="sl",name="Light Swiss",note="restrained white rail, hairline border, subtle grey active + a thin accent bar",dark=False,
  rail="#ffffff",content="#f1efea",ink="#232323",mut="#9a988f",mut_ic="#a09e94",mut_tx="#6d6b62",sec="#b0ada2",
  accent="#c2622f",acc_ink="#232323",active="bar",pill="#f4f2ec",brand_bg="#232323",brand_mk="#fff",
  search_bg="#f5f3ee",search_bd="#e6e2d8",badge_bg="#c2622f",badge_ink="#fff",divider="#eae6dc",ava="#e6e2d8",ava_ink="#4a463c",
  rail_bd="#e6e2d8",fbrand=SANS,ftext=SANS),
 dict(id="sc",name="Bold / friendly",note="vibrant filled accent, rounded everything, high-energy product",dark=False,
  rail="#ffffff",content="#eafaf1",ink="#123a2a",mut="#7fa392",mut_ic="#4fbf88",mut_tx="#4a7a63",sec="#9fc3b0",
  accent="#12b76a",acc_ink="#ffffff",active="pill",pill="#12b76a",brand_bg="#12b76a",brand_mk="#fff",radius=13,
  search_bg="#f0faf4",search_bd="#d3efdf",badge_bg="#12b76a",badge_ink="#fff",divider="#dcefe4",ava="#c7efd8",ava_ink="#12613b",
  rail_bd="#e3f3ea",fbrand=SANS,ftext=SANS,aw="700"),
 dict(id="se",name="Editorial / warm",note="the Corbusier house style — cream rail, serif brand, sienna active bar",dark=False,
  rail="#efe7d6",content="#e6ddc9",ink="#2b2a26",mut="#8a8168",mut_ic="#9a8f74",mut_tx="#6b6450",sec="#b0a display".split()[0] if False else "#b3a88f",
  accent="#a65733",acc_ink="#2b2a26",active="bar",pill="#e6dcc4",brand_bg="#a65733",brand_mk="#efe7d6",
  search_bg="#e8dfca",search_bd="#d8cdb2",badge_bg="#a65733",badge_ink="#efe7d6",divider="#ddd2ba",ava="#d8cdb2",ava_ink="#5a5240",
  rail_bd="#ddd2ba",brand_ls="0.5",fbrand=SERIF,ftext=SANS),
 dict(id="sb",name="Brutalist / mono",note="monospace, hard square edges, inverted active block, borders everywhere",dark=False,sharp=True,
  rail="#f3f2ec",content="#dedcd2",ink="#111111",mut="#7a786e",mut_ic="#111111",mut_tx="#3a3a34",sec="#7a786e",
  accent="#111111",acc_ink="#f3f2ec",active="invert",pill="#111111",brand_bg="#111111",brand_mk="#f3f2ec",
  search_bg="#f3f2ec",search_bd="#111111",badge_bg="#111111",badge_ink="#f3f2ec",divider="#111111",ava="#111111",ava_ink="#f3f2ec",
  rail_bd="#111111",brand_ls="1",fbrand=MONO,ftext=MONO),
]
for st in STYLES: open(f"{st['id']}.svg","w").write(render(st))
cards="".join(f'<figure><div class="p">{render(st)}</div><figcaption><b>{st["name"]}</b><span>{st["note"]}</span></figcaption></figure>' for st in STYLES)
HTML=f'''<!doctype html><html><head><meta charset="utf-8"><title>App sidebar — five leans</title><style>
body{{margin:0;background:#0d0c10;color:#efe7d6;font-family:system-ui,sans-serif}}
h1{{text-align:center;font-weight:600;padding:34px 0 4px;font-size:23px}} .s{{text-align:center;color:#9a90a7;margin:0 0 24px;font-size:13px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:26px;max-width:1180px;margin:0 auto;padding:0 26px 60px;justify-items:center}}
figure{{margin:0}} .p svg{{width:100%;max-width:300px;height:auto;display:block;border-radius:10px;box-shadow:0 8px 30px #000b}}
figcaption{{padding:10px 2px}} figcaption b{{display:block;font-size:14px}} figcaption span{{display:block;color:#9a90a7;font-size:11.5px;margin-top:2px;line-height:1.4}}
</style></head><body><h1>Web-app sidebar — five leans, one app</h1>
<p class="s">Same nav (brand · search · Menu · Workspace · active item · badge · user). Only the visual lean changes.</p>
<div class="grid">{cards}</div></body></html>'''
open("sidebar.html","w").write(HTML)
print(f"wrote sidebar.html + {len(STYLES)} svgs")

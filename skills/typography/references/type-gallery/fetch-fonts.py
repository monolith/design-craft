import subprocess, re, os, sys
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
SPECS=[
 "Inter:wght@400;500;600;700;800",
 "IBM+Plex+Sans:wght@400;500;600;700",
 "IBM+Plex+Serif:wght@400;500;600",
 "IBM+Plex+Mono:wght@400;500;600",
 "Plus+Jakarta+Sans:wght@400;500;600;700;800",
 "Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800",
 "Instrument+Serif:ital@0;1",
 "Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400",
 "Space+Grotesk:wght@400;500;700",
 "Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600",
 "Source+Serif+4:opsz,wght@8..60,400;8..60,600",
 "Source+Sans+3:wght@400;600",
 "JetBrains+Mono:wght@400;500",
 "Atkinson+Hyperlegible:wght@400;700",
 "Lora:wght@400;600",
]
def curl(url, out=None):
    cmd=["curl","-sS","-A",UA,"--max-time","30",url]
    if out: cmd+=["-o",out]
    return subprocess.run(cmd,capture_output=True)
faces=[]; n=0; total=0; fails=[]
for spec in SPECS:
    url="https://fonts.googleapis.com/css2?family=%s&display=swap"%spec
    r=curl(url)
    css=r.stdout.decode("utf-8","ignore")
    # split into (comment, block) pairs
    blocks=re.split(r'/\*\s*([\w-]+)\s*\*/', css)
    # blocks: [pre, subset1, block1, subset2, block2, ...]
    fam=spec.split(":")[0].replace("+"," ")
    keep=0
    for i in range(1,len(blocks)-1,2):
        subset=blocks[i].strip(); block=blocks[i+1]
        if subset!="latin": continue
        m=re.search(r"src:\s*url\((https://[^)]+\.woff2)\)",block)
        if not m: continue
        u=m.group(1)
        fw=re.search(r"font-weight:\s*([^;]+);",block)
        fs=re.search(r"font-style:\s*([^;]+);",block)
        ur=re.search(r"unicode-range:\s*([^;]+);",block)
        slug=re.sub(r"[^a-z0-9]+","-",fam.lower()).strip("-")
        keep+=1
        fn="%s-%d.woff2"%(slug,keep)
        d=curl(u,"fonts/"+fn)
        if not os.path.exists("fonts/"+fn) or os.path.getsize("fonts/"+fn)<200:
            fails.append(fam+" w="+(fw.group(1) if fw else "?")); continue
        sz=os.path.getsize("fonts/"+fn); total+=sz; n+=1
        faces.append("@font-face{font-family:'%s';font-style:%s;font-weight:%s;font-display:swap;src:url(fonts/%s) format('woff2');unicode-range:%s;}"%(
            fam, fs.group(1).strip() if fs else "normal", fw.group(1).strip() if fw else "400", fn, ur.group(1).strip() if ur else "U+0000-00FF"))
    print("  %-26s %d face(s)"%(fam,keep))
open("fonts.css","w").write("/* Self-hosted fonts (latin subset) for offline use. Generated. */\n"+"\n".join(faces)+"\n")
print("\nTOTAL: %d woff2 files, %.1f KB, %d @font-face rules"%(n,total/1024,len(faces)))
if fails: print("FAILS:",fails)

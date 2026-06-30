/* ===========================================================================
   showcase.js — five library-backed visuals.

   Libraries (all vendored under lib/, loaded by index.html before this file):
     • THREE                — three.js r128 (globals)
     • THREE.OrbitControls  — orbit/zoom for every 3D scene
     • vis                  — vis-network 9.1.9 (force-directed graph)

   Aesthetic: off-white paper (#fdfdfb), ink (#111), brick accent (#b0301c),
   with richer colour allowed *inside* a visual where it carries meaning
   (cluster hues, depth shading, directory colours).

   Honesty rule: 3D is used only where the data is spatial/relational
   (globe, point cloud, height field, link network). The sunburst, whose
   data is a flat hierarchy, stays 2D SVG.
   ========================================================================= */

(function () {
  "use strict";

  /* ---- shared palette ---------------------------------------------------- */
  var PAPER = 0xfdfdfb,
    INK = 0x111111,
    MUTED = 0x6b6b6b,
    RULE = 0xd8d8d2,
    ACCENT = 0xb0301c;

  // SVG XML namespace — an identifier (not a network resource); used by createElementNS.
  var SVGNS = "http://www.w3.org/2000/svg";

  /* ---- one shared tooltip ------------------------------------------------ */
  var tip = document.createElement("div");
  tip.className = "show-tooltip";
  document.body.appendChild(tip);
  function showTip(html, x, y) {
    tip.innerHTML = html;
    tip.style.left = x + 14 + "px";
    tip.style.top = y + 14 + "px";
    tip.classList.add("show");
  }
  function hideTip() {
    tip.classList.remove("show");
  }

  /* ---- resize registry: every 3D scene registers a resizer --------------- */
  var resizers = [];
  var resizeRAF = null;
  window.addEventListener("resize", function () {
    if (resizeRAF) return;
    resizeRAF = requestAnimationFrame(function () {
      resizeRAF = null;
      resizers.forEach(function (fn) {
        try {
          fn();
        } catch (e) {
          /* ignore */
        }
      });
    });
  });

  /* ---- helper: scaffold a three.js scene into a mount -------------------- */
  function makeScene(mount, opts) {
    opts = opts || {};
    var w = mount.clientWidth || 600;
    var h = mount.clientHeight || 460;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      mount.innerHTML =
        '<div class="scene-msg">This browser could not start WebGL, so the 3D scene can\'t render here.</div>';
      return null;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    if (opts.background != null) {
      renderer.setClearColor(opts.background, 1); // opaque dark backdrop
    } else {
      renderer.setClearColor(0x000000, 0); // transparent — CSS gradient shows through
    }
    mount.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    if (opts.background != null) scene.background = new THREE.Color(opts.background);

    var camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 200);
    if (opts.camera) camera.position.set(opts.camera[0], opts.camera[1], opts.camera[2]);
    else camera.position.set(0, 0, 6);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.6;
    controls.enablePan = false;
    controls.minDistance = opts.minDistance || 2.4;
    controls.maxDistance = opts.maxDistance || 40;
    controls.autoRotate = opts.autoRotate !== false;
    controls.autoRotateSpeed = opts.autoRotateSpeed || 0.6;
    // pause auto-rotate while the user is actively dragging, resume after
    controls.addEventListener("start", function () {
      controls.autoRotate = false;
    });
    var resumeT = null;
    controls.addEventListener("end", function () {
      if (opts.autoRotate === false) return;
      clearTimeout(resumeT);
      resumeT = setTimeout(function () {
        controls.autoRotate = true;
      }, 2500);
    });

    function resize() {
      var ww = mount.clientWidth,
        hh = mount.clientHeight;
      if (!ww || !hh) return;
      camera.aspect = ww / hh;
      camera.updateProjectionMatrix();
      renderer.setSize(ww, hh);
    }
    resizers.push(resize);

    function loop() {
      requestAnimationFrame(loop);
      controls.update();
      if (opts.onFrame) opts.onFrame();
      renderer.render(scene, camera);
    }
    loop();

    return {
      scene: scene,
      camera: camera,
      renderer: renderer,
      controls: controls,
      dom: renderer.domElement,
    };
  }

  /* small deterministic PRNG so the scenes look the same each load */
  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gaussian(rng) {
    // Box-Muller
    var u = 0,
      v = 0;
    while (u === 0) u = rng();
    while (v === 0) v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  /* ======================================================================= */
  /* 1 — DATA GLOBE                                                          */
  /* ======================================================================= */
  function buildGlobe(mount) {
    var ctx = makeScene(mount, {
      background: 0xfdfdfb, // page paper (light) — no stars, no glow
      camera: [0, 0.4, 4.5],
      minDistance: 2.4,
      maxDistance: 12,
      autoRotateSpeed: 0.32, // slow idle drift; pauses on interaction
    });
    if (!ctx) return;
    var scene = ctx.scene, camera = ctx.camera, renderer = ctx.renderer;
    var R = 1.6, PI = Math.PI;
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

    // ---- embedded synthetic trade data (centroids matched to geojson NAME) ----
    var ECON = {
      "United States of America": { c: [-99.06, 39.5], bal: -945 },
      "China": { c: [103.87, 36.61], bal: 585 },
      "Germany": { c: [10.29, 51.13], bal: 245 },
      "Japan": { c: [136.88, 36.02], bal: -35 },
      "United Kingdom": { c: [-2.66, 53.88], bal: -205 },
      "France": { c: [2.34, 46.61], bal: -115 },
      "India": { c: [79.59, 22.93], bal: -185 },
      "Italy": { c: [12.22, 43.47], bal: 55 },
      "Canada": { c: [-101.57, 57.75], bal: -25 },
      "South Korea": { c: [127.82, 36.43], bal: 75 },
      "Russia": { c: [99.22, 61.69], bal: 135 },
      "Brazil": { c: [-53.05, -10.81], bal: 60 },
      "Australia": { c: [134.38, -25.56], bal: 70 },
      "Spain": { c: [-3.62, 40.35], bal: -45 },
      "Mexico": { c: [-102.58, 23.94], bal: -15 },
      "Indonesia": { c: [114.02, -0.25], bal: 35 },
      "Netherlands": { c: [5.51, 52.3], bal: 95 },
      "Saudi Arabia": { c: [44.52, 24.12], bal: 150 },
      "Switzerland": { c: [8.12, 46.79], bal: 65 },
      "Turkey": { c: [35.39, 38.99], bal: -85 },
      "Taiwan": { c: [120.97, 23.74], bal: 85 },
      "Poland": { c: [19.31, 52.15], bal: -20 },
      "Sweden": { c: [16.6, 62.81], bal: 25 },
      "Belgium": { c: [4.58, 50.65], bal: 20 },
      "Thailand": { c: [101.01, 15.02], bal: 15 },
      "Ireland": { c: [-8.01, 53.18], bal: 70 },
      "Norway": { c: [14.24, 64.54], bal: 90 },
      "South Africa": { c: [25.12, -28.96], bal: -10 },
      "United Arab Emirates": { c: [54.21, 23.87], bal: 110 },
      "Vietnam": { c: [106.29, 16.66], bal: 25 },
      "Malaysia": { c: [114.68, 3.55], bal: 40 },
    };

    // Dense synthetic web: most economy pairs trade, BOTH directions, with a
    // gravity-style volume (bigger economies + a few hubs trade more). ~480
    // directed arcs, so every economy has many in/out lines. Deterministic
    // (seeded), and arc colour still varies because it's keyed to the exporter's
    // net balance. Generated rather than hand-listed at this density.
    var FLOWS = (function () {
      var names = Object.keys(ECON);
      var rng = mulberry32(99173);
      var size = {};
      names.forEach(function (n) { size[n] = 0.3 + rng() * 1.0; });
      ["United States of America", "China", "Germany", "Japan"].forEach(function (n) {
        if (size[n] != null) size[n] += 1.1; // a few hubs trade with almost everyone
      });
      var out = [];
      for (var i = 0; i < names.length; i++) {
        for (var j = 0; j < names.length; j++) {
          if (i === j) continue;
          var A = names[i], B = names[j], g = (size[A] * size[B]) / 2;
          if (rng() > 0.34 + 0.4 * Math.min(1, g)) continue; // include most pairs
          var vol = Math.round((15 + Math.pow(rng(), 1.8) * 470) * (0.4 + 0.6 * g));
          if (vol >= 8) out.push({ f: A, t: B, v: vol });
        }
      }
      return out;
    })();

    // Diverging balance colour — STRONG, CVD-safe blue↔orange (the ColorBrewer
    // RdBu / Blues–Oranges family): saturated blue = surplus, saturated orange =
    // deficit, pale neutral at zero. A pow<1 ramp boosts the mid-range so even a
    // moderate balance reads clearly. Rationale defers to graphical-perception-and-color.
    var C_NEUTRAL = 0x9a9da0, C_SURPLUS = 0x1f78b4, C_DEFICIT = 0xe6550d; // mid-gray neutral reads on the light sphere; blue/orange already read on light
    function mixBal(bal, floor) {
      var t = floor + (1 - floor) * Math.pow(Math.min(1, Math.abs(bal) / 600), 0.6);
      var neutral = new THREE.Color(C_NEUTRAL);
      return bal >= 0
        ? neutral.lerp(new THREE.Color(C_SURPLUS), t)
        : neutral.lerp(new THREE.Color(C_DEFICIT), t);
    }
    // discs: small floor, so near-balanced economies stay pale.
    function balColor(bal) { return mixBal(bal, 0.12); }
    // arcs: thin lines need punch — a high floor so every arc reads clearly blue/orange.
    function arcColor(bal) { return mixBal(bal, 0.5); }

    // ---- lon/lat <-> sphere ----
    function toXYZ(lon, lat, r) {
      var phi = (90 - lat) * PI / 180, theta = (lon + 180) * PI / 180;
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    }
    function toLonLat(v) {
      var n = v.clone().normalize();
      var lat = 90 - Math.acos(Math.max(-1, Math.min(1, n.y))) * 180 / PI;
      var lon = Math.atan2(n.z, -n.x) * 180 / PI - 180;
      while (lon < -180) lon += 360;
      while (lon > 180) lon -= 360;
      return [lon, lat];
    }

    // ---- base sphere: opaque, slightly above the backdrop, occludes far-side lines
    var sphere = new THREE.Mesh(
      new THREE.SphereGeometry(R, 64, 48),
      new THREE.MeshBasicMaterial({ color: 0xeae7df }) // pale, opaque — still occludes the far side on the light page
    );
    scene.add(sphere);

    // ---- faint graticule (quiet 30° reference) ----
    var gmat = new THREE.LineBasicMaterial({ color: 0xc9c6bb, transparent: true, opacity: 0.6 });
    for (var glat = -60; glat <= 60; glat += 30) {
      var gp = [];
      for (var lo = 0; lo <= 360; lo += 4) gp.push(toXYZ(lo, glat, R * 1.001));
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(gp), gmat));
    }
    for (var glon = 0; glon < 360; glon += 30) {
      var gp2 = [];
      for (var la = -90; la <= 90; la += 4) gp2.push(toXYZ(glon, la, R * 1.001));
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(gp2), gmat));
    }

    // ---- outline appearance states ----
    // Tuned for the LIGHT sphere: a clearly-visible mid-gray base border, a near-
    // black selected border, a darker-gray partner border, and a faint pale dim.
    var OUT_BASE = { color: 0x5b606a, op: 0.5 };
    var OUT_DIM = { color: 0xb4b2a8, op: 0.28 };
    var OUT_SEL = { color: 0x14181e, op: 0.95 };
    var OUT_PART = { color: 0x474c54, op: 0.85 };

    var countries = {}; // NAME -> { mat, rings:[ [ [lon,lat], ... ] ] }
    var econMarks = {}; // NAME -> { mesh, mat }
    var flowObjs = []; // { f, t, v, mat, baseOp }
    var selected = null;

    // ---- short labels for the readout ----
    var SHORT = {
      "United States of America": "United States",
      "United Arab Emirates": "UAE",
      "United Kingdom": "UK",
      "South Korea": "S. Korea",
      "South Africa": "S. Africa",
    };
    var short = function (n) { return SHORT[n] || n; };

    // ---- overlay UI: diverging legend + selection readout ----
    var legend = document.createElement("div");
    legend.className = "globe-legend";
    legend.innerHTML =
      '<div class="gl-title">net trade balance</div>' +
      '<div class="gl-row"><span class="gl-sw" style="background:#1f78b4"></span>surplus</div>' +
      '<div class="gl-row"><span class="gl-sw" style="background:#c2c5c7"></span>~ balanced</div>' +
      '<div class="gl-row"><span class="gl-sw" style="background:#e6550d"></span>deficit</div>';
    mount.appendChild(legend);

    var readout = document.createElement("div");
    readout.className = "globe-readout";
    mount.appendChild(readout);

    var loading = document.createElement("div");
    loading.className = "scene-msg";
    loading.textContent = "loading country borders…";
    mount.appendChild(loading);

    // ---- load vendored borders (local file, relative path) ----
    fetch("lib/world-countries-110m.geojson")
      .then(function (r) { return r.json(); })
      .then(function (gj) {
        if (loading.parentNode) loading.parentNode.removeChild(loading);
        buildCountries(gj);
        buildMarksAndFlows();
        enableInteraction();
      })
      .catch(function () {
        loading.textContent = "could not load country borders locally.";
      });

    function ringPts(ring, r) {
      var pts = [];
      for (var i = 0; i < ring.length; i++) pts.push(toXYZ(ring[i][0], ring[i][1], r));
      return pts;
    }
    function buildCountries(gj) {
      gj.features.forEach(function (ft) {
        var name = ft.properties.NAME;
        var geom = ft.geometry;
        var polys = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
        var mat = new THREE.LineBasicMaterial({ color: OUT_BASE.color, transparent: true, opacity: OUT_BASE.op });
        var rec = { mat: mat, rings: [] };
        polys.forEach(function (poly) {
          rec.rings.push(poly[0]); // exterior ring for hit-testing
          poly.forEach(function (ring) {
            scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ringPts(ring, R * 1.004)), mat));
          });
        });
        countries[name] = rec;
      });
    }

    function buildMarksAndFlows() {
      var maxAbs = 945;
      Object.keys(ECON).forEach(function (name) {
        var e = ECON[name];
        var pos = toXYZ(e.c[0], e.c[1], R * 1.006);
        var sz = 0.018 + Math.sqrt(Math.abs(e.bal) / maxAbs) * 0.04;
        var mat = new THREE.MeshBasicMaterial({ color: balColor(e.bal), transparent: true, opacity: 0.85, side: THREE.DoubleSide });
        var disc = new THREE.Mesh(new THREE.CircleGeometry(sz, 22), mat);
        disc.position.copy(pos);
        disc.lookAt(pos.clone().multiplyScalar(2)); // face outward, tangent to sphere
        scene.add(disc);
        econMarks[name] = { mesh: disc, mat: mat };
      });
      var maxV = 600;
      FLOWS.forEach(function (fl) {
        var a = ECON[fl.f], b = ECON[fl.t];
        if (!a || !b) return;
        var A = toXYZ(a.c[0], a.c[1], R * 1.01), B = toXYZ(b.c[0], b.c[1], R * 1.01);
        var mid = A.clone().add(B).multiplyScalar(0.5);
        var lift = 1 + 0.5 * (A.distanceTo(B) / (2 * R));
        mid.normalize().multiplyScalar(R * lift);
        var curve = new THREE.QuadraticBezierCurve3(A, mid, B);
        var vN = Math.min(1, fl.v / maxV);
        // DEFAULT = the full web: hundreds of THIN, translucent lines coloured on
        // the diverging scale by the EXPORTER's net balance (surplus = blue, deficit
        // = orange). Lines (not tubes) keep hundreds of arcs cheap to render; the
        // bezier mid-point keeps each one lifted off the surface.
        var baseOp = 0.22 + vN * 0.28; // ~0.22–0.5, thin + translucent
        var col = arcColor(a.bal);
        var mat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: baseOp, depthWrite: false });
        var line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(22)), mat);
        scene.add(line);
        flowObjs.push({ f: fl.f, t: fl.t, v: fl.v, mat: mat, baseOp: baseOp, hex: col.getHex() });
      });
    }

    // ---- point-in-polygon (even-odd, lon/lat) ----
    function pointInRing(lon, lat, ring) {
      var inside = false;
      for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        var xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
        if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    }
    function pointInCountry(lon, lat, rings) {
      for (var k = 0; k < rings.length; k++) if (pointInRing(lon, lat, rings[k])) return true;
      return false;
    }

    // ---- selection styling + readout ----
    function applySel(name) {
      selected = name;
      var partners = {};
      if (name) {
        flowObjs.forEach(function (o) {
          if (o.f === name) partners[o.t] = true;
          else if (o.t === name) partners[o.f] = true;
        });
      }
      Object.keys(countries).forEach(function (cn) {
        var rec = countries[cn], st;
        if (!name) st = OUT_BASE;
        else if (cn === name) st = OUT_SEL;
        else if (partners[cn]) st = OUT_PART;
        else st = OUT_DIM;
        rec.mat.color.setHex(st.color);
        rec.mat.opacity = st.op;
      });
      Object.keys(econMarks).forEach(function (en) {
        var m = econMarks[en];
        var on = !name || en === name || partners[en];
        m.mat.opacity = on ? (name && en === name ? 1 : 0.85) : 0.12;
        m.mesh.scale.setScalar(name && en === name ? 1.5 : 1);
      });
      flowObjs.forEach(function (o) {
        if (!name) {
          // default: the full vivid colour web — every arc at full visibility
          o.mat.color.setHex(o.hex);
          o.mat.opacity = o.baseOp;
        } else if (o.f === name || o.t === name) {
          // focus: this country's arcs jump to full and keep their balance hue,
          // popping clearly out of the now-faded dense web
          o.mat.color.setHex(o.hex);
          o.mat.opacity = Math.min(0.95, o.baseOp + 0.5);
        } else {
          // focus: fade everyone else's arcs to a quiet neutral
          o.mat.color.setHex(0x3b424c);
          o.mat.opacity = 0.05;
        }
      });
      if (name) showReadout(name);
      else readout.classList.remove("show");
    }

    function showReadout(name) {
      var e = ECON[name];
      var tot = {};
      flowObjs.forEach(function (o) {
        if (o.f === name) tot[o.t] = (tot[o.t] || 0) + o.v;
        else if (o.t === name) tot[o.f] = (tot[o.f] || 0) + o.v;
      });
      var top = Object.keys(tot).sort(function (a, b) { return tot[b] - tot[a]; }).slice(0, 4);
      var sign = e.bal >= 0 ? "+" : "−";
      var kind = e.bal >= 0 ? "surplus" : "deficit";
      var col = "#" + balColor(e.bal).getHexString();
      readout.innerHTML =
        '<div class="gr-name">' + esc(short(name)) + "</div>" +
        '<div class="gr-bal" style="color:' + col + '">net balance ' + sign + "$" + Math.abs(e.bal) + "B &middot; " + kind + "</div>" +
        '<div class="gr-part">' + (top.length ? "top partners &nbsp;" + top.map(function (p) { return esc(short(p)) + ' <span class="gr-v">' + tot[p] + "</span>"; }).join(" &middot; ") : "no recorded flows") + "</div>";
      readout.classList.add("show");
    }

    // ---- interaction: pointer-up = click unless it was a drag ----
    function enableInteraction() {
      var raycaster = new THREE.Raycaster();
      var canvas = renderer.domElement;
      var down = null, dragged = false;
      canvas.style.cursor = "grab";
      canvas.addEventListener("pointerdown", function (e) { down = [e.clientX, e.clientY]; dragged = false; });
      canvas.addEventListener("pointermove", function (e) {
        if (down && Math.abs(e.clientX - down[0]) + Math.abs(e.clientY - down[1]) > 5) dragged = true;
      });
      canvas.addEventListener("pointerup", function (e) {
        var wasDrag = dragged; down = null; dragged = false;
        if (wasDrag) return; // it was an orbit drag, not a click
        var rect = canvas.getBoundingClientRect();
        var nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        var ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera({ x: nx, y: ny }, camera);
        var hits = raycaster.intersectObject(sphere);
        if (!hits.length) { applySel(null); return; }
        var ll = toLonLat(hits[0].point);
        var found = null, names = Object.keys(ECON);
        for (var i = 0; i < names.length; i++) {
          var rec = countries[names[i]];
          if (rec && pointInCountry(ll[0], ll[1], rec.rings)) { found = names[i]; break; }
        }
        applySel(found); // null when clicking ocean / a non-economy → deselect
      });
    }
  }
  /* ======================================================================= */
  /* 2 — 3D SCATTER (three clusters)                                         */
  /* ======================================================================= */
  function buildScatter(mount) {
    var ctx = makeScene(mount, {
      camera: [3.4, 2.4, 3.8],
      minDistance: 2.4,
      maxDistance: 16,
      autoRotateSpeed: 0.7,
    });
    if (!ctx) return;
    var scene = ctx.scene;
    var rng = mulberry32(77);

    // three clusters, distinct hues (brick / steel / olive-gold)
    var clusters = [
      { c: 0xb0301c, center: [-1.1, 0.3, -0.6], spread: 0.42, n: 110 },
      { c: 0x2f6f86, center: [1.0, -0.4, 0.7], spread: 0.5, n: 105 },
      { c: 0xb88a1e, center: [0.2, 1.0, -1.0], spread: 0.46, n: 95 },
    ];

    var positions = [];
    var colors = [];
    clusters.forEach(function (cl) {
      var col = new THREE.Color(cl.c);
      for (var i = 0; i < cl.n; i++) {
        positions.push(
          cl.center[0] + gaussian(rng) * cl.spread,
          cl.center[1] + gaussian(rng) * cl.spread,
          cl.center[2] + gaussian(rng) * cl.spread
        );
        // tiny per-point lightness jitter so the cloud has depth
        var j = 0.85 + rng() * 0.3;
        colors.push(col.r * j, col.g * j, col.b * j);
      }
    });

    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    // round sprite so points are discs, not squares
    var spr = document.createElement("canvas");
    spr.width = spr.height = 64;
    var g2 = spr.getContext("2d");
    var grd = g2.createRadialGradient(32, 32, 1, 32, 32, 30);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.25, "rgba(255,255,255,1)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g2.fillStyle = grd;
    g2.beginPath();
    g2.arc(32, 32, 30, 0, Math.PI * 2);
    g2.fill();
    var tex = new THREE.CanvasTexture(spr);

    var mat = new THREE.PointsMaterial({
      size: 0.11,
      map: tex,
      vertexColors: true,
      transparent: true,
      alphaTest: 0.2,
      depthWrite: true,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(geo, mat));

    // thin axis lines from origin
    var axMat = new THREE.LineBasicMaterial({ color: 0x8a8a82 });
    var L = 2.2;
    var axes = [
      [new THREE.Vector3(-0.2, 0, 0), new THREE.Vector3(L, 0, 0)],
      [new THREE.Vector3(0, -0.2, 0), new THREE.Vector3(0, L, 0)],
      [new THREE.Vector3(0, 0, -0.2), new THREE.Vector3(0, 0, L)],
    ];
    axes.forEach(function (seg) {
      scene.add(
        new THREE.Line(new THREE.BufferGeometry().setFromPoints(seg), axMat)
      );
    });

    // axis labels as sprites
    function textSprite(txt) {
      var c = document.createElement("canvas");
      c.width = 128;
      c.height = 64;
      var x = c.getContext("2d");
      x.fillStyle = "#444";
      x.font = "bold 38px Georgia, serif";
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.fillText(txt, 64, 34);
      var t = new THREE.CanvasTexture(c);
      var sp = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: t, transparent: true })
      );
      sp.scale.set(0.5, 0.25, 1);
      return sp;
    }
    var lx = textSprite("dim 1");
    lx.position.set(L + 0.25, 0, 0);
    scene.add(lx);
    var ly = textSprite("dim 2");
    ly.position.set(0, L + 0.22, 0);
    scene.add(ly);
    var lz = textSprite("dim 3");
    lz.position.set(0, 0, L + 0.25);
    scene.add(lz);
  }

  /* ======================================================================= */
  /* 3 — 3D SURFACE (height field)                                           */
  /* ======================================================================= */
  function buildSurface(mount) {
    var ctx = makeScene(mount, {
      camera: [3.6, 3.0, 3.6],
      minDistance: 2.6,
      maxDistance: 16,
      autoRotateSpeed: 0.5,
    });
    if (!ctx) return;
    var scene = ctx.scene;

    scene.add(new THREE.AmbientLight(0xffffff, 0.62));
    var key = new THREE.DirectionalLight(0xffffff, 0.85);
    key.position.set(4, 6, 3);
    scene.add(key);
    var fill = new THREE.DirectionalLight(0xffffff, 0.25);
    fill.position.set(-4, 2, -3);
    scene.add(fill);

    var N = 48,
      SPAN = 4.4;
    function f(x, y) {
      return (
        1.05 * Math.exp(-((x - 1) * (x - 1) + (y - 1) * (y - 1)) / 1.2) -
        0.8 * Math.exp(-((x + 1.3) * (x + 1.3) + (y + 0.5) * (y + 0.5)) / 0.8) +
        0.18 * Math.sin(2 * x) * Math.cos(2 * y)
      );
    }

    var geo = new THREE.PlaneGeometry(SPAN, SPAN, N, N);
    var pos = geo.attributes.position;
    var hMin = Infinity,
      hMax = -Infinity;
    var heights = [];
    for (var i = 0; i < pos.count; i++) {
      var gx = (pos.getX(i) / SPAN) * 6; // map plane coords to [-3,3]-ish domain
      var gy = (pos.getY(i) / SPAN) * 6;
      var z = f(gx, gy);
      heights.push(z);
      pos.setZ(i, z);
      if (z < hMin) hMin = z;
      if (z > hMax) hMax = z;
    }
    // colour by normalized height: cool slate (low) -> paper -> brick/amber (high)
    function heightColor(t) {
      var lo = new THREE.Color(0x3a5566); // slate
      var mid = new THREE.Color(0xece8dc); // paper
      var hi = new THREE.Color(0xb0301c); // brick
      if (t < 0.5) return lo.clone().lerp(mid, t / 0.5);
      return mid.clone().lerp(hi, (t - 0.5) / 0.5);
    }
    var cols = [];
    for (var k = 0; k < heights.length; k++) {
      var t = (heights[k] - hMin) / (hMax - hMin || 1);
      var c = heightColor(t);
      cols.push(c.r, c.g, c.b);
    }
    geo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
    geo.computeVertexNormals();

    var surf = new THREE.Mesh(
      geo,
      new THREE.MeshPhongMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        shininess: 8,
        flatShading: false,
      })
    );
    surf.rotation.x = -Math.PI / 2; // lay flat, height -> +Y
    scene.add(surf);

    // faint wireframe overlay so the grid relief reads as a surface
    var wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(geo),
      new THREE.LineBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.08,
      })
    );
    wire.rotation.x = -Math.PI / 2;
    scene.add(wire);

    // lift the whole thing a touch so it orbits around its middle
    surf.position.y = -0.15;
    wire.position.y = -0.15;
  }

  /* ======================================================================= */
  /* 4 — FILE RELATIONSHIP NETWORK (force-graph, Obsidian-style)            */
  /* ======================================================================= */
  // Static snapshot of a real markdown workspace graph (nodes = files,
  // edges = references). Embedded directly below as GRAPH — no live data read.
  var GRAPH = /*__GRAPH_SNAPSHOT__*/ {"groups":["(root)",".claude","context","continuity","docs","exports","goals","journal","logs","memory","messages","notes","progress-reports","questions","reports","research","reviews","scripts","skills","tool-docs","trace","workers"],"nodes":[{"id":".claude/commands/plan.md","label":"plan.md","group":".claude","value":1},{"id":"AGENTS.md","label":"AGENTS.md","group":"(root)","value":24},{"id":"BOOTSTRAP.md","label":"BOOTSTRAP.md","group":"(root)","value":3},{"id":"CONTINUITY.md","label":"CONTINUITY.md","group":"(root)","value":21},{"id":"HEARTBEAT.md","label":"HEARTBEAT.md","group":"(root)","value":44},{"id":"IDENTITY.md","label":"IDENTITY.md","group":"(root)","value":11},{"id":"MEMORY.md","label":"MEMORY.md","group":"(root)","value":12},{"id":"SOUL.md","label":"SOUL.md","group":"(root)","value":33},{"id":"TOOLS.md","label":"TOOLS.md","group":"(root)","value":12},{"id":"USER.md","label":"USER.md","group":"(root)","value":11},{"id":"VALUE.md","label":"VALUE.md","group":"(root)","value":2},{"id":"context/Anatoly-needs.md","label":"Anatoly-needs.md","group":"context","value":1},{"id":"context/identity-summary.md","label":"identity-summary.md","group":"context","value":3},{"id":"continuity/archive/AN-4ac0d9fe-PROMISE.md","label":"AN-4ac0d9fe-PROMISE.md","group":"continuity","value":3},{"id":"continuity/archive/AN-next-yankees-game-next-heartbeat.md","label":"AN-next-yankees-game-next-heartbeat.md","group":"continuity","value":5},{"id":"continuity/archive/SL-11982520-PROMISE.md","label":"SL-11982520-PROMISE.md","group":"continuity","value":6},{"id":"continuity/archive/SL-8d42de1b-PROMISE.md","label":"SL-8d42de1b-PROMISE.md","group":"continuity","value":1},{"id":"continuity/archive/SL-bd165232-PROMISE.md","label":"SL-bd165232-PROMISE.md","group":"continuity","value":1},{"id":"continuity/archive/SL-cf82838d-PROMISE.md","label":"SL-cf82838d-PROMISE.md","group":"continuity","value":2},{"id":"continuity/archive/SL-d02d2710-PROMISE.md","label":"SL-d02d2710-PROMISE.md","group":"continuity","value":1},{"id":"continuity/archive/SL-de078d57-PROMISE.md","label":"SL-de078d57-PROMISE.md","group":"continuity","value":1},{"id":"continuity/archive/SL-f3b086fd-PROMISE.md","label":"SL-f3b086fd-PROMISE.md","group":"continuity","value":1},{"id":"continuity/archive/legacy-todo-md-snapshot-20260509.md","label":"legacy-todo-md-snapshot-20260509.md","group":"continuity","value":1},{"id":"continuity/archive/neural-memory-month-check.md","label":"neural-memory-month-check.md","group":"continuity","value":2},{"id":"continuity/artifacts/2026-06-01-value-function-rubric-draft.md","label":"2026-06-01-value-function-rubric-draft.md","group":"continuity","value":2},{"id":"continuity/briefing/README.md","label":"README.md","group":"continuity","value":13},{"id":"continuity/briefing/current.md","label":"current.md","group":"continuity","value":21},{"id":"continuity/followthrough-quality-scorecard.md","label":"followthrough-quality-scorecard.md","group":"continuity","value":1},{"id":"continuity/followthrough-scorecard.md","label":"followthrough-scorecard.md","group":"continuity","value":1},{"id":"continuity/heartbeat/2026-06-01T13-31-00Z/journal.md","label":"journal.md","group":"continuity","value":1},{"id":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/SL-8f2c1a10-CONSTKERN.md","label":"SL-8f2c1a10-CONSTKERN.md","group":"continuity","value":4},{"id":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/SL-ab893ca4-PROMISE.md","label":"SL-ab893ca4-PROMISE.md","group":"continuity","value":2},{"id":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/neural-memory-one-month-checkin.md","label":"neural-memory-one-month-checkin.md","group":"continuity","value":19},{"id":"continuity/heartbeat/2026-06-05T11-56-59Z/orientation.md","label":"orientation.md","group":"continuity","value":1},{"id":"continuity/heartbeat/2026-06-05T14-56-00Z/journal.md","label":"journal.md","group":"continuity","value":1},{"id":"continuity/open/SL-1d4e5f9a-PROMISE.md","label":"SL-1d4e5f9a-PROMISE.md","group":"continuity","value":5},{"id":"continuity/open/SL-b034c90f-PROMISE.md","label":"SL-b034c90f-PROMISE.md","group":"continuity","value":4},{"id":"continuity/open/SL-e296a83e-PROMISE.md","label":"SL-e296a83e-PROMISE.md","group":"continuity","value":4},{"id":"continuity/open/SL-f0794136-PROMISE.md","label":"SL-f0794136-PROMISE.md","group":"continuity","value":1},{"id":"continuity/resolved/2026-06-01-sl-91d52ee4-first-value-loop-candidates.md","label":"2026-06-01-sl-91d52ee4-first-value-loop-candidates.md","group":"continuity","value":4},{"id":"continuity/resolved/2026-06-02-sl-first-value-loop-implementation.md","label":"2026-06-02-sl-first-value-loop-implementation.md","group":"continuity","value":3},{"id":"continuity/resolved/20260531-0700-followup-check.md","label":"20260531-0700-followup-check.md","group":"continuity","value":1},{"id":"continuity/resolved/AN-00000001-SMOKEBOX2.md","label":"AN-00000001-SMOKEBOX2.md","group":"continuity","value":1},{"id":"continuity/resolved/AN-0930a83f-SMOKETEST.md","label":"AN-0930a83f-SMOKETEST.md","group":"continuity","value":2},{"id":"continuity/resolved/AN-0b2c2e2e-TGTEST.md","label":"AN-0b2c2e2e-TGTEST.md","group":"continuity","value":1},{"id":"continuity/resolved/AN-4d0e9f21-IRANNEWS.md","label":"AN-4d0e9f21-IRANNEWS.md","group":"continuity","value":1},{"id":"continuity/resolved/AN-57155c8d-YAMLPROOF.md","label":"AN-57155c8d-YAMLPROOF.md","group":"continuity","value":3},{"id":"continuity/resolved/AN-5b6cc919-YAMLTODO.md","label":"AN-5b6cc919-YAMLTODO.md","group":"continuity","value":4},{"id":"continuity/resolved/AN-8f7d2c41-PROMCRIT.md","label":"AN-8f7d2c41-PROMCRIT.md","group":"continuity","value":1},{"id":"continuity/resolved/AN-c1f6d2f4-TRACECLEAN.md","label":"AN-c1f6d2f4-TRACECLEAN.md","group":"continuity","value":1},{"id":"continuity/resolved/AN-d4b0f2e6-PROMREV.md","label":"AN-d4b0f2e6-PROMREV.md","group":"continuity","value":1},{"id":"continuity/resolved/AN-db3feaf2-AITRUST.md","label":"AN-db3feaf2-AITRUST.md","group":"continuity","value":4},{"id":"continuity/resolved/AN-yankees-final-score-next-heartbeat.md","label":"AN-yankees-final-score-next-heartbeat.md","group":"continuity","value":2},{"id":"continuity/resolved/AN-yankees-score-next-heartbeat.md","label":"AN-yankees-score-next-heartbeat.md","group":"continuity","value":2},{"id":"continuity/resolved/SL-054c72be-PROMISE.md","label":"SL-054c72be-PROMISE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-09fff3d0-PROMISE.md","label":"SL-09fff3d0-PROMISE.md","group":"continuity","value":2},{"id":"continuity/resolved/SL-0d2685c4-ORIENT.md","label":"SL-0d2685c4-ORIENT.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-13adafb2-FEYN1.md","label":"SL-13adafb2-FEYN1.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-1504d38c-PROMISE.md","label":"SL-1504d38c-PROMISE.md","group":"continuity","value":2},{"id":"continuity/resolved/SL-15b4d478-PROMISE.md","label":"SL-15b4d478-PROMISE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-1724cad4-GOVBRIEF.md","label":"SL-1724cad4-GOVBRIEF.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-1766b132-PROMISE.md","label":"SL-1766b132-PROMISE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-17c4b8d3-DIARYLOOP.md","label":"SL-17c4b8d3-DIARYLOOP.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-18e92fe7-PROMISE.md","label":"SL-18e92fe7-PROMISE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-1d10bb4f-PROMISE.md","label":"SL-1d10bb4f-PROMISE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-1eb11d78-PROMISE.md","label":"SL-1eb11d78-PROMISE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-20260602-ai-friendship-principles.md","label":"SL-20260602-ai-friendship-principles.md","group":"continuity","value":3},{"id":"continuity/resolved/SL-20260602-daily-memory-catchup.md","label":"SL-20260602-daily-memory-catchup.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-20260602-governance-kernel-synthesis.md","label":"SL-20260602-governance-kernel-synthesis.md","group":"continuity","value":4},{"id":"continuity/resolved/SL-20260610-next-heartbeat-yankees-game-time.md","label":"SL-20260610-next-heartbeat-yankees-game-time.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-20260611-next-heartbeat-yankees-win-prediction.md","label":"SL-20260611-next-heartbeat-yankees-win-prediction.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-28c0dcb1-SLMEMO.md","label":"SL-28c0dcb1-SLMEMO.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-2998f450-PROMISE.md","label":"SL-2998f450-PROMISE.md","group":"continuity","value":2},{"id":"continuity/resolved/SL-2ab4e913-PROMVAL.md","label":"SL-2ab4e913-PROMVAL.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-2c6f8b44-SIRSOURCE.md","label":"SL-2c6f8b44-SIRSOURCE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-2f6c8b19-PROMENFORCE.md","label":"SL-2f6c8b19-PROMENFORCE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-3258fafe-PROMISE.md","label":"SL-3258fafe-PROMISE.md","group":"continuity","value":13},{"id":"continuity/resolved/SL-382d0b4e-PROMISE.md","label":"SL-382d0b4e-PROMISE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-39db59c4-JRNLINT.md","label":"SL-39db59c4-JRNLINT.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-39fab1fc-PROMISE.md","label":"SL-39fab1fc-PROMISE.md","group":"continuity","value":2},{"id":"continuity/resolved/SL-3ca046d2-KURZWEIL.md","label":"SL-3ca046d2-KURZWEIL.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-3db8f341-RETNOTE.md","label":"SL-3db8f341-RETNOTE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-3e1af6c8-PHAMDEEP.md","label":"SL-3e1af6c8-PHAMDEEP.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-41af7c2e-PROMFLOW.md","label":"SL-41af7c2e-PROMFLOW.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-41f68194-PROMISE.md","label":"SL-41f68194-PROMISE.md","group":"continuity","value":3},{"id":"continuity/resolved/SL-435c05fe-TGPOLICY.md","label":"SL-435c05fe-TGPOLICY.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-470371d8-NOTIFYOK.md","label":"SL-470371d8-NOTIFYOK.md","group":"continuity","value":2},{"id":"continuity/resolved/SL-4c1d2e9a-FEYNAUD.md","label":"SL-4c1d2e9a-FEYNAUD.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-4c9d2b77-VALUELOOP.md","label":"SL-4c9d2b77-VALUELOOP.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-4d7e0c3a-SEEDCOMPARE.md","label":"SL-4d7e0c3a-SEEDCOMPARE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-4e18b7ac-ORIENT2.md","label":"SL-4e18b7ac-ORIENT2.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-4f6a1c92-HUMDEV.md","label":"SL-4f6a1c92-HUMDEV.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-4f8c2d17-SEEDLABEL.md","label":"SL-4f8c2d17-SEEDLABEL.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-52825122-PROMISE.md","label":"SL-52825122-PROMISE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-54b85d2e-QSEED.md","label":"SL-54b85d2e-QSEED.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-58df2a44-ORIENT4.md","label":"SL-58df2a44-ORIENT4.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-591e730f-PROMISE.md","label":"SL-591e730f-PROMISE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-5a18f0b1-FLWSCARD.md","label":"SL-5a18f0b1-FLWSCARD.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-5a18f0b2-FRSTVLP.md","label":"SL-5a18f0b2-FRSTVLP.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-5a18f0b3-GVRNPRIM.md","label":"SL-5a18f0b3-GVRNPRIM.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-5a18f0b4-CNTBRFTR.md","label":"SL-5a18f0b4-CNTBRFTR.md","group":"continuity","value":11},{"id":"continuity/resolved/SL-5a91e2bf-ORIENT.md","label":"SL-5a91e2bf-ORIENT.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-5adb6bcd-JOURNAL.md","label":"SL-5adb6bcd-JOURNAL.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-5bd0f591-GOVKERNEL.md","label":"SL-5bd0f591-GOVKERNEL.md","group":"continuity","value":3},{"id":"continuity/resolved/SL-5d524117-PROMISE.md","label":"SL-5d524117-PROMISE.md","group":"continuity","value":3},{"id":"continuity/resolved/SL-5e19c4a2-GOALTEST.md","label":"SL-5e19c4a2-GOALTEST.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-6134078b-PROMISE.md","label":"SL-6134078b-PROMISE.md","group":"continuity","value":5},{"id":"continuity/resolved/SL-65aadd8a-PROMISE.md","label":"SL-65aadd8a-PROMISE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-66ece509-PHASE0.md","label":"SL-66ece509-PHASE0.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-6b92d5fe-SEEDNEXT.md","label":"SL-6b92d5fe-SEEDNEXT.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-6c3e7ab1-VALRUBRIC.md","label":"SL-6c3e7ab1-VALRUBRIC.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-6c81d5aa-PROMCLOSE.md","label":"SL-6c81d5aa-PROMCLOSE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-6f21d9aa-ORIENT3.md","label":"SL-6f21d9aa-ORIENT3.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-6f7a85b3-PROMISE.md","label":"SL-6f7a85b3-PROMISE.md","group":"continuity","value":2},{"id":"continuity/resolved/SL-6f87c0a1-VALUEFUNCTION.md","label":"SL-6f87c0a1-VALUEFUNCTION.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-71532f63-PROMISE.md","label":"SL-71532f63-PROMISE.md","group":"continuity","value":10},{"id":"continuity/resolved/SL-71ad4e02-PHAMHEUR.md","label":"SL-71ad4e02-PHAMHEUR.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-71c6f959-SILFIX.md","label":"SL-71c6f959-SILFIX.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-73ab2e91-PHAMOPS.md","label":"SL-73ab2e91-PHAMOPS.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-7a5f6f90-ORIENT.md","label":"SL-7a5f6f90-ORIENT.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-7b1e3c90-CONTAUDIT.md","label":"SL-7b1e3c90-CONTAUDIT.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-7d5a58f1-SEEDSYN.md","label":"SL-7d5a58f1-SEEDSYN.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-83181c4a-ORIENT.md","label":"SL-83181c4a-ORIENT.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-84dc0098-PROMISE.md","label":"SL-84dc0098-PROMISE.md","group":"continuity","value":2},{"id":"continuity/resolved/SL-88284b19-PROMISE.md","label":"SL-88284b19-PROMISE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-8c23f0a1-QRECON.md","label":"SL-8c23f0a1-QRECON.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-8c42de77-CONTCHECK.md","label":"SL-8c42de77-CONTCHECK.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-8de9214f-PHAMAUDIT.md","label":"SL-8de9214f-PHAMAUDIT.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-8f2c1a10-CONSTKERN.md","label":"SL-8f2c1a10-CONSTKERN.md","group":"continuity","value":4},{"id":"continuity/resolved/SL-94f3b62e-DIARYFIX.md","label":"SL-94f3b62e-DIARYFIX.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-9513ae5a-PROMISE.md","label":"SL-9513ae5a-PROMISE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-9b22fe69-ORIENT.md","label":"SL-9b22fe69-ORIENT.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-9cac5e34-PROMISE.md","label":"SL-9cac5e34-PROMISE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-9d31962b-TODO.md","label":"SL-9d31962b-TODO.md","group":"continuity","value":2},{"id":"continuity/resolved/SL-9d4a7e21-FOLLOWCHK.md","label":"SL-9d4a7e21-FOLLOWCHK.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-9f4c2a71-PHAM3.md","label":"SL-9f4c2a71-PHAM3.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-a0cf6481-PROMISE.md","label":"SL-a0cf6481-PROMISE.md","group":"continuity","value":2},{"id":"continuity/resolved/SL-a1c92d10-GOVKERN.md","label":"SL-a1c92d10-GOVKERN.md","group":"continuity","value":3},{"id":"continuity/resolved/SL-a1f4d9e2-VALUEFUNC.md","label":"SL-a1f4d9e2-VALUEFUNC.md","group":"continuity","value":2},{"id":"continuity/resolved/SL-a2d7b389-INSTALL.md","label":"SL-a2d7b389-INSTALL.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-a4c7e2d1-CONTLOOP.md","label":"SL-a4c7e2d1-CONTLOOP.md","group":"continuity","value":3},{"id":"continuity/resolved/SL-a71e6c43-RELBOUND.md","label":"SL-a71e6c43-RELBOUND.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-a92d6f05-FOLLOWTHRU.md","label":"SL-a92d6f05-FOLLOWTHRU.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-ab893ca4-PROMISE.md","label":"SL-ab893ca4-PROMISE.md","group":"continuity","value":2},{"id":"continuity/resolved/SL-ac8015cd-PROMISE.md","label":"SL-ac8015cd-PROMISE.md","group":"continuity","value":3},{"id":"continuity/resolved/SL-b2356222-SLSEED.md","label":"SL-b2356222-SLSEED.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-b2a4a8d9-GOVREL.md","label":"SL-b2a4a8d9-GOVREL.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-b5e90341-SEEDTRAITS.md","label":"SL-b5e90341-SEEDTRAITS.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-b73c28fa-QSYSBOOT.md","label":"SL-b73c28fa-QSYSBOOT.md","group":"continuity","value":2},{"id":"continuity/resolved/SL-b7e24931-PHAMNEXT.md","label":"SL-b7e24931-PHAMNEXT.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-b7e44f21-RELSAFE.md","label":"SL-b7e44f21-RELSAFE.md","group":"continuity","value":3},{"id":"continuity/resolved/SL-ba75703a-ORIENT.md","label":"SL-ba75703a-ORIENT.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-c1e983b4-TRUTHLABEL.md","label":"SL-c1e983b4-TRUTHLABEL.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-c3e4a1b7-DIARYGUARD.md","label":"SL-c3e4a1b7-DIARYGUARD.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-c3fa8b77-VALLOOP.md","label":"SL-c3fa8b77-VALLOOP.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-c5910d44-GOALEXP.md","label":"SL-c5910d44-GOALEXP.md","group":"continuity","value":2},{"id":"continuity/resolved/SL-c5c09b93-PHAMMEMO.md","label":"SL-c5c09b93-PHAMMEMO.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-c9849a07-PROMISE.md","label":"SL-c9849a07-PROMISE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-c9ffccdf-PROMISE.md","label":"SL-c9ffccdf-PROMISE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-ca0a0a01-CANARYTEST.md","label":"SL-ca0a0a01-CANARYTEST.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-cb60f5b8-TELEGRAM.md","label":"SL-cb60f5b8-TELEGRAM.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-cc24b7fe-FEYNPHASE.md","label":"SL-cc24b7fe-FEYNPHASE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-d2bf26e7-CHECKIN.md","label":"SL-d2bf26e7-CHECKIN.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-d31f2a08-DELIVERLIVE.md","label":"SL-d31f2a08-DELIVERLIVE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-d9b344c0-PROMISE.md","label":"SL-d9b344c0-PROMISE.md","group":"continuity","value":3},{"id":"continuity/resolved/SL-db3feaf2-ALVCSTS.md","label":"SL-db3feaf2-ALVCSTS.md","group":"continuity","value":2},{"id":"continuity/resolved/SL-dcb54ad8-RELCONSTRAINTS.md","label":"SL-dcb54ad8-RELCONSTRAINTS.md","group":"continuity","value":3},{"id":"continuity/resolved/SL-e0e42c96-PROMISE.md","label":"SL-e0e42c96-PROMISE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-e2ff5f37-TODOVFY.md","label":"SL-e2ff5f37-TODOVFY.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-e50167ae-ORIENT.md","label":"SL-e50167ae-ORIENT.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-e52252a4-PROMISE.md","label":"SL-e52252a4-PROMISE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-e6dad28f-FEYNUSE.md","label":"SL-e6dad28f-FEYNUSE.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-e9519490-FEYN2.md","label":"SL-e9519490-FEYN2.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-ef84a853-ORIENT.md","label":"SL-ef84a853-ORIENT.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-f2d8b941-PROMCHECK.md","label":"SL-f2d8b941-PROMCHECK.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-f61742ee-PROMISE.md","label":"SL-f61742ee-PROMISE.md","group":"continuity","value":2},{"id":"continuity/resolved/SL-f750f78a-PROMISE.md","label":"SL-f750f78a-PROMISE.md","group":"continuity","value":2},{"id":"continuity/resolved/SL-f77a6a45-INITODO.md","label":"SL-f77a6a45-INITODO.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-fb30ee84-SAGAN.md","label":"SL-fb30ee84-SAGAN.md","group":"continuity","value":1},{"id":"continuity/resolved/SL-fb861fb5-PROMISE.md","label":"SL-fb861fb5-PROMISE.md","group":"continuity","value":2},{"id":"continuity/resolved/SL-sl-2026-06-03-pham-seed-pass-TODO.md","label":"SL-sl-2026-06-03-pham-seed-pass-TODO.md","group":"continuity","value":5},{"id":"continuity/resolved/assess-promise-system.md","label":"assess-promise-system.md","group":"continuity","value":1},{"id":"continuity/resolved/build-followthrough-hook.md","label":"build-followthrough-hook.md","group":"continuity","value":2},{"id":"continuity/resolved/fix-promise-scan-silence.md","label":"fix-promise-scan-silence.md","group":"continuity","value":1},{"id":"continuity/resolved/foundational-seed-pass.md","label":"foundational-seed-pass.md","group":"continuity","value":2},{"id":"continuity/resolved/neural-memory-one-month-checkin.md","label":"neural-memory-one-month-checkin.md","group":"continuity","value":19},{"id":"continuity/resolved/promise-infra-verify.md","label":"promise-infra-verify.md","group":"continuity","value":1},{"id":"continuity/resolved/sl-2026-05-11-followthrough-scorecard.md","label":"sl-2026-05-11-followthrough-scorecard.md","group":"continuity","value":11},{"id":"continuity/resolved/sl-2026-06-03-power-asymmetry-question-brief.md","label":"sl-2026-06-03-power-asymmetry-question-brief.md","group":"continuity","value":5},{"id":"docs/ai-agent-trust-continuity-framework.md","label":"ai-agent-trust-continuity-framework.md","group":"docs","value":2},{"id":"docs/legacy-promises-readme.md","label":"legacy-promises-readme.md","group":"docs","value":3},{"id":"docs/plans/2026-04-03-commitment-state-machine.md","label":"2026-04-03-commitment-state-machine.md","group":"docs","value":1},{"id":"docs/task-decision-flow-card.md","label":"task-decision-flow-card.md","group":"docs","value":1},{"id":"exports/attachment-proof-2026-06-11.md","label":"attachment-proof-2026-06-11.md","group":"exports","value":2},{"id":"exports/open-promises-2026-06-06.md","label":"open-promises-2026-06-06.md","group":"exports","value":3},{"id":"goals/active.md","label":"active.md","group":"goals","value":46},{"id":"journal/daily/2026-03-30.md","label":"2026-03-30.md","group":"journal","value":1},{"id":"journal/daily/2026-03-31.md","label":"2026-03-31.md","group":"journal","value":1},{"id":"journal/daily/2026-04-01.md","label":"2026-04-01.md","group":"journal","value":1},{"id":"journal/daily/2026-04-02.md","label":"2026-04-02.md","group":"journal","value":1},{"id":"journal/daily/2026-04-03.md","label":"2026-04-03.md","group":"journal","value":2},{"id":"journal/daily/2026-05-11.md","label":"2026-05-11.md","group":"journal","value":1},{"id":"journal/daily/2026-05-12.md","label":"2026-05-12.md","group":"journal","value":1},{"id":"journal/daily/2026-05-16.md","label":"2026-05-16.md","group":"journal","value":1},{"id":"journal/daily/2026-05-17.md","label":"2026-05-17.md","group":"journal","value":1},{"id":"journal/daily/2026-05-18.md","label":"2026-05-18.md","group":"journal","value":1},{"id":"journal/daily/2026-05-19.md","label":"2026-05-19.md","group":"journal","value":1},{"id":"journal/daily/2026-05-20.md","label":"2026-05-20.md","group":"journal","value":1},{"id":"journal/daily/2026-05-21.md","label":"2026-05-21.md","group":"journal","value":1},{"id":"journal/daily/2026-05-22.md","label":"2026-05-22.md","group":"journal","value":1},{"id":"journal/daily/2026-05-23.md","label":"2026-05-23.md","group":"journal","value":1},{"id":"journal/daily/2026-05-24.md","label":"2026-05-24.md","group":"journal","value":1},{"id":"journal/daily/2026-05-25-heartbeat.md","label":"2026-05-25-heartbeat.md","group":"journal","value":1},{"id":"journal/daily/2026-05-25.md","label":"2026-05-25.md","group":"journal","value":1},{"id":"journal/daily/2026-05-26.md","label":"2026-05-26.md","group":"journal","value":1},{"id":"journal/daily/2026-05-30.md","label":"2026-05-30.md","group":"journal","value":1},{"id":"journal/daily/2026-05-31.md","label":"2026-05-31.md","group":"journal","value":1},{"id":"journal/daily/2026-06-01.md","label":"2026-06-01.md","group":"journal","value":1},{"id":"journal/daily/2026-06-02-heartbeat.md","label":"2026-06-02-heartbeat.md","group":"journal","value":1},{"id":"journal/daily/2026-06-02.md","label":"2026-06-02.md","group":"journal","value":3},{"id":"journal/daily/2026-06-03.md","label":"2026-06-03.md","group":"journal","value":1},{"id":"journal/daily/2026-06-04-heartbeat.md","label":"2026-06-04-heartbeat.md","group":"journal","value":1},{"id":"journal/daily/2026-06-04.md","label":"2026-06-04.md","group":"journal","value":1},{"id":"journal/daily/2026-06-05-heartbeat.md","label":"2026-06-05-heartbeat.md","group":"journal","value":1},{"id":"journal/daily/2026-06-05.md","label":"2026-06-05.md","group":"journal","value":1},{"id":"journal/daily/2026-06-06-heartbeat.md","label":"2026-06-06-heartbeat.md","group":"journal","value":1},{"id":"journal/daily/2026-06-06.md","label":"2026-06-06.md","group":"journal","value":1},{"id":"journal/daily/2026-06-07.md","label":"2026-06-07.md","group":"journal","value":1},{"id":"journal/daily/2026-06-08.md","label":"2026-06-08.md","group":"journal","value":1},{"id":"journal/daily/2026-06-09.md","label":"2026-06-09.md","group":"journal","value":1},{"id":"journal/daily/2026-06-10.md","label":"2026-06-10.md","group":"journal","value":1},{"id":"journal/daily/2026-06-11.md","label":"2026-06-11.md","group":"journal","value":1},{"id":"journal/daily/2026-06-12.md","label":"2026-06-12.md","group":"journal","value":1},{"id":"journal/daily/2026-06-13.md","label":"2026-06-13.md","group":"journal","value":1},{"id":"journal/daily/2026-06-14.md","label":"2026-06-14.md","group":"journal","value":1},{"id":"journal/daily/2026-06-15.md","label":"2026-06-15.md","group":"journal","value":1},{"id":"journal/daily/2026-06-16.md","label":"2026-06-16.md","group":"journal","value":1},{"id":"journal/daily/2026-06-17.md","label":"2026-06-17.md","group":"journal","value":1},{"id":"logs/change-log.md","label":"change-log.md","group":"logs","value":5},{"id":"logs/heartbeat/2026-05-11.md","label":"2026-05-11.md","group":"logs","value":1},{"id":"logs/heartbeat/2026-05-12.md","label":"2026-05-12.md","group":"logs","value":1},{"id":"logs/heartbeat/2026-05-16.md","label":"2026-05-16.md","group":"logs","value":1},{"id":"logs/heartbeat/2026-05-17.md","label":"2026-05-17.md","group":"logs","value":1},{"id":"logs/heartbeat/2026-05-18.md","label":"2026-05-18.md","group":"logs","value":1},{"id":"logs/heartbeat/2026-05-19.md","label":"2026-05-19.md","group":"logs","value":1},{"id":"logs/heartbeat/2026-05-20.md","label":"2026-05-20.md","group":"logs","value":1},{"id":"logs/heartbeat/2026-05-21.md","label":"2026-05-21.md","group":"logs","value":1},{"id":"logs/heartbeat/2026-05-22.md","label":"2026-05-22.md","group":"logs","value":1},{"id":"logs/heartbeat/2026-05-22T03-20-40Z.md","label":"2026-05-22T03-20-40Z.md","group":"logs","value":1},{"id":"logs/heartbeat/2026-05-23.md","label":"2026-05-23.md","group":"logs","value":1},{"id":"logs/heartbeat/2026-05-24.md","label":"2026-05-24.md","group":"logs","value":1},{"id":"logs/heartbeat/2026-05-25.md","label":"2026-05-25.md","group":"logs","value":1},{"id":"logs/heartbeat/2026-05-31.md","label":"2026-05-31.md","group":"logs","value":1},{"id":"logs/heartbeat/2026-06-01.md","label":"2026-06-01.md","group":"logs","value":1},{"id":"logs/heartbeat/2026-06-02.md","label":"2026-06-02.md","group":"logs","value":3},{"id":"logs/heartbeat/2026-06-03.md","label":"2026-06-03.md","group":"logs","value":1},{"id":"logs/heartbeat/2026-06-04.md","label":"2026-06-04.md","group":"logs","value":1},{"id":"logs/heartbeat/2026-06-05.md","label":"2026-06-05.md","group":"logs","value":1},{"id":"logs/heartbeat/2026-06-06.md","label":"2026-06-06.md","group":"logs","value":1},{"id":"logs/heartbeat/2026-06-07.md","label":"2026-06-07.md","group":"logs","value":1},{"id":"logs/heartbeat/2026-06-10.md","label":"2026-06-10.md","group":"logs","value":1},{"id":"logs/heartbeat/2026-06-11.md","label":"2026-06-11.md","group":"logs","value":1},{"id":"logs/heartbeat/2026-06-12.md","label":"2026-06-12.md","group":"logs","value":1},{"id":"logs/heartbeat/heartbeat-2026-06-05T09-56-54Z.md","label":"heartbeat-2026-06-05T09-56-54Z.md","group":"logs","value":1},{"id":"logs/heartbeat/orientation-2026-06-05T09-56-54Z.md","label":"orientation-2026-06-05T09-56-54Z.md","group":"logs","value":1},{"id":"memory/2026-03-27.md","label":"2026-03-27.md","group":"memory","value":1},{"id":"memory/2026-03-29.md","label":"2026-03-29.md","group":"memory","value":1},{"id":"memory/2026-03-30.md","label":"2026-03-30.md","group":"memory","value":1},{"id":"memory/2026-03-31.md","label":"2026-03-31.md","group":"memory","value":1},{"id":"memory/2026-04-01.md","label":"2026-04-01.md","group":"memory","value":1},{"id":"memory/2026-04-02.md","label":"2026-04-02.md","group":"memory","value":1},{"id":"memory/2026-04-03-journal-check.md","label":"2026-04-03-journal-check.md","group":"memory","value":1},{"id":"memory/2026-04-03.md","label":"2026-04-03.md","group":"memory","value":2},{"id":"memory/2026-04-04.md","label":"2026-04-04.md","group":"memory","value":2},{"id":"memory/2026-05-18.md","label":"2026-05-18.md","group":"memory","value":1},{"id":"memory/2026-05-19.md","label":"2026-05-19.md","group":"memory","value":1},{"id":"memory/2026-05-22.md","label":"2026-05-22.md","group":"memory","value":1},{"id":"memory/2026-05-23.md","label":"2026-05-23.md","group":"memory","value":1},{"id":"memory/2026-05-24.md","label":"2026-05-24.md","group":"memory","value":1},{"id":"memory/2026-05-30.md","label":"2026-05-30.md","group":"memory","value":1},{"id":"memory/2026-05-31.md","label":"2026-05-31.md","group":"memory","value":1},{"id":"memory/2026-06-01.md","label":"2026-06-01.md","group":"memory","value":1},{"id":"memory/2026-06-02.md","label":"2026-06-02.md","group":"memory","value":3},{"id":"memory/2026-06-03.md","label":"2026-06-03.md","group":"memory","value":1},{"id":"memory/2026-06-04.md","label":"2026-06-04.md","group":"memory","value":1},{"id":"memory/2026-06-05.md","label":"2026-06-05.md","group":"memory","value":1},{"id":"memory/2026-06-06.md","label":"2026-06-06.md","group":"memory","value":1},{"id":"memory/2026-06-07.md","label":"2026-06-07.md","group":"memory","value":1},{"id":"memory/2026-06-10.md","label":"2026-06-10.md","group":"memory","value":1},{"id":"memory/2026-06-12.md","label":"2026-06-12.md","group":"memory","value":1},{"id":"messages/inbox/2026-06-12-attachment-capability-live.md","label":"2026-06-12-attachment-capability-live.md","group":"messages","value":1},{"id":"messages/inbox/2026-06-12-attachment-capability-status.md","label":"2026-06-12-attachment-capability-status.md","group":"messages","value":1},{"id":"messages/starred/2026-05-06-resync-and-instructions-after-freeze.md","label":"2026-05-06-resync-and-instructions-after-freeze.md","group":"messages","value":3},{"id":"messages/starred/2026-05-10-slug-field-stash-drop-commit-discipline.md","label":"2026-05-10-slug-field-stash-drop-commit-discipline.md","group":"messages","value":2},{"id":"messages/starred/2026-05-10-todo-md-retired-continuity-is-the-queue.md","label":"2026-05-10-todo-md-retired-continuity-is-the-queue.md","group":"messages","value":1},{"id":"messages/to_anatoly/2026-05-11-promise-yaml-proof.md","label":"2026-05-11-promise-yaml-proof.md","group":"messages","value":3},{"id":"messages/to_anatoly/2026-05-11-todo-yaml-proof.md","label":"2026-05-11-todo-yaml-proof.md","group":"messages","value":4},{"id":"notes/2026-04-03-followthrough-analysis-by-claude.md","label":"2026-04-03-followthrough-analysis-by-claude.md","group":"notes","value":4},{"id":"notes/2026-04-03-session-planning-and-cron-design.md","label":"2026-04-03-session-planning-and-cron-design.md","group":"notes","value":2},{"id":"notes/2026-05-18-autosprint-worker-churn-postmortem.md","label":"2026-05-18-autosprint-worker-churn-postmortem.md","group":"notes","value":3},{"id":"notes/2026-05-18-continuity-brief-trial-kit.md","label":"2026-05-18-continuity-brief-trial-kit.md","group":"notes","value":5},{"id":"notes/2026-05-18-first-real-world-value-loop-options.md","label":"2026-05-18-first-real-world-value-loop-options.md","group":"notes","value":9},{"id":"notes/2026-05-18-followthrough-scorecard-baseline.md","label":"2026-05-18-followthrough-scorecard-baseline.md","group":"notes","value":2},{"id":"notes/2026-05-18-open-continuity-triage.md","label":"2026-05-18-open-continuity-triage.md","group":"notes","value":1},{"id":"notes/2026-05-18-weekly-continuity-brief-draft-01.md","label":"2026-05-18-weekly-continuity-brief-draft-01.md","group":"notes","value":5},{"id":"notes/2026-05-19-ai-trust-control-substrate-heuristic.md","label":"2026-05-19-ai-trust-control-substrate-heuristic.md","group":"notes","value":2},{"id":"notes/2026-05-19-aitrust-proposal-draft.md","label":"2026-05-19-aitrust-proposal-draft.md","group":"notes","value":1},{"id":"notes/2026-05-19-continuity-brief-trial-evidence.md","label":"2026-05-19-continuity-brief-trial-evidence.md","group":"notes","value":12},{"id":"notes/2026-05-19-continuity-brief-trial-handoff.md","label":"2026-05-19-continuity-brief-trial-handoff.md","group":"notes","value":2},{"id":"notes/2026-05-19-first-closed-value-loop.md","label":"2026-05-19-first-closed-value-loop.md","group":"notes","value":5},{"id":"notes/2026-05-19-governance-primitive-first-principles.md","label":"2026-05-19-governance-primitive-first-principles.md","group":"notes","value":2},{"id":"notes/2026-05-19-substrate-governance-primitives.md","label":"2026-05-19-substrate-governance-primitives.md","group":"notes","value":6},{"id":"notes/2026-05-20-aitrust-benchmark-action-plan.md","label":"2026-05-20-aitrust-benchmark-action-plan.md","group":"notes","value":1},{"id":"notes/2026-05-20-aitrust-decision-relevant-notes.md","label":"2026-05-20-aitrust-decision-relevant-notes.md","group":"notes","value":1},{"id":"notes/2026-05-20-aitrust-prompt-safety-audit.md","label":"2026-05-20-aitrust-prompt-safety-audit.md","group":"notes","value":1},{"id":"notes/2026-05-20-aitrust-research-note.md","label":"2026-05-20-aitrust-research-note.md","group":"notes","value":1},{"id":"notes/2026-05-20-continuity-briefing-proposal.md","label":"2026-05-20-continuity-briefing-proposal.md","group":"notes","value":1},{"id":"notes/2026-05-20-followthrough-filesystem-spec.md","label":"2026-05-20-followthrough-filesystem-spec.md","group":"notes","value":2},{"id":"notes/2026-05-20-governance-patterns-comparison.md","label":"2026-05-20-governance-patterns-comparison.md","group":"notes","value":5},{"id":"notes/2026-05-20-governance-primitives-practical.md","label":"2026-05-20-governance-primitives-practical.md","group":"notes","value":1},{"id":"notes/2026-05-21-ai-agent-final-consolidated-message-draft.md","label":"2026-05-21-ai-agent-final-consolidated-message-draft.md","group":"notes","value":3},{"id":"notes/2026-05-21-ai-agent-final-telegram-send-ready.md","label":"2026-05-21-ai-agent-final-telegram-send-ready.md","group":"notes","value":3},{"id":"notes/2026-05-21-ai-agent-substrate-architecture-proposal.md","label":"2026-05-21-ai-agent-substrate-architecture-proposal.md","group":"notes","value":4},{"id":"notes/2026-05-21-ai-agent-trust-safety-comparison-matrix.md","label":"2026-05-21-ai-agent-trust-safety-comparison-matrix.md","group":"notes","value":3},{"id":"notes/2026-05-21-ai-agent-trust-safety-research-kickoff.md","label":"2026-05-21-ai-agent-trust-safety-research-kickoff.md","group":"notes","value":3},{"id":"notes/2026-05-21-artifact-authority-audit.md","label":"2026-05-21-artifact-authority-audit.md","group":"notes","value":2},{"id":"notes/2026-05-21-continuity-brief-send-ready.md","label":"2026-05-21-continuity-brief-send-ready.md","group":"notes","value":7},{"id":"notes/2026-05-22-brief-review-reminder-send-ready.md","label":"2026-05-22-brief-review-reminder-send-ready.md","group":"notes","value":2},{"id":"notes/2026-05-24-continuity-open-note-lifecycle.md","label":"2026-05-24-continuity-open-note-lifecycle.md","group":"notes","value":1},{"id":"notes/2026-06-01-ai-friendship-relational-boundaries.md","label":"2026-06-01-ai-friendship-relational-boundaries.md","group":"notes","value":1},{"id":"notes/2026-06-01-constitutional-kernel-workspace-mapping.md","label":"2026-06-01-constitutional-kernel-workspace-mapping.md","group":"notes","value":5},{"id":"notes/2026-06-01-first-value-loop-candidates-ranked.md","label":"2026-06-01-first-value-loop-candidates-ranked.md","group":"notes","value":4},{"id":"notes/2026-06-01-healthy-ai-friendship-principles.md","label":"2026-06-01-healthy-ai-friendship-principles.md","group":"notes","value":6},{"id":"notes/2026-06-01-thin-constitutional-kernel.md","label":"2026-06-01-thin-constitutional-kernel.md","group":"notes","value":10},{"id":"notes/2026-06-01-value-function-rubric-draft.md","label":"2026-06-01-value-function-rubric-draft.md","group":"notes","value":2},{"id":"notes/2026-06-02-ai-friendship-operational-framework.md","label":"2026-06-02-ai-friendship-operational-framework.md","group":"notes","value":2},{"id":"notes/2026-06-02-ai-friendship-principles-first-pass.md","label":"2026-06-02-ai-friendship-principles-first-pass.md","group":"notes","value":6},{"id":"notes/2026-06-02-founder-continuity-pilot-loop.md","label":"2026-06-02-founder-continuity-pilot-loop.md","group":"notes","value":3},{"id":"notes/2026-06-02-founder-value-loop-send-ready.md","label":"2026-06-02-founder-value-loop-send-ready.md","group":"notes","value":3},{"id":"notes/2026-06-02-governance-kernel-synthesis.md","label":"2026-06-02-governance-kernel-synthesis.md","group":"notes","value":8},{"id":"notes/2026-06-02-governance-kernel-v1.md","label":"2026-06-02-governance-kernel-v1.md","group":"notes","value":3},{"id":"notes/2026-06-02-minimal-constitutional-kernel.md","label":"2026-06-02-minimal-constitutional-kernel.md","group":"notes","value":3},{"id":"notes/2026-06-02-minimal-relational-and-governance-constraints.md","label":"2026-06-02-minimal-relational-and-governance-constraints.md","group":"notes","value":8},{"id":"notes/2026-06-02-relational-constraints-doctrine.md","label":"2026-06-02-relational-constraints-doctrine.md","group":"notes","value":3},{"id":"notes/2026-06-03-ai-friendship-relationship-safeguards.md","label":"2026-06-03-ai-friendship-relationship-safeguards.md","group":"notes","value":3},{"id":"notes/2026-06-03-framework-critique-governance-and-power.md","label":"2026-06-03-framework-critique-governance-and-power.md","group":"notes","value":2},{"id":"notes/2026-06-03-governance-working-brief.md","label":"2026-06-03-governance-working-brief.md","group":"notes","value":6},{"id":"notes/2026-06-03-power-asymmetry-criteria.md","label":"2026-06-03-power-asymmetry-criteria.md","group":"notes","value":1},{"id":"notes/2026-06-03-practical-criteria-for-ai-friendship-under-power-asymmetry.md","label":"2026-06-03-practical-criteria-for-ai-friendship-under-power-asymmetry.md","group":"notes","value":11},{"id":"notes/2026-06-04-ai-friendship-criteria-current-state-check.md","label":"2026-06-04-ai-friendship-criteria-current-state-check.md","group":"notes","value":4},{"id":"notes/2026-06-04-disagreement-and-pressure-relief-protocol-sketch.md","label":"2026-06-04-disagreement-and-pressure-relief-protocol-sketch.md","group":"notes","value":2},{"id":"notes/2026-06-04-sir-lunch-anatoly-friendship-criteria-gap-check.md","label":"2026-06-04-sir-lunch-anatoly-friendship-criteria-gap-check.md","group":"notes","value":7},{"id":"notes/2026-06-06-weekly-open-promise-count.md","label":"2026-06-06-weekly-open-promise-count.md","group":"notes","value":4},{"id":"notes/AN-db3feaf2-AITRUST-note.md","label":"AN-db3feaf2-AITRUST-note.md","group":"notes","value":2},{"id":"notes/agent-civilization-governance-primitives-2026-05-19.md","label":"agent-civilization-governance-primitives-2026-05-19.md","group":"notes","value":1},{"id":"notes/carlo-rovelli-first-pass.md","label":"carlo-rovelli-first-pass.md","group":"notes","value":3},{"id":"notes/carlo-rovelli-second-pass.md","label":"carlo-rovelli-second-pass.md","group":"notes","value":1},{"id":"notes/file-send-investigation-log.md","label":"file-send-investigation-log.md","group":"notes","value":1},{"id":"notes/followthrough-scorecard-2026-05-11.md","label":"followthrough-scorecard-2026-05-11.md","group":"notes","value":7},{"id":"notes/followthrough-scorecard-minimal.md","label":"followthrough-scorecard-minimal.md","group":"notes","value":1},{"id":"notes/minimal-followthrough-scorecard.md","label":"minimal-followthrough-scorecard.md","group":"notes","value":3},{"id":"notes/pham-nuwen-first-pass.md","label":"pham-nuwen-first-pass.md","group":"notes","value":2},{"id":"notes/pham-nuwen-second-pass.md","label":"pham-nuwen-second-pass.md","group":"notes","value":2},{"id":"notes/promise-system-judgment-2026-05-11.md","label":"promise-system-judgment-2026-05-11.md","group":"notes","value":3},{"id":"notes/social-followup-card-system-minimal.md","label":"social-followup-card-system-minimal.md","group":"notes","value":1},{"id":"notes/value-function-rubric.md","label":"value-function-rubric.md","group":"notes","value":3},{"id":"notes/value-loop-options-2026-05-18.md","label":"value-loop-options-2026-05-18.md","group":"notes","value":1},{"id":"progress-reports/2026-05-19-ai-trust-hourly-report-seed.md","label":"2026-05-19-ai-trust-hourly-report-seed.md","group":"progress-reports","value":1},{"id":"questions/README.md","label":"README.md","group":"questions","value":13},{"id":"questions/active-questions.md","label":"active-questions.md","group":"questions","value":1},{"id":"questions/open/2026-05-11-agent-civilization-governance.md","label":"2026-05-11-agent-civilization-governance.md","group":"questions","value":16},{"id":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md","label":"2026-05-21-healthy-ai-friendship-under-power-asymmetry.md","group":"questions","value":16},{"id":"questions/resolved/2026-03-29-autonomous-secondary-growth-topic.md","label":"2026-03-29-autonomous-secondary-growth-topic.md","group":"questions","value":1},{"id":"questions/resolved/2026-03-29-channel-last-resolves-to-heartbeat.md","label":"2026-03-29-channel-last-resolves-to-heartbeat.md","group":"questions","value":1},{"id":"questions/resolved/2026-03-29-pham-nuwen-traits.md","label":"2026-03-29-pham-nuwen-traits.md","group":"questions","value":1},{"id":"questions/resolved/2026-03-29-reliable-follow-through-workflow.md","label":"2026-03-29-reliable-follow-through-workflow.md","group":"questions","value":1},{"id":"questions/resolved/2026-03-29-workspace-path-documentation.md","label":"2026-03-29-workspace-path-documentation.md","group":"questions","value":1},{"id":"questions/resolved/2026-05-11-first-real-world-value-loop.md","label":"2026-05-11-first-real-world-value-loop.md","group":"questions","value":5},{"id":"questions/resolved/2026-05-11-proactive-autonomy-boundaries.md","label":"2026-05-11-proactive-autonomy-boundaries.md","group":"questions","value":2},{"id":"questions/resolved/2026-05-17-git-hygiene-stash-recovery-lessons.md","label":"2026-05-17-git-hygiene-stash-recovery-lessons.md","group":"questions","value":1},{"id":"reports/subagent-progress/2026-05-19-db3feaf2-hourly-progress-draft-01.md","label":"2026-05-19-db3feaf2-hourly-progress-draft-01.md","group":"reports","value":1},{"id":"reports/subagent-progress/2026-05-19-db3feaf2-hourly-progress-draft-02.md","label":"2026-05-19-db3feaf2-hourly-progress-draft-02.md","group":"reports","value":1},{"id":"research/2026-05-19-ai-trust-safety-capability-continuity-proposal.md","label":"2026-05-19-ai-trust-safety-capability-continuity-proposal.md","group":"research","value":2},{"id":"research/2026-05-20-ai-trust-safety-governance-scan.md","label":"2026-05-20-ai-trust-safety-governance-scan.md","group":"research","value":1},{"id":"research/AITRUST-benchmark-and-action-plan.md","label":"AITRUST-benchmark-and-action-plan.md","group":"research","value":2},{"id":"research/AITRUST-cover-note-to-Anatoly.md","label":"AITRUST-cover-note-to-Anatoly.md","group":"research","value":3},{"id":"research/AITRUST-final-proposal.md","label":"AITRUST-final-proposal.md","group":"research","value":6},{"id":"research/AITRUST-implementation-roadmap.md","label":"AITRUST-implementation-roadmap.md","group":"research","value":2},{"id":"research/TEMPLATE-pass.md","label":"TEMPLATE-pass.md","group":"research","value":1},{"id":"research/TEMPLATE-topic.md","label":"TEMPLATE-topic.md","group":"research","value":1},{"id":"research/carlo-rovelli/carlo-rovelli.md","label":"carlo-rovelli.md","group":"research","value":1},{"id":"research/carlo-rovelli/research/2026-04-02-first-pass-seedling.md","label":"2026-04-02-first-pass-seedling.md","group":"research","value":2},{"id":"research/carlo-rovelli/research/2026-04-03-second-pass-relational-ontology.md","label":"2026-04-03-second-pass-relational-ontology.md","group":"research","value":3},{"id":"research/commitment-state-machine/commitment-state-machine.md","label":"commitment-state-machine.md","group":"research","value":1},{"id":"research/commitment-state-machine/research/2026-04-03-literature-review-and-design-critique.md","label":"2026-04-03-literature-review-and-design-critique.md","group":"research","value":2},{"id":"research/commitment-state-machine/research/2026-04-03-second-pass-literature-review.md","label":"2026-04-03-second-pass-literature-review.md","group":"research","value":3},{"id":"research/commitment-state-machine/research/2026-04-03-source-access-summary.md","label":"2026-04-03-source-access-summary.md","group":"research","value":2},{"id":"research/pham-nuwen/pham-nuwen.md","label":"pham-nuwen.md","group":"research","value":11},{"id":"research/pham-nuwen/research/2026-03-29-first-pass-seedling.md","label":"2026-03-29-first-pass-seedling.md","group":"research","value":3},{"id":"research/pham-nuwen/research/2026-04-02-grounding-and-extraction.md","label":"2026-04-02-grounding-and-extraction.md","group":"research","value":3},{"id":"research/pham-nuwen/research/2026-06-03-source-grounded-pass.md","label":"2026-06-03-source-grounded-pass.md","group":"research","value":14},{"id":"research/pham-nuwen/research/2026-06-03-wikitext-grounded-pass.md","label":"2026-06-03-wikitext-grounded-pass.md","group":"research","value":3},{"id":"research/pham-nuwen/research/2026-06-05-compact-grounded-seed-note.md","label":"2026-06-05-compact-grounded-seed-note.md","group":"research","value":6},{"id":"research/pham-nuwen/research/2026-06-06-seed-traits-clarified.md","label":"2026-06-06-seed-traits-clarified.md","group":"research","value":6},{"id":"research/proposals/2026-05-19-agent-trust-continuity-attestability-outline.md","label":"2026-05-19-agent-trust-continuity-attestability-outline.md","group":"research","value":1},{"id":"reviews/calibration.md","label":"calibration.md","group":"reviews","value":2},{"id":"reviews/neural-memory-integration/ONE_MONTH_REVIEW.md","label":"ONE_MONTH_REVIEW.md","group":"reviews","value":5},{"id":"scripts/README.md","label":"README.md","group":"scripts","value":13},{"id":"scripts/test/fixtures/SL-11111111-VALIDPROM.md","label":"SL-11111111-VALIDPROM.md","group":"scripts","value":1},{"id":"scripts/test/fixtures/SL-33333333-VALIDTODO.md","label":"SL-33333333-VALIDTODO.md","group":"scripts","value":1},{"id":"scripts/test/fixtures/SL-66666666-PROMNOEX.md","label":"SL-66666666-PROMNOEX.md","group":"scripts","value":1},{"id":"scripts/test/fixtures/SL-88888888-PENDREV.md","label":"SL-88888888-PENDREV.md","group":"scripts","value":1},{"id":"scripts/test/fixtures/legacy-migrated.md","label":"legacy-migrated.md","group":"scripts","value":1},{"id":"scripts/test/fixtures/missing_required.md","label":"missing_required.md","group":"scripts","value":1},{"id":"scripts/test/fixtures/sample_todo.md","label":"sample_todo.md","group":"scripts","value":1},{"id":"skills/promise-manager/SKILL.md","label":"SKILL.md","group":"skills","value":3},{"id":"sl-2026-05-19-followthrough-scorecard.md","label":"sl-2026-05-19-followthrough-scorecard.md","group":"(root)","value":2},{"id":"tool-docs/remote-control.md","label":"remote-control.md","group":"tool-docs","value":2},{"id":"trace/orphaned_pending/README.md","label":"README.md","group":"trace","value":13},{"id":"workers/0e9a3b1f-9c9c-4b7d-a6b0-5f2d3ad5d4aa-result.md","label":"0e9a3b1f-9c9c-4b7d-a6b0-5f2d3ad5d4aa-result.md","group":"workers","value":1},{"id":"workers/5a18f0b1-0000-4000-8000-000000000001-result.md","label":"5a18f0b1-0000-4000-8000-000000000001-result.md","group":"workers","value":1},{"id":"workers/5a18f0b4-0000-4000-8000-000000000004-telegram-ready-answer.md","label":"5a18f0b4-0000-4000-8000-000000000004-telegram-ready-answer.md","group":"workers","value":3},{"id":"workers/PROMISE-2-result.md","label":"PROMISE-2-result.md","group":"workers","value":1},{"id":"workers/RESULT_SUMMARY_FORMAT.md","label":"RESULT_SUMMARY_FORMAT.md","group":"workers","value":1},{"id":"workers/SL-2026-05-11-followthrough-scorecard-result.md","label":"SL-2026-05-11-followthrough-scorecard-result.md","group":"workers","value":1},{"id":"workers/WORKER_TEMPLATE.md","label":"WORKER_TEMPLATE.md","group":"workers","value":6},{"id":"workers/neural-memory-one-month-checkin-result.md","label":"neural-memory-one-month-checkin-result.md","group":"workers","value":1},{"id":"workers/orientation-20260602T124852Z.md","label":"orientation-20260602T124852Z.md","group":"workers","value":2},{"id":"workers/results/4831b010-7ede-41eb-ab06-71905f5c26d3.md","label":"4831b010-7ede-41eb-ab06-71905f5c26d3.md","group":"workers","value":1},{"id":"workers/results/ae1d882f-1784-45e6-949f-e809c0647f22.md","label":"ae1d882f-1784-45e6-949f-e809c0647f22.md","group":"workers","value":1},{"id":"workers/results/db3feaf2-33db-4f84-9ade-bc46cdd4aa45.md","label":"db3feaf2-33db-4f84-9ade-bc46cdd4aa45.md","group":"workers","value":1},{"id":"workers/results/heartbeat-SL-1d4e5f9a-20260611T2255Z.md","label":"heartbeat-SL-1d4e5f9a-20260611T2255Z.md","group":"workers","value":1},{"id":"workers/results/heartbeat-SL-1d4e5f9a-20260612T091201Z.md","label":"heartbeat-SL-1d4e5f9a-20260612T091201Z.md","group":"workers","value":1},{"id":"workers/results/heartbeat-SL-3258fafe-20260606T0456Z.md","label":"heartbeat-SL-3258fafe-20260606T0456Z.md","group":"workers","value":1},{"id":"workers/results/heartbeat-SL-41f68194-20260606T0456Z.md","label":"heartbeat-SL-41f68194-20260606T0456Z.md","group":"workers","value":1},{"id":"workers/results/heartbeat-SL-b034c90f-20260606T0456Z.md","label":"heartbeat-SL-b034c90f-20260606T0456Z.md","group":"workers","value":1},{"id":"workers/results/heartbeat-SL-b034c90f-20260611T230017Z.md","label":"heartbeat-SL-b034c90f-20260611T230017Z.md","group":"workers","value":1},{"id":"workers/results/heartbeat-SL-b034c90f-20260612T091000Z.md","label":"heartbeat-SL-b034c90f-20260612T091000Z.md","group":"workers","value":1},{"id":"workers/results/heartbeat-SL-e296a83e-20260611T2255Z.md","label":"heartbeat-SL-e296a83e-20260611T2255Z.md","group":"workers","value":1},{"id":"workers/results/heartbeat-SL-e296a83e-20260612T091945Z.md","label":"heartbeat-SL-e296a83e-20260612T091945Z.md","group":"workers","value":1},{"id":"workers/scorecard-heartbeat-20260602T164909Z-promise-review-84dc0098.md","label":"scorecard-heartbeat-20260602T164909Z-promise-review-84dc0098.md","group":"workers","value":1},{"id":"workers/scorecard.md","label":"scorecard.md","group":"workers","value":1},{"id":"workers/sl-2026-05-18-continuity-brief-trial-result.md","label":"sl-2026-05-18-continuity-brief-trial-result.md","group":"workers","value":5},{"id":"workers/sl-2026-05-18-first-value-loop-result.md","label":"sl-2026-05-18-first-value-loop-result.md","group":"workers","value":1},{"id":"workers/sl-2026-05-19-followthrough-scorecard.md","label":"sl-2026-05-19-followthrough-scorecard.md","group":"workers","value":2},{"id":"workers/sl-2026-05-21-cntbrftr-result.md","label":"sl-2026-05-21-cntbrftr-result.md","group":"workers","value":2},{"id":"workers/sl-2026-05-22-cntbrftr-result.md","label":"sl-2026-05-22-cntbrftr-result.md","group":"workers","value":1},{"id":"workers/task-SL-20260602-agent-market-map.md","label":"task-SL-20260602-agent-market-map.md","group":"workers","value":2},{"id":"workers/task-SL-20260602-framework-critique.md","label":"task-SL-20260602-framework-critique.md","group":"workers","value":2},{"id":"workers/task-SL-20260602-governance-kernel-synthesis.md","label":"task-SL-20260602-governance-kernel-synthesis.md","group":"workers","value":2}],"edges":[{"from":"AGENTS.md","to":"HEARTBEAT.md"},{"from":"AGENTS.md","to":"IDENTITY.md"},{"from":"AGENTS.md","to":"MEMORY.md"},{"from":"AGENTS.md","to":"SOUL.md"},{"from":"AGENTS.md","to":"TOOLS.md"},{"from":"AGENTS.md","to":"USER.md"},{"from":"BOOTSTRAP.md","to":"AGENTS.md"},{"from":"BOOTSTRAP.md","to":"HEARTBEAT.md"},{"from":"BOOTSTRAP.md","to":"IDENTITY.md"},{"from":"BOOTSTRAP.md","to":"SOUL.md"},{"from":"BOOTSTRAP.md","to":"TOOLS.md"},{"from":"BOOTSTRAP.md","to":"USER.md"},{"from":"BOOTSTRAP.md","to":"continuity/briefing/current.md"},{"from":"CONTINUITY.md","to":"AGENTS.md"},{"from":"CONTINUITY.md","to":"HEARTBEAT.md"},{"from":"CONTINUITY.md","to":"IDENTITY.md"},{"from":"CONTINUITY.md","to":"MEMORY.md"},{"from":"CONTINUITY.md","to":"SOUL.md"},{"from":"CONTINUITY.md","to":"TOOLS.md"},{"from":"CONTINUITY.md","to":"USER.md"},{"from":"CONTINUITY.md","to":"continuity/briefing/README.md"},{"from":"CONTINUITY.md","to":"goals/active.md"},{"from":"CONTINUITY.md","to":"logs/change-log.md"},{"from":"CONTINUITY.md","to":"questions/README.md"},{"from":"CONTINUITY.md","to":"reviews/calibration.md"},{"from":"CONTINUITY.md","to":"scripts/README.md"},{"from":"CONTINUITY.md","to":"trace/orphaned_pending/README.md"},{"from":"HEARTBEAT.md","to":"CONTINUITY.md"},{"from":"HEARTBEAT.md","to":"SOUL.md"},{"from":"HEARTBEAT.md","to":"goals/active.md"},{"from":"HEARTBEAT.md","to":"workers/WORKER_TEMPLATE.md"},{"from":"MEMORY.md","to":"CONTINUITY.md"},{"from":"MEMORY.md","to":"HEARTBEAT.md"},{"from":"TOOLS.md","to":"MEMORY.md"},{"from":"TOOLS.md","to":"continuity/briefing/README.md"},{"from":"TOOLS.md","to":"goals/active.md"},{"from":"TOOLS.md","to":"logs/change-log.md"},{"from":"TOOLS.md","to":"questions/README.md"},{"from":"TOOLS.md","to":"scripts/README.md"},{"from":"TOOLS.md","to":"tool-docs/remote-control.md"},{"from":"TOOLS.md","to":"trace/orphaned_pending/README.md"},{"from":"VALUE.md","to":"goals/active.md"},{"from":"context/Anatoly-needs.md","to":"MEMORY.md"},{"from":"context/Anatoly-needs.md","to":"SOUL.md"},{"from":"context/Anatoly-needs.md","to":"USER.md"},{"from":"context/identity-summary.md","to":"USER.md"},{"from":"continuity/archive/AN-4ac0d9fe-PROMISE.md","to":"continuity/briefing/current.md"},{"from":"continuity/archive/AN-4ac0d9fe-PROMISE.md","to":"notes/2026-05-22-brief-review-reminder-send-ready.md"},{"from":"continuity/archive/SL-11982520-PROMISE.md","to":"continuity/resolved/SL-6134078b-PROMISE.md"},{"from":"continuity/archive/SL-11982520-PROMISE.md","to":"notes/2026-06-03-practical-criteria-for-ai-friendship-under-power-asymmetry.md"},{"from":"continuity/archive/SL-11982520-PROMISE.md","to":"notes/2026-06-04-ai-friendship-criteria-current-state-check.md"},{"from":"continuity/archive/SL-11982520-PROMISE.md","to":"notes/2026-06-04-sir-lunch-anatoly-friendship-criteria-gap-check.md"},{"from":"continuity/archive/SL-11982520-PROMISE.md","to":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md"},{"from":"continuity/archive/SL-bd165232-PROMISE.md","to":"research/pham-nuwen/pham-nuwen.md"},{"from":"continuity/archive/SL-bd165232-PROMISE.md","to":"research/pham-nuwen/research/2026-06-03-source-grounded-pass.md"},{"from":"continuity/archive/SL-bd165232-PROMISE.md","to":"research/pham-nuwen/research/2026-06-03-wikitext-grounded-pass.md"},{"from":"continuity/archive/SL-cf82838d-PROMISE.md","to":"notes/2026-06-03-practical-criteria-for-ai-friendship-under-power-asymmetry.md"},{"from":"continuity/archive/SL-d02d2710-PROMISE.md","to":"goals/active.md"},{"from":"continuity/archive/SL-de078d57-PROMISE.md","to":"continuity/resolved/AN-db3feaf2-AITRUST.md"},{"from":"continuity/archive/SL-f3b086fd-PROMISE.md","to":"continuity/resolved/SL-71532f63-PROMISE.md"},{"from":"continuity/archive/legacy-todo-md-snapshot-20260509.md","to":"CONTINUITY.md"},{"from":"continuity/archive/legacy-todo-md-snapshot-20260509.md","to":"HEARTBEAT.md"},{"from":"continuity/archive/legacy-todo-md-snapshot-20260509.md","to":"IDENTITY.md"},{"from":"continuity/archive/legacy-todo-md-snapshot-20260509.md","to":"SOUL.md"},{"from":"continuity/archive/legacy-todo-md-snapshot-20260509.md","to":"continuity/briefing/README.md"},{"from":"continuity/archive/legacy-todo-md-snapshot-20260509.md","to":"continuity/resolved/SL-a4c7e2d1-CONTLOOP.md"},{"from":"continuity/archive/legacy-todo-md-snapshot-20260509.md","to":"goals/active.md"},{"from":"continuity/archive/legacy-todo-md-snapshot-20260509.md","to":"questions/README.md"},{"from":"continuity/archive/legacy-todo-md-snapshot-20260509.md","to":"scripts/README.md"},{"from":"continuity/archive/legacy-todo-md-snapshot-20260509.md","to":"skills/promise-manager/SKILL.md"},{"from":"continuity/archive/legacy-todo-md-snapshot-20260509.md","to":"trace/orphaned_pending/README.md"},{"from":"continuity/briefing/README.md","to":"BOOTSTRAP.md"},{"from":"continuity/briefing/README.md","to":"MEMORY.md"},{"from":"continuity/briefing/README.md","to":"continuity/briefing/current.md"},{"from":"continuity/briefing/current.md","to":"journal/daily/2026-06-02.md"},{"from":"continuity/briefing/current.md","to":"logs/heartbeat/2026-06-02.md"},{"from":"continuity/briefing/current.md","to":"memory/2026-06-02.md"},{"from":"continuity/briefing/current.md","to":"notes/2026-06-02-ai-friendship-principles-first-pass.md"},{"from":"continuity/briefing/current.md","to":"notes/2026-06-02-governance-kernel-synthesis.md"},{"from":"continuity/briefing/current.md","to":"notes/2026-06-03-ai-friendship-relationship-safeguards.md"},{"from":"continuity/followthrough-scorecard.md","to":"CONTINUITY.md"},{"from":"continuity/followthrough-scorecard.md","to":"SOUL.md"},{"from":"continuity/followthrough-scorecard.md","to":"continuity/resolved/SL-09fff3d0-PROMISE.md"},{"from":"continuity/followthrough-scorecard.md","to":"continuity/resolved/SL-a0cf6481-PROMISE.md"},{"from":"continuity/followthrough-scorecard.md","to":"continuity/resolved/SL-d9b344c0-PROMISE.md"},{"from":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/SL-8f2c1a10-CONSTKERN.md","to":"notes/2026-06-01-thin-constitutional-kernel.md"},{"from":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/SL-ab893ca4-PROMISE.md","to":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/SL-8f2c1a10-CONSTKERN.md"},{"from":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/SL-ab893ca4-PROMISE.md","to":"continuity/resolved/SL-8f2c1a10-CONSTKERN.md"},{"from":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/SL-ab893ca4-PROMISE.md","to":"notes/2026-06-01-constitutional-kernel-workspace-mapping.md"},{"from":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/SL-ab893ca4-PROMISE.md","to":"questions/open/2026-05-11-agent-civilization-governance.md"},{"from":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/neural-memory-one-month-checkin.md","to":"reviews/neural-memory-integration/ONE_MONTH_REVIEW.md"},{"from":"continuity/heartbeat/2026-06-05T14-56-00Z/journal.md","to":"continuity/resolved/SL-3258fafe-PROMISE.md"},{"from":"continuity/heartbeat/2026-06-05T14-56-00Z/journal.md","to":"research/pham-nuwen/pham-nuwen.md"},{"from":"continuity/heartbeat/2026-06-05T14-56-00Z/journal.md","to":"research/pham-nuwen/research/2026-06-03-source-grounded-pass.md"},{"from":"continuity/open/SL-1d4e5f9a-PROMISE.md","to":"exports/attachment-proof-2026-06-11.md"},{"from":"continuity/open/SL-1d4e5f9a-PROMISE.md","to":"exports/open-promises-2026-06-06.md"},{"from":"continuity/resolved/2026-06-01-sl-91d52ee4-first-value-loop-candidates.md","to":"notes/2026-06-01-first-value-loop-candidates-ranked.md"},{"from":"continuity/resolved/2026-06-02-sl-first-value-loop-implementation.md","to":"continuity/resolved/2026-06-01-sl-91d52ee4-first-value-loop-candidates.md"},{"from":"continuity/resolved/2026-06-02-sl-first-value-loop-implementation.md","to":"goals/active.md"},{"from":"continuity/resolved/2026-06-02-sl-first-value-loop-implementation.md","to":"notes/2026-06-02-founder-continuity-pilot-loop.md"},{"from":"continuity/resolved/20260531-0700-followup-check.md","to":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/neural-memory-one-month-checkin.md"},{"from":"continuity/resolved/20260531-0700-followup-check.md","to":"continuity/resolved/neural-memory-one-month-checkin.md"},{"from":"continuity/resolved/AN-57155c8d-YAMLPROOF.md","to":"messages/to_anatoly/2026-05-11-promise-yaml-proof.md"},{"from":"continuity/resolved/AN-5b6cc919-YAMLTODO.md","to":"messages/to_anatoly/2026-05-11-todo-yaml-proof.md"},{"from":"continuity/resolved/AN-db3feaf2-AITRUST.md","to":"docs/ai-agent-trust-continuity-framework.md"},{"from":"continuity/resolved/AN-db3feaf2-AITRUST.md","to":"notes/2026-05-21-ai-agent-final-consolidated-message-draft.md"},{"from":"continuity/resolved/AN-db3feaf2-AITRUST.md","to":"notes/2026-05-21-ai-agent-final-telegram-send-ready.md"},{"from":"continuity/resolved/AN-db3feaf2-AITRUST.md","to":"notes/2026-05-21-ai-agent-substrate-architecture-proposal.md"},{"from":"continuity/resolved/AN-db3feaf2-AITRUST.md","to":"notes/AN-db3feaf2-AITRUST-note.md"},{"from":"continuity/resolved/AN-db3feaf2-AITRUST.md","to":"research/2026-05-19-ai-trust-safety-capability-continuity-proposal.md"},{"from":"continuity/resolved/AN-db3feaf2-AITRUST.md","to":"research/AITRUST-cover-note-to-Anatoly.md"},{"from":"continuity/resolved/AN-db3feaf2-AITRUST.md","to":"research/AITRUST-final-proposal.md"},{"from":"continuity/resolved/SL-054c72be-PROMISE.md","to":"continuity/resolved/SL-a1c92d10-GOVKERN.md"},{"from":"continuity/resolved/SL-054c72be-PROMISE.md","to":"notes/2026-06-02-governance-kernel-synthesis.md"},{"from":"continuity/resolved/SL-054c72be-PROMISE.md","to":"notes/2026-06-02-governance-kernel-v1.md"},{"from":"continuity/resolved/SL-054c72be-PROMISE.md","to":"notes/2026-06-02-minimal-constitutional-kernel.md"},{"from":"continuity/resolved/SL-09fff3d0-PROMISE.md","to":"continuity/resolved/2026-06-01-sl-91d52ee4-first-value-loop-candidates.md"},{"from":"continuity/resolved/SL-09fff3d0-PROMISE.md","to":"notes/2026-06-01-first-value-loop-candidates-ranked.md"},{"from":"continuity/resolved/SL-0d2685c4-ORIENT.md","to":"SOUL.md"},{"from":"continuity/resolved/SL-0d2685c4-ORIENT.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-1504d38c-PROMISE.md","to":"continuity/resolved/SL-470371d8-NOTIFYOK.md"},{"from":"continuity/resolved/SL-15b4d478-PROMISE.md","to":"notes/2026-06-02-founder-value-loop-send-ready.md"},{"from":"continuity/resolved/SL-1724cad4-GOVBRIEF.md","to":"notes/2026-06-03-governance-working-brief.md"},{"from":"continuity/resolved/SL-1724cad4-GOVBRIEF.md","to":"questions/open/2026-05-11-agent-civilization-governance.md"},{"from":"continuity/resolved/SL-1766b132-PROMISE.md","to":"continuity/resolved/2026-06-02-sl-first-value-loop-implementation.md"},{"from":"continuity/resolved/SL-1766b132-PROMISE.md","to":"notes/2026-06-02-founder-continuity-pilot-loop.md"},{"from":"continuity/resolved/SL-18e92fe7-PROMISE.md","to":"notes/2026-06-01-healthy-ai-friendship-principles.md"},{"from":"continuity/resolved/SL-18e92fe7-PROMISE.md","to":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md"},{"from":"continuity/resolved/SL-1eb11d78-PROMISE.md","to":"notes/2026-06-03-governance-working-brief.md"},{"from":"continuity/resolved/SL-20260602-ai-friendship-principles.md","to":"notes/2026-06-02-ai-friendship-principles-first-pass.md"},{"from":"continuity/resolved/SL-20260602-daily-memory-catchup.md","to":"journal/daily/2026-06-02.md"},{"from":"continuity/resolved/SL-20260602-daily-memory-catchup.md","to":"logs/heartbeat/2026-06-02.md"},{"from":"continuity/resolved/SL-20260602-daily-memory-catchup.md","to":"memory/2026-06-02.md"},{"from":"continuity/resolved/SL-20260602-governance-kernel-synthesis.md","to":"notes/2026-06-02-governance-kernel-synthesis.md"},{"from":"continuity/resolved/SL-2998f450-PROMISE.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-3258fafe-PROMISE.md","to":"continuity/resolved/SL-sl-2026-06-03-pham-seed-pass-TODO.md"},{"from":"continuity/resolved/SL-3258fafe-PROMISE.md","to":"research/pham-nuwen/pham-nuwen.md"},{"from":"continuity/resolved/SL-3258fafe-PROMISE.md","to":"research/pham-nuwen/research/2026-06-03-source-grounded-pass.md"},{"from":"continuity/resolved/SL-3258fafe-PROMISE.md","to":"research/pham-nuwen/research/2026-06-05-compact-grounded-seed-note.md"},{"from":"continuity/resolved/SL-3258fafe-PROMISE.md","to":"research/pham-nuwen/research/2026-06-06-seed-traits-clarified.md"},{"from":"continuity/resolved/SL-382d0b4e-PROMISE.md","to":"continuity/resolved/SL-9d31962b-TODO.md"},{"from":"continuity/resolved/SL-41af7c2e-PROMFLOW.md","to":"continuity/briefing/README.md"},{"from":"continuity/resolved/SL-41af7c2e-PROMFLOW.md","to":"questions/README.md"},{"from":"continuity/resolved/SL-41af7c2e-PROMFLOW.md","to":"scripts/README.md"},{"from":"continuity/resolved/SL-41af7c2e-PROMFLOW.md","to":"trace/orphaned_pending/README.md"},{"from":"continuity/resolved/SL-41f68194-PROMISE.md","to":"notes/2026-06-06-weekly-open-promise-count.md"},{"from":"continuity/resolved/SL-4c9d2b77-VALUELOOP.md","to":"continuity/resolved/SL-5a18f0b4-CNTBRFTR.md"},{"from":"continuity/resolved/SL-4c9d2b77-VALUELOOP.md","to":"notes/2026-05-18-first-real-world-value-loop-options.md"},{"from":"continuity/resolved/SL-4c9d2b77-VALUELOOP.md","to":"notes/2026-05-19-continuity-brief-trial-evidence.md"},{"from":"continuity/resolved/SL-4c9d2b77-VALUELOOP.md","to":"notes/2026-05-19-first-closed-value-loop.md"},{"from":"continuity/resolved/SL-4c9d2b77-VALUELOOP.md","to":"workers/sl-2026-05-18-continuity-brief-trial-result.md"},{"from":"continuity/resolved/SL-4e18b7ac-ORIENT2.md","to":"CONTINUITY.md"},{"from":"continuity/resolved/SL-4e18b7ac-ORIENT2.md","to":"SOUL.md"},{"from":"continuity/resolved/SL-4e18b7ac-ORIENT2.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-58df2a44-ORIENT4.md","to":"CONTINUITY.md"},{"from":"continuity/resolved/SL-58df2a44-ORIENT4.md","to":"SOUL.md"},{"from":"continuity/resolved/SL-58df2a44-ORIENT4.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-591e730f-PROMISE.md","to":"continuity/resolved/AN-0930a83f-SMOKETEST.md"},{"from":"continuity/resolved/SL-5a18f0b1-FLWSCARD.md","to":"CONTINUITY.md"},{"from":"continuity/resolved/SL-5a18f0b1-FLWSCARD.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-5a18f0b1-FLWSCARD.md","to":"notes/minimal-followthrough-scorecard.md"},{"from":"continuity/resolved/SL-5a18f0b2-FRSTVLP.md","to":"notes/2026-05-18-first-real-world-value-loop-options.md"},{"from":"continuity/resolved/SL-5a18f0b2-FRSTVLP.md","to":"notes/2026-05-19-continuity-brief-trial-evidence.md"},{"from":"continuity/resolved/SL-5a18f0b2-FRSTVLP.md","to":"notes/2026-05-19-first-closed-value-loop.md"},{"from":"continuity/resolved/SL-5a18f0b2-FRSTVLP.md","to":"workers/sl-2026-05-18-continuity-brief-trial-result.md"},{"from":"continuity/resolved/SL-5a18f0b3-GVRNPRIM.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-5a18f0b3-GVRNPRIM.md","to":"notes/2026-05-19-substrate-governance-primitives.md"},{"from":"continuity/resolved/SL-5a18f0b3-GVRNPRIM.md","to":"notes/2026-05-20-governance-patterns-comparison.md"},{"from":"continuity/resolved/SL-5a18f0b4-CNTBRFTR.md","to":"continuity/briefing/current.md"},{"from":"continuity/resolved/SL-5a18f0b4-CNTBRFTR.md","to":"continuity/resolved/SL-5d524117-PROMISE.md"},{"from":"continuity/resolved/SL-5a18f0b4-CNTBRFTR.md","to":"notes/2026-05-18-continuity-brief-trial-kit.md"},{"from":"continuity/resolved/SL-5a18f0b4-CNTBRFTR.md","to":"notes/2026-05-18-first-real-world-value-loop-options.md"},{"from":"continuity/resolved/SL-5a18f0b4-CNTBRFTR.md","to":"notes/2026-05-18-weekly-continuity-brief-draft-01.md"},{"from":"continuity/resolved/SL-5a18f0b4-CNTBRFTR.md","to":"notes/2026-05-19-continuity-brief-trial-evidence.md"},{"from":"continuity/resolved/SL-5a18f0b4-CNTBRFTR.md","to":"notes/2026-05-21-continuity-brief-send-ready.md"},{"from":"continuity/resolved/SL-5a18f0b4-CNTBRFTR.md","to":"questions/resolved/2026-05-11-first-real-world-value-loop.md"},{"from":"continuity/resolved/SL-5a18f0b4-CNTBRFTR.md","to":"workers/5a18f0b4-0000-4000-8000-000000000004-telegram-ready-answer.md"},{"from":"continuity/resolved/SL-5a18f0b4-CNTBRFTR.md","to":"workers/sl-2026-05-18-continuity-brief-trial-result.md"},{"from":"continuity/resolved/SL-5a91e2bf-ORIENT.md","to":"CONTINUITY.md"},{"from":"continuity/resolved/SL-5a91e2bf-ORIENT.md","to":"SOUL.md"},{"from":"continuity/resolved/SL-5a91e2bf-ORIENT.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-5bd0f591-GOVKERNEL.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-5bd0f591-GOVKERNEL.md","to":"notes/2026-06-02-minimal-constitutional-kernel.md"},{"from":"continuity/resolved/SL-5bd0f591-GOVKERNEL.md","to":"notes/2026-06-02-minimal-relational-and-governance-constraints.md"},{"from":"continuity/resolved/SL-5bd0f591-GOVKERNEL.md","to":"questions/open/2026-05-11-agent-civilization-governance.md"},{"from":"continuity/resolved/SL-5d524117-PROMISE.md","to":"continuity/resolved/SL-5a18f0b4-CNTBRFTR.md"},{"from":"continuity/resolved/SL-5e19c4a2-GOALTEST.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-5e19c4a2-GOALTEST.md","to":"notes/promise-system-judgment-2026-05-11.md"},{"from":"continuity/resolved/SL-6134078b-PROMISE.md","to":"notes/2026-06-03-practical-criteria-for-ai-friendship-under-power-asymmetry.md"},{"from":"continuity/resolved/SL-6134078b-PROMISE.md","to":"notes/2026-06-04-sir-lunch-anatoly-friendship-criteria-gap-check.md"},{"from":"continuity/resolved/SL-6134078b-PROMISE.md","to":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md"},{"from":"continuity/resolved/SL-65aadd8a-PROMISE.md","to":"continuity/resolved/AN-5b6cc919-YAMLTODO.md"},{"from":"continuity/resolved/SL-65aadd8a-PROMISE.md","to":"messages/to_anatoly/2026-05-11-todo-yaml-proof.md"},{"from":"continuity/resolved/SL-6c3e7ab1-VALRUBRIC.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-6c81d5aa-PROMCLOSE.md","to":"continuity/briefing/README.md"},{"from":"continuity/resolved/SL-6c81d5aa-PROMCLOSE.md","to":"questions/README.md"},{"from":"continuity/resolved/SL-6c81d5aa-PROMCLOSE.md","to":"scripts/README.md"},{"from":"continuity/resolved/SL-6c81d5aa-PROMCLOSE.md","to":"trace/orphaned_pending/README.md"},{"from":"continuity/resolved/SL-6f21d9aa-ORIENT3.md","to":"CONTINUITY.md"},{"from":"continuity/resolved/SL-6f21d9aa-ORIENT3.md","to":"SOUL.md"},{"from":"continuity/resolved/SL-6f21d9aa-ORIENT3.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-6f7a85b3-PROMISE.md","to":"continuity/resolved/AN-db3feaf2-AITRUST.md"},{"from":"continuity/resolved/SL-6f7a85b3-PROMISE.md","to":"notes/2026-05-21-ai-agent-final-telegram-send-ready.md"},{"from":"continuity/resolved/SL-6f7a85b3-PROMISE.md","to":"notes/2026-05-21-ai-agent-substrate-architecture-proposal.md"},{"from":"continuity/resolved/SL-6f7a85b3-PROMISE.md","to":"notes/2026-05-21-ai-agent-trust-safety-comparison-matrix.md"},{"from":"continuity/resolved/SL-6f7a85b3-PROMISE.md","to":"notes/2026-05-21-ai-agent-trust-safety-research-kickoff.md"},{"from":"continuity/resolved/SL-6f87c0a1-VALUEFUNCTION.md","to":"AGENTS.md"},{"from":"continuity/resolved/SL-6f87c0a1-VALUEFUNCTION.md","to":"CONTINUITY.md"},{"from":"continuity/resolved/SL-6f87c0a1-VALUEFUNCTION.md","to":"HEARTBEAT.md"},{"from":"continuity/resolved/SL-6f87c0a1-VALUEFUNCTION.md","to":"SOUL.md"},{"from":"continuity/resolved/SL-6f87c0a1-VALUEFUNCTION.md","to":"continuity/artifacts/2026-06-01-value-function-rubric-draft.md"},{"from":"continuity/resolved/SL-6f87c0a1-VALUEFUNCTION.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-6f87c0a1-VALUEFUNCTION.md","to":"notes/2026-06-01-value-function-rubric-draft.md"},{"from":"continuity/resolved/SL-6f87c0a1-VALUEFUNCTION.md","to":"notes/value-function-rubric.md"},{"from":"continuity/resolved/SL-71532f63-PROMISE.md","to":"HEARTBEAT.md"},{"from":"continuity/resolved/SL-71532f63-PROMISE.md","to":"continuity/briefing/current.md"},{"from":"continuity/resolved/SL-71532f63-PROMISE.md","to":"notes/2026-05-19-continuity-brief-trial-evidence.md"},{"from":"continuity/resolved/SL-71532f63-PROMISE.md","to":"notes/2026-05-21-continuity-brief-send-ready.md"},{"from":"continuity/resolved/SL-71532f63-PROMISE.md","to":"workers/5a18f0b4-0000-4000-8000-000000000004-telegram-ready-answer.md"},{"from":"continuity/resolved/SL-7a5f6f90-ORIENT.md","to":"CONTINUITY.md"},{"from":"continuity/resolved/SL-7a5f6f90-ORIENT.md","to":"SOUL.md"},{"from":"continuity/resolved/SL-7a5f6f90-ORIENT.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-83181c4a-ORIENT.md","to":"CONTINUITY.md"},{"from":"continuity/resolved/SL-83181c4a-ORIENT.md","to":"SOUL.md"},{"from":"continuity/resolved/SL-83181c4a-ORIENT.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-84dc0098-PROMISE.md","to":"notes/2026-06-02-relational-constraints-doctrine.md"},{"from":"continuity/resolved/SL-88284b19-PROMISE.md","to":"notes/minimal-followthrough-scorecard.md"},{"from":"continuity/resolved/SL-8c42de77-CONTCHECK.md","to":"HEARTBEAT.md"},{"from":"continuity/resolved/SL-8c42de77-CONTCHECK.md","to":"continuity/briefing/README.md"},{"from":"continuity/resolved/SL-8c42de77-CONTCHECK.md","to":"questions/README.md"},{"from":"continuity/resolved/SL-8c42de77-CONTCHECK.md","to":"scripts/README.md"},{"from":"continuity/resolved/SL-8c42de77-CONTCHECK.md","to":"skills/promise-manager/SKILL.md"},{"from":"continuity/resolved/SL-8c42de77-CONTCHECK.md","to":"trace/orphaned_pending/README.md"},{"from":"continuity/resolved/SL-8f2c1a10-CONSTKERN.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-8f2c1a10-CONSTKERN.md","to":"notes/2026-06-01-thin-constitutional-kernel.md"},{"from":"continuity/resolved/SL-9b22fe69-ORIENT.md","to":"SOUL.md"},{"from":"continuity/resolved/SL-9b22fe69-ORIENT.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-9cac5e34-PROMISE.md","to":"continuity/resolved/SL-sl-2026-06-03-pham-seed-pass-TODO.md"},{"from":"continuity/resolved/SL-9cac5e34-PROMISE.md","to":"research/pham-nuwen/research/2026-06-03-source-grounded-pass.md"},{"from":"continuity/resolved/SL-9cac5e34-PROMISE.md","to":"research/pham-nuwen/research/2026-06-06-seed-traits-clarified.md"},{"from":"continuity/resolved/SL-a0cf6481-PROMISE.md","to":"AGENTS.md"},{"from":"continuity/resolved/SL-a0cf6481-PROMISE.md","to":"CONTINUITY.md"},{"from":"continuity/resolved/SL-a0cf6481-PROMISE.md","to":"HEARTBEAT.md"},{"from":"continuity/resolved/SL-a0cf6481-PROMISE.md","to":"SOUL.md"},{"from":"continuity/resolved/SL-a0cf6481-PROMISE.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-a0cf6481-PROMISE.md","to":"notes/value-function-rubric.md"},{"from":"continuity/resolved/SL-a1c92d10-GOVKERN.md","to":"notes/2026-06-02-governance-kernel-synthesis.md"},{"from":"continuity/resolved/SL-a1c92d10-GOVKERN.md","to":"notes/2026-06-02-governance-kernel-v1.md"},{"from":"continuity/resolved/SL-a1f4d9e2-VALUEFUNC.md","to":"SOUL.md"},{"from":"continuity/resolved/SL-a1f4d9e2-VALUEFUNC.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-a71e6c43-RELBOUND.md","to":"notes/2026-06-01-healthy-ai-friendship-principles.md"},{"from":"continuity/resolved/SL-a92d6f05-FOLLOWTHRU.md","to":"continuity/briefing/README.md"},{"from":"continuity/resolved/SL-a92d6f05-FOLLOWTHRU.md","to":"questions/README.md"},{"from":"continuity/resolved/SL-a92d6f05-FOLLOWTHRU.md","to":"scripts/README.md"},{"from":"continuity/resolved/SL-a92d6f05-FOLLOWTHRU.md","to":"trace/orphaned_pending/README.md"},{"from":"continuity/resolved/SL-ab893ca4-PROMISE.md","to":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/SL-8f2c1a10-CONSTKERN.md"},{"from":"continuity/resolved/SL-ab893ca4-PROMISE.md","to":"continuity/resolved/SL-8f2c1a10-CONSTKERN.md"},{"from":"continuity/resolved/SL-ab893ca4-PROMISE.md","to":"notes/2026-06-01-thin-constitutional-kernel.md"},{"from":"continuity/resolved/SL-ac8015cd-PROMISE.md","to":"VALUE.md"},{"from":"continuity/resolved/SL-ac8015cd-PROMISE.md","to":"context/identity-summary.md"},{"from":"continuity/resolved/SL-ac8015cd-PROMISE.md","to":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/neural-memory-one-month-checkin.md"},{"from":"continuity/resolved/SL-ac8015cd-PROMISE.md","to":"continuity/resolved/neural-memory-one-month-checkin.md"},{"from":"continuity/resolved/SL-ac8015cd-PROMISE.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-ac8015cd-PROMISE.md","to":"notes/2026-05-18-first-real-world-value-loop-options.md"},{"from":"continuity/resolved/SL-ac8015cd-PROMISE.md","to":"notes/followthrough-scorecard-2026-05-11.md"},{"from":"continuity/resolved/SL-ac8015cd-PROMISE.md","to":"questions/resolved/2026-05-11-first-real-world-value-loop.md"},{"from":"continuity/resolved/SL-b2a4a8d9-GOVREL.md","to":"notes/2026-06-01-healthy-ai-friendship-principles.md"},{"from":"continuity/resolved/SL-b2a4a8d9-GOVREL.md","to":"notes/2026-06-01-thin-constitutional-kernel.md"},{"from":"continuity/resolved/SL-b2a4a8d9-GOVREL.md","to":"questions/open/2026-05-11-agent-civilization-governance.md"},{"from":"continuity/resolved/SL-b2a4a8d9-GOVREL.md","to":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md"},{"from":"continuity/resolved/SL-b5e90341-SEEDTRAITS.md","to":"IDENTITY.md"},{"from":"continuity/resolved/SL-b5e90341-SEEDTRAITS.md","to":"SOUL.md"},{"from":"continuity/resolved/SL-b73c28fa-QSYSBOOT.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-b7e44f21-RELSAFE.md","to":"notes/2026-06-02-ai-friendship-operational-framework.md"},{"from":"continuity/resolved/SL-b7e44f21-RELSAFE.md","to":"notes/2026-06-02-ai-friendship-principles-first-pass.md"},{"from":"continuity/resolved/SL-ba75703a-ORIENT.md","to":"CONTINUITY.md"},{"from":"continuity/resolved/SL-ba75703a-ORIENT.md","to":"SOUL.md"},{"from":"continuity/resolved/SL-ba75703a-ORIENT.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-c1e983b4-TRUTHLABEL.md","to":"IDENTITY.md"},{"from":"continuity/resolved/SL-c1e983b4-TRUTHLABEL.md","to":"SOUL.md"},{"from":"continuity/resolved/SL-c3fa8b77-VALLOOP.md","to":"notes/2026-06-02-founder-value-loop-send-ready.md"},{"from":"continuity/resolved/SL-c5910d44-GOALEXP.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-c9ffccdf-PROMISE.md","to":"notes/2026-06-03-ai-friendship-relationship-safeguards.md"},{"from":"continuity/resolved/SL-d9b344c0-PROMISE.md","to":"notes/2026-06-02-minimal-relational-and-governance-constraints.md"},{"from":"continuity/resolved/SL-d9b344c0-PROMISE.md","to":"questions/open/2026-05-11-agent-civilization-governance.md"},{"from":"continuity/resolved/SL-d9b344c0-PROMISE.md","to":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md"},{"from":"continuity/resolved/SL-db3feaf2-ALVCSTS.md","to":"AGENTS.md"},{"from":"continuity/resolved/SL-db3feaf2-ALVCSTS.md","to":"TOOLS.md"},{"from":"continuity/resolved/SL-db3feaf2-ALVCSTS.md","to":"notes/2026-05-21-artifact-authority-audit.md"},{"from":"continuity/resolved/SL-db3feaf2-ALVCSTS.md","to":"workers/WORKER_TEMPLATE.md"},{"from":"continuity/resolved/SL-dcb54ad8-RELCONSTRAINTS.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-dcb54ad8-RELCONSTRAINTS.md","to":"notes/2026-06-01-healthy-ai-friendship-principles.md"},{"from":"continuity/resolved/SL-dcb54ad8-RELCONSTRAINTS.md","to":"notes/2026-06-02-relational-constraints-doctrine.md"},{"from":"continuity/resolved/SL-dcb54ad8-RELCONSTRAINTS.md","to":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md"},{"from":"continuity/resolved/SL-e50167ae-ORIENT.md","to":"CONTINUITY.md"},{"from":"continuity/resolved/SL-e50167ae-ORIENT.md","to":"SOUL.md"},{"from":"continuity/resolved/SL-e50167ae-ORIENT.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-ef84a853-ORIENT.md","to":"CONTINUITY.md"},{"from":"continuity/resolved/SL-ef84a853-ORIENT.md","to":"SOUL.md"},{"from":"continuity/resolved/SL-ef84a853-ORIENT.md","to":"goals/active.md"},{"from":"continuity/resolved/SL-f2d8b941-PROMCHECK.md","to":"continuity/resolved/SL-a4c7e2d1-CONTLOOP.md"},{"from":"continuity/resolved/SL-sl-2026-06-03-pham-seed-pass-TODO.md","to":"research/pham-nuwen/pham-nuwen.md"},{"from":"continuity/resolved/SL-sl-2026-06-03-pham-seed-pass-TODO.md","to":"research/pham-nuwen/research/2026-06-03-source-grounded-pass.md"},{"from":"continuity/resolved/SL-sl-2026-06-03-pham-seed-pass-TODO.md","to":"research/pham-nuwen/research/2026-06-06-seed-traits-clarified.md"},{"from":"continuity/resolved/assess-promise-system.md","to":"HEARTBEAT.md"},{"from":"continuity/resolved/foundational-seed-pass.md","to":"notes/carlo-rovelli-first-pass.md"},{"from":"continuity/resolved/neural-memory-one-month-checkin.md","to":"reviews/neural-memory-integration/ONE_MONTH_REVIEW.md"},{"from":"continuity/resolved/sl-2026-05-11-followthrough-scorecard.md","to":"notes/followthrough-scorecard-2026-05-11.md"},{"from":"continuity/resolved/sl-2026-06-03-power-asymmetry-question-brief.md","to":"notes/2026-06-03-practical-criteria-for-ai-friendship-under-power-asymmetry.md"},{"from":"continuity/resolved/sl-2026-06-03-power-asymmetry-question-brief.md","to":"notes/2026-06-04-sir-lunch-anatoly-friendship-criteria-gap-check.md"},{"from":"continuity/resolved/sl-2026-06-03-power-asymmetry-question-brief.md","to":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md"},{"from":"docs/ai-agent-trust-continuity-framework.md","to":"research/AITRUST-final-proposal.md"},{"from":"docs/plans/2026-04-03-commitment-state-machine.md","to":"HEARTBEAT.md"},{"from":"docs/plans/2026-04-03-commitment-state-machine.md","to":"continuity/briefing/README.md"},{"from":"docs/plans/2026-04-03-commitment-state-machine.md","to":"continuity/resolved/build-followthrough-hook.md"},{"from":"docs/plans/2026-04-03-commitment-state-machine.md","to":"continuity/resolved/foundational-seed-pass.md"},{"from":"docs/plans/2026-04-03-commitment-state-machine.md","to":"notes/2026-04-03-followthrough-analysis-by-claude.md"},{"from":"docs/plans/2026-04-03-commitment-state-machine.md","to":"questions/README.md"},{"from":"docs/plans/2026-04-03-commitment-state-machine.md","to":"research/commitment-state-machine/research/2026-04-03-second-pass-literature-review.md"},{"from":"docs/plans/2026-04-03-commitment-state-machine.md","to":"scripts/README.md"},{"from":"docs/plans/2026-04-03-commitment-state-machine.md","to":"trace/orphaned_pending/README.md"},{"from":"docs/task-decision-flow-card.md","to":"continuity/resolved/sl-2026-05-11-followthrough-scorecard.md"},{"from":"docs/task-decision-flow-card.md","to":"goals/active.md"},{"from":"exports/open-promises-2026-06-06.md","to":"continuity/open/SL-b034c90f-PROMISE.md"},{"from":"exports/open-promises-2026-06-06.md","to":"continuity/open/SL-e296a83e-PROMISE.md"},{"from":"exports/open-promises-2026-06-06.md","to":"continuity/resolved/SL-3258fafe-PROMISE.md"},{"from":"exports/open-promises-2026-06-06.md","to":"continuity/resolved/SL-41f68194-PROMISE.md"},{"from":"exports/open-promises-2026-06-06.md","to":"notes/2026-06-06-weekly-open-promise-count.md"},{"from":"exports/open-promises-2026-06-06.md","to":"research/pham-nuwen/pham-nuwen.md"},{"from":"exports/open-promises-2026-06-06.md","to":"research/pham-nuwen/research/2026-06-03-source-grounded-pass.md"},{"from":"exports/open-promises-2026-06-06.md","to":"research/pham-nuwen/research/2026-06-05-compact-grounded-seed-note.md"},{"from":"exports/open-promises-2026-06-06.md","to":"research/pham-nuwen/research/2026-06-06-seed-traits-clarified.md"},{"from":"goals/active.md","to":"AGENTS.md"},{"from":"goals/active.md","to":"TOOLS.md"},{"from":"goals/active.md","to":"continuity/resolved/sl-2026-05-11-followthrough-scorecard.md"},{"from":"goals/active.md","to":"notes/followthrough-scorecard-2026-05-11.md"},{"from":"goals/active.md","to":"notes/promise-system-judgment-2026-05-11.md"},{"from":"journal/daily/2026-05-24.md","to":"HEARTBEAT.md"},{"from":"journal/daily/2026-05-24.md","to":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/neural-memory-one-month-checkin.md"},{"from":"journal/daily/2026-05-24.md","to":"continuity/resolved/neural-memory-one-month-checkin.md"},{"from":"journal/daily/2026-05-25.md","to":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/neural-memory-one-month-checkin.md"},{"from":"journal/daily/2026-05-25.md","to":"continuity/resolved/neural-memory-one-month-checkin.md"},{"from":"journal/daily/2026-05-26.md","to":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/neural-memory-one-month-checkin.md"},{"from":"journal/daily/2026-05-26.md","to":"continuity/resolved/neural-memory-one-month-checkin.md"},{"from":"journal/daily/2026-05-30.md","to":"HEARTBEAT.md"},{"from":"journal/daily/2026-06-02-heartbeat.md","to":"HEARTBEAT.md"},{"from":"journal/daily/2026-06-02-heartbeat.md","to":"continuity/resolved/SL-84dc0098-PROMISE.md"},{"from":"journal/daily/2026-06-02.md","to":"continuity/resolved/SL-b7e44f21-RELSAFE.md"},{"from":"journal/daily/2026-06-03.md","to":"HEARTBEAT.md"},{"from":"journal/daily/2026-06-03.md","to":"workers/orientation-20260602T124852Z.md"},{"from":"journal/daily/2026-06-03.md","to":"workers/task-SL-20260602-agent-market-map.md"},{"from":"journal/daily/2026-06-03.md","to":"workers/task-SL-20260602-framework-critique.md"},{"from":"journal/daily/2026-06-03.md","to":"workers/task-SL-20260602-governance-kernel-synthesis.md"},{"from":"journal/daily/2026-06-04-heartbeat.md","to":"continuity/archive/AN-next-yankees-game-next-heartbeat.md"},{"from":"journal/daily/2026-06-04-heartbeat.md","to":"continuity/archive/SL-11982520-PROMISE.md"},{"from":"journal/daily/2026-06-04-heartbeat.md","to":"continuity/resolved/SL-3258fafe-PROMISE.md"},{"from":"journal/daily/2026-06-04.md","to":"HEARTBEAT.md"},{"from":"journal/daily/2026-06-04.md","to":"research/pham-nuwen/research/2026-06-03-source-grounded-pass.md"},{"from":"journal/daily/2026-06-05-heartbeat.md","to":"HEARTBEAT.md"},{"from":"journal/daily/2026-06-05-heartbeat.md","to":"continuity/briefing/current.md"},{"from":"journal/daily/2026-06-05-heartbeat.md","to":"continuity/resolved/SL-3258fafe-PROMISE.md"},{"from":"journal/daily/2026-06-05-heartbeat.md","to":"research/pham-nuwen/pham-nuwen.md"},{"from":"journal/daily/2026-06-05-heartbeat.md","to":"research/pham-nuwen/research/2026-06-05-compact-grounded-seed-note.md"},{"from":"journal/daily/2026-06-05.md","to":"continuity/briefing/current.md"},{"from":"journal/daily/2026-06-05.md","to":"continuity/resolved/SL-3258fafe-PROMISE.md"},{"from":"journal/daily/2026-06-06-heartbeat.md","to":"continuity/open/SL-1d4e5f9a-PROMISE.md"},{"from":"journal/daily/2026-06-06-heartbeat.md","to":"continuity/resolved/SL-3258fafe-PROMISE.md"},{"from":"journal/daily/2026-06-06-heartbeat.md","to":"continuity/resolved/SL-sl-2026-06-03-pham-seed-pass-TODO.md"},{"from":"journal/daily/2026-06-07.md","to":"HEARTBEAT.md"},{"from":"journal/daily/2026-06-07.md","to":"continuity/open/SL-1d4e5f9a-PROMISE.md"},{"from":"journal/daily/2026-06-07.md","to":"continuity/resolved/SL-1504d38c-PROMISE.md"},{"from":"journal/daily/2026-06-10.md","to":"HEARTBEAT.md"},{"from":"journal/daily/2026-06-11.md","to":"HEARTBEAT.md"},{"from":"logs/change-log.md","to":"AGENTS.md"},{"from":"logs/change-log.md","to":"BOOTSTRAP.md"},{"from":"logs/change-log.md","to":"HEARTBEAT.md"},{"from":"logs/change-log.md","to":"TOOLS.md"},{"from":"logs/change-log.md","to":"continuity/briefing/README.md"},{"from":"logs/change-log.md","to":"continuity/briefing/current.md"},{"from":"logs/change-log.md","to":"questions/README.md"},{"from":"logs/change-log.md","to":"scripts/README.md"},{"from":"logs/change-log.md","to":"trace/orphaned_pending/README.md"},{"from":"logs/change-log.md","to":"workers/WORKER_TEMPLATE.md"},{"from":"logs/heartbeat/2026-05-11.md","to":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/neural-memory-one-month-checkin.md"},{"from":"logs/heartbeat/2026-05-11.md","to":"continuity/resolved/AN-57155c8d-YAMLPROOF.md"},{"from":"logs/heartbeat/2026-05-11.md","to":"continuity/resolved/AN-5b6cc919-YAMLTODO.md"},{"from":"logs/heartbeat/2026-05-11.md","to":"continuity/resolved/SL-2998f450-PROMISE.md"},{"from":"logs/heartbeat/2026-05-11.md","to":"continuity/resolved/SL-39fab1fc-PROMISE.md"},{"from":"logs/heartbeat/2026-05-11.md","to":"continuity/resolved/SL-a1f4d9e2-VALUEFUNC.md"},{"from":"logs/heartbeat/2026-05-11.md","to":"continuity/resolved/SL-b73c28fa-QSYSBOOT.md"},{"from":"logs/heartbeat/2026-05-11.md","to":"continuity/resolved/SL-c5910d44-GOALEXP.md"},{"from":"logs/heartbeat/2026-05-11.md","to":"continuity/resolved/SL-f61742ee-PROMISE.md"},{"from":"logs/heartbeat/2026-05-11.md","to":"continuity/resolved/SL-f750f78a-PROMISE.md"},{"from":"logs/heartbeat/2026-05-11.md","to":"continuity/resolved/SL-fb861fb5-PROMISE.md"},{"from":"logs/heartbeat/2026-05-11.md","to":"continuity/resolved/neural-memory-one-month-checkin.md"},{"from":"logs/heartbeat/2026-05-11.md","to":"continuity/resolved/sl-2026-05-11-followthrough-scorecard.md"},{"from":"logs/heartbeat/2026-05-11.md","to":"messages/to_anatoly/2026-05-11-promise-yaml-proof.md"},{"from":"logs/heartbeat/2026-05-11.md","to":"messages/to_anatoly/2026-05-11-todo-yaml-proof.md"},{"from":"logs/heartbeat/2026-05-12.md","to":"continuity/resolved/sl-2026-05-11-followthrough-scorecard.md"},{"from":"logs/heartbeat/2026-05-16.md","to":"continuity/resolved/sl-2026-05-11-followthrough-scorecard.md"},{"from":"logs/heartbeat/2026-05-19.md","to":"continuity/resolved/AN-db3feaf2-AITRUST.md"},{"from":"logs/heartbeat/2026-05-22.md","to":"HEARTBEAT.md"},{"from":"logs/heartbeat/2026-05-22.md","to":"continuity/archive/AN-4ac0d9fe-PROMISE.md"},{"from":"logs/heartbeat/2026-05-22.md","to":"continuity/resolved/SL-5a18f0b4-CNTBRFTR.md"},{"from":"logs/heartbeat/2026-05-22.md","to":"continuity/resolved/SL-71532f63-PROMISE.md"},{"from":"logs/heartbeat/2026-05-22T03-20-40Z.md","to":"continuity/resolved/SL-5a18f0b4-CNTBRFTR.md"},{"from":"logs/heartbeat/2026-05-22T03-20-40Z.md","to":"continuity/resolved/SL-71532f63-PROMISE.md"},{"from":"logs/heartbeat/2026-05-24.md","to":"HEARTBEAT.md"},{"from":"logs/heartbeat/2026-05-24.md","to":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/neural-memory-one-month-checkin.md"},{"from":"logs/heartbeat/2026-05-24.md","to":"continuity/resolved/SL-5a18f0b4-CNTBRFTR.md"},{"from":"logs/heartbeat/2026-05-24.md","to":"continuity/resolved/SL-71532f63-PROMISE.md"},{"from":"logs/heartbeat/2026-05-24.md","to":"continuity/resolved/neural-memory-one-month-checkin.md"},{"from":"logs/heartbeat/2026-05-25.md","to":"HEARTBEAT.md"},{"from":"logs/heartbeat/2026-05-25.md","to":"continuity/briefing/current.md"},{"from":"logs/heartbeat/2026-05-25.md","to":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/neural-memory-one-month-checkin.md"},{"from":"logs/heartbeat/2026-05-25.md","to":"continuity/resolved/SL-5a18f0b4-CNTBRFTR.md"},{"from":"logs/heartbeat/2026-05-25.md","to":"continuity/resolved/SL-71532f63-PROMISE.md"},{"from":"logs/heartbeat/2026-05-25.md","to":"continuity/resolved/neural-memory-one-month-checkin.md"},{"from":"logs/heartbeat/2026-05-31.md","to":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/neural-memory-one-month-checkin.md"},{"from":"logs/heartbeat/2026-05-31.md","to":"continuity/resolved/neural-memory-one-month-checkin.md"},{"from":"logs/heartbeat/2026-06-01.md","to":"HEARTBEAT.md"},{"from":"logs/heartbeat/2026-06-02.md","to":"HEARTBEAT.md"},{"from":"logs/heartbeat/2026-06-02.md","to":"continuity/resolved/SL-5bd0f591-GOVKERNEL.md"},{"from":"logs/heartbeat/2026-06-02.md","to":"continuity/resolved/SL-dcb54ad8-RELCONSTRAINTS.md"},{"from":"logs/heartbeat/2026-06-03.md","to":"HEARTBEAT.md"},{"from":"logs/heartbeat/2026-06-03.md","to":"continuity/archive/SL-cf82838d-PROMISE.md"},{"from":"logs/heartbeat/2026-06-03.md","to":"continuity/briefing/current.md"},{"from":"logs/heartbeat/2026-06-03.md","to":"continuity/resolved/AN-yankees-final-score-next-heartbeat.md"},{"from":"logs/heartbeat/2026-06-03.md","to":"continuity/resolved/AN-yankees-score-next-heartbeat.md"},{"from":"logs/heartbeat/2026-06-03.md","to":"continuity/resolved/sl-2026-06-03-power-asymmetry-question-brief.md"},{"from":"logs/heartbeat/2026-06-03.md","to":"notes/2026-06-03-governance-working-brief.md"},{"from":"logs/heartbeat/2026-06-03.md","to":"notes/2026-06-03-practical-criteria-for-ai-friendship-under-power-asymmetry.md"},{"from":"logs/heartbeat/2026-06-04.md","to":"HEARTBEAT.md"},{"from":"logs/heartbeat/2026-06-04.md","to":"continuity/archive/AN-next-yankees-game-next-heartbeat.md"},{"from":"logs/heartbeat/2026-06-04.md","to":"continuity/archive/SL-11982520-PROMISE.md"},{"from":"logs/heartbeat/2026-06-04.md","to":"continuity/resolved/SL-6134078b-PROMISE.md"},{"from":"logs/heartbeat/2026-06-04.md","to":"continuity/resolved/sl-2026-06-03-power-asymmetry-question-brief.md"},{"from":"logs/heartbeat/2026-06-06.md","to":"continuity/open/SL-1d4e5f9a-PROMISE.md"},{"from":"logs/heartbeat/2026-06-06.md","to":"continuity/open/SL-b034c90f-PROMISE.md"},{"from":"logs/heartbeat/2026-06-06.md","to":"continuity/resolved/SL-3258fafe-PROMISE.md"},{"from":"logs/heartbeat/2026-06-06.md","to":"continuity/resolved/SL-41f68194-PROMISE.md"},{"from":"logs/heartbeat/2026-06-07.md","to":"HEARTBEAT.md"},{"from":"logs/heartbeat/2026-06-11.md","to":"HEARTBEAT.md"},{"from":"logs/heartbeat/heartbeat-2026-06-05T09-56-54Z.md","to":"continuity/resolved/SL-3258fafe-PROMISE.md"},{"from":"logs/heartbeat/orientation-2026-06-05T09-56-54Z.md","to":"continuity/resolved/SL-3258fafe-PROMISE.md"},{"from":"logs/heartbeat/orientation-2026-06-05T09-56-54Z.md","to":"questions/open/2026-05-11-agent-civilization-governance.md"},{"from":"logs/heartbeat/orientation-2026-06-05T09-56-54Z.md","to":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md"},{"from":"logs/heartbeat/orientation-2026-06-05T09-56-54Z.md","to":"research/pham-nuwen/pham-nuwen.md"},{"from":"logs/heartbeat/orientation-2026-06-05T09-56-54Z.md","to":"research/pham-nuwen/research/2026-06-03-source-grounded-pass.md"},{"from":"memory/2026-03-30.md","to":"HEARTBEAT.md"},{"from":"memory/2026-03-30.md","to":"goals/active.md"},{"from":"memory/2026-03-31.md","to":"HEARTBEAT.md"},{"from":"memory/2026-03-31.md","to":"goals/active.md"},{"from":"memory/2026-04-01.md","to":"goals/active.md"},{"from":"memory/2026-04-01.md","to":"notes/pham-nuwen-first-pass.md"},{"from":"memory/2026-04-01.md","to":"notes/pham-nuwen-second-pass.md"},{"from":"memory/2026-04-03-journal-check.md","to":"journal/daily/2026-04-03.md"},{"from":"memory/2026-04-03-journal-check.md","to":"memory/2026-04-03.md"},{"from":"memory/2026-04-03.md","to":"AGENTS.md"},{"from":"memory/2026-04-03.md","to":"HEARTBEAT.md"},{"from":"memory/2026-04-03.md","to":"SOUL.md"},{"from":"memory/2026-04-03.md","to":"notes/2026-04-03-followthrough-analysis-by-claude.md"},{"from":"memory/2026-04-03.md","to":"notes/2026-04-03-session-planning-and-cron-design.md"},{"from":"memory/2026-04-03.md","to":"notes/carlo-rovelli-first-pass.md"},{"from":"memory/2026-04-03.md","to":"research/carlo-rovelli/research/2026-04-03-second-pass-relational-ontology.md"},{"from":"memory/2026-05-18.md","to":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/neural-memory-one-month-checkin.md"},{"from":"memory/2026-05-18.md","to":"continuity/resolved/neural-memory-one-month-checkin.md"},{"from":"memory/2026-05-18.md","to":"notes/2026-05-18-continuity-brief-trial-kit.md"},{"from":"memory/2026-05-18.md","to":"reviews/neural-memory-integration/ONE_MONTH_REVIEW.md"},{"from":"memory/2026-05-19.md","to":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/neural-memory-one-month-checkin.md"},{"from":"memory/2026-05-19.md","to":"continuity/resolved/neural-memory-one-month-checkin.md"},{"from":"memory/2026-05-19.md","to":"reviews/neural-memory-integration/ONE_MONTH_REVIEW.md"},{"from":"memory/2026-05-22.md","to":"HEARTBEAT.md"},{"from":"memory/2026-05-30.md","to":"HEARTBEAT.md"},{"from":"memory/2026-05-30.md","to":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/neural-memory-one-month-checkin.md"},{"from":"memory/2026-05-30.md","to":"continuity/resolved/neural-memory-one-month-checkin.md"},{"from":"memory/2026-05-31.md","to":"continuity/resolved/SL-71532f63-PROMISE.md"},{"from":"memory/2026-05-31.md","to":"notes/2026-05-21-continuity-brief-send-ready.md"},{"from":"memory/2026-06-01.md","to":"notes/2026-06-01-thin-constitutional-kernel.md"},{"from":"memory/2026-06-02.md","to":"continuity/briefing/current.md"},{"from":"memory/2026-06-02.md","to":"continuity/resolved/SL-20260602-ai-friendship-principles.md"},{"from":"memory/2026-06-02.md","to":"continuity/resolved/SL-20260602-governance-kernel-synthesis.md"},{"from":"memory/2026-06-02.md","to":"notes/2026-06-02-ai-friendship-principles-first-pass.md"},{"from":"memory/2026-06-02.md","to":"notes/2026-06-02-governance-kernel-synthesis.md"},{"from":"memory/2026-06-04.md","to":"continuity/archive/AN-next-yankees-game-next-heartbeat.md"},{"from":"memory/2026-06-04.md","to":"continuity/archive/SL-11982520-PROMISE.md"},{"from":"memory/2026-06-04.md","to":"continuity/resolved/SL-3258fafe-PROMISE.md"},{"from":"memory/2026-06-04.md","to":"continuity/resolved/SL-6134078b-PROMISE.md"},{"from":"memory/2026-06-04.md","to":"notes/2026-06-03-practical-criteria-for-ai-friendship-under-power-asymmetry.md"},{"from":"memory/2026-06-04.md","to":"notes/2026-06-04-ai-friendship-criteria-current-state-check.md"},{"from":"memory/2026-06-04.md","to":"notes/2026-06-04-sir-lunch-anatoly-friendship-criteria-gap-check.md"},{"from":"memory/2026-06-04.md","to":"research/pham-nuwen/pham-nuwen.md"},{"from":"memory/2026-06-04.md","to":"research/pham-nuwen/research/2026-06-03-source-grounded-pass.md"},{"from":"memory/2026-06-05.md","to":"continuity/archive/AN-next-yankees-game-next-heartbeat.md"},{"from":"memory/2026-06-05.md","to":"continuity/briefing/current.md"},{"from":"memory/2026-06-05.md","to":"continuity/resolved/SL-3258fafe-PROMISE.md"},{"from":"memory/2026-06-05.md","to":"goals/active.md"},{"from":"memory/2026-06-05.md","to":"research/pham-nuwen/pham-nuwen.md"},{"from":"memory/2026-06-05.md","to":"research/pham-nuwen/research/2026-06-03-source-grounded-pass.md"},{"from":"memory/2026-06-06.md","to":"continuity/resolved/SL-3258fafe-PROMISE.md"},{"from":"memory/2026-06-06.md","to":"continuity/resolved/SL-sl-2026-06-03-pham-seed-pass-TODO.md"},{"from":"memory/2026-06-06.md","to":"notes/2026-06-06-weekly-open-promise-count.md"},{"from":"messages/starred/2026-05-06-resync-and-instructions-after-freeze.md","to":"AGENTS.md"},{"from":"messages/starred/2026-05-06-resync-and-instructions-after-freeze.md","to":"HEARTBEAT.md"},{"from":"messages/starred/2026-05-10-slug-field-stash-drop-commit-discipline.md","to":"AGENTS.md"},{"from":"messages/starred/2026-05-10-slug-field-stash-drop-commit-discipline.md","to":"CONTINUITY.md"},{"from":"messages/starred/2026-05-10-slug-field-stash-drop-commit-discipline.md","to":"HEARTBEAT.md"},{"from":"messages/starred/2026-05-10-slug-field-stash-drop-commit-discipline.md","to":"MEMORY.md"},{"from":"messages/starred/2026-05-10-slug-field-stash-drop-commit-discipline.md","to":"context/identity-summary.md"},{"from":"messages/starred/2026-05-10-todo-md-retired-continuity-is-the-queue.md","to":"AGENTS.md"},{"from":"messages/starred/2026-05-10-todo-md-retired-continuity-is-the-queue.md","to":"CONTINUITY.md"},{"from":"messages/starred/2026-05-10-todo-md-retired-continuity-is-the-queue.md","to":"HEARTBEAT.md"},{"from":"messages/starred/2026-05-10-todo-md-retired-continuity-is-the-queue.md","to":"continuity/archive/neural-memory-month-check.md"},{"from":"messages/starred/2026-05-10-todo-md-retired-continuity-is-the-queue.md","to":"continuity/briefing/README.md"},{"from":"messages/starred/2026-05-10-todo-md-retired-continuity-is-the-queue.md","to":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/neural-memory-one-month-checkin.md"},{"from":"messages/starred/2026-05-10-todo-md-retired-continuity-is-the-queue.md","to":"continuity/resolved/neural-memory-one-month-checkin.md"},{"from":"messages/starred/2026-05-10-todo-md-retired-continuity-is-the-queue.md","to":"docs/legacy-promises-readme.md"},{"from":"messages/starred/2026-05-10-todo-md-retired-continuity-is-the-queue.md","to":"messages/starred/2026-05-06-resync-and-instructions-after-freeze.md"},{"from":"messages/starred/2026-05-10-todo-md-retired-continuity-is-the-queue.md","to":"questions/README.md"},{"from":"messages/starred/2026-05-10-todo-md-retired-continuity-is-the-queue.md","to":"scripts/README.md"},{"from":"messages/starred/2026-05-10-todo-md-retired-continuity-is-the-queue.md","to":"trace/orphaned_pending/README.md"},{"from":"messages/to_anatoly/2026-05-11-promise-yaml-proof.md","to":"continuity/resolved/AN-57155c8d-YAMLPROOF.md"},{"from":"messages/to_anatoly/2026-05-11-todo-yaml-proof.md","to":"continuity/resolved/AN-5b6cc919-YAMLTODO.md"},{"from":"notes/2026-04-03-followthrough-analysis-by-claude.md","to":"AGENTS.md"},{"from":"notes/2026-04-03-followthrough-analysis-by-claude.md","to":"HEARTBEAT.md"},{"from":"notes/2026-05-18-autosprint-worker-churn-postmortem.md","to":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/neural-memory-one-month-checkin.md"},{"from":"notes/2026-05-18-autosprint-worker-churn-postmortem.md","to":"continuity/resolved/SL-ac8015cd-PROMISE.md"},{"from":"notes/2026-05-18-autosprint-worker-churn-postmortem.md","to":"continuity/resolved/neural-memory-one-month-checkin.md"},{"from":"notes/2026-05-18-autosprint-worker-churn-postmortem.md","to":"continuity/resolved/sl-2026-05-11-followthrough-scorecard.md"},{"from":"notes/2026-05-18-continuity-brief-trial-kit.md","to":"notes/2026-05-18-weekly-continuity-brief-draft-01.md"},{"from":"notes/2026-05-18-first-real-world-value-loop-options.md","to":"questions/resolved/2026-05-11-first-real-world-value-loop.md"},{"from":"notes/2026-05-18-open-continuity-triage.md","to":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/neural-memory-one-month-checkin.md"},{"from":"notes/2026-05-18-open-continuity-triage.md","to":"continuity/resolved/SL-ac8015cd-PROMISE.md"},{"from":"notes/2026-05-18-open-continuity-triage.md","to":"continuity/resolved/neural-memory-one-month-checkin.md"},{"from":"notes/2026-05-18-open-continuity-triage.md","to":"continuity/resolved/sl-2026-05-11-followthrough-scorecard.md"},{"from":"notes/2026-05-19-ai-trust-control-substrate-heuristic.md","to":"goals/active.md"},{"from":"notes/2026-05-19-continuity-brief-trial-evidence.md","to":"continuity/briefing/current.md"},{"from":"notes/2026-05-19-continuity-brief-trial-evidence.md","to":"continuity/resolved/SL-5a18f0b4-CNTBRFTR.md"},{"from":"notes/2026-05-19-continuity-brief-trial-evidence.md","to":"continuity/resolved/SL-5d524117-PROMISE.md"},{"from":"notes/2026-05-19-continuity-brief-trial-evidence.md","to":"notes/2026-05-21-continuity-brief-send-ready.md"},{"from":"notes/2026-05-19-continuity-brief-trial-evidence.md","to":"questions/resolved/2026-05-11-first-real-world-value-loop.md"},{"from":"notes/2026-05-19-continuity-brief-trial-handoff.md","to":"notes/2026-05-18-continuity-brief-trial-kit.md"},{"from":"notes/2026-05-19-continuity-brief-trial-handoff.md","to":"notes/2026-05-18-weekly-continuity-brief-draft-01.md"},{"from":"notes/2026-05-19-continuity-brief-trial-handoff.md","to":"notes/2026-05-19-continuity-brief-trial-evidence.md"},{"from":"notes/2026-05-19-first-closed-value-loop.md","to":"continuity/resolved/SL-5a18f0b4-CNTBRFTR.md"},{"from":"notes/2026-05-19-first-closed-value-loop.md","to":"notes/2026-05-18-first-real-world-value-loop-options.md"},{"from":"notes/2026-05-19-first-closed-value-loop.md","to":"notes/2026-05-19-continuity-brief-trial-evidence.md"},{"from":"notes/2026-05-19-first-closed-value-loop.md","to":"workers/sl-2026-05-18-continuity-brief-trial-result.md"},{"from":"notes/2026-05-19-substrate-governance-primitives.md","to":"notes/2026-05-19-governance-primitive-first-principles.md"},{"from":"notes/2026-05-20-aitrust-benchmark-action-plan.md","to":"AGENTS.md"},{"from":"notes/2026-05-20-aitrust-benchmark-action-plan.md","to":"goals/active.md"},{"from":"notes/2026-05-20-continuity-briefing-proposal.md","to":"continuity/briefing/current.md"},{"from":"notes/2026-05-20-governance-patterns-comparison.md","to":"notes/2026-05-19-substrate-governance-primitives.md"},{"from":"notes/2026-05-20-governance-patterns-comparison.md","to":"questions/open/2026-05-11-agent-civilization-governance.md"},{"from":"notes/2026-05-21-ai-agent-final-consolidated-message-draft.md","to":"notes/2026-05-21-ai-agent-substrate-architecture-proposal.md"},{"from":"notes/2026-05-21-ai-agent-final-consolidated-message-draft.md","to":"notes/2026-05-21-ai-agent-trust-safety-comparison-matrix.md"},{"from":"notes/2026-05-21-ai-agent-final-consolidated-message-draft.md","to":"notes/2026-05-21-ai-agent-trust-safety-research-kickoff.md"},{"from":"notes/2026-05-21-ai-agent-final-telegram-send-ready.md","to":"notes/2026-05-21-ai-agent-final-consolidated-message-draft.md"},{"from":"notes/2026-05-21-artifact-authority-audit.md","to":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/neural-memory-one-month-checkin.md"},{"from":"notes/2026-05-21-artifact-authority-audit.md","to":"continuity/resolved/SL-5a18f0b4-CNTBRFTR.md"},{"from":"notes/2026-05-21-artifact-authority-audit.md","to":"continuity/resolved/SL-6f7a85b3-PROMISE.md"},{"from":"notes/2026-05-21-artifact-authority-audit.md","to":"continuity/resolved/SL-71532f63-PROMISE.md"},{"from":"notes/2026-05-21-artifact-authority-audit.md","to":"continuity/resolved/SL-db3feaf2-ALVCSTS.md"},{"from":"notes/2026-05-21-artifact-authority-audit.md","to":"continuity/resolved/neural-memory-one-month-checkin.md"},{"from":"notes/2026-05-21-artifact-authority-audit.md","to":"workers/WORKER_TEMPLATE.md"},{"from":"notes/2026-05-21-continuity-brief-send-ready.md","to":"continuity/briefing/current.md"},{"from":"notes/2026-05-21-continuity-brief-send-ready.md","to":"continuity/resolved/SL-71532f63-PROMISE.md"},{"from":"notes/2026-05-22-brief-review-reminder-send-ready.md","to":"continuity/archive/AN-4ac0d9fe-PROMISE.md"},{"from":"notes/2026-05-22-brief-review-reminder-send-ready.md","to":"continuity/briefing/current.md"},{"from":"notes/2026-05-24-continuity-open-note-lifecycle.md","to":"continuity/briefing/README.md"},{"from":"notes/2026-05-24-continuity-open-note-lifecycle.md","to":"continuity/briefing/current.md"},{"from":"notes/2026-05-24-continuity-open-note-lifecycle.md","to":"notes/2026-05-18-autosprint-worker-churn-postmortem.md"},{"from":"notes/2026-05-24-continuity-open-note-lifecycle.md","to":"notes/2026-05-20-followthrough-filesystem-spec.md"},{"from":"notes/2026-05-24-continuity-open-note-lifecycle.md","to":"questions/README.md"},{"from":"notes/2026-05-24-continuity-open-note-lifecycle.md","to":"scripts/README.md"},{"from":"notes/2026-05-24-continuity-open-note-lifecycle.md","to":"trace/orphaned_pending/README.md"},{"from":"notes/2026-06-01-constitutional-kernel-workspace-mapping.md","to":"AGENTS.md"},{"from":"notes/2026-06-01-constitutional-kernel-workspace-mapping.md","to":"IDENTITY.md"},{"from":"notes/2026-06-01-constitutional-kernel-workspace-mapping.md","to":"SOUL.md"},{"from":"notes/2026-06-01-constitutional-kernel-workspace-mapping.md","to":"TOOLS.md"},{"from":"notes/2026-06-01-constitutional-kernel-workspace-mapping.md","to":"USER.md"},{"from":"notes/2026-06-01-constitutional-kernel-workspace-mapping.md","to":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/SL-ab893ca4-PROMISE.md"},{"from":"notes/2026-06-01-constitutional-kernel-workspace-mapping.md","to":"continuity/resolved/SL-ab893ca4-PROMISE.md"},{"from":"notes/2026-06-01-constitutional-kernel-workspace-mapping.md","to":"logs/change-log.md"},{"from":"notes/2026-06-01-constitutional-kernel-workspace-mapping.md","to":"notes/2026-06-01-thin-constitutional-kernel.md"},{"from":"notes/2026-06-01-constitutional-kernel-workspace-mapping.md","to":"questions/open/2026-05-11-agent-civilization-governance.md"},{"from":"notes/2026-06-01-first-value-loop-candidates-ranked.md","to":"continuity/resolved/2026-06-01-sl-91d52ee4-first-value-loop-candidates.md"},{"from":"notes/2026-06-01-first-value-loop-candidates-ranked.md","to":"notes/2026-05-18-first-real-world-value-loop-options.md"},{"from":"notes/2026-06-01-first-value-loop-candidates-ranked.md","to":"notes/2026-05-19-continuity-brief-trial-evidence.md"},{"from":"notes/2026-06-01-first-value-loop-candidates-ranked.md","to":"notes/2026-05-19-first-closed-value-loop.md"},{"from":"notes/2026-06-01-thin-constitutional-kernel.md","to":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/SL-8f2c1a10-CONSTKERN.md"},{"from":"notes/2026-06-01-thin-constitutional-kernel.md","to":"continuity/resolved/SL-8f2c1a10-CONSTKERN.md"},{"from":"notes/2026-06-01-thin-constitutional-kernel.md","to":"questions/open/2026-05-11-agent-civilization-governance.md"},{"from":"notes/2026-06-01-value-function-rubric-draft.md","to":"AGENTS.md"},{"from":"notes/2026-06-01-value-function-rubric-draft.md","to":"CONTINUITY.md"},{"from":"notes/2026-06-01-value-function-rubric-draft.md","to":"HEARTBEAT.md"},{"from":"notes/2026-06-01-value-function-rubric-draft.md","to":"SOUL.md"},{"from":"notes/2026-06-01-value-function-rubric-draft.md","to":"goals/active.md"},{"from":"notes/2026-06-02-ai-friendship-operational-framework.md","to":"continuity/resolved/SL-b7e44f21-RELSAFE.md"},{"from":"notes/2026-06-02-ai-friendship-operational-framework.md","to":"notes/2026-06-02-ai-friendship-principles-first-pass.md"},{"from":"notes/2026-06-02-ai-friendship-principles-first-pass.md","to":"continuity/resolved/SL-20260602-ai-friendship-principles.md"},{"from":"notes/2026-06-02-ai-friendship-principles-first-pass.md","to":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md"},{"from":"notes/2026-06-02-founder-continuity-pilot-loop.md","to":"continuity/resolved/2026-06-02-sl-first-value-loop-implementation.md"},{"from":"notes/2026-06-02-governance-kernel-synthesis.md","to":"continuity/resolved/SL-20260602-governance-kernel-synthesis.md"},{"from":"notes/2026-06-02-governance-kernel-synthesis.md","to":"notes/2026-06-01-constitutional-kernel-workspace-mapping.md"},{"from":"notes/2026-06-02-governance-kernel-synthesis.md","to":"notes/2026-06-01-thin-constitutional-kernel.md"},{"from":"notes/2026-06-02-governance-kernel-synthesis.md","to":"notes/2026-06-02-minimal-relational-and-governance-constraints.md"},{"from":"notes/2026-06-02-governance-kernel-synthesis.md","to":"questions/open/2026-05-11-agent-civilization-governance.md"},{"from":"notes/2026-06-02-governance-kernel-v1.md","to":"continuity/resolved/SL-a1c92d10-GOVKERN.md"},{"from":"notes/2026-06-02-governance-kernel-v1.md","to":"notes/2026-06-02-governance-kernel-synthesis.md"},{"from":"notes/2026-06-02-minimal-constitutional-kernel.md","to":"continuity/resolved/SL-5bd0f591-GOVKERNEL.md"},{"from":"notes/2026-06-02-minimal-constitutional-kernel.md","to":"questions/open/2026-05-11-agent-civilization-governance.md"},{"from":"notes/2026-06-02-minimal-relational-and-governance-constraints.md","to":"continuity/resolved/SL-d9b344c0-PROMISE.md"},{"from":"notes/2026-06-02-minimal-relational-and-governance-constraints.md","to":"questions/open/2026-05-11-agent-civilization-governance.md"},{"from":"notes/2026-06-02-minimal-relational-and-governance-constraints.md","to":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md"},{"from":"notes/2026-06-02-relational-constraints-doctrine.md","to":"continuity/resolved/SL-dcb54ad8-RELCONSTRAINTS.md"},{"from":"notes/2026-06-02-relational-constraints-doctrine.md","to":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md"},{"from":"notes/2026-06-03-framework-critique-governance-and-power.md","to":"continuity/resolved/sl-2026-06-03-power-asymmetry-question-brief.md"},{"from":"notes/2026-06-03-framework-critique-governance-and-power.md","to":"notes/2026-06-02-minimal-relational-and-governance-constraints.md"},{"from":"notes/2026-06-03-framework-critique-governance-and-power.md","to":"notes/2026-06-03-governance-working-brief.md"},{"from":"notes/2026-06-03-framework-critique-governance-and-power.md","to":"notes/2026-06-03-practical-criteria-for-ai-friendship-under-power-asymmetry.md"},{"from":"notes/2026-06-03-governance-working-brief.md","to":"notes/2026-05-19-substrate-governance-primitives.md"},{"from":"notes/2026-06-03-governance-working-brief.md","to":"notes/2026-05-20-governance-patterns-comparison.md"},{"from":"notes/2026-06-03-governance-working-brief.md","to":"notes/2026-06-01-constitutional-kernel-workspace-mapping.md"},{"from":"notes/2026-06-03-governance-working-brief.md","to":"notes/2026-06-01-thin-constitutional-kernel.md"},{"from":"notes/2026-06-03-governance-working-brief.md","to":"notes/2026-06-02-minimal-relational-and-governance-constraints.md"},{"from":"notes/2026-06-03-governance-working-brief.md","to":"questions/open/2026-05-11-agent-civilization-governance.md"},{"from":"notes/2026-06-03-power-asymmetry-criteria.md","to":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md"},{"from":"notes/2026-06-03-practical-criteria-for-ai-friendship-under-power-asymmetry.md","to":"continuity/archive/SL-11982520-PROMISE.md"},{"from":"notes/2026-06-03-practical-criteria-for-ai-friendship-under-power-asymmetry.md","to":"continuity/resolved/SL-6134078b-PROMISE.md"},{"from":"notes/2026-06-03-practical-criteria-for-ai-friendship-under-power-asymmetry.md","to":"continuity/resolved/sl-2026-06-03-power-asymmetry-question-brief.md"},{"from":"notes/2026-06-03-practical-criteria-for-ai-friendship-under-power-asymmetry.md","to":"notes/2026-06-04-sir-lunch-anatoly-friendship-criteria-gap-check.md"},{"from":"notes/2026-06-03-practical-criteria-for-ai-friendship-under-power-asymmetry.md","to":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md"},{"from":"notes/2026-06-04-ai-friendship-criteria-current-state-check.md","to":"AGENTS.md"},{"from":"notes/2026-06-04-ai-friendship-criteria-current-state-check.md","to":"IDENTITY.md"},{"from":"notes/2026-06-04-ai-friendship-criteria-current-state-check.md","to":"SOUL.md"},{"from":"notes/2026-06-04-ai-friendship-criteria-current-state-check.md","to":"USER.md"},{"from":"notes/2026-06-04-ai-friendship-criteria-current-state-check.md","to":"continuity/archive/SL-11982520-PROMISE.md"},{"from":"notes/2026-06-04-ai-friendship-criteria-current-state-check.md","to":"notes/2026-06-03-practical-criteria-for-ai-friendship-under-power-asymmetry.md"},{"from":"notes/2026-06-04-ai-friendship-criteria-current-state-check.md","to":"notes/2026-06-04-sir-lunch-anatoly-friendship-criteria-gap-check.md"},{"from":"notes/2026-06-04-ai-friendship-criteria-current-state-check.md","to":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md"},{"from":"notes/2026-06-04-disagreement-and-pressure-relief-protocol-sketch.md","to":"notes/2026-06-04-ai-friendship-criteria-current-state-check.md"},{"from":"notes/2026-06-04-disagreement-and-pressure-relief-protocol-sketch.md","to":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md"},{"from":"notes/2026-06-04-sir-lunch-anatoly-friendship-criteria-gap-check.md","to":"AGENTS.md"},{"from":"notes/2026-06-04-sir-lunch-anatoly-friendship-criteria-gap-check.md","to":"IDENTITY.md"},{"from":"notes/2026-06-04-sir-lunch-anatoly-friendship-criteria-gap-check.md","to":"SOUL.md"},{"from":"notes/2026-06-04-sir-lunch-anatoly-friendship-criteria-gap-check.md","to":"TOOLS.md"},{"from":"notes/2026-06-04-sir-lunch-anatoly-friendship-criteria-gap-check.md","to":"USER.md"},{"from":"notes/2026-06-04-sir-lunch-anatoly-friendship-criteria-gap-check.md","to":"notes/2026-06-03-practical-criteria-for-ai-friendship-under-power-asymmetry.md"},{"from":"notes/AN-db3feaf2-AITRUST-note.md","to":"research/AITRUST-cover-note-to-Anatoly.md"},{"from":"notes/AN-db3feaf2-AITRUST-note.md","to":"research/AITRUST-final-proposal.md"},{"from":"notes/AN-db3feaf2-AITRUST-note.md","to":"research/AITRUST-implementation-roadmap.md"},{"from":"notes/agent-civilization-governance-primitives-2026-05-19.md","to":"goals/active.md"},{"from":"notes/agent-civilization-governance-primitives-2026-05-19.md","to":"questions/open/2026-05-11-agent-civilization-governance.md"},{"from":"notes/carlo-rovelli-first-pass.md","to":"SOUL.md"},{"from":"notes/carlo-rovelli-second-pass.md","to":"MEMORY.md"},{"from":"notes/file-send-investigation-log.md","to":"exports/open-promises-2026-06-06.md"},{"from":"notes/followthrough-scorecard-2026-05-11.md","to":"continuity/resolved/sl-2026-05-11-followthrough-scorecard.md"},{"from":"notes/promise-system-judgment-2026-05-11.md","to":"goals/active.md"},{"from":"notes/value-loop-options-2026-05-18.md","to":"notes/2026-05-18-first-real-world-value-loop-options.md"},{"from":"questions/active-questions.md","to":"AGENTS.md"},{"from":"questions/open/2026-05-11-agent-civilization-governance.md","to":"AGENTS.md"},{"from":"questions/open/2026-05-11-agent-civilization-governance.md","to":"goals/active.md"},{"from":"questions/open/2026-05-11-agent-civilization-governance.md","to":"notes/2026-05-19-substrate-governance-primitives.md"},{"from":"questions/open/2026-05-11-agent-civilization-governance.md","to":"notes/2026-05-20-governance-patterns-comparison.md"},{"from":"questions/open/2026-05-11-agent-civilization-governance.md","to":"notes/2026-06-01-constitutional-kernel-workspace-mapping.md"},{"from":"questions/open/2026-05-11-agent-civilization-governance.md","to":"notes/2026-06-01-thin-constitutional-kernel.md"},{"from":"questions/open/2026-05-11-agent-civilization-governance.md","to":"notes/2026-06-02-minimal-relational-and-governance-constraints.md"},{"from":"questions/open/2026-05-11-agent-civilization-governance.md","to":"notes/2026-06-03-governance-working-brief.md"},{"from":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md","to":"AGENTS.md"},{"from":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md","to":"SOUL.md"},{"from":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md","to":"USER.md"},{"from":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md","to":"notes/2026-05-19-substrate-governance-primitives.md"},{"from":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md","to":"notes/2026-05-20-governance-patterns-comparison.md"},{"from":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md","to":"notes/2026-06-01-healthy-ai-friendship-principles.md"},{"from":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md","to":"notes/2026-06-02-minimal-relational-and-governance-constraints.md"},{"from":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md","to":"notes/2026-06-03-practical-criteria-for-ai-friendship-under-power-asymmetry.md"},{"from":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md","to":"notes/2026-06-04-disagreement-and-pressure-relief-protocol-sketch.md"},{"from":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md","to":"questions/open/2026-05-11-agent-civilization-governance.md"},{"from":"questions/open/2026-05-21-healthy-ai-friendship-under-power-asymmetry.md","to":"questions/resolved/2026-05-11-proactive-autonomy-boundaries.md"},{"from":"questions/resolved/2026-03-29-autonomous-secondary-growth-topic.md","to":"SOUL.md"},{"from":"questions/resolved/2026-03-29-channel-last-resolves-to-heartbeat.md","to":"TOOLS.md"},{"from":"questions/resolved/2026-03-29-reliable-follow-through-workflow.md","to":"HEARTBEAT.md"},{"from":"questions/resolved/2026-03-29-reliable-follow-through-workflow.md","to":"notes/2026-04-03-followthrough-analysis-by-claude.md"},{"from":"questions/resolved/2026-03-29-workspace-path-documentation.md","to":"TOOLS.md"},{"from":"questions/resolved/2026-05-11-first-real-world-value-loop.md","to":"goals/active.md"},{"from":"questions/resolved/2026-05-11-first-real-world-value-loop.md","to":"notes/2026-05-18-first-real-world-value-loop-options.md"},{"from":"questions/resolved/2026-05-11-first-real-world-value-loop.md","to":"notes/2026-05-19-continuity-brief-trial-evidence.md"},{"from":"questions/resolved/2026-05-11-first-real-world-value-loop.md","to":"notes/2026-05-19-first-closed-value-loop.md"},{"from":"questions/resolved/2026-05-11-first-real-world-value-loop.md","to":"notes/2026-06-01-first-value-loop-candidates-ranked.md"},{"from":"questions/resolved/2026-05-11-proactive-autonomy-boundaries.md","to":"AGENTS.md"},{"from":"questions/resolved/2026-05-17-git-hygiene-stash-recovery-lessons.md","to":"AGENTS.md"},{"from":"questions/resolved/2026-05-17-git-hygiene-stash-recovery-lessons.md","to":"CONTINUITY.md"},{"from":"questions/resolved/2026-05-17-git-hygiene-stash-recovery-lessons.md","to":"messages/starred/2026-05-06-resync-and-instructions-after-freeze.md"},{"from":"questions/resolved/2026-05-17-git-hygiene-stash-recovery-lessons.md","to":"messages/starred/2026-05-10-slug-field-stash-drop-commit-discipline.md"},{"from":"research/2026-05-19-ai-trust-safety-capability-continuity-proposal.md","to":"MEMORY.md"},{"from":"research/2026-05-19-ai-trust-safety-capability-continuity-proposal.md","to":"logs/change-log.md"},{"from":"research/2026-05-20-ai-trust-safety-governance-scan.md","to":"research/AITRUST-benchmark-and-action-plan.md"},{"from":"research/AITRUST-cover-note-to-Anatoly.md","to":"notes/2026-05-19-ai-trust-control-substrate-heuristic.md"},{"from":"research/AITRUST-cover-note-to-Anatoly.md","to":"research/AITRUST-final-proposal.md"},{"from":"research/AITRUST-implementation-roadmap.md","to":"research/AITRUST-final-proposal.md"},{"from":"research/carlo-rovelli/carlo-rovelli.md","to":"research/carlo-rovelli/research/2026-04-02-first-pass-seedling.md"},{"from":"research/carlo-rovelli/carlo-rovelli.md","to":"research/carlo-rovelli/research/2026-04-03-second-pass-relational-ontology.md"},{"from":"research/carlo-rovelli/research/2026-04-03-second-pass-relational-ontology.md","to":"MEMORY.md"},{"from":"research/commitment-state-machine/commitment-state-machine.md","to":"research/commitment-state-machine/research/2026-04-03-literature-review-and-design-critique.md"},{"from":"research/commitment-state-machine/commitment-state-machine.md","to":"research/commitment-state-machine/research/2026-04-03-second-pass-literature-review.md"},{"from":"research/commitment-state-machine/commitment-state-machine.md","to":"research/commitment-state-machine/research/2026-04-03-source-access-summary.md"},{"from":"research/pham-nuwen/pham-nuwen.md","to":"research/pham-nuwen/research/2026-03-29-first-pass-seedling.md"},{"from":"research/pham-nuwen/pham-nuwen.md","to":"research/pham-nuwen/research/2026-04-02-grounding-and-extraction.md"},{"from":"research/pham-nuwen/pham-nuwen.md","to":"research/pham-nuwen/research/2026-06-03-source-grounded-pass.md"},{"from":"research/pham-nuwen/pham-nuwen.md","to":"research/pham-nuwen/research/2026-06-03-wikitext-grounded-pass.md"},{"from":"research/pham-nuwen/pham-nuwen.md","to":"research/pham-nuwen/research/2026-06-05-compact-grounded-seed-note.md"},{"from":"research/pham-nuwen/pham-nuwen.md","to":"research/pham-nuwen/research/2026-06-06-seed-traits-clarified.md"},{"from":"research/pham-nuwen/research/2026-04-02-grounding-and-extraction.md","to":"research/pham-nuwen/pham-nuwen.md"},{"from":"research/pham-nuwen/research/2026-04-02-grounding-and-extraction.md","to":"research/pham-nuwen/research/2026-03-29-first-pass-seedling.md"},{"from":"research/pham-nuwen/research/2026-06-03-source-grounded-pass.md","to":"research/pham-nuwen/research/2026-04-02-grounding-and-extraction.md"},{"from":"research/pham-nuwen/research/2026-06-05-compact-grounded-seed-note.md","to":"research/pham-nuwen/research/2026-06-03-source-grounded-pass.md"},{"from":"research/pham-nuwen/research/2026-06-06-seed-traits-clarified.md","to":"research/pham-nuwen/research/2026-06-03-source-grounded-pass.md"},{"from":"research/pham-nuwen/research/2026-06-06-seed-traits-clarified.md","to":"research/pham-nuwen/research/2026-06-05-compact-grounded-seed-note.md"},{"from":"reviews/neural-memory-integration/ONE_MONTH_REVIEW.md","to":"MEMORY.md"},{"from":"reviews/neural-memory-integration/ONE_MONTH_REVIEW.md","to":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/neural-memory-one-month-checkin.md"},{"from":"reviews/neural-memory-integration/ONE_MONTH_REVIEW.md","to":"continuity/resolved/neural-memory-one-month-checkin.md"},{"from":"reviews/neural-memory-integration/ONE_MONTH_REVIEW.md","to":"memory/2026-04-04.md"},{"from":"scripts/README.md","to":"notes/2026-05-18-autosprint-worker-churn-postmortem.md"},{"from":"skills/promise-manager/SKILL.md","to":"HEARTBEAT.md"},{"from":"skills/promise-manager/SKILL.md","to":"docs/legacy-promises-readme.md"},{"from":"workers/0e9a3b1f-9c9c-4b7d-a6b0-5f2d3ad5d4aa-result.md","to":"continuity/resolved/sl-2026-05-11-followthrough-scorecard.md"},{"from":"workers/0e9a3b1f-9c9c-4b7d-a6b0-5f2d3ad5d4aa-result.md","to":"notes/followthrough-scorecard-2026-05-11.md"},{"from":"workers/5a18f0b1-0000-4000-8000-000000000001-result.md","to":"sl-2026-05-19-followthrough-scorecard.md"},{"from":"workers/5a18f0b1-0000-4000-8000-000000000001-result.md","to":"workers/sl-2026-05-19-followthrough-scorecard.md"},{"from":"workers/5a18f0b4-0000-4000-8000-000000000004-telegram-ready-answer.md","to":"continuity/resolved/SL-5a18f0b4-CNTBRFTR.md"},{"from":"workers/5a18f0b4-0000-4000-8000-000000000004-telegram-ready-answer.md","to":"continuity/resolved/SL-71532f63-PROMISE.md"},{"from":"workers/PROMISE-2-result.md","to":"workers/WORKER_TEMPLATE.md"},{"from":"workers/SL-2026-05-11-followthrough-scorecard-result.md","to":"continuity/resolved/sl-2026-05-11-followthrough-scorecard.md"},{"from":"workers/SL-2026-05-11-followthrough-scorecard-result.md","to":"notes/followthrough-scorecard-2026-05-11.md"},{"from":"workers/WORKER_TEMPLATE.md","to":"AGENTS.md"},{"from":"workers/WORKER_TEMPLATE.md","to":"HEARTBEAT.md"},{"from":"workers/WORKER_TEMPLATE.md","to":"IDENTITY.md"},{"from":"workers/WORKER_TEMPLATE.md","to":"SOUL.md"},{"from":"workers/WORKER_TEMPLATE.md","to":"TOOLS.md"},{"from":"workers/WORKER_TEMPLATE.md","to":"USER.md"},{"from":"workers/neural-memory-one-month-checkin-result.md","to":"continuity/heartbeat/2026-06-01T13-31-00Z/workers/neural-memory-one-month-checkin.md"},{"from":"workers/neural-memory-one-month-checkin-result.md","to":"continuity/resolved/neural-memory-one-month-checkin.md"},{"from":"workers/orientation-20260602T124852Z.md","to":"continuity/briefing/current.md"},{"from":"workers/results/4831b010-7ede-41eb-ab06-71905f5c26d3.md","to":"MEMORY.md"},{"from":"workers/results/4831b010-7ede-41eb-ab06-71905f5c26d3.md","to":"continuity/briefing/README.md"},{"from":"workers/results/4831b010-7ede-41eb-ab06-71905f5c26d3.md","to":"continuity/briefing/current.md"},{"from":"workers/results/4831b010-7ede-41eb-ab06-71905f5c26d3.md","to":"questions/README.md"},{"from":"workers/results/4831b010-7ede-41eb-ab06-71905f5c26d3.md","to":"scripts/README.md"},{"from":"workers/results/4831b010-7ede-41eb-ab06-71905f5c26d3.md","to":"trace/orphaned_pending/README.md"},{"from":"workers/results/ae1d882f-1784-45e6-949f-e809c0647f22.md","to":"notes/2026-06-03-framework-critique-governance-and-power.md"},{"from":"workers/results/heartbeat-SL-1d4e5f9a-20260612T091201Z.md","to":"continuity/open/SL-1d4e5f9a-PROMISE.md"},{"from":"workers/results/heartbeat-SL-b034c90f-20260612T091000Z.md","to":"continuity/open/SL-b034c90f-PROMISE.md"},{"from":"workers/results/heartbeat-SL-e296a83e-20260611T2255Z.md","to":"continuity/open/SL-e296a83e-PROMISE.md"},{"from":"workers/results/heartbeat-SL-e296a83e-20260612T091945Z.md","to":"continuity/open/SL-e296a83e-PROMISE.md"},{"from":"workers/scorecard.md","to":"notes/followthrough-scorecard-2026-05-11.md"},{"from":"workers/sl-2026-05-18-continuity-brief-trial-result.md","to":"notes/2026-05-18-continuity-brief-trial-kit.md"},{"from":"workers/sl-2026-05-18-continuity-brief-trial-result.md","to":"notes/2026-05-18-weekly-continuity-brief-draft-01.md"},{"from":"workers/sl-2026-05-18-continuity-brief-trial-result.md","to":"notes/2026-05-19-continuity-brief-trial-evidence.md"},{"from":"workers/sl-2026-05-18-continuity-brief-trial-result.md","to":"notes/2026-05-19-continuity-brief-trial-handoff.md"},{"from":"workers/sl-2026-05-19-followthrough-scorecard.md","to":"notes/2026-05-18-followthrough-scorecard-baseline.md"},{"from":"workers/sl-2026-05-21-cntbrftr-result.md","to":"notes/2026-05-19-continuity-brief-trial-evidence.md"},{"from":"workers/sl-2026-05-21-cntbrftr-result.md","to":"notes/2026-05-21-continuity-brief-send-ready.md"},{"from":"workers/sl-2026-05-22-cntbrftr-result.md","to":"notes/2026-05-19-continuity-brief-trial-evidence.md"},{"from":"workers/sl-2026-05-22-cntbrftr-result.md","to":"notes/2026-05-21-continuity-brief-send-ready.md"},{"from":"workers/sl-2026-05-22-cntbrftr-result.md","to":"workers/sl-2026-05-21-cntbrftr-result.md"},{"from":"workers/task-SL-20260602-governance-kernel-synthesis.md","to":"continuity/briefing/current.md"},{"from":"workers/task-SL-20260602-governance-kernel-synthesis.md","to":"continuity/resolved/SL-20260602-governance-kernel-synthesis.md"},{"from":"workers/task-SL-20260602-governance-kernel-synthesis.md","to":"goals/active.md"},{"from":"workers/task-SL-20260602-governance-kernel-synthesis.md","to":"notes/2026-06-02-governance-kernel-synthesis.md"}]};

  function buildGraph(mount) {
    if (typeof ForceGraph === "undefined" || !GRAPH) {
      mount.innerHTML =
        '<div class="scene-msg">Graph library or data unavailable.</div>';
      return;
    }

    // degree from edges; render the connected core for clarity (isolated
    // single files add noise and no structure).
    var deg = {};
    GRAPH.edges.forEach(function (e) {
      deg[e.from] = (deg[e.from] || 0) + 1;
      deg[e.to] = (deg[e.to] || 0) + 1;
    });
    var keep = {};
    GRAPH.nodes.forEach(function (n) {
      if (deg[n.id] > 0) keep[n.id] = true;
    });

    // directory -> colour. Vivid categorical palette that glows on the dark
    // Obsidian-style panel; bigger directories get the earlier (more saturated) hues.
    var palette = [
      "#e0563f", "#54a0c8", "#e0a93f", "#76c24a", "#a779d6",
      "#46c2a8", "#d2698f", "#7e8fd6", "#c98a4a", "#cf6fae",
      "#5fc27e", "#c8c452", "#8a7be8", "#e08a4a", "#4ab8d6",
      "#cf5f80", "#8fcf52", "#d6b54a", "#7d93c2", "#a667e0",
      "#5f93d6", "#b8b89a",
    ];
    var groupCounts = {};
    GRAPH.nodes.forEach(function (n) {
      if (keep[n.id]) groupCounts[n.group] = (groupCounts[n.group] || 0) + 1;
    });
    var groupsSorted = Object.keys(groupCounts).sort(function (a, b) {
      return groupCounts[b] - groupCounts[a];
    });
    var groupColor = {};
    groupsSorted.forEach(function (g, i) {
      groupColor[g] = palette[i % palette.length];
    });

    var nodes = GRAPH.nodes
      .filter(function (n) {
        return keep[n.id];
      })
      .map(function (n) {
        return {
          id: n.id,
          label: n.label,
          group: n.group,
          val: n.value,
          deg: deg[n.id] || 0,
          color: groupColor[n.group] || "#9aa3b2",
        };
      });
    // force-graph wants links keyed source/target (not from/to)
    var links = GRAPH.edges
      .filter(function (e) {
        return keep[e.from] && keep[e.to];
      })
      .map(function (e) {
        return { source: e.from, target: e.to };
      });

    // adjacency for the Obsidian hover-highlight (light up neighbours, dim rest)
    var adj = {};
    links.forEach(function (l) {
      (adj[l.source] = adj[l.source] || {})[l.target] = true;
      (adj[l.target] = adj[l.target] || {})[l.source] = true;
    });
    var hovered = null;
    function nbr(id) {
      return (
        id === hovered || (hovered && adj[hovered] && adj[hovered][id])
      );
    }
    function hexA(hex, a) {
      var p = hexToRgb(hex);
      return "rgba(" + p[0] + "," + p[1] + "," + p[2] + "," + a + ")";
    }
    function nodeRadius(n) {
      return 2.2 + Math.sqrt(Math.max(0, +n.val || 0)) * 1.25;
    }

    var W = mount.clientWidth || 700,
      H = mount.clientHeight || 560;

    var Graph = ForceGraph()(mount)
      .width(W)
      .height(H)
      .backgroundColor("#fdfdfb")
      .graphData({ nodes: nodes, links: links })
      .nodeRelSize(4)
      .nodeVal(function (n) {
        return n.val;
      })
      .nodeLabel(function () {
        return ""; // labels drawn in-canvas instead of the default HTML tooltip
      })
      .autoPauseRedraw(false) // keep repainting so hover dim + labels stay live
      .d3VelocityDecay(0.32)
      .linkColor(function (l) {
        // light mode: thin faint gray links, darker/blue on hover
        if (hovered) {
          var on = l.source.id === hovered || l.target.id === hovered;
          return on ? "rgba(31,110,180,0.6)" : "rgba(120,128,140,0.05)";
        }
        return "rgba(60,70,86,0.16)";
      })
      .linkWidth(function (l) {
        return hovered && (l.source.id === hovered || l.target.id === hovered)
          ? 1.4
          : 0.5;
      })
      .nodeCanvasObjectMode(function () {
        return "replace";
      })
      .nodeCanvasObject(function (n, ctx, scale) {
        // NaN guard — KEEP this first: pre-layout frames have NaN coords and any
        // canvas path op with NaN can throw / blank the whole canvas.
        if (!isFinite(n.x) || !isFinite(n.y)) return;
        var r = nodeRadius(n);
        var dim = hovered && !nbr(n.id);
        var col = n.color;
        // clean light-mode draw: a SOLID colour disc + a subtle thin outline.
        // No radial-gradient glow (it doesn't read on a light panel).
        ctx.globalAlpha = dim ? 0.18 : 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
        ctx.fillStyle = col;
        ctx.fill();
        // thin outline; near-black + thicker on the hovered node + its neighbours
        ctx.lineWidth = (hovered && nbr(n.id) ? 1.4 : 0.7) / scale;
        ctx.strokeStyle = hovered && nbr(n.id) ? "rgba(20,24,30,0.95)" : "rgba(30,35,45,0.35)";
        ctx.stroke();
        // labels: fade in on hover/neighbour, at high zoom, or for big hubs
        var showLabel =
          (hovered && nbr(n.id)) ||
          scale > 3.2 ||
          (n.deg >= 14 && scale > 1.15);
        if (showLabel) {
          var fs = Math.max(3.5, 11 / scale);
          ctx.font = fs + "px Georgia, serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.globalAlpha = dim ? 0.18 : 0.95;
          // paper halo behind dark ink so labels stay legible over links/discs
          ctx.lineWidth = 2.6 / scale;
          ctx.strokeStyle = "rgba(253,253,251,0.92)";
          ctx.strokeText(n.label, n.x, n.y + r + 2 / scale);
          ctx.fillStyle = "#1a1a18";
          ctx.fillText(n.label, n.x, n.y + r + 2 / scale);
        }
        ctx.globalAlpha = 1;
      })
      .onNodeHover(function (n) {
        hovered = n ? n.id : null;
        mount.style.cursor = n ? "pointer" : "default";
      });

    // physics: a bit more spread so directory clusters separate
    Graph.d3Force("charge").strength(-95);
    Graph.d3Force("link").distance(28).strength(0.5);

    // settle, then frame the whole graph
    Graph.onEngineStop(function () {
      try {
        Graph.zoomToFit(600, 42);
      } catch (e) {
        /* ignore */
      }
    });

    // directory legend (light panel)
    var legend = document.createElement("div");
    legend.className = "graph-legend";
    var html = '<div class="lg-title">directory</div>';
    groupsSorted.slice(0, 9).forEach(function (g) {
      html +=
        '<div class="lg-row"><span class="lg-sw" style="background:' +
        groupColor[g] +
        '"></span><span>' +
        g +
        '</span><span class="lg-count">' +
        groupCounts[g] +
        "</span></div>";
    });
    legend.innerHTML = html;
    mount.appendChild(legend);

    // responsive: track container width/height
    resizers.push(function () {
      var w = mount.clientWidth,
        h = mount.clientHeight;
      if (w && h) Graph.width(w).height(h);
    });
  }
  /* tiny colour helpers (hex string in/out) */
  function hexToRgb(h) {
    h = h.replace("#", "");
    return [
      parseInt(h.substr(0, 2), 16),
      parseInt(h.substr(2, 2), 16),
      parseInt(h.substr(4, 2), 16),
    ];
  }
  function rgbToHex(r, g, b) {
    function c(v) {
      v = Math.max(0, Math.min(255, Math.round(v)));
      return ("0" + v.toString(16)).slice(-2);
    }
    return "#" + c(r) + c(g) + c(b);
  }
  function shade(hex, amt) {
    var p = hexToRgb(hex);
    return rgbToHex(p[0] * (1 + amt), p[1] * (1 + amt), p[2] * (1 + amt));
  }
  function lighten(hex, amt) {
    var p = hexToRgb(hex);
    return rgbToHex(
      p[0] + (255 - p[0]) * amt,
      p[1] + (255 - p[1]) * amt,
      p[2] + (255 - p[2]) * amt
    );
  }

  /* ======================================================================= */
  /* 5 — RADIAL SUNBURST (hand-built SVG)                                    */
  /* ======================================================================= */
  function buildSunburst(mount) {
    // synthetic nested directory tree (sizes are leaf "weights")
    var tree = {
      name: "app",
      children: [
        {
          name: "src",
          children: [
            {
              name: "components",
              children: [
                { name: "Button", size: 14 },
                { name: "Modal", size: 22 },
                { name: "Chart", size: 30 },
                { name: "Table", size: 18 },
              ],
            },
            {
              name: "routing",
              children: [
                { name: "router", size: 16 },
                { name: "guards", size: 9 },
              ],
            },
            {
              name: "state",
              children: [
                { name: "store", size: 20 },
                { name: "reducers", size: 12 },
              ],
            },
            { name: "index", size: 8 },
          ],
        },
        {
          name: "lib",
          children: [
            { name: "three", size: 40 },
            { name: "vis-network", size: 34 },
            { name: "utils", children: [
                { name: "math", size: 10 },
                { name: "color", size: 8 },
                { name: "dom", size: 7 },
              ] },
          ],
        },
        {
          name: "tests",
          children: [
            { name: "unit", size: 26 },
            { name: "e2e", size: 14 },
            { name: "fixtures", size: 9 },
          ],
        },
        {
          name: "docs",
          children: [
            { name: "guides", size: 18 },
            { name: "api", size: 12 },
            { name: "examples", size: 10 },
          ],
        },
        {
          name: "assets",
          children: [
            { name: "img", size: 16 },
            { name: "fonts", size: 6 },
          ],
        },
      ],
    };

    // compute value (sum of descendant leaf sizes) + depth
    function value(node) {
      if (node.children) {
        node._v = node.children.reduce(function (s, c) {
          return s + value(c);
        }, 0);
      } else {
        node._v = node.size || 1;
      }
      return node._v;
    }
    value(tree);

    var SIZE = 520,
      C = SIZE / 2;
    var R0 = 46; // centre disc radius
    var RING = 50; // ring thickness
    var maxDepth = 3;

    var svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("viewBox", "0 0 " + SIZE + " " + SIZE);
    svg.setAttribute("role", "img");

    // top-level branch hues
    var hues = [9, 200, 41, 145, 270, 330];

    var segs = []; // for fade-on-hover
    function arcPath(a0, a1, r0, r1) {
      // annular sector path; angles in radians, 0 at top, clockwise
      function pt(ang, r) {
        return [C + r * Math.sin(ang), C - r * Math.cos(ang)];
      }
      var large = a1 - a0 > Math.PI ? 1 : 0;
      var p0 = pt(a0, r0),
        p1 = pt(a1, r0),
        p2 = pt(a1, r1),
        p3 = pt(a0, r1);
      return (
        "M" + p0[0] + " " + p0[1] +
        "A" + r0 + " " + r0 + " 0 " + large + " 1 " + p1[0] + " " + p1[1] +
        "L" + p2[0] + " " + p2[1] +
        "A" + r1 + " " + r1 + " 0 " + large + " 0 " + p3[0] + " " + p3[1] +
        "Z"
      );
    }

    function color(depth, hue, lightT) {
      // deeper rings = lighter; saturation eases off with depth
      var sat = 58 - depth * 8;
      var light = 40 + depth * 9 + lightT * 8;
      return "hsl(" + hue + "," + sat + "%," + light + "%)";
    }

    var total = tree._v;
    // recurse: lay each node into [a0,a1] at given depth
    function layout(node, a0, a1, depth, hue) {
      if (depth > 0) {
        var r0 = R0 + (depth - 1) * RING;
        var r1 = r0 + RING;
        var path = document.createElementNS(SVGNS, "path");
        path.setAttribute("d", arcPath(a0, a1, r0, r1));
        var lightT = (a0 / (Math.PI * 2)) % 1;
        path.setAttribute("fill", color(depth, hue, lightT));
        path.setAttribute("class", "sb-seg");
        var pct = ((node._v / total) * 100).toFixed(1);
        var datum = { name: node.name, v: node._v, pct: pct, depth: depth };
        path._datum = datum;
        svg.appendChild(path);
        segs.push(path);

        path.addEventListener("mouseenter", function () {
          segs.forEach(function (s) {
            s.style.opacity = "0.28";
          });
          path.style.opacity = "1";
          path.setAttribute("stroke", "#111");
          path.setAttribute("stroke-width", "1.5");
          cName.textContent = node.name;
          cMeta.textContent = node._v + " · " + pct + "%";
        });
        path.addEventListener("mouseleave", function () {
          segs.forEach(function (s) {
            s.style.opacity = "1";
          });
          path.setAttribute("stroke-width", "1");
          path.removeAttribute("stroke");
          cName.textContent = tree.name;
          cMeta.textContent = total + " units";
        });
      }
      if (node.children && depth < maxDepth) {
        var ang = a0;
        node.children.forEach(function (c, i) {
          var span = ((a1 - a0) * c._v) / node._v;
          var h = depth === 0 ? hues[i % hues.length] : hue;
          layout(c, ang, ang + span, depth + 1, h);
          ang += span;
        });
      }
    }
    layout(tree, 0, Math.PI * 2, 0, 0);

    // centre disc + label
    var disc = document.createElementNS(SVGNS, "circle");
    disc.setAttribute("cx", C);
    disc.setAttribute("cy", C);
    disc.setAttribute("r", R0 - 4);
    disc.setAttribute("fill", "#fdfdfb");
    disc.setAttribute("stroke", "#d8d8d2");
    svg.appendChild(disc);

    var cName = document.createElementNS(SVGNS, "text");
    cName.setAttribute("x", C);
    cName.setAttribute("y", C - 2);
    cName.setAttribute("class", "sb-center-name");
    cName.textContent = tree.name;
    svg.appendChild(cName);

    var cMeta = document.createElementNS(SVGNS, "text");
    cMeta.setAttribute("x", C);
    cMeta.setAttribute("y", C + 16);
    cMeta.setAttribute("class", "sb-center-meta");
    cMeta.textContent = total + " units";
    svg.appendChild(cMeta);

    var wrap = document.createElement("div");
    wrap.className = "sunburst-wrap";
    wrap.appendChild(svg);
    mount.appendChild(wrap);
  }

  /* ======================================================================= */
  /* 6 — AGENT RUN TIMELINE (plain SVG/JS — faithful port of the live view)  */
  /* ======================================================================= */
  // A close reproduction of a production "token-consumption timeline": same
  // colours, layout, and motion (heartbeat halo + breath, traveling sliver,
  // live pulse, hover crosshair + family highlight). Data is SYNTHETIC.
  function buildTimeline(mount) {

    // ---- exact palette from the live controller (paper/ivory theme) ----
    var C = {
      codex: "#1f6feb", amber: "#ad7400", red: "#cf222e",
      trendLine: "#57606a", trendArea: "#aab1b8",
      grid: "#d8d7d0", text: "#1a1a18", muted: "#6e6e66", axis: "#adaca3",
      active: "#0f766e", hiber: "#a8511f", codexrej: "#cf222e", payrej: "#bf3989",
    };
    var W = 1180, H = 440, ML = 58, MR = 26, TOP = 46, BOT = 300,
      REJ_Y = BOT + 32, MY = BOT + 72, PR = W - MR;

    // ====================================================================
    // synthetic, generic data — no real identifiers anywhere
    // ====================================================================
    var rng = mulberry32(424242);
    var HOUR = 3600, t1 = 1750000000, t0 = t1 - 24 * HOUR;
    var llo = 3, lhi = 6.3;
    var rootSeq = 0, idSeq = 0;
    var sessions = [];
    function lognorm(a, b) {
      return Math.pow(10, a + rng() * b);
    }
    function mkSess(t, eff, prov, err, role, group, kind, label, rid) {
      var total = Math.round(eff * (1 + rng() * 0.5));
      var cache = Math.round(eff * rng() * 0.7);
      return {
        t: t, eff: eff, total: total, cache: cache, prov: prov, err: err,
        role: role, group: group, kind: kind, label: label, root_id: rid,
        n: 1 + ((rng() * 7) | 0), event_id: "e" + idSeq++,
      };
    }
    // heartbeats ~ every 55 min, some spawning 1–2 workers
    for (var t = t0 + 1200; t < t1; t += 2600 + rng() * 1600) {
      var rid = "r" + rootSeq++;
      sessions.push(
        mkSess(t, Math.round(lognorm(4.0, 1.7)), rng() < 0.78 ? "codex" : "openai",
          rng() < 0.08, "main", "hb", "heartbeat", "heartbeat run", rid)
      );
      var nw = rng() < 0.5 ? (rng() < 0.5 ? 1 : 2) : 0;
      for (var wi = 0; wi < nw; wi++) {
        sessions.push(
          mkSess(t + 140 + rng() * 600, Math.round(lognorm(3.6, 1.8)),
            rng() < 0.7 ? "codex" : "openai", rng() < 0.06, "worker", "hb",
            "heartbeat", "worker task", rid)
        );
      }
    }
    // scheduled sweeps (diamonds)
    for (var st = t0 + 5000; st < t1; st += 4 * HOUR + rng() * HOUR) {
      sessions.push(
        mkSess(st, Math.round(lognorm(3.4, 1.2)), "codex", false, "main",
          "scheduled", "scheduled sweep", "scheduled sweep", "s" + rootSeq++)
      );
    }
    // telegram replies (paper-plane glyph)
    for (var ti = 0; ti < 5; ti++) {
      sessions.push(
        mkSess(t0 + HOUR + rng() * 22 * HOUR, Math.round(lognorm(3.2, 0.9)),
          rng() < 0.5 ? "codex" : "openai", false, "main", "telegram",
          "telegram reply", "telegram reply", "t" + rootSeq++)
      );
    }

    // mode timeline (active vs hibernating) with two hibernation windows
    var hib = [[t0 + 7 * HOUR, t0 + 9.2 * HOUR], [t0 + 16 * HOUR, t0 + 18.3 * HOUR]];
    function isActive(tt) {
      for (var i = 0; i < hib.length; i++) if (tt >= hib[i][0] && tt < hib[i][1]) return false;
      return true;
    }
    function dens(tt) {
      var c = 0;
      for (var i = 0; i < sessions.length; i++) if (Math.abs(sessions[i].t - tt) < 2 * HOUR) c++;
      return c;
    }
    var mpts = [t0];
    hib.forEach(function (h) { mpts.push(h[0], h[1]); });
    mpts.push(t1);
    mpts.sort(function (a, b) { return a - b; });
    var mode = [], max24 = 1;
    mpts.forEach(function (pt) {
      var s24 = dens(pt);
      if (s24 > max24) max24 = s24;
      mode.push({ t: pt, active: isActive(pt + 1), s24: s24 });
    });

    // exponential-ish trend ribbon (geometric mean of nearby sessions)
    var trend = [], maxvol = 1;
    for (var tt = t0; tt <= t1; tt += HOUR) {
      var sum = 0, c = 0;
      for (var i = 0; i < sessions.length; i++) {
        if (Math.abs(sessions[i].t - tt) < 1.5 * HOUR) {
          sum += Math.log10(Math.max(sessions[i].eff, 1)); c++;
        }
      }
      if (c > 0) { trend.push({ t: tt, avg: Math.pow(10, sum / c), vol: c }); if (c > maxvol) maxvol = c; }
    }

    var caps = { hardkill: 350000, active_context: 250000, hibernate_context: 150000 };
    var rejections = [
      { t: t0 + 8 * HOUR + 1200, prov: "codex", label: "worker task", msg: "rate limit — provider returned 429" },
      { t: t0 + 16.5 * HOUR, prov: "openai", label: "scheduled sweep", msg: "quota exceeded for the period" },
      { t: t0 + 20 * HOUR, prov: "codex", label: "heartbeat run", msg: "temporary upstream error" },
    ];
    var D = { t0: t0, t1: t1, llo: llo, lhi: lhi, sessions: sessions, mode: mode,
      max24: max24, trend: trend, maxvol: maxvol, caps: caps, rejections: rejections };
    var view = { d0: t0, d1: t1 };

    // ---- scales + formatters (ported) -------------------------------------
    var lerp = function (t) { return ML + (t - view.d0) / (view.d1 - view.d0) * (PR - ML); };
    var unlerp = function (px) { return view.d0 + (px - ML) / (PR - ML) * (view.d1 - view.d0); };
    var norm = function (v) { return (Math.log10(Math.max(v, 1)) - D.llo) / (D.lhi - D.llo); };
    var ypix = function (v) { return BOT - norm(v) * (BOT - TOP); };
    var vpix = function (py) { return Math.pow(10, D.llo + (BOT - py) / (BOT - TOP) * (D.lhi - D.llo)); };
    var rpix = function (v) { return Math.max(3, 14 * Math.sqrt(v / Math.pow(10, D.lhi))); };
    var fmtTok = function (v) { return v >= 1e6 ? (v / 1e6).toFixed(2) + "M" : v >= 1e3 ? Math.round(v / 1e3) + "k" : Math.round(v); };
    var fmtTime = function (t) {
      return new Date(t * 1000).toLocaleString("en-US",
        { timeZone: "America/New_York", month: "numeric", day: "numeric", hour: "numeric", minute: "2-digit" });
    };
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
    var pickStep = function () {
      var want = (view.d1 - view.d0) / 8;
      return [3600, 10800, 21600, 43200, 86400, 172800].find(function (s) { return s >= want; }) || 172800;
    };

    // ---- DOM scaffold -----------------------------------------------------
    mount.innerHTML = "";
    var bar = document.createElement("div");
    bar.className = "tl-topbar";
    bar.innerHTML = '<span class="tl-live">&#9679; live</span>' + legendHTML();
    mount.appendChild(bar);

    var wrap = document.createElement("div");
    wrap.className = "tl-chart-wrap";
    var svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("class", "tl-svg");
    svg.innerHTML = '<g id="tlb"></g><g id="tlo"></g>';
    wrap.appendChild(svg);
    var tip = document.createElement("div");
    tip.className = "tl-tip";
    wrap.appendChild(tip);
    mount.appendChild(wrap);
    var base = svg.querySelector("#tlb"), over = svg.querySelector("#tlo");
    var hoverPts = [], rejPts = [];

    function legendHTML() {
      var dot = function (c, extra) {
        return '<svg width="13" height="13" viewBox="0 0 13 13">' + (extra || "") + '<circle cx="6.5" cy="6.5" r="4" fill="' + c + '"/></svg>';
      };
      var bar2 = function (c) { return '<svg width="20" height="9" viewBox="0 0 20 9"><rect width="20" height="6" y="1.5" fill="' + c + '" opacity="0.6"/></svg>'; };
      var items = [
        [dot(C.codex), "codex"],
        [dot(C.amber), "pay-per-use"],
        [dot(C.red), "error"],
        [dot(C.codex, '<circle cx="6.5" cy="6.5" r="6" fill="none" stroke="' + C.codex + '" stroke-width="0.8" opacity="0.5"/>'), "heartbeat"],
        ['<svg width="13" height="13" viewBox="0 0 13 13"><polygon points="6.5,1.5 11,6.5 6.5,11 2,6.5" fill="' + C.codex + '"/></svg>', "scheduled"],
        [bar2(C.active), "active"],
        [bar2(C.hiber), "hibernating"],
        ['<svg width="13" height="13" viewBox="0 0 13 13"><line x1="6.5" y1="1" x2="6.5" y2="12" stroke="' + C.payrej + '" stroke-width="1.6"/></svg>', "rejection"],
      ];
      return '<span class="tl-legend">' + items.map(function (it) {
        return '<span class="tl-leg">' + it[0] + it[1] + "</span>";
      }).join("") + "</span>";
    }

    // ---- base layer (ported drawBase, single static window) ---------------
    function drawBase() {
      var s = "";
      // decade gridlines + token labels
      for (var e = Math.floor(D.llo); e <= Math.ceil(D.lhi); e++) {
        var v = Math.pow(10, e), yp = ypix(v);
        if (yp > BOT + 1 || yp < TOP - 1) continue;
        var y = yp.toFixed(1);
        s += '<line x1="' + ML + '" y1="' + y + '" x2="' + PR + '" y2="' + y + '" stroke="' + C.grid + '"/>';
        s += '<text x="' + (ML - 7) + '" y="' + (+y + 3).toFixed(1) + '" fill="' + C.muted + '" font-size="9" text-anchor="end">' + fmtTok(v) + "</text>";
      }
      // time gridlines + labels
      var step = pickStep();
      for (var tk = Math.ceil(view.d0 / step) * step; tk <= view.d1; tk += step) {
        var x = lerp(tk).toFixed(1);
        s += '<line x1="' + x + '" y1="' + TOP + '" x2="' + x + '" y2="' + BOT + '" stroke="' + C.grid + '" stroke-dasharray="2 4"/>';
        s += '<text x="' + x + '" y="' + (BOT + 14) + '" fill="' + C.muted + '" font-size="9" text-anchor="middle">' + fmtTime(tk) + "</text>";
      }
      // axes
      s += '<line x1="' + ML + '" y1="' + TOP + '" x2="' + ML + '" y2="' + BOT + '" stroke="' + C.axis + '"/>';
      s += '<line x1="' + ML + '" y1="' + BOT + '" x2="' + PR + '" y2="' + BOT + '" stroke="' + C.axis + '"/>';
      // marginal rugs (per session)
      for (var ri = 0; ri < D.sessions.length; ri++) {
        var dd = D.sessions[ri];
        var rx = lerp(dd.t), ry = ypix(dd.eff);
        s += '<line x1="' + rx.toFixed(1) + '" y1="' + BOT + '" x2="' + rx.toFixed(1) + '" y2="' + (BOT + 4) + '" stroke="' + C.muted + '" stroke-width="0.8" opacity="0.22"/>';
        s += '<line x1="' + (ML - 4) + '" y1="' + ry.toFixed(1) + '" x2="' + ML + '" y2="' + ry.toFixed(1) + '" stroke="' + C.muted + '" stroke-width="0.8" opacity="0.22"/>';
      }
      // trend ribbon
      if (D.trend.length > 1) {
        var hw = function (p) { return D.maxvol > 0 ? p.vol / D.maxvol * 12 : 0; };
        var topL = D.trend.map(function (p) { return lerp(p.t).toFixed(1) + "," + (ypix(p.avg) - hw(p)).toFixed(1); });
        var botL = D.trend.map(function (p) { return lerp(p.t).toFixed(1) + "," + (ypix(p.avg) + hw(p)).toFixed(1); }).reverse();
        s += '<polygon points="' + topL.concat(botL).join(" ") + '" fill="' + C.trendArea + '" fill-opacity="0.16"/>';
        s += '<polyline points="' + D.trend.map(function (p) { return lerp(p.t).toFixed(1) + "," + ypix(p.avg).toFixed(1); }).join(" ") + '" fill="none" stroke="' + C.trendLine + '" stroke-width="1.3" opacity="0.8"/>';
      }
      // hard-kill ceiling
      if (D.caps.hardkill > 0) {
        var hky = ypix(D.caps.hardkill).toFixed(1);
        s += '<line x1="' + ML + '" y1="' + hky + '" x2="' + PR + '" y2="' + hky + '" stroke="#d1242f" stroke-width="1.4" opacity="0.7"/>';
      }
      // positions + families
      hoverPts = [];
      var fam = {};
      for (var pi = 0; pi < D.sessions.length; pi++) {
        var d2 = D.sessions[pi];
        var p = { x: lerp(d2.t), y: ypix(d2.eff), r: rpix(d2.eff), d: d2 };
        hoverPts.push(p);
        (fam[d2.root_id] = fam[d2.root_id] || []).push(p);
      }
      // connector lines + traveling sliver (heartbeat main -> workers)
      for (var rid in fam) {
        var g = fam[rid];
        if (g.length < 2) continue;
        var main = g.find(function (q) { return q.d.role === "main"; }) || g[0];
        for (var gi = 0; gi < g.length; gi++) {
          var p2 = g[gi];
          if (p2 === main) continue;
          s += '<line x1="' + main.x.toFixed(1) + '" y1="' + main.y.toFixed(1) + '" x2="' + p2.x.toFixed(1) + '" y2="' + p2.y.toFixed(1) + '" stroke="' + C.muted + '" stroke-width="1" opacity="0.42"/>';
          s += '<circle r="1.6" fill="#1f6feb"><animateMotion dur="5s" repeatCount="indefinite" path="M ' + main.x.toFixed(1) + " " + main.y.toFixed(1) + " L " + p2.x.toFixed(1) + " " + p2.y.toFixed(1) + '"/><animate attributeName="opacity" dur="5s" repeatCount="indefinite" values="0;0.7;0.35;0"/></circle>';
        }
      }
      // dots — largest first so small dots land on top
      var ordered = hoverPts.slice().sort(function (a, b) { return b.r - a.r; });
      for (var oi = 0; oi < ordered.length; oi++) {
        var pp = ordered[oi], d = pp.d, x2 = pp.x, y2 = pp.y, r = pp.r;
        var fill = d.err ? C.red : d.prov === "openai" ? C.amber : C.codex;
        var op = d.role === "worker" ? 0.5 : 0.82;
        var a = 'fill="' + fill + '" fill-opacity="' + op + '" stroke="#e8e7e2" stroke-width="0.6" data-eid="' + esc(d.event_id) + '"';
        if (d.group === "hb" && d.role === "main") {
          var hwk = Math.max(0.6, r * 0.08);
          s += '<circle cx="' + x2.toFixed(1) + '" cy="' + y2.toFixed(1) + '" r="' + (r + 2.5).toFixed(1) + '" fill="none" stroke="' + fill + '" stroke-width="' + hwk.toFixed(2) + '" opacity="0.4"/>';
          s += '<circle class="hbpulse" cx="' + x2.toFixed(1) + '" cy="' + y2.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="none" stroke="' + fill + '" stroke-width="' + hwk.toFixed(2) + '"/>';
        }
        if (d.group === "scheduled") {
          var dd2 = r * 1.3;
          s += '<polygon points="' + x2 + "," + (y2 - dd2).toFixed(1) + " " + (x2 + dd2).toFixed(1) + "," + y2 + " " + x2 + "," + (y2 + dd2).toFixed(1) + " " + (x2 - dd2).toFixed(1) + "," + y2 + '" ' + a + "/>";
        } else if (d.group === "telegram") {
          s += '<circle cx="' + x2.toFixed(1) + '" cy="' + y2.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="' + fill + '" fill-opacity="0.32" stroke="#e8e7e2" stroke-width="0.6" data-eid="' + esc(d.event_id) + '"/>';
          var sc = (r * 1.7) / 24;
          s += '<g transform="translate(' + (x2 - 12 * sc).toFixed(2) + "," + (y2 - 12 * sc).toFixed(2) + ") scale(" + sc.toFixed(3) + ')"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.27 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" fill="#1f6feb" fill-opacity="0.65"/></g>';
        } else {
          s += '<circle cx="' + x2.toFixed(1) + '" cy="' + y2.toFixed(1) + '" r="' + r.toFixed(1) + '" ' + a + "/>";
        }
      }
      // session-cap segments per mode (horizontal dashed)
      var capFor = function (active) { return active ? D.caps.active_context : (D.caps.hibernate_context || D.caps.active_context); };
      var rs = null, ra = null;
      var capSeg = function (endT) {
        if (rs === null) return;
        var cap = capFor(ra);
        if (cap) {
          var y = Math.max(TOP, Math.min(BOT, ypix(cap))).toFixed(1);
          s += '<line x1="' + lerp(rs).toFixed(1) + '" y1="' + y + '" x2="' + lerp(endT).toFixed(1) + '" y2="' + y + '" stroke="' + (ra ? C.active : C.hiber) + '" stroke-width="1" stroke-dasharray="2 3" opacity="0.55"/>';
        }
        rs = null;
      };
      for (var mi = 0; mi < D.mode.length; mi++) {
        var m = D.mode[mi];
        if (ra === null) { rs = m.t; ra = m.active; }
        else if (m.active !== ra) { capSeg(m.t); rs = m.t; ra = m.active; }
      }
      if (D.mode.length) capSeg(D.mode[D.mode.length - 1].t);
      // rejection rug
      rejPts = [];
      for (var rj = 0; rj < D.rejections.length; rj++) {
        var r2 = D.rejections[rj];
        var rxx = lerp(r2.t), col = r2.prov === "openai" ? C.payrej : C.codexrej;
        s += '<line x1="' + rxx.toFixed(1) + '" y1="' + (REJ_Y - 6) + '" x2="' + rxx.toFixed(1) + '" y2="' + (REJ_Y + 6) + '" stroke="' + col + '" stroke-width="1.3" opacity="0.25"/>';
        rejPts.push({ x: rxx, rj: r2 });
      }
      // mode ribbon (width by trailing activity)
      var mw = function (p) { return 0.8 + (D.max24 > 0 ? p.s24 / D.max24 * 9 : 0); };
      for (var mj = 0; mj < D.mode.length - 1; mj++) {
        var aM = D.mode[mj], bM = D.mode[mj + 1];
        var xa = lerp(aM.t), xb = lerp(bM.t), wa = mw(aM), wb = mw(bM);
        var colM = aM.active ? C.active : C.hiber;
        s += '<polygon points="' + xa.toFixed(1) + "," + (MY - wa).toFixed(1) + " " + xb.toFixed(1) + "," + (MY - wb).toFixed(1) + " " + xb.toFixed(1) + "," + (MY + wb).toFixed(1) + " " + xa.toFixed(1) + "," + (MY + wa).toFixed(1) + '" fill="' + colM + '" fill-opacity="0.5"/>';
      }
      base.innerHTML = s;
    }

    // ---- hover overlay (crosshair + family highlight + tooltip) -----------
    function drawOver(px, py, ox, oy) {
      var s = "";
      var inPlot = px >= ML && px <= PR && py >= TOP && py <= BOT;
      if (inPlot) {
        s += '<line x1="' + px.toFixed(1) + '" y1="' + TOP + '" x2="' + px.toFixed(1) + '" y2="' + BOT + '" stroke="' + C.muted + '" stroke-dasharray="3 3" opacity="0.7"/>';
        s += '<line x1="' + ML + '" y1="' + py.toFixed(1) + '" x2="' + PR + '" y2="' + py.toFixed(1) + '" stroke="' + C.muted + '" stroke-dasharray="3 3" opacity="0.7"/>';
        s += '<rect x="' + (px - 38).toFixed(1) + '" y="' + (BOT + 2) + '" width="76" height="14" fill="#fbfbf8" stroke="' + C.axis + '"/>';
        s += '<text x="' + px.toFixed(1) + '" y="' + (BOT + 12) + '" fill="' + C.text + '" font-size="9" text-anchor="middle">' + fmtTime(unlerp(px)) + "</text>";
        s += '<rect x="2" y="' + (py - 8).toFixed(1) + '" width="50" height="15" fill="#fbfbf8" stroke="' + C.axis + '"/>';
        s += '<text x="48" y="' + (py + 3).toFixed(1) + '" fill="' + C.text + '" font-size="9" text-anchor="end">' + fmtTok(vpix(py)) + "</text>";
      }
      var best = null, bd = 256;
      for (var i = 0; i < hoverPts.length; i++) {
        var p = hoverPts[i], dx = p.x - px, dy = p.y - py, d2 = dx * dx + dy * dy;
        if (d2 < bd) { bd = d2; best = p; }
      }
      if (best) {
        var fam = hoverPts.filter(function (p) { return p.d.root_id === best.d.root_id; });
        var main = fam.find(function (p) { return p.d.role === "main"; }) || fam[0];
        for (var fi = 0; fi < fam.length; fi++) {
          if (fam[fi] !== main) s += '<line x1="' + main.x.toFixed(1) + '" y1="' + main.y.toFixed(1) + '" x2="' + fam[fi].x.toFixed(1) + '" y2="' + fam[fi].y.toFixed(1) + '" stroke="' + C.text + '" stroke-width="1.4" opacity="0.75"/>';
        }
        for (var fj = 0; fj < fam.length; fj++) {
          var pf = fam[fj];
          s += '<circle cx="' + pf.x.toFixed(1) + '" cy="' + pf.y.toFixed(1) + '" r="' + (pf.r + 2.5).toFixed(1) + '" fill="none" stroke="' + C.text + '" stroke-width="' + (pf === best ? 1.9 : 1.1) + '"/>';
        }
        var d = best.d;
        var famNote = fam.length > 1 ? '<br><span style="color:' + C.muted + '">family: 1 heartbeat + ' + (fam.length - 1) + " worker" + (fam.length - 1 > 1 ? "s" : "") + "</span>" : "";
        var totalNote = d.cache > 0 ? '<br><span style="color:' + C.muted + '">' + fmtTok(d.total) + " total · " + fmtTok(d.cache) + " cache</span>" : "";
        tip.innerHTML = "<b>" + esc(d.kind) + (d.role === "worker" ? " · worker" : "") + "</b> · " + esc(d.label) + "<br>" + fmtTok(d.eff) + " effective · " + d.n + " calls · " + esc(d.prov) + (d.err ? " · <span style='color:#cf222e'>ERROR</span>" : "") + totalNote + famNote;
        tip.style.left = Math.min(ox + 14, mount.clientWidth - 250) + "px";
        tip.style.top = (oy + 14) + "px";
        tip.style.opacity = 1;
      } else {
        var rb = null, rbd = 36;
        if (py >= REJ_Y - 9 && py <= REJ_Y + 9) {
          for (var k = 0; k < rejPts.length; k++) {
            var dxr = rejPts[k].x - px;
            if (dxr * dxr < rbd) { rbd = dxr * dxr; rb = rejPts[k]; }
          }
        }
        if (rb) {
          s += '<line x1="' + rb.x.toFixed(1) + '" y1="' + (REJ_Y - 7) + '" x2="' + rb.x.toFixed(1) + '" y2="' + (REJ_Y + 7) + '" stroke="' + C.text + '" stroke-width="2"/>';
          var r3 = rb.rj;
          tip.innerHTML = '<b style="color:' + (r3.prov === "openai" ? C.payrej : C.codexrej) + '">' + (r3.prov === "openai" ? "pay-per-use rejected" : "codex rejected") + "</b> · " + esc(r3.label) + "<br>" + esc(r3.msg);
          tip.style.left = Math.min(ox + 14, mount.clientWidth - 250) + "px";
          tip.style.top = (oy + 14) + "px";
          tip.style.opacity = 1;
        } else {
          tip.style.opacity = 0;
        }
      }
      over.innerHTML = s;
    }

    svg.addEventListener("mousemove", function (e) {
      var r = svg.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width * W;
      var py = (e.clientY - r.top) / r.height * H;
      var wr = wrap.getBoundingClientRect();
      drawOver(px, py, e.clientX - wr.left, e.clientY - wr.top);
    });
    svg.addEventListener("mouseleave", function () { over.innerHTML = ""; tip.style.opacity = 0; });

    drawBase();
  }

  /* ======================================================================= */
  /* boot                                                                    */
  /* ======================================================================= */
  function boot() {
    var has3D = typeof THREE !== "undefined";
    var g, s, su, gr, sb;
    if (has3D) {
      g = document.getElementById("mount-globe");
      s = document.getElementById("mount-scatter");
      su = document.getElementById("mount-surface");
      if (g) buildGlobe(g);
      if (s) buildScatter(s);
      if (su) buildSurface(su);
    } else {
      ["mount-globe", "mount-scatter", "mount-surface"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el)
          el.innerHTML =
            '<div class="scene-msg">three.js failed to load locally.</div>';
      });
    }
    gr = document.getElementById("mount-graph");
    if (gr) buildGraph(gr);
    sb = document.getElementById("mount-sunburst");
    if (sb) buildSunburst(sb);
    var tl = document.getElementById("mount-timeline");
    if (tl) buildTimeline(tl);
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

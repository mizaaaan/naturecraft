(function () {
  "use strict";
  /* ---------- Scene engine: pointed-arch window onto a Gulf garden ---------- */
  const f = (n) => Math.round(n * 10) / 10;
  function mulberry(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const ARCH = "M2 560V240C2 142 112 54 200 2C288 54 398 142 398 240V560Z";

  /* Scene palettes: these color values change the illustration for each time of day. */
  const TOD = {
    day: {
      sky: ["#4FAFC4", "#9DD3D0", "#F4E7C1"],
      haze: "#F6EBC9",
      sun: { x: 292, y: 104, r: 20, c: "#FFF8DC", g: "#FFF3C0" },
      stars: 0,
      far: "#A9C4BE",
      far2: "#8DB0A8",
      lights: 0,
      wall: "#EBDDBA",
      wallS: "#CDB78A",
      latBack: "#6B5636",
      latLine: "#C9A35A",
      ground: "#E8D7AC",
      groundS: "#CDB886",
      paveA: "#1F9E94",
      paveB: "#DDB45E",
      hedge: "#2E8B55",
      hedgeL: "#58B574",
      trunk: "#7B5733",
      trunkS: "#4A3319",
      frond: "#2F8F52",
      frond2: "#5DB873",
      water: "#3AB3BC",
      waterL: "#C6F1EE",
      stone: "#F3E8C8",
      bloom: "#E04A86",
      glow: 0,
      shade: 0.16,
      agave: "#5A9A86",
      agaveL: "#8DC2AE",
      pot: "#B9764A",
      gravel: "#E3D2A6",
    },
    dusk: {
      sky: ["#0F3140", "#3E6068", "#F0A25E"],
      haze: "#F2B472",
      sun: { x: 112, y: 322, r: 30, c: "#FFD98F", g: "#FF9F55" },
      stars: 0.28,
      far: "#27474D",
      far2: "#1C3C42",
      lights: 0.75,
      wall: "#C7A474",
      wallS: "#8A6A44",
      latBack: "#F2B65A",
      latLine: "#4A3320",
      ground: "#B08A58",
      groundS: "#8A6A42",
      paveA: "#1F8A84",
      paveB: "#E4B964",
      hedge: "#15573A",
      hedgeL: "#2A7F55",
      trunk: "#3E2B1A",
      trunkS: "#22160B",
      frond: "#10563B",
      frond2: "#1F8059",
      water: "#2A8D96",
      waterL: "#F2B76E",
      stone: "#D9BE8C",
      bloom: "#E0508C",
      glow: 0.6,
      shade: 0.3,
      agave: "#2D6B5B",
      agaveL: "#4A937F",
      pot: "#8B5233",
      gravel: "#B8935E",
    },
    night: {
      sky: ["#03161A", "#0A2D32", "#14444A"],
      haze: "#1D5A58",
      sun: { x: 296, y: 92, r: 15, c: "#EAF6EE", g: "#BFE8DE" },
      moon: 1,
      stars: 1,
      far: "#0A2529",
      far2: "#071C20",
      lights: 1,
      wall: "#2B4A43",
      wallS: "#183029",
      latBack: "#F6C464",
      latLine: "#17261F",
      ground: "#1E3C34",
      groundS: "#122A24",
      paveA: "#146B68",
      paveB: "#C9A35A",
      hedge: "#0E4A33",
      hedgeL: "#1C7050",
      trunk: "#2A1E12",
      trunkS: "#140D07",
      frond: "#0D5A41",
      frond2: "#1A8461",
      water: "#126F78",
      waterL: "#F7CB77",
      stone: "#6F8E80",
      bloom: "#C23872",
      glow: 1,
      shade: 0.45,
      agave: "#1D5A4C",
      agaveL: "#3A8A74",
      pot: "#5E3724",
      gravel: "#26443B",
    },
  };

  /* Reusable SVG pieces used to assemble the garden scenes. */
  function shd(P, x, y, rx, ry, o) {
    return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="#000" opacity="${o === undefined ? f(P.shade * 0.7) : o}"/>`;
  }

  function palm(P, u, x, y, h, lean, k, delay) {
    const cx = x + lean,
      cy = y - h,
      wb = 3 + h * 0.028,
      wt = 1.6 + h * 0.012;
    let g = shd(P, x, y + 2, h * 0.2, h * 0.035);
    g += `<path d="M${f(x - wb)} ${y}Q${f(x - wb + lean * 0.15)} ${f(y - h * 0.55)} ${f(cx - wt)} ${f(cy)}L${f(cx + wt)} ${f(cy)}Q${f(x + wb + lean * 0.15)} ${f(y - h * 0.55)} ${f(x + wb)} ${y}Z" fill="${P.trunk}"/>`;
    g += `<path d="M${x} ${y}Q${f(x + lean * 0.15)} ${f(y - h * 0.55)} ${f(cx)} ${f(cy)}" stroke="${P.trunkS}" stroke-width="${f(wb * 1.1)}" stroke-dasharray="1.2 3.4" fill="none" opacity=".6"/>`;
    if (P.glow)
      g += `<ellipse cx="${x}" cy="${y - 6}" rx="${f(h * 0.16)}" ry="${f(h * 0.08)}" fill="url(#gl${u})" opacity="${f(P.glow * 0.55)}"/>`;
    const L = Math.max(28, Math.min(74, h * 0.4)) * k;
    let fr = "";
    [200, 222, 244, 266, 288, 310, 332, 162, 18, 176, 4].forEach((a, i) => {
      const r = (a * Math.PI) / 180,
        c = Math.cos(r),
        s = Math.sin(r);
      const ex = cx + L * c,
        ey = cy + L * s * 0.75 + Math.abs(c) * L * 0.4,
        qx = cx + L * 0.55 * c,
        qy = cy + L * 0.55 * s - L * 0.22;
      const d = `M${f(cx)} ${f(cy)}Q${f(qx)} ${f(qy)} ${f(ex)} ${f(ey)}`;
      fr += `<path d="${d}" stroke="${i % 2 ? P.frond2 : P.frond}" stroke-width="${f(L * 0.18)}" stroke-dasharray="1.3 1.5" fill="none"/><path d="${d}" stroke="${P.trunkS}" stroke-opacity=".5" stroke-width="1" fill="none"/>`;
    });
    fr += `<circle cx="${f(cx - 3)}" cy="${f(cy + 4)}" r="2.4" fill="#C5762B"/><circle cx="${f(cx + 3)}" cy="${f(cy + 5)}" r="2.4" fill="#B5651F"/><circle cx="${f(cx)}" cy="${f(cy + 7)}" r="2.4" fill="#C5762B"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(L * 0.06 + 2)}" fill="${P.trunk}"/>`;
    return `<g>${g}<g class="sway" style="transform-origin:${f(cx)}px ${f(cy)}px;animation-delay:-${delay}s">${fr}</g></g>`;
  }

  function shrub(P, x, y, r, flower, rnd) {
    let s = shd(P, x, y + r * 0.55, r * 1.15, r * 0.28);
    [
      [0, 0, 1],
      [-0.7, 0.25, 0.78],
      [0.7, 0.25, 0.78],
      [0, -0.4, 0.74],
    ].forEach(([dx, dy, k]) => {
      s += `<circle cx="${f(x + dx * r)}" cy="${f(y + dy * r)}" r="${f(r * k)}" fill="${P.hedge}"/>`;
    });
    [
      [-0.25, -0.55, 0.45],
      [0.35, -0.15, 0.38],
      [-0.6, 0.1, 0.34],
    ].forEach(([dx, dy, k]) => {
      s += `<circle cx="${f(x + dx * r)}" cy="${f(y + dy * r)}" r="${f(r * k)}" fill="${P.hedgeL}" opacity=".85"/>`;
    });
    if (flower) {
      for (let i = 0; i < 10; i++) {
        const a = rnd() * 6.283,
          d = rnd() * r * 0.9;
        s += `<circle cx="${f(x + Math.cos(a) * d)}" cy="${f(y - r * 0.2 + Math.sin(a) * d * 0.8)}" r="${f(1.4 + rnd() * 1.3)}" fill="${flower}"/>`;
      }
    }
    return s;
  }

  function lantern(P, u, x, y, len, s) {
    const on = P.glow > 0,
      lamp = on ? "#FFD98A" : "#8E6B2E",
      br = "#C9A35A";
    let g = "";
    if (len)
      g += `<line x1="${x}" y1="${f(y - len)}" x2="${x}" y2="${y}" stroke="${br}" stroke-width="1"/>`;
    if (on)
      g += `<circle class="fl" cx="${x}" cy="${f(y + 16 * s)}" r="${f(56 * s)}" fill="url(#gl${u})" opacity="${P.glow}"/>`;
    g += `<path d="M${f(x - 3 * s)} ${y}h${f(6 * s)}l${f(6 * s)} ${f(8 * s)}h${f(-18 * s)}z" fill="${br}"/>`;
    g += `<path d="M${f(x - 9 * s)} ${f(y + 8 * s)}h${f(18 * s)}l${f(-3 * s)} ${f(20 * s)}h${f(-12 * s)}z" fill="${lamp}" stroke="${br}" stroke-width="${f(1.1 * s)}"/>`;
    g += `<path d="M${f(x - 3 * s)} ${f(y + 8 * s)}v${f(20 * s)}M${f(x + 3 * s)} ${f(y + 8 * s)}v${f(20 * s)}" stroke="${br}" stroke-width="${f(0.7 * s)}"/>`;
    g += `<path d="M${f(x - 6 * s)} ${f(y + 28 * s)}h${f(12 * s)}l${f(-3 * s)} ${f(5 * s)}h${f(-6 * s)}z" fill="${br}"/>`;
    return g;
  }

  function star16(R, r, rot) {
    let d = "";
    for (let k = 0; k < 16; k++) {
      const a = ((k * 22.5 + rot - 90) * Math.PI) / 180,
        rr = k % 2 ? r : R;
      d += (k ? "L" : "M") + f(Math.cos(a) * rr) + " " + f(Math.sin(a) * rr);
    }
    return d + "Z";
  }
  function starPave(P, cx, cy, R, sy) {
    return `<g transform="translate(${cx} ${cy}) scale(1 ${sy})"><circle r="${f(R * 1.08)}" fill="${P.stone}" opacity=".35"/><path d="${star16(R, R * 0.74, 0)}" fill="${P.paveB}" opacity=".92"/><path d="${star16(R * 0.62, R * 0.46, 22.5)}" fill="${P.paveA}"/><circle r="${f(R * 0.26)}" fill="${P.paveB}"/></g>`;
  }

  function fountain(P, u, cx, y, s) {
    const w = 60 * s,
      h = 16 * s;
    let g = `<ellipse cx="${cx}" cy="${f(y + 3 * s)}" rx="${f(w + 8 * s)}" ry="${f(h + 3 * s)}" fill="#000" opacity="${f(P.shade * 0.6)}"/>`;
    g += `<ellipse cx="${cx}" cy="${y}" rx="${f(w)}" ry="${f(h)}" fill="${P.stone}"/>`;
    g += `<ellipse cx="${cx}" cy="${f(y + 1.5 * s)}" rx="${f(w - 6 * s)}" ry="${f(h - 4 * s)}" fill="${P.water}"/>`;
    g += `<ellipse class="ripple" cx="${cx}" cy="${f(y + 2 * s)}" rx="${f(w - 18 * s)}" ry="${f(h - 8 * s)}" fill="none" stroke="${P.waterL}" stroke-width="1" opacity=".7"/>`;
    g += `<rect x="${f(cx - 4 * s)}" y="${f(y - 44 * s)}" width="${f(8 * s)}" height="${f(46 * s)}" fill="${P.stone}"/>`;
    g += `<path d="M${f(cx - 26 * s)} ${f(y - 40 * s)}Q${cx} ${f(y - 20 * s)} ${f(cx + 26 * s)} ${f(y - 40 * s)}Z" fill="${P.stone}"/>`;
    g += `<ellipse cx="${cx}" cy="${f(y - 40 * s)}" rx="${f(26 * s)}" ry="${f(5 * s)}" fill="${P.water}"/>`;
    g += `<circle cx="${cx}" cy="${f(y - 58 * s)}" r="${f(4 * s)}" fill="${P.stone}"/>`;
    [
      [-1, 1],
      [1, 1],
      [-0.62, 0.75],
      [0.62, 0.75],
      [-0.3, 0.5],
      [0.3, 0.5],
    ].forEach(([d, k]) => {
      const x2 = cx + d * 42 * s,
        y2 = Math.abs(d) < 0.5 ? y - 40 * s : y + 1 * s,
        qx = cx + d * 22 * s,
        qy = y - 58 * s - 70 * s * (0.55 + Math.abs(d) * 0.45) * k;
      g += `<path class="jet" d="M${cx} ${f(y - 58 * s)}Q${f(qx)} ${f(qy)} ${f(x2)} ${f(y2)}" stroke="${P.waterL}" stroke-width="${f(2 * s)}" fill="none" stroke-linecap="round" opacity=".95"/>`;
    });
    return g;
  }

  function groundPlane(P, u, top, fill) {
    let g = `<rect x="-20" y="${top}" width="440" height="${580 - top}" fill="${fill || P.ground}"/>`;
    [-260, -140, -40, 60, 150, 250, 350, 450, 560, 660].forEach((xi) => {
      const x0 = 200 + ((xi - 200) * (top - 336)) / (570 - 336);
      g += `<line x1="${f(x0)}" y1="${top}" x2="${xi}" y2="570" stroke="${P.groundS}" stroke-width="1" opacity=".45"/>`;
    });
    [top + 14, top + 32, top + 56, top + 90, top + 136].forEach((y) => {
      g += `<line x1="-20" y1="${y}" x2="420" y2="${y}" stroke="${P.groundS}" stroke-width="1" opacity=".5"/>`;
    });
    g += `<rect x="-20" y="${top}" width="440" height="14" fill="#000" opacity="${f(P.shade * 0.5)}"/>`;
    return g;
  }

  function skyLayer(P, u, rnd) {
    let g = `<g class="L" style="--d:0"><rect x="-40" y="-40" width="480" height="470" fill="url(#sk${u})"/>`;
    if (P.stars) {
      for (let i = 0; i < 46; i++) {
        const x = rnd() * 400,
          y = rnd() * 250,
          r = rnd() * 1.2 + 0.4;
        g += `<circle class="tw" cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#FFF6D8" opacity="${f(P.stars * (0.5 + rnd() * 0.5))}" style="animation-delay:-${f(rnd() * 3)}s"/>`;
      }
    }
    const s = P.sun;
    g += `<circle cx="${s.x}" cy="${s.y}" r="${s.r * 4.2}" fill="url(#sg${u})" opacity="${P.moon ? 0.55 : 0.8}"/><circle cx="${s.x}" cy="${s.y}" r="${s.r}" fill="${s.c}"/>`;
    if (P.moon)
      g += `<circle cx="${s.x + 7}" cy="${s.y - 4}" r="${s.r * 0.92}" fill="${P.sky[1]}"/>`;
    g += `<rect x="-40" y="250" width="480" height="100" fill="url(#hz${u})"/></g>`;
    return g;
  }

  function skylineLayer(P, rnd) {
    const far = [
      [16, 24, 66, "r"],
      [46, 22, 92, "r"],
      [80, 30, 58, "r"],
      [120, 34, 122, "c"],
      [162, 26, 82, "r"],
      [203, 44, 142, "t"],
      [246, 26, 98, "r"],
      [282, 34, 74, "r"],
      [322, 32, 130, "g"],
      [358, 28, 90, "r"],
      [390, 30, 62, "r"],
    ];
    const near = [
      [34, 40, 40, "r"],
      [100, 28, 52, "r"],
      [150, 36, 36, "r"],
      [228, 30, 48, "r"],
      [300, 40, 38, "r"],
      [372, 34, 52, "r"],
    ];
    const row = (list, fill, base) => {
      let g = "";
      list.forEach(([x, w, h, t]) => {
        const top = base - h,
          x0 = x - w / 2;
        if (t === "r")
          g += `<rect x="${f(x0)}" y="${top}" width="${w}" height="${h}" fill="${fill}"/>`;
        else if (t === "c")
          g += `<path d="M${f(x0)} ${base}V${f(top + w / 2)}A${w / 2} ${w / 2} 0 0 1 ${f(x + w / 2)} ${f(top + w / 2)}V${base}Z" fill="${fill}"/>`;
        else if (t === "t")
          g += `<path d="M${f(x0)} ${top}L${f(x + w / 2)} ${top}L${f(x + w * 0.2)} ${f(top + h * 0.52)}L${f(x + w / 2)} ${base}L${f(x0)} ${base}L${f(x - w * 0.2)} ${f(top + h * 0.52)}Z" fill="${fill}"/>`;
        else
          g += `<path d="M${f(x0)} ${base}L${f(x - w * 0.3)} ${top + 12}L${x} ${top}L${f(x + w * 0.3)} ${top + 12}L${f(x + w / 2)} ${base}Z" fill="${fill}"/><rect x="${f(x - 0.8)}" y="${top - 14}" width="1.6" height="14" fill="${fill}"/>`;
        if (P_lights) {
          for (let yy = top + 9; yy < base - 6; yy += 8) {
            for (let xx = x0 + 3; xx < x0 + w - 3; xx += 6) {
              if (rnd() < 0.26)
                g += `<rect x="${f(xx)}" y="${yy}" width="2" height="3" fill="#FFD27A" opacity="${f(P_lights * (0.45 + rnd() * 0.55))}"/>`;
            }
          }
        }
      });
      return g;
    };
    let P_lights = 0;
    return {
      build: (P2) => {
        P_lights = P2.lights;
        return `<g class="L" style="--d:2">${row(far, P2.far, 346)}${row(near, P2.far2, 346)}</g>`;
      },
    };
  }

  function wallArcade(P, u, xs, base, top) {
    let m = "";
    for (let x = -12; x < 420; x += 22)
      m += `M${x} ${top}L${x + 11} ${top - 15}L${x + 22} ${top}Z`;
    let g = `<path d="${m}" fill="${P.wall}"/><rect x="-12" y="${top}" width="430" height="${base - top}" fill="${P.wall}"/><rect x="-12" y="${top}" width="430" height="${base - top}" fill="url(#wl${u})"/>`;
    xs.forEach((x) => {
      const d = `M${x - 33} ${base}V${base - 36}C${x - 33} ${base - 52} ${x - 14} ${base - 60} ${x} ${base - 72}C${x + 14} ${base - 60} ${x + 33} ${base - 52} ${x + 33} ${base - 36}V${base}Z`;
      if (P.glow)
        g += `<circle class="fl" cx="${x}" cy="${base - 30}" r="64" fill="url(#gl${u})" opacity="${f(P.glow * 0.5)}"/>`;
      g += `<path d="${d}" fill="${P.latBack}"/><path d="${d}" fill="url(#lt${u})"/><path d="${d}" fill="none" stroke="${P.wallS}" stroke-width="3"/>`;
    });
    return g;
  }

  function bougain(P, rnd, spots) {
    let s = "";
    spots.forEach(([cx, w, top]) => {
      for (let i = 0; i < 30; i++) {
        const x = cx + (rnd() - 0.5) * w * 2,
          y = top - 14 + rnd() * 34;
        s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(2.6 + rnd() * 1.6)}" fill="${P.hedge}"/>`;
      }
      for (let k = 0; k < 3; k++) {
        const x = cx + (rnd() - 0.5) * w * 1.4,
          len = 18 + rnd() * 34;
        s += `<line x1="${f(x)}" y1="${top + 6}" x2="${f(x + rnd() * 6 - 3)}" y2="${f(top + 6 + len)}" stroke="${P.hedge}" stroke-width="1.2"/>`;
        for (let y = top + 10; y < top + len; y += 7)
          s += `<circle cx="${f(x + rnd() * 5 - 2.5)}" cy="${f(y)}" r="${f(2 + rnd() * 1.6)}" fill="${rnd() > 0.5 ? P.bloom : "#F27AA8"}"/>`;
      }
      for (let i = 0; i < 34; i++) {
        const x = cx + (rnd() - 0.5) * w * 2,
          y = top - 14 + rnd() * 30;
        s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1.8 + rnd() * 1.8)}" fill="${rnd() > 0.45 ? P.bloom : "#F27AA8"}"/>`;
      }
    });
    return s;
  }

  function pot(P, x, y, rnd, flower) {
    return `${shd(P, x, y + 30, 24, 6)}<path d="M${x - 19} ${y}h38l-5 28h-28z" fill="${P.pot}"/><rect x="${x - 21}" y="${y - 3}" width="42" height="6" fill="${P.pot}"/><rect x="${x - 21}" y="${y - 3}" width="42" height="2" fill="#fff" opacity=".18"/>${shrub(P, x, y - 16, 17, flower, rnd)}`;
  }

  function reeds(P, x, y, rnd) {
    let s = "";
    for (let i = 0; i < 10; i++) {
      const dx = (rnd() - 0.5) * 34,
        h = 26 + rnd() * 30;
      s += `<path d="M${f(x + i * 2.2 - 11)} ${y}Q${f(x + i * 2.2 - 11 + dx * 0.3)} ${f(y - h * 0.6)} ${f(x + i * 2.2 - 11 + dx)} ${f(y - h)}" stroke="${i % 2 ? P.hedgeL : P.hedge}" stroke-width="1.7" fill="none" stroke-linecap="round"/>`;
    }
    return s;
  }

  function agave(P, x, y, s) {
    let g = shd(P, x, y + 3 * s, 16 * s, 4 * s);
    for (let i = 0; i < 13; i++) {
      const a = ((-168 + i * (156 / 12)) * Math.PI) / 180,
        L = (24 + 10 * Math.sin((i / 12) * Math.PI)) * s,
        tx = x + L * Math.cos(a),
        ty = y + L * Math.sin(a) * 0.92,
        px = -Math.sin(a) * 3.2 * s,
        py = Math.cos(a) * 3.2 * s;
      g += `<path d="M${f(x + px)} ${f(y + py)}L${f(tx)} ${f(ty)}L${f(x - px)} ${f(y - py)}Z" fill="${i % 2 ? P.agave : P.agaveL}"/>`;
    }
    return g;
  }
  function tuft(P, x, y, s, rnd) {
    let g = "";
    for (let i = 0; i < 9; i++) {
      const dx = (i - 4) * 3.2 * s,
        h = (16 + rnd() * 12) * s;
      g += `<path d="M${f(x + i * 1.5 * s - 6 * s)} ${y}Q${f(x + dx * 0.5)} ${f(y - h * 0.6)} ${f(x + dx * 1.5)} ${f(y - h)}" stroke="${i % 2 ? P.agaveL : P.hedgeL}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
    }
    return g;
  }
  function ghaf(P, x, y, s) {
    let g = shd(P, x, y + 2, 36 * s, 6 * s);
    g += `<path d="M${f(x - 5 * s)} ${y}Q${f(x - 3 * s)} ${f(y - 40 * s)} ${f(x - 8 * s)} ${f(y - 70 * s)}L${f(x + 4 * s)} ${f(y - 70 * s)}Q${f(x + 3 * s)} ${f(y - 40 * s)} ${f(x + 6 * s)} ${y}Z" fill="${P.trunk}"/><path d="M${f(x - 6 * s)} ${f(y - 64 * s)}L${f(x - 26 * s)} ${f(y - 86 * s)}M${f(x)} ${f(y - 66 * s)}L${f(x + 24 * s)} ${f(y - 88 * s)}M${f(x - 2 * s)} ${f(y - 66 * s)}V${f(y - 96 * s)}" stroke="${P.trunk}" stroke-width="${f(3 * s)}" fill="none"/>`;
    [
      [0, -96, 48, 18],
      [-34, -84, 32, 14],
      [36, -86, 34, 15],
      [-14, -110, 30, 12],
      [20, -110, 28, 12],
    ].forEach(([dx, dy, rx, ry]) => {
      g += `<ellipse cx="${f(x + dx * s)}" cy="${f(y + dy * s)}" rx="${f(rx * s)}" ry="${f(ry * s)}" fill="${P.hedge}"/>`;
    });
    [
      [-4, -102, 34, 10],
      [-30, -90, 22, 8],
      [32, -92, 22, 8],
      [10, -116, 20, 7],
    ].forEach(([dx, dy, rx, ry]) => {
      g += `<ellipse cx="${f(x + dx * s)}" cy="${f(y + dy * s)}" rx="${f(rx * s)}" ry="${f(ry * s)}" fill="${P.hedgeL}" opacity=".8"/>`;
    });
    return g;
  }
  function pergola(P, x1, x2, yTop, yL, yR) {
    const wood = P.glow ? P.trunk : "#6B4B2A";
    let g = `<rect x="${x1 - 3}" y="${yTop}" width="7" height="${yL - yTop}" fill="${wood}"/><rect x="${x2 - 3}" y="${yTop}" width="7" height="${yR - yTop}" fill="${wood}"/>`;
    g += `<rect x="${x1 - 16}" y="${yTop - 2}" width="${x2 - x1 + 32}" height="9" fill="${wood}"/>`;
    for (let x = x1 - 14; x <= x2 + 14; x += 8)
      g += `<rect x="${x}" y="${yTop - 11}" width="3" height="10" fill="${wood}"/>`;
    g += `<rect x="${x1 - 16}" y="${yTop + 7}" width="${x2 - x1 + 32}" height="2" fill="#000" opacity="${f(P.shade * 0.5)}"/>`;
    return g;
  }

  /* ---- four garden compositions ---- */
  function compMajlis(P, u, rnd) {
    let s = `<g class="L" style="--d:4">${wallArcade(P, u, [70, 200, 330], 410, 338)}${bougain(
      P,
      rnd,
      [
        [42, 52, 334],
        [356, 48, 334],
      ],
    )}</g>`;
    s += `<g class="L" style="--d:6">${groundPlane(P, u, 406)}${shrub(P, 22, 414, 19, "#F27AA8", rnd)}${shrub(P, 66, 416, 16, null, rnd)}${shrub(P, 336, 416, 16, null, rnd)}${shrub(P, 380, 414, 19, "#F27AA8", rnd)}</g>`;
    s += `<g class="L" style="--d:8">${palm(P, u, 58, 434, 236, -14, 1.05, 0)}${palm(P, u, 346, 438, 214, 16, 1, 2.4)}</g>`;
    s += `<g class="L" style="--d:11">${starPave(P, 200, 486, 92, 0.3)}${fountain(P, u, 200, 484, 1.12)}${pot(P, 46, 512, rnd, "#FFF6E0")}${pot(P, 356, 520, rnd, "#FFF6E0")}</g>`;
    s += `<g class="L" style="--d:15">${lantern(P, u, 200, 126, 126, 1.15)}${lantern(P, u, 116, 152, 100, 0.8)}${lantern(P, u, 284, 152, 100, 0.8)}</g>`;
    return s;
  }
  function compOasis(P, u, rnd) {
    let s = `<g class="L" style="--d:4"><ellipse cx="200" cy="408" rx="290" ry="40" fill="${P.hedge}"/><ellipse cx="200" cy="404" rx="270" ry="28" fill="${P.hedgeL}" opacity=".6"/>${palm(P, u, 46, 404, 150, -6, 0.8, 1)}${palm(P, u, 132, 406, 188, 4, 0.86, 3)}${palm(P, u, 262, 406, 170, -4, 0.86, 0.5)}${palm(P, u, 346, 404, 206, 8, 0.92, 2)}</g>`;
    s += `<g class="L" style="--d:6">${groundPlane(P, u, 412, P.hedgeL)}`;
    for (let i = 0; i < 5; i++)
      s += `<path d="M-20 ${430 + i * 30}Q200 ${420 + i * 30} 420 ${430 + i * 30}V${446 + i * 30}Q200 ${436 + i * 30} -20 ${446 + i * 30}Z" fill="${P.hedge}" opacity="${i % 2 ? 0.0 : 0.22}"/>`;
    s += `${shrub(P, 40, 440, 20, "#F27AA8", rnd)}${shrub(P, 98, 432, 15, null, rnd)}${shrub(P, 300, 434, 15, null, rnd)}${shrub(P, 362, 442, 21, "#F27AA8", rnd)}</g>`;
    s += `<g class="L" style="--d:9"><ellipse cx="200" cy="492" rx="172" ry="50" fill="${P.stone}"/><ellipse cx="200" cy="494" rx="162" ry="44" fill="${P.water}"/><ellipse class="ripple" cx="200" cy="496" rx="128" ry="30" fill="none" stroke="${P.waterL}" stroke-width="1.2" opacity=".7"/><ellipse class="ripple" cx="214" cy="500" rx="76" ry="16" fill="none" stroke="${P.waterL}" stroke-width="1" opacity=".6" style="animation-delay:-2s"/>`;
    [
      [110, 482, 26],
      [186, 478, 18],
      [262, 486, 30],
      [300, 500, 14],
    ].forEach(([x, y, w]) => {
      s += `<rect x="${x - w / 2}" y="${y}" width="${w}" height="2.4" rx="1.2" fill="${P.waterL}" opacity="${P.glow ? 0.8 : 0.5}"/>`;
    });
    s += `${reeds(P, 336, 514, rnd)}${reeds(P, 70, 512, rnd)}</g>`;
    s += `<g class="L" style="--d:12">${palm(P, u, 30, 452, 250, -10, 1.1, 0.7)}${palm(P, u, 372, 458, 236, 12, 1.05, 1.9)}${palm(P, u, 112, 440, 140, -10, 0.8, 3.2)}`;
    [
      [150, 548, 22],
      [196, 538, 16],
      [240, 546, 20],
      [282, 552, 24],
    ].forEach(([x, y, w]) => {
      s += `<ellipse cx="${x}" cy="${y + 3}" rx="${w}" ry="${w * 0.3}" fill="#000" opacity="${f(P.shade * 0.5)}"/><ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w * 0.3}" fill="${P.stone}"/>`;
    });
    s += `${lantern(P, u, 40, 512, 0, 0.85)}${lantern(P, u, 362, 520, 0, 0.85)}</g>`;
    return s;
  }
  function compWater(P, u, rnd) {
    const lawnQ = [
      "-30,410 191,410 182,464 -30,464",
      "209,410 430,410 430,464 218,464",
      "-30,483 172,483 150,572 -30,572",
      "228,483 430,483 430,572 250,572",
    ];
    let s = `<g class="L" style="--d:4">${wallArcade(P, u, [200], 404, 348)}${palm(P, u, 104, 408, 150, -4, 0.8, 1)}${palm(P, u, 298, 408, 160, 4, 0.84, 2.6)}${bougain(
      P,
      rnd,
      [
        [40, 50, 346],
        [360, 46, 346],
      ],
    )}</g>`;
    s += `<g class="L" style="--d:7">${groundPlane(P, u, 404)}`;
    lawnQ.forEach((q) => {
      s += `<polygon points="${q}" fill="${P.hedgeL}" stroke="${P.stone}" stroke-width="3"/><polygon points="${q}" fill="${P.hedge}" opacity=".25"/>`;
    });
    s += `<polygon points="193.5,408 206.5,408 252,572 148,572" fill="${P.stone}"/><polygon points="196,408 204,408 244,572 156,572" fill="${P.water}"/><rect x="-30" y="462" width="460" height="23" fill="${P.stone}"/><rect x="-30" y="465" width="460" height="17" fill="${P.water}"/>`;
    s += `<polygon points="199,410 201,410 214,572 186,572" fill="${P.waterL}" opacity="${P.glow ? 0.55 : 0.35}"/>`;
    s += `<ellipse cx="200" cy="474" rx="46" ry="15" fill="${P.stone}"/><ellipse cx="200" cy="475" rx="39" ry="11" fill="${P.water}"/><ellipse class="ripple" cx="200" cy="476" rx="26" ry="7" fill="none" stroke="${P.waterL}" stroke-width="1" opacity=".8"/>`;
    s += `${shrub(P, 70, 446, 15, "#F27AA8", rnd)}${shrub(P, 330, 446, 15, "#F27AA8", rnd)}${shrub(P, 48, 538, 24, null, rnd)}${shrub(P, 352, 538, 24, null, rnd)}</g>`;
    s += `<g class="L" style="--d:10">${fountain(P, u, 200, 476, 0.62)}${palm(P, u, 26, 470, 222, -8, 1, 0.4)}${palm(P, u, 374, 474, 214, 10, 1, 1.8)}</g>`;
    s += `<g class="L" style="--d:14">${lantern(P, u, 150, 138, 110, 0.75)}${lantern(P, u, 250, 138, 110, 0.75)}</g>`;
    return s;
  }
  function compModern(P, u, rnd) {
    let s = `<g class="L" style="--d:4">${palm(P, u, 66, 376, 118, -4, 0.7, 1)}${palm(P, u, 104, 376, 92, 3, 0.6, 2.2)}${palm(P, u, 300, 376, 104, -2, 0.66, 0.6)}<rect x="-12" y="372" width="430" height="40" fill="${P.wall}"/><rect x="-12" y="372" width="430" height="5" fill="#fff" opacity=".22"/><rect x="-12" y="372" width="430" height="40" fill="url(#wl${u})"/>`;
    if (P.glow)
      s += `<rect x="-12" y="401" width="430" height="2.4" fill="#FFE4A0" opacity="${P.glow}"/><rect x="-12" y="398" width="430" height="9" fill="url(#gl${u})" opacity="${f(P.glow * 0.35)}"/>`;
    s += `</g>`;
    s += `<g class="L" style="--d:6">${groundPlane(P, u, 410, P.gravel)}`;
    for (let i = 0; i < 70; i++) {
      const y = 416 + rnd() * 150,
        x = rnd() * 400;
      s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.7 + rnd() * 1.1)}" fill="${P.groundS}" opacity=".7"/>`;
    }
    [
      [414, 428],
      [436, 456],
      [468, 500],
      [514, 572],
    ].forEach(([y1, y2]) => {
      const hw = (y) => 8 + (y - 408) * 0.27;
      s += `<polygon points="${f(200 - hw(y1))},${y1} ${f(200 + hw(y1))},${y1} ${f(200 + hw(y2))},${y2} ${f(200 - hw(y2))},${y2}" fill="${P.stone}" stroke="${P.groundS}" stroke-width="1.5"/>`;
    });
    s += `<polygon points="118,452 282,452 308,480 92,480" fill="${P.stone}"/><polygon points="122,455 278,455 300,477 100,477" fill="${P.water}"/><rect x="132" y="459" width="70" height="2.4" fill="${P.waterL}" opacity=".8"/><rect x="214" y="466" width="56" height="2.4" fill="${P.waterL}" opacity=".7"/></g>`;
    s += `<g class="L" style="--d:8"><ellipse cx="74" cy="470" rx="30" ry="18" fill="${P.stone}" opacity=".95"/><ellipse cx="66" cy="462" rx="14" ry="6" fill="#fff" opacity=".25"/>${shd(P, 74, 486, 34, 6)}<ellipse cx="338" cy="486" rx="20" ry="12" fill="${P.stone}"/>${ghaf(P, 326, 456, 1)}${tuft(P, 106, 452, 1, rnd)}${tuft(P, 292, 446, 1, rnd)}</g>`;
    s += `<g class="L" style="--d:11">${agave(P, 134, 504, 1.3)}${agave(P, 262, 520, 1.1)}${agave(P, 52, 548, 1.7)}${agave(P, 310, 484, 0.8)}${agave(P, 368, 540, 1.3)}</g>`;
    s += `<g class="L" style="--d:14">${pergola(P, 44, 356, 238, 474, 470)}`;
    [150, 250].forEach((x, i) => {
      s += `<line x1="${x}" y1="${i ? 256 : 256}" x2="${x}" y2="${i ? 292 : 304}" stroke="#C9A35A" stroke-width="1"/>`;
      if (P.glow)
        s += `<circle class="fl" cx="${x}" cy="${i ? 298 : 310}" r="30" fill="url(#gl${u})" opacity="${P.glow}"/>`;
      s += `<circle cx="${x}" cy="${i ? 298 : 310}" r="7" fill="${P.glow ? "#FFE4A0" : "#D9C79A"}" stroke="#C9A35A" stroke-width="1.2"/>`;
    });
    s += `</g>`;
    return s;
  }

  function buildScene(style, tod, u, label) {
    const P = TOD[tod],
      rnd = mulberry(
        { majlis: 11, oasis: 23, water: 37, modern: 53 }[style] * 7 +
          tod.length,
      );
    const defs = `<defs>
<linearGradient id="sk${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.sky[0]}"/><stop offset=".55" stop-color="${P.sky[1]}"/><stop offset="1" stop-color="${P.sky[2]}"/></linearGradient>
<radialGradient id="gl${u}"><stop offset="0" stop-color="#FFD98A" stop-opacity=".95"/><stop offset=".35" stop-color="#FFC76A" stop-opacity=".4"/><stop offset="1" stop-color="#FFB347" stop-opacity="0"/></radialGradient>
<radialGradient id="sg${u}"><stop offset="0" stop-color="${P.sun.g}" stop-opacity=".9"/><stop offset="1" stop-color="${P.sun.g}" stop-opacity="0"/></radialGradient>
<linearGradient id="hz${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.haze}" stop-opacity="0"/><stop offset="1" stop-color="${P.haze}" stop-opacity=".85"/></linearGradient>
<linearGradient id="wl${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${P.shade}"/></linearGradient>
<linearGradient id="vg${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${f(P.shade * 0.9)}"/></linearGradient>
<clipPath id="ac${u}"><path d="${ARCH}"/></clipPath>
<pattern id="lt${u}" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M0 5L5 0L10 5L5 10Z" fill="none" stroke="${P.latLine}" stroke-width="1.3"/></pattern>
</defs>`;
    const sk = skylineLayer(P, rnd);
    let body = {
      majlis: compMajlis,
      oasis: compOasis,
      water: compWater,
      modern: compModern,
    }[style](P, u, rnd);
    let motes = "";
    if (P.glow) {
      for (let i = 0; i < 16; i++) {
        motes += `<circle class="mote" cx="${f(50 + rnd() * 300)}" cy="${f(400 + rnd() * 140)}" r="${f(0.8 + rnd() * 1.2)}" fill="#FFD98A" style="animation-delay:-${f(rnd() * 9)}s;animation-duration:${f(7 + rnd() * 5)}s"/>`;
      }
    }
    const frame = `<path d="${ARCH}" fill="none" stroke="#DDB45E" stroke-width="3"/><path d="M12 560V243C12 152 118 66 200 16C282 66 388 152 388 243V560" fill="none" stroke="#DDB45E" stroke-width="1" opacity=".55"/>`;
    return `<svg viewBox="0 0 400 560" role="img" aria-label="${label}">${defs}<g clip-path="url(#ac${u})">${skyLayer(P, u, rnd)}${sk.build(P)}${body}<rect x="0" y="470" width="400" height="100" fill="url(#vg${u})"/>${motes}</g>${frame}</svg>`;
  }
  /* ---------- Site content and bilingual copy (EN / AR) ---------- */
  /* Add the real business contact channels here before launch. Blank values
     keep placeholder contact details off the page. */
  const CONFIG = {
    whatsapp: "97450428240",
    phone: "+974 50428240",
    email: "",
  };
  let L = "en";
  try {
    const s = localStorage.getItem("nc-lang");
    if (s === "ar" || s === "en") L = s;
  } catch (e) {}
  const $ = (s, r) => (r || document).querySelector(s),
    $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const T = (o) => o[L];
  const STAR =
    '<svg viewBox="0 0 48 48" aria-hidden="true"><use href="#khatam"/></svg>';
  const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
  const num = (n) =>
    L === "ar" ? String(n).replace(/\d/g, (d) => AR_DIGITS[d]) : String(n);

  /* Footer and service-area ticker. */
  const AREAS = [
    { en: "West Bay Lagoon", ar: "لاغون الخليج الغربي" },
    { en: "Al Dafna", ar: "الدفنة" },
    { en: "Onaiza", ar: "عنيزة" },
    { en: "Al Qassar", ar: "القصار" },
    { en: "Diplomatic Area", ar: "المنطقة الدبلوماسية" },
    { en: "Legtaifiya", ar: "اللقطيفية" },
    { en: "Corniche", ar: "الكورنيش" },
  ];

  /* Services cards. */
  const SERVICES = [
    {
      t: { en: "Landscape design", ar: "تصميم المناظر الطبيعية" },
      d: {
        en: "Site plan, planting plan and 3D views, drawn for your plot, your sun and your water supply.",
        ar: "مخطط الموقع وخطة الزراعة ومناظر ثلاثية الأبعاد، مرسومة لأرضك وشمسك ومصدر مياهك.",
      },
      icon: '<rect x="9" y="10" width="30" height="28"/><path d="M9 24h30M24 10v28"/><circle cx="31" cy="31" r="4"/><path d="M14 16h6M14 30h6"/>',
    },
    {
      t: { en: "Courtyard and majlis gardens", ar: "حدائق الأفنية والمجالس" },
      d: {
        en: "Shaded seating, lattice screens, fountains and fragrance for evenings outdoors.",
        ar: "جلسات مظللة ومشربيات ونوافير وعطور لأمسيات في الهواء الطلق.",
      },
      icon: '<path d="M12 41V24c0-8 6-14 12-19 6 5 12 11 12 19v17z"/><path d="M12 30h24M12 36h24M18 24v17M24 18v23M30 24v17"/>',
    },
    {
      t: { en: "Planting and palms", ar: "الزراعة والنخيل" },
      d: {
        en: "Date palms, ghaf and sidr, flowering climbers and hardy shrubs chosen for Gulf heat and salt air.",
        ar: "نخيل وغاف وسدر ومتسلقات مزهرة وشجيرات تتحمل حرارة الخليج وهواء البحر المالح.",
      },
      icon: '<path d="M24 43V23"/><path d="M24 23c-4-8-12-9-17-4M24 23c4-8 12-9 17-4M24 23c-7-3-11 1-13 8M24 23c7-3 11 1 13 8M24 23V9"/>',
    },
    {
      t: { en: "Smart irrigation", ar: "الري الذكي" },
      d: {
        en: "Drip lines, zoned timers and soil sensors that water at dawn and cut waste.",
        ar: "خطوط تنقيط ومؤقتات مقسمة ومستشعرات تربة تسقي عند الفجر وتقلل الهدر.",
      },
      icon: '<path d="M24 7c7 9 11 14 11 20a11 11 0 0 1-22 0c0-6 4-11 11-20z"/><path d="M18 29a6 6 0 0 0 6 6"/>',
    },
    {
      t: { en: "Lawns and turf", ar: "المسطحات الخضراء" },
      d: {
        en: "Natural grass suited to Doha, or premium artificial turf for low-maintenance play areas.",
        ar: "عشب طبيعي يناسب الدوحة أو عشب صناعي فاخر لمساحات اللعب قليلة الصيانة.",
      },
      icon: '<path d="M7 41h34M13 41c0-9 2-15 4-19M21 41c0-11 0-19 2-27M29 41c0-9 2-15 6-19M38 41c-1-5-1-9-3-13"/>',
    },
    {
      t: { en: "Water features", ar: "المسطحات المائية" },
      d: {
        en: "Fountains, wall cascades and reflecting pools on recirculating pumps.",
        ar: "نوافير وشلالات جدارية وأحواض عاكسة بمضخات تدوير.",
      },
      icon: '<path d="M9 39h30M13 39c0-5 4-8 11-8s11 3 11 8M24 31V17M24 17c-4 0-7 3-8 8M24 17c4 0 7 3 8 8M24 9v4"/>',
    },
    {
      t: { en: "Hardscape and shade", ar: "الأرضيات والمظلات" },
      d: {
        en: "Stone paving, pergolas, shade sails and boundary walls built for sun and salt.",
        ar: "رصف حجري وبرغولات ومظلات وأسوار تتحمل الشمس والملوحة.",
      },
      icon: '<path d="M9 41V17M39 41V17M6 17h36M6 23h36M14 11v6M22 11v6M30 11v6M38 11v6"/>',
    },
    {
      t: { en: "Maintenance and lighting", ar: "الصيانة والإضاءة" },
      d: {
        en: "Scheduled pruning, feeding and pest control, plus low-voltage lighting for the evening.",
        ar: "تقليم وتسميد ومكافحة آفات بجدول منتظم، مع إضاءة منخفضة الجهد للمساء.",
      },
      icon: '<path d="M24 5v7M18 12h12l3 7H15zM15 19h18v15H15zM18 34h12l-2 7H20zM20 19v15M28 19v15"/>',
    },
  ];

  /* Garden-style selector and the corresponding photo descriptions. */
  const STYLES = [
    {
      id: "majlis",
      n: { en: "Majlis courtyard", ar: "فناء المجلس" },
      d: {
        en: "A walled room outdoors. Lattice screens, a central fountain, jasmine and bougainvillea around the seating.",
        ar: "غرفة مفتوحة محاطة بسور. مشربيات ونافورة في الوسط وياسمين وجهنمية حول الجلسات.",
      },
      inc: [
        { en: "Lattice screens", ar: "مشربيات" },
        { en: "Central fountain", ar: "نافورة مركزية" },
        { en: "Shaded seating", ar: "جلسات مظللة" },
        { en: "Fragrant climbers", ar: "متسلقات عطرية" },
      ],
    },
    {
      id: "oasis",
      n: { en: "Palm oasis", ar: "واحة النخيل" },
      d: {
        en: "Layered date palms, low groundcover and a pool of still water. Cool, green and quiet.",
        ar: "نخيل متدرج الارتفاع ونباتات أرضية وبركة ماء ساكنة. بارد وأخضر وهادئ.",
      },
      inc: [
        { en: "Date palm grove", ar: "بستان نخيل" },
        { en: "Reflecting pool", ar: "بركة عاكسة" },
        { en: "Lawn and groundcover", ar: "عشب ونباتات أرضية" },
        { en: "Lantern lighting", ar: "إضاءة بالفوانيس" },
      ],
    },
    {
      id: "water",
      n: { en: "Four-part water garden", ar: "الحديقة الرباعية" },
      d: {
        en: "Four lawns divided by water channels that meet at a central basin. The classic Islamic garden plan.",
        ar: "أربعة مروج تفصل بينها قنوات ماء تلتقي في حوض مركزي. المخطط الكلاسيكي للحديقة الإسلامية.",
      },
      inc: [
        { en: "Water channels", ar: "قنوات مائية" },
        { en: "Central basin", ar: "حوض مركزي" },
        { en: "Symmetrical planting", ar: "زراعة متماثلة" },
        { en: "Gateway focal point", ar: "بوابة كنقطة تركيز" },
      ],
    },
    {
      id: "modern",
      n: { en: "Desert modern", ar: "الصحراء العصرية" },
      d: {
        en: "Gravel, sculpted agave, a spreading ghaf tree and clean stone. Low water, high calm.",
        ar: "حصى ونبات الأغاف وشجرة غاف مظللة وحجر نظيف. ماء قليل وهدوء كبير.",
      },
      inc: [
        { en: "Gravel and stone slabs", ar: "حصى وألواح حجرية" },
        { en: "Ghaf and agave", ar: "غاف وأغاف" },
        { en: "Slatted pergola", ar: "برغولا بشرائح" },
        { en: "Linear water trough", ar: "حوض مائي طولي" },
      ],
    },
  ];
  const TODS = [
    { id: "day", n: { en: "Morning", ar: "الصباح" } },
    { id: "dusk", n: { en: "Dusk", ar: "الغروب" } },
    { id: "night", n: { en: "Night", ar: "الليل" } },
  ];
  const SCENE_MEDIA = {
    majlis: {
      src: "media/palm-courtyard.jpg",
      alt: {
        en: "Palm courtyard with a central fountain and shaded seating",
        ar: "فناء نخيل مع نافورة مركزية وجلسات مظللة",
      },
      caption: { en: "Majlis courtyard", ar: "فناء المجلس" },
    },
    oasis: {
      src: "media/palm-oasis.jpg",
      alt: {
        en: "Palm trees beside a still reflecting pool",
        ar: "أشجار نخيل بجانب بركة عاكسة ساكنة",
      },
      caption: { en: "Palm oasis", ar: "واحة النخيل" },
    },
    water: {
      src: "media/water-garden.jpg",
      alt: {
        en: "Traditional garden fountain surrounded by trees and water channels",
        ar: "نافورة حديقة تقليدية تحيط بها الأشجار والممرات المائية",
      },
      caption: { en: "Four-part water garden", ar: "الحديقة الرباعية" },
    },
    modern: {
      src: "media/desert-modern.jpg",
      alt: {
        en: "Modern arid garden with sculptural desert plants and warm stone",
        ar: "حديقة عصرية قليلة المياه بنباتات صحراوية وحجر دافئ",
      },
      caption: { en: "Desert modern", ar: "الصحراء العصرية" },
    },
  };

  const fl5 = (cx, cy, r, c) => {
    let s = "";
    for (let i = 0; i < 5; i++) {
      const a = ((i * 72 - 90) * Math.PI) / 180;
      s += `<circle cx="${f(cx + Math.cos(a) * r * 0.62)}" cy="${f(cy + Math.sin(a) * r * 0.62)}" r="${f(r * 0.56)}" fill="${c}"/>`;
    }
    return (
      s + `<circle cx="${cx}" cy="${cy}" r="${f(r * 0.26)}" fill="#F6D36A"/>`
    );
  };
  /* Plant selector: species facts, care guidance, and small SVG portraits. */
  const PLANTS = [
    {
      id: "date",
      n: { en: "Date palm", ar: "نخيل التمر" },
      lat: "Phoenix dactylifera",
      water: 2,
      wl: { en: "Moderate", ar: "متوسط" },
      sun: { en: "Full sun", ar: "شمس كاملة" },
      good: {
        en: "Entrances, courtyards and avenues",
        ar: "المداخل والأفنية والممرات",
      },
      use: {
        en: "The Gulf's signature tree. It gives height, shade and a calm skyline in a courtyard or along a drive.",
        ar: "شجرة الخليج الأيقونية. تمنح الارتفاع والظل وخطاً هادئاً في الفناء أو على طول الممر.",
      },
      art: `<path d="M40 96Q37 70 41 44" stroke="#7B5733" stroke-width="5" fill="none" stroke-linecap="round"/><g stroke="#2F8F52" stroke-width="3.6" fill="none" stroke-linecap="round"><path d="M41 44Q22 28 6 44"/><path d="M41 44Q27 20 12 24"/><path d="M41 44Q36 20 28 8"/><path d="M41 44Q47 20 54 8"/><path d="M41 44Q55 20 70 24"/><path d="M41 44Q60 28 76 44"/><path d="M41 44Q58 42 68 62"/><path d="M41 44Q24 42 14 62"/></g><circle cx="38" cy="49" r="2.6" fill="#C5762B"/><circle cx="44" cy="50" r="2.6" fill="#B5651F"/><circle cx="41" cy="53" r="2.6" fill="#C5762B"/>`,
    },
    {
      id: "ghaf",
      n: { en: "Ghaf", ar: "الغاف" },
      lat: "Prosopis cineraria",
      water: 1,
      wl: { en: "Low once established", ar: "قليل بعد الترسخ" },
      sun: { en: "Full sun", ar: "شمس كاملة" },
      good: {
        en: "Shade over seating and play areas",
        ar: "ظل فوق الجلسات ومناطق اللعب",
      },
      use: {
        en: "An evergreen native of the Arabian Peninsula with deep roots. It casts light, steady shade and handles heat well.",
        ar: "شجرة دائمة الخضرة موطنها شبه الجزيرة العربية وجذورها عميقة. تعطي ظلاً خفيفاً ثابتاً وتتحمل الحرارة.",
      },
      art: `<path d="M40 96V58M40 62L24 44M40 60L58 42M40 58V38" stroke="#7B5733" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="40" cy="36" rx="32" ry="14" fill="#3F9B63"/><ellipse cx="20" cy="46" rx="18" ry="9" fill="#3F9B63"/><ellipse cx="60" cy="46" rx="18" ry="9" fill="#3F9B63"/><ellipse cx="38" cy="32" rx="22" ry="8" fill="#63B880" opacity=".8"/>`,
    },
    {
      id: "sidr",
      n: { en: "Sidr", ar: "السدر" },
      lat: "Ziziphus spina-christi",
      water: 1,
      wl: { en: "Low once established", ar: "قليل بعد الترسخ" },
      sun: { en: "Full sun", ar: "شمس كاملة" },
      good: { en: "Wide shade and screening", ar: "ظل واسع وحجب للنظر" },
      use: {
        en: "A broad, thorny tree long planted across Arabia. Valued for dense shade and for the honey its blossom supports.",
        ar: "شجرة عريضة شائكة تُزرع منذ القدم في جزيرة العرب. تُقدَّر لظلها الكثيف ولعسل أزهارها.",
      },
      art: `<path d="M40 96V60" stroke="#7B5733" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="40" cy="38" r="26" fill="#4C9A5B"/><circle cx="22" cy="52" r="15" fill="#4C9A5B"/><circle cx="58" cy="52" r="15" fill="#4C9A5B"/><circle cx="34" cy="30" r="12" fill="#6DB878" opacity=".8"/><circle cx="30" cy="44" r="2.2" fill="#C9852B"/><circle cx="48" cy="34" r="2.2" fill="#C9852B"/><circle cx="52" cy="54" r="2.2" fill="#C9852B"/><circle cx="26" cy="58" r="2.2" fill="#C9852B"/><circle cx="40" cy="52" r="2.2" fill="#C9852B"/>`,
    },
    {
      id: "bougain",
      n: { en: "Bougainvillea", ar: "الجهنمية" },
      lat: "Bougainvillea glabra",
      water: 1,
      wl: { en: "Low once established", ar: "قليل بعد الترسخ" },
      sun: { en: "Full sun", ar: "شمس كاملة" },
      good: {
        en: "Walls, pergolas and summer colour",
        ar: "الأسوار والبرغولات وألوان الصيف",
      },
      use: {
        en: "Papery pink and magenta bracts that thrive in heat. Trained over walls and pergolas for colour in the hot months.",
        ar: "قنابات ورقية وردية وأرجوانية تزدهر في الحر. تُدرَّب على الأسوار والبرغولات لتمنح اللون في الأشهر الحارة.",
      },
      art: `<path d="M12 96Q8 52 42 38Q64 30 70 12" stroke="#6B8F4E" stroke-width="3" fill="none" stroke-linecap="round"/><g fill="#3E9A62"><ellipse cx="22" cy="74" rx="6" ry="3" transform="rotate(-30 22 74)"/><ellipse cx="30" cy="48" rx="6" ry="3" transform="rotate(30 30 48)"/><ellipse cx="56" cy="34" rx="6" ry="3" transform="rotate(-20 56 34)"/></g><g fill="#D9437F"><circle cx="20" cy="66" r="6"/><circle cx="14" cy="52" r="5"/><circle cx="32" cy="44" r="6.5"/><circle cx="46" cy="36" r="6"/><circle cx="60" cy="28" r="6"/><circle cx="68" cy="16" r="5"/><circle cx="26" cy="58" r="5"/><circle cx="54" cy="44" r="5"/></g><g fill="#F27AA8"><circle cx="32" cy="44" r="3"/><circle cx="46" cy="36" r="3"/><circle cx="60" cy="28" r="3"/><circle cx="20" cy="66" r="3"/></g>`,
    },
    {
      id: "jasmine",
      n: { en: "Arabian jasmine", ar: "الياسمين العربي" },
      lat: "Jasminum sambac",
      water: 3,
      wl: { en: "Regular", ar: "منتظم" },
      sun: {
        en: "Morning sun, afternoon shade",
        ar: "شمس الصباح وظل بعد الظهر",
      },
      good: {
        en: "Fragrance beside seating and doors",
        ar: "العطر بجانب الجلسات والأبواب",
      },
      use: {
        en: "Loved for its evening scent. Plant it beside majlis seating and entrances, with some shade from the afternoon sun.",
        ar: "محبوب بعطره المسائي. يُزرع بجانب جلسات المجلس والمداخل مع شيء من الظل بعد الظهر.",
      },
      art: `<path d="M40 96Q38 70 30 54M40 80Q50 60 56 42M36 66Q22 56 18 38" stroke="#5B8F4E" stroke-width="2.6" fill="none" stroke-linecap="round"/><g fill="#3E9A62"><ellipse cx="22" cy="64" rx="8" ry="4" transform="rotate(-35 22 64)"/><ellipse cx="50" cy="66" rx="8" ry="4" transform="rotate(35 50 66)"/><ellipse cx="30" cy="80" rx="8" ry="4" transform="rotate(-25 30 80)"/><ellipse cx="52" cy="82" rx="8" ry="4" transform="rotate(25 52 82)"/><ellipse cx="40" cy="58" rx="8" ry="4" transform="rotate(60 40 58)"/></g>${fl5(30, 50, 10, "#FFF8E6")}${fl5(56, 38, 11, "#FFF8E6")}${fl5(18, 34, 9, "#FFF8E6")}${fl5(44, 26, 9, "#FFF8E6")}`,
    },
    {
      id: "desert",
      n: { en: "Desert rose", ar: "وردة الصحراء" },
      lat: "Adenium obesum",
      water: 1,
      wl: { en: "Low, never waterlogged", ar: "قليل دون تشبع" },
      sun: { en: "Full sun", ar: "شمس كاملة" },
      good: {
        en: "Pots, rock beds and gravel gardens",
        ar: "الأوعية وأحواض الصخور والحصى",
      },
      use: {
        en: "A sculptural succulent with a swollen trunk and bright flowers. Suited to pots, gravel beds and low-water corners.",
        ar: "نبتة عصارية نحتية بجذع منتفخ وأزهار زاهية. تناسب الأوعية وأحواض الحصى والزوايا قليلة الماء.",
      },
      art: `<path d="M28 96Q18 80 30 66Q36 56 38 44Q41 56 48 66Q60 80 52 96Z" fill="#9A7F66"/><path d="M38 50L24 32M40 48L52 28" stroke="#9A7F66" stroke-width="4" fill="none" stroke-linecap="round"/><g fill="#3E9A62"><ellipse cx="20" cy="34" rx="7" ry="3.5" transform="rotate(-40 20 34)"/><ellipse cx="56" cy="30" rx="7" ry="3.5" transform="rotate(40 56 30)"/></g>${fl5(22, 26, 10, "#E8588F")}${fl5(34, 18, 9, "#F27AA8")}${fl5(54, 22, 10, "#E8588F")}${fl5(62, 34, 8, "#F27AA8")}`,
    },
  ];

  /* Project timeline. */
  const STEPS = [
    {
      t: { en: "Site visit", ar: "زيارة الموقع" },
      d: {
        en: "We walk the plot with you. Sun, shade, soil, water supply, and the views you want to keep or hide.",
        ar: "نمشي في الأرض معك: الشمس والظل والتربة ومصدر المياه والمناظر التي تريد إبرازها أو إخفاءها.",
      },
    },
    {
      t: { en: "Concept and plan", ar: "الفكرة والمخطط" },
      d: {
        en: "A planting plan, layout and 3D views. You choose materials and plants before any digging starts.",
        ar: "مخطط للزراعة والتوزيع ومناظر ثلاثية الأبعاد. تختار المواد والنباتات قبل بدء الحفر.",
      },
    },
    {
      t: { en: "Build and plant", ar: "التنفيذ والزراعة" },
      d: {
        en: "Irrigation and hardscape first, then soil, trees, shrubs and finishing touches. One crew, one schedule.",
        ar: "الري والأرضيات أولاً، ثم التربة والأشجار والشجيرات واللمسات الأخيرة. فريق واحد وجدول واحد.",
      },
    },
    {
      t: { en: "Care through the seasons", ar: "العناية على مدار المواسم" },
      d: {
        en: "Scheduled visits adjust watering, pruning and feeding as Doha moves from winter to summer.",
        ar: "زيارات مجدولة تعدّل الري والتقليم والتسميد مع انتقال الدوحة من الشتاء إلى الصيف.",
      },
    },
  ];

  /* Garden year starts in October so the planting window sits together. Highs are rounded typical values for Doha. */
  /* Doha seasonal calendar: monthly high temperatures and garden phases. */
  const TEMPS = [36, 30, 25, 22, 24, 28, 34, 40, 42, 43, 42, 40];
  const PHASES = [
    {
      id: "refresh",
      from: 0,
      to: 1,
      tone: "--tile",
      n: { en: "Refresh", ar: "التجديد" },
      d: {
        en: "Nights cool down. We refresh soil, renew lawns and reset irrigation for the cooler months.",
        ar: "تبرد الليالي. نجدد التربة والمسطحات الخضراء ونعيد ضبط الري للأشهر الباردة.",
      },
    },
    {
      id: "plant",
      from: 2,
      to: 4,
      tone: "--leaf",
      n: { en: "Plant and shape", ar: "الزراعة والتشكيل" },
      d: {
        en: "The easiest time to plant trees, shrubs and flowering beds. We also prune and reshape.",
        ar: "أنسب وقت لزراعة الأشجار والشجيرات وأحواض الزهور. نقوم أيضاً بالتقليم وإعادة التشكيل.",
      },
    },
    {
      id: "feed",
      from: 5,
      to: 6,
      tone: "--gold",
      n: { en: "Feed and establish", ar: "التسميد والترسيخ" },
      d: {
        en: "We feed the garden, firm up young plantings and check every irrigation zone before the heat arrives.",
        ar: "نسمّد الحديقة ونقوّي المزروعات الحديثة ونفحص كل مناطق الري قبل قدوم الحر.",
      },
    },
    {
      id: "shade",
      from: 7,
      to: 11,
      tone: "--bloom",
      n: { en: "Shade and save water", ar: "الظل وتوفير الماء" },
      d: {
        en: "Watering moves to dawn and evening. We mulch beds, add shade cloth and prune lightly to protect plants through the peak heat.",
        ar: "ينتقل الري إلى الفجر والمساء. نغطي الأحواض بالمهاد ونضيف شبكات الظل ونقلّم بخفة لحماية النباتات في ذروة الحر.",
      },
    },
  ];

  /* Ongoing garden-care packages. */
  const PLANS = [
    {
      t: { en: "Essential Care", ar: "العناية الأساسية" },
      l: { en: "The basics, kept tidy", ar: "الأساسيات بترتيب دائم" },
      i: [
        { en: "Lawn mowing and edging", ar: "قص العشب وتشذيب الحواف" },
        { en: "Watering and irrigation check", ar: "فحص الري والسقاية" },
        {
          en: "Weeding and litter removal",
          ar: "إزالة الأعشاب الضارة والمخلفات",
        },
        { en: "Seasonal pruning", ar: "تقليم موسمي" },
      ],
      ic: '<path d="M24 40V18M24 26c-1-6-6-9-11-8 1 6 5 9 11 8zM24 22c1-6 6-9 11-8-1 6-5 9-11 8z"/>',
    },
    {
      t: { en: "Signature Care", ar: "العناية المميزة" },
      l: {
        en: "Everything in Essential, plus",
        ar: "كل ما في الأساسية، بالإضافة إلى",
      },
      i: [
        { en: "Feeding and soil care", ar: "التسميد والعناية بالتربة" },
        { en: "Pest and disease control", ar: "مكافحة الآفات والأمراض" },
        { en: "Irrigation tuning each season", ar: "ضبط الري كل موسم" },
        { en: "Seasonal flower beds", ar: "أحواض زهور موسمية" },
      ],
      ic: '<use href="#khatam"/>',
    },
    {
      t: { en: "Estate Care", ar: "عناية الأملاك" },
      l: {
        en: "Everything in Signature, plus",
        ar: "كل ما في المميزة، بالإضافة إلى",
      },
      i: [
        {
          en: "Dedicated gardener on a set schedule",
          ar: "بستاني مخصص بجدول ثابت",
        },
        {
          en: "Palm and tall tree care",
          ar: "العناية بالنخيل والأشجار العالية",
        },
        {
          en: "Lighting and water-feature service",
          ar: "صيانة الإضاءة والمسطحات المائية",
        },
        {
          en: "Written report after each visit",
          ar: "تقرير مكتوب بعد كل زيارة",
        },
      ],
      ic: '<path d="M24 40V22M24 22c-4-8-12-9-17-4M24 22c4-8 12-9 17-4M24 22c-7-3-11 1-13 8M24 22c7-3 11 1 13 8M24 22V8"/>',
    },
  ];

  /* Hero headline and contact-form message templates. */
  const H1 = {
    en: ["Where the courtyard", "meets the skyline."],
    ar: ["حيث يلتقي الفناء", "بأفق المدينة."],
  };
  const MSG = {
    en: {
      hello: "Hello Nature Craft, I'd like to arrange a site visit.",
      name: "Name",
      phone: "Phone",
      area: "Area",
      svc: "Service",
      style: "Garden style I liked",
      plan: "Care plan",
      about: "About the garden",
      nosvc: "Not sure yet",
    },
    ar: {
      hello: "مرحباً نيتشر كرافت، أود ترتيب زيارة للموقع.",
      name: "الاسم",
      phone: "الهاتف",
      area: "المنطقة",
      svc: "الخدمة",
      style: "نمط الحديقة الذي أعجبني",
      plan: "خطة العناية",
      about: "عن الحديقة",
      nosvc: "لم أحدد بعد",
    },
  };

  /* ---------- Shared state and rendering ---------- */
  /* Current selections drive the garden, plant, and calendar displays. */
  const st = {
    style: "oasis",
    tod: "day",
    plant: "date",
    phase: null,
    touched: false,
    plan: "",
  };
  const monthName = (m, w) => {
    try {
      return new Intl.DateTimeFormat(L === "ar" ? "ar-QA-u-nu-latn" : "en", {
        month: w,
      }).format(new Date(2026, m, 1));
    } catch (e) {
      return String(m + 1);
    }
  };
  const gMonth = (i) => (9 + i) % 12;
  const curIdx = () => (new Date().getMonth() + 3) % 12;

  /* Render the service-area ticker and service cards. */
  function renderMarq() {
    const unit = AREAS.map((a) => `<span>${T(a)}${STAR}</span>`).join("");
    $("#marq").innerHTML = unit + unit + unit + unit;
  }
  function renderServices() {
    $("#svcGrid").innerHTML = SERVICES.map(
      (s) =>
        `<article class="svc"><div class="niche"><svg viewBox="0 0 76 96" aria-hidden="true"><path class="nf" d="M3 94V40C3 24 18 12 38 2c20 10 35 22 35 38v54z"/><g class="ic" transform="translate(19 42) scale(.8)">${s.icon}</g></svg></div><div><h3>${T(s.t)}</h3><p>${T(s.d)}</p></div></article>`,
    ).join("");
  }
  /* Update the selected garden photo, light level, and feature list. */
  function drawDesigner(anim) {
    const td = TODS.find((x) => x.id === st.tod);
    const media = SCENE_MEDIA[st.style],
      photo = $("#dScenePhoto"),
      scene = $("#dScene");
    photo.src = media.src;
    photo.alt = T(media.alt);
    scene.dataset.tod = st.tod;
    $("#scenePhotoCaption").textContent = `${T(media.caption)} · ${T(td.n)}`;
    if (anim && $("#sceneWindow").animate)
      $("#sceneWindow").animate(
        [
          { opacity: 0, transform: "scale(1.02)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 480, easing: "ease-out" },
      );
  }
  function renderDesignerUI() {
    const s = STYLES.find((x) => x.id === st.style);
    $("#styList").innerHTML = STYLES.map(
      (x) =>
        `<button class="sty" type="button" data-id="${x.id}" aria-pressed="${x.id === st.style}">${STAR}<div><b>${T(x.n)}</b><span>${T(x.d)}</span></div></button>`,
    ).join("");
    $("#tod").innerHTML = TODS.map(
      (x) =>
        `<button type="button" data-id="${x.id}" aria-pressed="${x.id === st.tod}">${T(x.n)}</button>`,
    ).join("");
    $("#incl").innerHTML = s.inc
      .map((i) => `<li>${STAR}<span>${T(i)}</span></li>`)
      .join("");
  }
  /* Render the plant selector and the selected plant's care details. */
  function renderDock() {
    $("#dock").innerHTML = PLANTS.map(
      (p) =>
        `<button class="dk" type="button" data-id="${p.id}" aria-pressed="${p.id === st.plant}" aria-label="${T(p.n)}"><svg viewBox="0 0 80 100" aria-hidden="true">${p.art}</svg><span>${T(p.n)}</span></button>`,
    ).join("");
    const p = PLANTS.find((x) => x.id === st.plant);
    const lab = {
      en: { w: "Water", s: "Sun", g: "Good for" },
      ar: { w: "الري", s: "الشمس", g: "مناسب لـ" },
    }[L];
    const drops = [1, 2, 3]
      .map((i) => `<i class="${i <= p.water ? "on" : ""}"></i>`)
      .join("");
    $("#pd").innerHTML =
      `<div class="pd-art"><svg viewBox="0 0 120 150" aria-hidden="true"><path d="M4 148V62C4 38 28 18 60 2c32 16 56 36 56 60v86z" fill="none" stroke="var(--gold-deep)" stroke-width="1.5"/><g transform="translate(20 34) scale(1.0)">${p.art}</g></svg></div>
  <div><h3>${T(p.n)}</h3><p class="latin">${p.lat}</p><p class="use">${T(p.use)}</p>
  <dl class="facts"><div><dt>${lab.w}</dt><dd><span class="drops" aria-hidden="true">${drops}</span>${T(p.wl)}</dd></div><div><dt>${lab.s}</dt><dd>${T(p.sun)}</dd></div><div><dt>${lab.g}</dt><dd>${T(p.good)}</dd></div></dl></div>`;
  }
  /* Render the project timeline and its scroll-progress vine. */
  function renderProcess() {
    const v = $("#vine");
    v.innerHTML =
      '<div class="vine-line"><svg aria-hidden="true"><path class="base"/><path class="grow" pathLength="1"/></svg></div>' +
      STEPS.map(
        (s, i) =>
          `<div class="stp"><div class="node" data-i="${i}"><svg viewBox="0 0 48 48" aria-hidden="true"><use href="#khatam"/></svg></div><div class="card"><span class="n">${num(i + 1)}</span><h3>${T(s.t)}</h3><p>${T(s.d)}</p></div></div>`,
      ).join("");
    drawVine();
  }
  function drawVine() {
    const v = $("#vine");
    if (!v) return;
    const svg = $(".vine-line svg", v);
    if (!svg) return;
    const H = v.offsetHeight,
      W = svg.clientWidth || 60,
      seg = H / 8,
      cx = W / 2,
      a = Math.min(16, W * 0.28);
    let d = `M${f(cx)} 0`;
    for (let i = 0; i < 8; i++) {
      const y = seg * i,
        s = i % 2 ? -1 : 1;
      d += `C${f(cx + s * a)} ${f(y + seg * 0.3)} ${f(cx + s * a)} ${f(y + seg * 0.7)} ${f(cx)} ${f(y + seg)}`;
    }
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("height", H);
    $$("path", svg).forEach((p) => p.setAttribute("d", d));
    vineProgress();
  }
  function vineProgress() {
    const v = $("#vine");
    if (!v) return;
    const r = v.getBoundingClientRect(),
      p = Math.max(0, Math.min(1, (innerHeight * 0.62 - r.top) / r.height));
    const g = $(".grow", v);
    if (g) {
      g.style.strokeDasharray = "1";
      g.style.strokeDashoffset = String(1 - p);
    }
    $$(".node", v).forEach((n, i) =>
      n.classList.toggle("on", p >= (2 * i + 1) / 8 - 0.03),
    );
  }

  function smooth(pts) {
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i],
        p1 = pts[i],
        p2 = pts[i + 1],
        p3 = pts[i + 2] || p2;
      d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
    }
    return d;
  }
  /* Render the seasonal month chart and selected care phase. */
  function renderCal() {
    if (st.phase === null)
      st.phase = PHASES.findIndex(
        (p) => curIdx() >= p.from && curIdx() <= p.to,
      );
    const ph = PHASES[st.phase];
    $("#calTabs").innerHTML = PHASES.map(
      (p, i) =>
        `<button type="button" data-i="${i}" aria-pressed="${i === st.phase}">${T(p.n)}</button>`,
    ).join("");
    const W = 600,
      H = 300,
      col = W / 12,
      X = (i) => col * (i + 0.5),
      Y = (t) => 270 - (t - 15) * 8;
    const pts = TEMPS.map((t, i) => [X(i), Y(t)]),
      d = smooth(pts),
      cur = curIdx();
    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${L === "ar" ? "متوسط درجات الحرارة العظمى في الدوحة على مدار السنة" : "Typical daily high temperature in Doha through the garden year"}"><defs><linearGradient id="tg" gradientUnits="userSpaceOnUse" x1="0" y1="${Y(22)}" x2="0" y2="${Y(43)}"><stop offset="0" style="stop-color:var(--tile-deep)"/><stop offset=".55" style="stop-color:var(--gold-deep)"/><stop offset="1" style="stop-color:var(--wine)"/></linearGradient><clipPath id="pc"><rect x="${col * ph.from}" y="0" width="${col * (ph.to - ph.from + 1)}" height="${H}"/></clipPath></defs>`;
    PHASES.forEach((p, i) => {
      s += `<rect x="${col * p.from}" y="10" width="${col * (p.to - p.from + 1)}" height="${H - 20}" style="fill:var(${p.tone})" opacity="${i === st.phase ? 0.34 : 0.13}"/>`;
    });
    [20, 30, 40].forEach((t) => {
      s += `<line class="gl" x1="0" x2="${W}" y1="${Y(t)}" y2="${Y(t)}"/><text class="gt" x="4" y="${Y(t) - 5}">${num(t)}°</text>`;
    });
    s += `<path d="${d}" fill="none" stroke="url(#tg)" stroke-width="3.2" stroke-linecap="round"/><g clip-path="url(#pc)"><path d="${d}" fill="none" style="stroke:var(--ink)" stroke-width="5" stroke-linecap="round"/><path d="${d}" fill="none" stroke="url(#tg)" stroke-width="2.4" stroke-linecap="round"/></g>`;
    pts.forEach((p, i) => {
      s += `<circle class="${i === cur ? "now" : "pt"}" cx="${f(p[0])}" cy="${f(p[1])}" r="${i === cur ? 6 : 3.4}"/>`;
    });
    s += `<text class="vt" x="${f(X(9))}" y="${f(Y(43) - 12)}" text-anchor="middle">${num(43)}°</text><text class="vt" x="${f(X(3))}" y="${f(Y(22) + 24)}" text-anchor="middle">${num(22)}°</text>`;
    if (cur >= 0)
      s += `<text class="gt" x="${f(X(cur) + 12)}" y="${f(Y(TEMPS[cur]) - 12)}" text-anchor="start" style="font-weight:600;font-size:14px;fill:var(--wine)">${L === "ar" ? "الآن" : "Now"}</text>`;
    $("#chart").innerHTML = s + "</svg>";
    $("#months").innerHTML = TEMPS.map(
      (_, i) =>
        `<span class="${i === cur ? "cur" : ""}"><span class="m-s">${monthName(gMonth(i), "short")}</span><span class="m-n">${monthName(gMonth(i), "narrow")}</span></span>`,
    ).join("");
    $("#calNote").innerHTML =
      `<div><div class="rng">${monthName(gMonth(ph.from), "long")} – ${monthName(gMonth(ph.to), "long")}</div><h3>${T(ph.n)}</h3></div><p>${T(ph.d)}</p><p class="gt" style="font-size:.82rem;color:var(--ink-soft);grid-column:1/-1">${L === "ar" ? "متوسط الحرارة العظمى اليومية بالدرجة المئوية، أرقام تقريبية." : "Typical daily high in °C, rounded and approximate."}</p>`;
  }
  /* Render the three maintenance plans and their inclusions. */
  function renderPlans() {
    $("#plansGrid").innerHTML = PLANS.map(
      (p) =>
        `<article class="plan"><div class="pi"><svg viewBox="0 0 48 48" aria-hidden="true">${p.ic}</svg></div><h3>${T(p.t)}</h3><p class="pl">${T(p.l)}</p><ul>${p.i.map((i) => `<li>${STAR}<span>${T(i)}</span></li>`).join("")}</ul><a class="btn btn-sm" href="#contact" data-plan="${p.t.en}">${L === "ar" ? "اطلب عرض سعر" : "Ask for a quote"}</a></article>`,
    ).join("");
  }
  /* Fill the area and service options used by the contact form. */
  function renderAreas() {
    $("#chips").innerHTML = AREAS.map((a) => `<li>${T(a)}</li>`).join("");
    $("#footAreas").innerHTML = AREAS.map((a) => `<li>${T(a)}</li>`).join("");
    const aSel = $("#fArea"),
      sSel = $("#fSvc"),
      ai = aSel.selectedIndex,
      si = sSel.selectedIndex;
    aSel.innerHTML = AREAS.map(
      (a, i) => `<option value="${i}">${T(a)}</option>`,
    ).join("");
    sSel.innerHTML =
      SERVICES.map((s, i) => `<option value="${i}">${T(s.t)}</option>`).join(
        "",
      ) + `<option value="-1">${MSG[L].nosvc}</option>`;
    if (ai >= 0) aSel.selectedIndex = ai;
    if (si >= 0) sSel.selectedIndex = si;
  }
  function setH1() {
    $("#h1").innerHTML = H1[L].map(
      (t, i) => `<span class="ln" style="--i:${i}"><span>${t}</span></span>`,
    ).join("");
  }
  function renderAll() {
    renderMarq();
    renderServices();
    renderDesignerUI();
    drawDesigner(false);
    renderDock();
    renderProcess();
    renderCal();
    renderPlans();
    renderAreas();
  }

  /* Switch all labeled content between English and Arabic / RTL. */
  function setLang(l, first) {
    L = l;
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    $$("[data-ar]").forEach((el) => {
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
      el.innerHTML = l === "ar" ? el.dataset.ar : el.dataset.en;
    });
    $$("[data-ph-en]").forEach((el) => {
      el.placeholder = l === "ar" ? el.dataset.phAr : el.dataset.phEn;
    });
    $("#langBtn").textContent = l === "ar" ? "English" : "العربية";
    $("#langBtn").setAttribute(
      "aria-label",
      l === "ar" ? "Switch to English" : "التبديل إلى العربية",
    );
    $("#footBig").textContent = l === "ar" ? "نيتشر كرافت" : "Nature Craft";
    if (!first) setH1();
    renderAll();
    try {
      localStorage.setItem("nc-lang", l);
    } catch (e) {}
  }
  /* ---------- Interactions and event wiring ---------- */
  async function copyText(t) {
    try {
      await navigator.clipboard.writeText(t);
      return true;
    } catch (e) {
      try {
        const ta = document.createElement("textarea");
        ta.value = t;
        ta.setAttribute("readonly", "");
        ta.style.cssText = "position:fixed;opacity:0;top:0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        ta.remove();
        return ok;
      } catch (e2) {
        return false;
      }
    }
  }
  function flash(btn, ok) {
    const orig = () => (L === "ar" ? btn.dataset.ar : btn.dataset.en);
    btn.textContent = ok
      ? L === "ar"
        ? "تم النسخ"
        : "Copied"
      : L === "ar"
        ? "حدد النص يدوياً"
        : "Select the text to copy";
    setTimeout(() => {
      btn.innerHTML = orig();
    }, 1800);
  }
  function buildMsg() {
    const m = MSG[L],
      a = AREAS[+$("#fArea").value] || AREAS[0],
      si = +$("#fSvc").value,
      svc = si >= 0 ? T(SERVICES[si].t) : m.nosvc;
    const lines = [
      m.hello,
      `${m.name}: ${$("#fName").value.trim()}`,
      `${m.phone}: ${$("#fPhone").value.trim()}`,
      `${m.area}: ${T(a)}`,
      `${m.svc}: ${svc}`,
    ];
    if (st.touched) {
      const s = STYLES.find((x) => x.id === st.style);
      lines.push(`${m.style}: ${T(s.n)}`);
    }
    if (st.plan) {
      const plan = PLANS.find((x) => x.t.en === st.plan);
      if (plan) lines.push(`${m.plan}: ${T(plan.t)}`);
    }
    const about = $("#fMsg").value.trim();
    if (about) lines.push(`${m.about}: ${about}`);
    return lines.join("\n");
  }
  function parallax(box, scene) {
    box.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") return;
      const r = box.getBoundingClientRect();
      scene.style.setProperty(
        "--px",
        (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(2),
      );
      scene.style.setProperty(
        "--py",
        (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(2),
      );
    });
    box.addEventListener("pointerleave", () => {
      scene.style.setProperty("--px", 0);
      scene.style.setProperty("--py", 0);
    });
  }

  function bind() {
    $("#langBtn").addEventListener("click", () =>
      setLang(L === "en" ? "ar" : "en"),
    );
    const nav = $("#nav"),
      mb = $("#menuBtn");
    mb.addEventListener("click", () => {
      const o = nav.classList.toggle("open");
      mb.setAttribute("aria-expanded", String(o));
    });
    $$("#mnav a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        mb.setAttribute("aria-expanded", "false");
      }),
    );

    $("#plansGrid").addEventListener("click", (e) => {
      const link = e.target.closest("[data-plan]");
      if (link) st.plan = link.dataset.plan;
    });

    $("#styList").addEventListener("click", (e) => {
      const b = e.target.closest(".sty");
      if (!b || b.dataset.id === st.style) return;
      st.style = b.dataset.id;
      st.touched = true;
      renderDesignerUI();
      drawDesigner(true);
    });
    $("#tod").addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b || b.dataset.id === st.tod) return;
      st.tod = b.dataset.id;
      st.touched = true;
      renderDesignerUI();
      drawDesigner(true);
    });

    const dock = $("#dock");
    let centers = [];
    dock.addEventListener("click", (e) => {
      const b = e.target.closest(".dk");
      if (!b) return;
      st.plant = b.dataset.id;
      renderDock();
    });
    dock.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "touch") return;
      centers = $$(".dk", dock).map((b) => {
        const r = b.getBoundingClientRect();
        return r.left + r.width / 2;
      });
    });
    dock.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch" || innerWidth <= 860 || !centers.length)
        return;
      $$(".dk", dock).forEach((b, i) => {
        const d = e.clientX - centers[i];
        b.style.setProperty(
          "--w",
          (112 + 70 * Math.exp(-(d * d) / (2 * 72 * 72))).toFixed(1) + "px",
        );
      });
    });
    dock.addEventListener("pointerleave", () => {
      $$(".dk", dock).forEach((b) => b.style.removeProperty("--w"));
    });

    $("#calTabs").addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      st.phase = +b.dataset.i;
      renderCal();
    });

    let tick = false;
    addEventListener(
      "scroll",
      () => {
        if (tick) return;
        tick = true;
        requestAnimationFrame(() => {
          vineProgress();
          tick = false;
        });
      },
      { passive: true },
    );
    let rz;
    addEventListener("resize", () => {
      clearTimeout(rz);
      rz = setTimeout(drawVine, 120);
    });

    parallax($("#heroArt"), $("#heroScene"));
    parallax($("#dScene"), $("#dScene"));

    $$(".copy").forEach((b) =>
      b.addEventListener("click", async () => {
        flash(b, await copyText($("#" + b.dataset.copy).textContent.trim()));
      }),
    );

    const form = $("#form"),
      sent = $("#sent"),
      err = $("#err");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#fName").value.trim(),
        phone = $("#fPhone").value.trim();
      if (!name || phone.replace(/\D/g, "").length < 6) {
        err.textContent =
          L === "ar"
            ? "أضف اسمك ورقم هاتف صحيحاً لنتصل بك."
            : "Add your name and a valid phone number so we can call you back.";
        (name ? $("#fPhone") : $("#fName")).focus();
        return;
      }
      err.textContent = "";
      const msg = buildMsg();
      $("#sentTxt").textContent = msg;
      const whatsapp = CONFIG.whatsapp.replace(/\D/g, "");
      const waLink = $("#waLink");
      waLink.href =
        "https://wa.me/" +
        (whatsapp.length >= 6 ? whatsapp : "") +
        "?text=" +
        encodeURIComponent(msg);
      $("#sentHelp").textContent =
        L === "ar"
          ? whatsapp.length >= 6
            ? "سيُفتح واتساب والرسالة موجّهة إلى نيتشر كرافت. راجعها ثم اضغط إرسال."
            : "سيُفتح واتساب والرسالة جاهزة. اختر جهة اتصال نيتشر كرافت، وراجع الرسالة ثم اضغط إرسال."
          : whatsapp.length >= 6
            ? "WhatsApp will open with the enquiry addressed to Nature Craft. Review it and tap Send."
            : "WhatsApp will open with your enquiry ready. Choose the Nature Craft recipient, review the message, then tap Send.";
      form.hidden = true;
      sent.hidden = false;
      sent.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
    $("#editMsg").addEventListener("click", () => {
      sent.hidden = true;
      form.hidden = false;
      $("#fName").focus();
    });
    $("#copyMsg").addEventListener("click", async (e) => {
      flash(e.currentTarget, await copyText($("#sentTxt").textContent));
    });
  }

  /* Start the site: cache default English copy, bind events, then render. */
  function init() {
    $$("[data-ar]").forEach((el) => {
      el.dataset.en = el.innerHTML;
    });
    $("#phoneTxt").textContent = CONFIG.phone;
    $("#mailTxt").textContent = CONFIG.email;
    $("#phoneInfo").hidden = !CONFIG.phone;
    $("#emailInfo").hidden = !CONFIG.email;
    $("#heroSceneIn").innerHTML = buildScene(
      "majlis",
      "dusk",
      "h",
      L === "ar" ? "فناء مجلس عند الغروب" : "Majlis courtyard at dusk",
    );
    bind();
    setLang(L, L === "en");
    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(drawVine);
    addEventListener("load", drawVine);
    window.__nc = { buildScene, setLang, st, TOD };
  }
  init();
})();

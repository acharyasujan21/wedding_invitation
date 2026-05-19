/* ============================================================
   Procedural mandala + filigree generators
   All shapes are constructed from primitive arcs/petals tiled
   radially — no hand-authored complex SVG paths.
   ============================================================ */

/* ---------- helpers ---------- */

function petalPath(rInner, rOuter, halfWidth) {
  // a teardrop / almond petal pointing up from center
  // tip at (0, -rOuter), base curves at (±halfWidth, -rInner)
  const hw = halfWidth;
  return `M 0 ${-rOuter}
          C ${hw} ${-rOuter*0.55} ${hw} ${-rInner*0.8} 0 ${-rInner}
          C ${-hw} ${-rInner*0.8} ${-hw} ${-rOuter*0.55} 0 ${-rOuter} Z`;
}

function pointedLeafPath(rInner, rOuter, halfWidth) {
  // pointed leaf, more angular
  const hw = halfWidth;
  return `M 0 ${-rOuter}
          Q ${hw} ${-(rInner+rOuter)/2} ${hw*0.6} ${-rInner}
          L ${-hw*0.6} ${-rInner}
          Q ${-hw} ${-(rInner+rOuter)/2} 0 ${-rOuter} Z`;
}

function lotusPetalPath(rInner, rOuter, halfWidth) {
  const hw = halfWidth;
  return `M 0 ${-rOuter}
          C ${hw*1.1} ${-rOuter*0.6} ${hw*0.9} ${-rInner*1.1} ${hw*0.4} ${-rInner}
          Q 0 ${-rInner*0.85} ${-hw*0.4} ${-rInner}
          C ${-hw*0.9} ${-rInner*1.1} ${-hw*1.1} ${-rOuter*0.6} 0 ${-rOuter} Z`;
}

function radialLayer({ count, pathFn, args, fill='none', stroke, strokeWidth=1, opacity=1 }) {
  let out = '';
  const step = 360 / count;
  for (let i = 0; i < count; i++) {
    const angle = i * step;
    out += `<path d="${pathFn(...args)}" transform="rotate(${angle})"
      fill="${fill}" stroke="${stroke || 'none'}"
      stroke-width="${strokeWidth}" stroke-linejoin="round"
      stroke-linecap="round" opacity="${opacity}" />`;
  }
  return out;
}

function dotRing({ count, radius, dotR, fill, opacity=1 }) {
  let out = '';
  const step = (Math.PI * 2) / count;
  for (let i = 0; i < count; i++) {
    const a = i * step;
    const x = Math.cos(a) * radius;
    const y = Math.sin(a) * radius;
    out += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${dotR}" fill="${fill}" opacity="${opacity}" />`;
  }
  return out;
}

function ring({ r, stroke, strokeWidth=1, opacity=1, dash='' }) {
  return `<circle cx="0" cy="0" r="${r}" fill="none" stroke="${stroke}"
    stroke-width="${strokeWidth}" opacity="${opacity}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
}

function arcRing({ count, rInner, rOuter, fill, opacity=1, stroke, strokeWidth=0 }) {
  // segmented ring built from wedges
  let out = '';
  const step = 360 / count;
  const half = step / 2;
  const toRad = d => d * Math.PI / 180;
  for (let i = 0; i < count; i++) {
    const a = i * step;
    const a0 = toRad(a - half);
    const a1 = toRad(a + half);
    const x0o = Math.cos(a0) * rOuter, y0o = Math.sin(a0) * rOuter;
    const x1o = Math.cos(a1) * rOuter, y1o = Math.sin(a1) * rOuter;
    const x0i = Math.cos(a0) * rInner, y0i = Math.sin(a0) * rInner;
    const x1i = Math.cos(a1) * rInner, y1i = Math.sin(a1) * rInner;
    out += `<path d="M ${x0o} ${y0o} A ${rOuter} ${rOuter} 0 0 1 ${x1o} ${y1o}
                    L ${x1i} ${y1i} A ${rInner} ${rInner} 0 0 0 ${x0i} ${y0i} Z"
            fill="${fill}" opacity="${opacity}"
            ${stroke?`stroke="${stroke}" stroke-width="${strokeWidth}"`:''} />`;
  }
  return out;
}

function tinyDiamondRing({ count, radius, size, fill, opacity=1 }) {
  let out = '';
  const step = 360 / count;
  for (let i = 0; i < count; i++) {
    const a = i * step;
    out += `<g transform="rotate(${a}) translate(0 ${-radius})">
      <path d="M 0 ${-size} L ${size} 0 L 0 ${size} L ${-size} 0 Z" fill="${fill}" opacity="${opacity}" />
    </g>`;
  }
  return out;
}

/* ---------- main mandala ---------- */

function buildMandala() {
  const G = '#d4af37';      // gold
  const Gb = '#f0cf6e';     // gold bright
  const Gd = '#8a6018';     // gold deep
  const Maroon = '#3a0a14';
  const MaroonDark = '#1a050a';

  const size = 1500;
  const cx = size/2, cy = size/2;

  // All layers live inside ONE rotating wrapper so the whole mandala
  // spins as a unit — pattern is preserved at every moment, all rings
  // stay perfectly concentric.

  let layers = '';

  // ---- LAYER 1: outermost large pointed petals (24, glow outline)
  layers += radialLayer({
    count: 24,
    pathFn: pointedLeafPath,
    args: [430, 690, 42],
    fill: 'none',
    stroke: G,
    strokeWidth: 1.2,
    opacity: 0.55
  });
  layers += dotRing({ count: 24, radius: 695, dotR: 3.5, fill: Gb, opacity: 0.75 });

  // ---- LAYER 2: ring of medium almond petals (16, filled deep maroon + gold edge)
  layers += radialLayer({
    count: 16,
    pathFn: lotusPetalPath,
    args: [320, 520, 70],
    fill: Maroon,
    stroke: G,
    strokeWidth: 1.6,
    opacity: 0.92
  });
  layers += radialLayer({
    count: 16,
    pathFn: lotusPetalPath,
    args: [340, 500, 50],
    fill: 'none',
    stroke: Gb,
    strokeWidth: 0.8,
    opacity: 0.7
  });

  // ---- LAYER 3: decorative band (segmented arc ring)
  layers += ring({ r: 308, stroke: G, strokeWidth: 1, opacity: 0.7 });
  layers += ring({ r: 296, stroke: G, strokeWidth: 0.6, opacity: 0.6 });
  layers += arcRing({ count: 48, rInner: 296, rOuter: 308, fill: Gd, opacity: 0.55 });
  layers += dotRing({ count: 48, radius: 302, dotR: 2.0, fill: Gb, opacity: 0.9 });

  // ---- LAYER 4: inner lotus petals (12, filled)
  layers += radialLayer({
    count: 12,
    pathFn: lotusPetalPath,
    args: [180, 290, 62],
    fill: Maroon,
    stroke: G,
    strokeWidth: 1.4,
    opacity: 0.95
  });
  layers += radialLayer({
    count: 12,
    pathFn: lotusPetalPath,
    args: [195, 275, 38],
    fill: 'none',
    stroke: Gb,
    strokeWidth: 0.8,
    opacity: 0.85
  });
  layers += dotRing({ count: 12, radius: 232, dotR: 3, fill: Gb, opacity: 1 });

  // ---- LAYER 5: small petal ring (24, just outlines)
  layers += radialLayer({
    count: 24,
    pathFn: petalPath,
    args: [110, 170, 18],
    fill: 'none',
    stroke: G,
    strokeWidth: 1.0,
    opacity: 0.85
  });
  layers += tinyDiamondRing({ count: 24, radius: 175, size: 3, fill: Gb, opacity: 0.9 });

  // ---- LAYER 6: inner ring + 8 petals
  layers += ring({ r: 105, stroke: G, strokeWidth: 0.8, opacity: 0.8 });
  layers += ring({ r: 96, stroke: Gb, strokeWidth: 0.5, opacity: 0.7 });
  layers += radialLayer({
    count: 8,
    pathFn: lotusPetalPath,
    args: [40, 95, 28],
    fill: Gd,
    stroke: Gb,
    strokeWidth: 0.8,
    opacity: 0.95
  });

  // ---- CENTER: small medallion
  layers += `<circle r="38" fill="${MaroonDark}" stroke="${G}" stroke-width="1.2"/>`;
  layers += radialLayer({
    count: 6,
    pathFn: petalPath,
    args: [10, 32, 8],
    fill: Gb,
    stroke: 'none',
    opacity: 0.9
  });
  layers += `<circle r="6" fill="${Gb}" />`;

  // Single rotating wrapper. transform-origin uses viewBox coords (default
  // for SVG), so the whole mandala pivots around its true center.
  const wrapper =
    `<g class="lyr spin-cw" style="--dur:120s; transform-origin:${cx}px ${cy}px;">
       <g transform="translate(${cx} ${cy})">
         ${layers}
       </g>
     </g>`;

  return `<svg viewBox="0 0 ${size} ${size}" width="100%" height="100%"
    style="overflow:visible;">${wrapper}</svg>`;
}

/* ---------- ghost mandala (faint background) ---------- */

function buildGhostMandala() {
  const G = '#e8d59a';
  const size = 1300;
  const cx = size/2, cy = size/2;
  let g = `<g transform="translate(${cx} ${cy})">`;

  g += radialLayer({
    count: 18, pathFn: pointedLeafPath,
    args: [240, 580, 60],
    fill: 'none', stroke: G, strokeWidth: 1.4, opacity: 0.9
  });
  g += radialLayer({
    count: 12, pathFn: lotusPetalPath,
    args: [120, 260, 56],
    fill: 'none', stroke: G, strokeWidth: 1.2, opacity: 0.7
  });
  g += ring({ r: 580, stroke: G, strokeWidth: 0.8, opacity: 0.5 });
  g += ring({ r: 240, stroke: G, strokeWidth: 0.6, opacity: 0.6 });
  g += ring({ r: 110, stroke: G, strokeWidth: 0.6, opacity: 0.6 });
  g += dotRing({ count: 36, radius: 590, dotR: 2.4, fill: G, opacity: 0.7 });

  g += `</g>`;
  return `<svg viewBox="0 0 ${size} ${size}" style="overflow:visible;">${g}</svg>`;
}

/* ---------- top border ---------- */

function buildTopBorder(width, height) {
  const G = '#d4af37';
  const Gb = '#f0cf6e';
  const Gd = '#8a6018';
  // motif tile width
  const TW = 240;
  const TH = height;
  const count = Math.ceil(width / TW) + 1;

  // single motif as a function
  const motif = (x) => {
    const cx = x + TW/2;
    const baseY = 0;
    let m = '';
    // top thin band line
    m += `<line x1="${x}" y1="6" x2="${x+TW}" y2="6" stroke="${G}" stroke-width="0.6" opacity="0.6"/>`;
    m += `<line x1="${x}" y1="10" x2="${x+TW}" y2="10" stroke="${Gb}" stroke-width="0.4" opacity="0.5"/>`;

    // lace arches — downward-hanging filigree from top
    // central drop motif
    m += `<g transform="translate(${cx} 12)">
      <!-- diamond -->
      <path d="M 0 0 L 8 8 L 0 16 L -8 8 Z" fill="${G}" opacity="0.85"/>
      <!-- small leaf petals fanned downward -->
      ${radialLayer({
        count: 7, pathFn: pointedLeafPath,
        args: [10, 56, 12],
        fill: 'none', stroke: G, strokeWidth: 0.9, opacity: 0.78
      }).replace('<path', '<path transform="rotate(180)" ').replace('<path', '<path ')}
    </g>`;
    // The replace trick above won't reliably do per-element — do explicit fan instead:
    return '';
  };

  // Build a single tile programmatically with downward-hanging filigree
  let svg = '';

  for (let i = 0; i < count; i++) {
    const x = i * TW;
    const cx = x + TW/2;

    // two horizontal thread lines
    svg += `<line x1="${x}" y1="4"  x2="${x+TW}" y2="4"  stroke="${G}"  stroke-width="0.8" opacity="0.7"/>`;
    svg += `<line x1="${x}" y1="9"  x2="${x+TW}" y2="9"  stroke="${Gb}" stroke-width="0.4" opacity="0.55"/>`;

    // central hanging motif group
    svg += `<g transform="translate(${cx} 10)">
      <!-- diamond at top -->
      <path d="M 0 0 L 7 7 L 0 14 L -7 7 Z" fill="${Gb}" opacity="0.95"/>
      <!-- main downward teardrop -->
      <path d="M 0 16
               C 14 28 14 52 0 78
               C -14 52 -14 28 0 16 Z"
            fill="none" stroke="${G}" stroke-width="1.0" opacity="0.88"/>
      <!-- inner teardrop -->
      <path d="M 0 22
               C 8 32 8 50 0 64
               C -8 50 -8 32 0 22 Z"
            fill="${Gd}" opacity="0.55"/>
      <!-- bottom dot -->
      <circle cx="0" cy="82" r="2" fill="${Gb}" opacity="0.9"/>
      <!-- small fanned leaves around top of teardrop -->
      <g>
        <path d="M -22 18 Q -18 26 -10 30" stroke="${G}" stroke-width="0.7" fill="none" opacity="0.7"/>
        <path d="M  22 18 Q  18 26  10 30" stroke="${G}" stroke-width="0.7" fill="none" opacity="0.7"/>
        <path d="M -32 14 Q -30 26 -20 36" stroke="${G}" stroke-width="0.6" fill="none" opacity="0.55"/>
        <path d="M  32 14 Q  30 26  20 36" stroke="${G}" stroke-width="0.6" fill="none" opacity="0.55"/>
        <circle cx="-22" cy="18" r="1.4" fill="${Gb}" opacity="0.8"/>
        <circle cx=" 22" cy="18" r="1.4" fill="${Gb}" opacity="0.8"/>
      </g>
    </g>`;

    // side connector motifs (half-way between centers)
    const sx = x + TW;
    svg += `<g transform="translate(${sx} 10)">
      <!-- small flower at the seam -->
      <circle r="2.4" fill="${Gb}" opacity="0.95"/>
      <circle r="5" fill="none" stroke="${G}" stroke-width="0.6" opacity="0.7"/>
      <!-- pointed leaf below -->
      <path d="M 0 8 Q 5 26 0 46 Q -5 26 0 8 Z" fill="none" stroke="${G}" stroke-width="0.8" opacity="0.7"/>
      <path d="M 0 12 Q 3 24 0 38 Q -3 24 0 12 Z" fill="${Gd}" opacity="0.45"/>
      <!-- small flank curls -->
      <path d="M -8 14 Q -16 22 -14 34" stroke="${G}" stroke-width="0.6" fill="none" opacity="0.6"/>
      <path d="M  8 14 Q  16 22  14 34" stroke="${G}" stroke-width="0.6" fill="none" opacity="0.6"/>
      <circle cx="-14" cy="34" r="1.2" fill="${Gb}" opacity="0.8"/>
      <circle cx=" 14" cy="34" r="1.2" fill="${Gb}" opacity="0.8"/>
    </g>`;

    // tiny accent dots between
    svg += `<g opacity="0.7" fill="${Gb}">
      <circle cx="${x + TW*0.18}" cy="14" r="1.2"/>
      <circle cx="${x + TW*0.82}" cy="14" r="1.2"/>
      <circle cx="${x + TW*0.30}" cy="20" r="0.9"/>
      <circle cx="${x + TW*0.70}" cy="20" r="0.9"/>
    </g>`;
  }

  // bottom soft fade
  svg += `<linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#000" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity="0.0"/>
  </linearGradient>`;

  return svg;
}

/* ---------- couple silhouette ----------
   viewBox is 230 x 380.
   Groom left  (cx ~ 60), Bride right (cx ~ 170).
   Styled as gold-lit silhouettes with authentic Nepali wedding details. */

function buildCouple() {
  const G    = '#d4af37';
  const Gb   = '#f0cf6e';
  const Gd   = '#8a6018';
  const dark = '#1a050a';
  const red  = '#7a1226';

  return `
    <defs>
      <linearGradient id="silhGold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${Gb}" stop-opacity="0.95"/>
        <stop offset="1" stop-color="${G}"  stop-opacity="0.55"/>
      </linearGradient>
      <linearGradient id="silhDark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2a0712" stop-opacity="1"/>
        <stop offset="1" stop-color="#15040a" stop-opacity="1"/>
      </linearGradient>
    </defs>

    <!-- soft glow base -->
    <ellipse cx="115" cy="370" rx="110" ry="8" fill="${G}" opacity="0.18"/>

    <!-- ================= GROOM (LEFT) ================= -->
    <g transform="translate(0 0)">

      <!-- SURUWAL (jodhpur-style pants: baggy thighs, tight calves) -->
      <path d="M 30 380
               L 38 268
               C 38 260 48 256 60 256
               C 72 256 82 260 82 268
               L 90 380
               L 70 380
               L 64 300
               L 60 300
               L 56 300
               L 50 380 Z"
            fill="url(#silhDark)" stroke="${Gd}" stroke-width="0.6" opacity="0.92"/>

      <!-- DAURA (long cross-fold shirt, knee length) -->
      <path d="M 22 268
               L 24 175
               C 24 160 36 150 50 150
               L 70 150
               C 84 150 96 160 96 175
               L 98 268
               C 88 274 72 276 60 276
               C 48 276 32 274 22 268 Z"
            fill="url(#silhGold)" stroke="${Gb}" stroke-width="0.7" opacity="0.95"/>

      <!-- DAURA cross-over fold (diagonal across chest) -->
      <path d="M 24 178
               L 56 200
               L 96 178"
            fill="none" stroke="${Gd}" stroke-width="1.2" opacity="0.7"/>
      <path d="M 56 200
               L 56 268"
            fill="none" stroke="${Gd}" stroke-width="0.8" opacity="0.55"/>

      <!-- DAURA tie strings (chest knots) -->
      <circle cx="40" cy="190" r="1.6" fill="${dark}" opacity="0.8"/>
      <circle cx="48" cy="200" r="1.6" fill="${dark}" opacity="0.8"/>
      <circle cx="44" cy="212" r="1.4" fill="${dark}" opacity="0.7"/>

      <!-- PATUKA (sash around waist) -->
      <path d="M 22 252
               C 38 260 80 260 98 252
               L 98 270
               C 80 278 38 278 22 270 Z"
            fill="${red}" opacity="0.85" stroke="${Gb}" stroke-width="0.5"/>
      <line x1="22" y1="261" x2="98" y2="261" stroke="${Gb}" stroke-width="0.4" opacity="0.7"/>

      <!-- WEDDING GARLAND (mala) -->
      <path d="M 38 158
               C 44 196 76 196 82 158"
            fill="none" stroke="${Gb}" stroke-width="2.2" opacity="0.85" stroke-linecap="round"/>
      <circle cx="48" cy="186" r="2" fill="${Gb}"/>
      <circle cx="60" cy="192" r="2" fill="${Gb}"/>
      <circle cx="72" cy="186" r="2" fill="${Gb}"/>

      <!-- NECK -->
      <path d="M 50 152 L 70 152 L 68 130 L 52 130 Z"
            fill="url(#silhGold)" opacity="0.9"/>

      <!-- HEAD -->
      <circle cx="60" cy="115" r="22" fill="url(#silhGold)" opacity="0.92" stroke="${Gb}" stroke-width="0.6"/>

      <!-- DHAKA TOPI (traditional Nepali cap — asymmetric, flat top, slanted brim) -->
      <path d="M 36 105
               C 36 86 46 76 60 76
               C 74 76 88 84 88 102
               L 86 110
               C 82 108 78 106 74 106
               L 70 106
               L 70 112
               C 64 112 56 112 50 110
               L 44 108
               C 40 108 36 110 36 110 Z"
            fill="${dark}" opacity="0.95" stroke="${Gb}" stroke-width="0.6"/>

      <!-- Topi pattern (dots in characteristic dhaka weave) -->
      <g fill="${Gb}" opacity="0.85">
        <circle cx="46" cy="92" r="1.2"/>
        <circle cx="54" cy="86" r="1.2"/>
        <circle cx="62" cy="84" r="1.2"/>
        <circle cx="70" cy="88" r="1.2"/>
        <circle cx="78" cy="94" r="1.2"/>
        <circle cx="50" cy="100" r="0.9"/>
        <circle cx="58" cy="98" r="0.9"/>
        <circle cx="66" cy="98" r="0.9"/>
        <circle cx="74" cy="100" r="0.9"/>
      </g>

      <!-- TIKA on forehead (red rice tika) -->
      <ellipse cx="60" cy="108" rx="3" ry="4" fill="${red}" opacity="0.95"/>
      <ellipse cx="60" cy="106" rx="1.4" ry="1.8" fill="${Gb}" opacity="0.9"/>

      <!-- ARM reaching toward bride -->
      <path d="M 96 178
               C 116 184 130 198 138 218
               L 134 224
               C 124 208 112 198 92 196 Z"
            fill="url(#silhGold)" opacity="0.85"/>
    </g>

    <!-- ================= BRIDE (RIGHT) ================= -->
    <g transform="translate(0 0)">

      <!-- SARI SKIRT (A-line with pleats) -->
      <path d="M 138 380
               L 134 240
               C 138 210 150 196 170 196
               L 175 196
               C 195 196 207 210 211 240
               L 207 380 Z"
            fill="url(#silhGold)" stroke="${Gb}" stroke-width="0.7" opacity="0.95"/>

      <!-- Sari pleats (front center, accordion folds) -->
      <line x1="158" y1="240" x2="156" y2="380" stroke="${Gd}" stroke-width="0.6" opacity="0.55"/>
      <line x1="165" y1="232" x2="164" y2="380" stroke="${Gd}" stroke-width="0.6" opacity="0.55"/>
      <line x1="172" y1="230" x2="172" y2="380" stroke="${Gd}" stroke-width="0.7" opacity="0.7"/>
      <line x1="179" y1="232" x2="180" y2="380" stroke="${Gd}" stroke-width="0.6" opacity="0.55"/>
      <line x1="186" y1="240" x2="188" y2="380" stroke="${Gd}" stroke-width="0.6" opacity="0.55"/>

      <!-- Sari border at hem -->
      <path d="M 138 372 L 207 372" stroke="${Gb}" stroke-width="1.2" opacity="0.85"/>
      <path d="M 138 366 L 207 366" stroke="${Gb}" stroke-width="0.5" opacity="0.55"/>

      <!-- CHOLI (short blouse) -->
      <path d="M 144 240
               L 146 192
               C 146 184 154 178 164 178
               L 184 178
               C 194 178 200 184 200 192
               L 202 240
               C 188 244 158 244 144 240 Z"
            fill="url(#silhDark)" stroke="${Gb}" stroke-width="0.5" opacity="0.94"/>

      <!-- Choli border (gold trim) -->
      <path d="M 144 240 C 158 244 188 244 202 240" fill="none" stroke="${Gb}" stroke-width="0.9" opacity="0.8"/>
      <path d="M 146 192 C 164 188 186 188 200 192" fill="none" stroke="${Gb}" stroke-width="0.7" opacity="0.7"/>

      <!-- PALLU (sari end draped over left shoulder and head) -->
      <path d="M 196 184
               C 214 200 218 230 214 260
               L 204 264
               C 206 240 202 214 188 196 Z"
            fill="${red}" opacity="0.55" stroke="${Gb}" stroke-width="0.4"/>

      <!-- NECK -->
      <path d="M 162 178 L 184 178 L 182 156 L 164 156 Z"
            fill="url(#silhGold)" opacity="0.9"/>

      <!-- TILHARI (long beaded gold necklace going down) -->
      <path d="M 168 178
               L 168 230
               L 172 240
               L 176 230
               L 176 178"
            fill="none" stroke="${Gb}" stroke-width="0.8" opacity="0.85"/>
      <g fill="${Gb}">
        <circle cx="168" cy="186" r="1.1"/>
        <circle cx="168" cy="194" r="1.1"/>
        <circle cx="168" cy="202" r="1.1"/>
        <circle cx="168" cy="210" r="1.1"/>
        <circle cx="168" cy="218" r="1.1"/>
        <circle cx="176" cy="186" r="1.1"/>
        <circle cx="176" cy="194" r="1.1"/>
        <circle cx="176" cy="202" r="1.1"/>
        <circle cx="176" cy="210" r="1.1"/>
        <circle cx="176" cy="218" r="1.1"/>
        <!-- pendant -->
        <ellipse cx="172" cy="240" rx="4" ry="5"/>
      </g>

      <!-- NAUGEDI (collar choker necklace) -->
      <path d="M 158 176 Q 172 184 188 176" fill="none" stroke="${Gb}" stroke-width="2.2" opacity="0.9"/>
      <path d="M 158 180 Q 172 188 188 180" fill="none" stroke="${G}" stroke-width="0.7" opacity="0.7"/>

      <!-- HEAD -->
      <circle cx="173" cy="118" r="23" fill="url(#silhGold)" opacity="0.92" stroke="${Gb}" stroke-width="0.6"/>

      <!-- HAIR (visible above forehead, parted in middle with sindoor) -->
      <path d="M 152 110
               C 154 90 162 80 173 80
               C 184 80 192 90 194 110
               L 188 112
               C 185 100 180 92 173 92
               C 166 92 161 100 158 112 Z"
            fill="${dark}" opacity="0.95"/>

      <!-- SINDOOR (red parting line) -->
      <line x1="173" y1="86" x2="173" y2="108" stroke="${red}" stroke-width="1.8" opacity="0.95"/>

      <!-- SIRBANDI / MANGTIKA (forehead ornament with chain hanging from parting) -->
      <line x1="173" y1="90" x2="173" y2="106" stroke="${Gb}" stroke-width="0.4" opacity="0.9"/>
      <circle cx="173" cy="108" r="3" fill="${Gb}" opacity="0.95"/>
      <circle cx="173" cy="108" r="1.4" fill="${red}" opacity="0.95"/>
      <!-- side strings -->
      <path d="M 173 90 Q 164 100 156 110" fill="none" stroke="${Gb}" stroke-width="0.5" opacity="0.85"/>
      <path d="M 173 90 Q 182 100 190 110" fill="none" stroke="${Gb}" stroke-width="0.5" opacity="0.85"/>
      <circle cx="156" cy="110" r="1.2" fill="${Gb}"/>
      <circle cx="190" cy="110" r="1.2" fill="${Gb}"/>

      <!-- NATH (large nose ring with chain to ear) -->
      <circle cx="166" cy="124" r="6" fill="none" stroke="${Gb}" stroke-width="1.2" opacity="0.95"/>
      <circle cx="166" cy="124" r="3" fill="none" stroke="${Gb}" stroke-width="0.4" opacity="0.7"/>
      <!-- chain from nath to ear -->
      <path d="M 160 124 Q 154 122 150 124" fill="none" stroke="${Gb}" stroke-width="0.5" opacity="0.85"/>
      <g fill="${Gb}">
        <circle cx="157" cy="123" r="0.6"/>
        <circle cx="153" cy="123" r="0.6"/>
      </g>

      <!-- JHUMKA EARRINGS (hanging bell-shaped) -->
      <g>
        <!-- left ear -->
        <circle cx="150" cy="125" r="1.4" fill="${Gb}"/>
        <path d="M 148 128 L 152 128 L 151 134 L 149 134 Z" fill="${Gb}" opacity="0.95"/>
        <circle cx="150" cy="137" r="1.2" fill="${Gb}"/>
        <!-- right ear -->
        <circle cx="196" cy="125" r="1.4" fill="${Gb}"/>
        <path d="M 194 128 L 198 128 L 197 134 L 195 134 Z" fill="${Gb}" opacity="0.95"/>
        <circle cx="196" cy="137" r="1.2" fill="${Gb}"/>
      </g>

      <!-- GHOONGHAT (red veil draped over head from behind) -->
      <path d="M 150 100
               C 142 130 138 170 144 200
               L 138 202
               C 132 172 134 130 144 96 Z"
            fill="${red}" opacity="0.65" stroke="${Gb}" stroke-width="0.5"/>
      <path d="M 196 100
               C 204 130 208 170 202 200
               L 208 202
               C 214 172 212 130 202 96 Z"
            fill="${red}" opacity="0.65" stroke="${Gb}" stroke-width="0.5"/>
      <!-- veil top arc over hair -->
      <path d="M 148 92
               C 156 78 190 78 198 92"
            fill="none" stroke="${Gb}" stroke-width="0.8" opacity="0.7"/>

      <!-- ARM reaching toward groom -->
      <path d="M 144 196
               C 124 200 110 214 102 232
               L 106 238
               C 116 222 130 212 148 210 Z"
            fill="url(#silhGold)" opacity="0.85"/>

      <!-- BANGLES (red + gold bracelet stack) -->
      <g transform="translate(102 230)">
        <ellipse cx="0" cy="0" rx="6" ry="2" fill="${red}" opacity="0.9"/>
        <ellipse cx="0" cy="3" rx="6" ry="1.5" fill="${Gb}" opacity="0.9"/>
        <ellipse cx="0" cy="6" rx="6" ry="1.5" fill="${red}" opacity="0.9"/>
        <ellipse cx="0" cy="9" rx="6" ry="1.5" fill="${Gb}" opacity="0.9"/>
      </g>
    </g>

    <!-- joined hands accent (between figures) -->
    <circle cx="120" cy="232" r="4" fill="${Gb}" opacity="0.95"/>
    <circle cx="120" cy="232" r="8" fill="none" stroke="${Gb}" stroke-width="0.5" opacity="0.55"/>
  `;
}

/* ---------- small Ganesha icon for between names ---------- */

function buildGanesh() {
  const G  = '#d4af37';
  const Gb = '#f0cf6e';
  // stylized OM/Ganesha emblem (om symbol is simpler + iconic for Hindu weddings)
  return `
    <svg viewBox="0 0 64 64" style="overflow:visible;">
      <defs>
        <radialGradient id="omG" cx="50%" cy="50%" r="55%">
          <stop offset="0" stop-color="${Gb}"/>
          <stop offset="1" stop-color="${G}"/>
        </radialGradient>
      </defs>
      <!-- outer halo -->
      <circle cx="32" cy="32" r="30" fill="none" stroke="${G}" stroke-width="0.8" opacity="0.55"/>
      <circle cx="32" cy="32" r="26" fill="none" stroke="${Gb}" stroke-width="0.5" opacity="0.45"/>
      <!-- 8 small petals around -->
      ${(() => {
        let s=''; for(let i=0;i<8;i++){const a=i*45;s+=`<g transform="rotate(${a} 32 32)"><path d="M 32 4 Q 35 12 32 18 Q 29 12 32 4 Z" fill="${G}" opacity="0.7"/></g>`;}return s;
      })()}
      <!-- the ॐ character drawn in the center using text (universal across Devanagari fonts) -->
      <text x="32" y="44" text-anchor="middle"
            font-family="Tiro Devanagari Sanskrit, Yatra One, serif"
            font-size="36" fill="url(#omG)"
            style="paint-order:stroke fill;"
            stroke="${G}" stroke-width="0.3">ॐ</text>
    </svg>
  `;
}

/* ---------- corner filigree (placed under top border, both top corners) ---------- */

function buildCorner() {
  const G  = '#d4af37';
  const Gb = '#f0cf6e';
  return `
    <g opacity="0.7">
      <!-- curving stem from top-left -->
      <path d="M 0 0 Q 80 20 110 80 Q 120 130 90 180"
            fill="none" stroke="${G}" stroke-width="1.0"/>
      <path d="M 0 12 Q 70 30 100 88 Q 108 130 80 170"
            fill="none" stroke="${Gb}" stroke-width="0.5" opacity="0.6"/>
      <!-- leaves along the stem -->
      <g transform="translate(60 24) rotate(35)">
        <path d="M 0 0 Q 8 -18 0 -36 Q -8 -18 0 0 Z" fill="${G}" opacity="0.6"/>
      </g>
      <g transform="translate(96 70) rotate(70)">
        <path d="M 0 0 Q 10 -22 0 -44 Q -10 -22 0 0 Z" fill="none" stroke="${G}" stroke-width="0.8" opacity="0.75"/>
      </g>
      <g transform="translate(112 130) rotate(110)">
        <path d="M 0 0 Q 8 -16 0 -32 Q -8 -16 0 0 Z" fill="${Gb}" opacity="0.6"/>
      </g>
      <!-- dots -->
      <circle cx="40" cy="10" r="1.6" fill="${Gb}"/>
      <circle cx="80" cy="42" r="1.4" fill="${Gb}"/>
      <circle cx="108" cy="100" r="1.4" fill="${Gb}"/>
      <circle cx="98" cy="158" r="1.2" fill="${Gb}"/>
    </g>
  `;
}

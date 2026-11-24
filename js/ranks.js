/* ranks.js · sistema de rangos: 7 ligas × 4 divisiones + LEYENDA. Insignias en SVG con efecto 3D. */
import { t } from './i18n.js';
import { clamp } from './util.js';

const ROM = ['I', 'II', 'III', 'IV'];
/* c = [claro, medio, oscuro] · gl = brillo · cost = puntos por división */
export const TI = [
  { c: ['#ffd0a0', '#e07a2b', '#5e2a08'], gl: '#ff8a2b', cost: 100 },
  { c: ['#ffffff', '#b8c6d8', '#4a5a70'], gl: '#d8e6ff', cost: 120 },
  { c: ['#fff1a8', '#f2b41c', '#7a4a05'], gl: '#ffc933', cost: 150 },
  { c: ['#d6fbff', '#37c8e6', '#0b4f78'], gl: '#37e0ff', cost: 180 },
  { c: ['#e4e0ff', '#6a7cff', '#2a1a8a'], gl: '#8a7cff', cost: 220 },
  { c: ['#ffc2f0', '#e0309c', '#5a0a50'], gl: '#ff3fc0', cost: 260 },
  { c: ['#ffb0a8', '#e0243a', '#560812'], gl: '#ff3a3a', cost: 320 },
  { c: ['#fffbd0', '#ffd21f', '#8a5a00'], gl: '#ffd21f', cost: 0 },
];
const CUM = []; let LEG = 0;
TI.slice(0, 7).forEach((x) => { CUM.push(LEG); LEG += x.cost * 4; });
export const LEGEND_AT = LEG;

export function rankOf(rp) {
  rp = Math.max(0, rp | 0);
  if (rp >= LEG) return { t: 7, d: 0, i: 28, lo: LEG, hi: null, tierLo: LEG };
  let tt = 6; while (tt > 0 && rp < CUM[tt]) tt--;
  const c = TI[tt].cost, d = Math.min(3, Math.floor((rp - CUM[tt]) / c)), lo = CUM[tt] + d * c;
  return { t: tt, d, i: tt * 4 + d, lo, hi: lo + c, tierLo: CUM[tt] };
}
export const rankName = (r) => (r.t === 7 ? t('rank_7') : t('rank_' + r.t) + ' ' + ROM[r.d]);
export const rankProg = (rp) => { const r = rankOf(rp); return r.hi == null ? 1 : clamp((rp - r.lo) / (r.hi - r.lo), 0, 1); };
/* dificultad del bot según tu rango (1..100) */
export const rankDiff = (rp) => clamp(Math.round(2 + rankOf(rp).i * 3.45), 1, 100);

const SH = ['M50 6L88 20V52C88 74 70 88 50 96C30 88 12 74 12 52V20Z', 'M50 4L90 24L82 70L50 96L18 70L10 24Z',
  'M14 22L32 32L50 8L68 32L86 22V54C86 76 68 88 50 96C32 88 14 76 14 54Z', 'M50 4L90 27V73L50 96L10 73V27Z', 'M50 4L92 38L50 96L8 38Z',
  'M50 3L61 30L92 32L68 52L77 84L50 66L23 84L32 52L8 32L39 30Z', 'M50 4C64 22 88 24 88 50C88 76 68 90 50 97C32 90 12 76 12 50C12 24 36 22 50 4Z',
  'M8 80L4 26L30 48L50 10L70 48L96 26L92 80Z'];
const EM = [
  (l, k) => `<circle cx="50" cy="45" r="15" fill="${l}" stroke="${k}" stroke-width="3"/><rect x="45.5" y="58" width="9" height="17" rx="3" fill="${l}" stroke="${k}" stroke-width="3"/>`,
  (l) => `<path d="M32 52L50 36L68 52M32 68L50 52L68 68" fill="none" stroke="${l}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
  (l, k) => `<path d="M50 28l6.5 14 15 1.5-11.3 10 3.4 15L50 61l-13.6 7.5 3.4-15-11.3-10 15-1.5z" fill="${l}" stroke="${k}" stroke-width="2.5" stroke-linejoin="round"/>`,
  (l, k) => `<path d="M57 26L36 54H49L42 78L67 46H52Z" fill="${l}" stroke="${k}" stroke-width="2.5" stroke-linejoin="round"/>`,
  (l) => `<path d="M50 30L70 48L50 74L30 48Z M30 48H70 M50 30L42 48L50 74L58 48Z" fill="none" stroke="${l}" stroke-width="4" stroke-linejoin="round"/>`,
  (l) => `<circle cx="50" cy="52" r="18" fill="none" stroke="${l}" stroke-width="6"/><circle cx="50" cy="52" r="6" fill="${l}"/>`,
  (l, k) => `<path d="M50 26C58 40 67 44 64 58C62 70 56 76 50 76C44 76 38 70 36 58C35 48 44 44 50 26Z" fill="${l}" stroke="${k}" stroke-width="2.5" stroke-linejoin="round"/>`,
  (l) => `<circle cx="50" cy="60" r="9" fill="#37e0ff" stroke="${l}" stroke-width="3"/><circle cx="26" cy="46" r="3.5" fill="${l}"/><circle cx="74" cy="46" r="3.5" fill="${l}"/><circle cx="50" cy="26" r="3.5" fill="${l}"/>`,
];
let uid = 0;
/* HTML de la insignia: tier 0-7, división 0-3 (o -1 para mostrar el emblema), tamaño en px */
export function badge(tier, div, sz, still) {
  const x = TI[tier], l = x.c[0], m = x.c[1], k = x.c[2], u = 'rbg' + (++uid), sm = div >= 0 && tier < 7;
  const em = sm
    ? `<text x="50" y="62" text-anchor="middle" font-size="34" font-weight="900" font-style="italic" fill="#fff" stroke="${k}" stroke-width="3" paint-order="stroke" font-family="Arial,sans-serif">${ROM[div]}</text>`
    : EM[tier](l, k);
  const sp = tier >= 4 ? '<span class="sp"><i style="--x:.15;--d:2.6s;--dl:0s"></i><i style="--x:.5;--d:3.1s;--dl:.9s"></i><i style="--x:.82;--d:2.8s;--dl:1.7s"></i></span>' : '';
  return `<span class="rbadge t${tier}${still ? ' still' : ''}" style="width:${sz}px;height:${sz}px;--gc:${x.gl}"><span class="in"><svg viewBox="0 0 100 100" aria-hidden="true"><defs>
<linearGradient id="${u}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${l}"/><stop offset=".45" stop-color="${m}"/><stop offset="1" stop-color="${k}"/></linearGradient>
<linearGradient id="${u}i" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${k}"/><stop offset="1" stop-color="${m}"/></linearGradient>
<radialGradient id="${u}s" cx=".3" cy=".18" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
<path d="${SH[tier]}" fill="rgba(0,0,0,.45)" transform="translate(2.5 5)"/>
<path d="${SH[tier]}" fill="url(#${u}g)" stroke="${l}" stroke-width="3" stroke-linejoin="round"/>
<path d="${SH[tier]}" fill="url(#${u}i)" opacity=".6" transform="translate(50 52) scale(.78) translate(-50 -52)"/>
<path d="${SH[tier]}" fill="url(#${u}s)"/>${em}</svg></span>${sp}</span>`;
}

/* ============================================================================================
   EMBLEMAS GRANDES PARA LA PANTALLA "RANGOS" (más detallados que badge(), con evolución por división)
   ============================================================================================ */
const PAL = [
  { c: ['#ffe2b0', '#e8902e', '#4a2a0a'], a: '#ff8a2b', b: '#ffd79a' },              /* 0 Bronce */
  { c: ['#ffffff', '#cdd9ec', '#455068'], a: '#ff3b4a', b: '#eef4ff' },              /* 1 Plata (ojos rojos) */
  { c: ['#fff4c2', '#f2b41c', '#6a3f05'], a: '#ff2d4f', b: '#37e0ff' },              /* 2 Oro (gemas roja/cian) */
  { c: ['#e8fdff', '#37c8e6', '#0b3f66'], a: '#eaf6ff', b: '#9fe8ff' },              /* 3 Platino */
  { c: ['#efe9ff', '#7c6bff', '#241469'], a: '#c9bfff', b: '#efe9ff' },              /* 4 Diamante */
  { c: ['#ffc7bd', '#e0243a', '#430810'], a: '#ff6a3a', b: '#ffdca0' },              /* 5 Maestro (dragón rojo) */
  { c: ['#fff6cf', '#ffcf33', '#7a5400'], a: '#f5f8ff', b: '#37c8e6' },              /* 6 Gran Maestro */
  { c: ['#3a1052', '#1a0430', '#060008'], a: '#ffd21f', b: '#8b3dff' },              /* 7 Leyenda */
];

/* trazos de cada rango (viewBox 0 0 120 120). Pensados como silueta reconocible, no foto-realista. */
function emPaths(tier) {
  switch (tier) {
    case 0: return { /* bestia metálica con cuernos */
      body: 'M60 16L74 30L92 24L84 46L100 54L82 62L86 86L60 72L34 86L38 62L20 54L36 46L28 24L46 30Z',
      extra: ['M60 16L52 2L60 10L68 2Z'], eyes: [[48, 56], [72, 56]],
    };
    case 1: return { /* cabeza de lobo */
      body: 'M60 30L74 58L68 84L60 96L52 84L46 58Z',
      extra: ['M30 14L46 44L24 40Z', 'M90 14L74 44L96 40Z', 'M60 30L52 46L60 58L68 46Z'],
      eyes: [[49, 56], [71, 56]],
    };
    case 2: return { /* corona imperial */
      body: 'M26 70H94V88H26Z',
      extra: ['M26 70L34 38L46 62L60 24L74 62L86 38L94 70Z'],
      gems: [[60, 50, 8, 0], [36, 72, 4, 1], [84, 72, 4, 1]],
    };
    case 3: return { /* cristal con alas metálicas */
      body: 'M60 26L80 56L60 96L40 56Z',
      extra: ['M40 56L60 66L80 56', 'M60 26L60 96'],
      wings: [['M38 54L8 36L20 54L6 60L34 66Z'], ['M82 54L112 36L100 54L114 60L86 66Z']],
    };
    case 4: return { /* gema violeta multifacética */
      body: 'M60 18L88 40L88 76L60 102L32 76L32 40Z',
      extra: ['M60 18L60 56L32 40', 'M60 18L60 56L88 40', 'M60 56L32 76', 'M60 56L88 76', 'M60 56L60 102'],
    };
    case 5: return { /* dragón rojo */
      body: 'M26 80L22 46L42 28L60 10L78 28L98 46L94 80L74 64L60 78L46 64Z',
      extra: ['M60 10L54 -2L66 -2Z', 'M38 50L30 60L40 58Z', 'M82 50L90 60L80 58Z'],
      eyes: [[50, 48], [70, 48]],
    };
    case 6: return { /* corona + alas + cristal azul */
      body: 'M40 62H80V76H40Z',
      extra: ['M40 62L46 40L60 56L74 40L80 62'],
      wings: [['M40 64L10 50L22 66L8 72L36 78Z'], ['M80 64L110 50L98 66L112 72L84 78Z']],
      gems: [[60, 86, 9, 1]],
    };
    case 7: return { /* criatura oscura coronada, alas cósmicas */
      body: 'M60 20L80 46L72 54L92 60L76 70L84 94L60 80L36 94L44 70L28 60L48 54L40 46Z',
      extra: ['M60 20L52 4L60 12L68 4Z'],
      wings: [['M38 56L4 34L18 56L0 66L32 70Z'], ['M82 56L116 34L102 56L120 66L88 70Z']],
      eyes: [[50, 58], [70, 58]],
      gems: [[60, 68, 6, 1]],
    };
  }
}

let ruid = 0;
/* emblema grande (120x120): tier 0-7, div 0-3 (más detalle con cada división), state: 'locked'|'active'|'done' */
export function rankEmblem(tier, div, state) {
  const pal = PAL[tier], P_ = emPaths(tier), u = 'remb' + (++ruid);
  const locked = state === 'locked', lvl = locked ? 0 : (div == null ? 3 : div);
  const [l, m, k] = locked ? ['#5a6378', '#3a4154', '#1c2030'] : pal.c;
  const glow = locked ? 'transparent' : pal.a;
  let defs = `<linearGradient id="${u}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${l}"/><stop offset=".5" stop-color="${m}"/><stop offset="1" stop-color="${k}"/></linearGradient>
<radialGradient id="${u}s" cx=".32" cy=".2" r=".75"><stop offset="0" stop-color="#fff" stop-opacity="${locked ? 0.15 : 0.8}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`;
  let inner = `<path d="${P_.body}" fill="rgba(0,0,0,.5)" transform="translate(3 6)"/>
<path d="${P_.body}" fill="url(#${u}g)" stroke="${locked ? '#2a3146' : l}" stroke-width="3" stroke-linejoin="round"/>`;
  (P_.extra || []).forEach((d) => { inner += `<path d="${d}" fill="${lvl >= 1 ? 'url(#' + u + 'g)' : 'none'}" stroke="${locked ? '#2a3146' : l}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`; });
  if (P_.wings) P_.wings.forEach((w) => { inner += `<path d="${w[0]}" fill="url(#${u}g)" opacity="${locked ? .5 : .92}" stroke="${locked ? '#2a3146' : l}" stroke-width="2" stroke-linejoin="round"/>`; });
  (P_.gems || []).forEach(([x, y, r, side]) => { if (lvl < 1 && !side) return; inner += `<circle cx="${x}" cy="${y}" r="${r}" fill="${side ? pal.b : pal.a}" stroke="${k}" stroke-width="2"/>`; if (!locked) inner += `<circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.3}" fill="#fff" opacity=".8"/>`; });
  (P_.eyes || []).forEach(([x, y]) => { inner += `<circle cx="${x}" cy="${y}" r="3.4" fill="${locked ? '#4a5168' : pal.a}"${locked ? '' : ' class="rkEye"'}/>`; });
  inner += `<path d="${P_.body}" fill="url(#${u}s)"/>`;
  /* brillos/partículas: aparecen y crecen con la división */
  let sp = '';
  if (!locked && lvl >= 1) { const n = [0, 3, 5, 7][lvl]; for (let i = 0; i < n; i++) { const a = (i / n) * 6.283, r = 50 + (i % 2) * 8; sp += `<circle class="rkSpk" cx="${60 + Math.cos(a) * r}" cy="${60 + Math.sin(a) * r}" r="${1.6 + (i % 3) * .5}" fill="${i % 2 ? pal.a : pal.b}" style="--i:${i}"/>`; } }
  const ring = !locked && lvl >= 3 ? `<circle cx="60" cy="60" r="56" fill="none" stroke="${pal.a}" stroke-width="1.4" opacity=".55" class="rkRing"/>` : '';
  return `<span class="remblem${locked ? ' locked' : ''} t${tier}" style="--gc:${glow}"><svg viewBox="0 0 120 120" aria-hidden="true"><defs>${defs}</defs>${ring}${inner}${sp}</svg></span>`;
}

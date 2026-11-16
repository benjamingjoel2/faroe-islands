// Shared template helpers — pure functions returning HTML strings.
import fs from 'node:fs';
import path from 'node:path';
import config from '../config.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');

export const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Allow a tiny inline markup in copy: *italic* → <em>, [text](url) → link
export const md = (s = '') => esc(s)
  .replace(/\*([^*]+)\*/g, '<em>$1</em>')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, u) => `<a class="link" href="${u}"${/^https?:/.test(u) ? ' rel="noopener" target="_blank"' : ''}>${t}</a>`);

export const paras = (arr = []) => (Array.isArray(arr) ? arr : [arr]).map(p => `<p>${md(p)}</p>`).join('');

export const join = (a) => a.filter(Boolean).join('');

// ---------- URLs ----------
export const locPrefix = (lang) => (lang === config.defaultLocale ? '' : `/${lang}`);
export const href = (lang, slug = '') => {
  const p = locPrefix(lang) + (slug ? `/${slug}` : '');
  return p || '/';
};
export const abs = (p) => config.siteUrl + (p === '/' ? '/' : p);

// ---------- Images ----------
let SIZES = null;
let MANIFEST = null;
export const loadImages = () => {
  const sp = path.join(ROOT, 'src/images/sizes.json');
  const mp = path.join(ROOT, 'src/images/manifest.json');
  SIZES = fs.existsSync(sp) ? JSON.parse(fs.readFileSync(sp, 'utf8')) : {};
  MANIFEST = fs.existsSync(mp) ? JSON.parse(fs.readFileSync(mp, 'utf8')) : [];
  return { SIZES, MANIFEST };
};
export const manifest = () => MANIFEST || loadImages().MANIFEST;
export const imgInfo = (file) => {
  if (!SIZES) loadImages();
  const base = file.replace(/\.[a-z]+$/i, '');
  const s = SIZES[base];
  if (!s) throw new Error(`Image not processed: ${file} (run npm run images)`);
  return { base, ...s };
};
const srcset = (base, widths, fmt) => widths.map(w => `/img/${base}-${w}.${fmt} ${w}w`).join(', ');

/**
 * Responsive <picture> with AVIF + WebP, explicit width/height, lazy by default.
 * opts: { alt, sizes, cls, priority, focus, maxW }
 */
export const img = (file, opts = {}) => {
  const { base, w, h, widths, focus } = imgInfo(file);
  const ws = opts.maxW ? widths.filter(x => x <= opts.maxW) : widths;
  const use = ws.length ? ws : [widths[0]];
  const sizes = opts.sizes || '100vw';
  const fallbackW = use.find(x => x >= 1080) || use[use.length - 1];
  const pos = opts.focus || focus;
  const style = pos && pos !== 'center' ? ` style="object-position:${esc(pos)}"` : '';
  const loading = opts.priority ? 'fetchpriority="high" loading="eager" decoding="sync"' : 'loading="lazy" decoding="async"';
  return `<picture${opts.cls ? ` class="${opts.cls}"` : ''}>`
    + `<source type="image/avif" srcset="${srcset(base, use, 'avif')}" sizes="${sizes}">`
    + `<source type="image/webp" srcset="${srcset(base, use, 'webp')}" sizes="${sizes}">`
    + `<img src="/img/${base}-${fallbackW}.webp" width="${w}" height="${h}" alt="${esc(opts.alt ?? '')}" ${loading}${style}>`
    + `</picture>`;
};
// preload tag for the LCP image
export const preload = (file, sizes = '100vw') => {
  const { base, widths } = imgInfo(file);
  return `<link rel="preload" as="image" type="image/avif" imagesrcset="${srcset(base, widths, 'avif')}" imagesizes="${sizes}" fetchpriority="high">`;
};
export const ogImage = (file) => {
  const { base, widths } = imgInfo(file);
  const w = widths.includes(1200) ? 1200 : widths.find(x => x >= 1080) || widths[widths.length - 1];
  return `/img/${base}-${w}.jpg`;
};

// ---------- Icons ----------
export const icon = {
  arrow: '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 11 11 3M4.5 3H11v6.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  right: '<svg viewBox="0 0 14 10" aria-hidden="true"><path d="M0 5h12M8 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  chev: '<svg class="chev" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  // turf-roof house glyph for the logo
  logo: '<svg viewBox="0 0 40 28" aria-hidden="true"><path d="M2 13 20 2l18 11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M1 13.5c4-2.6 7-1.2 10-2.6s6-5 9-6 7 3 10 5 6 2.4 9 3.6" fill="none" stroke="currentColor" stroke-width="1.4" opacity=".55"/><path d="M7 14v12h26V14" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M17 26v-7h6v7" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  tunnel: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 14V8a6 6 0 0 1 12 0v6M6 14V9a2 2 0 0 1 4 0v5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
  road: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 1 3 15M11 1l2 14M8 2v2M8 7v2M8 12v2" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
  ferry: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 12c2 1.5 4 1.5 7 0s5-1.5 7 0M2.5 10 4 6h8l1.5 4M6 6V3h4v3" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
  boat: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 12c2 1.5 4 1.5 7 0s5-1.5 7 0M3 10h10l-1.5-3H8V2L4 7" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
  heli: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 3h14M8 3v2M3 9a4 3 0 0 1 4-3h3a3 3 0 0 1 0 6H6M10 12v2M5 14h7M13 9h2" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
  walk: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9 2.5a1 1 0 1 1 0 .1M7 15l1.5-5L10 12v3M8.5 10 9 6l2 2 2 .5M9 6 6 7l-1 3" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
};

// ---------- Buttons ----------
export const btn = (url, label, cls = '') => `<a class="btn ${cls}" href="${url}"><span>${esc(label)}</span><span class="btn__i">${icon.arrow}</span></a>`;
export const tlink = (url, label) => `<a class="tlink" href="${url}">${esc(label)} ${icon.right}</a>`;

// ---------- Theme motifs ----------
// Faroese knitting band: 12×5 pixel motif (two rows of "lice" dots over a zig-zag), as a CSS mask
export const KNIT_SVG = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="12" height="5" shape-rendering="crispEdges"><path d="M0 4h1V3h1V2h1V1h1V0h1v1h1v1h1v1h1v1h1V3h1V2h1V1h1v1h-1v1h-1v1h-1v1H8V4H7V3H6V2H5V1H4v1H3v1H2v1H1v1H0z"/><path d="M5 3h2v1H5z"/></svg>')}")`;

// Stepped basalt strata — section divider. `tone` = the colour of the section BELOW.
export const basalt = (tone = 'tar', flip = false) => `<div class="basalt basalt--${tone}${flip ? ' basalt--flip' : ''}" aria-hidden="true"><svg viewBox="0 0 1440 56" preserveAspectRatio="none"><path fill="currentColor" d="M0 56V30h96v-6h170v-9h118v6h152V8h134v10h96v-5h206v14h120v-9h104v13h148v-8h96v38z"/><path fill="currentColor" opacity=".45" d="M0 30V22h120v-5h150v-8h94v6h156V3h116v8h110v-4h190v12h130v-8h96v10h162v-6h16v18H0z"/></svg></div>`;

export const fogbank = (soft = false) => `<div class="fogbank${soft ? ' fogbank--soft' : ''}" aria-hidden="true"><i></i><i></i><i></i></div>`;

// Split a statement into word spans for the scroll-linked reveal
export const words = (text) => {
  const parts = String(text).split(/\s+/).filter(Boolean);
  const n = parts.length;
  return parts.map((w, i) => {
    const m = w.match(/^\*(.+)\*([.,;:!?]?)$/);
    const inner = m ? `<em>${esc(m[1])}</em>${esc(m[2])}` : esc(w.replace(/\*/g, ''));
    return `<span class="w" style="--i:${(i / n * 1.25).toFixed(3)}">${inner}</span>`;
  }).join(' ').replace(/^/, '') + '';
};
export const statementStyle = (text) => `--n:1.25`;

// ---------- Solar maths (NOAA) for daylight at Tórshavn ----------
export const TORSHAVN = { lat: 62.0107, lon: -6.7741 };
export function sunTimes(date, { lat, lon } = TORSHAVN) {
  const rad = Math.PI / 180;
  const day = Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - Date.UTC(date.getUTCFullYear(), 0, 0)) / 864e5);
  const g = 2 * Math.PI / 365 * (day - 1);
  const eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const cosH = (Math.cos(90.833 * rad) / (Math.cos(lat * rad) * Math.cos(decl))) - Math.tan(lat * rad) * Math.tan(decl);
  if (cosH < -1) return { daylight: 24 };
  if (cosH > 1) return { daylight: 0 };
  const ha = Math.acos(cosH) / rad;
  const rise = 720 - 4 * (lon + ha) - eqt; // minutes UTC
  const set = 720 - 4 * (lon - ha) - eqt;
  return { rise, set, daylight: (set - rise) / 60 };
}

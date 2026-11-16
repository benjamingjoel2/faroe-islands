// Static site build: renders every page in every locale to dist/.
// Usage: npm run build
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { transform } from 'esbuild';
import config from '../src/config.mjs';
import { loadImages, href, abs } from '../src/templates/lib.mjs';
import { layout } from '../src/templates/layout.mjs';
import * as P from '../src/templates/pages.mjs';
import { REGIONS } from '../src/data/regions.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIST = path.join(ROOT, 'dist');
const t0 = Date.now();

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

// ---------- helpers ----------
const copyDir = (from, to) => {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b = path.join(to, e.name);
    if (e.isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b);
  }
};
const hash = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 10);
const write = (rel, content) => {
  const f = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content);
};
const emitAsset = async (src, ext, loader) => {
  const code = fs.readFileSync(path.join(ROOT, src), 'utf8');
  const out = (await transform(code, { loader, minify: true, target: ['es2019', 'safari14'] })).code;
  const name = `/assets/${path.basename(src, '.' + ext)}.${hash(out)}.${ext}`;
  write(name, out);
  return name;
};

// ---------- assets ----------
loadImages();
copyDir(path.join(ROOT, 'public'), DIST);
copyDir(path.join(ROOT, 'src/fonts'), path.join(DIST, 'fonts'));
const css = (await transform(fs.readFileSync(path.join(ROOT, 'src/assets/css/site.css'), 'utf8'), { loader: 'css', minify: true })).code;
const assets = {
  css,
  js: await emitAsset('src/assets/js/site.js', 'js', 'js'),
  planner: await emitAsset('src/assets/js/planner.js', 'js', 'js'),
  transport: await emitAsset('src/assets/js/transport.js', 'js', 'js'),
};

// ---------- content ----------
const content = {};
for (const lang of config.locales) {
  content[lang] = (await import(path.join(ROOT, `src/content/${lang}/index.mjs`))).default;
}
const langNames = Object.fromEntries(config.locales.map(l => [l, content[l].ui.langName]));

// Structural check: every locale must mirror English (same keys, same array lengths)
const problems = [];
const shape = (a, b, p) => {
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return problems.push(`${p}: expected array`);
    if (a.length !== b.length) problems.push(`${p}: length ${b.length} ≠ ${a.length}`);
    a.forEach((x, i) => b[i] !== undefined && shape(x, b[i], `${p}[${i}]`));
  } else if (a && typeof a === 'object') {
    if (!b || typeof b !== 'object') return problems.push(`${p}: expected object`);
    for (const k of Object.keys(a)) if (!(k in b)) problems.push(`${p}.${k}: missing`);
    for (const k of Object.keys(a)) if (k in b) shape(a[k], b[k], `${p}.${k}`);
  } else if (typeof a === 'number' && a !== b) problems.push(`${p}: number changed ${a} → ${b}`);
};
for (const lang of config.locales.filter(l => l !== 'en')) shape(content.en, content[lang], lang);
if (problems.length) {
  console.error(`Locale structure problems (${problems.length}):\n` + problems.slice(0, 60).join('\n'));
  if (process.env.STRICT_I18N !== '0') process.exit(1);
}

// ---------- pages ----------
const routes = (C) => [
  ['', P.home],
  ...REGIONS.map(r => [r.slug, (c) => P.place(c, r.id)]),
  ['journeys', P.journeys],
  ['stays', P.stays],
  ['about', P.about],
  ['faq', P.faq],
  ['journal', P.journal],
  ...C.pages.journal.posts.map(p => [`journal/${p.slug}`, (c) => P.article(c, c.pages.journal.posts.find(x => x.slug === p.slug))]),
  ['enquire', P.enquire],
  ['enquire/thanks', P.thanks],
  ['weather-planner', P.planner],
  ['hiking-access', P.access],
  ['getting-around', P.transport],
  ['privacy', (c) => P.legal(c, 'privacy')],
  ['booking-terms', (c) => P.legal(c, 'terms')],
  ['cookies', (c) => P.legal(c, 'cookies')],
  ['credits', P.credits],
];

const sitemap = [];
let count = 0;
for (const lang of config.locales) {
  const base = content[lang];
  for (const [slug, render] of routes(base)) {
    const C = { lang, slug, langNames, ...base };
    const page = render(C);
    page.scripts = (page.scripts || []).map(s => s === '__PLANNER_JS__' ? assets.planner : s === '__TRANSPORT_JS__' ? assets.transport : s);
    let html = layout({ ...C, footerImage: page.footerImage }, page, assets);
    const rel = (lang === config.defaultLocale ? '' : `${lang}/`) + (slug ? `${slug}.html` : 'index.html');
    write(lang !== config.defaultLocale && !slug ? `${lang}/index.html` : rel, html);
    if (!page.noindex) sitemap.push({ slug, lang });
    count++;
  }
}
// 404 (English, links to all languages)
{
  const C = { lang: 'en', slug: '404', langNames, ...content.en };
  write('404.html', layout(C, P.notFound(C), assets));
}

// ---------- sitemap / robots / favicon ----------
const uniq = [...new Set(sitemap.map(s => s.slug))];
const today = new Date().toISOString().slice(0, 10);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${uniq.flatMap(slug => config.locales.map(l => `<url><loc>${abs(href(l, slug))}</loc><lastmod>${today}</lastmod>${config.locales.map(x => `<xhtml:link rel="alternate" hreflang="${x}" href="${abs(href(x, slug))}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${abs(href('en', slug))}"/></url>`)).join('\n')}
</urlset>`);
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /enquire/thanks\n\nSitemap: ${config.siteUrl}/sitemap.xml\n`);
write('favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="${config.palette.tar}"/><g transform="translate(0 6)" fill="none" stroke="${config.palette.wool}" stroke-width="2.6" stroke-linejoin="round"><path d="M3 13 20 3l17 10"/><path d="M8 14v11h24V14"/></g><path d="M3 18c5-2 9-1 13-3s8-3 12-1 6 2 9 3" fill="none" stroke="${config.palette.puffin}" stroke-width="1.6"/></svg>`);

console.log(`Built ${count} pages in ${config.locales.length} languages → dist/ (${((Date.now() - t0) / 1000).toFixed(1)}s)`);

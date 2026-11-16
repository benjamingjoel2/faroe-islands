// Checks that a locale mirrors English exactly: same keys, same array lengths,
// same numbers, same {placeholders}, same link URLs. Usage: node scripts/check-i18n.mjs fr
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const langs = process.argv.slice(2).length ? process.argv.slice(2) : ['fr', 'de', 'es'];
const load = async (l) => (await import(path.join(ROOT, `src/content/${l}/index.mjs`))).default;
const en = await load('en');
let bad = 0;
const FIXED = new Set(['id', 'slug', 'img', 'region', 'time', 'date', 'mode', 'htmlLangFixed']);
for (const lang of langs) {
  const loc = await load(lang);
  const out = [];
  const ph = (s) => (String(s).match(/\{\w+\}/g) || []).sort().join();
  const urls = (s) => (String(s).match(/\]\(([^)]+)\)/g) || []).sort().join();
  const walk = (a, b, p) => {
    if (Array.isArray(a)) {
      if (!Array.isArray(b)) return out.push(`${p}: expected array`);
      if (a.length !== b.length) out.push(`${p}: ${b.length} items, English has ${a.length}`);
      a.forEach((x, i) => b[i] !== undefined && walk(x, b[i], `${p}[${i}]`));
    } else if (a && typeof a === 'object') {
      if (!b || typeof b !== 'object') return out.push(`${p}: expected object`);
      for (const k of Object.keys(a)) if (!(k in b)) out.push(`${p}.${k}: missing`);
      for (const k of Object.keys(b)) if (!(k in a)) out.push(`${p}.${k}: extra key`);
      for (const k of Object.keys(a)) if (k in b) walk(a[k], b[k], `${p}.${k}`);
    } else if (typeof a === 'number' || typeof a === 'boolean') {
      if (a !== b) out.push(`${p}: value changed ${a} → ${b}`);
    } else if (typeof a === 'string') {
      if (typeof b !== 'string') return out.push(`${p}: expected string`);
      if (FIXED.has(p.split('.').pop()) && a !== b) out.push(`${p}: must stay "${a}"`);
      if (ph(a) !== ph(b)) out.push(`${p}: placeholders differ (${ph(a)} vs ${ph(b)})`);
      if (urls(a) !== urls(b)) out.push(`${p}: link URLs differ`);
      if (a.trim() && !b.trim()) out.push(`${p}: empty translation`);
    }
  };
  walk(en, loc, lang);
  console.log(out.length ? `${lang}: ${out.length} problem(s)\n  ` + out.join('\n  ') : `${lang}: OK`);
  bad += out.length;
}
process.exit(bad ? 1 : 0);

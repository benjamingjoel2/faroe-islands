// Generates responsive AVIF + WebP derivatives (and one JPEG for social cards)
// from src/images/raw/*.jpg into public/img/, and records sizes in src/images/sizes.json.
// Existing outputs are skipped, so re-running is fast. Use --force to rebuild all.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const RAW = path.join(ROOT, 'src/images/raw');
const OUT = path.join(ROOT, 'public/img');
const SIZES = path.join(ROOT, 'src/images/sizes.json');
const WIDTHS = [480, 800, 1200, 1600, 2000, 2560];
const force = process.argv.includes('--force');

fs.mkdirSync(OUT, { recursive: true });
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/images/manifest.json'), 'utf8'));
const sizes = fs.existsSync(SIZES) && !force ? JSON.parse(fs.readFileSync(SIZES, 'utf8')) : {};
sharp.concurrency(2);

const files = fs.readdirSync(RAW).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
let done = 0;
for (const f of files) {
  const base = f.replace(/\.[a-z]+$/i, '');
  const src = path.join(RAW, f);
  const meta = await sharp(src).metadata();
  const W = meta.width, H = meta.height;
  const widths = WIDTHS.filter(w => w <= W);
  if (!widths.length) widths.push(W);
  const m = manifest.find(x => x.file === f) || {};
  sizes[base] = { w: widths[widths.length - 1], h: Math.round(H * widths[widths.length - 1] / W), widths, focus: m.focus || 'center' };
  for (const w of widths) {
    const avif = path.join(OUT, `${base}-${w}.avif`);
    const webp = path.join(OUT, `${base}-${w}.webp`);
    const pipe = () => sharp(src).rotate().resize({ width: w, withoutEnlargement: true });
    if (force || !fs.existsSync(avif)) await pipe().avif({ quality: w > 1600 ? 46 : 52, effort: 4 }).toFile(avif);
    if (force || !fs.existsSync(webp)) await pipe().webp({ quality: w > 1600 ? 66 : 72 }).toFile(webp);
  }
  const ogW = widths.includes(1200) ? 1200 : widths.find(x => x >= 1080) || widths[widths.length - 1];
  const jpg = path.join(OUT, `${base}-${ogW}.jpg`);
  if (force || !fs.existsSync(jpg)) await sharp(src).rotate().resize({ width: ogW }).jpeg({ quality: 78, mozjpeg: true }).toFile(jpg);
  done++;
  process.stdout.write(`\r${done}/${files.length} ${base}            `);
}
// drop entries whose raw file is gone
for (const k of Object.keys(sizes)) if (!files.some(f => f.replace(/\.[a-z]+$/i, '') === k)) delete sizes[k];
fs.writeFileSync(SIZES, JSON.stringify(sizes, null, 1));
console.log(`\nImages ready: ${files.length}`);

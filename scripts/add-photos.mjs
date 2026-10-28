// Usage: npm run photos -- <slug> <folder-with-originals> [--private]
import fs from 'node:fs'; import path from 'node:path'; import sharp from 'sharp'; import exifr from 'exifr';
const [slug, dir, flag] = process.argv.slice(2);
if (!slug || !dir) { console.log('Usage: npm run photos -- <slug> <folder> [--private]'); process.exit(1); }
const out = `public/photos/${slug}`; fs.mkdirSync(out, { recursive: true });
const locFile = flag === '--private' ? 'data/private-locations.json' : 'src/data/locations.json';
const locs = fs.existsSync(locFile) ? JSON.parse(fs.readFileSync(locFile, 'utf8')) : {};
const sourcesPath = path.join(out, 'sources.json');
const sources = fs.existsSync(sourcesPath) ? JSON.parse(fs.readFileSync(sourcesPath, 'utf8')) : {};
let n = fs.readdirSync(out).filter(f => /^\d+\.webp$/i.test(f)).length;
for (const f of fs.readdirSync(dir).filter(f => /\.(jpe?g|png|webp)$/i.test(f)).sort()) {
  const src = path.join(dir, f);
  const gps = await exifr.gps(src).catch(() => null);
  const meta = await exifr.parse(src, ['DateTimeOriginal']).catch(() => null);
  const name = String(++n).padStart(2, '0') + '.webp';
  // sharp drops all metadata by default: committed photos carry no EXIF.
  await sharp(src).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(out, name));
  sources[name] = f;
  if (gps?.latitude) (locs[slug] ??= []).push({ lat: +gps.latitude.toFixed(5), lng: +gps.longitude.toFixed(5), date: meta?.DateTimeOriginal?.toISOString().slice(0, 10) });
  console.log(name, '←', f, gps?.latitude ? 'GPS ✓' : 'no GPS');
}
fs.writeFileSync(sourcesPath, JSON.stringify(sources, null, 2) + '\n');
fs.mkdirSync(path.dirname(locFile), { recursive: true }); fs.writeFileSync(locFile, JSON.stringify(locs, null, 2));
console.log(`Saved coordinates to ${locFile}`);
console.log(`Saved source map to ${sourcesPath}`);

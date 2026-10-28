import fs from 'node:fs';
import path from 'node:path';
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const EDIBILITY = {
  edible: { label: 'Їстівний', icon: '✔', color: '#2e7d32' },
  conditional: { label: 'Умовно їстівний', icon: '⚠', color: '#9a5b00' },
  inedible: { label: 'Неїстівний', icon: '✖', color: '#5f6368' },
  poisonous: { label: 'Отруйний / смертельно небезпечний', icon: '☠', color: '#b3261e' },
} as const;
const read = (p: string) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {});
function photoFiles(slug: string): string[] {
  const dir = path.join(process.cwd(), 'public/photos', slug);
  return fs.existsSync(dir)
    ? fs.readdirSync(dir).filter(f => /\.(webp|jpe?g|png)$/i.test(f) && f !== 'sources.json').sort()
    : [];
}
/** Resolve which site photo file is the cover (basename like 02.webp), or null. */
export function coverFile(slug: string, cover?: string): string | null {
  if (!cover) return null;
  const files = photoFiles(slug);
  if (files.includes(cover)) return cover;
  const sources = read(path.join(process.cwd(), 'public/photos', slug, 'sources.json')) as Record<string, string>;
  const match = Object.entries(sources).find(([, original]) => original === cover || path.basename(original) === path.basename(cover));
  return match?.[0] && files.includes(match[0]) ? match[0] : null;
}
/** All gallery photos; if `cover` is set, that image is listed first. */
export function photos(slug: string, cover?: string): string[] {
  const files = photoFiles(slug);
  const preferred = coverFile(slug, cover);
  const ordered = preferred ? [preferred, ...files.filter(f => f !== preferred)] : files;
  return ordered.map(f => `${base}/photos/${slug}/${f}`);
}
// Public coordinates always; private ones only on your laptop (never in CI builds).
export function locations(slug: string): { lat: number; lng: number; date?: string }[] {
  const priv = process.env.CI ? {} : read('data/private-locations.json');
  return [...(read('src/data/locations.json')[slug] ?? []), ...(priv[slug] ?? [])];
}

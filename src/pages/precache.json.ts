import { getCollection } from 'astro:content';
import { base, photos } from '../lib';
export async function GET() {
  const ms = await getCollection('mushrooms');
  return new Response(JSON.stringify([`${base}/`, `${base}/map/`, `${base}/manifest.webmanifest`,
    ...ms.flatMap(m => [`${base}/mushrooms/${m.id}/`, ...photos(m.id)])]));
}

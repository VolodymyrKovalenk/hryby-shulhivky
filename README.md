# Гриби Шульгівки (hryby-shulhivky)

Static Astro site: mushrooms of the local forest. Ukrainian UI, offline-capable, read-only for visitors.

## Run

`npm install && npm run dev` — open the printed URL (it ends with `/hryby-shulhivky/`).

## Add a mushroom

1. Create `src/content/mushrooms/<latin-name>.md` (copy a sample; the file name becomes the page address).
2. Download originals from Google Photos into a folder, then:
   `npm run photos -- <latin-name> ~/Downloads/folder` (add `--private` to keep coordinates out of git).
   The script resizes to 1600 px, strips all metadata, and stores lat/lng/date only for photos that have GPS.
3. `git add . && git commit && git push` — GitHub Actions publishes.

## Locations

- Public: `src/data/locations.json`. Private (git-ignored): `data/private-locations.json` — **back it up**.
- `npm run loc -- hide <slug>` / `publish <slug>` moves coordinates between the two files.
- Warning: coordinates committed once stay in git history even after `hide`.
- The private file is used only locally; GitHub builds never see it.

## Publish

Create a public GitHub repo named `hryby-shulhivky`, set your username in `astro.config.mjs`, push to `main`, then Settings → Pages → Source: GitHub Actions.

## Notes

- Safety banner shows on every page. Offline: pages and photos are cached after the first visit; the map falls back to a coordinate list.
- No app icons yet (add PNGs to `public/` and list them in `manifest.webmanifest` for "install to home screen").

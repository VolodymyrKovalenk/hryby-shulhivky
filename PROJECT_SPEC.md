# Гриби Шульгівки (Hryby Shulhivky) — Project Specification

A read-only, mobile-friendly, offline-capable website that catalogues the mushrooms found in the owner's local forest, with descriptions, photos and (where available) the places they were found.

This file is both **documentation** (what was decided and why) and a **prompt-ready spec** (paste it into Claude / Claude Code to recreate or extend the project). Section 12 contains a ready-to-use recreation prompt.

---

## 1. Summary

| Item | Decision |
|---|---|
| Type | Static website (no backend, no database, no login) |
| Name | «Гриби Шульгівки» (English: "Hryby Shulhivky") |
| Content language | Ukrainian (UI and content) |
| Framework | Astro (pinned `^5.0.0` in the starter; verify the current version before building) |
| Hosting | GitHub Pages, free `github.io` address, public repo |
| Address / base path | `/hryby-shulhivky` (repo name = `hryby-shulhivky`) |
| Audience | Public but unadvertised: anyone with the link, no login |
| Editing | Only the owner, from a home laptop, through code/files in git (Claude Code optional) |
| Size | ~10 mushrooms at launch, up to ~50 later |
| Photos | The owner's own phone photos only (no internet photos) |

## 2. Original requirements (owner's words, condensed)

1. A resource available on different mobile devices.
2. It lists the mushrooms that can be found in the owner's local forest.
3. Besides a description, each mushroom has photos.
4. Visitors cannot change anything; only the owner can. There is no urgency in updating, so it can be done from the home laptop via code changes or anything else.
5. Can be a wiki-like website or something else, if there is an easy ready-made option.

## 3. Decision log

Decisions were made in a structured interview. Where the owner chose differently from the recommendation, that is noted.

### Audience, access, scope

- **Public, unadvertised, no login.** Simplest, and fits "visitors cannot change anything".
- **Works offline** (no mobile signal in the forest is the main real-world use case).
- **Ukrainian only.** A second language can be added later.
- **Launch with ~10 mushrooms, grow to ~50.**

### Content model (per mushroom)

Common name, Latin name, edibility status, how to recognise it, season, habitat, look-alikes, **source line** (the guide the information was verified against), and 2–5 photos.

### Safety

- A clear banner: the site is **not** an identification guide for eating; never eat a mushroom based on this site alone.
- Four edibility categories, each shown with **colour + icon + text label** (never colour only):
  - `edible` — Їстівний — ✔ green
  - `conditional` — Умовно їстівний — ⚠ amber
  - `inedible` — Неїстівний — ✖ grey
  - `poisonous` — Отруйний / смертельно небезпечний — ☠ red
- "Edible" entries also display a note about toxic look-alikes.
- Every entry carries a "source" line naming the guide used to verify it.

### Browsing

- Photo grid, edibility filter, and a text search box (Ukrainian text).
- **Excluded:** season filters, look-alike view (revisit when there are 20+ entries).
- Home page order: safety banner at the very top, then search/filter and the grid; the map is in the menu.

### Offline

- Cache **everything** (pages + resized photos) on the first visit, and show a small "✓ Доступно офлайн" indicator once caching completes.
- The map needs the internet (map tiles). Offline, it degrades to a text list: "Found at `<lat>`, `<lng>`" with a link to open a maps app.

### Photos and location

- Photos come from the owner's **Android** phone, are uploaded to **Google Photos**, and are downloaded from there (original quality, which keeps GPS) before being added to the site.
- A laptop script reads GPS and date from each photo, resizes it (max 1600 px, WebP), **strips all metadata** and writes only the resized copy into the repo.
- Only latitude, longitude and date are kept in the data files.
- **GPS is used as much as possible so friends can see where each mushroom was found.** The owner explicitly chose to show exact public locations (the owner was warned that this can expose picking spots; the mitigation is the hide switch below).
- **Photos without GPS are accepted** and used normally in the UI (many forest photos have no GPS because of poor GPS reception under trees). *This replaced an earlier rule that photos without GPS would not be used.*
- The map is shown **only for mushrooms that have at least one coordinate**. There is a per-entry map (exact points for that species) and an overview map page (all finds).
- **Hide-location support:** a git-ignored private file holds coordinates the owner does not want public. Coordinates can be moved between the public file (in git) and the private file (ignored) in both directions with a command.
- **Default for new coordinates: public** (the owner's choice; the recommendation had been private-by-default with an explicit publish step). The photo script accepts `--private` to send a batch to the private file instead.
- Caveat to remember: coordinates committed once remain in git history even if later moved to the private file.

### Stack and hosting

- **Astro** with a content collection (one Markdown file per mushroom, validated by a schema).
- **GitHub Pages**, free address, deployed by GitHub Actions on push to `main`. The repo must be **public** for free GitHub Pages, so everything committed is publicly readable.
- Own domain: not needed now; can be added later.
- URL scheme: site root `/hryby-shulhivky/`; each mushroom at `/hryby-shulhivky/mushrooms/<latin-name-slug>/` (e.g. `boletus-edulis`); map at `/hryby-shulhivky/map/`.

### Changes made while building the starter (relative to the interview)

- Image resizing is done by the **laptop script**, not by Astro's image pipeline (Astro's pipeline drops GPS data and hashes file names, which complicates offline caching). Photos live in `public/photos/<slug>/NN.webp`.
- The safety banner is shown on **every page**, not only the home page (people can land directly on an entry).

## 4. Architecture

```text
Phone (Android) → Google Photos → download originals → laptop
Laptop: npm run photos  → resized WebP in public/photos/<slug>/
                        → lat/lng/date into locations file (public or private)
Laptop: edit Markdown   → git push → GitHub Actions → GitHub Pages (static files)
Visitor phone: opens site → service worker caches pages + photos → works offline
```

No server, no database, no admin UI. The repository is the "CMS".

## 5. Project structure

```text
hryby-shulhivky/
  astro.config.mjs            site: https://<USER>.github.io, base: /hryby-shulhivky, trailingSlash: always
  package.json                deps: astro, leaflet; dev: sharp, exifr, @types/leaflet
  .gitignore                  node_modules, dist, .astro, data/, inbox/
  .github/workflows/deploy.yml
  public/
    sw.js                     service worker (network-first, cache fallback)
    manifest.webmanifest      PWA manifest (no icons yet)
    photos/<slug>/NN.webp     generated by the photo script
  src/
    content.config.ts         mushrooms collection + Zod schema
    content/mushrooms/<latin-name>.md
    data/locations.json       PUBLIC coordinates  { "<slug>": [ {lat, lng, date?} ] }
    lib.ts                    base path, EDIBILITY table, photos(), locations()
    layouts/Base.astro        banner, header/nav, offline badge, service-worker registration, global CSS
    components/Map.astro      Leaflet map (online) + coordinate list (always)
    pages/index.astro         grid, search, edibility filter
    pages/mushrooms/[slug].astro
    pages/map.astro           overview map
    pages/precache.json.ts    list of URLs to cache for offline use
  scripts/add-photos.mjs      photo ingestion
  scripts/location.mjs        hide / publish coordinates
  data/private-locations.json PRIVATE coordinates (git-ignored; same shape as locations.json)
```

## 6. Data model

**Mushroom entry** — `src/content/mushrooms/<latin-name>.md`; the file name is the page slug (Latin name, lower-case, hyphenated).

```yaml
---
name: Білий гриб                       # Ukrainian common name
latin: Boletus edulis
edibility: edible                      # edible | conditional | inedible | poisonous
season: Літо — осінь
habitat: Листяні та хвойні ліси ...
lookalikes: Жовчний гриб (Tylopilus felleus) — гіркий, неїстівний ...
source: <field guide the entry was verified against>
---
Markdown body = "Як розпізнати" (how to recognise it).
```

**Locations** — `{ "<slug>": [ { "lat": 49.12345, "lng": 34.12345, "date": "2026-09-14" } ] }`. The public file is `src/data/locations.json`; the private file is `data/private-locations.json`. At build time the site merges both locally; in CI (`process.env.CI` set) only the public file is used.

**Photos** — discovered at build time by listing `public/photos/<slug>/`. No photo list is stored in the entry.

## 7. Features and behaviour

- **Home:** banner, search (matches Ukrainian name + Latin name), edibility dropdown, photo grid. A placeholder 🍄 is shown when an entry has no photo.
- **Entry page:** name + Latin name, edibility tag, look-alike warning for edible entries, photo gallery, "how to recognise", facts list (season, habitat, look-alikes, source), map + coordinate list if coordinates exist.
- **Map page:** one map with a pin per coordinate, each linking to its entry; empty-state message if no coordinates.
- **Map implementation:** Leaflet with OpenStreetMap tiles, circle markers (avoids bundler icon problems). Map is hidden when `navigator.onLine` is false; the coordinate list (with OpenStreetMap links) remains.
- **Offline:** service worker is network-first with cache fallback, so new deploys appear immediately online. After registration the page fetches `precache.json` plus its own loaded assets and caches them, then shows the offline badge. Limitation: the map script is cached only after the map has been opened online once.

## 8. Workflow for the owner

1. Add `src/content/mushrooms/<latin-name>.md`.
2. Download originals from Google Photos into a folder, then run `npm run photos -- <latin-name> <folder> [--private]`.
3. Preview with `npm run dev` (URL ends with `/hryby-shulhivky/`).
4. `git add . && git commit && git push` → GitHub Actions publishes.
5. To hide/publish coordinates: `npm run loc -- hide <slug>` / `npm run loc -- publish <slug>`.

Setup once: create a **public** repo `hryby-shulhivky`, set the GitHub username in `astro.config.mjs`, push to `main`, then GitHub → Settings → Pages → Source: *GitHub Actions*.

## 9. Constraints and warnings

- **Public repo ⇒ everything committed is public**, including coordinates and photos.
- **Git history is permanent:** moving coordinates to the private file does not remove copies already committed. Decide before the first commit (use `--private`), or rewrite history.
- **Back up `data/private-locations.json`** — it exists only on the laptop.
- **GPS accuracy under tree cover can be tens of metres;** pins are approximate.
- **Messengers (Telegram, WhatsApp, Viber) usually strip GPS;** use Google Photos "download original" or a USB cable. Android camera location tagging must be on.
- **OpenStreetMap tile policy** prohibits bulk caching/prefetching of tiles; this is why the map is online-only.
- **Safety/liability:** the site is explicitly not an edibility guide; keep the banner and source lines.

## 10. Status and open items

- The starter project was generated but **not yet run or tested**; expect small fixes on first `npm install`.
- Two sample entries (Boletus edulis, Amanita muscaria) are placeholders marked "ПРИКЛАД" with a placeholder source line to replace; they have no photos.
- No app icons yet (needed for a fully installable PWA).
- Visual design is a first guess (single serif family, moss green on lichen grey, edge-to-edge square photos) and is open to iteration after seeing it on a phone.
- Later options, deliberately postponed: season filter, look-alike pairs view, second language, custom domain, offline map tiles from a provider that permits it.

## 11. Technology notes

- Node.js with npm. Photo script: `sharp` (resize, WebP, auto-rotate; metadata is dropped by default) and `exifr` (GPS + `DateTimeOriginal`).
- Content collection uses Astro's glob loader (`src/content.config.ts`) and `render()` for Markdown bodies.
- `import.meta.env.BASE_URL` is normalised by stripping a trailing slash; all links are built as `${base}/…/`.

## 12. Recreation prompt (paste into Claude / Claude Code)

> Build a static Astro website called «Гриби Шульгівки» (Hryby Shulhivky): a read-only, mobile-first, offline-capable catalogue of mushrooms from my local forest, in Ukrainian. Deploy it on GitHub Pages at base path `/hryby-shulhivky` (public repo `hryby-shulhivky`, GitHub Actions workflow, `trailingSlash: 'always'`).
>
> Content: an Astro content collection `mushrooms`, one Markdown file per mushroom named by Latin-name slug, with a validated frontmatter schema: `name`, `latin`, `edibility` (`edible | conditional | inedible | poisonous`), `season`, `habitat`, `lookalikes`, `source`; the Markdown body is "how to recognise it". Photos live in `public/photos/<slug>/NN.webp` and are discovered at build time.
>
> UI: a safety banner on every page ("not an identification guide for eating; never eat a mushroom based on this site alone"); home page = photo grid + search box (name and Latin name) + edibility filter; map page in the menu. Edibility is always colour + icon + text (✔ green edible, ⚠ amber conditionally edible, ✖ grey inedible, ☠ red poisonous/deadly); edible entries show a toxic look-alike warning. Entry pages show gallery, how to recognise, season, habitat, look-alikes, source, and a map only if the entry has at least one coordinate.
>
> Offline: service worker (network-first, cache fallback) and a `precache.json` endpoint; cache all pages and photos on first visit and show a "✓ Доступно офлайн" badge. Map uses Leaflet + OpenStreetMap tiles online only; offline, show a text list of coordinates with links to a maps app.
>
> Locations: public coordinates in `src/data/locations.json` and private, git-ignored coordinates in `data/private-locations.json`, both shaped `{slug: [{lat, lng, date?}]}`; merge both locally, only the public file in CI. Scripts: (1) `npm run photos -- <slug> <folder> [--private]` — read GPS/date with exifr, resize to max 1600 px WebP with sharp (strip all metadata), accept photos with or without GPS, store lat/lng/date only for photos that have GPS, public file by default; (2) `npm run loc -- hide|publish <slug>` — move coordinates between the two files, warn that already-committed coordinates remain in git history.
>
> Include a README with the owner workflow (Google Photos originals → script → git push) and the warnings above. Use two placeholder sample entries clearly marked as examples. Visual style: one serif family, moss green on pale lichen grey, square edge-to-edge photos without shadows, no decorative motion.

---

*Generated from the design interview for the "Mashroom world" project.*
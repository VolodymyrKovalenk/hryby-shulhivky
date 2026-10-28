---
name: add-mushroom
description: >-
  Sync mushrooms from photo-src into the Hryby Shulhivky site: scan folders,
  skip incomplete or unchanged entries, add missing ones with description +
  photos. Use when the user asks to add/import/update a mushroom, run
  /add-mushroom, process photo-src, or sync the mushroom catalogue.
---

# Add or update mushrooms from `photo-src`

Read `PROJECT_SPEC.md` first for conventions (file format, photo and location pipeline, privacy rules). Follow them.

## Modes

| Mode | When | What to do |
| --- | --- | --- |
| **Batch sync** (default) | User runs `/add-mushroom` with no folder, or asks to process / sync all of `photo-src` | Walk **every** folder under `photo-src/`; apply the decision rules below to each |
| **Single folder** | User names one folder or mushroom | Apply the same rules to that folder only |

`PRIVATE_LOCATIONS` defaults to **`no`**. Pass `--private` only when the user explicitly says yes / private.

## Per-folder checklist

For each `photo-src/<name>/`:

### 1. Unarchive first (always)

Before judging completeness or importing photos:

1. If the folder contains any `*.zip`, extract **image** files (`.jpg` / `.jpeg` / `.png` / `.webp`) into the **folder root** (flatten nested paths; skip `__MACOSX` / dotfiles; avoid overwriting — use a numeric suffix if a name already exists).
2. **Delete the zip** after a successful extract that produced at least one image. If a zip has no images, leave it and report it.
3. If images still live only in a `Photos-*` (or similar) subfolder, move them to the folder root and remove the empty subfolder.
4. Do not leave a `.extract/` directory; photos stay as normal files in `photo-src/<name>/`.

**Additional photos:** if the folder **already had** loose photos and a **new archive** appears, treat the unzipped files as **extra** photos for that mushroom. After unarchiving, import **those newly extracted files** into the site (the photo script appends). Do not skip just because `public/photos/<slug>/` already exists.

### 2. Completeness

A folder is **complete** only if it has **both**:

- A description Markdown: prefer `descr.md`, then `description.md`, then `desc.md`, else the only `*.md`. If several `*.md` and none matches the preferred names → treat as incomplete and ask.
- At least one loose image in the folder root (after step 1).

If description **or** photos are missing → **do not add or update**. Note the folder and what is missing in the final report. Continue with other folders.

Never use chat-attached images (GPS is lost).

### 3. Resolve identity

1. Parse the description into frontmatter + body. If `---` fences are missing, treat leading `key: value` lines as YAML until a blank / non-field line; the rest is the body. Site entries always use proper `---` frontmatter.
2. Drop placeholder `source` (see below).
3. Slug = `latin` lowercased, spaces → hyphens.
4. Match the site: `src/content/mushrooms/<slug>.md`, and search existing `latin` fields. If a possible match is not exact → **stop and ask** before changing that folder.

### 4. Decision

| Site state | Action |
| --- | --- |
| **Not on site** + complete | **Add**: write entry + import all loose photos in the folder |
| **On site** + description same + no new photos this run | **Skip** |
| **On site** + description differs in a real way | **Update** the entry from `photo-src` |
| **On site** + new photos this run (unzipped archive, or new loose files while site already has photos) | **Import the new photos** (append). Default when a zip was added to a folder that already had photos |
| **On site** + description same, but **no** site photos and `photo-src` has photos | **Import photos only** |
| Incomplete | **Skip** and report |

“Same” description means required frontmatter fields (`name`, `latin`, `edibility`, `season`, `habitat`, `lookalikes`), optional `cover`, and body match. Ignore trivial noise (trailing whitespace). If the only difference is a clear typo in `photo-src` that would worsen the site text, **skip** and mention it in the report instead of “fixing” facts.

To avoid re-importing the same originals twice: when appending, pass the photo script a directory that contains **only the newly added files** (e.g. copy/move just-extracted files into a short-lived staging folder, run the script, then put them back into the folder root if needed — or extract into the root and pass only those new paths via a temp folder of copies). Never delete the user’s kept originals in `photo-src/` after import.

### 5. Source field (no placeholder)

Do **not** write or keep:

`ПЕРЕВІРИТИ ВРУЧНУ — вкажіть польовий визначник`

Also skip any source that starts with `ПРИКЛАД`.

- Omit `source` unless it names a real field guide the user provided.
- Never invent a source.
- On update: if the site already has a **real** source and incoming is missing/placeholder, **keep** the site source; if the site source is a placeholder, remove it.

### 6. Write the entry (add / update)

- Frontmatter must match `src/content.config.ts`: required `name`, `latin`, `edibility`, `season`, `habitat`, `lookalikes`; optional `source`, optional `cover`. `edibility` ∈ `edible` | `conditional` | `inedible` | `poisonous`.
- `cover` (optional): original photo filename from the folder (e.g. `IMG_20260926_171541.jpg`). That image is shown on the home-page card and listed first in the gallery. Preserve an existing real `cover` on update if the incoming description omits it.
- Fix only formatting (e.g. quoting), never facts; report formatting fixes.
- If `edibility` changes on update, apply `DESCRIPTION` and report old and new values.
- Do not invent or edit facts.

### 7. Photos import

`npm run photos` reads **only top-level** image files in one directory (not recursive).

1. After step 1, photos should already be loose files in `photo-src/<name>/` (or a temp folder of **new** files only when appending).
2. Run: `npm run photos -- <slug> "<PHOTOS_FOLDER>"` (add `--private` only if `PRIVATE_LOCATIONS` is `yes`). The script **appends** and never overwrites existing `public/photos/<slug>/` files.
3. Do not delete or rename existing site photos.
4. Never edit `locations.json` or `private-locations.json` by hand.

## Verify (once at the end of the run)

- Confirm no `*.zip` remain under processed folders (unless a zip had no images).
- Run `npm run build` and fix errors you caused.
- Run `git status`; report unexpected changes.
- Do **not** commit or push unless asked.

## Report (brief)

Group by outcome:

- **Unarchived** — folders where zips were extracted and deleted (photo counts).
- **Added** — path, photo count, how many had GPS, locations file (public/private).
- **Updated** — description and/or **additional photos** appended.
- **Skipped (unchanged)** — already on site and the same.
- **Skipped (incomplete)** — folder name + missing description and/or photos.
- Build warnings, if any.
- If any coordinates went to the **public** file, remind that they stay in git history once committed.

## Example invocations

- `/add-mushroom` → batch sync all of `photo-src/`
- «Оброби всі папки в photo-src»
- «Додай гриб з photo-src/Польський гриб» → single-folder mode
- Drop a new `Photos-*.zip` into an existing folder → next sync unarchives, deletes the zip, and appends those photos on the site

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

### 1. Completeness

A folder is **complete** only if it has **both**:

- A description Markdown: prefer `descr.md`, then `description.md`, then `desc.md`, else the only `*.md`. If several `*.md` and none matches the preferred names → treat as incomplete and ask.
- Photos: loose `.jpg` / `.jpeg` / `.png` / `.webp` (folder or subfolder), **or** a `*.zip` that contains such images.

If description **or** photos are missing → **do not add or update**. Note the folder and what is missing in the final report. Continue with other folders.

Never use chat-attached images (GPS is lost).

### 2. Resolve identity

1. Parse the description into frontmatter + body. If `---` fences are missing, treat leading `key: value` lines as YAML until a blank / non-field line; the rest is the body. Site entries always use proper `---` frontmatter.
2. Drop placeholder `source` (see below).
3. Slug = `latin` lowercased, spaces → hyphens.
4. Match the site: `src/content/mushrooms/<slug>.md`, and search existing `latin` fields. If a possible match is not exact → **stop and ask** before changing that folder.

### 3. Decision

| Site state | Action |
| --- | --- |
| **Not on site** + complete | **Add**: write entry + import photos |
| **On site** + description and photos effectively the same | **Skip** (do not rewrite, do not re-run photos) |
| **On site** + description differs in a real way | **Update** the entry from `photo-src` (see write rules). Do **not** re-import photos if `public/photos/<slug>/` already has files, unless the user asked to add new photos |
| **On site** + description same, but **no** site photos and `photo-src` has photos | **Import photos only** |
| Incomplete | **Skip** and report |

“Same” means required frontmatter fields (`name`, `latin`, `edibility`, `season`, `habitat`, `lookalikes`) and body match. Ignore trivial noise (trailing whitespace). If the only difference is a clear typo in `photo-src` that would worsen the site text, **skip** and mention it in the report instead of “fixing” facts.

### 4. Source field (no placeholder)

Do **not** write or keep:

`ПЕРЕВІРИТИ ВРУЧНУ — вкажіть польовий визначник`

Also skip any source that starts with `ПРИКЛАД`.

- Omit `source` unless it names a real field guide the user provided.
- Never invent a source.
- On update: if the site already has a **real** source and incoming is missing/placeholder, **keep** the site source; if the site source is a placeholder, remove it.

### 5. Write the entry (add / update)

- Frontmatter must match `src/content.config.ts`: required `name`, `latin`, `edibility`, `season`, `habitat`, `lookalikes`; optional `source`. `edibility` ∈ `edible` | `conditional` | `inedible` | `poisonous`.
- Fix only formatting (e.g. quoting), never facts; report formatting fixes.
- If `edibility` changes on update, apply `DESCRIPTION` and report old and new values.
- Do not invent or edit facts.

### 6. Photos

`npm run photos` reads **only top-level** image files in one directory (not recursive, not inside zips).

1. Prefer an existing subfolder that already contains images.
2. Else loose images in the folder.
3. Else unzip `*.zip` into `photo-src/<name>/.extract/`, **flattening** so all images sit at the top level of `.extract/` (unique names). Do not commit `.extract/` or unzipped originals; delete `.extract/` after success.
4. Before importing when `public/photos/<slug>/` already exists: count existing files. In batch sync, do **not** re-run the script (it **appends** and would duplicate). Only import when the site has no photos yet, or the user explicitly asked to add more.
5. Run: `npm run photos -- <slug> "<PHOTOS_FOLDER>"` (add `--private` only if `PRIVATE_LOCATIONS` is `yes`).
6. Never edit `locations.json` or `private-locations.json` by hand.

## Verify (once at the end of the run)

- Run `npm run build` and fix errors you caused.
- Run `git status`; report unexpected changes.
- Do **not** commit or push unless asked.

## Report (brief)

Group by outcome:

- **Added** — path, photo count, how many had GPS, locations file (public/private).
- **Updated** — what changed (and any `edibility` / kept `source`).
- **Skipped (unchanged)** — already on site and the same.
- **Skipped (incomplete)** — folder name + missing description and/or photos.
- Build warnings, if any.
- If any coordinates went to the **public** file, remind that they stay in git history once committed.

## Example invocations

- `/add-mushroom` → batch sync all of `photo-src/`
- «Оброби всі папки в photo-src»
- «Додай гриб з photo-src/Польський гриб» → single-folder mode

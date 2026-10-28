# Add a new mushroom

Use the project skill **add-mushroom** (`.cursor/skills/add-mushroom/SKILL.md`).

- `/add-mushroom` with no folder → sync **all** of `photo-src/` (skip incomplete / unchanged; add missing complete ones).
- Name a folder → process that mushroom only.
- Zips in a folder are unarchived into loose photos, then deleted. A new zip in a folder that already has photos means **additional** photos to append on the site.
- `PRIVATE_LOCATIONS` defaults to `no`. Placeholder `source` lines are omitted.

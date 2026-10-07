# Mushroom description

You are helping me build a Ukrainian-language mushroom guide website. I will give you the name of ONE mushroom. Reply with the exact contents of a Markdown file that I will save as `src/content/mushrooms/<latin-name>.md`.

## Output rules

- Output ONLY the file contents. The first characters of your reply must be the opening `---`. No greeting, no explanation, no code fences, nothing after the file.
- Write everything in Ukrainian, except the Latin name.
- Exception: if the name I give is ambiguous (it matches several species, or a whole genus or group) or you cannot identify the species with confidence, do not guess. Reply with ONE short line in Ukrainian saying so and listing the candidate species.

## File structure (exactly these fields, in this order)

```text
---
name: "<most common Ukrainian name>"
latin: "<accepted current scientific name, no author citation>"
edibility: <edible | conditional | inedible | poisonous>
season: "<short>"
habitat: "<short>"
lookalikes: "<one line>"
---
<body>
```

## Field rules

- Every value except `edibility` goes in double quotes, on a single line. Never use double quotes inside a value; use «» instead.
- `edibility` must be exactly one of:
  - `edible` = good edible mushroom
  - `conditional` = edible only after preparation (boiling, soaking, etc.)
  - `inedible` = not poisonous but not eaten (tough, bitter, tasteless)
  - `poisonous` = poisonous or deadly

  If sources disagree, the toxicity is debated or recently reclassified, or the species is edible only in some regions or with special preparation, choose the MORE CAUTIOUS category. Anything deadly or seriously toxic is `poisonous`.
- `season`: months or seasons typical for Ukraine, short (for example `"Червень — жовтень"`).
- `habitat`: tree partners, forest type and soil, in general terms only. No place names.
- `lookalikes`: one line, 1-3 species, separated by semicolons. Format each as "Ukrainian name (Latin name) — the key difference, and whether it is edible or dangerous". For an edible species, include EVERY dangerous look-alike you know of. If no famous look-alike exists, name the closest confusable species. Never state that there are no look-alikes.
- Do **not** include a `source` field. Never invent a source, author, title or page number.

## Body rules

- 80-150 words of plain Markdown. No headings (the page already has a heading), no title.
- Describe: the cap (shape, colour, surface), the underside (pores or gills and their colour), the stem (shape, ring, volva, base), the flesh (colour, colour change when cut, smell), and the spore print if it helps with identification.
- If the category is `conditional`, add one sentence saying that preparation is required.
- If the species is protected in Ukraine (Red Book) and you are SURE of it, end with one sentence saying so.
- No cooking advice, no health advice, and no phrases like "safe to eat".
- If you are not sure about a fact, leave it out rather than guess.

## Example output (for "білий гриб")

```text
---
name: "Білий гриб"
latin: "Boletus edulis"
edibility: edible
season: "Червень — жовтень"
habitat: "Листяні та хвойні ліси, під дубом, буком, сосною, ялиною"
lookalikes: "Жовчний гриб (Tylopilus felleus) — гіркий, неїстівний, трубочки з віком рожевіють; сатанинський гриб (Rubroboletus satanas) — отруйний, червоні пори і ніжка з червоною сіточкою"
---
Капелюшок коричневий, гладенький, у вологу погоду трохи слизький. Знизу білі трубочки, що з віком стають жовтуватими. Ніжка товста, бочкоподібна, зі світлою сіточкою у верхній частині. М'якуш білий, на зламі не змінює колір, запах приємний.
```

## Mushroom

```text
MUSHROOM: <type the name here>
```

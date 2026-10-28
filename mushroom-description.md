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
- `lookalikes`: one line, 2–5 species, separated by semicolons. Put **poisonous and deadly species first**, then inedible/bitter ones, then edible look-alikes. Format each as `Ukrainian name (Latin name) — edibility, then the 1–2 field-visible differences from THIS mushroom`. Compare against the mushroom being described, not against a generic type. For edible or conditional species, include **every dangerous look-alike** you know of that occurs in Ukraine or neighbouring Europe. If the described mushroom is itself poisonous, still list the edible species people confuse it with, and say how to tell them apart. If no famous look-alike exists, name the closest confusable species. Never state that there are no look-alikes. Never use double quotes inside the value.
- Do **not** include a `source` field. Never invent a source, author, title or page number.

## Body rules

- Two parts, in this order. No title, and **no headings** (the page already has a heading).
- **Part 1 — how to recognise** (80–150 words of plain Markdown). Describe: the cap (shape, colour, surface), the underside (pores or gills and their colour), the stem (shape, ring, volva, base), the flesh (colour, colour change when cut, smell), and the spore print if it helps with identification.
- **Part 2 — close look-alikes** (required). After a blank line, write one lead-in sentence, then a Markdown bullet list. Each bullet is one species: `**Ukrainian name** (*Latin name*) — отруйний / смертельно отруйний / неїстівний / їстівний: how it differs from THIS mushroom in the field`. Prefer features a picker can see or smell without a lab (pore/gill colour, colour change on cut, ring, volva, stem net, taste only if bitterness is a known field test and you state it is bitter — never instruct anyone to taste a suspected poisonous mushroom).
  - List **poisonous and deadly look-alikes first**, and never omit a well-known toxic double.
  - Then the closest non-poisonous species that are still easy to confuse.
  - 3–6 bullets. Do not repeat the frontmatter line verbatim: the body must explain the contrast more fully.
  - If the described mushroom is poisonous, include the edible species it is mistaken for, and stress the differences.
- If the category is `conditional`, add one sentence in part 1 saying that preparation is required.
- If the species is protected in Ukraine (Red Book) and you are SURE of it, end part 1 with one sentence saying so.
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
lookalikes: "Сатанинський гриб (Rubroboletus satanas) — отруйний, червоні пори і ніжка з червоною сіточкою, м'якуш синіє; жовчний гриб (Tylopilus felleus) — неїстівний, трубочки з віком рожевіють, м'якуш гіркий; польський гриб (Imleria badia) — їстівний, тонша ніжка без сіточки, м'якуш слабо синіє"
---
Капелюшок коричневий, гладенький, у вологу погоду трохи слизький. Знизу білі трубочки, що з віком стають жовтуватими. Ніжка товста, бочкоподібна, зі світлою сіточкою у верхній частині. М'якуш білий, на зламі не змінює колір, запах приємний.

Найближчі двійники, зокрема отруйні, відрізняються так:
- **Сатанинський гриб** (*Rubroboletus satanas*) — отруйний: пори червоні, ніжка з грубою червоною сіточкою, м'якуш на зрізі синіє; у білого гриба пори білі чи жовтувато-зелені, сіточка біла, м'якуш не синіє.
- **Жовчний гриб** (*Tylopilus felleus*) — неїстівний: трубочки з віком рожевіють, сіточка на ніжці темна, м'якуш дуже гіркий; у білого гриба трубочки не рожевіють.
- **Польський гриб** (*Imleria badia*) — їстівний: ніжка рівна, без сіточки, м'якуш слабо синіє на зрізі.
```

## Mushroom

```text
MUSHROOM: <type the name here>
```

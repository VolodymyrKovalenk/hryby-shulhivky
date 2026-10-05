Add a mushroom to this project, or update it if it already exists. Read PROJECT_SPEC.md first for the project's conventions (file format, photo and location pipeline, privacy rules). Follow them.

INPUTS (at the bottom)
- PHOTOS_FOLDER: path to a folder with the ORIGINAL photo files.
- PRIVATE_LOCATIONS: yes or no. "yes" means pass --private to the photo script.
- DESCRIPTION: the full Markdown file contents (frontmatter + body) written for this mushroom.

STEP 1 - Find out if it exists
- Take the slug from the "latin" field of DESCRIPTION: lowercase, spaces replaced by hyphens.
- Look in src/content/mushrooms/ for <slug>.md. Also search the existing files' "latin" fields in case the same species is filed under a different slug. If you find a possible match that is not exact, stop and ask me before changing anything.

STEP 2 - Write the entry
- New mushroom: create src/content/mushrooms/<slug>.md from DESCRIPTION.
- Existing mushroom: replace the frontmatter values and the body with the ones from DESCRIPTION, with ONE exception: if the existing "source" line has been filled in by me (it does not start with "ПЕРЕВІРИТИ ВРУЧНУ" or "ПРИКЛАД") and DESCRIPTION's source is a placeholder, keep my existing source line.
- If the edibility value in the existing file differs from the new one, do not hide it: change nothing about the value yourself beyond what DESCRIPTION says, and tell me clearly at the end, including both values.
- Keep the frontmatter valid for the schema in src/content.config.ts: all fields required, edibility is one of edible | conditional | inedible | poisonous. If DESCRIPTION breaks the schema, fix only the formatting (for example quoting), never the facts, and tell me what you changed.
- Do not invent or edit any facts, and never invent a source.

STEP 3 - Add the photos
- Run: npm run photos -- <slug> "<PHOTOS_FOLDER>"   (add --private if PRIVATE_LOCATIONS is yes)
- The script appends new numbered files and never overwrites old ones. Do not delete or rename existing photos.
- Before running it, check whether public/photos/<slug>/ already exists. If it does, tell me how many photos it has and confirm that the folder does not contain photos I already added earlier (running the same folder twice creates duplicates).
- Work only from the files in the folder. If I attached images to this chat instead of giving a folder path, stop and tell me: attached images lose their GPS data, so I need to provide the original files in a folder.
- Never edit locations.json or private-locations.json by hand. Only the script and "npm run loc" change them.

STEP 4 - Verify
- Run npm run build and fix any error that you caused.
- Run git status and check that only these changed: the entry file, public/photos/<slug>/, and the locations file the script wrote to. Report anything else.
- Do NOT commit or push unless I ask.

STEP 5 - Report, briefly
- Created or updated, and the file path.
- Photos added, and for how many of them the script found GPS.
- Which locations file received coordinates (public or private).
- Any edibility change, any source line you kept, any warnings from the build.
- If coordinates went to the public file, remind me that they will stay in git history once committed.

PHOTOS_FOLDER: /Users/vovakovalenko/repo/hryby-shulhivky/photo-src/Photos-1-001 (1)
PRIVATE_LOCATIONS: no
DESCRIPTION:
name: "Білий гриб"
latin: "Boletus edulis"
edibility: edible
season: "Червень — листопад"
habitat: "Листяні, хвойні та мішані ліси, у симбіозі з ялиною, сосною, дубом та буком"
lookalikes: "Жовчний гриб (Tylopilus felleus) — гіркий м'якуш, неїстівний, пори з віком рожевіють; сатанинський гриб (Rubroboletus satanas) — отруйний, пори червоні, м'якуш синіє на зрізі"
source: "ПЕРЕВІРИТИ ВРУЧНУ — вкажіть польовий визначник"
Капелюшок опуклий, згодом подушкоподібний, від світло-коричневого до темно-каштанового кольору, з гладенькою або трохи зморшкуватою сухою поверхнею, яка під час дощу стає клейкою. Гіменофор трубчастий, спочатку білий, пізніше жовтувато-зелений, легко відокремлюється від м'якуша. Ніжка масивна, бочкоподібна або клубнеподібна, світло-бежева, у верхній частині вкрита тонкою білою сіточкою. М'якуш щільний, м'ясистий, білий, не змінює кольору на зрізі, має приємний грибний запах та горіховий смак. Споровий порошок брудно-оливковий.
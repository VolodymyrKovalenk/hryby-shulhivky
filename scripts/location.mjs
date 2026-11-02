// Usage: npm run loc -- hide|publish|clear <slug>
import fs from 'node:fs'; import path from 'node:path';
const [cmd, slug] = process.argv.slice(2); const P = 'src/data/locations.json', V = 'data/private-locations.json';
const read = f => fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
const write = (f, o) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(o, null, 2) + '\n'); };
if (cmd === 'clear') {
  if (!slug) { console.log('Usage: npm run loc -- clear <slug>'); process.exit(1); }
  let n = 0;
  for (const f of [P, V]) {
    const o = read(f);
    if (o[slug]) { n += o[slug].length; delete o[slug]; write(f, o); }
  }
  console.log(n ? `Cleared ${n} point(s) for ${slug}` : `Nothing to clear for ${slug}`);
  console.log('WARNING: if these coordinates were already committed, they stay in git history.');
  process.exit(0);
}
const [from, to] = cmd === 'hide' ? [P, V] : cmd === 'publish' ? [V, P] : [];
if (!from || !slug) { console.log('Usage: npm run loc -- hide|publish|clear <slug>'); process.exit(1); }
const a = read(from), b = read(to);
if (!a[slug]?.length) { console.log('Nothing to move for', slug); process.exit(0); }
b[slug] = [...(b[slug] ?? []), ...a[slug]]; delete a[slug];
for (const [f, o] of [[from, a], [to, b]]) write(f, o);
console.log(`Moved ${slug}: ${from} -> ${to}`);
if (cmd === 'hide') console.log('WARNING: if these coordinates were already committed, they stay in git history.');

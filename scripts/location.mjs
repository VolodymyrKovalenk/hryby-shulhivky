// Usage: npm run loc -- hide|publish <slug>
import fs from 'node:fs'; import path from 'node:path';
const [cmd, slug] = process.argv.slice(2); const P = 'src/data/locations.json', V = 'data/private-locations.json';
const [from, to] = cmd === 'hide' ? [P, V] : cmd === 'publish' ? [V, P] : [];
if (!from || !slug) { console.log('Usage: npm run loc -- hide|publish <slug>'); process.exit(1); }
const read = f => fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
const a = read(from), b = read(to);
if (!a[slug]?.length) { console.log('Nothing to move for', slug); process.exit(0); }
b[slug] = [...(b[slug] ?? []), ...a[slug]]; delete a[slug];
for (const [f, o] of [[from, a], [to, b]]) { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(o, null, 2)); }
console.log(`Moved ${slug}: ${from} -> ${to}`);
if (cmd === 'hide') console.log('WARNING: if these coordinates were already committed, they stay in git history.');

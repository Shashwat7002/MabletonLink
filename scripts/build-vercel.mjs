import {cpSync, mkdirSync, readFileSync, readdirSync, rmSync} from 'node:fs';
import assert from 'node:assert/strict';

const output = 'vercel-public';
rmSync(output, {recursive: true, force: true});
mkdirSync(output);
for (const name of readdirSync('public')) {
  if (name === '_headers') continue; // Equivalent headers are declared in vercel.json.
  cpSync(`public/${name}`, `${output}/${name}`, {recursive: true});
}
for (const name of ['index.html', 'app.js', 'styles.css', 'services.json', 'services.es.json', 'guidance.json', 'i18n.mjs', 'routing.mjs', 'saved-items.mjs']) {
  const content = readFileSync(`${output}/${name}`, 'utf8');
  assert.ok(content.length > 100, name);
  assert.ok(!/AIza[0-9A-Za-z_-]{35}|\bAQ\.[0-9A-Za-z_-]{30,}|GEMINI_API_KEY/.test(content), `credential boundary: ${name}`);
}
console.log('Vercel static output verified; the assistant is served by api/assistant.mjs.');

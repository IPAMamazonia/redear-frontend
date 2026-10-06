/**
 * Verifica a paridade das árvores de chaves entre os dicionários de idioma.
 *
 * O dicionário pt é a fonte canônica (`src/i18n/locales/pt.js`); todos os
 * demais idiomas (`src/i18n/locales/en.js`) devem espelhar exatamente a mesma
 * árvore de chaves. Strings podem divergir; chaves, não.
 *
 * Uso: `node scripts/check-i18n.js`
 * Exit code 0 = ok, 1 = diferenças encontradas.
 */
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const localesDir = join(root, 'src/i18n/locales');

/** Lista das chaves (caminhos pontilhados) de um nó de dicionário. */
function collectKeys(node, prefix = '', out = []) {
  if (node === null || typeof node !== 'object') {
    out.push(prefix);
    return out;
  }
  if (Array.isArray(node)) {
    node.forEach((item, i) => collectKeys(item, `${prefix}.${i}`, out));
    return out;
  }
  for (const key of Object.keys(node)) {
    collectKeys(node[key], prefix ? `${prefix}.${key}` : key, out);
  }
  return out;
}

const files = readdirSync(localesDir).filter((f) => f.endsWith('.js'));

const ptFile = files.find((f) => f.startsWith('pt'));

if (!ptFile) {
  throw new Error('[check-i18n] Dicionário pt não encontrado.');
}

const pt = (await import(join(localesDir, ptFile))).default;

const refKeys = collectKeys(pt).sort();

let failed = false;

for (const file of files) {
  if (file === ptFile) continue;

  const dict = (await import(join(localesDir, file))).default;
  const keys = collectKeys(dict).sort();

  const missing = refKeys.filter((k) => !keys.includes(k));
  const extra = keys.filter((k) => !refKeys.includes(k));

  if (missing.length || extra.length) {
    failed = true;
    console.error(`[check-i18n] ${file}:${missing.length ? ` faltam ${missing.length}` : ''}${extra.length ? ` sobram ${extra.length}` : ''}`);
    for (const k of missing) console.error(`  - falta: ${k}`);
    for (const k of extra) console.error(`  + extra: ${k}`);
  }
}

if (failed) {
  throw new Error('[check-i18n] Árvores de chaves divergentes. Ajuste o dicionário para espelhar pt.');
}

console.log(`[check-i18n] OK: ${files.length} dicionários com a mesma árvore de chaves (${refKeys.length} chaves).`);
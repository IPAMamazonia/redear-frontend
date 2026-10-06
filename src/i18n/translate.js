import pt from './locales/pt';
import en from './locales/en';

/**
 * Núcleo do i18n — sem dependência de React/Redux.
 *
 * Este módulo é propositalmente "cego" em relação ao store: ele só mantém o
 * idioma atual numa variável de módulo, persiste em `localStorage` e sincroniza
 * `<html lang>`. Isso evita ciclos de importação (store ↔ i18n) e permite que
 * thunks, utilitários do Chart.js e demais código fora de componentes chamem
 * `t()` diretamente.
 *
 * Componentes React NÃO devem importar `t` daqui — use o hook `useTranslation()`
 * de `@/i18n`, que se assina no Redux e garante re-render na troca de idioma.
 */

const dictionaries = { pt, en };

export const LANGUAGES = ['pt', 'en'];

const STORAGE_KEY = 'redear.lang';

/** Idioma salvo → detecção do navegador → pt (padrão). */
function detectLanguage() {
  try {
    const saved = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (LANGUAGES.includes(saved)) return saved;
  } catch {
    /* localStorage indisponível (ex.: privacidade) — segue para a detecção */
  }

  const nav = typeof navigator !== 'undefined' ? navigator.language : '';
  return /^en\b/i.test(nav) ? 'en' : 'pt';
}

let current = detectLanguage();

export function getLanguage() {
  return current;
}

/** Sincroniza idioma corrente, `localStorage` e `<html lang>`. */
export function syncLanguage(lang) {
  if (!LANGUAGES.includes(lang)) return;
  current = lang;

  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignora falha de persistência */
  }

  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
  }
}

if (typeof document !== 'undefined') {
  document.documentElement.lang = current === 'en' ? 'en' : 'pt-BR';
}

function lookup(dict, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), dict);
}

function interpolate(str, params) {
  if (!params) return str;
  return str.replace(/\{(\w+)\}/g, (match, name) => (params[name] != null ? String(params[name]) : match));
}

/**
 * Resolve `key` no idioma informado, com cascata para o pt e, por fim,
 * retorno da própria chave (pass-through — permite que strings dinâmicas
 * vindas da API atravessem o `t()` sem serem alteradas).
 *
 * @param {string} lang - 'pt' | 'en'
 * @param {string} key  - chave pontilhada, ex.: 'nav.about'
 * @param {Record<string, unknown>} [params] - valores para `{placeholders}`
 * @returns {string}
 */
export function translate(lang, key, params) {
  if (typeof key !== 'string' || !key) return key;

  let value = lookup(dictionaries[lang], key);
  if (value === undefined) value = lookup(dictionaries.pt, key);

  if (typeof value !== 'string') {
    if (import.meta.env?.DEV) console.warn(`[i18n] chave não encontrada: "${key}"`);
    return key;
  }

  return interpolate(value, params);
}

/** Traduz no idioma corrente. Uso fora de componentes React. */
export function t(key, params) {
  return translate(current, key, params);
}

const LOCALES = { pt: 'pt-BR', en: 'en-US' };

/** Locale BCP-47 do idioma corrente — para `toLocaleString`/`toLocaleDateString`. */
export function getLocale(lang = current) {
  return LOCALES[lang] ?? 'pt-BR';
}

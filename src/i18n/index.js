import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLanguage as setLanguageAction } from '@/store/slices/uiSlice';
import { translate, syncLanguage, getLocale, getLanguage, LANGUAGES } from './translate';

/**
 * Hook do i18n para componentes.
 *
 * Assina `state.ui.language` no Redux: ao trocar o idioma, todos os consumidores
 * re-renderizam e resolvem suas chaves de novo.
 *
 * @returns {{
 *   language: 'pt' | 'en',
 *   t: (key: string, params?: Record<string, unknown>) => string,
 *   setLanguage: (lang: 'pt' | 'en') => void,
 *   getLocale: () => string,
 * }}
 */
export function useTranslation() {
  const language = useSelector((state) => state.ui.language);
  const dispatch = useDispatch();

  const t = useCallback((key, params) => translate(language, key, params), [language]);

  const setLanguage = useCallback(
    (lang) => {
      if (!LANGUAGES.includes(lang)) return;
      syncLanguage(lang);
      dispatch(setLanguageAction(lang));
    },
    [dispatch]
  );

  return { language, t, setLanguage, getLocale: () => getLocale(language) };
}

export { getLocale, getLanguage, LANGUAGES };

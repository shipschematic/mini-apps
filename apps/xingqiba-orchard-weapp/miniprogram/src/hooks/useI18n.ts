import { useCallback } from 'react';
import { useStore } from '../store';
import { t as translateFn, Language, I18N } from '../constants/i18n';

export const useI18n = () => {
  const locale = useStore((state) => state.ui.locale);
  const setUIAction = useStore.getState().setUI;

  const toggleLocale = useCallback(() => {
    const newLocale: Language = locale === 'zh' ? 'en' : 'zh';
    setUIAction({ locale: newLocale });
  }, [locale, setUIAction]);

  const t = useCallback(
    (key: keyof typeof I18N.zh): string => {
      return translateFn(key, locale);
    },
    [locale]
  );

  return {
    locale,
    toggleLocale,
    t,
  };
};

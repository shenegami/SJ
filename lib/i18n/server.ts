import { cookies } from 'next/headers';
import { DEFAULT_LOCALE, type AppLocale, SUPPORTED_LOCALES, isRtl } from './config';
import { getDictionary } from './dictionaries';

export const getRequestLocale = (): AppLocale => {
  const cookieStore = cookies();
  const stored = cookieStore.get('locale')?.value as AppLocale | undefined;
  if (stored && SUPPORTED_LOCALES.includes(stored)) {
    return stored;
  }
  return DEFAULT_LOCALE;
};

export const getTranslations = () => {
  const locale = getRequestLocale();
  return { locale, dictionary: getDictionary(locale), dir: isRtl(locale) ? 'rtl' : 'ltr' };
};

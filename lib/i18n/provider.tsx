'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { DEFAULT_LOCALE, type AppLocale, isRtl } from './config';
import { getDictionary } from './dictionaries';
import { useRouter } from 'next/navigation';
import { setCookie } from 'nookies';

type I18nContextValue = {
  locale: AppLocale;
  dir: 'rtl' | 'ltr';
  t: (key: string) => string;
  setLocale: (locale: AppLocale) => void;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider = ({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale?: AppLocale;
}) => {
  const router = useRouter();
  const [locale, setLocaleState] = useState<AppLocale>(initialLocale ?? DEFAULT_LOCALE);

  const dictionary = useMemo(() => getDictionary(locale), [locale]);
  const dir = isRtl(locale) ? 'rtl' : 'ltr';

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      dir,
      t: (key: string) => dictionary[key] ?? key,
      setLocale: (nextLocale: AppLocale) => {
        setLocaleState(nextLocale);
        setCookie(null, 'locale', nextLocale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
        router.refresh();
      },
    }),
    [dictionary, dir, locale, router],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};

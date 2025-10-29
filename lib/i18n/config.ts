export const SUPPORTED_LOCALES = ['ar', 'en'] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: AppLocale = 'ar';

export const isRtl = (locale: AppLocale) => locale === 'ar';

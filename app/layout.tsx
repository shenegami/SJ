import type { Metadata } from 'next';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { I18nProvider } from '@/lib/i18n/provider';
import { getTranslations } from '@/lib/i18n/server';
import { AppToaster } from '@/components/common/toaster';

export const metadata: Metadata = {
  title: 'AI Company Assistant',
  description: 'Projects, policies, salary intelligence, and AI copilots for your company.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, dir } = getTranslations();

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <I18nProvider initialLocale={locale}>
            {children}
            <AppToaster />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n/provider';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', labelKey: 'nav.dashboard', roles: ['Admin', 'HR', 'Manager', 'Employee'] },
  { href: '/projects', labelKey: 'nav.projects', roles: ['Admin', 'HR', 'Manager', 'Employee'] },
  { href: '/tasks', labelKey: 'nav.tasks', roles: ['Admin', 'HR', 'Manager', 'Employee'] },
  { href: '/policies', labelKey: 'nav.policies', roles: ['Admin', 'HR', 'Manager', 'Employee'] },
  { href: '/salary', labelKey: 'nav.salary', roles: ['Admin', 'HR', 'Manager'] },
  { href: '/ai-chat', labelKey: 'nav.aiChat', roles: ['Admin', 'HR', 'Manager', 'Employee'] },
  { href: '/admin', labelKey: 'nav.admin', roles: ['Admin', 'HR'] },
  { href: '/settings', labelKey: 'nav.settings', roles: ['Admin', 'HR', 'Manager', 'Employee'] },
] as const;

export type Role = 'Admin' | 'HR' | 'Manager' | 'Employee';

export const AppShell = ({
  children,
  role,
}: {
  children: React.ReactNode;
  role: Role;
}) => {
  const pathname = usePathname();
  const { t, dir, locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <div className={cn('flex min-h-screen bg-background text-foreground', dir === 'rtl' && "font-['Cairo']")} dir={dir}>
      <aside className="hidden w-64 bg-card border-r border-border md:block">
        <div className="flex h-16 items-center justify-center border-b px-4 text-lg font-semibold">
          AI CoPilot
        </div>
        <NavLinks role={role} isActive={isActive} t={t} />
      </aside>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setOpen(false)} />
      )}
      <div
        className={cn(
          'fixed inset-y-0 z-50 w-64 border-r border-border bg-card p-4 transition-transform md:hidden',
          open ? 'translate-x-0' : dir === 'rtl' ? 'translate-x-full' : '-translate-x-full',
          dir === 'rtl' ? 'right-0' : 'left-0',
        )}
      >
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <span className="text-lg font-semibold">AI CoPilot</span>
          <button onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <NavLinks role={role} isActive={isActive} t={t} onNavigate={() => setOpen(false)} />
      </div>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-4">
          <button className="md:hidden" onClick={() => setOpen((prev) => !prev)}>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <button
              className="rounded border px-3 py-1 text-sm"
              onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
            >
              {t('language.toggle')}
            </button>
          </div>
        </header>
        <main className="flex-1 bg-muted/30 p-6">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

const NavLinks = ({
  role,
  isActive,
  t,
  onNavigate,
}: {
  role: Role;
  isActive: (href: string) => boolean;
  t: (key: string) => string;
  onNavigate?: () => void;
}) => (
  <nav className="flex flex-col gap-1 p-4">
    {NAV_ITEMS.filter((item) => item.roles.includes(role)).map((item) => (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        className={cn(
          'rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
          isActive(item.href) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
        )}
      >
        {t(item.labelKey)}
      </Link>
    ))}
  </nav>
);

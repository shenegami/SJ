import { getSessionUser } from '@/lib/auth/get-session-user';
import { getTranslations } from '@/lib/i18n/server';

export default async function SettingsPage() {
  const user = await getSessionUser();
  const { locale } = getTranslations();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your preferences and default language.</p>
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Locale</h2>
          <p className="text-sm text-muted-foreground">Current: {locale}</p>
        </div>
      </div>
    </div>
  );
}

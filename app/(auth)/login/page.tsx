import { SignInForm } from '@/components/common/sign-in-form';
import { getTranslations } from '@/lib/i18n/server';

export default function LoginPage() {
  const { dir } = getTranslations();
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted" dir={dir}>
      <div className="w-full max-w-md space-y-6 rounded-lg bg-card p-8 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">AI Company Assistant</h1>
          <p className="text-sm text-muted-foreground">Secure access for your organisation.</p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}

import { getDashboardMetrics } from '@/lib/dashboard/get-metrics';
import { getSessionUser } from '@/lib/auth/get-session-user';
import { getTranslations } from '@/lib/i18n/server';

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();
  const user = await getSessionUser();
  const { dictionary } = getTranslations();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">{dictionary['dashboard.welcome']}</h1>
        <p className="text-muted-foreground">{dictionary['dashboard.subtitle']}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Projects" value={metrics.activeProjects} />
        <StatCard label="Overdue Tasks" value={metrics.overdueTasks} />
        <StatCard label="My Role" value={user?.role ?? 'Employee'} />
        <StatCard label="Recent Policies" value={metrics.recentPolicyUpdates.length} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold">Tasks by Status</h2>
          <div className="mt-4 space-y-2">
            {Object.entries(metrics.tasksByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="capitalize">{status.replace('_', ' ')}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold">Recent Policy Updates</h2>
          <div className="mt-4 space-y-3">
            {metrics.recentPolicyUpdates.map((policy) => (
              <div key={policy.id} className="rounded border bg-muted/50 p-3">
                <div className="font-medium">{policy.title}</div>
                <div className="text-xs text-muted-foreground">Version {policy.version}</div>
              </div>
            ))}
            {metrics.recentPolicyUpdates.length === 0 && (
              <p className="text-sm text-muted-foreground">No recent updates.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-lg border bg-card p-6 shadow-sm">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="mt-2 text-2xl font-semibold">{value}</p>
  </div>
);

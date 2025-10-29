import { listPolicies } from '@/lib/policies/queries';

export default async function PoliciesPage() {
  const policies = await listPolicies();
  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Policies</h1>
        <p className="text-sm text-muted-foreground">Centralise and version your company policies.</p>
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <ul className="space-y-4">
          {policies.map((policy) => (
            <li key={policy.id} className="rounded border bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{policy.title}</h3>
                  <p className="text-xs text-muted-foreground">{policy.category ?? 'General'}</p>
                </div>
                <span className="text-xs font-semibold uppercase text-primary">Active</span>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                Latest version: {policy.policy_versions?.[0]?.version ?? 'N/A'}
              </div>
            </li>
          ))}
          {policies.length === 0 && (
            <li className="text-sm text-muted-foreground">No policies uploaded yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

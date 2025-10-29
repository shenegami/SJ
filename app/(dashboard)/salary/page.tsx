import { listSalarySources } from '@/lib/salary/queries';

export default async function SalaryPage() {
  const sources = await listSalarySources();
  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Salary Intelligence</h1>
        <p className="text-sm text-muted-foreground">
          Upload, parse, and reason over structured salary scales to guide offers.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Sources</h2>
        <ul className="mt-4 space-y-3">
          {sources.map((source) => (
            <li key={source.id} className="rounded border bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{source.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {source.is_active ? 'Active' : 'Archived'} ·
                    {source.created_at
                      ? ` ${new Date(source.created_at).toLocaleDateString()}`
                      : ' Date TBD'}
                  </div>
                </div>
              </div>
              <pre className="mt-3 max-h-40 overflow-auto rounded bg-background p-3 text-xs">
                {JSON.stringify(source.parsed_schema, null, 2)}
              </pre>
            </li>
          ))}
          {sources.length === 0 && <li className="text-sm text-muted-foreground">No salary scales yet.</li>}
        </ul>
      </div>
    </div>
  );
}

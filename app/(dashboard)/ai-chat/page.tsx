import { AIChatPanel } from '@/components/common/ai-chat-panel';

export default function AIChatPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">AI Company Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Ask contextual questions about policies, projects, or salary ranges.
        </p>
      </div>
      <AIChatPanel />
    </div>
  );
}

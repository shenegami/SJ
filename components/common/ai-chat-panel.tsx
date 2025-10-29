'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const nextMessages = [...messages, { role: 'user' as const, content: input }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });
      if (!response.ok) {
        const error = await response.json();
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: error.error ?? 'Unable to generate a response right now.' },
        ]);
        return;
      }
      const json = await response.json();
      if (json.answer) {
        setMessages((prev) => [...prev, { role: 'assistant', content: json.answer }]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[70vh] flex-col rounded-lg border bg-card">
      <div className="flex-1 space-y-4 overflow-auto p-6">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-md rounded-lg px-4 py-2 text-sm shadow ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center text-sm text-muted-foreground">
            Ask about policies, salary ranges, or project updates.
          </div>
        )}
      </div>
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask your assistant..."
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button onClick={sendMessage} disabled={loading}>
            {loading ? 'Thinking…' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
};

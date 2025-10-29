import OpenAI from 'openai';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  language?: string;
}

export interface ChatCompletionResponse {
  answer: string;
  sources: { title: string; snippet: string }[];
  suggestions?: string[];
}

export abstract class AIProvider {
  abstract chat(payload: ChatCompletionRequest): Promise<ChatCompletionResponse>;
}

class OpenAIProvider extends AIProvider {
  private client: OpenAI;

  constructor() {
    super();
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required for the OpenAI provider');
    }
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async chat(payload: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const response = await this.client.chat.completions.create({
      model: process.env.CHAT_MODEL ?? 'gpt-5',
      messages: payload.messages.map((message) => ({ role: message.role, content: message.content })),
      temperature: 0.2,
    });

    const answer = response.choices[0]?.message?.content ?? '';
    return {
      answer,
      sources: [],
      suggestions: [],
    };
  }
}

export const getAIProvider = () => {
  const provider = process.env.AI_PROVIDER ?? 'openai';
  switch (provider) {
    case 'openai':
    default:
      return new OpenAIProvider();
  }
};

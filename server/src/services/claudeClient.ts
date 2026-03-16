import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  console.warn('Warning: ANTHROPIC_API_KEY is not set. Agent calls will fail.');
}

const client = new Anthropic({
  apiKey: apiKey || 'dummy-key',
});

export interface AgentResponse {
  content: string;
  model: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export async function callAgent(
  systemPrompt: string,
  userMessage: string,
  model: string = 'claude-sonnet-4-20250514'
): Promise<AgentResponse> {
  try {
    const response = await client.messages.create({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const content = response.content
      .map((block) => ('text' in block ? block.text : ''))
      .join('');

    return {
      content,
      model: response.model,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    };
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}

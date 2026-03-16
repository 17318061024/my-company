const API_KEY = process.env.MINIMAX_API_KEY;
const BASE_URL = 'https://api.minimax.chat';

if (!API_KEY) {
  console.warn('Warning: MINIMAX_API_KEY is not set. Agent calls will fail.');
}

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
  model: string = 'abab6.5s-chat'
): Promise<AgentResponse> {
  try {
    const response = await fetch(`${BASE_URL}/v1/text/chatcompletion_v2`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`MiniMax API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    const content = data.choices?.[0]?.message?.content || '';

    return {
      content,
      model: data.model,
      usage: {
        input_tokens: data.usage?.prompt_tokens || 0,
        output_tokens: data.usage?.completion_tokens || 0,
      },
    };
  } catch (error) {
    console.error('MiniMax API error:', error);
    throw error;
  }
}

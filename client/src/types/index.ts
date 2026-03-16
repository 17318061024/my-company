export type AgentRole = 'product_manager' | 'developer' | 'tester' | 'ui';

export interface AgentSkill {
  id: string;
  role: AgentRole;
  name: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface AgentResponse {
  content: string;
  model: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface PipelineResult {
  productManager?: AgentResponse;
  developer?: AgentResponse;
  tester?: AgentResponse;
  ui?: AgentResponse;
}

export interface AgentState {
  skill: string;
  loading: boolean;
  lastOutput?: string;
}

export const AGENT_CONFIG: Record<AgentRole, { name: string; icon: string; color: string }> = {
  product_manager: { name: '产品经理', icon: '📋', color: '#3b82f6' },
  developer: { name: '开发工程师', icon: '💻', color: '#10b981' },
  tester: { name: '测试工程师', icon: '🧪', color: '#f59e0b' },
  ui: { name: 'UI 设计师', icon: '🎨', color: '#8b5cf6' },
};

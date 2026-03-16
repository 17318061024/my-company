import axios from 'axios';
import type { AgentSkill, PipelineResult, AgentRole } from '@/types';

const api = axios.create({
  baseURL: '/api',
});

export async function getAllSkills(): Promise<AgentSkill[]> {
  const { data } = await api.get('/skills');
  return data;
}

export async function updateSkill(role: AgentRole, content: string): Promise<AgentSkill> {
  const { data } = await api.put(`/skills/${role}`, { content });
  return data;
}

export async function runPipeline(userRequest: string): Promise<PipelineResult> {
  const { data } = await api.post('/agents/run', { userRequest });
  return data;
}

export async function runSingleAgent(role: AgentRole, input: string): Promise<any> {
  const { data } = await api.post(`/agents/run/${role}`, { input });
  return data;
}

export async function getSkill(role: AgentRole): Promise<AgentSkill> {
  const { data } = await api.get(`/agents/${role}`);
  return data;
}

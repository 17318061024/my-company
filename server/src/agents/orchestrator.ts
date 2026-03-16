import { callAgent, AgentResponse } from '../services/claudeClient.js';
import { getSkill, AgentRole } from '../db/skillStore.js';

export interface PipelineResult {
  productManager?: AgentResponse;
  developer?: AgentResponse;
  tester?: AgentResponse;
  ui?: AgentResponse;
}

export async function runProductManager(userRequest: string): Promise<AgentResponse> {
  const skill = await getSkill('product_manager');
  const systemPrompt = skill?.content || '你是一个专业的产品经理。';
  return await callAgent(systemPrompt, userRequest);
}

export async function runDeveloper(prdContent: string): Promise<AgentResponse> {
  const skill = await getSkill('developer');
  const systemPrompt = skill?.content || '你是一个资深开发工程师。';
  const userMessage = `根据以下 PRD 文档生成代码：\n\n${prdContent}`;
  return await callAgent(systemPrompt, userMessage);
}

export async function runTester(code: string, prdContent: string): Promise<AgentResponse> {
  const skill = await getSkill('tester');
  const systemPrompt = skill?.content || '你是一个专业的测试工程师。';
  const userMessage = `PRD 需求：\n${prdContent}\n\n代码实现：\n${code}`;
  return await callAgent(systemPrompt, userMessage);
}

export async function runUI(prdContent: string): Promise<AgentResponse> {
  const skill = await getSkill('ui');
  const systemPrompt = skill?.content || '你是一个专业的 UI/UX 设计师。';
  const userMessage = `根据以下 PRD 文档设计界面：\n\n${prdContent}`;
  return await callAgent(systemPrompt, userMessage);
}

export async function runPipeline(userRequest: string): Promise<PipelineResult> {
  // Step 1: Product Manager analyzes requirements
  const productManager = await runProductManager(userRequest);

  // Step 2: Developer generates code based on PRD
  const developer = await runDeveloper(productManager.content);

  // Step 3: Tester creates test report
  const tester = await runTester(developer.content, productManager.content);

  // Step 4: UI designs interface
  const ui = await runUI(productManager.content);

  return {
    productManager,
    developer,
    tester,
    ui,
  };
}

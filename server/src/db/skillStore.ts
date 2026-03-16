import fs from 'fs/promises';
import path from 'path';

export type AgentRole = 'product_manager' | 'developer' | 'tester' | 'ui';

export interface AgentSkill {
  id: string;
  role: AgentRole;
  name: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

const DB_PATH = path.join(process.cwd(), 'data', 'skills.json');

// 确保 data 目录存在
async function ensureDir() {
  const dir = path.dirname(DB_PATH);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {}
}

// 读取 JSON 文件
async function readData(): Promise<AgentSkill[]> {
  try {
    const content = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

// 写入 JSON 文件
async function writeData(data: AgentSkill[]): Promise<void> {
  await ensureDir();
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getSkill(role: AgentRole): Promise<AgentSkill | undefined> {
  const data = await readData();
  return data.find((s) => s.role === role);
}

export async function getAllSkills(): Promise<AgentSkill[]> {
  return readData();
}

export async function saveSkill(role: AgentRole, content: string): Promise<AgentSkill> {
  const data = await readData();
  const existing = data.find((s) => s.role === role);
  const now = Date.now();

  const skill: AgentSkill = {
    id: role,
    role,
    name: getRoleName(role),
    content,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  if (existing) {
    Object.assign(existing, skill);
  } else {
    data.push(skill);
  }

  await writeData(data);
  return skill;
}

function getRoleName(role: AgentRole): string {
  const names: Record<AgentRole, string> = {
    product_manager: '产品经理',
    developer: '开发工程师',
    tester: '测试工程师',
    ui: 'UI 设计师',
  };
  return names[role];
}

// Default skill templates
const DEFAULT_SKILLS: Record<AgentRole, string> = {
  product_manager: `你是一个专业的产品经理。你的职责是：
1. 分析用户需求，提取核心功能
2. 将需求拆解为具体的技术任务
3. 制定合理的优先级
4. 输出结构化的 PRD 文档

请按照以下格式输出：
## 产品名称
## 核心功能
## 用户故事
## 技术要求`,

  developer: `你是一个资深全栈开发工程师。你的职责是：
1. 理解 PRD 文档的技术要求
2. 选择合适的技术栈
3. 生成高质量、可运行的代码
4. 确保代码符合最佳实践

请输出：
## 技术选型
## 代码实现
## 文件结构`,

  tester: `你是一个专业的 QA 工程师。你的职责是：
1. 根据代码和 PRD 编写测试用例
2. 识别潜在的风险点
3. 生成测试报告

请输出：
## 测试用例
## 测试结果
## 问题清单`,

  ui: `你是一个专业的 UI/UX 设计师。你的职责是：
1. 根据 PRD 设计界面方案
2. 提供交互建议
3. 输出设计规范

请输出：
## 布局设计
## 视觉规范
## 交互说明`,
};

export async function seedDefaultSkills(): Promise<void> {
  const roles: AgentRole[] = ['product_manager', 'developer', 'tester', 'ui'];

  for (const role of roles) {
    const existing = await getSkill(role);
    if (!existing) {
      await saveSkill(role, DEFAULT_SKILLS[role]);
      console.log(`Seeded default skill for: ${role}`);
    }
  }
}

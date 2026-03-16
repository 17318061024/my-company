# AI Agent 团队 - 工作思路文档

## 一、系统架构概览

```
用户需求 → 产品经理Agent → 开发Agent → 测试Agent → UI Agent → 最终交付
              ↓              ↓           ↓           ↓
          PRD文档        代码实现    测试报告     UI设计稿
```

**技术栈选择**：
- 前端框架：Vue 3 + TypeScript + Vite + Pinia
- 后端：Node.js + Express
- API 调用：MiniMax abab6.5s-chat
- 数据存储：JSON 文件 (idb)

---

## 二、核心设计思路

### 1. 串行流水线设计

| Agent | 输入 | 输出 | 核心能力 |
|-------|------|------|----------|
| 产品经理 | 用户原始需求 | PRD文档 | 需求分析、任务拆解、优先级排序 |
| 开发 | PRD文档 | 可运行代码 | 代码生成、技术选型、架构设计 |
| 测试 | 代码+PRD | 测试报告 | 用例生成、缺陷识别、覆盖率分析 |
| UI | PRD文档 | 设计稿/原型 | 界面规划、交互设计、视觉建议 |

### 2. Agent Skill 管理

- 每个 Agent 维护独立的 Skill（纯文本格式）
- Skill 存储在 JSON 文件 中，持久化保存
- 支持随时编辑更新，动态生效
- 预设默认 Skill，可在此基础上定制

### 3. 关键组件

- **Orchestrator（编排器）**：控制流水线执行顺序
- **Skill Store**：管理 Agent 的 Skill 数据
- **MiniMax Client**：封装 API 调用

---

## 三、项目结构

```
minimax/
├── client/                         # Vue 前端
│   ├── src/
│   │   ├── components/
│   │   │   ├── AgentCard.vue       # Agent 技能卡片
│   │   │   └── PipelinePanel.vue  # 流水线面板
│   │   ├── stores/
│   │   │   └── agentStore.ts      # Pinia 状态管理
│   │   ├── api/
│   │   │   └── index.ts           # API 请求封装
│   │   ├── types/
│   │   │   └── index.ts           # TypeScript 类型
│   │   ├── App.vue
│   │   └── main.ts
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── server/                         # Node.js 后端
│   ├── src/
│   │   ├── agents/
│   │   │   └── orchestrator.ts    # Agent 编排器
│   │   ├── services/
│   │   │   └── claudeClient.ts    # MiniMax API 客户端
│   │   ├── routes/
│   │   │   ├── skills.ts          # Skill API
│   │   │   └── agents.ts          # Agent API
│   │   ├── db/
│   │   │   └── skillStore.ts     # JSON 文件 存储
│   │   └── index.ts              # 入口文件
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── .env                      # API Key 配置
│
├── WORKFLOW.md                    # 本文档
└── .gitignore
```

---

## 四、运行说明

### 1. 配置环境变量

```bash
cd server
cp .env.example .env
# 编辑 .env，填入你的 MiniMax API Key
MINIMAX_API_KEY=your-api-key-here
```

### 2. 启动服务

**启动后端**（终端 1）：
```bash
cd server
npm run dev
# 服务运行在 http://localhost:3001
```

**启动前端**（终端 2）：
```bash
cd client
npm run dev
# 服务运行在 http://localhost:5173
```

### 3. 使用流程

1. 打开 http://localhost:5173
2. 在 "Agent 配置" 页面编辑各 Agent 的 Skill
3. 切换到 "运行流水线" 页面
4. 输入需求描述，点击运行
5. 查看四个 Agent 的执行结果

---

## 五、API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/skills | 获取所有 Agent 的 Skill |
| PUT | /api/skills/:role | 更新指定角色的 Skill |
| GET | /api/agents/:role | 获取单个 Agent 的 Skill |
| POST | /api/agents/run | 运行完整流水线 |
| POST | /api/agents/run/:role | 运行单个 Agent |

---

## 六、实施步骤

### Phase 1 - 项目初始化 ✅ 已完成
- [x] 搭建前后端项目结构
- [x] 实现 Agent Skill 管理（JSON 文件 持久化）
- [x] 实现串行流水线
- [x] 集成 MiniMax API（abab6.5s-chat 模型）

### Phase 2 - 功能完善
- [ ] 添加错误处理和重试机制
- [ ] 优化 Prompt 提升质量
- [ ] 加入反馈循环
- [ ] 添加日志记录

### Phase 3 - 高级功能
- [ ] 支持 Agent 并行执行
- [ ] 添加历史记录功能
- [ ] 支持更多模型切换
- [ ] 添加流式输出（Streaming）

---

## 七、文件清单

### 后端 (server/src/)
| 文件 | 说明 |
|------|------|
| index.ts | 服务入口，Express 配置 |
| agents/orchestrator.ts | 流水线编排 |
| services/claudeClient.ts | MiniMax API 调用 |
| routes/skills.ts | Skill 管理 API |
| routes/agents.ts | Agent 执行 API |
| db/skillStore.ts | JSON 文件 存储 |

### 前端 (client/src/)
| 文件 | 说明 |
|------|------|
| main.ts | Vue 入口 |
| App.vue | 主页面组件 |
| stores/agentStore.ts | Pinia 状态管理 |
| api/index.ts | API 请求封装 |
| types/index.ts | TypeScript 类型定义 |
| components/AgentCard.vue | Agent 技能卡片 |
| components/PipelinePanel.vue | 流水线执行面板 |

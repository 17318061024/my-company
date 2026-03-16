<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAgentStore } from '@/stores/agentStore';
import AgentCard from '@/components/AgentCard.vue';
import PipelinePanel from '@/components/PipelinePanel.vue';
import type { AgentRole } from '@/types';
import { AGENT_CONFIG } from '@/types';

const store = useAgentStore();
const activeTab = ref<'skills' | 'pipeline'>('skills');

const agentRoles: AgentRole[] = ['product_manager', 'developer', 'tester', 'ui'];

onMounted(() => {
  store.loadSkills();
});
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>🤖 AI Agent 团队</h1>
      <nav class="nav">
        <button
          :class="{ active: activeTab === 'skills' }"
          @click="activeTab = 'skills'"
        >
          Agent 配置
        </button>
        <button
          :class="{ active: activeTab === 'pipeline' }"
          @click="activeTab = 'pipeline'"
        >
          运行流水线
        </button>
      </nav>
    </header>

    <main class="main">
      <div v-if="store.loading" class="loading">加载中...</div>
      <div v-else-if="store.error" class="error">{{ store.error }}</div>

      <template v-else>
        <!-- Skills Tab -->
        <div v-show="activeTab === 'skills'" class="skills-view">
          <div class="agents-grid">
            <AgentCard
              v-for="role in agentRoles"
              :key="role"
              :role="role"
              :config="AGENT_CONFIG[role]"
              :skill="store.skills[role]?.content || ''"
              @save="(content) => store.saveSkill(role, content)"
            />
          </div>
        </div>

        <!-- Pipeline Tab -->
        <div v-show="activeTab === 'pipeline'" class="pipeline-view">
          <PipelinePanel />
        </div>
      </template>
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
  color: #333;
}

.app {
  min-height: 100vh;
}

.header {
  background: #fff;
  padding: 1rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 1.5rem;
}

.nav button {
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  border: none;
  background: #eee;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.nav button.active {
  background: #3b82f6;
  color: #fff;
}

.main {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
}

.error {
  color: #ef4444;
}

.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}
</style>

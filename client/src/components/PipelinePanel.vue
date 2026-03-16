<script setup lang="ts">
import { ref } from 'vue';
import { useAgentStore } from '@/stores/agentStore';
import { AGENT_CONFIG } from '@/types';

const store = useAgentStore();
const userRequest = ref('');
</script>

<template>
  <div class="pipeline-panel">
    <div class="input-section">
      <h3>输入需求</h3>
      <textarea
        v-model="userRequest"
        class="request-input"
        placeholder="描述你想要开发的产品或功能..."
      ></textarea>
      <button
        class="run-btn"
        :disabled="!userRequest.trim() || store.pipelineLoading"
        @click="store.executePipeline(userRequest)"
      >
        {{ store.pipelineLoading ? '运行中...' : '🚀 运行流水线' }}
      </button>
    </div>

    <div v-if="store.pipelineResult" class="result-section">
      <div class="result-header">
        <h3>执行结果</h3>
        <button class="clear-btn" @click="store.clearResult">清空结果</button>
      </div>

      <div class="results-grid">
        <div class="result-card">
          <div class="result-title">
            <span>{{ AGENT_CONFIG.product_manager.icon }}</span>
            <span>产品经理分析</span>
          </div>
          <div class="result-content">
            {{ store.pipelineResult.productManager?.content }}
          </div>
        </div>

        <div class="result-card">
          <div class="result-title">
            <span>{{ AGENT_CONFIG.developer.icon }}</span>
            <span>开发工程师代码</span>
          </div>
          <div class="result-content">
            {{ store.pipelineResult.developer?.content }}
          </div>
        </div>

        <div class="result-card">
          <div class="result-title">
            <span>{{ AGENT_CONFIG.tester.icon }}</span>
            <span>测试工程师报告</span>
          </div>
          <div class="result-content">
            {{ store.pipelineResult.tester?.content }}
          </div>
        </div>

        <div class="result-card">
          <div class="result-title">
            <span>{{ AGENT_CONFIG.ui.icon }}</span>
            <span>UI 设计师方案</span>
          </div>
          <div class="result-content">
            {{ store.pipelineResult.ui?.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pipeline-panel {
  max-width: 1000px;
  margin: 0 auto;
}

.input-section {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.input-section h3 {
  margin-bottom: 1rem;
}

.request-input {
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
  line-height: 1.6;
  resize: vertical;
  font-family: inherit;
  margin-bottom: 1rem;
}

.request-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.run-btn {
  padding: 0.75rem 2rem;
  background: #10b981;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
}

.run-btn:hover:not(:disabled) {
  background: #059669;
}

.run-btn:disabled {
  background: #a7f3d0;
  cursor: not-allowed;
}

.result-section {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.clear-btn {
  padding: 0.4rem 1rem;
  background: #eee;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.results-grid {
  display: grid;
  gap: 1.5rem;
}

.result-card {
  border: 1px solid #eee;
  border-radius: 6px;
  overflow: hidden;
}

.result-title {
  background: #f9fafb;
  padding: 0.75rem 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.result-content {
  padding: 1rem;
  white-space: pre-wrap;
  font-size: 0.9rem;
  line-height: 1.7;
  max-height: 300px;
  overflow-y: auto;
}
</style>

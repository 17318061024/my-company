<script setup lang="ts">
import { ref, watch } from 'vue';
import type { AgentRole } from '@/types';

const props = defineProps<{
  role: AgentRole;
  config: { name: string; icon: string; color: string };
  skill: string;
}>();

const emit = defineEmits<{
  save: [content: string];
}>();

const editingSkill = ref('');
const saving = ref(false);

watch(
  () => props.skill,
  (newVal) => {
    editingSkill.value = newVal;
  },
  { immediate: true }
);

async function handleSave() {
  saving.value = true;
  emit('save', editingSkill.value);
  setTimeout(() => {
    saving.value = false;
  }, 500);
}
</script>

<template>
  <div class="agent-card">
    <div class="card-header" :style="{ borderColor: config.color }">
      <span class="icon">{{ config.icon }}</span>
      <h3>{{ config.name }}</h3>
    </div>
    <div class="card-body">
      <textarea
        v-model="editingSkill"
        class="skill-editor"
        placeholder="输入 Agent 的 Skill 内容..."
      ></textarea>
    </div>
    <div class="card-footer">
      <button class="save-btn" :disabled="saving" @click="handleSave">
        {{ saving ? '保存中...' : '保存' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.agent-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 1rem;
  border-left: 4px solid;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
}

.icon {
  font-size: 1.5rem;
}

.card-body {
  padding: 1rem;
}

.skill-editor {
  width: 100%;
  min-height: 200px;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  line-height: 1.6;
  resize: vertical;
  font-family: inherit;
}

.skill-editor:focus {
  outline: none;
  border-color: #3b82f6;
}

.card-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}

.save-btn {
  padding: 0.5rem 1.5rem;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.save-btn:hover:not(:disabled) {
  background: #2563eb;
}

.save-btn:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}
</style>

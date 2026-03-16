import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { AgentRole, AgentSkill, PipelineResult } from '@/types';
import { getAllSkills, updateSkill as apiUpdateSkill, runPipeline } from '@/api';

export const useAgentStore = defineStore('agents', () => {
  const skills = ref<Record<AgentRole, AgentSkill | null>>({
    product_manager: null,
    developer: null,
    tester: null,
    ui: null,
  });

  const loading = ref(false);
  const pipelineLoading = ref(false);
  const pipelineResult = ref<PipelineResult | null>(null);
  const error = ref<string | null>(null);

  async function loadSkills() {
    loading.value = true;
    error.value = null;
    try {
      const allSkills = await getAllSkills();
      for (const skill of allSkills) {
        skills.value[skill.role as AgentRole] = skill;
      }
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  }

  async function saveSkill(role: AgentRole, content: string) {
    loading.value = true;
    error.value = null;
    try {
      const updated = await apiUpdateSkill(role, content);
      skills.value[role] = updated;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  }

  async function executePipeline(userRequest: string) {
    pipelineLoading.value = true;
    error.value = null;
    try {
      pipelineResult.value = await runPipeline(userRequest);
    } catch (e: any) {
      error.value = e.message;
    } finally {
      pipelineLoading.value = false;
    }
  }

  function clearResult() {
    pipelineResult.value = null;
  }

  return {
    skills,
    loading,
    pipelineLoading,
    pipelineResult,
    error,
    loadSkills,
    saveSkill,
    executePipeline,
    clearResult,
  };
});

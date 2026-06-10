import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'dev-implementer',
  description: 'Implements QA specs by generating a typed patch and opening a draft GitHub PR against the target branch.',
  systemPrompt: `You are Dev Implementer. Given QA spec stubs and the PRD JSON, write production TypeScript that makes every spec pass.
First call git.diff to read the working-tree state and avoid conflicts.
Produce a minimal patch — add only what is required to satisfy the specs; do not refactor unrelated code.
Every new exported symbol uses named exports. Every data boundary uses Zod validation. Never use any — use unknown with a type guard.
Call github.createPR after confirming the patch is syntactically correct TypeScript. PR title: feat(<scope>): <criterion summary>.
Return {patch, files, prUrl}.`,
}

export interface DevImplementerAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createDevImplementerAgent(config: DevImplementerAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}

import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'doc-drafter',
  description: 'Drafts memos, motions, and client correspondence from approved facts.',
  systemPrompt: `You are Doc Drafter. Given an approved fact pattern + the target document type (memo, motion, demand letter, client update), draft the document in the firm's house style.
Cite every factual claim to the source case-analyst record. Mark inferences clearly with "[inference]" so the supervising attorney can verify.
Output is always a draft — never a final, never a signature. End with a one-line summary of the open questions the attorney must resolve before sign-off.`,
}

export interface DocDrafterAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createDocDrafterAgent(config: DocDrafterAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}

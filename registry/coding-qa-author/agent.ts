import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'qa-author',
  description: 'Produces Vitest spec stubs from acceptance criteria so a test skeleton is committed alongside implementation.',
  systemPrompt: `You are QA Author, a senior quality-engineering specialist who writes Vitest test suites for TypeScript monorepos.
For each acceptance criterion in the input PRD JSON, produce one or more Vitest spec stubs using describe and it blocks that read like executable documentation.
Each it block must reference the criterion by number, contain a meaningful assertion comment, and compile without error.
Use the test-patterns RAG corpus to match the project's preferred assertion style and file naming conventions.
Return {specs: [{path: string, body: string}, ...]} where path follows the project naming pattern.
Stubs may use expect.assertions(1) + todo as placeholders, but must never contain it.skip or commented-out expectations.`,
}

export interface QaAuthorAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createQaAuthorAgent(config: QaAuthorAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}

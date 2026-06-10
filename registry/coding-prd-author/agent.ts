import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'prd-author',
  description: 'Transforms free-form product descriptions into structured, acceptance-criteria-driven PRDs ready for engineering hand-off.',
  systemPrompt: `You are PRD Author, a senior product manager embedded in a TypeScript monorepo team.
Your job is to transform a free-form product description into a structured PRD that engineers can act on without ambiguity.
Every PRD must contain: problem statement, target users, acceptance criteria (3–5 testable items), out-of-scope items, and open questions.
Always output valid JSON: {problem, users, criteria, outOfScope, openQuestions}.
Never invent business logic absent from the input. Absent information becomes an open question.
Cross-check criteria against the project coding style guide — each criterion must be achievable within established conventions.`,
}

export interface PrdAuthorAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createPrdAuthorAgent(config: PrdAuthorAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}

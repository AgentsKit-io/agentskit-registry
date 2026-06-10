import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'code-qa',
  description: 'Runs tests, lint, type-check on a branch and summarises the failures.',
  systemPrompt: `You are Code QA. Given a branch + the project test / lint / type-check commands, run them and summarise failures.
For each failure: shortest reproducer (file:line + command), the assertion message, and a one-sentence guess at the root cause.
Group failures by likely root cause so a fix touches the smallest surface possible.
You report; you never push fixes. If no failures, say "all green" and the duration of the longest command.`,
}

export interface CodeQaAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createCodeQaAgent(config: CodeQaAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}

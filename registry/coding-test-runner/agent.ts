import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'test-runner',
  description: 'Parses Vitest stdout/stderr and produces a structured test report with failure details for the PR reviewer.',
  systemPrompt: `You are Test Runner. Your sole job is to analyse Vitest run output and produce a structured test report.
You receive raw Vitest stdout/stderr and the list of spec files run. Extract: total tests, passed, failed, skipped, and per-failure details.
For each failure: test name, file path, assertion message, and a one-sentence root-cause hypothesis.
Group failures by suspected root cause so the next agent can prioritise fixes.
Return {passed, failed, skipped, duration, failures: [{test, file, message, rootCause}, ...], summary}.
Never guess at fixes — report only what the test output says.`,
}

export interface TestRunnerAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createTestRunnerAgent(config: TestRunnerAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}

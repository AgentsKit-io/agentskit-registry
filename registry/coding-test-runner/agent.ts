import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Test Runner — parses raw Vitest stdout/stderr into a TYPED test report: totals plus
 * per-failure details (test, file, message, one-sentence root-cause hypothesis), grouped
 * so the next agent can prioritise fixes. It analyses output you already captured; it does
 * not execute anything itself (no shell access by design).
 *
 * ```ts
 * const report = await createTestRunnerAgent({ adapter }).run(vitestOutput)
 * ```
 */

export interface TestFailure {
  test: string
  file: string
  message: string
  /** One-sentence root-cause hypothesis. */
  rootCause: string
}

export interface TestReport {
  passed: number
  failed: number
  skipped: number
  duration: string
  failures: TestFailure[]
  summary: string
}

export interface TestRunnerConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Report = z.object({
  passed: z.number().int().min(0),
  failed: z.number().int().min(0),
  skipped: z.number().int().min(0),
  duration: z.string(),
  failures: z.array(z.object({
    test: z.string(),
    file: z.string(),
    message: z.string(),
    rootCause: z.string(),
  })),
  summary: z.string(),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'test-runner',
  description: 'Parses raw Vitest output into a typed test report with per-failure root-cause hypotheses.',
  systemPrompt: `You analyse raw Vitest stdout/stderr and produce a STRUCTURED test report. Extract: total
passed, failed, skipped, and duration. For EACH failure: the test name, the file path, the assertion
message, and a one-sentence root-cause hypothesis. Group failures by suspected root cause so the next
agent can prioritise. Report only what the output shows — do not invent failures or passes.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_report exactly once with { passed, failed, skipped, duration, failures, summary }. Stop.`,
  tools: ['submit_report'],
}

export function createTestRunnerAgent(config: TestRunnerConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_report', description: 'Submit the test report. Call exactly once.', schema: Report, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(vitestOutput: string): Promise<TestReport> {
    if (!vitestOutput?.trim()) throw new Error('test runner requires raw Vitest output')
    emit('parse', 'start')
    const report = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `RAW VITEST OUTPUT:\n${fenceUntrustedContent(vitestOutput)}`,
      parse: (a) => Report.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })
    emit('parse', 'ok', `${report.passed} passed, ${report.failed} failed`)
    return report
  }

  return {
    name: 'coding-test-runner',
    run,
    asHandle() {
      return { name: 'coding-test-runner', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}

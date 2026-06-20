import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Code QA — runs the project's test / lint / type-check commands through a caller-injected
 * runner, then has the model turn the REAL captured output into a TYPED failure report
 * (shortest reproducer, assertion message, one-sentence root cause), grouped so a fix
 * touches the smallest surface. It reports; it never pushes fixes.
 *
 * The agent does NOT spawn shells itself — you inject `run`, so command execution stays in
 * YOUR sandbox/policy. With no runner it refuses (it can't QA what it can't run).
 *
 * ```ts
 * const report = await createCodeQaAgent({
 *   adapter,
 *   run: (cmd) => exec(cmd, { cwd }),   // → { stdout, stderr, code, durationMs }
 *   commands: ['pnpm test', 'pnpm lint', 'pnpm typecheck'],
 * }).run('feature/login')
 * ```
 */

export interface CommandResult {
  stdout: string
  stderr: string
  /** Process exit code (0 = success). */
  code: number
  durationMs?: number
}

export interface QaFailure {
  /** Shortest reproducer: file:line + the command. */
  reproducer: string
  command: string
  message: string
  rootCause: string
}

export interface CodeQaReport {
  allGreen: boolean
  /** Per-command exit status. */
  commands: { command: string; code: number; durationMs?: number }[]
  failures: QaFailure[]
  summary: string
}

export interface CodeQaConfig {
  adapter: AdapterFactory
  /** Command runner — executes in YOUR sandbox and returns the captured result. */
  run: (command: string) => Promise<CommandResult> | CommandResult
  /** Commands to run (test / lint / type-check). */
  commands: string[]
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Report = z.object({
  failures: z.array(z.object({
    reproducer: z.string(),
    command: z.string(),
    message: z.string(),
    rootCause: z.string(),
  })),
  summary: z.string(),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'code-qa',
  description: 'Turns captured test/lint/type-check output into a typed, grouped failure report.',
  systemPrompt: `You are Code QA. You are given the CAPTURED output of the project's test / lint /
type-check commands. Produce a structured failure report. For EACH failure: the shortest reproducer
(file:line + the command), the assertion/error message, and a one-sentence root-cause guess. Group
failures by likely root cause so a fix touches the smallest surface. You REPORT; you never push fixes.
Report only what the output shows — do not invent failures.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_report exactly once with { failures, summary }. Stop.`,
  tools: ['submit_report'],
}

export function createCodeQaAgent(config: CodeQaConfig) {
  if (typeof config.run !== 'function') throw new Error('code QA requires a `run` command runner')
  const commands = config.commands ?? []
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_report', description: 'Submit the QA report. Call exactly once.', schema: Report, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(branch: string): Promise<CodeQaReport> {
    if (commands.length === 0) throw new Error('code QA requires at least one command to run')

    // Run every command deterministically and capture the REAL output.
    const ran: { command: string; result: CommandResult }[] = []
    for (const command of commands) {
      emit('run', 'start', command)
      const result = await config.run(command)
      ran.push({ command, result })
      emit('run', result.code === 0 ? 'ok' : 'error', command)
    }
    const commandStatuses = ran.map(({ command, result }) => ({ command, code: result.code, durationMs: result.durationMs }))
    const allGreen = ran.every(({ result }) => result.code === 0)
    if (allGreen) {
      return { allGreen: true, commands: commandStatuses, failures: [], summary: 'all green' }
    }

    // Hand the captured output to the model for typed failure analysis.
    const captured = ran
      .filter(({ result }) => result.code !== 0)
      .map(({ command, result }) => `$ ${command} (exit ${result.code})\n${result.stdout}\n${result.stderr}`)
      .join('\n\n')
    emit('analyse', 'start')
    const out = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `BRANCH: ${branch}\n\nCAPTURED COMMAND OUTPUT:\n${fenceUntrustedContent(captured)}`,
      parse: (a) => Report.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })
    emit('analyse', 'ok', `${out.failures.length} failure(s)`)
    return { allGreen: false, commands: commandStatuses, failures: out.failures, summary: out.summary }
  }

  return {
    name: 'coding-code-qa',
    run,
    asHandle() {
      return { name: 'coding-code-qa', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}

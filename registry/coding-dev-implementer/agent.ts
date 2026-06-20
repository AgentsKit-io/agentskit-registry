import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Dev Implementer — proposes a TYPED, minimal patch plan that makes the QA specs pass:
 * a list of file changes (add/modify, with full new contents) + a PR title + notes. The
 * model proposes; the agent does NOT touch your working tree. Pass an `openPr` transport
 * to turn the approved plan into a real PR — deterministic, HITL-gated, reporting the real
 * PR url. With no transport you get the plan to apply yourself.
 *
 *   - **Proposes, never writes** — no silent file mutations; the plan is data you apply.
 *   - **Fail-closed PR** — `openPr` runs only with explicit `approve` (or `autoApprove`).
 *   - **House rules in the prompt** — named exports, Zod at boundaries, no `any`, minimal diff.
 *
 * ```ts
 * const r = await createDevImplementerAgent({
 *   adapter,
 *   currentDiff: await git.diff(),           // grounds the plan against working-tree state
 *   openPr: (plan) => gh.openPr(plan),       // optional, gated
 *   approve: (plan) => ui.confirm(plan.prTitle),
 * }).run(`${prdJson}\n\n${qaSpecs}`)
 * ```
 */

export interface FileChange {
  path: string
  /** 'add' a new file or 'modify' an existing one. */
  action: 'add' | 'modify'
  /** Full new file contents (a complete file, not a fragment). */
  contents: string
  /** One-line reason this change is required by a spec. */
  reason: string
}

export interface PatchPlan {
  files: FileChange[]
  prTitle: string
  notes: string
}

export interface PrResult {
  ok: boolean
  url?: string
  error?: string
  skipped?: boolean
}

export interface DevImplementerResult {
  plan: PatchPlan
  /** Present only when an `openPr` transport was configured. */
  pr?: PrResult
  /** True when a PR was held back pending approval. */
  requiresApproval: boolean
}

export interface DevImplementerConfig {
  adapter: AdapterFactory
  /** Current working-tree diff, to ground the plan and avoid conflicts. */
  currentDiff?: string
  /** Transport that opens a PR from the approved plan and returns its url. */
  openPr?: (plan: PatchPlan) => Promise<{ url: string }> | { url: string }
  /** HITL gate before opening the PR. Return false to hold back. */
  approve?: (plan: PatchPlan) => boolean | Promise<boolean>
  /** Open the PR without an `approve` gate. Default false (fail-closed). */
  autoApprove?: boolean
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Plan = z.object({
  files: z.array(z.object({
    path: z.string(),
    action: z.enum(['add', 'modify']),
    contents: z.string(),
    reason: z.string(),
  })),
  prTitle: z.string(),
  notes: z.string(),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'dev-implementer',
  description: 'Proposes a typed minimal patch plan that makes the QA specs pass (does not write files).',
  systemPrompt: `You implement QA spec stubs against a PRD by proposing a MINIMAL patch — add only what is
required to satisfy the specs; do not refactor unrelated code. Each file change: path, action
(add|modify), the FULL new file contents, and a one-line reason tied to a spec.

House rules: named exports only; Zod validation at every data boundary; NEVER use \`any\` (use unknown +
a type guard). Provide a PR title "feat(<scope>): <criterion summary>" and notes. If a current working-
tree diff is provided, avoid conflicting with it.

You do NOT write files or open PRs — that happens outside you. Just return the plan.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_plan exactly once with { files, prTitle, notes }. Stop.`,
  tools: ['submit_plan'],
}

export function createDevImplementerAgent(config: DevImplementerConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_plan', description: 'Submit the patch plan. Call exactly once.', schema: Plan, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(specsAndPrd: string): Promise<DevImplementerResult> {
    if (!specsAndPrd?.trim()) throw new Error('dev implementer requires the QA specs + PRD')
    const diffBlock = config.currentDiff ? `\n\nCURRENT WORKING-TREE DIFF:\n${fenceUntrustedContent(config.currentDiff)}` : ''
    emit('plan', 'start')
    const plan = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `QA SPECS + PRD:\n${fenceUntrustedContent(specsAndPrd)}${diffBlock}`,
      parse: (a) => Plan.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })
    emit('plan', 'ok', `${plan.files.length} file(s)`)

    if (!config.openPr) {
      // No transport — return the plan to apply yourself; open nothing.
      return { plan, requiresApproval: false }
    }
    const approved = config.approve ? await config.approve(plan) : config.autoApprove === true
    if (!approved) {
      emit('pr', 'skip')
      return { plan, pr: { ok: false, skipped: true, error: 'not approved' }, requiresApproval: true }
    }
    try {
      emit('pr', 'start')
      const { url } = await config.openPr(plan)
      emit('pr', 'ok')
      return { plan, pr: { ok: true, url }, requiresApproval: false }
    } catch (err) {
      emit('pr', 'error')
      return { plan, pr: { ok: false, error: err instanceof Error ? err.message : String(err) }, requiresApproval: false }
    }
  }

  return {
    name: 'coding-dev-implementer',
    run,
    asHandle() {
      return { name: 'coding-dev-implementer', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}

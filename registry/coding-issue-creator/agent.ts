import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Issue Creator — drafts one TYPED GitHub issue per PRD acceptance criterion, then creates
 * them through a caller-injected `createIssue` transport. The model only drafts; creation
 * is deterministic code that reports the real issue number/url — it never claims an issue
 * it didn't open.
 *
 *   - **One issue per criterion** — the invariant, enforced in the draft step.
 *   - **Real creation or honest draft** — no transport ⇒ you get the drafted issues and
 *     `created:[]`, never a faked issue number.
 *   - **Fail-closed HITL** — each creation is gated by `approve`; with no `approve` and
 *     `autoApprove` off (the default) nothing is created.
 *
 * ```ts
 * const r = await createIssueCreatorAgent({
 *   adapter,
 *   createIssue: (i) => gh.issues.create({ ...i }).then((res) => ({ number: res.number, url: res.html_url })),
 *   approve: (i) => ui.confirm(`Open issue "${i.title}"?`),
 * }).run(prdJson)
 * ```
 */

export interface IssueDraft {
  title: string
  body: string
  labels: string[]
}

export interface CreatedIssue {
  title: string
  ok: boolean
  number?: number
  url?: string
  error?: string
  skipped?: boolean
}

export interface IssueCreatorResult {
  drafts: IssueDraft[]
  created: CreatedIssue[]
  /** True when ≥1 issue was held back pending approval. */
  requiresApproval: boolean
}

export interface IssueCreatorConfig {
  adapter: AdapterFactory
  /** Transport that actually opens an issue and returns its number + url. */
  createIssue?: (issue: IssueDraft) => Promise<{ number: number; url: string }> | { number: number; url: string }
  /** HITL gate per issue before creating. Return false to hold back. */
  approve?: (issue: IssueDraft) => boolean | Promise<boolean>
  /** Create without an `approve` gate. Default false (fail-closed). */
  autoApprove?: boolean
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  issues: z.array(z.object({
    title: z.string().max(80),
    body: z.string(),
    labels: z.array(z.string()),
  })),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'issue-creator',
  description: 'Drafts one typed GitHub issue per PRD acceptance criterion (creation is gated, deterministic code).',
  systemPrompt: `You translate a PRD into GitHub issues — ONE issue per acceptance criterion (never batch
multiple criteria into one issue). For each criterion: title = the first 80 characters; body = the
criterion in full plus a Definition of Done checklist; labels = ["enhancement","automated"] unless the
criterion implies a bug fix, then ["bug","automated"].

You do NOT create anything — creation happens outside you. Just return the drafted issues.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_issues exactly once with { issues: [{ title, body, labels }] }. Stop.`,
  tools: ['submit_issues'],
}

export function createIssueCreatorAgent(config: IssueCreatorConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_issues', description: 'Submit the drafted issues. Call exactly once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(prd: string): Promise<IssueCreatorResult> {
    if (!prd?.trim()) throw new Error('issue creator requires a PRD')
    emit('draft', 'start')
    const { issues: drafts } = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `PRD:\n${fenceUntrustedContent(prd)}`,
      parse: (a) => Output.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })
    emit('draft', 'ok', `${drafts.length} issue(s)`)

    const created: CreatedIssue[] = []
    let requiresApproval = false
    if (!config.createIssue) {
      // No transport — return drafts honestly, create nothing.
      return { drafts, created: [], requiresApproval: false }
    }
    for (const issue of drafts) {
      const approved = config.approve ? await config.approve(issue) : config.autoApprove === true
      if (!approved) {
        requiresApproval = true
        created.push({ title: issue.title, ok: false, skipped: true, error: 'not approved' })
        emit('create', 'skip', issue.title)
        continue
      }
      try {
        emit('create', 'start', issue.title)
        const { number, url } = await config.createIssue(issue)
        created.push({ title: issue.title, ok: true, number, url })
        emit('create', 'ok', `#${number}`)
      } catch (err) {
        created.push({ title: issue.title, ok: false, error: err instanceof Error ? err.message : String(err) })
        emit('create', 'error', issue.title)
      }
    }
    return { drafts, created, requiresApproval }
  }

  return {
    name: 'coding-issue-creator',
    run,
    asHandle() {
      return { name: 'coding-issue-creator', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}

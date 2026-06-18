import { writeFileSync } from 'node:fs'
import type { Finding, Reporter, ReviewResult } from './agent'

/**
 * Reporters turn a ReviewResult into an output surface. They are orchestration code
 * (string building + GitHub REST), not model calls. Add your own by implementing
 * `Reporter` and passing it in `reporters`.
 *
 * The GitHub reporters POST directly to the REST API. The model-facing equivalents are
 * the `github_create_pr_review_comment` / `github_create_pr_review` tools in
 * `@agentskit/tools` — use those when an LLM should decide to post; use these reporters
 * when orchestration posts deterministically after the pipeline.
 */

const SEV_ORDER: Finding['severity'][] = ['blocker', 'high', 'med', 'nit']
const SEV_EMOJI: Record<Finding['severity'], string> = { blocker: '⛔', high: '🔴', med: '🟡', nit: '🔵' }

function groupBySeverity(findings: Finding[]): string {
  const lines: string[] = []
  for (const sev of SEV_ORDER) {
    const group = findings.filter((f) => f.severity === sev)
    if (!group.length) continue
    lines.push(`\n### ${SEV_EMOJI[sev]} ${sev} (${group.length})\n`)
    for (const f of group) {
      lines.push(`- **${f.file}:${f.line}** — ${f.title} _(${f.category}, conf ${f.confidence.toFixed(2)})_`)
      lines.push(`  - ${f.rationale}`)
      lines.push(`  - 💡 ${f.suggestion}`)
      if (f.suggestedPatch) {
        const tag = f.patchValidated === true ? ' (build-validated)' : f.patchValidated === false ? ' (does not apply)' : ''
        lines.push(`  - <details><summary>suggested patch${tag}</summary>\n\n\`\`\`diff\n${f.suggestedPatch}\n\`\`\`\n</details>`)
      }
    }
  }
  return lines.join('\n')
}

/** Human-readable Markdown — to a sink (default stdout) and optionally a file. */
export function markdownReporter(opts: { write?: (s: string) => void; file?: string } = {}): Reporter {
  const write = opts.write ?? ((s: string) => process.stdout.write(s))
  return {
    name: 'markdown',
    async emit(review: ReviewResult) {
      const md = renderMarkdown(review)
      if (opts.file) writeFileSync(opts.file, md)
      write(md + '\n')
    },
  }
}

export function renderMarkdown(review: ReviewResult): string {
  const head = `## Code review — ${review.verdict}\n\n${review.summary}`
  const body = review.findings.length ? groupBySeverity(review.findings) : '\nNo findings above threshold. ✅'
  const dropped = review.dropped.length ? `\n\n_${review.dropped.length} finding(s) dropped (verify/threshold). ${review.droppedNote ?? ''}_` : ''
  return `${head}\n${body}${dropped}\n`
}

/** Machine output: SARIF 2.1.0 for GitHub code-scanning / dashboards. */
export function sarifReporter(opts: { file?: string; write?: (s: string) => void } = {}): Reporter {
  const sevToLevel: Record<Finding['severity'], string> = { blocker: 'error', high: 'error', med: 'warning', nit: 'note' }
  return {
    name: 'sarif',
    async emit(review: ReviewResult) {
      const rulesSeen = new Map<string, { id: string; name: string }>()
      const results = review.findings.map((f) => {
        const ruleId = `code-review/${f.category}`
        if (!rulesSeen.has(ruleId)) rulesSeen.set(ruleId, { id: ruleId, name: f.category })
        return {
          ruleId,
          level: sevToLevel[f.severity],
          message: { text: `${f.title} — ${f.rationale} Suggestion: ${f.suggestion}` },
          locations: [
            {
              physicalLocation: {
                artifactLocation: { uri: f.file },
                region: { startLine: f.line, ...(f.endLine ? { endLine: f.endLine } : {}) },
              },
            },
          ],
          properties: { severity: f.severity, confidence: f.confidence },
        }
      })
      const sarif = {
        $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
        version: '2.1.0',
        runs: [
          {
            tool: { driver: { name: 'agentskit-code-review', rules: [...rulesSeen.values()].map((r) => ({ id: r.id, name: r.name })) } },
            results,
          },
        ],
      }
      const text = JSON.stringify(sarif, null, 2)
      if (opts.file) writeFileSync(opts.file, text)
      if (opts.write) opts.write(text)
    },
  }
}

async function githubPost(token: string, path: string, body: unknown): Promise<{ html_url?: string }> {
  const res = await fetch(`https://api.github.com${path}`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      accept: 'application/vnd.github+json',
      'user-agent': 'agentskit-code-review',
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`GitHub POST ${path} → ${res.status}: ${await res.text()}`)
  return res.json() as Promise<{ html_url?: string }>
}

/** One summary comment on the PR thread (uses the issues endpoint — always available). */
export function githubSummaryReporter(c: { owner: string; repo: string; number: number; token: string }): Reporter {
  return {
    name: 'github-summary',
    async emit(review: ReviewResult) {
      await githubPost(c.token, `/repos/${c.owner}/${c.repo}/issues/${c.number}/comments`, { body: renderMarkdown(review) })
    },
  }
}

/**
 * A batched PR review: inline comments on findings that land inside the diff, plus an
 * overall verdict + summary body. Findings outside the diff are folded into the body
 * (GitHub rejects review comments on unchanged lines).
 */
export function githubInlineReporter(c: { owner: string; repo: string; number: number; token: string; commitId?: string }): Reporter {
  // NB: never emit APPROVE — a GitHub Actions token cannot approve PRs (422). An
  // APPROVE verdict is posted as a COMMENT review instead.
  const eventFor = (v: ReviewResult['verdict']) => (v === 'REQUEST CHANGES' ? 'REQUEST_CHANGES' : 'COMMENT')
  return {
    name: 'github-inline',
    async emit(review: ReviewResult) {
      const inline = review.findings.filter((f) => f.inDiff)
      const outOfDiff = review.findings.filter((f) => !f.inDiff)
      const comments = inline.map((f) => ({
        path: f.file,
        line: f.endLine ?? f.line,
        body: `**${SEV_EMOJI[f.severity]} ${f.severity} · ${f.category}** — ${f.title}\n\n${f.rationale}\n\n💡 ${f.suggestion}${f.suggestedPatch ? `\n\n\`\`\`diff\n${f.suggestedPatch}\n\`\`\`` : ''}`,
      }))
      const body =
        `## Code review — ${review.verdict}\n\n${review.summary}` +
        (outOfDiff.length ? `\n\n### Findings outside the diff\n${groupBySeverity(outOfDiff)}` : '')
      await githubPost(c.token, `/repos/${c.owner}/${c.repo}/pulls/${c.number}/reviews`, {
        event: eventFor(review.verdict),
        body,
        ...(c.commitId ? { commit_id: c.commitId } : {}),
        ...(comments.length ? { comments } : {}),
      })
    },
  }
}

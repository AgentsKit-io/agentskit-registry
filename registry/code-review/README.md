# Code Review

A deep, **low-noise** code-review agent. It doesn't just scan for typos — it reasons about each change on seven dimensions, then *proves* a finding is real before it shows it to you.

## Why it's different

Most review bots run one prompt, one pass, and post whatever comes out — which is noisy and shallow. This agent:

- **Fans out 7 focused lenses** per file — correctness · security · performance · maintainability · design · tests · conventions — instead of one prompt juggling everything.
- **Adversarially verifies every finding** — N independent skeptics try to *refute* each one; it survives only on a minority of refutes. This is what keeps it quiet.
- **Returns typed findings with applicable patches** — `{file, line, severity, category, confidence, rationale, suggestion, suggestedPatch}` — optionally `git apply --check`-validated.
- **Prioritises + budgets** — hotspot-ranked, capped, concurrency-limited, so whole-repo review never runs away.
- **Gates CI** — `review.blocking` is true when a finding at/above your `blockingSeverity` survives.

## Usage

```ts
import { anthropic } from '@agentskit/adapters'
import { createCodeReviewAgent } from './agent'

const agent = createCodeReviewAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
  source: { kind: 'git-diff', base: 'origin/main', cwd: process.cwd() },
  conventions: { path: 'CONTRIBUTING.md' },
  auditVotes: 3,
})

const review = await agent.run()
if (review.blocking) process.exit(1) // CI gate
```

### Inputs (`source`)

| kind | what it reviews |
|---|---|
| `{ kind: 'git-diff', base, head?, cwd? }` | the local diff `base...head` |
| `{ kind: 'github-pr', owner, repo, number, token }` | a GitHub PR (diff + file contents) |
| `{ kind: 'paths', paths, cwd? }` | whole files / directories (architectural pass) |
| `{ kind: 'stdin', content, filename? }` | a pasted snippet |

### Outputs (`reporters`)

`markdownReporter()` (default), `sarifReporter({ file })`, `githubSummaryReporter({...})` (one PR comment), `githubInlineReporter({...})` (batched review with line-level comments + verdict). Implement `Reporter` for your own.

### Tuning

- `lenses` — pass a subset to disable, or add a custom `Lens` (your own `SkillDefinition`).
- `thresholds` — `{ minSeverity, minConfidence, maxPerFile, suppressNits }`.
- `auditVotes` — adversarial verify votes (default 3).
- `validatePatch` — `git apply --check` every suggested patch first.
- `budget` — `{ maxFiles, concurrency }` (concurrency caps parallel model calls — size it for your machine).
- `blockingSeverity` — CI gate floor (default `blocker`).
- `observers` — pass `createProgressObserver()` from `@agentskit/ink` for a live spinner per stage.

## How it works

```
ingest (source) → prioritise + budget → fan-out 7 lenses (parallel)
→ dedupe → adversarial verify (skeptics) → thresholds → [validate patches]
→ synthesise verdict → emit reporters → review.blocking for CI
```

The lens and the skeptic are separate skills in separate runtimes — a lens never grades its own homework. Findings are read back from validated `submit_*` tool calls, never free text.

## Notes

- The GitHub reporters POST to the REST API directly. The model-facing equivalents are the `github_create_pr_review_comment` / `github_create_pr_review` tools in `@agentskit/tools` — use those when an LLM decides to post.
- Patches are **suggestions** — a human applies them; the agent never commits.

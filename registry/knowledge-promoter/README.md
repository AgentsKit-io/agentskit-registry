# Knowledge Promoter Agent

Turns curated **private notes** into **public documentation PRs** — safely.

Pipeline: **classify → sanitize → leak-gate → publish (one draft PR).**

- The **sanitizer** (writer) and the **leak auditor** are separate agents in separate
  runtimes — the writer never grades its own homework.
- The **leak gate is deterministic**: a regex denylist *plus* the adversarial auditor,
  both run by orchestration code — never a step the model can skip.
- It **never merges**. A human reviews the draft PR.

Reusable for any "private notes → public docs" flow: inject your site map, house style,
denylist, and a `publish` function.

```bash
npx agentskit add knowledge-promoter
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createKnowledgePromoterAgent } from './agents/knowledge-promoter/agent'

const agent = createKnowledgePromoterAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
  siteMapUrl: 'https://docs.example.com/llms.txt',
  houseStyle: '`# Title` → `## TL;DR (human)` → `## For agents` → `### See also`',
  denylist: [/\bACME-\d+\b/, /\binternal-[a-z]+\b/],
  publish: async (docs) => {
    // write each doc into a checkout, then `gh pr create --draft`. Return { pr, url }.
    return { pr: 123, url: 'https://github.com/org/docs/pull/123' }
  },
})

const { outcomes, pr } = await agent.run([
  { id: 'n1', title: 'Equalize columns by layout, not text', lesson: '…raw lesson, internal context allowed…' },
])
```

## Config

| Field | Required | What |
|---|---|---|
| `adapter` | ✓ | Any AgentsKit adapter (anthropic/openai/gemini/…) |
| `siteMapUrl` | ✓ | Target docs' machine-readable map (e.g. `/llms.txt`) — used to dedup |
| `houseStyle` | ✓ | Injected verbatim into the sanitizer (frontmatter + section order) |
| `denylist` | ✓ | `RegExp[]` — the deterministic first leak layer; any hit hard-blocks |
| `publish` | ✓ | `(docs) => { pr, url }` — opens ONE draft PR. **Never merges.** |
| `onConfirm` | | Per-tool HITL gate |
| `memory`, `observers`, `maxSteps` | | Standard runtime options |

## `run(candidates)` → `{ outcomes, pr? }`

Each candidate ends as `promoted` (in the PR), `rejected` (not generalizable / duplicate),
or `blocked` (leak gate). One batched draft PR per run.

## Safety model

Two independent leak layers, both must pass: regex denylist **and** a separate auditor
agent that defaults to *block* when uncertain. The `publish` function should use a token
**without merge permission**, so the human gate is enforced at the token, not just policy.

## Built on

`@agentskit/runtime` (ReAct + structured tool-call capture), `@agentskit/tools`
(`defineZodTool`), `@agentskit/adapters`. Skills are plain `SkillDefinition`s in `skills.ts`.

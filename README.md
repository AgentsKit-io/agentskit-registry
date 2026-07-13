# AgentsKit Registry

**Ready-to-use AI agents for [AgentsKit](https://www.agentskit.io).** Copy the source into your project — you own the code. No new framework dependency, no lock-in.

→ Browse agents at **[registry.agentskit.io](https://registry.agentskit.io)**

## How it works

Each agent is a small, self-contained folder that wires published `@agentskit/*`
packages (a skill + tools + the runtime) into a one-call factory. The CLI copies
that source into your project — shadcn-style — so you can read it, edit it, and keep it.

```bash
npx agentskit add research      # copies the research agent into ./agents/research/
npx agentskit add code-review
```

```ts
import { openai } from '@agentskit/adapters'
import { createResearchAgent } from './agents/research/agent'

const agent = createResearchAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('What changed in the EU AI Act in 2025?')
```

## Agents

| Agent | Category | What it does |
|-------|----------|--------------|
| [`research`](./registry/research) | research | Citation-first web research |
| [`code-review`](./registry/code-review) | coding | Deep, low-noise review: 7 lenses + adversarial verify → typed findings & patches; git diff / PR / files; Markdown / SARIF / PR comments; blocking CI gate |
| [`knowledge-promoter`](./registry/knowledge-promoter) | ops | Turns curated private notes into public docs PRs: classify → sanitize → adversarial leak-gate → draft PR (never merges) |

More landing weekly. [Contribute one →](./CONTRIBUTING.md)

## Validation evidence

Registry checks and independent behavioral review are separate signals. Agents that cleared the
two-agent Codex cycle with a score and reviewer confidence of at least 95% expose a compact
`validation` summary in `public/r/index.json` and a detailed, sanitized review in their individual
`public/r/<id>.json` bundle. Raw model output, validator logs, credentials, and local paths are never
published.

The committed source of truth is [`validation/evidence.json`](./validation/evidence.json). Maintainers
with the private run artifacts can refresh it with `npm run validation:export -- --source <workspace>`;
`npm run build` then propagates the evidence into the public Registry payloads.

## Ecosystem

- **[Framework](https://www.agentskit.io)** — the OSS agent toolkit these agents are built on
- **[Playbook](https://playbook.agentskit.io)** — engineering standards
- **Registry** — you are here
- **[AKOS](https://akos.agentskit.io)** — the enterprise OS for agents (orchestration, egress, RBAC)

## License

MIT

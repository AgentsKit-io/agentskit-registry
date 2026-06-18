# AgentsKit Registry

**Ready-to-use AI agents for [AgentsKit](https://www.agentskit.io).** Copy the source into your project — you own the code. No new framework dependency, no lock-in.

→ Browse the gallery at **[registry.agentskit.io](https://registry.agentskit.io)**

## How it works

Each agent is a small, self-contained folder that wires published `@agentskit/*`
packages (a skill + tools + the runtime) into a one-call factory. The CLI copies
that source into your project — shadcn-style — so you can read it, edit it, and keep it.

```bash
npx agentskit add research      # copies the research agent into ./agents/research/
npx agentskit add pr-review
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
| [`pr-review`](./registry/pr-review) | coding | Reviews a GitHub PR for correctness/security/conventions |

More landing weekly. [Contribute one →](./CONTRIBUTING.md)

## Ecosystem

- **[Framework](https://www.agentskit.io)** — the OSS agent toolkit these agents are built on
- **[Playbook](https://playbook.agentskit.io)** — engineering standards
- **Registry** — you are here
- **[AKOS](https://akos.agentskit.io)** — the enterprise OS for agents (orchestration, egress, RBAC)

## License

MIT

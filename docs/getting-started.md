# Get an agent running

Registry works like shadcn for agents: a command copies readable source into
your project. You own that source and can change it without a Registry runtime
dependency.

## 1. Add a validated agent

```bash
npx agentskit add research
```

The command writes `agents/research/agent.ts` and its guide. Install the packages
printed by the CLI, then import the local factory:

```ts
import { openai } from '@agentskit/adapters'
import { createResearchAgent } from './agents/research/agent'

const agent = createResearchAgent({
  adapter: openai({
    apiKey: process.env.OPENAI_API_KEY!,
    model: 'gpt-4o',
  }),
})

const result = await agent.run('What changed in the EU AI Act?')
console.log(result.content)
```

For a credential-free smoke test of a runnable agent, use the CLI demo adapter:

```bash
npx agentskit add coding-prd-author --run "Draft a small status-page PRD" --provider demo
```

## What “validated” means

Every installable entry has source, metadata, a focused test, and a usage guide.
The repository validates all 346 structures and replays their committed eval
cases. Public independent-review summaries are joined into the generated index;
raw private reviewer output is never published.

Review copied code and provider/tool permissions before production use. A
validated template is a strong starting point, not authorization for your data
or environment.

## Next steps

- [Browse all agents](https://registry.agentskit.io/agents)
- [Learn the AgentsKit framework](https://www.agentskit.io/docs)
- [Apply production practices](https://playbook.agentskit.io/docs)
- [Build an interactive experience with AgentsKit Chat](https://github.com/AgentsKit-io/agentskit-chat)

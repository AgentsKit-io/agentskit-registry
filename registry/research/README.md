# Research Agent

Citation-first research agent. The [`researcher`](https://www.agentskit.io/docs/reference/packages/skills) skill wired to web search + URL fetching — every claim is anchored to a source URL.

## Add it

```bash
npx agentskit add research
```

This copies `agent.ts` into your project (default `./agents/research/`). You own the code.

## Use it

```ts
import { openai } from '@agentskit/adapters'
import { createResearchAgent } from './agents/research/agent'

const agent = createResearchAgent({
  adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }),
})

const { content } = await agent.run('What changed in the EU AI Act in 2025?')
console.log(content)
```

Swap `openai` for any AgentsKit adapter (`anthropic`, `gemini`, `ollama`, …) — no lock-in.

## Packages

`@agentskit/core` · `@agentskit/runtime` · `@agentskit/skills` · `@agentskit/tools`

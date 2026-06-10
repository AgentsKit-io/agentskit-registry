# Behavior Analyser

Deep-analyses player behaviour against house rules and AML-threshold RAG documents, producing a structured risk assessment for both AML alerts and VIP opportunity signals.

```bash
npx agentskit add casino-behavior-analyser
```

```ts
import { openai } from '@agentskit/adapters'
import { createBehaviorAnalyserAgent } from './agents/casino-behavior-analyser/agent'

const agent = createBehaviorAnalyserAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

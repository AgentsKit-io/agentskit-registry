# Sanctions Screener

Continuously cross-references customer + counterparty records against OFAC, UN, EU, and locally-loaded sanctions lists.

```bash
npx agentskit add fintech-sanctions-screener
```

```ts
import { openai } from '@agentskit/adapters'
import { createSanctionsScreenerAgent } from './agents/fintech-sanctions-screener/agent'

const agent = createSanctionsScreenerAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

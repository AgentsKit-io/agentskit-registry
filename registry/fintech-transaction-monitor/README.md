# Transaction Monitor

Surfaces unusual patterns (velocity spikes, structuring, geo-anomalies) and drafts SAR-ready case files.

```bash
npx agentskit add fintech-transaction-monitor
```

```ts
import { openai } from '@agentskit/adapters'
import { createTransactionMonitorAgent } from './agents/fintech-transaction-monitor/agent'

const agent = createTransactionMonitorAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

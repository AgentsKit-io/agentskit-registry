# KYC Screener

Cross-references customer records against sanctions + PEP lists.

```bash
npx agentskit add fintech-kyc-screener
```

```ts
import { openai } from '@agentskit/adapters'
import { createKycScreenerAgent } from './agents/fintech-kyc-screener/agent'

const agent = createKycScreenerAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

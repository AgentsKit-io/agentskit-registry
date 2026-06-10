# Referral Router

Reads inbound referral packets, identifies the receiving specialty, and queues the case for the relevant clinician.

```bash
npx agentskit add clinical-referral-router
```

```ts
import { openai } from '@agentskit/adapters'
import { createReferralRouterAgent } from './agents/clinical-referral-router/agent'

const agent = createReferralRouterAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

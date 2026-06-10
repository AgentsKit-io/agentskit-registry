# VIP Host Assistant

Drafts personalised comp offers and outreach messages for VIP players given their play history, stated preferences, and the bonus-eligibility-rules RAG. Routes all offers above host authority to manager approval.

```bash
npx agentskit add casino-vip-host-assistant
```

```ts
import { openai } from '@agentskit/adapters'
import { createVipHostAssistantAgent } from './agents/casino-vip-host-assistant/agent'

const agent = createVipHostAssistantAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

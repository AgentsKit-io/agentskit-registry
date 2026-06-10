# Escalation Drafter

Drafts an internal escalation summary for engineering / account teams.

```bash
npx agentskit add support-escalation-drafter
```

```ts
import { openai } from '@agentskit/adapters'
import { createEscalationDrafterAgent } from './agents/support-escalation-drafter/agent'

const agent = createEscalationDrafterAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

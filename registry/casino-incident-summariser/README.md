# Incident Summariser

Drafts a structured incident report from raw security / surveillance / floor-supervisor notes.

```bash
npx agentskit add casino-incident-summariser
```

```ts
import { openai } from '@agentskit/adapters'
import { createIncidentSummariserAgent } from './agents/casino-incident-summariser/agent'

const agent = createIncidentSummariserAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

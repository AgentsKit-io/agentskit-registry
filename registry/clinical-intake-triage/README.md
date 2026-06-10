# Intake Triage

Classifies inbound patient messages by urgency and routes to the right queue.

```bash
npx agentskit add clinical-intake-triage
```

```ts
import { openai } from '@agentskit/adapters'
import { createIntakeTriageAgent } from './agents/clinical-intake-triage/agent'

const agent = createIntakeTriageAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

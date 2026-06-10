# Patient Summary

Drafts a one-page summary of a patient chart for the next visit.

```bash
npx agentskit add clinical-patient-summary
```

```ts
import { openai } from '@agentskit/adapters'
import { createPatientSummaryAgent } from './agents/clinical-patient-summary/agent'

const agent = createPatientSummaryAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

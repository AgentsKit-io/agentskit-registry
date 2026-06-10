# Chart Redactor

Applies the hipaa-strict PII profile (names, MRN, dates of birth, contact details) before any cross-tenant export.

```bash
npx agentskit add clinical-chart-redactor
```

```ts
import { openai } from '@agentskit/adapters'
import { createChartRedactorAgent } from './agents/clinical-chart-redactor/agent'

const agent = createChartRedactorAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

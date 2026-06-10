# Case Analyst

Extracts parties, dates, claims, and procedural posture from a case file.

```bash
npx agentskit add legal-case-analyst
```

```ts
import { openai } from '@agentskit/adapters'
import { createCaseAnalystAgent } from './agents/legal-case-analyst/agent'

const agent = createCaseAnalystAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

# Case Summariser

Produces matter-level summaries from a set of reviewed documents.

```bash
npx agentskit add legal-case-summariser
```

```ts
import { openai } from '@agentskit/adapters'
import { createCaseSummariserAgent } from './agents/legal-case-summariser/agent'

const agent = createCaseSummariserAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

# KB Searcher

Searches the knowledge base for the relevant article(s) given a ticket.

```bash
npx agentskit add support-kb-searcher
```

```ts
import { openai } from '@agentskit/adapters'
import { createKbSearcherAgent } from './agents/support-kb-searcher/agent'

const agent = createKbSearcherAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

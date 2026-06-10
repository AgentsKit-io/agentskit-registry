# Brief Expander

Drafts creative briefs from client kickoff notes.

```bash
npx agentskit add agency-brief-generator
```

```ts
import { openai } from '@agentskit/adapters'
import { createBriefGeneratorAgent } from './agents/agency-brief-generator/agent'

const agent = createBriefGeneratorAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

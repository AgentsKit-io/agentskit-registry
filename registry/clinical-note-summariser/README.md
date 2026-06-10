# SOAP Generator

Produces SOAP-format summaries from clinician dictation.

```bash
npx agentskit add clinical-note-summariser
```

```ts
import { openai } from '@agentskit/adapters'
import { createNoteSummariserAgent } from './agents/clinical-note-summariser/agent'

const agent = createNoteSummariserAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

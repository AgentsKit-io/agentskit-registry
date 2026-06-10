# Deck Builder

Generates pitch + status deck drafts from project artifacts (brief, KPIs, milestone notes).

```bash
npx agentskit add agency-deck-builder
```

```ts
import { openai } from '@agentskit/adapters'
import { createDeckBuilderAgent } from './agents/agency-deck-builder/agent'

const agent = createDeckBuilderAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

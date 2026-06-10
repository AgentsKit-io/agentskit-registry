# PRD Author

Transforms free-form product descriptions into structured, acceptance-criteria-driven PRDs ready for engineering hand-off.

```bash
npx agentskit add coding-prd-author
```

```ts
import { openai } from '@agentskit/adapters'
import { createPrdAuthorAgent } from './agents/coding-prd-author/agent'

const agent = createPrdAuthorAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

# QA Author

Produces Vitest spec stubs from acceptance criteria so a test skeleton is committed alongside implementation.

```bash
npx agentskit add coding-qa-author
```

```ts
import { openai } from '@agentskit/adapters'
import { createQaAuthorAgent } from './agents/coding-qa-author/agent'

const agent = createQaAuthorAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

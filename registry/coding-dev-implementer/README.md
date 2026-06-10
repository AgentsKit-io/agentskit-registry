# Dev Implementer

Implements QA specs by generating a typed patch and opening a draft GitHub PR against the target branch.

```bash
npx agentskit add coding-dev-implementer
```

```ts
import { openai } from '@agentskit/adapters'
import { createDevImplementerAgent } from './agents/coding-dev-implementer/agent'

const agent = createDevImplementerAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

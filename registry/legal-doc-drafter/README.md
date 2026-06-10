# Doc Drafter

Drafts memos, motions, and client correspondence from approved facts.

```bash
npx agentskit add legal-doc-drafter
```

```ts
import { openai } from '@agentskit/adapters'
import { createDocDrafterAgent } from './agents/legal-doc-drafter/agent'

const agent = createDocDrafterAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

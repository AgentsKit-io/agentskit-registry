# Copy Author

Produces three distinct copy variants — bold/challenger, warm/story-led, and precise/evidence-based — from the structured brief and competitive context. Every variant targets a specific persona and channel.

```bash
npx agentskit add marketing-copy-author
```

```ts
import { openai } from '@agentskit/adapters'
import { createCopyAuthorAgent } from './agents/marketing-copy-author/agent'

const agent = createCopyAuthorAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

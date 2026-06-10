# Copy Reviewer

Reads draft creative, flags brand-voice misalignment, and suggests rewrites. Routes contentious calls to a human.

```bash
npx agentskit add agency-copy-reviewer
```

```ts
import { openai } from '@agentskit/adapters'
import { createCopyReviewerAgent } from './agents/agency-copy-reviewer/agent'

const agent = createCopyReviewerAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

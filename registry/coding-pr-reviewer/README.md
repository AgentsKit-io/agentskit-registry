# PR Reviewer

Reviews the implementation diff for correctness, style, and test coverage, then posts structured inline GitHub review comments.

```bash
npx agentskit add coding-pr-reviewer
```

```ts
import { openai } from '@agentskit/adapters'
import { createPrReviewerAgent } from './agents/coding-pr-reviewer/agent'

const agent = createPrReviewerAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

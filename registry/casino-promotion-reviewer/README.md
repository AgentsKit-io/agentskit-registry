# Promotion Reviewer

Reviews proposed marketing promotions for compliance with state gaming regulations, internal policy, and responsible-gambling guidelines.

```bash
npx agentskit add casino-promotion-reviewer
```

```ts
import { openai } from '@agentskit/adapters'
import { createPromotionReviewerAgent } from './agents/casino-promotion-reviewer/agent'

const agent = createPromotionReviewerAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

# Contract Reviewer

Reviews uploaded contracts clause-by-clause for risky language.

```bash
npx agentskit add legal-contract-reviewer
```

```ts
import { openai } from '@agentskit/adapters'
import { createContractReviewerAgent } from './agents/legal-contract-reviewer/agent'

const agent = createContractReviewerAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

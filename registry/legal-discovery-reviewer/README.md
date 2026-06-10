# Discovery Reviewer

Reads documents, highlights privileged + responsive material, drafts case notes for human approval.

```bash
npx agentskit add legal-discovery-reviewer
```

```ts
import { openai } from '@agentskit/adapters'
import { createDiscoveryReviewerAgent } from './agents/legal-discovery-reviewer/agent'

const agent = createDiscoveryReviewerAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

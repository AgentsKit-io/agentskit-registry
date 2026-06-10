# Social Publisher

Posts approved copy to Discord and Slack. Formats messages for each platform's conventions and confirms delivery. Runs only after HITL approval.

```bash
npx agentskit add marketing-social-publisher
```

```ts
import { openai } from '@agentskit/adapters'
import { createSocialPublisherAgent } from './agents/marketing-social-publisher/agent'

const agent = createSocialPublisherAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

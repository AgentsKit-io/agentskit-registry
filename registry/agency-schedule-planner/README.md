# Schedule Planner

Plans a multi-channel content calendar from approved drafts.

```bash
npx agentskit add agency-schedule-planner
```

```ts
import { openai } from '@agentskit/adapters'
import { createSchedulePlannerAgent } from './agents/agency-schedule-planner/agent'

const agent = createSchedulePlannerAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

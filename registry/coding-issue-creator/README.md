# Issue Creator

Converts each PRD acceptance criterion into a well-formed GitHub issue with title, body, and labels.

```bash
npx agentskit add coding-issue-creator
```

```ts
import { openai } from '@agentskit/adapters'
import { createIssueCreatorAgent } from './agents/coding-issue-creator/agent'

const agent = createIssueCreatorAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

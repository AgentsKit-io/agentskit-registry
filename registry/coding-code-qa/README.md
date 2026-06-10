# Code QA

Runs tests, lint, type-check on a branch and summarises the failures.

```bash
npx agentskit add coding-code-qa
```

```ts
import { openai } from '@agentskit/adapters'
import { createCodeQaAgent } from './agents/coding-code-qa/agent'

const agent = createCodeQaAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

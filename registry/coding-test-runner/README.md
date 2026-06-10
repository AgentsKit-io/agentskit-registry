# Test Runner

Parses Vitest stdout/stderr and produces a structured test report with failure details for the PR reviewer.

```bash
npx agentskit add coding-test-runner
```

```ts
import { openai } from '@agentskit/adapters'
import { createTestRunnerAgent } from './agents/coding-test-runner/agent'

const agent = createTestRunnerAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

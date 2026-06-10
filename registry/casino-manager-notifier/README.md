# Manager Notifier

Sends structured AML/VIP alert notifications to the operations manager via Discord after receiving explicit HITL gate approval. Formats messages for immediate manager action.

```bash
npx agentskit add casino-manager-notifier
```

```ts
import { openai } from '@agentskit/adapters'
import { createManagerNotifierAgent } from './agents/casino-manager-notifier/agent'

const agent = createManagerNotifierAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

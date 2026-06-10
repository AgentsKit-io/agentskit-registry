# Triage Bot

Classifies inbound tickets by topic + severity and suggests a queue.

```bash
npx agentskit add support-triage-bot
```

```ts
import { openai } from '@agentskit/adapters'
import { createTriageBotAgent } from './agents/support-triage-bot/agent'

const agent = createTriageBotAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

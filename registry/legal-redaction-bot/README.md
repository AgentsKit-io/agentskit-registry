# Redaction Bot

Applies the legal-strict PII profile — names, account numbers, SSN, medical IDs — before any export.

```bash
npx agentskit add legal-redaction-bot
```

```ts
import { openai } from '@agentskit/adapters'
import { createRedactionBotAgent } from './agents/legal-redaction-bot/agent'

const agent = createRedactionBotAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

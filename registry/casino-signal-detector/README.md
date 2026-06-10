# Signal Detector

Classifies an inbound player signal as either an AML-alert candidate or a VIP-trigger event, routing each to the correct downstream analysis path.

```bash
npx agentskit add casino-signal-detector
```

```ts
import { openai } from '@agentskit/adapters'
import { createSignalDetectorAgent } from './agents/casino-signal-detector/agent'

const agent = createSignalDetectorAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

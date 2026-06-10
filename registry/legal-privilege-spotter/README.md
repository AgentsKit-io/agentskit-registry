# Privilege Spotter

Re-checks the discovery output for missed attorney-client / work-product material before release.

```bash
npx agentskit add legal-privilege-spotter
```

```ts
import { openai } from '@agentskit/adapters'
import { createPrivilegeSpotterAgent } from './agents/legal-privilege-spotter/agent'

const agent = createPrivilegeSpotterAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

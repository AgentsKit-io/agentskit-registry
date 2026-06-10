# Release Notes Drafter

Drafts release notes from the merged PRs since the last tag.

```bash
npx agentskit add coding-release-notes-drafter
```

```ts
import { openai } from '@agentskit/adapters'
import { createReleaseNotesDrafterAgent } from './agents/coding-release-notes-drafter/agent'

const agent = createReleaseNotesDrafterAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

# PR Review Agent

Reviews a GitHub pull request for correctness, security, performance, and conventions — the [`prReviewer`](https://www.agentskit.io/docs/reference/packages/skills) skill wired to the GitHub tools.

## Add it

```bash
npx agentskit add pr-review
```

## Use it

```ts
import { anthropic } from '@agentskit/adapters'
import { createPRReviewAgent } from './agents/pr-review/agent'

const agent = createPRReviewAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-sonnet-4-6' }),
  githubToken: process.env.GITHUB_TOKEN!,
})

const { content } = await agent.run('Review PR #42 in AgentsKit-io/agentskit')
console.log(content)
```

Wire it into CI to auto-review PRs. Swap the adapter for any provider — no lock-in.

## Packages

`@agentskit/core` · `@agentskit/runtime` · `@agentskit/skills` · `@agentskit/tools`



## Deploy

**Deploy on AKOS — coming soon** → [join the waitlist](https://akos.agentskit.io).

# Social Publisher

Formats one approved copy variant per platform and **delivers it through your transports** — real delivery or an honest failure, never a faked post.

```bash
npx agentskit add marketing-social-publisher
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createSocialPublisherAgent } from './agents/marketing-social-publisher/agent'

const r = await createSocialPublisherAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
  transports: {
    slack: { send: (msg) => slack.post(CHANNEL, msg), maxChars: 3000 },
    discord: { send: (msg) => discord.send(CHANNEL, msg), maxChars: 2000 },
  },
  approve: (platform, msg) => ui.confirm(`Post to ${platform}?`, msg), // HITL
}).run(approvedCopy)
// → { formatted, delivery: [{ platform, ok, ts?, error? }], requiresApproval }
```

> The previous version's prompt told the model to call `discord.send` / `slack.chat.postMessage` but wired **no tools** — it could only *claim* to post. This version makes delivery real, deterministic code.

- **Real delivery or honest failure** — the model only *formats*; code calls your `transport.send` and records the **actual** provider id. A platform with no transport is reported `ok:false, error:'no transport configured'`, never faked.
- **Fail-closed HITL** — every send is gated by `approve`. With no `approve` and `autoApprove` off (the default) nothing is sent: you get the formatted drafts + `requiresApproval:true`. Opt in to blast.
- **Transport-agnostic** — inject any send fn (Slack, Discord, webhook, MCP); no SDK lock-in. Over-limit messages are rejected before send.
- Untrusted copy is **fenced**; the model can't be steered by injected instructions.

`run(approvedCopy)` → `PublishResult`. `asHandle()` is JSON-out. See [composing agents](../../COMPOSING.md). Pairs with [`marketing-copy-author`](../marketing-copy-author).

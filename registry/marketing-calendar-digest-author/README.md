# Calendar Digest Author

Turns the week's scheduled social posts into a **typed digest** + a ready-to-paste Slack markdown block. Delivery is optional and **HITL-gated**.

```bash
npx agentskit add marketing-calendar-digest-author
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createCalendarDigestAuthorAgent } from './agents/marketing-calendar-digest-author/agent'

const r = await createCalendarDigestAuthorAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
  // optional: auto-deliver, gated
  transport: { send: (md) => slack.post(CHANNEL, md), maxChars: 3000 },
  approve: (md) => ui.confirm('Post weekly digest?', md),
}).run(scheduledPosts)
// → { digest: { weekOf, channels[], totalPosts }, markdown, delivery? }
```

> The previous version told the model to call `slack.chat.postMessage` but wired no tools. Now the digest text is the product; delivery is real, optional, and gated.

- **Typed digest** — `invokeStructured` + zod: per-channel groups (`date / headline / persona`) + total count, plus a `markdown` Slack block. The text is useful with **no** transport.
- **Honest, gated delivery** — pass `transport` to auto-post; reported delivered only when it returns a real id. Fail-closed: no `approve` + `autoApprove` off ⇒ held back (`delivery.skipped`).
- Untrusted post list is **fenced**.

`run(scheduledPosts)` → `DigestResult`. `asHandle()` is JSON-out. See [composing agents](../../COMPOSING.md).

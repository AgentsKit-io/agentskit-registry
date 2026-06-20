# Brief Analyst

The intake step of a campaign studio — reads an incoming brief and produces a **typed structured brief** downstream agents reference.

```bash
npx agentskit add marketing-brief-analyst
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createBriefAnalystAgent } from './agents/marketing-brief-analyst/agent'

const r = await createBriefAnalystAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
  voiceGuide,  // optional — flags conflicting brief language
}).run(incomingBrief)
// → { brief: { clientProduct, objective, audience, keyMessages[], tone, channels[], timeline, mandatories[], voiceFlags[] }, gaps[], requiresReview }
```

- **Typed brief** — `invokeStructured` + zod; `objective` is an enum (`awareness | conversion | retention | unspecified`); key messages capped at 3.
- **Never invents** — missing required fields land in `gaps` to clarify, never guessed.
- **Voice-aware** — pass `voiceGuide` and brief language conflicting with it is flagged in `voiceFlags`. Untrusted brief text is **fenced**.

`run(brief)` → `BriefAnalysisResult`. `asHandle()` is JSON-out. See [composing agents](../../COMPOSING.md). Feeds [`marketing-copy-author`](../marketing-copy-author).

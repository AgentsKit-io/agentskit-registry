# Copy Reviewer

Reads draft creative against a brand-voice guide and returns **typed misalignments** with suggested rewrites — suggests, never imposes.

```bash
npx agentskit add agency-copy-reviewer
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createCopyReviewerAgent } from './agents/agency-copy-reviewer/agent'

const r = await createCopyReviewerAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
}).run(`GUIDE:\n${brandGuide}\n\nDRAFT:\n${draftCopy}`)
// → { misalignments: [{ line, currentText, suggestedRewrite, rationale, contentious }], overallAssessment, routeToHuman }
```

- **Typed misalignments** — `invokeStructured` + zod; each ties its rationale to a specific rule in the guide.
- **Suggests, never imposes** — never rewrites the whole piece; emits line-level suggestions only.
- **Routes contentious calls** — any item marked `contentious` (a judgment on brand *intent*, not a clear rule break) sets `routeToHuman` for the account lead. Untrusted copy is **fenced**.

`run(guideAndDraft)` → `CopyReviewResult`. `asHandle()` is JSON-out. See [composing agents](../../COMPOSING.md).

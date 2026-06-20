# Issue Creator

Drafts **one typed GitHub issue per PRD acceptance criterion**, then creates them through your transport — real creation or an honest draft.

```bash
npx agentskit add coding-issue-creator
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createIssueCreatorAgent } from './agents/coding-issue-creator/agent'

const r = await createIssueCreatorAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
  createIssue: (i) => gh.issues.create(i).then((res) => ({ number: res.number, url: res.html_url })),
  approve: (i) => ui.confirm(`Open issue "${i.title}"?`),
}).run(prdJson)
// → { drafts: [{ title, body, labels }], created: [{ title, ok, number?, url?, error? }], requiresApproval }
```

> The previous version told the model to call `github.createIssue` but wired **no tools** — it could only *claim* to create issues.

- **One issue per criterion** — the invariant, enforced in the typed draft (`invokeStructured` + zod).
- **Real creation or honest draft** — code calls your `createIssue` and records the **actual** number/url; no transport ⇒ drafts + `created:[]`, never a faked issue.
- **Fail-closed HITL** — each creation gated by `approve`; no `approve` + `autoApprove` off ⇒ nothing created. Untrusted PRD text is **fenced**.

`run(prd)` → `IssueCreatorResult`. `asHandle()` is JSON-out. See [composing agents](../../COMPOSING.md). Fed by [`coding-prd-author`](../coding-prd-author).

# Release Notes Drafter

Turns merged PRs since the last tag into **typed, grouped release notes** + a markdown block — every entry cites its PR number.

```bash
npx agentskit add coding-release-notes-drafter
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createReleaseNotesDrafterAgent } from './agents/coding-release-notes-drafter/agent'

const r = await createReleaseNotesDrafterAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
}).run(mergedPrList)
// → { groups: [{ type, entries: [{ text, pr }] }], markdown, requiresReview }
```

- **Typed groups** — `invokeStructured` + zod; `type` is an enum (`Feature | Fix | Performance | Docs | Internal`), user-facing changes first.
- **Cited, never invented** — every entry carries its PR number; no merge appears that isn't in the input.
- **Always a draft** — `requiresReview` always true; plus a ready-to-paste `markdown` block. Untrusted PR text is **fenced**.

`run(mergedPrs)` → `ReleaseNotesResult`. `asHandle()` is JSON-out. See [composing agents](../../COMPOSING.md).

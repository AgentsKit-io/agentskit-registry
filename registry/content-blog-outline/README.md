# Blog Outline

> **Status: alpha** — installable via `npx agentskit add content-blog-outline` for experimentation. Not yet `validated`.

## Pain

Blog structure

## Output

Outline typed

## Usage

```ts
import { createContentBlogOutlineAgent } from './agents/content-blog-outline/agent'
const result = await createContentBlogOutlineAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.

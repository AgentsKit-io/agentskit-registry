# HOA Document Summarizer

> **Status: alpha** — installable via `npx agentskit add realestate-hoa-document-summarizer` for experimentation. Not yet `validated`.

## Pain

HOA docs long

## Output

Summary typed

## Usage

```ts
import { createRealestateHoaDocumentSummarizerAgent } from './agents/realestate-hoa-document-summarizer/agent'
const result = await createRealestateHoaDocumentSummarizerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.

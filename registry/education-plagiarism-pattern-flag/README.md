# Plagiarism Pattern Flag

> **Status: alpha** — installable via `npx agentskit add education-plagiarism-pattern-flag` for experimentation. Not yet `validated`.

## Pain

Integrity checks

## Output

Flags typed

## Usage

```ts
import { createEducationPlagiarismPatternFlagAgent } from './agents/education-plagiarism-pattern-flag/agent'
const result = await createEducationPlagiarismPatternFlagAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.

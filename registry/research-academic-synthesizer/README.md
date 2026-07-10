# Academic Synthesizer

> **Status: alpha** — installable via `npx agentskit add research-academic-synthesizer` for experimentation. Not yet `validated`.

## Pain

Paper overload

## Output

Claims typed + DOI/URL

## Usage

```ts
import { createResearchAcademicSynthesizerAgent } from './agents/research-academic-synthesizer/agent'
const result = await createResearchAcademicSynthesizerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.

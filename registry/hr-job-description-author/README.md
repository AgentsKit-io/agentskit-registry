# Job Description Author

> **Status: alpha** — installable via `npx agentskit add hr-job-description-author` for experimentation. Not yet `validated`.

## Pain

JD writing slow

## Output

JD typed

## Usage

```ts
import { createHrJobDescriptionAuthorAgent } from './agents/hr-job-description-author/agent'
const result = await createHrJobDescriptionAuthorAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.

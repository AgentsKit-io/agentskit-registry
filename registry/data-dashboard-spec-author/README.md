# Dashboard Spec Author

> **Status: alpha** — installable via `npx agentskit add data-dashboard-spec-author` for experimentation. Not yet `validated`.

## Pain

Dashboard specs ad-hoc

## Output

Spec typed

## Usage

```ts
import { createDataDashboardSpecAuthorAgent } from './agents/data-dashboard-spec-author/agent'
const result = await createDataDashboardSpecAuthorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.

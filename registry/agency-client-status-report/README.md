# Client Status Report

> **Status: alpha** — installable via `npx agentskit add agency-client-status-report` for experimentation. Not yet `validated`.

## Pain

Weekly status manual

## Output

Report typed

## Usage

```ts
import { createAgencyClientStatusReportAgent } from './agents/agency-client-status-report/agent'
const result = await createAgencyClientStatusReportAgent({ adapter }).run(input)
```

## Gates

- cite-metrics

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.

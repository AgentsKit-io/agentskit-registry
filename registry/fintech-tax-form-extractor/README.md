# Tax Form Extractor

> **Status: alpha** — installable via `npx agentskit add fintech-tax-form-extractor` for experimentation. Not yet `validated`.

## Pain

Tax form data entry

## Output

Fields typed

## Usage

```ts
import { createFintechTaxFormExtractorAgent } from './agents/fintech-tax-form-extractor/agent'
const result = await createFintechTaxFormExtractorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.

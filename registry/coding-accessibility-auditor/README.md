# Accessibility Auditor

> **Status: alpha** — installable via `npx agentskit add coding-accessibility-auditor` for experimentation. Not yet `validated`.

## Pain

a11y regressions in PRs

## Output

WCAG findings typed

## Usage

```ts
import { createCodingAccessibilityAuditorAgent } from './agents/coding-accessibility-auditor/agent'
const result = await createCodingAccessibilityAuditorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.

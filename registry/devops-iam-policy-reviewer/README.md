# IAM Policy Reviewer

> **Status: alpha** — installable via `npx agentskit add devops-iam-policy-reviewer` for experimentation. Not yet `validated`.

## Pain

Over-permissive IAM

## Output

Findings typed

## Usage

```ts
import { createDevopsIamPolicyReviewerAgent } from './agents/devops-iam-policy-reviewer/agent'
const result = await createDevopsIamPolicyReviewerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.

# K8s Manifest Reviewer

> **Status: alpha** — installable via `npx agentskit add devops-k8s-manifest-reviewer` for experimentation. Not yet `validated`.

## Pain

YAML risks

## Output

Findings typed

## Usage

```ts
import { createDevopsK8sManifestReviewerAgent } from './agents/devops-k8s-manifest-reviewer/agent'
const result = await createDevopsK8sManifestReviewerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.

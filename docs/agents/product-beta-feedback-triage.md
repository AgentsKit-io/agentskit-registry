# Beta Feedback Triage

Status: human guide. Owner: Emerson Braun. Reviewed: 2026-08-14.

## What it does

Classifies beta feedback into a typed triage record with category, severity, queue, rationale, and gaps.

## Install and try

```bash
npx agentskit add product-beta-feedback-triage
npm test -- --run registry/product-beta-feedback-triage/agent.test.ts
```

The test covers ordinary feedback, a full-outage escalation, and empty input rejection.

## Limits and contribution

Triage is not a final product decision. Product owners should inspect evidence, user impact, duplicates, privacy, and escalation policy before changing roadmap or support commitments.

Activation: contribute an anonymized feedback fixture with a severity disagreement and the documented escalation decision.

Evidence: `registry/product-beta-feedback-triage/README.md`, `meta.json`, `agent.test.ts`, `eval.ts`.

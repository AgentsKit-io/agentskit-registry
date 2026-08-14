# Newsletter Author

Status: human guide. Owner: Emerson Braun. Reviewed: 2026-08-14.

## What it does

Drafts a typed newsletter from supplied stories, audience, and editorial constraints.

## Install and try

```bash
npx agentskit add content-newsletter-author
npm test -- --run registry/content-newsletter-author/agent.test.ts
```

The test covers a structured newsletter response and rejects empty input.

## Limits and contribution

The output is an editorial draft. Verify claims, permissions, links, tone, accessibility, and unsubscribe requirements before sending.

Activation: contribute an accessibility-reviewed newsletter fixture with a broken link and its corrected editorial decision.

Evidence: `registry/content-newsletter-author/README.md`, `meta.json`, `agent.test.ts`, `eval.ts`.

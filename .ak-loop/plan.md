# Plan: review README and renew its README Standard review (#180)

1. Read AGENTS.md, CONTRIBUTING.md, readme-standard-v1.json, package.json,
   .github/workflows/ci.yml (read only), the standard scripts, and the README.
2. Audit README claims against the repo:
   - Counts: public/r/index.json has 346 agents, 23 categories, 333 with approved
     validation. Matches the README, ecosystem-claims.json, and validation/evidence.json.
   - Commands: every script named in the README exists in package.json. The
     credential-free proof (node examples/verify-readme.mjs) and discovery:build run.
   - Links: every relative link resolves to a file in the repo. External links
     (badges, registry.agentskit.io, doc-bridge, agentskit.io, the OpenSSF badge,
     the apps/registry repo) were not fetched; they are reported as unverified.
   - Install path: `npx agentskit add research` matches docs/getting-started.md and the
     research factory (registry/research/agent.ts) used in the README sample.
   - Compatibility: Node.js 22 matches CI (actions/setup-node with node-version 22).
   - Removed features: no README mention of Vercel, Dependabot, or a Doc Bridge
     version. Doc Bridge is pinned ^2.4.0 in package.json and installs as 2.4.0.
3. Fix the README inaccuracies found (see commit body):
   - "security" -> "cybersecurity" (category id is cybersecurity).
   - "required adjustments" -> "review notes" (evidence has `notes`, no adjustments field).
   - "signed local artifact" -> "local artifact pinned by content hash" (knowledge.json
     has contentHash and no signature).
4. Renew readme-standard-v1.json: reviewedOn 2026-10-26, reviewDueOn 2027-01-24
   (reviewedOn + 90 days, reviewCadenceDays of the top-level-repository profile).
5. Run npm run readme:standard:refresh only after all README edits, so sourceHash
   matches the final README. sourceHash was not hand-edited.
6. Verify: check:readme-standard, test:readme-standard, npm ci, and every CI step in
   order, then npm run lint && npm run test && npm run build. Then the generated-artifact
   diff check.
7. Commit README.md, readme-standard-v1.json, and the handoff files as one commit.

## Departures from the contract

- Definition of Done item `test-for-new-code` asks for a changed *.test.mjs / *.test.ts
  file. This change is a documentation correction and review renewal with no new
  behaviour, and the contract puts test or source edits out of scope. No test file was
  changed, so this item is recorded as not passed. A human needs to decide whether to
  waive it for docs-only changes or to add a test in a follow-up.
- `npm ci` reports 1 high-severity npm audit finding. Dependency changes are out of scope,
  so it is not addressed here.

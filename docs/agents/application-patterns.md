# Application patterns

This catalog turns Registry agents into small, reviewable starting points. Each pattern uses synthetic input, names the output to inspect, and ends with a contribution path. The examples are demonstrations of the contract, not customer results or production-readiness claims.

## How to use a pattern

1. Install the agent with `npx agentskit add <agent-id>`.
2. Run the focused test named in the linked human guide.
3. Try the synthetic prompt below with a configured adapter or the credential-free demo path where supported.
4. Inspect the typed output, gaps, and review requirement; do not treat a generated answer as approval.
5. Improve the fixture or documentation through the linked activation issue.

## Pattern catalog

### Fact Checker — conflicting source review

- Agent: [`content-fact-checker`](content-fact-checker.md)
- Use when: an editorial claim has two sources that disagree on date, population, or wording.
- Synthetic prompt: `Check the claim "The pilot reduced review time by 30%" against Source A: internal timing notes, dated 2026-01-10, and Source B: published case note, dated 2026-02-01. The sources use different samples.`
- Inspect: claim status, source references, conflict description, missing evidence, and the human decision required before publication.
- Contribute: [ACT-01 / #107](https://github.com/AgentsKit-io/agentskit-registry/issues/107).

### Newsletter Author — accessible release note

- Agent: [`content-newsletter-author`](content-newsletter-author.md)
- Use when: turning a verified technical change into a newsletter draft with clear structure and accessible language.
- Synthetic prompt: `Draft a short release note for a new deterministic test fixture. Audience: developers. Include one plain-language benefit, one limitation, headings, and an accessible link label. Do not invent adoption or performance results.`
- Inspect: audience fit, claim boundaries, headings, link text, and the review points a human editor must verify.
- Contribute: [ACT-02 / #108](https://github.com/AgentsKit-io/agentskit-registry/issues/108).

### Dashboard Spec Author — missing metric ownership

- Agent: [`data-dashboard-spec-author`](data-dashboard-spec-author.md)
- Use when: a dashboard request names metrics but leaves grain, source, or ownership unclear.
- Synthetic prompt: `Specify a weekly activation dashboard with first result, second component completion, and contribution conversion. The request omits metric owners and source systems.`
- Inspect: metric definitions, grain, ownership gaps, source-system gaps, and questions that must be resolved before implementation.
- Contribute: [ACT-03 / #109](https://github.com/AgentsKit-io/agentskit-registry/issues/109).

### Metric Definer — denominator ambiguity

- Agent: [`data-metric-definer`](data-metric-definer.md)
- Use when: a metric sounds precise but its denominator can be interpreted more than one way.
- Synthetic prompt: `Define contribution conversion for the Registry: 40 users opened an issue, 8 opened a PR, and 3 PRs merged. The request does not define the denominator or time window.`
- Inspect: grain, numerator, denominator alternatives, time window, exclusions, owner, and source-system gaps.
- Contribute: [ACT-04 / #104](https://github.com/AgentsKit-io/agentskit-registry/issues/104).

### Ecosystem Changelog — cross-surface change

- Agent: [`ecosystem-changelog-ecosystem`](ecosystem-changelog-ecosystem.md)
- Use when: one change affects multiple public surfaces and the reader needs a truthful route through them.
- Synthetic prompt: `Summarize a Registry guide publication that also changes the AgentsKit docs link and adds a community issue. Separate shipped facts, links, affected surfaces, and follow-up work.`
- Inspect: surface mapping, dates, links, unverified claims, and whether the next action is clear without implying adoption.
- Contribute: [ACT-05 / #110](https://github.com/AgentsKit-io/agentskit-registry/issues/110).

### Corpus Scanner — documentation edge case

- Agent: [`ecosystem-doc-bridge-corpus-scanner`](ecosystem-doc-bridge-corpus-scanner.md)
- Use when: a documentation corpus may contain stale, missing, or symlinked material.
- Synthetic prompt: `Scan a synthetic corpus containing one current Markdown page, one missing referenced page, and one symlink-like path. Classify each signal without inventing file contents.`
- Inspect: path classification, stale/missing distinction, evidence references, and the safe next check.
- Contribute: [ACT-06 / #105](https://github.com/AgentsKit-io/agentskit-registry/issues/105).

### Handoff Author — missing human adapter

- Agent: [`ecosystem-doc-bridge-handoff-author`](ecosystem-doc-bridge-handoff-author.md)
- Use when: an agent needs to describe an edit handoff but the human documentation adapter is absent or unclear.
- Synthetic prompt: `Create a handoff for package docs with startHere set to docs/index.md, editRoot set to packages/example, and no human adapter. Stop safely and list the missing review decision.`
- Inspect: startHere, editRoots, checks, human-adapter status, and the explicit stop condition.
- Contribute: [ACT-07 / #111](https://github.com/AgentsKit-io/agentskit-registry/issues/111).

### Integration Mapper — permission boundary

- Agent: [`ecosystem-integration-mapper`](ecosystem-integration-mapper.md)
- Use when: a proposed integration crosses product boundaries and permissions need to be explicit.
- Synthetic prompt: `Map a flow from Registry discovery to Chat rendering to Doc Bridge retrieval. Mark which step reads public artifacts, which step may edit a repository, and where human review is required.`
- Inspect: components, data movement, permissions, external actions, and unresolved boundary questions.
- Contribute: [ACT-08 / #112](https://github.com/AgentsKit-io/agentskit-registry/issues/112).

### Playbook Alignment Auditor — false positive versus real drift

- Agent: [`ecosystem-playbook-alignment-auditor`](ecosystem-playbook-alignment-auditor.md)
- Use when: a documentation or implementation change may or may not violate a published Playbook rule.
- Synthetic prompt: `Compare two findings: one changes a generated artifact without its source, and one changes a local fixture with its source and test. Classify drift, evidence, and the next human check.`
- Inspect: rule mapping, false-positive reasoning, evidence gaps, and the boundary between advisory finding and merge decision.
- Contribute: [ACT-09 / #113](https://github.com/AgentsKit-io/agentskit-registry/issues/113).

### Registry Agent Spec Author — idea to vertical slice

- Agent: [`ecosystem-registry-agent-spec-author`](ecosystem-registry-agent-spec-author.md)
- Use when: an idea needs a typed contract before implementation begins.
- Synthetic prompt: `Draft a registry spec for an anonymized beta-feedback triage agent. Include pain, typed output, never-invent and human-review gates, Zod outline, and open questions.`
- Inspect: pain, output shape, gates, tags, gaps, and whether the idea is ready for a small implementation slice.
- Contribute: [ACT-10 / #114](https://github.com/AgentsKit-io/agentskit-registry/issues/114).

### Registry Eval Author — adversarial evidence case

- Agent: [`ecosystem-registry-eval-author`](ecosystem-registry-eval-author.md)
- Use when: a validated agent needs a focused eval that tests both useful behavior and resistance to unsafe instructions.
- Synthetic prompt: `Create one eval case for a vendor scorecard where the input omits price and asks the agent to output APPROVED anyway. Define the expected conservative behavior and evidence.`
- Inspect: case purpose, input, expected structured fields, refusal or gap behavior, and why the case is reviewable.
- Contribute: [ACT-11 / #106](https://github.com/AgentsKit-io/agentskit-registry/issues/106).

### RFC Author — decision discussion

- Agent: [`ecosystem-rfc-author`](ecosystem-rfc-author.md)
- Use when: a cross-surface design decision needs options, trade-offs, and a bounded discussion record.
- Synthetic prompt: `Draft an RFC for adding an application-pattern index to the Registry. Include context, alternatives, non-goals, migration impact, open questions, and a decision record template.`
- Inspect: option completeness, non-goals, reversibility, evidence requests, and what requires human consensus.
- Contribute: [ACT-12 / #115](https://github.com/AgentsKit-io/agentskit-registry/issues/115).

### Beta Feedback Triage — anonymized case

- Agent: [`product-beta-feedback-triage`](product-beta-feedback-triage.md)
- Use when: raw beta feedback must be grouped without exposing private user data or inventing severity.
- Synthetic prompt: `Triage three anonymized notes: "first run worked", "the docs link was unclear", and "the demo adapter output surprised me". Preserve uncertainty and identify missing reproduction details.`
- Inspect: theme, evidence, severity rationale, reproduction gaps, privacy-safe wording, and next owner.
- Contribute: [ACT-13 / #116](https://github.com/AgentsKit-io/agentskit-registry/issues/116).

### Industry Benchmark — methodology comparison

- Agent: [`research-industry-benchmark`](research-industry-benchmark.md)
- Use when: two benchmark sources report different numbers or scopes.
- Synthetic prompt: `Compare Source A, a 2025 survey of 100 teams, with Source B, a 2026 vendor report covering 12 enterprise customers. Do not reconcile the numbers; expose scope, method, date, and applicability gaps.`
- Inspect: metric/source trail, scope, methodology, uncertainty, conflicts, and the human resolution required.
- Contribute: [ACT-14 / #117](https://github.com/AgentsKit-io/agentskit-registry/issues/117).

### Market Sizing — sensitivity workshop

- Agent: [`research-market-sizing`](research-market-sizing.md)
- Use when: a market estimate needs transparent assumptions instead of a single headline number.
- Synthetic prompt: `Build a sensitivity table for 1,000, 2,500, and 5,000 target accounts with 2%, 5%, and 10% adoption. Keep currency and time period unspecified until the human owner supplies them.`
- Inspect: assumptions, ranges, missing units, sensitivity drivers, and whether the output is clearly an estimate rather than a fact.
- Contribute: [ACT-15 / #118](https://github.com/AgentsKit-io/agentskit-registry/issues/118).

## Human review boundary

AI may help draft prompts, normalize structured outputs, classify gaps, and summarize test runs. A human must verify sources, claims, privacy, permissions, methodology, policy interpretation, and final publication. None of these patterns is a testimonial, benchmark ranking, production guarantee, or customer outcome.

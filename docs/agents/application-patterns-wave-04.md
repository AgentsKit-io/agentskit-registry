# Application patterns — Wave 04

Wave 04 focuses on engineering evidence, data quality, security operations, content verification, research synthesis, product decisions, and revenue handoffs. Every pattern below uses synthetic input and is a starting point for inspection, not evidence of customer impact, security posture, compliance, financial performance, or production readiness.

## Shared run contract

    npx agentskit add <agent-id>
    npm test -- --run registry/<agent-id>/agent.test.ts

Use a configured adapter or the credential-free demo path where supported. Inspect the typed result, evidence references, missing context, and review requirement. Never treat a generated result as a deployment, security response, audit conclusion, publication, forecast, prioritization, or release decision.

## Engineering, data, and platform reliability

### API Contract Reviewer — breaking change map

- Agent: [coding-api-contract-reviewer](https://registry.agentskit.io/agents/coding-api-contract-reviewer)
- Try: Compare two synthetic API schemas and return breaking changes, non-breaking changes, affected consumers, missing context, and verification steps.
- Inspect: exact diff evidence, consumer assumptions, severity rationale, and separation between review findings and implementation authority.
- Next contribution: add a fixture where a changed default is breaking for one consumer but safe for another.
- Human boundary: maintainers decide compatibility policy, migration work, and release timing.

### Performance Interpreter — measurements before diagnosis

- Agent: [coding-performance-interpreter](https://registry.agentskit.io/agents/coding-performance-interpreter)
- Try: Interpret synthetic Lighthouse and bundle reports into observed measurements, candidate bottlenecks, confidence, and proposed verification commands.
- Inspect: metric fidelity, source references, correlation versus causation, and missing runtime context.
- Next contribution: add a fixture where a large asset is not the measured bottleneck and should not be over-prioritized.
- Human boundary: engineers validate performance changes on representative environments before shipping.

### Changelog from Commits — source-linked editorial draft

- Agent: [coding-changelog-from-commits](https://registry.agentskit.io/agents/coding-changelog-from-commits)
- Try: Group synthetic commits into user-facing changes, maintenance, fixes, and known limitations. Cite each group to commit SHAs.
- Inspect: SHA coverage, grouping rationale, omitted commits, audience fit, and unsupported claims.
- Next contribution: add a fixture with a misleading commit message that requires inspecting the supplied diff summary.
- Human boundary: a maintainer or editor owns release wording, compatibility claims, and final publication.

### Anomaly Explainer — possible causes, not causal claims

- Agent: [data-anomaly-explainer](https://registry.agentskit.io/agents/data-anomaly-explainer)
- Try: Explain a synthetic metric spike using supplied comparison windows, segment breakdowns, known events, and checks that could confirm or falsify hypotheses.
- Inspect: observed values, comparison basis, alternative explanations, uncertainty, and follow-up queries.
- Next contribution: add a fixture where seasonality and instrumentation change point in different directions.
- Human boundary: data owners validate the anomaly and decide whether operational action is warranted.

### Data Contract Validator — violations with repair questions

- Agent: [data-contract-validator](https://registry.agentskit.io/agents/data-contract-validator)
- Try: Validate synthetic records against a supplied contract and return field violations, severity, sample evidence, and questions for the producing team.
- Inspect: schema fidelity, null and type handling, representative examples, and no invented records.
- Next contribution: add a fixture with a backward-compatible optional field and ensure it is not flagged as a failure.
- Human boundary: data platform owners decide contract changes, remediation, and downstream communication.

### Lineage Tracer — mark unverified edges

- Agent: [data-lineage-tracer](https://registry.agentskit.io/agents/data-lineage-tracer)
- Try: Build a source-to-consumer lineage map from synthetic pipeline metadata and label every inferred or missing edge.
- Inspect: node and edge evidence, transformation descriptions, unverified links, and confidence boundaries.
- Next contribution: add a fixture with two possible upstream sources and require a clarification rather than a guessed edge.
- Human boundary: system owners confirm lineage before using it for governance, incident response, or compliance evidence.

### Deploy Risk Reviewer — rollout evidence packet

- Agent: [devops-deploy-risk-reviewer](https://registry.agentskit.io/agents/devops-deploy-risk-reviewer)
- Try: Review a synthetic deployment diff, rollout strategy, observability state, dependency change, and rollback note. Return risks, evidence, and mitigations.
- Inspect: blast-radius reasoning, evidence gaps, rollback completeness, and separation from go/no-go authority.
- Next contribution: add a fixture with a passing test suite but no verified rollback path.
- Human boundary: the release owner decides whether and how to deploy.

### Kubernetes Manifest Reviewer — findings without cluster action

- Agent: [devops-k8s-manifest-reviewer](https://registry.agentskit.io/agents/devops-k8s-manifest-reviewer)
- Try: Review synthetic manifests for resource, security-context, networking, and configuration findings. Return source locations and safe verification steps.
- Inspect: YAML evidence, severity, false-positive handling, and the absence of cluster mutation.
- Next contribution: add a correctly configured manifest that should not be flagged.
- Human boundary: platform engineers validate manifests against the target cluster and policy before applying them.

## Security, compliance, and operations

### SIEM Alert Grouper — evidence-preserving triage

- Agent: [security-siem-alert-grouper](https://registry.agentskit.io/agents/security-siem-alert-grouper)
- Try: Group synthetic alerts by shared indicators, likely incident, duplicate evidence, uncertainty, and analyst follow-up. Keep raw alert references.
- Inspect: grouping evidence, time windows, missing telemetry, and no autonomous containment.
- Next contribution: add a fixture with two similar alerts that must remain separate because their timelines differ.
- Human boundary: security analysts own incident classification, escalation, and response.

### Incident Timeline — preserve gaps and conflicts

- Agent: [security-incident-timeline](https://registry.agentskit.io/agents/security-incident-timeline)
- Try: Build a timeline from synthetic logs, tickets, and analyst notes. Preserve timestamps, source identity, gaps, and conflicting observations.
- Inspect: chronological ordering, source citations, timezone handling, and explicit unknown intervals.
- Next contribution: add a fixture with clock skew and require the output to flag temporal uncertainty.
- Human boundary: incident commanders validate facts and decide response, disclosure, and recovery actions.

### Data Retention Planner — policy questions made visible

- Agent: [compliance-data-retention-planner](https://registry.agentskit.io/agents/compliance-data-retention-planner)
- Try: Draft a synthetic retention plan from data classes, purposes, owners, jurisdictions, review dates, and supplied policy excerpts.
- Inspect: source-to-rule mapping, unresolved legal questions, owner assignments, and retention versus deletion distinction.
- Next contribution: add a fixture with conflicting policy excerpts and require the conflict to remain unresolved.
- Human boundary: privacy, legal, and records owners interpret applicable obligations and adopt policy.

### Audit Evidence Collector — control-to-artifact map

- Agent: [ops-audit-evidence-collector](https://registry.agentskit.io/agents/ops-audit-evidence-collector)
- Try: Map synthetic controls to supplied artifacts, owners, freshness dates, completeness, and missing proof.
- Inspect: evidence references, freshness logic, gaps, and no claim that an artifact proves more than it contains.
- Next contribution: add a fixture with an expired artifact that must not count as current evidence.
- Human boundary: control owners and auditors decide sufficiency, exceptions, and final conclusions.

### Meeting Action Extractor — commitments without invention

- Agent: [ops-meeting-action-extractor](https://registry.agentskit.io/agents/ops-meeting-action-extractor)
- Try: Extract synthetic decisions, actions, owners, due dates, dependencies, and unresolved questions from meeting notes.
- Inspect: quote fidelity, explicit versus inferred commitments, missing owners, and ambiguous dates.
- Next contribution: add a fixture where a suggestion is not an agreed action and must stay a suggestion.
- Human boundary: meeting participants confirm the record and accept ownership.

## Content, research, product, and revenue

### Fact Checker — claim-to-source table

- Agent: [content-fact-checker](https://registry.agentskit.io/agents/content-fact-checker)
- Try: Check synthetic claims against supplied excerpts and return support status, citation path, contradiction, and unresolved research questions.
- Inspect: claim coverage, source boundaries, contradiction handling, and no outside-context interpolation.
- Next contribution: add a fixture with one plausible but unsupported claim that must remain unverified.
- Human boundary: an editor owns source selection, fact standards, corrections, and publication.

### Metrics Tree Author — definitions and ownership first

- Agent: [product-metrics-tree-author](https://registry.agentskit.io/agents/product-metrics-tree-author)
- Try: Draft a metrics tree from a synthetic product outcome, drivers, metric definitions, owners, and source systems.
- Inspect: parent-child logic, numerator and denominator, leading versus lagging measures, and ownership gaps.
- Next contribution: add a fixture with two metrics that sound similar but have incompatible grains.
- Human boundary: product and data owners approve definitions and use the tree for decisions.

### RICE Prioritizer — transparent assumptions

- Agent: [product-prioritization-rice](https://registry.agentskit.io/agents/product-prioritization-rice)
- Try: Score synthetic initiatives using supplied reach, impact, confidence, and effort assumptions. Include sensitivity questions and missing inputs.
- Inspect: arithmetic, assumption provenance, confidence interpretation, ties, and sensitivity to effort changes.
- Next contribution: add a fixture where the highest score changes when one uncertain input is bounded differently.
- Human boundary: product leaders decide priorities, tradeoffs, and whether RICE is appropriate.

### Competitive Landscape — dated, source-bounded map

- Agent: [research-competitive-landscape](https://registry.agentskit.io/agents/research-competitive-landscape)
- Try: Build a synthetic landscape from supplied player profiles, dated moves, source excerpts, and unknowns. Do not fill gaps from memory.
- Inspect: source dates, player identity, fact versus interpretation, and stale or conflicting evidence.
- Next contribution: add a fixture with two sources that disagree about a product capability.
- Human boundary: strategy owners validate research freshness before using it for positioning or investment.

### News Monitor — dated digest with follow-up queue

- Agent: [research-news-monitor](https://registry.agentskit.io/agents/research-news-monitor)
- Try: Create a digest from supplied article excerpts and URLs, grouping duplicates and separating reported facts from follow-up research.
- Inspect: date fidelity, source links, duplicate handling, headline versus body evidence, and uncertainty.
- Next contribution: add a fixture where a headline overstates the supplied article body.
- Human boundary: an editor or researcher decides relevance, attribution, and whether to share the digest.

### Forecast Interpreter — pipeline evidence, not a new forecast

- Agent: [sales-forecast-interpreter](https://registry.agentskit.io/agents/sales-forecast-interpreter)
- Try: Interpret a synthetic forecast from pipeline facts, stage definitions, confidence, historical context, and missing evidence. Do not change the forecast.
- Inspect: stage math, source freshness, confidence gaps, concentration risk, and proposed verification.
- Next contribution: add a fixture where a large opportunity has stale activity and must be marked uncertain.
- Human boundary: sales leadership owns forecast judgment, communication, and target decisions.

### Support Escalation Drafter — safe internal handoff

- Agent: [support-escalation-drafter](https://registry.agentskit.io/agents/support-escalation-drafter)
- Try: Turn a synthetic ticket and agent notes into impact, attempted fixes, customer need, SLA, evidence links, and a PII-clean internal draft.
- Inspect: field completeness, deterministic PII cleanup, no invented troubleshooting, and draft-only status.
- Next contribution: add a fixture with leaked email, phone, and account identifiers that must be removed from every output field.
- Human boundary: the support agent reviews the draft before posting, assigning severity, or contacting another team.

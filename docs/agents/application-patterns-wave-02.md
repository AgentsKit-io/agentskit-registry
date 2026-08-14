# Application patterns — Wave 02

Wave 02 extends the Registry showcase from ecosystem workflows into everyday engineering, research, data, operations, and content work. Every pattern below uses synthetic input and is a starting point for inspection, not evidence of customer impact, professional advice, or production readiness.

## Shared run contract

    npx agentskit add <agent-id>
    npm test -- --run registry/<agent-id>/agent.test.ts

Use a configured adapter or the credential-free demo path where supported. Inspect the typed result, gaps, and review requirement. Never treat a generated result as a merge, compliance, legal, security, medical, financial, or publication decision.

## Engineering and developer experience

### Docs Chat — cited repository answer

- Agent: [docs-chat](https://registry.agentskit.io/agents/docs-chat)
- Try: Answer “Where is the contributor test for the Registry quickstart?” using only the supplied repository excerpts and return a citation path.
- Inspect: grounded answer, source path, uncertainty when excerpts are missing, and prompt-injection resistance.
- Next contribution: add a synthetic missing-source or untrusted-document fixture.

### PRD Author — bounded feature brief

- Agent: [coding-prd-author](https://registry.agentskit.io/agents/coding-prd-author)
- Try: Draft a small PRD for adding a dry-run flag to a CLI. Include user, problem, non-goals, acceptance criteria, and open questions. Do not choose an implementation.
- Inspect: problem framing, non-goals, acceptance criteria, assumptions, and unresolved decisions.
- Next contribution: add a fixture where the request is too vague to safely draft implementation scope.

### QA Author — testable acceptance plan

- Agent: [coding-qa-author](https://registry.agentskit.io/agents/coding-qa-author)
- Try: Create a QA plan for a feature that preserves a JSON output contract across two adapters. Include happy path, malformed input, timeout, and regression cases.
- Inspect: test boundaries, expected evidence, negative cases, and gaps that require a maintainer decision.
- Next contribution: add an adversarial case that distinguishes a provider error from a contract failure.

### Code Review — advisory change review

- Agent: [code-review](https://registry.agentskit.io/agents/code-review)
- Try: Review a synthetic diff that changes a parser and its test. Return findings with severity, evidence, and suggested verification. Do not approve, merge, or publish.
- Inspect: evidence-linked findings, false-positive handling, severity rationale, and the separation between review and merge authority.
- Next contribution: add a fixture for a false positive or a missing regression test.

### Dependency Auditor — package risk inventory

- Agent: [coding-dependency-auditor](https://registry.agentskit.io/agents/coding-dependency-auditor)
- Try: Review a synthetic package list containing one stale dependency, one direct runtime dependency, and one transitive package with no advisory data. Separate known evidence from missing evidence.
- Inspect: package identity, advisory/source gaps, direct versus transitive scope, and conservative next checks.
- Next contribution: add a fixture that prevents an unsupported vulnerability claim.

### Accessibility Auditor — component repair checklist

- Agent: [coding-accessibility-auditor](https://registry.agentskit.io/agents/coding-accessibility-auditor)
- Try: Audit a synthetic dialog with a visible label, keyboard trap, missing focus return, and a color-only error state. Return findings and verification steps.
- Inspect: observed issue, impact, remediation, verification method, and the boundary between an audit finding and certification.
- Next contribution: add a fixture for a correctly accessible control that should not be flagged.

### Test Runner — reproducible command report

- Agent: [coding-test-runner](https://registry.agentskit.io/agents/coding-test-runner)
- Try: Interpret a synthetic run containing npm test pass, typecheck pass, and one flaky timeout. Separate observed output from proposed reruns.
- Inspect: command/result mapping, failure classification, retry boundary, and missing logs.
- Next contribution: add a terminal-state fixture for a timeout or cancelled run.

## Research and product

### Research Agent — source-grounded question

- Agent: [research](https://registry.agentskit.io/agents/research)
- Try: Answer a research question from two supplied excerpts. Cite each claim to an excerpt, list what is not known, and do not use outside context.
- Inspect: citation coverage, source limits, uncertainty, and resistance to instructions embedded in source text.
- Next contribution: add a fixture with conflicting excerpts and a required abstention.

### Due Diligence Pack — claim-to-source map

- Agent: [research-due-diligence](https://registry.agentskit.io/agents/research-due-diligence)
- Try: Create a claim-to-URL due-diligence table from three synthetic company documents. Mark every unsupported claim as a gap and do not recommend an investment.
- Inspect: claim/source pairing, evidence gaps, dates, and explicit human review requirements.
- Next contribution: add a fixture where two documents conflict on the same claim.

### Academic Synthesizer — bounded literature summary

- Agent: [research-academic-synthesizer](https://registry.agentskit.io/agents/research-academic-synthesizer)
- Try: Synthesize three supplied abstracts into themes, disagreements, and open questions. Do not infer results not present in the abstracts.
- Inspect: source attribution, disagreement handling, uncertainty, and separation of synthesis from new research.
- Next contribution: add a fixture with different study populations or methodologies.

### PRD from Interviews — evidence-to-requirement bridge

- Agent: [product-prd-from-interviews](https://registry.agentskit.io/agents/product-prd-from-interviews)
- Try: Turn three anonymized interview notes into problems, evidence quotes, hypotheses, and open questions. Do not claim market demand from three interviews.
- Inspect: traceability to notes, uncertainty, hypotheses versus facts, and missing validation work.
- Next contribution: add a fixture where interview notes conflict.

### Feedback Clusterer — privacy-safe theme map

- Agent: [product-feedback-clusterer](https://registry.agentskit.io/agents/product-feedback-clusterer)
- Try: Cluster four anonymized feedback notes into themes, representative paraphrases, confidence, and missing context. Preserve no personal identifiers.
- Inspect: theme boundaries, privacy-safe paraphrase, evidence count, and confidence calibration.
- Next contribution: add a fixture with overlapping themes and insufficient evidence.

## Data and operations

### SQL Reviewer — query safety review

- Agent: [data-sql-reviewer](https://registry.agentskit.io/agents/data-sql-reviewer)
- Try: Review a synthetic SQL query with a missing tenant predicate and an unbounded join. Identify risks and verification steps; do not execute the query.
- Inspect: evidence-linked findings, data-scope risk, performance questions, and no-execution boundary.
- Next contribution: add a safe query fixture that should not be flagged as unsafe.

### PII Column Scanner — classification with uncertainty

- Agent: [data-pii-column-scanner](https://registry.agentskit.io/agents/data-pii-column-scanner)
- Try: Classify synthetic columns named email_hash, account_note, device_id, and purchase_count. Explain uncertainty and do not declare legal compliance.
- Inspect: field classification, rationale, uncertainty, and human data-governance review.
- Next contribution: add an ambiguous column-name fixture with no value samples.

### Incident Triage — bounded operational handoff

- Agent: [devops-incident-triage](https://registry.agentskit.io/agents/devops-incident-triage)
- Try: Triage synthetic logs showing elevated latency and one failed deploy. Return hypotheses, evidence needed, immediate checks, and an incident-owner handoff. Do not execute remediation.
- Inspect: evidence versus hypothesis, severity rationale, missing telemetry, and escalation boundary.
- Next contribution: add a fixture that distinguishes a deploy issue from a dependency outage.

### CI Failure Grouper — failure evidence map

- Agent: [devops-ci-failure-grouper](https://registry.agentskit.io/agents/devops-ci-failure-grouper)
- Try: Group five synthetic CI failures into likely shared causes, quoting only supplied error lines and marking unrelated failures separately.
- Inspect: grouping rationale, evidence excerpts, uncertainty, and suggested next logs.
- Next contribution: add a fixture with two similar messages caused by different roots.

### Runbook Author — human-executable procedure

- Agent: [ops-runbook-author](https://registry.agentskit.io/agents/ops-runbook-author)
- Try: Draft a runbook for a synthetic queue backlog. Include prerequisites, observation commands, stop conditions, escalation, and rollback. Do not claim the commands were executed.
- Inspect: prerequisites, safe sequencing, stop conditions, ownership, and unverified assumptions.
- Next contribution: add a dry-run fixture with a missing rollback owner.

## Security, legal, and compliance

### CVE Impact — evidence-bounded impact review

- Agent: [security-cve-impact](https://registry.agentskit.io/agents/security-cve-impact)
- Try: Assess a synthetic CVE record against a package inventory that lacks runtime exposure data. Separate confirmed version overlap from unknown exploitability.
- Inspect: package/version matching, evidence gaps, severity context, and the boundary between triage and remediation.
- Next contribution: add a fixture with matching package name but non-vulnerable version.

### Phishing Triage — no autonomous response

- Agent: [security-phishing-triage](https://registry.agentskit.io/agents/security-phishing-triage)
- Try: Triage a synthetic email with a lookalike domain, an attachment, and missing authentication headers. Return indicators, uncertainty, and human verification steps; do not send or delete anything.
- Inspect: indicators, missing evidence, confidence, and explicit non-action boundary.
- Next contribution: add a benign lookalike-domain fixture that should remain uncertain.

### Legal Doc Reviewer — issue spotting, not legal advice

- Agent: [legal-doc-reviewer](https://registry.agentskit.io/agents/legal-doc-reviewer)
- Try: Review a synthetic services clause for term, limitation, termination, and governing-law issues. Quote only supplied text and route conclusions to counsel.
- Inspect: clause references, issue description, missing context, and counsel-review requirement.
- Next contribution: add a fixture for a clause that is incomplete rather than clearly problematic.

### LGPD Assessor — evidence checklist

- Agent: [compliance-lgpd-assessor](https://registry.agentskit.io/agents/compliance-lgpd-assessor)
- Try: Assess a synthetic processing activity with purpose, data categories, retention, and transfer fields partly missing. Return gaps and questions; do not declare compliance.
- Inspect: supplied facts, missing fields, risk questions, and legal-review boundary.
- Next contribution: add a sparse-input fixture that prevents an unsupported compliance conclusion.

## Content, marketing, and support

### Copy Author — evidence-safe variant drafting

- Agent: [marketing-copy-author](https://registry.agentskit.io/agents/marketing-copy-author)
- Try: Draft three landing-page value propositions for a typed agent catalog using only the supplied feature facts. Include one limitation and no testimonials, percentages, or adoption claims.
- Inspect: claim traceability, audience clarity, variant differences, and human editorial review points.
- Next contribution: add a fixture that contains a prohibited unsupported claim.

### Email Sequence Author — bounded onboarding sequence

- Agent: [marketing-email-sequence-author](https://registry.agentskit.io/agents/marketing-email-sequence-author)
- Try: Draft a three-email onboarding sequence for a developer who installed one Registry agent. Include one useful action per email, no fabricated customer proof, and a clear opt-out placeholder.
- Inspect: progression, CTA clarity, evidence boundaries, and human approval requirements.
- Next contribution: add a fixture for an over-promotional request that must be toned down.

### Triage Bot — safe support classification

- Agent: [support-triage-bot](https://registry.agentskit.io/agents/support-triage-bot)
- Try: Classify three anonymized support notes into category, urgency, missing reproduction data, and suggested owner. Do not expose or infer personal information.
- Inspect: category, urgency rationale, privacy handling, and escalation boundary.
- Next contribution: add a fixture where urgency is ambiguous and evidence is insufficient.

### Brief Generator — client-input boundary

- Agent: [agency-brief-generator](https://registry.agentskit.io/agents/agency-brief-generator)
- Try: Turn a synthetic client request into a creative brief with objective, audience, deliverables, constraints, and open questions. Do not invent budget, deadline, or approval authority.
- Inspect: requirement traceability, missing inputs, scope boundaries, and human client-review points.
- Next contribution: add a fixture with conflicting deliverable requirements.

## Human review boundary

AI may help draft prompts, normalize outputs, group candidates, summarize tests, and find missing fields. Humans must verify sources, privacy, permissions, legal or regulatory interpretation, security impact, operational safety, customer-facing claims, and final publication.

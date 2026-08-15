# Application patterns — Wave 06

Wave 06 adds practical workflows for agency operations, clinical drafting, privacy, content, data, infrastructure, education, commerce, finance, people, insurance, legal review, operations, product, research, and security. Every pattern below uses synthetic input and is a starting point for inspection, not evidence of customer impact, professional advice, regulatory compliance, or production readiness.

## Shared run contract

    npx agentskit add <agent-id>
    npm test -- --run registry/<agent-id>/agent.test.ts

Use a configured adapter or the credential-free demo path where supported. Inspect the typed result, source evidence, missing context, and review requirement. Never treat a generated result as an external communication, clinical record, employment decision, financial action, legal conclusion, security response, or production change.

## Agency, clinical, and privacy workflows

### Scope Creep Detector — compare work with the SOW

- Agent: [agency-scope-creep-detector](https://registry.agentskit.io/agents/agency-scope-creep-detector)
- Try: Compare a synthetic statement of work with requested tasks and flag possible additions, exclusions, ambiguities, and evidence.
- Inspect: exact SOW references, distinction between clarification and scope change, and missing approval context.
- Next contribution: add a fixture where a requested deliverable is described with different wording but is still in scope.
- Human boundary: the delivery owner and client decide interpretation, change control, pricing, and communication.

### Patient Summary — pre-visit draft with chart gaps

- Agent: [clinical-patient-summary](https://registry.agentskit.io/agents/clinical-patient-summary)
- Try: Draft a synthetic one-page pre-visit summary from chart excerpts, preserving missing values as unknown.
- Inspect: cited chart facts, active-problem limits, medication and allergy fidelity, open questions, and the required clinician sign-off.
- Next contribution: add a fixture where two chart excerpts conflict and the summary must preserve both positions.
- Human boundary: a clinician validates the summary and decides what belongs in the clinical record or care plan.

### Adverse Event Reporter — structured report draft

- Agent: [clinical-adverse-event-reporter](https://registry.agentskit.io/agents/clinical-adverse-event-reporter)
- Try: Convert a synthetic event narrative into a typed report draft with observed facts, missing fields, and follow-up questions.
- Inspect: chronology, evidence fidelity, uncertainty, and whether the output stays draft-only.
- Next contribution: add a fixture with an uncertain date and require a clarification instead of an invented timestamp.
- Human boundary: qualified clinical and safety staff review classification, reporting obligations, and final submission.

### Medication Reconciliation — differences to review

- Agent: [clinical-medication-reconciliation](https://registry.agentskit.io/agents/clinical-medication-reconciliation)
- Try: Compare synthetic medication lists and surface additions, omissions, duplicates, dose conflicts, and missing confirmation.
- Inspect: list provenance, exact differences, ambiguity, and no automatic medication change.
- Next contribution: add a fixture with the same medication under two formulations and require a pharmacist question.
- Human boundary: a clinician or pharmacist confirms the medication list and makes every prescribing decision.

### LGPD Assessor — map controls to supplied evidence

- Agent: [compliance-lgpd-assessor](https://registry.agentskit.io/agents/compliance-lgpd-assessor)
- Try: Assess synthetic processing activities against supplied LGPD controls, evidence, owners, and unresolved questions.
- Inspect: source-to-control mapping, data-subject context, missing evidence, and cautious language around legal interpretation.
- Next contribution: add a fixture where the same processing activity has different purposes and retention periods.
- Human boundary: privacy and legal owners interpret LGPD obligations and approve remediation.

## Content and data workflows

### Newsletter Author — source-bounded editorial draft

- Agent: [content-newsletter-author](https://registry.agentskit.io/agents/content-newsletter-author)
- Try: Draft a synthetic newsletter from supplied source notes, audience, tone, links, and call-to-action constraints.
- Inspect: claim coverage, source boundaries, attribution, audience fit, and marked editorial gaps.
- Next contribution: add a fixture with one source caveat that must survive every section of the draft.
- Human boundary: a human editor owns claims, rights, accessibility, tone, and final publication.

### Data Governance Classifier — label with evidence and abstention

- Agent: [data-governance-classifier](https://registry.agentskit.io/agents/data-governance-classifier)
- Try: Classify synthetic data fields against supplied sensitivity, purpose, retention, and ownership rules.
- Inspect: rule citations, ambiguous fields, confidence, missing metadata, and safe abstention.
- Next contribution: add a fixture where a field name is misleading and the classifier must request context.
- Human boundary: data governance owners approve labels, access policy, retention, and downstream use.

### Data Quality Rule Author — executable checks from a contract

- Agent: [data-quality-rule-author](https://registry.agentskit.io/agents/data-quality-rule-author)
- Try: Draft typed quality rules from a synthetic data contract, examples, null policy, and freshness requirement.
- Inspect: field coverage, rule precision, assumptions, severity, and whether every rule can be verified independently.
- Next contribution: add a fixture where an optional field must not become a blocking rule.
- Human boundary: data owners approve the contract, thresholds, failure policy, and production rollout.

### Secrets Leak Scanner — findings without mutation

- Agent: [devops-secrets-leak-scanner](https://registry.agentskit.io/agents/devops-secrets-leak-scanner)
- Try: Review synthetic repository snippets for credential-like material and return locations, confidence, and safe next checks.
- Inspect: deterministic patterns, false positives, redaction of matched values, and no deletion or rotation action.
- Next contribution: add fixtures for placeholders, test keys, and split strings that must be handled differently.
- Human boundary: security owners validate findings and perform rotation, revocation, or remediation.

## Education, commerce, finance, and people

### IEP Drafter — structured plan for educator review

- Agent: [education-iep-drafter](https://registry.agentskit.io/agents/education-iep-drafter)
- Try: Draft a synthetic individualized education plan from supplied goals, observations, accommodations, measures, and review dates.
- Inspect: objective alignment, measurable language, missing evidence, accessibility, and editable assumptions.
- Next contribution: add a fixture with incompatible goals and time constraints that must produce questions.
- Human boundary: qualified educators and support professionals approve the plan and safeguarding decisions.

### Inventory Reorder — recommendations under policy constraints

- Agent: [ecommerce-inventory-reorder](https://registry.agentskit.io/agents/ecommerce-inventory-reorder)
- Try: Evaluate synthetic stock, demand, lead time, safety stock, and supplier constraints to draft reorder options.
- Inspect: arithmetic inputs, units, stale data, uncertainty, and no automatic purchase order.
- Next contribution: add a fixture with a supplier outage and require an exception path rather than a normal reorder.
- Human boundary: inventory owners choose quantities, suppliers, timing, and any purchase action.

### Transaction Investigator — case file, not enforcement

- Agent: [fintech-transaction-investigator](https://registry.agentskit.io/agents/fintech-transaction-investigator)
- Try: Analyze synthetic transaction history in fraud or AML mode and return findings, cited transaction IDs, gaps, and follow-up checks.
- Inspect: evidence locations, severity, insufficient-evidence behavior, and the always-human-review flag.
- Next contribution: add a fixture where a legitimate recurring pattern resembles an anomaly and must remain uncertain.
- Human boundary: compliance investigators decide escalation, account action, and any regulatory filing.

### Resume Screener — structured evidence with fairness review

- Agent: [hr-resume-screener](https://registry.agentskit.io/agents/hr-resume-screener)
- Try: Compare synthetic resumes against explicit role requirements and return evidence, gaps, and questions without inventing experience.
- Inspect: requirement matching, missing information, proxy-risk flags, and separation from a hiring recommendation.
- Next contribution: add a fixture where two equivalent qualifications use different wording and must receive comparable treatment.
- Human boundary: hiring teams own fair-process review, accommodations, interviews, and employment decisions.

### Policy Summarizer — clauses and exclusions made visible

- Agent: [insurance-policy-summarizer](https://registry.agentskit.io/agents/insurance-policy-summarizer)
- Try: Summarize synthetic policy excerpts into coverage terms, exclusions, conditions, dates, and questions with source references.
- Inspect: clause fidelity, missing sections, defined terms, and distinction between summary and coverage interpretation.
- Next contribution: add a fixture where an endorsement changes the meaning of a base-policy exclusion.
- Human boundary: an authorized or licensed professional interprets coverage and advises on a real claim.

## Legal, operations, product, research, and security

### Case Summarizer — cited matter draft with conflicts

- Agent: [legal-case-summariser](https://registry.agentskit.io/agents/legal-case-summariser)
- Try: Summarize synthetic reviewed documents and reviewer notes into cited facts, procedural posture, open issues, and preserved conflicts.
- Inspect: citation coverage, competing positions, neutral language, and the required attorney-review flag.
- Next contribution: add a fixture where two notes disagree about a material fact and must remain unresolved.
- Human boundary: attorneys decide legal significance, strategy, privilege, and any filing or client communication.

### Incident Commander Aide — status packet under pressure

- Agent: [ops-incident-commander-aide](https://registry.agentskit.io/agents/ops-incident-commander-aide)
- Try: Turn synthetic incident notes into current impact, timeline, hypotheses, owners, next checks, and explicit unknowns.
- Inspect: timestamp fidelity, facts versus hypotheses, missing owners, and no autonomous remediation.
- Next contribution: add a fixture with conflicting timestamps and require a visible uncertainty marker.
- Human boundary: the incident commander validates status, assigns work, communicates externally, and approves recovery actions.

### Beta Feedback Triage — themes without overgeneralizing

- Agent: [product-beta-feedback-triage](https://registry.agentskit.io/agents/product-beta-feedback-triage)
- Try: Cluster synthetic beta feedback into themes, severity, affected journeys, representative evidence, and follow-up questions.
- Inspect: quote fidelity, minority viewpoints, duplicate handling, sample size, and uncertainty.
- Next contribution: add a fixture where one vivid report must not become a product-wide conclusion.
- Human boundary: product and research owners decide prioritization, outreach, roadmap changes, and release claims.

### Vendor Evaluation — scorecard with methodology limits

- Agent: [research-vendor-evaluation](https://registry.agentskit.io/agents/research-vendor-evaluation)
- Try: Compare synthetic vendor responses against supplied criteria, evidence, weights, risks, and unanswered questions.
- Inspect: criterion coverage, score arithmetic, source traceability, missing evidence, and sensitivity to weights.
- Next contribution: add a fixture where two vendors tie and the output must explain what additional evidence would separate them.
- Human boundary: procurement, security, legal, and business owners choose vendors and negotiate terms.

### Proposal Drafter — source-bounded commercial draft

- Agent: [sales-proposal-drafter](https://registry.agentskit.io/agents/sales-proposal-drafter)
- Try: Draft a synthetic proposal from supplied goals, scope, deliverables, assumptions, timeline, and proof points.
- Inspect: requirement coverage, unsupported promises, pricing gaps, dependencies, and explicit approval points.
- Next contribution: add a fixture where the requested timeline conflicts with supplied capacity and must remain a risk.
- Human boundary: the account and delivery owners approve scope, pricing, commitments, and any external communication.

### Phishing Triage — classify and route, never click

- Agent: [security-phishing-triage](https://registry.agentskit.io/agents/security-phishing-triage)
- Try: Review synthetic message metadata and body text for indicators, confidence, evidence, and safe analyst follow-up.
- Inspect: source indicators, suspicious-link handling, uncertainty, and the absence of link opening or mailbox mutation.
- Next contribution: add fixtures for a legitimate internal simulation and an ambiguous vendor message.
- Human boundary: security analysts validate the report and decide containment, notification, and investigation.

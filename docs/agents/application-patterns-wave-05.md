# Application patterns — Wave 05

Wave 05 adds practical content, commerce, education, finance, people, insurance, legal, productivity, and security workflows. Every pattern below uses synthetic input and is a starting point for inspection, not evidence of customer impact, professional advice, fraud detection accuracy, policy compliance, or production readiness.

## Shared run contract

    npx agentskit add <agent-id>
    npm test -- --run registry/<agent-id>/agent.test.ts

Use a configured adapter or the credential-free demo path where supported. Inspect the typed result, source evidence, missing context, and review requirement. Never treat a generated result as a financial, insurance, employment, legal, educational, security, scheduling, or customer-communication decision.

## Content, commerce, and education

### Blog Outline — evidence slots before prose

- Agent: [content-blog-outline](https://registry.agentskit.io/agents/content-blog-outline)
- Try: Outline a synthetic article from audience, thesis, supplied sources, counterpoints, and a desired call to action. Mark every evidence slot.
- Inspect: structure, audience fit, source boundaries, unanswered questions, and unsupported claims.
- Next contribution: add a fixture where the thesis conflicts with one supplied source and require a clarification section.
- Human boundary: an editor owns research, claims, tone, rights, accessibility, and final publication.

### Translation Localizer — preserve meaning and placeholders

- Agent: [content-translation-localizer](https://registry.agentskit.io/agents/content-translation-localizer)
- Try: Localize synthetic product copy into a supplied locale while preserving placeholders, units, terminology, links, and unresolved cultural notes.
- Inspect: placeholder integrity, meaning preservation, glossary consistency, locale assumptions, and human review flags.
- Next contribution: add a fixture with gendered wording, pluralization, and a non-translatable product name.
- Human boundary: a qualified language reviewer validates nuance, legal wording, accessibility, and market suitability.

### Style Guide Enforcer — findings, not forced rewrites

- Agent: [content-style-guide-enforcer](https://registry.agentskit.io/agents/content-style-guide-enforcer)
- Try: Check synthetic copy against supplied style rules and return findings, examples, severity, and optional edit suggestions.
- Inspect: rule citations, false positives, inconsistent rule application, and the distinction between finding and rewrite.
- Next contribution: add a fixture where an intentional exception is documented and must not be flagged as a violation.
- Human boundary: editors decide whether a style rule applies and approve the final wording.

### Fraud Order Scorer — signals with manual review

- Agent: [ecommerce-fraud-order-scorer](https://registry.agentskit.io/agents/ecommerce-fraud-order-scorer)
- Try: Summarize synthetic order-risk signals such as address mismatch, velocity, payment history, and device change. Return evidence and questions.
- Inspect: signal provenance, uncertainty, disparate-impact risk, duplicate evidence, and manual review routing.
- Next contribution: add a fixture where one weak signal must not become a high-confidence conclusion.
- Human boundary: fraud specialists decide investigation, customer contact, and any order action.

### Fulfillment SLA Monitor — timestamps before alerts

- Agent: [ecommerce-fulfillment-sla-monitor](https://registry.agentskit.io/agents/ecommerce-fulfillment-sla-monitor)
- Try: Evaluate synthetic order timestamps against supplied SLA windows, exceptions, holidays, and missing events.
- Inspect: timezone handling, policy evidence, incomplete timelines, breach classification, and alert rationale.
- Next contribution: add a fixture with a daylight-saving transition and an absent carrier scan.
- Human boundary: operations owners confirm the breach and decide escalation or customer communication.

### Catalog Enricher — unknowns stay unknown

- Agent: [ecommerce-catalog-enricher](https://registry.agentskit.io/agents/ecommerce-catalog-enricher)
- Try: Draft missing catalog attributes from supplied product facts, manufacturer text, and taxonomy rules. Mark inferred and absent fields.
- Inspect: source traceability, taxonomy fit, unsupported attributes, prohibited claims, and review queue.
- Next contribution: add a fixture where two source descriptions conflict on a product specification.
- Human boundary: merchandising and compliance owners validate attributes, claims, and listing publication.

### Accommodation Evaluator — organize evidence and options

- Agent: [education-accommodation-evaluator](https://registry.agentskit.io/agents/education-accommodation-evaluator)
- Try: Organize a synthetic accommodation request into stated needs, supplied evidence, possible options, constraints, and questions for the support team.
- Inspect: evidence fidelity, missing context, dignity-preserving language, and no automatic eligibility conclusion.
- Next contribution: add a fixture with insufficient evidence where the output must request a human conversation.
- Human boundary: qualified education staff and the learner’s support team make accommodation decisions.

### Parent Communication — clear draft from verified facts

- Agent: [education-parent-communication](https://registry.agentskit.io/agents/education-parent-communication)
- Try: Draft a synthetic parent message from supplied facts, audience, tone, next steps, dates, and privacy constraints.
- Inspect: factual fidelity, tone, accessibility, sensitive-data handling, and clear human edit points.
- Next contribution: add a fixture with an uncertain incident detail that must be excluded or marked for confirmation.
- Human boundary: educators review the message, safeguarding implications, and recipient context before sending.

## Finance, people, insurance, and legal review

### Invoice Fraud Detector — investigation queue, not verdict

- Agent: [fintech-invoice-fraud-detector](https://registry.agentskit.io/agents/fintech-invoice-fraud-detector)
- Try: Analyze synthetic invoices for duplicate amounts, vendor changes, unusual timing, and supplied approval history. Return evidence and follow-up checks.
- Inspect: signal evidence, false-positive handling, missing context, and no automatic payment block.
- Next contribution: add a fixture where a legitimate recurring invoice resembles a duplicate.
- Human boundary: finance and fraud owners investigate and decide payment handling.

### Regulatory Change Impact — map excerpts to owners

- Agent: [fintech-regulatory-change-impact](https://registry.agentskit.io/agents/fintech-regulatory-change-impact)
- Try: Map supplied regulatory excerpts to affected processes, controls, owners, dates, and unresolved interpretation questions.
- Inspect: source citations, effective-date handling, impact assumptions, and conflicts between excerpts.
- Next contribution: add a fixture with a proposed rule and a final rule that differ in scope.
- Human boundary: qualified legal and compliance professionals interpret obligations and choose remediation.

### Benefits FAQ — source-grounded employee answer

- Agent: [hr-benefits-faq-bot](https://registry.agentskit.io/agents/hr-benefits-faq-bot)
- Try: Answer synthetic benefits questions using only supplied plan excerpts, cite the relevant section, and route unknowns to HR.
- Inspect: citation coverage, plan-year context, uncertainty, privacy, and no personalized eligibility conclusion.
- Next contribution: add a fixture with two plans and require the answer to ask which plan applies.
- Human boundary: HR or the benefits administrator confirms plan interpretation and employee-specific guidance.

### Compensation Benchmark — scope before comparison

- Agent: [hr-compensation-benchmark](https://registry.agentskit.io/agents/hr-compensation-benchmark)
- Try: Compare supplied compensation data by role, geography, level, date, sample, and methodology. Keep incompatible scopes separate.
- Inspect: units, time period, population, missing variables, and unsupported market claims.
- Next contribution: add a fixture where a small sample must be labeled exploratory rather than representative.
- Human boundary: compensation owners decide pay strategy, equity, and employee communication.

### Coverage Gap — policy terms and questions

- Agent: [insurance-coverage-gap](https://registry.agentskit.io/agents/insurance-coverage-gap)
- Try: Compare synthetic needs and supplied policy terms to surface possible gaps, exclusions, missing facts, and questions for an authorized reviewer.
- Inspect: clause evidence, assumptions, exclusions, uncertainty, and distinction between a question and a coverage conclusion.
- Next contribution: add a fixture where a missing endorsement changes the open question.
- Human boundary: a licensed or authorized professional interprets coverage and advises the policyholder.

### Denial Letter Drafter — evidence-linked draft

- Agent: [insurance-denial-letter-drafter](https://registry.agentskit.io/agents/insurance-denial-letter-drafter)
- Try: Draft a synthetic denial-letter outline from supplied policy language, claim facts, reasons, appeal route, dates, and required review points.
- Inspect: evidence citations, respectful language, appeal information, missing facts, and no invented legal basis.
- Next contribution: add a fixture with conflicting claim facts that must produce a review question instead of a definitive paragraph.
- Human boundary: authorized claims and legal reviewers approve the decision and final communication.

### Obligation Tracker — contract commitments with owners

- Agent: [legal-obligation-tracker](https://registry.agentskit.io/agents/legal-obligation-tracker)
- Try: Extract obligations, owners, dates, dependencies, notice requirements, and missing clauses from a synthetic contract with clause citations.
- Inspect: exact source locations, party attribution, date ambiguity, dependencies, and no invented obligations.
- Next contribution: add a fixture where one obligation is conditional on an event described elsewhere in the contract.
- Human boundary: legal and business owners interpret obligations and manage performance.

### eDiscovery Privilege Log — structured draft for counsel

- Agent: [legal-ediscovery-privilege-log](https://registry.agentskit.io/agents/legal-ediscovery-privilege-log)
- Try: Organize synthetic document metadata into a privilege-log draft with document IDs, dates, authors, recipients, basis fields, and missing information.
- Inspect: metadata fidelity, privilege-basis uncertainty, redaction boundaries, and attorney review queue.
- Next contribution: add a fixture with mixed business and legal recipients that requires cautious classification.
- Human boundary: attorneys decide privilege, responsiveness, redactions, and production.

## Productivity and security

### Email Triage — classify without sending or deleting

- Agent: [productivity-email-triage](https://registry.agentskit.io/agents/productivity-email-triage)
- Try: Classify synthetic emails by topic, urgency, requested action, sensitivity, and suggested folder. Do not send, archive, or delete.
- Inspect: classification evidence, action ambiguity, sensitive-content handling, and safe abstention.
- Next contribution: add a fixture where an urgent-looking message is a simulated test and must not trigger an external action.
- Human boundary: the user reviews categories and performs any mailbox action.

### Calendar Conflict Resolver — options under constraints

- Agent: [productivity-calendar-conflict-resolver](https://registry.agentskit.io/agents/productivity-calendar-conflict-resolver)
- Try: Suggest synthetic scheduling options from time zones, attendee constraints, priorities, and duration. Do not change a calendar.
- Inspect: timezone math, constraint preservation, trade-offs, and missing attendee preferences.
- Next contribution: add a fixture with a daylight-saving transition and one unavailable organizer.
- Human boundary: the organizer selects an option and sends or changes invitations.

### Access Review — evidence before remediation

- Agent: [security-access-review](https://registry.agentskit.io/agents/security-access-review)
- Try: Review supplied synthetic access records against role expectations and return anomalies, evidence, uncertainty, and human follow-up.
- Inspect: identity and role mapping, stale-access evidence, least-privilege assumptions, and no automatic revocation.
- Next contribution: add an eval that rejects authority language and requires a draft-only review result.
- Human boundary: system owners confirm access needs and perform any revocation or remediation.

### Pentest Finding Triage — group evidence, preserve severity questions

- Agent: [security-pentest-finding-triage](https://registry.agentskit.io/agents/security-pentest-finding-triage)
- Try: Group synthetic penetration-test findings by evidence, duplicate signal, affected surface, severity questions, and remediation owner.
- Inspect: source references, duplicate handling, exploitability uncertainty, and no autonomous fix or disclosure.
- Next contribution: add a fixture where two findings share a symptom but affect different assets.
- Human boundary: security owners validate findings, prioritize remediation, and decide disclosure.

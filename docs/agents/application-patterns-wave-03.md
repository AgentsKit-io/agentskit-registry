# Application patterns — Wave 03

Wave 03 expands the Registry showcase into domain workflows that benefit from structured outputs, explicit evidence gaps, and a human decision boundary. Every pattern below uses synthetic input and is a starting point for inspection, not evidence of customer impact, professional advice, compliance, safety, or production readiness.

## Shared run contract

    npx agentskit add <agent-id>
    npm test -- --run registry/<agent-id>/agent.test.ts

Use a configured adapter or the credential-free demo path where supported. Inspect the typed result, missing evidence, and review requirement. Never treat a generated result as a clinical, financial, legal, insurance, employment, education, sales, purchase, coverage, eligibility, or go/no-go decision.

## Health, finance, and regulated review

### Chart Redactor — deterministic PHI backstop

- Agent: [clinical-chart-redactor](https://registry.agentskit.io/agents/clinical-chart-redactor)
- Try: Redact a synthetic chart containing an email, phone number, MRN, DOB, and clinical findings. Keep findings intact and report the identifiers removed.
- Inspect: deterministic second-pass redaction, preserved clinical content, structured output, and uncertainty about identifiers outside the configured rules.
- Next contribution: add a synthetic identifier fixture that the model misses but the deterministic scanner must remove.
- Human boundary: validate de-identification rules, privacy obligations, and clinical use before handling real records.

### Intake Triage — red flags cannot be downgraded

- Agent: [clinical-intake-triage](https://registry.agentskit.io/agents/clinical-intake-triage)
- Try: Classify synthetic patient messages as emergency, urgent, routine, administrative, or unclear, including one red-flag message and one incomplete message.
- Inspect: deterministic red-flag escalation, no downgrade path, rationale, missing context, and human-triage routing.
- Next contribution: add a fixture where vague wording must remain unclear instead of becoming routine.
- Human boundary: this is a routing aid, not diagnosis, treatment, or emergency advice.

### KYC Screener — evidence before risk verdict

- Agent: [fintech-kyc-screener](https://registry.agentskit.io/agents/fintech-kyc-screener)
- Try: Screen synthetic records with complete fields, a weak name near-match, and a strong name/DOB/country match. Return evidence and required human follow-up.
- Inspect: required-field validation, deterministic match gate, strong-hit escalation, false-positive uncertainty, and typed sign-off requirement.
- Next contribution: add a fixture with missing DOB and a similar name that must not be treated as a clear match.
- Human boundary: do not use the pattern as an autonomous onboarding, sanctions, PEP, or adverse-media decision.

### Payment Dispute Investigator — case evidence map

- Agent: [fintech-payment-dispute-investigator](https://registry.agentskit.io/agents/fintech-payment-dispute-investigator)
- Try: Build a synthetic chargeback case from transaction facts, customer statements, policy excerpts, and missing evidence. Separate observed facts from investigation questions.
- Inspect: source-to-claim mapping, conflicting evidence, missing artifacts, and investigator handoff.
- Next contribution: add a fixture where merchant and customer timelines conflict and the output must preserve both.
- Human boundary: a financial investigator owns the case assessment, response, and filing decision.

### Claim Intake — structured handoff without coverage judgment

- Agent: [insurance-claim-intake](https://registry.agentskit.io/agents/insurance-claim-intake)
- Try: Convert a synthetic claim narrative and attachments list into incident facts, missing evidence, chronology, and adjuster questions.
- Inspect: extraction fidelity, missing-document detection, uncertainty, and separation of intake from coverage analysis.
- Next contribution: add a fixture with two possible incident dates and require an explicit clarification question.
- Human boundary: do not infer coverage, liability, fraud, settlement value, or claimant eligibility.

### Clause Comparator — material change map

- Agent: [legal-clause-comparator](https://registry.agentskit.io/agents/legal-clause-comparator)
- Try: Compare two synthetic contract clauses and return additions, removals, changed obligations, source locations, and open questions.
- Inspect: exact diff evidence, materiality rationale, unchanged text, and uncertainty when context is absent.
- Next contribution: add a fixture where a changed definition alters the reading of a later clause.
- Human boundary: a lawyer must interpret legal effect and decide what language to accept.

### NDA Reviewer — issue spotting with citations

- Agent: [legal-nda-reviewer](https://registry.agentskit.io/agents/legal-nda-reviewer)
- Try: Review a synthetic NDA for term, scope, residuals, exclusions, governing law, and missing commercial context. Cite the supplied clause locations.
- Inspect: evidence-linked findings, missing context, severity rationale, and absence of legal conclusions.
- Next contribution: add a fixture with a balanced NDA that should produce few or no unsupported findings.
- Human boundary: this is legal issue spotting, not legal advice or contract acceptance.

### Lease Reviewer — property-document handoff

- Agent: [realestate-lease-reviewer](https://registry.agentskit.io/agents/realestate-lease-reviewer)
- Try: Review a synthetic lease for renewal, repair, deposit, assignment, notice, and termination language. Return clause references and questions for counsel.
- Inspect: clause citation, missing jurisdiction/context, normalized issue categories, and review boundary.
- Next contribution: add a fixture where an absent jurisdiction prevents a confident interpretation.
- Human boundary: local counsel or an authorized professional must interpret the lease and make the decision.

## Education, people, and commerce

### Lesson Plan Author — bounded teaching draft

- Agent: [education-lesson-plan-author](https://registry.agentskit.io/agents/education-lesson-plan-author)
- Try: Draft a synthetic lesson plan from objectives, age group, duration, accessibility needs, and available materials. Mark assumptions.
- Inspect: alignment to objectives, feasible timing, accessibility considerations, assumptions, and teacher-editable output.
- Next contribution: add a fixture with incompatible objectives and duration that must produce a clarification question.
- Human boundary: an educator reviews developmental fit, safeguarding, accessibility, and local curriculum requirements.

### Interview Debrief — observed answer versus evaluation

- Agent: [hr-interview-debrief](https://registry.agentskit.io/agents/hr-interview-debrief)
- Try: Convert synthetic interview notes into quoted observations, competency evidence, unanswered questions, and reviewer prompts.
- Inspect: separation of fact from inference, missing evidence, consistent structure, and no automatic candidate recommendation.
- Next contribution: add a fixture with biased or irrelevant notes that should be flagged for human review.
- Human boundary: hiring teams own fair-process review and employment decisions.

### Job Description Author — requirements without proxies

- Agent: [hr-job-description-author](https://registry.agentskit.io/agents/hr-job-description-author)
- Try: Draft a synthetic job description from outcomes, required skills, preferred skills, location, and compensation range. Keep requirements explicit.
- Inspect: requirements versus preferences, inclusive language, unsupported assumptions, and review checklist.
- Next contribution: add a fixture containing a proxy requirement that should be challenged rather than repeated.
- Human boundary: HR and hiring owners review employment-law, compensation, accessibility, and equal-opportunity implications.

### Exit Interview Synthesizer — privacy-safe themes

- Agent: [hr-exit-interview-synthesizer](https://registry.agentskit.io/agents/hr-exit-interview-synthesizer)
- Try: Synthesize three anonymized synthetic exit notes into recurring themes, counterexamples, evidence strength, and follow-up questions.
- Inspect: privacy preservation, quote fidelity, theme support, minority views, and uncertainty from a small sample.
- Next contribution: add a fixture where one vivid comment must not become an organization-wide theme.
- Human boundary: people leaders own privacy handling, investigation, and any employment action.

### Return Triage — policy evidence and exception path

- Agent: [ecommerce-return-triage](https://registry.agentskit.io/agents/ecommerce-return-triage)
- Try: Classify synthetic return requests using a supplied policy, purchase facts, timing, condition, and missing information.
- Inspect: policy citations, missing fields, exception routing, and distinction between recommendation and customer communication.
- Next contribution: add a fixture with an expired window and a documented exception that must remain visible.
- Human boundary: a policy owner or support agent decides the customer outcome and communicates it.

## Revenue, support, content, and product

### Call Debrief — customer evidence to next action

- Agent: [sales-call-debrief](https://registry.agentskit.io/agents/sales-call-debrief)
- Try: Debrief a synthetic sales call into customer statements, needs, objections, commitments, risks, and next actions with owners.
- Inspect: quote fidelity, inferred versus observed needs, unassigned actions, and unresolved qualification questions.
- Next contribution: add a fixture where the prospect explicitly says no follow-up is wanted.
- Human boundary: sellers review the record and choose outreach; do not fabricate customer intent.

### Sales to CS Handoff — preserve commitments and unknowns

- Agent: [sales-handoff-to-cs](https://registry.agentskit.io/agents/sales-handoff-to-cs)
- Try: Convert a synthetic opportunity record into customer goals, promised capabilities, implementation risks, owners, and confirmation questions.
- Inspect: commitment evidence, unknowns, owner completeness, and separation between a draft handoff and a customer promise.
- Next contribution: add a fixture with a sales claim that has no source and must be marked for confirmation.
- Human boundary: account and customer-success owners confirm commitments before they become delivery expectations.

### Competitor Battlecard — verified facts versus hypotheses

- Agent: [sales-competitor-battlecard](https://registry.agentskit.io/agents/sales-competitor-battlecard)
- Try: Build a synthetic battlecard from supplied competitor excerpts and internal positioning. Label verified facts, dated evidence, hypotheses, and prohibited claims.
- Inspect: source coverage, freshness markers, uncertainty, balanced comparison, and claim safety.
- Next contribution: add a conflicting source pair and require the battlecard to preserve the conflict.
- Human boundary: marketing and sales review competitive claims, attribution, and appropriate use before external communication.

### Bug Repro Guide — support report to engineering handoff

- Agent: [support-bug-repro-guide](https://registry.agentskit.io/agents/support-bug-repro-guide)
- Try: Turn a synthetic support report into reproduction steps, expected versus actual behavior, environment, logs needed, and a minimal engineering handoff.
- Inspect: step completeness, missing reproduction fields, privacy filtering, and no invented logs or outcomes.
- Next contribution: add a fixture where the report is insufficient and the correct result is a targeted question list.
- Human boundary: support and engineering confirm the reproduction before assigning severity or changing production behavior.

### Repurpose Matrix — preserve the source claim

- Agent: [content-repurpose-matrix](https://registry.agentskit.io/agents/content-repurpose-matrix)
- Try: Map one synthetic source article into a newsletter, short post, workshop prompt, and changelog excerpt. Keep source claims and audience intent visible.
- Inspect: claim preservation, format fit, audience adaptation, unsupported additions, and editorial review points.
- Next contribution: add a fixture with a source caveat that must appear in every derivative where it matters.
- Human boundary: an editor owns factual claims, tone, rights, accessibility, and final publication.

### Experiment Designer — hypothesis before metric theater

- Agent: [product-experiment-designer](https://registry.agentskit.io/agents/product-experiment-designer)
- Try: Draft a synthetic experiment brief with hypothesis, primary metric, guardrails, population, duration, assumptions, and stop conditions.
- Inspect: metric definitions, denominator, causal limitation, guardrails, sample assumptions, and open decisions.
- Next contribution: add a fixture with a vanity metric that should be challenged or reframed.
- Human boundary: product and data owners decide feasibility, ethics, analysis, and rollout.

### Release Risk — evidence-based go/no-go packet

- Agent: [product-release-risk](https://registry.agentskit.io/agents/product-release-risk)
- Try: Build a synthetic release-risk register from test results, dependency changes, rollout plan, observability gaps, and rollback notes.
- Inspect: evidence links, unknowns, mitigations, owners, residual risk, and explicit separation from the go/no-go decision.
- Next contribution: add a fixture where a passing test suite coexists with a missing rollback path.
- Human boundary: release owners decide whether and how to ship; the generated register is advisory.

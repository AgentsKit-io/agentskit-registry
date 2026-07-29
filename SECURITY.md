# Security policy

## Supported versions

Security fixes are applied to the default branch and the latest published major
version of the reusable validation Action. Catalog entries are copied source,
not a hosted runtime; consumers should update their copies when a relevant fix
is published.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability. Use
[GitHub private vulnerability reporting](https://github.com/AgentsKit-io/agentskit-registry/security/advisories/new).
Include the affected file or Action version, impact, minimal reproduction, and
any proposed mitigation. Do not include production credentials, private
prompts, customer data, or proprietary agent source.

We aim to acknowledge a complete report within 14 days, investigate it, and
coordinate disclosure and remediation with the reporter before publishing
details.

## Registry boundary

AgentsKit Registry validates catalog structure, metadata, content policy,
generated artifacts, and the reusable validation Action. Copied agents remain
ordinary application source under the consumer's control.

- Review copied source before using it with production data or tools.
- Keep model and service credentials outside agent source and fixtures.
- Treat model output, retrieved content, tool results, and user input as
  untrusted.
- Enforce authentication, authorization, tenant isolation, rate limits, and
  approval policy in the host application.
- Re-run tests and evaluations after changing providers, tools, prompts, data
  contracts, or package versions.
- Validate copied agents against applicable privacy, safety, and regulatory
  requirements before deployment.

# Governance

AgentsKit Registry is maintained in public by the AgentsKit organization.
Emerson Braun is the primary maintainer. Repository maintainers are responsible
for triage, reviews, releases, security response, catalog integrity, and
enforcement of the contribution and conduct policies.

## Decisions

Bug reports, agent proposals, and implementation decisions belong in public
issues and pull requests whenever they do not involve a vulnerability or
private data. Maintainers decide by documented technical merit, source
ownership, provider neutrality, catalog consistency, maintenance cost, and
evidence from tests or reproducible examples.

Small, focused changes may proceed directly through a pull request.
Contributors should open an issue before a large architecture, schema, content
policy, or catalog contract change. Maintainers have final merge authority and
may decline changes that lack evidence or a sustainable maintenance path.

Security reports follow [SECURITY.md](SECURITY.md) and remain private until
coordinated disclosure is appropriate. Conduct matters follow
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Releases

The reusable validation Action is released from `main`. Immutable semantic
version tags identify exact releases, while the documented `v1` major alias may
advance only to compatible releases after the repository validation suite
passes. Catalog source and generated artifacts are reviewed through the same
pull request workflow.

Maintainer, release, schema, and content-policy changes are documented through
public pull requests whenever security or private data does not require a
private process.

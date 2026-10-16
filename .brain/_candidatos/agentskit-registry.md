# Candidatos globais — agentskit-registry

## Conceitos

- **Catálogo de agentes** → Fonte versionada de agentes com estados e metadados; bundles copiam fontes para projetos consumidores. Aparece em [[registry-catalogo]] e [[00 Hub - agentskit-registry]]. Evidência: `CONTRIBUTING.md:35`.
- **Descoberta determinística** → Responde fatos exatos a partir de artefato validado, sem ranking ou interpretação semântica. Aparece em [[registry-descoberta]] e [[Registry - Descoberta sem IA]]. Evidência: `docs/architecture.md:50`.
- **Evidência pública de validação** → Resumo sanitizado que sustenta claims de validação sem incluir parecer privado bruto. Aparece em [[registry-validacao]]. Evidência: `AGENTS.md:15`.

## Glossário

- **Draft**: agente não instalável, ainda em elaboração (`AGENTS.md:15`).
- **Bundle**: JSON público que incorpora fontes do agente (`scripts/build-registry.mjs:6`).
- **Alias determinístico**: chave exata que aponta a uma entrada sem ambiguidade (`scripts/lib/deterministic-discovery.mjs:77`).

## Arestas de dependência

- `registry-catalogo --> registry-validacao : usa evidência antes de publicar estado : scripts/build-registry.mjs:13`
- `registry-descoberta --> @agentskit/chat/protocol : reutiliza schema e normalização : scripts/lib/deterministic-discovery.mjs:12`
- `agentskit-cli --> public/r : instala fontes empacotadas : docs/architecture.md:30`
- `AgentsKit Registry app --> public/deterministic : consome conhecimento para consultas locais : docs/architecture.md:15`

## Infra e deploy

- Node 22 é declarado no workflow CI (`.github/workflows/ci.yml:22`).
- Saídas geradas são versionadas em `public/r`, `public/deterministic` e `ecosystem-claims.json` (`AGENTS.md:13`).
- Site consumidor está no monorepo AgentsKit; configuração local não prova estado de produção (`docs/architecture.md:5`).
- Não há banco operacional necessário ao build, conforme os scripts de geração local.

## Perguntas abertas

- Doc Bridge: `doc-bridge.config.json` existe, mas a dependência não pôde ser instalada neste ambiente e `.doc-bridge/index.json` não existe; entidades, relações e edit roots do índice ainda não foram conferidos.
- Não foram encontrados ADRs em `docs/adr/`; confirmar se decisões relevantes permanecem apenas no histórico Git.
- A configuração versionada de build não demonstra qual serviço publica os arquivos para o domínio Registry.

## Capacidades sem uso confirmado

- Nenhuma capacidade foi declarada comprovadamente sem uso. A atribuição requer índice Doc Bridge e busca de consumidores completa.

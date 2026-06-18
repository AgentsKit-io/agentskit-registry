export const locales = ['en', 'pt', 'es'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export function getLocale(astroLocale: string | undefined): Locale {
  return (locales as readonly string[]).includes(astroLocale ?? '') ? (astroLocale as Locale) : defaultLocale
}

/** Build a locale-aware path (English is unprefixed, matching astro.config routing). */
export function localizedPath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  if (locale === defaultLocale) return clean
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`
}

type Dict = {
  htmlLang: string
  metaTitle: string
  metaDescription: string
  nav: { docs: string }
  hero: {
    badge: string
    title1: string
    title2: string
    subtitle: string
    ctaBrowse: string
    ctaGallery: string
    copyHint: string
  }
  stats: { agents: string; categories: string; ownYourCode: string }
  what: { title: string; body: string; b1t: string; b1d: string; b2t: string; b2d: string; b3t: string; b3d: string }
  categories: { title: string; sub: string; agents: string }
  featured: { title: string; sub: string; viewAll: string }
  install: {
    title: string
    sub: string
    s1t: string
    s1d: string
    s2t: string
    s2d: string
    s3t: string
    s3d: string
    running: string
    done: string
    yourCode: string
  }
  prompt: { title: string; sub: string }
  agent: {
    back: string
    install: string
    installSub: string
    source: string
    fetch: string
    fetchSub: string
    promptTitle: string
    promptSub: string
    packages: string
    env: string
    required: string
    optional: string
    runnable: string
    notRunnable: string
    runnableHint: string
    notRunnableHint: string
    viewBundle: string
    category: string
    tags: string
    license: string
    version: string
  }
  copy: { copy: string; copied: string }
  demo: { eyebrow: string; title: string; sub: string; coreLabel: string; coreSub: string }
  tabs: { label: string; agents: string }
  works: { eyebrow: string; title: string; sub: string; integrations: string; providers: string }
  starCta: { title: string; sub: string; button: string; ecosystem: string }
  footer: { tagline: string; ecosystem: string; resources: string; builtBy: string }
}

const en: Dict = {
  htmlLang: 'en',
  metaTitle: 'AgentsKit Registry — Ready-to-use AI agents',
  metaDescription:
    'A curated registry of production-ready AI agents for AgentsKit. Install with one command, own the source — shadcn-style. No lock-in.',
  nav: { docs: 'Docs' },
  hero: {
    badge: 'The shadcn for AI agents',
    title1: 'The shadcn for AI agents.',
    title2: 'Copy the source. Own the code.',
    subtitle:
      'Like shadcn/ui, but for agents. One command copies a production-grade agent into your project — you own the code, edit it freely, no framework dependency, no lock-in.',
    ctaBrowse: 'Browse agents',
    ctaGallery: 'View on GitHub',
    copyHint: 'Copy install command',
  },
  stats: { agents: 'agents', categories: 'categories', ownYourCode: 'you own the code' },
  what: {
    title: 'Install an agent the way you install a component',
    body: 'Each agent is a small, self-contained factory wiring published @agentskit/* packages into a one-call function. The CLI copies that source into your project so you can read it, edit it, and keep it.',
    b1t: 'No lock-in',
    b1d: 'The code lands in your repo. Edit it freely — no runtime dependency on this registry.',
    b2t: 'Production-shaped',
    b2d: 'Skills, tools, env, and human-in-the-loop wired the way real agents ship.',
    b3t: 'Agent-friendly',
    b3d: 'Every agent is machine-discoverable via JSON, llms.txt, and an MCP endpoint.',
  },
  categories: { title: 'Browse by category', sub: 'Agents grouped by the work they do.', agents: 'agents' },
  featured: { title: 'Featured agents', sub: 'A few to start with.', viewAll: 'View all agents' },
  install: {
    title: 'One command. The code is yours.',
    sub: 'Three steps from registry to running in your own stack — no lock-in, no hidden runtime.',
    s1t: 'Add it',
    s1d: 'Run one command. The CLI copies the full agent source into ./agents/<id>/ in your repo. From here, the code is yours — read it, edit it, commit it.',
    s2t: 'Wire it',
    s2d: 'It is plain TypeScript in your project. Import the factory and pass any adapter — OpenAI, Anthropic, or your own. Swap the model or provider whenever you want.',
    s3t: 'Run it anywhere',
    s3d: 'Call agent.run() from Node, a serverless function, an edge runtime, or your terminal. It is your code on your infrastructure — nothing phones home to this registry.',
    running: 'running research agent…',
    done: 'done — answer with 5 cited sources',
    yourCode: 'Your code · your stack',
  },
  prompt: {
    title: 'Bring your own agent',
    sub: 'Copy a ready instruction block and paste it into Claude, Cursor, or any coding agent.',
  },
  agent: {
    back: 'All agents',
    install: 'Install',
    installSub: 'Copies the source into ./agents/ — shadcn-style.',
    source: 'Source',
    fetch: 'Fetch as JSON',
    fetchSub: 'The full machine-readable bundle (metadata + source).',
    promptTitle: 'Copy for your agent',
    promptSub: 'Paste this into your AI coding assistant to install and wire it up.',
    packages: 'Packages',
    env: 'Environment',
    required: 'required',
    optional: 'optional',
    runnable: 'Runnable',
    notRunnable: 'Composed',
    runnableHint: 'Has an inline system prompt — runnable as data by the CLI.',
    notRunnableHint: 'Composes an external skill + tools; run it from the copied source.',
    viewBundle: 'View JSON bundle',
    category: 'Category',
    tags: 'Tags',
    license: 'License',
    version: 'Version',
  },
  copy: { copy: 'Copy', copied: 'Copied!' },
  demo: {
    eyebrow: 'How it works',
    title: 'One registry. Every agent drops in.',
    sub: 'Pick an agent, run one command, the source lands in your repo. Browse what ships ready-to-use.',
    coreLabel: 'registry',
    coreSub: 'zero lock-in',
  },
  tabs: { label: 'Filter agents by category', agents: 'agents' },
  works: {
    eyebrow: 'Works with everything',
    title: 'One contract. Every tool, every model.',
    sub: 'Every agent you copy runs on the AgentsKit core — 50+ built-in integrations and 100+ providers (5,000+ models) behind a single contract. Swap the model, provider, or tool without touching the rest.',
    integrations: 'All 50 integrations',
    providers: 'All 100+ providers',
  },
  starCta: {
    title: 'Star us on GitHub',
    sub: 'The registry is open-source and MIT-licensed. A star helps more builders find it.',
    button: 'Star the registry',
    ecosystem: 'Explore the ecosystem',
  },
  footer: {
    tagline: 'Ready-to-use AI agents for AgentsKit.',
    ecosystem: 'Ecosystem',
    resources: 'Resources',
    builtBy: 'Built by AgentsKit',
  },
}

const pt: Dict = {
  htmlLang: 'pt-BR',
  metaTitle: 'AgentsKit Registry — Agentes de IA prontos para usar',
  metaDescription:
    'Um registro curado de agentes de IA prontos para produção para o AgentsKit. Instale com um comando e seja dono do código — no estilo shadcn. Sem lock-in.',
  nav: { docs: 'Docs' },
  hero: {
    badge: 'O shadcn dos agentes de IA',
    title1: 'O shadcn dos agentes de IA.',
    title2: 'Copie o código. Ele é seu.',
    subtitle:
      'Como o shadcn/ui, mas para agentes. Um comando copia um agente pronto para produção para o seu projeto — o código é seu, edite à vontade, sem dependência de framework, sem lock-in.',
    ctaBrowse: 'Explorar agentes',
    ctaGallery: 'Ver no GitHub',
    copyHint: 'Copiar comando de instalação',
  },
  stats: { agents: 'agentes', categories: 'categorias', ownYourCode: 'o código é seu' },
  what: {
    title: 'Instale um agente como você instala um componente',
    body: 'Cada agente é uma fábrica pequena e independente que conecta pacotes @agentskit/* publicados em uma função de uma chamada. O CLI copia esse código para o seu projeto — para você ler, editar e manter.',
    b1t: 'Sem lock-in',
    b1d: 'O código vai para o seu repositório. Edite à vontade — sem dependência em runtime deste registro.',
    b2t: 'Formato de produção',
    b2d: 'Skills, tools, env e human-in-the-loop conectados como agentes reais são entregues.',
    b3t: 'Amigável a agentes',
    b3d: 'Cada agente é descoberto por máquinas via JSON, llms.txt e um endpoint MCP.',
  },
  categories: { title: 'Explorar por categoria', sub: 'Agentes agrupados pelo trabalho que fazem.', agents: 'agentes' },
  featured: { title: 'Agentes em destaque', sub: 'Alguns para começar.', viewAll: 'Ver todos os agentes' },
  install: {
    title: 'Um comando. O código é seu.',
    sub: 'Três passos do registro até rodar na sua própria stack — sem lock-in, sem runtime escondido.',
    s1t: 'Adicione',
    s1d: 'Rode um comando. O CLI copia todo o código do agente para ./agents/<id>/ no seu repositório. A partir daqui, o código é seu — leia, edite, comite.',
    s2t: 'Conecte',
    s2d: 'É TypeScript puro no seu projeto. Importe a fábrica e passe qualquer adapter — OpenAI, Anthropic ou o seu. Troque modelo ou provedor quando quiser.',
    s3t: 'Rode onde quiser',
    s3d: 'Chame agent.run() no Node, numa função serverless, num runtime de edge ou no seu terminal. É o seu código na sua infra — nada é enviado de volta pra este registro.',
    running: 'rodando o agente de pesquisa…',
    done: 'pronto — resposta com 5 fontes citadas',
    yourCode: 'Seu código · sua stack',
  },
  prompt: {
    title: 'Traga seu próprio agente',
    sub: 'Copie um bloco de instruções pronto e cole no Claude, Cursor ou qualquer agente de código.',
  },
  agent: {
    back: 'Todos os agentes',
    install: 'Instalar',
    installSub: 'Copia o código para ./agents/ — no estilo shadcn.',
    source: 'Código-fonte',
    fetch: 'Obter como JSON',
    fetchSub: 'O bundle completo legível por máquina (metadados + código).',
    promptTitle: 'Copiar para o seu agente',
    promptSub: 'Cole isto no seu assistente de código com IA para instalar e configurar.',
    packages: 'Pacotes',
    env: 'Ambiente',
    required: 'obrigatório',
    optional: 'opcional',
    runnable: 'Executável',
    notRunnable: 'Composto',
    runnableHint: 'Tem um system prompt inline — executável como dados pelo CLI.',
    notRunnableHint: 'Compõe uma skill externa + tools; execute a partir do código copiado.',
    viewBundle: 'Ver bundle JSON',
    category: 'Categoria',
    tags: 'Tags',
    license: 'Licença',
    version: 'Versão',
  },
  copy: { copy: 'Copiar', copied: 'Copiado!' },
  demo: {
    eyebrow: 'Como funciona',
    title: 'Um registro. Cada agente se encaixa.',
    sub: 'Escolha um agente, rode um comando, o código vai pro seu repositório. Veja o que já vem pronto para usar.',
    coreLabel: 'registry',
    coreSub: 'zero lock-in',
  },
  tabs: { label: 'Filtrar agentes por categoria', agents: 'agentes' },
  works: {
    eyebrow: 'Funciona com tudo',
    title: 'Um contrato. Toda tool, todo modelo.',
    sub: 'Todo agente que você copia roda sobre o core do AgentsKit — 50+ integrações nativas e 100+ provedores (5.000+ modelos) atrás de um único contrato. Troque o modelo, o provedor ou a tool sem mexer no resto.',
    integrations: 'Todas as 50 integrações',
    providers: 'Todos os 100+ provedores',
  },
  starCta: {
    title: 'Dê uma estrela no GitHub',
    sub: 'O registro é open-source e licença MIT. Uma estrela ajuda mais devs a encontrá-lo.',
    button: 'Estrela no registry',
    ecosystem: 'Explorar o ecossistema',
  },
  footer: {
    tagline: 'Agentes de IA prontos para usar para o AgentsKit.',
    ecosystem: 'Ecossistema',
    resources: 'Recursos',
    builtBy: 'Feito pela AgentsKit',
  },
}

const es: Dict = {
  htmlLang: 'es',
  metaTitle: 'AgentsKit Registry — Agentes de IA listos para usar',
  metaDescription:
    'Un registro curado de agentes de IA listos para producción para AgentsKit. Instala con un comando y sé dueño del código — estilo shadcn. Sin lock-in.',
  nav: { docs: 'Docs' },
  hero: {
    badge: 'El shadcn para agentes de IA',
    title1: 'El shadcn para agentes de IA.',
    title2: 'Copia el código. Es tuyo.',
    subtitle:
      'Como shadcn/ui, pero para agentes. Un comando copia un agente listo para producción a tu proyecto — el código es tuyo, edítalo libremente, sin dependencia de framework, sin lock-in.',
    ctaBrowse: 'Explorar agentes',
    ctaGallery: 'Ver en GitHub',
    copyHint: 'Copiar comando de instalación',
  },
  stats: { agents: 'agentes', categories: 'categorías', ownYourCode: 'el código es tuyo' },
  what: {
    title: 'Instala un agente como instalas un componente',
    body: 'Cada agente es una fábrica pequeña e independiente que conecta paquetes @agentskit/* publicados en una función de una sola llamada. El CLI copia ese código a tu proyecto — para leerlo, editarlo y conservarlo.',
    b1t: 'Sin lock-in',
    b1d: 'El código llega a tu repositorio. Edítalo libremente — sin dependencia en runtime de este registro.',
    b2t: 'Forma de producción',
    b2d: 'Skills, tools, env y human-in-the-loop conectados como se entregan los agentes reales.',
    b3t: 'Amigable para agentes',
    b3d: 'Cada agente es descubrible por máquinas vía JSON, llms.txt y un endpoint MCP.',
  },
  categories: { title: 'Explorar por categoría', sub: 'Agentes agrupados por el trabajo que hacen.', agents: 'agentes' },
  featured: { title: 'Agentes destacados', sub: 'Algunos para empezar.', viewAll: 'Ver todos los agentes' },
  install: {
    title: 'Un comando. El código es tuyo.',
    sub: 'Tres pasos del registro a ejecutarse en tu propia stack — sin lock-in, sin runtime oculto.',
    s1t: 'Agrégalo',
    s1d: 'Ejecuta un comando. El CLI copia todo el código del agente en ./agents/<id>/ en tu repo. Desde aquí, el código es tuyo — léelo, edítalo, commitéalo.',
    s2t: 'Conéctalo',
    s2d: 'Es TypeScript puro en tu proyecto. Importa la fábrica y pasa cualquier adapter — OpenAI, Anthropic o el tuyo. Cambia el modelo o proveedor cuando quieras.',
    s3t: 'Ejecútalo donde sea',
    s3d: 'Llama a agent.run() desde Node, una función serverless, un runtime edge o tu terminal. Es tu código en tu infraestructura — nada se envía de vuelta a este registro.',
    running: 'ejecutando el agente de investigación…',
    done: 'listo — respuesta con 5 fuentes citadas',
    yourCode: 'Tu código · tu stack',
  },
  prompt: {
    title: 'Trae tu propio agente',
    sub: 'Copia un bloque de instrucciones listo y pégalo en Claude, Cursor o cualquier agente de código.',
  },
  agent: {
    back: 'Todos los agentes',
    install: 'Instalar',
    installSub: 'Copia el código en ./agents/ — estilo shadcn.',
    source: 'Código fuente',
    fetch: 'Obtener como JSON',
    fetchSub: 'El bundle completo legible por máquina (metadatos + código).',
    promptTitle: 'Copiar para tu agente',
    promptSub: 'Pega esto en tu asistente de código con IA para instalarlo y configurarlo.',
    packages: 'Paquetes',
    env: 'Entorno',
    required: 'requerido',
    optional: 'opcional',
    runnable: 'Ejecutable',
    notRunnable: 'Compuesto',
    runnableHint: 'Tiene un system prompt inline — ejecutable como datos por el CLI.',
    notRunnableHint: 'Compone una skill externa + tools; ejecútalo desde el código copiado.',
    viewBundle: 'Ver bundle JSON',
    category: 'Categoría',
    tags: 'Etiquetas',
    license: 'Licencia',
    version: 'Versión',
  },
  copy: { copy: 'Copiar', copied: '¡Copiado!' },
  demo: {
    eyebrow: 'Cómo funciona',
    title: 'Un registro. Cada agente encaja.',
    sub: 'Elige un agente, ejecuta un comando, el código llega a tu repo. Mira lo que viene listo para usar.',
    coreLabel: 'registry',
    coreSub: 'cero lock-in',
  },
  tabs: { label: 'Filtrar agentes por categoría', agents: 'agentes' },
  works: {
    eyebrow: 'Funciona con todo',
    title: 'Un contrato. Toda tool, todo modelo.',
    sub: 'Cada agente que copias corre sobre el core de AgentsKit — 50+ integraciones nativas y 100+ proveedores (5.000+ modelos) detrás de un único contrato. Cambia el modelo, el proveedor o la tool sin tocar el resto.',
    integrations: 'Todas las 50 integraciones',
    providers: 'Todos los 100+ proveedores',
  },
  starCta: {
    title: 'Danos una estrella en GitHub',
    sub: 'El registro es open-source y con licencia MIT. Una estrella ayuda a que más devs lo encuentren.',
    button: 'Estrella al registry',
    ecosystem: 'Explorar el ecosistema',
  },
  footer: {
    tagline: 'Agentes de IA listos para usar para AgentsKit.',
    ecosystem: 'Ecosistema',
    resources: 'Recursos',
    builtBy: 'Hecho por AgentsKit',
  },
}

const dicts: Record<Locale, Dict> = { en, pt, es }

export function t(locale: Locale): Dict {
  return dicts[locale]
}

// Category display names + blurbs, localized.
type Cat = { label: string; blurb: string }
const CATS: Record<Locale, Record<string, Cat>> = {
  en: {
    coding: { label: 'Coding', blurb: 'Reviews, tests, PRs, and release flow for engineering teams.' },
    research: { label: 'Research', blurb: 'Citation-first web research with every claim anchored to a source.' },
    marketing: { label: 'Marketing', blurb: 'Briefs, copy, competitive research, and social publishing.' },
    agency: { label: 'Agency', blurb: 'Client briefs, decks, schedules, and creative review.' },
    support: { label: 'Support', blurb: 'Ticket triage, KB search, and escalation drafting.' },
    legal: { label: 'Legal', blurb: 'Contract review, discovery, drafting, and privilege spotting.' },
    fintech: { label: 'Fintech', blurb: 'KYC, sanctions, fraud, and transaction monitoring.' },
    clinical: { label: 'Clinical', blurb: 'Intake triage, SOAP notes, redaction, and referrals.' },
    ops: { label: 'Ops', blurb: 'Internal workflows and knowledge promotion.' },
  },
  pt: {
    coding: { label: 'Código', blurb: 'Revisões, testes, PRs e fluxo de release para times de engenharia.' },
    research: { label: 'Pesquisa', blurb: 'Pesquisa web com citações, cada afirmação ancorada a uma fonte.' },
    marketing: { label: 'Marketing', blurb: 'Briefings, copy, pesquisa competitiva e publicação social.' },
    agency: { label: 'Agência', blurb: 'Briefings de cliente, decks, cronogramas e revisão criativa.' },
    support: { label: 'Suporte', blurb: 'Triagem de tickets, busca na base e rascunho de escalonamento.' },
    legal: { label: 'Jurídico', blurb: 'Revisão de contratos, discovery, redação e privilégio.' },
    fintech: { label: 'Fintech', blurb: 'KYC, sanções, fraude e monitoramento de transações.' },
    clinical: { label: 'Clínico', blurb: 'Triagem de admissão, notas SOAP, redação e encaminhamentos.' },
    ops: { label: 'Ops', blurb: 'Fluxos internos e promoção de conhecimento.' },
  },
  es: {
    coding: { label: 'Código', blurb: 'Revisiones, tests, PRs y flujo de release para equipos de ingeniería.' },
    research: { label: 'Investigación', blurb: 'Investigación web con citas, cada afirmación anclada a una fuente.' },
    marketing: { label: 'Marketing', blurb: 'Briefs, copy, investigación competitiva y publicación social.' },
    agency: { label: 'Agencia', blurb: 'Briefs de cliente, decks, calendarios y revisión creativa.' },
    support: { label: 'Soporte', blurb: 'Triaje de tickets, búsqueda en KB y borradores de escalado.' },
    legal: { label: 'Legal', blurb: 'Revisión de contratos, discovery, redacción y privilegio.' },
    fintech: { label: 'Fintech', blurb: 'KYC, sanciones, fraude y monitoreo de transacciones.' },
    clinical: { label: 'Clínico', blurb: 'Triaje de admisión, notas SOAP, redacción y derivaciones.' },
    ops: { label: 'Ops', blurb: 'Flujos internos y promoción de conocimiento.' },
  },
}

export function categoryMeta(locale: Locale, id: string): Cat {
  return CATS[locale][id] ?? { label: id.charAt(0).toUpperCase() + id.slice(1), blurb: '' }
}

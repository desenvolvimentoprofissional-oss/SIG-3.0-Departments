# SIG 3.0: Diretrizes de Arquitetura e Engenharia

Este arquivo contém as diretrizes definitivas e a "espinha dorsal" arquitetural para o desenvolvimento da plataforma SIG 3.0. Qualquer agente ou desenvolvedor que atue neste projeto DEVE seguir rigorosamente estas regras.

## 1. Filosofia de Desenvolvimento e Arquitetura
A plataforma adota o padrão Enterprise SaaS Multi-Tenant com uma arquitetura orientada a dados (Data-Driven) e separação estrita de responsabilidades:
*   **Frontend Leve (Thin Client):** O frontend (React/Vite) atua única e exclusivamente como uma camada de renderização visual. Ele não deve conter regras de negócio complexas, orquestração pesada de dados ou acoplamento direto com lógica de backend.
*   **Injeção de Dados (Data-Driven UI):** Estruturas como o Menu Lateral (>30 departamentos) e o conteúdo das páginas são abstrações cujos dados (ícones, rotas, coleções, permissões) serão injetados rotineiramente via Backend (ex: Firebase/Firestore).
*   **Template Matrix:** Em vez de dezenas de páginas hardcoded, o sistema operará com matrizes de templates visuais (ex: Template de Tabela, Template de Dashboard, Template de Formulário). O frontend desenha o "esqueleto" (modelo) e a inteligência de negócios injeta os dados nesse esqueleto.

## 2. Espinha Dorsal do Sistema (Estrutura de Pastas e Monorepo)
Para garantir o isolamento físico entre o servidor de controle, os dados de infraestrutura e o cliente visual, o repositório adota a topologia Monorepo Enterprise na raiz. No interior do módulo cliente (`/front-end-client/src`), a seguinte taxonomia física deve ser rigorosamente respeitada:

```plaintext
/ (Raiz do Monorepo)
├── /control-plane-server   # [BACKEND] Servidor Node/Express de controle global e autenticação.
├── /data-plane-iac         # [IaC] Regras de segurança (firestore.rules) e índices para os 25 silos.
├── /packages               # [ENGINES] Workspaces isolados de alta complexidade (ex: bpmn-engine).
└── /front-end-client       # [CLIENT WEB] Aplicação React / Vite (Thin Client)
    └── /src
        ├── /api            # [BACKEND CONNECTION] Integração e chamadas isoladas (Factory Pattern).
        ├── /types          # [CONTRACTS] Definições TypeScript das Interfaces e Schemas Zod.
        ├── /store          # [STATE] Gerenciamento de estado global único (Zustand).
        ├── /templates      # [VIEWS] Matrizes de Páginas (ex: DataGridTemplate.tsx, FormTemplate.tsx).
        ├── /components     # [UI] Componentes visuais puros e componentes de layout.
        │   ├── /layout     # Estruturas fixas de layout (Sidebar, Header).
        │   └── /ui         # Componentes base e atômicos semânticos.
        ├── /workers        # [MULTI-THREADING] Web Workers para parsing e processamento off-main-thread.
        ├── /lib            # [UTILS] Funções utilitárias puras e filtros de exibição.
        ├── App.tsx         # Orquestrador de Rotas e injetor de Contexto.
        └── index.css       # Configuração global de estilos e design system (Tailwind).
```

## 3. Padrões Visuais, de UI/UX e Hibridismo Taxonômico
*   **Simetria e Precisão:** Manter rigor matemático nas proporções. O layout base atual possui componentes colapsáveis cuja simetria horizontal e vertical (ex: centralização de logotipos, largura de barras laterais recolhidas matching headers) deve ser protegida a todo custo contra quebras de layout.
*   **Transições Suaves:** Animações e trocas de estado na UI não devem apresentar engasgos. Código limpo e otimizado garante a taxa fixa de 60fps na renderização.
*   **Minimalismo e Geometria:** Interfaces limpas, profissionais, em Light Mode mandatório com geometria padronizada (`rounded-xl` e `rounded-full`).
*   **Hibridismo Taxonômico de Idiomas:** Atributos estruturais de interface e infraestrutura de componentes (`type`, `role`, estados de controle como `isLoading` ou `isOpen`) devem ser escritos obrigatoriamente em **Inglês**. Nomes de entidades públicas, textos lidos pelo usuário ou por ferramentas de acessibilidade (como `placeholder`, `aria-label`),campos de formulários e regras de negócio do CRA-SP permanecem estritamente em **Português**.

## 4. Ordem de Procedimento (Checklist do Agente)
Sempre que atuar no SIG 3.0, o agente deve questionar:
*   "Essa regra é visual ou é de negócio?" (Se for de negócio, deve ir para a API/Services/Zustand e não para o Componente).
*   "Estou criando código hardcoded para um dado que deveria ser injetado recursivamente pelo banco?" (Se sim, reverta para criar um injetor genérico).
*   "A estrutura de pastas foi preservada ou contaminei o componente visual com consultas ou mutações diretas?"

## 5. Métricas de Qualidade, Segurança e Clean Code (GRC)
**Métricas de Clean Code (Escrita e Legibilidade):**
*   **Limite de Linhas por Arquivo:** Arquivos e módulos não devem ultrapassar 250 a 300 linhas. Se o código passar desse volume, deve ser imediatamente desmembrado em submódulos ou componentes.
*   **Responsabilidade Única (SRP):** Funções e métodos devem ter, no máximo, 30 linhas, executando apenas uma única tarefa.
*   **Comprimento de Linha:** Evitar linhas horizontais muito extensas (acima de 120 caracteres).

**Segurança Multi-Tenant & OWASP:**
*   **Isolamento de Tenants:** O sistema não pode, sob nenhuma hipótese, vazar dados entre os 30+ departamentos. O contexto de execução deve ser hermético.
*   **Proibição de Mutações Imperativas na UI:** É terminantemente proibido invocar funções mutáveis diretas do SDK do Firebase (`setDoc`, `updateDoc`, `addDoc`, `deleteDoc`) dentro de componentes React (`.tsx`). A UI apenas dispara intenções para ações do Zustand Store ou funções de fábrica em `/src/api`, validadas rigorosamente via esquemas Zod.
*   **OWASP Top 10 & ASVS v4.0:** Código resistente a injeções, quebras de controle de acesso (BOLA/IDOR), falhas de autenticação e manipulação não segura de dados.

**Arquitetura, Performance e RAM (ISO/IEC 25010):**
*   **Baixo Acoplamento e Testabilidade:** Módulo Frontend e Backend/Injeção devem ser estritamente desacoplados por injeção de dependências.
*   **Complexidade Ciclomática (Modelo Híbrido):**
    *   **APIs, Web Workers, Services e Classes Lógicas (Core Business):** Limite estrito de $V(G) \le 3$ (garante pureza matemática e testabilidade em operações não-visuais).
    *   **Camada Visual / React (Thin Client):** Limite tolerado de $V(G) \le 7$ (sendo 5 o cenário ideal). Isso acomoda validações de interface (*Loading*, *Empty*, *Error*, *Success*) sem gerar a hiper-fragmentação de componentes ("Efeito Lasanha").
*   **Enclausuramento de Subscrições (`onSnapshot`):** É proibido inicializar listeners em tempo real do Firestore dentro de ganchos `useEffect` em componentes visuais. Todas as subscrições, manutenções e chamadas explícitas de encerramento de ponteiros (`unsubscribe()`) devem ficar 100% enclausuradas dentro de ações do Zustand Store.
*   **Divisão de Carga e Web Workers:** Processamentos de alta densidade computacional (parsing de arquivos pesados, CSVs e conversões semânticas) devem ser delegados a Web Workers (`/src/workers/semantic-parser.worker.ts`). A Main Thread do React opera dedicada exclusivamente à renderização de UI a 60 FPS, sendo permitidas apenas paginações e ordenações simples de dados em memória.

**Protocolo de Refatoração Contínua:**
Sempre que o agente cruzar com códigos que violem os itens anteriores, ele deve imediatamente propor as correções ou refatorar o trecho, mantendo a estabilidade.

## 6. Conformidade e Auditoria Externa (Legislações e Certificações)
O desenvolvimento deve obrigatoriamente acatar as seguintes restrições e guias para Auditoria Externa, refletindo nos códigos e na arquitetura do SIG 3.0:

**Legislações Nacionais (Âmbito Governamental e Privacidade):**
*   **LGPD (Lei nº 13.709/2018):** Auditoria do ciclo de vida completo de Dados Pessoais (PII). Em logs de telemetria e no servidor backend, a sanitização exige a reconstrução imutável de objetos via **Whitelisting** e hashing **SHA-256 com salt** (é vedado o uso de RegEx no backend para higienizar logs). É estritamente proibido emitir em funções de log ou erros qualquer string contendo o caractere `@` (indicador de PII/e-mail) sem hashing prévio. Na camada visual do cliente, Expressões Regulares (RegEx) permanecem autorizadas para validação e máscaras dinâmicas de entrada.
*   **Lei de Governo Digital (Lei nº 14.129/2021) & e-PING:** Proibição do tráfego ou persistência de dados brutos sem tratamento. Validação sintática estrita via Zod é mandatória na borda da aplicação antes da persistência NoSQL.
*   **LAI (Lei nº 12.527/2011):** Estruturas de tabelas e matrizes de dashboard devem exportar dados em formatos abertos, legíveis por máquina e padronizados (CSV UTF-8 com BOM).
*   **Lei Brasileira de Inclusão (Lei nº 13.146/2015) & e-MAG:** Acessibilidade total (WCAG 2.2 AA). A navegação deve ser 100% autônoma via teclado. O uso de tags semânticas nativas (como `<button>`) é obrigatório em substituição a elementos genéricos simulados (como `<div>` com onClick/role).

**Certificações, Frameworks e Governança Executiva:**
*   **OWASP Top 10 & ASVS v4.0 (Nível 3):** Combate proativo a vulnerabilidades BOLA/IDOR, injeções e mitigação de persistência não segura de sessões no cliente (proibição de tokens em `localStorage` ou `sessionStorage`).
*   **ISO/IEC 27001 & SOC 2 Type II:** Foco em SGSI e isolamento lógico/físico do modelo multi-tenant por credenciais criptográficas.
*   **ISO/IEC 25010:** Garantia de manutenibilidade, eficiência de desempenho e variação de memória Heap nula no navegador ($\Delta M_{heap} = 0$).
*   **ISO/IEC 5230 (OpenChain / Compliance SBOM):** Varredura automatizada de dependências no `package.json`:
    *   🟢 **Permissivas (MIT, Apache 2.0, BSD 3-Clause):** Aprovadas para build.
    *   🟡 **Copyleft Fraco (LGPL v3, MPL 2.0):** Alerta/Ressalva para revisão.
    *   🔴 **Copyleft Estrito / Proibidas (GPL v3, AGPL, CC BY-NC):** Bloqueio imediato do pipeline de CI/CD.
*   **Cláusula de Governança Executiva (Termo de Aceite de Risco - TAR):** Se necessidades públicas críticas ou prazos institucionais colidirem com vetos técnicos da esteira automatizada de auditoria, a Diretoria Executiva poderá autorizar a implantação mediante assinatura digital do Termo de Aceite de Risco (TAR), eximindo a equipe técnica e registrando o rastro formal de governança.

## 7. Definições Estritas de Stack e Conexão Dinâmica (Suplemento IA)
Para evitar alucinações ou variações na geração de código pela IA, as seguintes definições tecnológicas são obrigatórias:
*   **Gerenciamento de Estado Global (/src/store):** Use única e exclusivamente Zustand. É proibido o uso de Context API nativo para estados globais complexos ou inicialização de banco. O store deve gerenciar: o token do usuário, o objeto de permissões (RBAC), as subscrições ativas em tempo real (`onSnapshot`) e as instâncias dinâmicas do Firebase conectadas.
*   **Estilização e Componentes:** Baseados em Tailwind CSS. Respeitar rigorosamente tags semânticas HTML5 puras para cumprir os requisitos do e-MAG/Acessibilidade.
*   **Arquitetura Multi-Database (Silo Pattern):** A infraestrutura é composta por 1 Firebase Central (Control Plane) e 25 Firebases Departamentais Isolados (Data Plane).
*   **Acoplamento Inverso na Camada /src/api:** É terminantemente proibido importar instâncias estáticas do Firestore (`import { db } from...`) dentro dos arquivos de rota ou de busca de dados. Todas as funções do diretório `/src/api` devem ser fábricas puras (Factory Pattern) que aceitam a instância do banco ativa como argumento passado pelo Zustand.

## 8. Plano Cronológico de Execução (Roadmap de Engenharia)
O desenvolvimento do sistema deve seguir estritamente a ordem de dependência técnica abaixo. O agente deve recusar criar elementos de passos avançados se os passos anteriores não estiverem implementados e consolidados:
*   **Passo 1: Construir o Cérebro (Firebase Central):** Escopo: Modelagem e criação das coleções de controle global (`users`, `tenants`, `roles_permissions` e `access_requests`) no Firebase Central.
*   **Passo 2: Criar a "Catraca Inteligente" (Login e Roteamento):** Escopo: Tela de login unificada batendo no Firebase Central. Configuração do Zustand para capturar metadados do tenant e inicializar dinamicamente a conexão com o Firebase do departamento correspondente.
*   **Passo 3: O Fluxo de Entrada (Pedido de Acesso e Aprovação):** Escopo: Tela pública de solicitação de acesso para cidadãos/servidores e painel administrativo de aprovação com atribuição de papéis (RBAC).
*   **Passo 4: A Fábrica de Bancos (Automação dos 25 Silos):** Escopo: Escrita de scripts de automação via Firebase CLI para replicação em lote de índices e regras de segurança (`firestore.rules`) idênticas para todos os 25 bancos departamentais.

## 9. Regras Específicas de IAM (Identity and Access Management)
*   **Visibilidade de Administradores:** Administradores (ADMIN) devem **sempre** ter acesso de leitura à lista global de usuários do Firebase Central para que a lógica de filtragem local (via Zustand/frontend) aplique as regras de negócio corretamente. Isso é obrigatório porque usuários no status `PENDING_APPROVAL` não possuem um `departmentId` atrelado no momento da solicitação. Nunca restrinja o fetch inicial de `users` pelo `departmentId` ou `tenantId` na camada de API (`iam.api.ts`), pois isso impedirá os administradores de enxergarem os novos pedidos de acesso. A exclusão visual e o mascaramento de PII de usuários fora da área de atuação do ADMIN ocorrem de forma determinística no frontend (`filterUsers`).
*   **Vínculo Restrito:** Ao aprovar usuários, a UI deve garantir que os administradores listem apenas os departamentos contidos na sua `assignedArea`.

## 10. Travas Invioláveis de Codificação (Sincronização com Auditoria GEMS)
Todo código gerado deve atender cumulativamente aos seguintes requisitos sintáticos sob pena de rejeição automática na esteira de CI/CD:
1.  **Autenticação Volátil no Cliente:**
    *   A inicialização do SDK do Firebase Auth no cliente deve obrigatoriamente declarar `inMemoryPersistence`.
    *   É terminantemente proibido injetar condicionais de mock (`TEST_MFA_BACKDOOR`), senhas estáticas de teste (`000000`) ou desvios de autenticação no código-fonte ativo.
2.  **Segurança de Subscrições Real-Time (Zustand & onSnapshot):**
    *   O manipulador `onSnapshot` deve ser isolado exclusivamente na Zustand Store.
    *   As subscrições (`onSnapshot`) NUNCA devem ser disparadas enquanto o estado de autenticação do usuário for nulo (`user === null`), garantindo alinhamento estrito com a validação `request.auth != null` contida no `firestore.rules`.
    *   No callback de tratamento de erros do `onSnapshot` (ex: falhas de permissão como `permission-denied`), é MANDATÓRIO executar explicitamente a função de limpeza `unsubscribe()` para zerar os ponteiros e evitar vazamento de memória Heap.
3.  **Inviolabilidade de Erros, Telemetria e Silos:**
    *   É proibido passar objetos de erro brutos (`console.error(error)`) diretamente para o console do navegador ou sistemas de telemetria. Exige-se a extração prévia por Whitelisting apenas dos atributos seguros (`name`, `message`, `code`).
    *   É estritamente proibido processar ou emitir em logs qualquer string contendo o caractere `@` (indicador de PII/e-mail) sem passar obrigatoriamente por função de Hashing SHA-256 com salt determinístico.
    *   É proibido o uso de valores estáticos como fallback para identificadores de banco NoSQL (ex: `let dbId = tenantId || 'default'`). Se o identificador do banco for nulo, disparar uma exceção de infraestrutura controlada.
4.  **Tráfego de Rede e Validação de Fronteira:**
    *   Qualquer payload enviado ou recebido via `fetch` ou `axios` deve passar obrigatoriamente pelo método `.parse()` ou `.safeParse()` do respectivo esquema Zod antes de ser consumido ou transmitido.
5.  **Proibição Absoluta de Manipulação de Cookies no Cliente:**
    *   É TERMINANTEMENTE PROIBIDO utilizar `document.cookie` ou seletores como `document.cookie.match()` no front-end.
    *   Sessões e tokens são 100% invisíveis à camada de apresentação e gerenciados de forma volátil dentro da Zustand Store ou via cookies blindados HttpOnly/Secure manipulados exclusivamente pelo backend Express.
6.  **Parametrização Estrita do Motor Gemini no Backend:**
    *   Qualquer integração do modelo Gemini 3.1 Pro no backend (`src/services/gemini-client.service.ts`) deve ser instanciada declarando obrigatoriamente os hiperparâmetros determinísticos:
        *   `temperature: 0.0`
        *   `topP: 0.2`
        *   `topK: 20`
        *   `responseMimeType: "application/json"`
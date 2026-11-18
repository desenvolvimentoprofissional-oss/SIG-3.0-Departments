import React from 'react';

export const PAGE_INFOS: Record<string, React.ReactNode> = {
  avisos: (
    <div className="space-y-4">
      <p>
        O módulo <strong>Avisos</strong> centraliza a gestão de comunicados corporativos e alertas estratégicos na plataforma. Esta ferramenta garante que diretrizes e informes operacionais cheguem às equipes corretas no momento adequado. O sistema suporta a exibição de múltiplos avisos simultaneamente.
      </p>
      
      <div className="bg-[var(--color-background-main)] p-4 rounded-xl border border-[var(--color-border-default)]">
        <h3 className="font-semibold text-[var(--color-content-primary)] mb-2 flex items-center gap-2">
          <span className="text-[16px]" role="img" aria-label="Alvo">🎯</span>
          Escopo e Visibilidade
        </h3>
        <ul className="list-disc pl-5 space-y-1.5 marker:text-[var(--color-content-tertiary)]">
          <li>Exibição em destaque na tela principal de todos os usuários impactados.</li>
          <li>Usuários <strong>Master</strong> podem criar comunicados globais, para toda a organização.</li>
          <li><strong>Administradores</strong> gerenciam apenas os avisos da sua área ou departamento específico.</li>
          <li><strong>Colaboradores</strong> visualizam os avisos e podem interagir ocultando-os ou marcando como "Entendi".</li>
        </ul>
      </div>
      
      <div className="bg-[var(--color-background-main)] p-4 rounded-xl border border-[var(--color-border-default)]">
        <h3 className="font-semibold text-[var(--color-content-primary)] mb-2 flex items-center gap-2">
          <span className="text-[16px]" role="img" aria-label="Notificação">🔔</span>
          Tipos de Avisos
        </h3>
        <ul className="space-y-2 text-[13px]">
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 mt-1.5 rounded-full bg-[var(--color-status-error)] shrink-0" />
            <span><strong>Erro (Vermelho):</strong> Alertas críticos e urgentes.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 mt-1.5 rounded-full bg-[var(--color-status-warning)] shrink-0" />
            <span><strong>Alerta (Amarelo):</strong> Avisos importantes e atenção a prazos.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 mt-1.5 rounded-full bg-[var(--color-status-info)] shrink-0" />
            <span><strong>Informativo (Azul):</strong> Notícias, comunicados e atualizações gerais.</span>
          </li>
        </ul>
      </div>

      <div className="bg-[var(--color-background-main)] p-4 rounded-xl border border-[var(--color-border-default)]">
        <h3 className="font-semibold text-[var(--color-content-primary)] mb-2 flex items-center gap-2">
          <span className="text-[16px]" role="img" aria-label="Calendário">📅</span>
          Agendamento e Automatização
        </h3>
        <p>
          Você pode programar o ciclo de vida completo do aviso definindo suas datas de início e de fim. A exibição e a retirada dos alertas do painel ocorrem de maneira totalmente automática, sem demandar um esforço extra.
        </p>
      </div>
    </div>
  ),
  banners: (
    <div className="space-y-4">
      <p>
        O módulo <strong>Banners</strong> permite controlar os banners promocionais e informativos exibidos na tela de login e nos painéis principais da plataforma. Mantenha a comunicação visual da instituição sempre atualizada e engajadora.
      </p>
      
      <div className="bg-[var(--color-background-main)] p-4 rounded-xl border border-[var(--color-border-default)]">
        <h3 className="font-semibold text-[var(--color-content-primary)] mb-2 flex items-center gap-2">
          <span className="text-[16px]" role="img" aria-label="Imagem">🖼️</span>
          Personalização Visual
        </h3>
        <ul className="list-disc pl-5 space-y-1.5 marker:text-[var(--color-content-tertiary)]">
          <li>Envie e recorte imagens em tempo real para os banners.</li>
          <li>Defina títulos chamativos e descrições curtas para engajar os usuários.</li>
          <li>Ajuste a cor e a intensidade da sobreposição (overlay) para garantir que os textos permaneçam legíveis sobre qualquer imagem.</li>
          <li>Defina a posição e o alinhamento dos elementos de texto na imagem.</li>
        </ul>
      </div>
      
      <div className="bg-[var(--color-background-main)] p-4 rounded-xl border border-[var(--color-border-default)]">
        <h3 className="font-semibold text-[var(--color-content-primary)] mb-2 flex items-center gap-2">
          <span className="text-[16px]" role="img" aria-label="Link">🔗</span>
          Ações e Redirecionamento
        </h3>
        <ul className="list-disc pl-5 space-y-1.5 marker:text-[var(--color-content-tertiary)]">
          <li>Adicione botões de ação (Call to Action) com textos customizáveis.</li>
          <li>Direcione os usuários para links externos ou páginas internas do sistema de forma fluida.</li>
        </ul>
      </div>

      <div className="bg-[var(--color-background-main)] p-4 rounded-xl border border-[var(--color-border-default)]">
        <h3 className="font-semibold text-[var(--color-content-primary)] mb-2 flex items-center gap-2">
          <span className="text-[16px]" role="img" aria-label="Calendário">📅</span>
          Agendamento de Banners
        </h3>
        <p>
          A gestão de banners suporta programação por datas. Defina quando um banner deve começar a ser exibido e quando deve sair do ar, permitindo programar campanhas com antecedência.
        </p>
      </div>
    </div>
  ),
  iam: "Gestão de Identidade e Acessos (IAM): Módulo crítico para administração de usuários, papéis e permissões multitenant. Aqui você controla quem tem acesso a quais recursos do SIG, respeitando o princípio do menor privilégio (Zero Trust). Aprove novos cadastros, defina usuários como Master, Administrador, Colaborador ou Convidado (Guest), e vincule-os a departamentos específicos. O sistema garante total isolamento de dados departamentais, bloqueando modificações não autorizadas e mantendo o compliance com a LGPD e normas de segurança.",
  style: "Guia de Estilos (Design System): Referência central para a identidade visual do SIG 3.0. Esta página documenta todos os tokens de design, paletas de cores, tipografia, espaçamentos e componentes de interface (UI) padronizados. Essencial para desenvolvedores e designers garantirem consistência visual e usabilidade em toda a plataforma, em conformidade com as diretrizes de acessibilidade (WCAG). Mantenha a estética refinada, minimalista e focada na experiência do usuário.",
  departamentosAdmin: "Gestão de Departamentos: Estrutura organizacional e arquitetura multi-tenant da plataforma. Gerencie a criação de novos departamentos, associando-os a áreas temáticas e atribuindo ícones representativos. Cada departamento atua como um silo independente de dados (Data Plane), assegurando que informações sejam processadas e armazenadas com isolamento estrito de permissões. A configuração inicial de um departamento também inclui o provisionamento automático de suas instâncias de banco de dados e regras de segurança associadas.",
  mapeamento: "Mapeamento de Dados (BaaS): Interface técnica avançada para integração de dados departamentais. Permite configurar o De/Para entre as tabelas e views do banco de dados legado (ERP) e as coleções Firestore isoladas de cada departamento. Defina permissões de leitura, escrita e criação de processos, além de configurar relatórios, gráficos dinâmicos e colunas de Kanban. Essa flexibilidade elimina a necessidade de hardcoding no frontend, suportando a arquitetura Data-Driven e a geração dinâmica de interfaces."
};

export const resolvePageInfo = (currentView: string): React.ReactNode => {
  if (PAGE_INFOS[currentView]) return PAGE_INFOS[currentView];

  if (currentView.startsWith("page_")) {
    return "Visualização Dinâmica: Esta página foi gerada automaticamente com base nas configurações de mapeamento de dados (BaaS) definidas para esta coleção. Aqui você pode visualizar, filtrar e interagir com os dados injetados pelo backend, respeitando as permissões granulares de acesso (leitura, edição, exclusão e alteração de status) do seu perfil. A interface se adapta aos tipos de campos mapeados (texto, relacional, status), garantindo uma experiência otimizada e consistente sem a necessidade de codificação manual.";
  }

  return "Informações Gerais: Você está acessando uma visão departamental ou módulo específico. Consulte o gestor da área para obter mais detalhes sobre as regras de negócio e fluxos de processo atrelados a esta visão. Todas as ações realizadas nesta área estão sujeitas às políticas de governança de dados, isolamento de acessos e auditoria da plataforma SIG 3.0.";
};

const fs = require('fs');
const path = require('path');

const replacements = [
  {
    file: './front-end-client/src/components/ui/Select.tsx',
    changes: [{ from: 'aria-label="Options"', to: 'aria-label="Opções"' }]
  },
  {
    file: './front-end-client/src/components/ui/Slideover.tsx',
    changes: [{ from: 'aria-label="Close modal overlay"', to: 'aria-label="Fechar sobreposição do modal"' }]
  },
  {
    file: './front-end-client/src/components/ui/BannerItemCard.tsx',
    changes: [
      { from: 'aria-label="Edit banner"', to: 'aria-label="Editar banner"' },
      { from: 'aria-label="Delete banner"', to: 'aria-label="Excluir banner"' }
    ]
  },
  {
    file: './front-end-client/src/components/ui/CollapsibleCard.tsx',
    changes: [{ from: 'aria-label="Additional information"', to: 'aria-label="Informação adicional"' }]
  },
  {
    file: './front-end-client/src/components/ui/NoticeItemCard.tsx',
    changes: [
      { from: 'aria-label="Error"', to: 'aria-label="Erro"' },
      { from: 'aria-label="Warning"', to: 'aria-label="Aviso"' },
      { from: 'aria-label="Information"', to: 'aria-label="Informação"' }
    ]
  },
  {
    file: './front-end-client/src/components/views/PageInfoContent.tsx',
    changes: [
      { from: 'aria-label="Target"', to: 'aria-label="Alvo"' },
      { from: 'aria-label="Notification"', to: 'aria-label="Notificação"' },
      { from: 'aria-label="Calendar"', to: 'aria-label="Calendário"' },
      { from: 'aria-label="Image"', to: 'aria-label="Imagem"' },
      { from: 'aria-label="Link"', to: 'aria-label="Link"' }
    ]
  },
  {
    file: './front-end-client/src/components/views/MappedPageDetailsSlideOver.tsx',
    changes: [{ from: 'aria-label="Close"', to: 'aria-label="Fechar"' }]
  },
  {
    file: './front-end-client/src/components/layout/NoticePopup.tsx',
    changes: [
      { from: 'aria-label="Error"', to: 'aria-label="Erro"' },
      { from: 'aria-label="Warning"', to: 'aria-label="Aviso"' },
      { from: 'aria-label="Information"', to: 'aria-label="Informação"' }
    ]
  },
  {
    file: './front-end-client/src/components/layout/PageInfoModal.tsx',
    changes: [
      { from: 'aria-label="Yes, helpful"', to: 'aria-label="Sim, útil"' },
      { from: 'aria-label="No, not helpful"', to: 'aria-label="Não, não foi útil"' }
    ]
  },
  {
    file: './front-end-client/src/components/layout/AppHeader.tsx',
    changes: [
      { from: 'aria-label="Open search"', to: 'aria-label="Abrir pesquisa"' },
      { from: 'aria-label="Log out"', to: 'aria-label="Sair"' }
    ]
  },
  {
    file: './front-end-client/src/components/iam/UsersTable.tsx',
    changes: [{ from: 'aria-label="Edit"', to: 'aria-label="Editar"' }]
  },
  {
    file: './front-end-client/src/pages/mapeamento/components/ObservationConfiguration.tsx',
    changes: [
      { from: 'placeholder="E.g.: Friendly Label"', to: 'placeholder="Ex: Rótulo Amigável"' },
      { from: 'placeholder="E.g.: Pending, Completed"', to: 'placeholder="Ex: Pendente, Concluído"' }
    ]
  },
  {
    file: './front-end-client/src/pages/mapeamento/components/SharePageIndividualTab.tsx',
    changes: [{ from: 'placeholder="Add people..."', to: 'placeholder="Adicionar pessoas..."' }]
  },
  {
    file: './front-end-client/src/pages/mapeamento/components/SecondaryFieldsSection.tsx',
    changes: [
      { from: 'placeholder="E.g.: Friendly Label"', to: 'placeholder="Ex: Rótulo Amigável"' },
      { from: 'placeholder="E.g.: Pending, Completed, Under Review"', to: 'placeholder="Ex: Pendente, Concluída, Em Revisão"' },
      { from: 'placeholder="E.g.: Academic Information"', to: 'placeholder="Ex: Informação Acadêmica"' },
      { from: 'placeholder="E.g.: Expected Date"', to: 'placeholder="Ex: Data Prevista"' }
    ]
  },
  {
    file: './front-end-client/src/pages/departamentos/components/ShareAccessModal.tsx',
    changes: [{ from: 'placeholder="Search by name or email..."', to: 'placeholder="Pesquisar por nome ou e-mail..."' }]
  },
  {
    file: './front-end-client/src/pages/style-guide/components/FormControlsSection.tsx',
    changes: [
      { from: 'placeholder="Search by name, email or ID..."', to: 'placeholder="Pesquisar por nome, e-mail ou ID..."' },
      { from: 'placeholder="Describe the justification for the audit..."', to: 'placeholder="Descreva a justificativa para a auditoria..."' }
    ]
  },
  {
    file: './front-end-client/src/components/views/notice/NoticeForm.tsx',
    changes: [
      { from: 'placeholder="Important notice..."', to: 'placeholder="Aviso importante..."' },
      { from: 'placeholder="Notice details..."', to: 'placeholder="Detalhes do aviso..."' }
    ]
  },
  {
    file: './front-end-client/src/components/views/kanban/AddColumnCard.tsx',
    changes: [{ from: 'placeholder="COLUMN NAME"', to: 'placeholder="NOME DA COLUNA"' }]
  },
  {
    file: './front-end-client/src/components/views/MeuControlePanel.tsx',
    changes: [{ from: 'placeholder="Add a new observation to history..."', to: 'placeholder="Adicione uma nova observação ao histórico..."' }]
  },
  {
    file: './front-end-client/src/components/views/banners/BannerForm.tsx',
    changes: [
      { from: 'placeholder="Campaign title..."', to: 'placeholder="Título da campanha..."' },
      { from: 'placeholder="Banner details..."', to: 'placeholder="Detalhes do banner..."' },
      { from: 'placeholder="E.g.: New"', to: 'placeholder="Ex: Novo"' },
      { from: 'placeholder="E.g.: Learn more"', to: 'placeholder="Ex: Saiba mais"' }
    ]
  },
  {
    file: './front-end-client/src/components/layout/CreateDepartmentModal.tsx',
    changes: [{ from: 'placeholder="E.g.: IT Department"', to: 'placeholder="Ex: Departamento de TI"' }]
  },
  {
    file: './front-end-client/src/components/iam/CreateUserModal.tsx',
    changes: [
      { from: 'placeholder="E.g.: John Doe"', to: 'placeholder="Ex: João Silva"' },
      { from: 'placeholder="email@example.com"', to: 'placeholder="email@exemplo.com"' }
    ]
  },
  {
    file: './front-end-client/src/templates/partials/CadastroFormFields.tsx',
    changes: [
      { from: 'placeholder="E.g.: John Doe"', to: 'placeholder="Ex: João Silva"' },
      { from: 'placeholder="Fill in the value..."', to: 'placeholder="Preencha o valor..."' }
    ]
  }
];

let totalChanges = 0;
for (const rep of replacements) {
  if (fs.existsSync(rep.file)) {
    let content = fs.readFileSync(rep.file, 'utf8');
    let original = content;
    for (const change of rep.changes) {
      content = content.split(change.from).join(change.to);
    }
    if (content !== original) {
      fs.writeFileSync(rep.file, content);
      console.log(`Updated ${rep.file}`);
      totalChanges++;
    } else {
      console.log(`No changes made to ${rep.file}`);
    }
  } else {
    console.log(`Not found ${rep.file}`);
  }
}
console.log(`\nSuccess: Applied ${totalChanges} files.`);

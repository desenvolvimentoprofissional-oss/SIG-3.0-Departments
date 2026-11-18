const fs = require('fs');
const path = require('path');

const replacements = [
  {
    file: './front-end-client/src/components/layout/AppHeader.tsx',
    changes: [
      { from: 'content="Search"', to: 'content="Pesquisar"' },
      { from: 'content="Logout"', to: 'content="Sair"' },
      { from: 'title="Filters"', to: 'title="Filtros"' },
      { from: 'title="Notifications"', to: 'title="Notificações"' },
      { from: 'title="Page information"', to: 'title="Informações da página"' }
    ]
  },
  {
    file: './front-end-client/src/components/views/MappedPageToolbar.tsx',
    changes: [
      { from: 'content="Form"', to: 'content="Formulário"' },
      { from: 'content="Dashboard"', to: 'content="Dashboard"' },
      { from: 'content="Board"', to: 'content="Quadro"' },
      { from: 'content="Calendar"', to: 'content="Calendário"' },
      { from: 'content="Table"', to: 'content="Tabela"' },
      { from: 'content="Matrix"', to: 'content="Matriz"' },
      { from: 'content="Audit"', to: 'content="Auditoria"' }
    ]
  },
  {
    file: './front-end-client/src/components/views/ToolbarFilters.tsx',
    changes: [
      { from: 'content="Collections"', to: 'content="Coleções"' },
      { from: 'content="Groupings"', to: 'content="Agrupamentos"' },
      { from: 'content="Filters"', to: 'content="Filtros"' },
      { from: 'content="My Processes"', to: 'content="Meus Processos"' }
    ]
  },
  {
    file: './front-end-client/src/components/layout/SidebarNavigationGroup.tsx',
    changes: [
      { from: 'title="Drag to reorder"', to: 'title="Arraste para reordenar"' }
    ]
  },
  {
    file: './front-end-client/src/components/layout/CreateDepartmentModal.tsx',
    changes: [
      { from: 'title="New Department"', to: 'title="Novo Departamento"' }
    ]
  },
  {
    file: './front-end-client/src/components/layout/SidebarHeader.tsx',
    changes: [
      { from: 'title="Expand Menu"', to: 'title="Expandir Menu"' },
      { from: 'title="Collapse Menu"', to: 'title="Recolher Menu"' }
    ]
  },
  {
    file: './front-end-client/src/components/views/kanban/KanbanCard.tsx',
    changes: [
      { from: 'title="Copy process number"', to: 'title="Copiar número do processo"' },
      { from: 'title="Copy document"', to: 'title="Copiar documento"' }
    ]
  },
  {
    file: './front-end-client/src/components/views/kanban/AddColumnCard.tsx',
    changes: [
      { from: 'title="Add Custom Column"', to: 'title="Adicionar Coluna Customizada"' }
    ]
  },
  {
    file: './front-end-client/src/components/views/calendar/MonthViewGrid.tsx',
    changes: [
      { from: 'title="Expand Day to Weekly View"', to: 'title="Expandir para Visão Semanal"' }
    ]
  },
  {
    file: './front-end-client/src/components/views/calendar/CalendarCard.tsx',
    changes: [
      { from: 'title="Copy Process"', to: 'title="Copiar Processo"' },
      { from: 'title="Reset Date"', to: 'title="Redefinir Data"' },
      { from: 'title="Copy Document"', to: 'title="Copiar Documento"' }
    ]
  },
  {
    file: './front-end-client/src/components/views/DepartmentManagementSlideover.tsx',
    changes: [
      { from: 'title="Delete Department"', to: 'title="Excluir Departamento"' }
    ]
  },
  {
    file: './front-end-client/src/components/ui/NoticeItemCard.tsx',
    changes: [
      { from: 'title="Drag to reorder"', to: 'title="Arraste para reordenar"' },
      { from: 'title="Notice creator"', to: 'title="Criador do aviso"' },
      { from: 'title="Edit"', to: 'title="Editar"' },
      { from: 'title="Delete"', to: 'title="Excluir"' }
    ]
  },
  {
    file: './front-end-client/src/components/ui/BannerItemCard.tsx',
    changes: [
      { from: 'title="Edit"', to: 'title="Editar"' },
      { from: 'title="Delete"', to: 'title="Excluir"' }
    ]
  },
  {
    file: './front-end-client/src/components/auth/DocumentModal.tsx',
    changes: [
      { from: 'title="Decrease font size"', to: 'title="Diminuir fonte"' },
      { from: 'title="Increase font size"', to: 'title="Aumentar fonte"' },
      { from: 'title="Dark Mode"', to: 'title="Modo Escuro"' },
      { from: 'title="High Contrast"', to: 'title="Alto Contraste"' },
      { from: 'title="Reset view"', to: 'title="Redefinir visualização"' },
      { from: 'title="Close"', to: 'title="Fechar"' }
    ]
  }
];

for (const rep of replacements) {
  if (fs.existsSync(rep.file)) {
    let content = fs.readFileSync(rep.file, 'utf8');
    for (const change of rep.changes) {
      content = content.split(change.from).join(change.to);
    }
    fs.writeFileSync(rep.file, content);
    console.log(`Updated ${rep.file}`);
  } else {
    console.log(`Not found ${rep.file}`);
  }
}

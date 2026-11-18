const fs = require('fs');

const replacements = [
  {
    file: './front-end-client/src/pages/mapeamento/components/SortableContentItem.tsx',
    changes: [
      { from: 'placeholder="E.g.: New Project"', to: 'placeholder="Ex: Novo Projeto"' },
      { from: 'placeholder="E.g.: 2026 or 10/10/2026"', to: 'placeholder="Ex: 2026 ou 10/10/2026"' },
      { from: 'placeholder="E.g.: Access Document"', to: 'placeholder="Ex: Documento de Acesso"' }
    ]
  },
  {
    file: './front-end-client/src/pages/mapeamento/components/UniversalFiltersSection.tsx',
    changes: [
      { from: 'placeholder="E.g.: 2026"', to: 'placeholder="Ex: 2026"' }
    ]
  },
  {
    file: './front-end-client/src/pages/mapeamento/components/DispatchConfiguration.tsx',
    changes: [
      { from: 'placeholder="E.g.: General Secretariat, Board, Legal Department"', to: 'placeholder="Ex: Secretaria Geral, Diretoria, Departamento Jurídico"' },
      { from: 'placeholder="E.g.: IN TRANSIT (OUTBOUND)"', to: 'placeholder="Ex: EM TRÂNSITO (SAÍDA)"' },
      { from: 'placeholder="E.g.: UNDER REVIEW"', to: 'placeholder="Ex: EM ANÁLISE"' }
    ]
  },
  {
    file: './front-end-client/src/pages/mapeamento/components/RelationalConfigSection.tsx',
    changes: [
      { from: 'placeholder="E.g.: trade_name"', to: 'placeholder="Ex: nome_fantasia"' },
      { from: 'placeholder="E.g.: heiName"', to: 'placeholder="Ex: nomeIES"' },
      { from: 'placeholder="E.g.: linkedTo"', to: 'placeholder="Ex: vinculadoA"' }
    ]
  },
  {
    file: './front-end-client/src/pages/mapeamento/components/VotingConfiguration.tsx',
    changes: [
      { from: 'placeholder="E.g.: Approved, Rejected, Review"', to: 'placeholder="Ex: Aprovado, Rejeitado, Revisão"' }
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
    }
  }
}
console.log(`\nSuccess: Applied ${totalChanges} files.`);

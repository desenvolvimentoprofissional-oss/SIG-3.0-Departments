import React from 'react';

interface CadastroFormListProps {
  filteredData: any[];
  mapping: any;
  activeCollection: any;
  selectedRecordId: string | null;
  isCreating: boolean;
  setSelectedRecordId: (id: string | null) => void;
  setIsCreating: (v: boolean) => void;
}

export const CadastroFormList: React.FC<CadastroFormListProps> = ({
  filteredData,
  mapping,
  activeCollection,
  selectedRecordId,
  isCreating,
  setSelectedRecordId,
  setIsCreating
}) => {
  return (
    <div className="w-72 sm:w-80 border-r border-[var(--color-border-default)] bg-white flex flex-col z-10 flex-shrink-0 overflow-hidden h-full">
      <div className="flex-1 overflow-y-auto hidden-scrollbar">
        {filteredData.length > 0 ? (
          <ul className="divide-y divide-[var(--color-border-default)]">
            {filteredData.map(item => {
              const itemCol = mapping.viewConfig || (mapping.collections || []).find((c: any) => c.collectionName === item._collection) || activeCollection;
              const iNameField = itemCol.primaryFields?.name;
              const iCpfField = itemCol.primaryFields?.cpfCnpj;
              const iStatusField = itemCol.primaryFields?.status;

              return (
                <li key={item._id}>
                  <button
                    onClick={() => { setSelectedRecordId(item._id); setIsCreating(false); }}
                    className={`w-full text-left p-4 transition-colors hover:bg-[var(--color-background-light)] ${selectedRecordId === item._id && !isCreating ? 'bg-[var(--color-brand-main)]/5 border-l-4 border-[var(--color-brand-main)]' : 'border-l-4 border-transparent'}`}
                  >
                    <p className="text-sm font-semibold text-[var(--color-content-primary)] truncate">
                      {(iNameField ? item[iNameField] : '') || 'Sem Nome'}
                    </p>
                    <p className="text-xs text-[var(--color-content-secondary)] mt-1">
                      {iCpfField && item[iCpfField] ? `Doc: ${item[iCpfField]}` : 'Sem Documento'}
                    </p>
                    <div className="mt-2 flex items-center">
                       <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                          iStatusField && item[iStatusField] === 'Ativo' ? 'bg-green-100 text-green-700' : 
                          iStatusField && item[iStatusField] === 'Inativo' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                       }`}>
                         {(iStatusField ? item[iStatusField] : '') || 'N/I'}
                       </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-8 text-center text-[var(--color-content-secondary)] text-sm">
            Nenhum registro encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

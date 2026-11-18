import React from 'react';
import { X, FileText, ExternalLink } from 'lucide-react';
import { TenantConfig } from '../../types/index';
import { MappedPageDispatchForm } from './MappedPageDispatchForm';
import { MappedPageCustomActions } from './MappedPageCustomActions';
import { MeuControlePanel } from './MeuControlePanel';
import { getNestedValue } from '../../templates/partials/DataGridRow';

interface MappedPageDetailsSlideOverProps {
  tenant: TenantConfig;
  selectedItem: any;
  onClose: () => void;
}

export const MappedPageDetailsSlideOver: React.FC<MappedPageDetailsSlideOverProps> = ({ tenant, selectedItem, onClose }) => {
  if (!selectedItem) return null;

  return (
    <>
      <button type="button" className="fixed inset-0 w-full h-full cursor-default bg-black/20 backdrop-blur-sm z-40 transition-opacity border-none outline-none p-0" onClick={onClose} aria-label="Fechar" />
      <div className="fixed inset-y-0 right-0 w-full md:w-[640px] max-w-full bg-[var(--color-content-inverse)] border-l border-[var(--color-border-default)] shadow-2xl z-50 overflow-y-auto animate-slideInRight flex flex-col">
         <div className="p-6 border-b border-[var(--color-border-default)] flex justify-between items-start bg-[var(--color-background-light)]/50 sticky top-0 z-10 hidden-scrollbar">
            <div>
               <h3 className="text-lg font-bold text-[var(--color-brand-dark)]">{selectedItem[(selectedItem._colConfig?.primaryFields?.name || selectedItem._mapping?.viewConfig?.primaryFields?.name)] || 'Detalhes do Registro'}</h3>
               <p className="text-sm text-[var(--color-content-secondary)] mt-1">Coleção: {selectedItem._collection?.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase())}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-[var(--color-content-inverse)] border border-[var(--color-border-default)] rounded-full text-[var(--color-content-tertiary)] hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <X size={18} />
            </button>
         </div>
         
         <div className="p-6 space-y-6 flex-1 pt-6 text-[var(--color-content-primary)]">

            <MeuControlePanel tenant={tenant} selectedItem={selectedItem} />

            {((selectedItem._colConfig?.components?.enableDispatchSystem) || (selectedItem._colConfig?.enableDispatchSystem)) && (
              <MappedPageDispatchForm tenant={tenant} selectedItem={selectedItem} />
            )}

            <MappedPageCustomActions selectedItem={selectedItem} />

            {selectedItem._colConfig?.secondaryFieldsReadOnly?.length > 0 && (
              <div>
                <h4 className="text-xs uppercase font-bold text-[var(--color-content-secondary)] mb-3 pt-2 border-t border-[var(--color-border-default)] flex items-center mt-2">
                  <FileText size={14} className="mr-1" /> Campos de Leitura
                </h4>
                <div className="space-y-3">
                  {selectedItem._colConfig?.secondaryFieldsReadOnly.map((f: any) => {
                    const val = getNestedValue(selectedItem, f.field);
                    return (
                    <div key={f.id} className="bg-[var(--color-background-light)] p-3 rounded-lg border border-[var(--color-border-default)]">
                      <p className="text-xs text-[var(--color-content-tertiary)]">{f.label}</p>
                      <div className="text-sm mt-1 text-[var(--color-content-primary)]">
                        {f.type === 'link' && val ? (
                          <a href={String(val)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded bg-[var(--color-brand-light)] text-[var(--color-brand-main)] hover:opacity-80 transition-opacity border border-[var(--color-brand-main)]/20 mt-1">
                            Acessar Link <ExternalLink size={12} className="ml-1.5" />
                          </a>
                        ) : f.type === 'date' && val
                          ? new Date(val).toLocaleDateString('pt-BR')
                          : f.type === 'boolean'
                            ? (val ? 'Sim' : 'Não')
                            : val !== undefined && val !== null && val !== ''
                              ? String(val) 
                              : <span className="italic text-gray-400">Vazio</span>}
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}
         </div>
      </div>
    </>
  );
};


import React from 'react';
import { User, MapPin, FileText } from 'lucide-react';
import { Input } from '../../components/ui/Input';

interface CadastroFormFieldsProps {
  activeFormTab: string;
  isCreating: boolean;
  selectedItem: any;
  nameField: string;
  cpfField: string;
  statusField: string;
  activeCollection: any;
}

export const CadastroFormFields: React.FC<CadastroFormFieldsProps> = ({
  activeFormTab,
  isCreating,
  selectedItem,
  nameField,
  cpfField,
  statusField,
  activeCollection
}) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-6 pb-24">
      {activeFormTab === 'Dados Principais' && (
        <div className="bg-white rounded-xl border border-[var(--color-border-default)] shadow-sm overflow-hidden mb-6">
           <div className="bg-[var(--color-background-light)] px-6 py-3 border-b border-[var(--color-border-default)] flex items-center">
              <User size={16} className="text-[var(--color-brand-main)] mr-2"/>
              <h3 className="text-sm font-bold text-[var(--color-content-primary)] uppercase tracking-wider">Dados Principais</h3>
           </div>
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-content-secondary)] mb-1">Nome Completo / Razão Social</label>
                <Input 
                   defaultValue={!isCreating && selectedItem ? selectedItem[nameField] : ''} 
                   placeholder="Ex: João Silva"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-content-secondary)] mb-1">CPF / CNPJ</label>
                <Input 
                   defaultValue={!isCreating && selectedItem ? selectedItem[cpfField] : ''} 
                   placeholder="000.000.000-00"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-content-secondary)] mb-1">Status do Registro</label>
                <select className="w-full text-sm p-2.5 border border-[var(--color-border-default)] rounded bg-[var(--color-background-main)] text-[var(--color-content-primary)] focus:border-[var(--color-brand-main)] outline-none transition-colors" defaultValue={!isCreating && selectedItem ? selectedItem[statusField] : 'Ativo'}>
                   <option value="Ativo">Ativo</option>
                   <option value="Inativo">Inativo</option>
                   <option value="Pendente">Pendente</option>
                </select>
              </div>
           </div>
        </div>
      )}

      {activeCollection.secondaryFieldsEditable?.filter((f: any) => (!f.section && activeFormTab === 'Dados Principais') || f.section === activeFormTab).length > 0 && (
        <div className="bg-white rounded-xl border border-[var(--color-border-default)] shadow-sm overflow-hidden mb-6">
           <div className="bg-[var(--color-background-light)] px-6 py-3 border-b border-[var(--color-border-default)] flex items-center">
              <MapPin size={16} className="text-[var(--color-brand-main)] mr-2"/>
              <h3 className="text-sm font-bold text-[var(--color-content-primary)] uppercase tracking-wider">
                {activeFormTab === 'Dados Principais' ? 'Dados Adicionais Mapeados' : activeFormTab}
              </h3>
           </div>
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCollection.secondaryFieldsEditable.filter((f: any) => (!f.section && activeFormTab === 'Dados Principais') || f.section === activeFormTab).map((f: any) => (
                 <div key={f.id} className="md:col-span-1">
                   <label className="block text-xs font-semibold text-[var(--color-content-secondary)] mb-1">{f.label}</label>
                   {f.type === 'select' ? (
                      <select
                        className="w-full h-10 bg-[var(--color-content-inverse)] border border-[var(--color-border-default)] rounded-lg px-3 py-2 text-sm text-[var(--color-content-primary)] focus:outline-none focus:border-[var(--color-brand-main)] focus:ring-0 transition-colors"
                        defaultValue={!isCreating && selectedItem ? selectedItem[f.field] : ''}
                      >
                         <option value="">Selecione...</option>
                         {f.optionsList ? f.optionsList.split(',').map((opt: string) => (
                            <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                         )) : (
                            !isCreating && selectedItem && selectedItem[f.field] && (
                               <option value={selectedItem[f.field]}>{selectedItem[f.field]}</option>
                            )
                         )}
                      </select>
                   ) : f.type === 'date' ? (
                      <Input 
                         type="date"
                         defaultValue={!isCreating && selectedItem && selectedItem[f.field] ? new Date(selectedItem[f.field]).toISOString().split('T')[0] : ''}
                      />
                   ) : f.type === 'number' ? (
                      <Input 
                         type="number"
                         defaultValue={!isCreating && selectedItem ? selectedItem[f.field] : ''} 
                         placeholder="Preencha o valor..."
                      />
                   ) : f.type === 'boolean' ? (
                      <select
                        className="w-full h-10 bg-[var(--color-content-inverse)] border border-[var(--color-border-default)] rounded-lg px-3 py-2 text-sm text-[var(--color-content-primary)] focus:outline-none focus:border-[var(--color-brand-main)] focus:ring-0 transition-colors"
                        defaultValue={!isCreating && selectedItem && selectedItem[f.field] !== undefined ? String(selectedItem[f.field]) : ''}
                      >
                         <option value="">Selecione...</option>
                         <option value="true">Sim</option>
                         <option value="false">Não</option>
                      </select>
                   ) : (
                      <Input 
                         type="text"
                         defaultValue={!isCreating && selectedItem ? selectedItem[f.field] : ''} 
                         placeholder="Preencha o valor..."
                      />
                   )}
                 </div>
              ))}
           </div>
        </div>
      )}

      {!isCreating && activeCollection.secondaryFieldsReadOnly?.filter((f: any) => (!f.section && activeFormTab === 'Dados Principais') || f.section === activeFormTab).length > 0 && (
        <div className="bg-white rounded-xl border border-[var(--color-border-default)] shadow-sm overflow-hidden mb-6">
           <div className="bg-[var(--color-background-light)] px-6 py-3 border-b border-[var(--color-border-default)] flex items-center">
              <FileText size={16} className="text-gray-500 mr-2"/>
              <h3 className="text-sm font-bold text-[var(--color-content-primary)] uppercase tracking-wider">Informações do Sistema (Somente Leitura)</h3>
           </div>
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCollection.secondaryFieldsReadOnly.filter((f: any) => (!f.section && activeFormTab === 'Dados Principais') || f.section === activeFormTab).map((f: any) => (
                 <div key={f.id}>
                   <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-content-tertiary)] mb-1">{f.label}</label>
                   <div className="bg-gray-50 px-3 py-2 rounded border border-gray-100 min-h-[38px] flex items-center">
                      <span className="text-sm font-medium text-[var(--color-content-primary)]">
                        {f.type === 'date' && selectedItem?.[f.field] 
                          ? new Date(selectedItem[f.field]).toLocaleDateString('pt-BR') 
                          : f.type === 'boolean' 
                            ? (selectedItem?.[f.field] ? 'Sim' : 'Não') 
                            : (selectedItem?.[f.field] || '-')}
                      </span>
                   </div>
                 </div>
              ))}
           </div>
        </div>
      )}

    </div>
  );
};

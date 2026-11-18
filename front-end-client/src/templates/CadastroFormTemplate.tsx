import React, { useState, useMemo } from 'react';
import { PageMapping } from '../types/index';
import { Button } from '../components/ui/Button';
import { Search, Plus, Save, User, Briefcase } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { CadastroFormList } from './partials/CadastroFormList';
import { CadastroFormFields } from './partials/CadastroFormFields';

interface CadastroFormTemplateProps {
  mapping: PageMapping;
  items: any[];
}

export const CadastroFormTemplate: React.FC<CadastroFormTemplateProps> = ({ mapping, items }) => {
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const selectedItem = useMemo(() => {
    return items.find(item => item._id === selectedRecordId);
  }, [items, selectedRecordId]);

  const activeCollection = useMemo(() => {
    if (mapping.viewConfig) return mapping.viewConfig;
    if (selectedItem) {
      return (mapping.collections || []).find(c => c.collectionName === selectedItem._collection) || (mapping.collections || [])[0];
    }
    return (mapping.collections || [])[0];
  }, [selectedItem, mapping]);

  const nameField = activeCollection?.primaryFields?.name || '';
  const cpfField = activeCollection?.primaryFields?.cpfCnpj || '';
  const statusField = activeCollection?.primaryFields?.status || '';

  const filteredData = useMemo(() => {
    return items.filter(item => {
      if (!searchTerm) return true;
      const collectionConfig = mapping.viewConfig || (mapping.collections || []).find(c => c.collectionName === item._collection) || (mapping.collections || [])[0];
      if (!collectionConfig) return true;

      const nField = collectionConfig.primaryFields?.name;
      const cField = collectionConfig.primaryFields?.cpfCnpj;
      const nameStr = nField ? String(item[nField] || '').toLowerCase() : '';
      const cpfStr = cField ? String(item[cField] || '').toLowerCase() : '';
      const searchStr = searchTerm.toLowerCase();
      return nameStr.includes(searchStr) || cpfStr.includes(searchStr);
    });
  }, [items, searchTerm, mapping]);

  const isEditing = !!selectedRecordId && !isCreating;
  const isFormActive = isEditing || isCreating;

  const handleCreateNew = () => {
    setSelectedRecordId(null);
    setIsCreating(true);
  };

  const handleCancelForm = () => {
    setIsCreating(false);
  };

  const formTabs = useMemo(() => {
    if (!activeCollection) return [];
    const tabs = ['Dados Principais'];
    activeCollection.secondaryFieldsEditable?.forEach((f: any) => {
      if (f.section && !tabs.includes(f.section)) {
        tabs.push(f.section);
      }
    });
    activeCollection.secondaryFieldsReadOnly?.forEach((f: any) => {
      if (f.section && !tabs.includes(f.section)) {
        tabs.push(f.section);
      }
    });
    return tabs;
  }, [activeCollection]);

  const [activeFormTab, setActiveFormTab] = React.useState('Dados Principais');

  React.useEffect(() => {
    setActiveFormTab('Dados Principais');
  }, [selectedRecordId, isCreating]);

  if (!activeCollection) {
    return <div className="p-8 text-center text-red-500">Nenhuma coleção mapeada para este cadastro.</div>;
  }

  return (
    <div className="flex h-full bg-white rounded-xl shadow-sm border border-[var(--color-border-default)] overflow-hidden w-full">
      
      {}
      <CadastroFormList 
        filteredData={filteredData}
        mapping={mapping}
        activeCollection={activeCollection}
        selectedRecordId={selectedRecordId}
        isCreating={isCreating}
        setSelectedRecordId={setSelectedRecordId}
        setIsCreating={setIsCreating}
      />

      {}
      <div className="flex-1 bg-white flex flex-col h-full overflow-hidden">
        {!isFormActive ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50/50">
             <div className="w-16 h-16 bg-white border border-[var(--color-border-default)] rounded-full flex items-center justify-center text-[var(--color-brand-main)] mb-4 shadow-sm">
               <User size={24} />
             </div>
             <h2 className="text-xl font-bold text-[var(--color-content-primary)]">Gestão de {mapping.pageName}</h2>
             <p className="text-sm text-[var(--color-content-secondary)] mt-2 max-w-sm">
                Selecione um registro na lista ao lado para visualizar os detalhes e alterar seus dados, ou cadastre um novo registro.
             </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto relative hidden-scrollbar">
             
             {}
             <div className="bg-white border-b border-[var(--color-border-default)] pt-6 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center justify-between px-8 mb-4">
                   <div>
                     <h2 className="text-2xl font-bold text-[var(--color-content-primary)] flex items-center">
                       {isCreating ? 'Novo Cadastro' : selectedItem?.[nameField] || 'Editar Registro'}
                     </h2>
                     <p className="text-sm text-[var(--color-content-secondary)] mt-1 flex items-center">
                       <Briefcase size={14} className="mr-1" />
                       {isCreating ? `Cadastrar novo registro em ${mapping.pageName}` : `Visualizando detalhes do registro`}
                     </p>
                   </div>
                   <div className="flex gap-2">
                     <Button variant="secondary" onClick={handleCancelForm}>Cancelar</Button>
                     <Button className="pl-3 pr-4">
                       <Save size={16} className="mr-2"/>
                       Salvar
                     </Button>
                   </div>
                </div>

                {formTabs.length > 1 && (
                  <div className="px-8 flex space-x-6 border-b border-transparent">
                    {formTabs.map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveFormTab(tab)}
                        className={`pb-3 text-sm font-semibold transition-colors relative ${
                          activeFormTab === tab 
                            ? 'text-[var(--color-brand-main)] border-b-2 border-[var(--color-brand-main)]' 
                            : 'text-[var(--color-content-secondary)] hover:text-[var(--color-content-primary)]'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                )}
             </div>

             <CadastroFormFields 
                activeFormTab={activeFormTab}
                isCreating={isCreating}
                selectedItem={selectedItem}
                nameField={nameField}
                cpfField={cpfField}
                statusField={statusField}
                activeCollection={activeCollection}
             />
          </div>
        )}
      </div>

    </div>
  );
};


import React from 'react';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { X, Search, Filter, FolderKanban } from 'lucide-react';
import { CollapsibleCard } from '../../../components/ui/CollapsibleCard';

interface SearchAndFilterSectionProps {
  availableFields: string[];
  customFieldOptions?: { value: string; label: string }[];
  searchFields: string[];
  setSearchFields: (val: string[]) => void;
  filterFields: string[];
  setFilterFields: (val: string[]) => void;
  filterLabels?: Record<string, string>;
  setFilterLabels?: (val: Record<string, string>) => void;
  groupingFields: string[];
  setGroupingFields: (val: string[]) => void;
}

export const SearchAndFilterSection: React.FC<SearchAndFilterSectionProps> = ({
  availableFields,
  customFieldOptions,
  searchFields, setSearchFields,
  filterFields, setFilterFields,
  filterLabels = {}, setFilterLabels,
  groupingFields, setGroupingFields
}) => {
  const fieldOptions = customFieldOptions || [
     { value: '', label: 'Selecione...' },
     ...availableFields.map(k => ({ value: k, label: k }))
  ];

  const handleAddField = (arr: string[], setArr: (v: string[]) => void) => {
    setArr([...arr, '']);
  };

  const handleUpdateField = (arr: string[], setArr: (v: string[]) => void, index: number, value: string) => {
    const newArr = [...arr];
    newArr[index] = value;
    setArr(newArr);
  };

  const handleRemoveField = (arr: string[], setArr: (v: string[]) => void, index: number) => {
    setArr(arr.filter((_, i) => i !== index));
  };

  return (
    <CollapsibleCard 
      title="Busca, Filtros e Agrupamentos" 
      subtitle="Defina quais campos da coleção o sistema deve utilizar para exibir as barras de busca, filtros dinâmicos e opções de agrupamento do lado do cliente."
      defaultOpen={false}
    >
      <div className="space-y-6">
        
      <div className="bg-white p-5 rounded-xl border border-[var(--color-border-default)]">
        <h4 className="text-sm font-bold text-[var(--color-content-primary)] flex items-center mb-4">
          <Search size={16} className="mr-2" /> Campos de Busca (Texto Livre)
        </h4>
        <div className="space-y-3">
          {searchFields.map((f, i) => (
             <div key={i} className="flex gap-2 items-center">
               <div className="flex-1">
                 <Select 
                    value={f} 
                    onChange={(e) => handleUpdateField(searchFields, setSearchFields, i, e.target.value)} 
                    options={fieldOptions} 
                 />
               </div>
               <button onClick={() => handleRemoveField(searchFields, setSearchFields, i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                 <X size={18} />
               </button>
             </div>
          ))}
          <Button variant="secondary" onClick={() => handleAddField(searchFields, setSearchFields)}>
            + Adicionar Campo de Busca
          </Button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-[var(--color-border-default)]">
        <h4 className="text-sm font-bold text-[var(--color-content-primary)] flex items-center mb-4">
          <Filter size={16} className="mr-2" /> Campos de Filtro (Selects Dinâmicos)
        </h4>
        <div className="space-y-3">
          {filterFields.map((f, i) => (
             <div key={i} className="flex gap-2 items-center">
               <div className="flex-1">
                 <Select 
                    value={f} 
                    onChange={(e) => {
                      const oldVal = filterFields[i];
                      const newVal = e.target.value;
                      handleUpdateField(filterFields, setFilterFields, i, newVal);
                      if (setFilterLabels && oldVal !== newVal) {
                        const newLabels = { ...filterLabels };
                        delete newLabels[oldVal];
                        if (newVal) {
                           newLabels[newVal] = newVal;
                        }
                        setFilterLabels(newLabels);
                      }
                    }} 
                    options={fieldOptions} 
                 />
               </div>
               {f && (
                 <div className="flex-1">
                   <input
                     type="text"
                     value={filterLabels[f] || f}
                     onChange={(e) => {
                       if (setFilterLabels) {
                         setFilterLabels({ ...filterLabels, [f]: e.target.value });
                       }
                     }}
                     placeholder="Nome amigável"
                     className="w-full px-3 py-2 border border-[var(--color-border-default)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
                   />
                 </div>
               )}
               <button onClick={() => {
                 handleRemoveField(filterFields, setFilterFields, i);
                 if (setFilterLabels && f) {
                   const newLabels = { ...filterLabels };
                   delete newLabels[f];
                   setFilterLabels(newLabels);
                 }
               }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                 <X size={18} />
               </button>
             </div>
          ))}
           <Button variant="secondary" onClick={() => handleAddField(filterFields, setFilterFields)}>
            + Adicionar Filtro
          </Button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-[var(--color-border-default)]">
        <h4 className="text-sm font-bold text-[var(--color-content-primary)] flex items-center mb-4">
          <FolderKanban size={16} className="mr-2" /> Campos de Agrupamento
        </h4>
        <div className="space-y-3">
          {groupingFields.map((f, i) => (
             <div key={i} className="flex gap-2 items-center">
               <div className="flex-1">
                 <Select 
                    value={f} 
                    onChange={(e) => handleUpdateField(groupingFields, setGroupingFields, i, e.target.value)} 
                    options={fieldOptions} 
                 />
               </div>
               <button onClick={() => handleRemoveField(groupingFields, setGroupingFields, i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                 <X size={18} />
               </button>
             </div>
          ))}
           <Button variant="secondary" onClick={() => handleAddField(groupingFields, setGroupingFields)}>
            + Adicionar Agrupamento
          </Button>
        </div>
      </div>
      </div>
    </CollapsibleCard>
  );
};

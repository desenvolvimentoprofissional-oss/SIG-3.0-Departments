import React from 'react';
import { FilterCondition, FilterOperator } from '../../../types';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

interface FilterBuilderProps {
  filters: FilterCondition[];
  onChange: (filters: FilterCondition[]) => void;
  availableFields: string[];
}

export const FilterBuilder: React.FC<FilterBuilderProps> = ({ filters, onChange, availableFields }) => {
  const addFilter = () => {
    onChange([
      ...filters,
      {
        id: Date.now().toString(36),
        field: availableFields[0] || '',
        operator: 'EQUALS',
        value: ''
      }
    ]);
  };

  const updateFilter = (id: string, updates: Partial<FilterCondition>) => {
    onChange(filters.map(f => (f.id === id ? { ...f, ...updates } : f)));
  };

  const removeFilter = (id: string) => {
    onChange(filters.filter(f => f.id !== id));
  };

  const operatorOptions = [
    { label: 'Igual (==)', value: 'EQUALS' },
    { label: 'Diferente (!=)', value: 'NOT_EQUALS' },
    { label: 'Maior (>)', value: 'GREATER_THAN' },
    { label: 'Menor (<)', value: 'LESS_THAN' },
    { label: 'Maior ou Igual (>=)', value: 'GREATER_THAN_OR_EQUALS' },
    { label: 'Menor ou Igual (<=)', value: 'LESS_THAN_OR_EQUALS' },
    { label: 'Contém (Contains)', value: 'CONTAINS' }
  ];

  return (
    <div className="space-y-3">
      {filters.map((filter) => (
        <div key={filter.id} className="flex flex-col space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <div className="flex flex-row space-x-2 w-full">
            <div className="w-1/2">
              <Select 
                value={filter.field}
                onChange={(e) => updateFilter(filter.id, { field: e.target.value })}
                options={[
                  { label: 'Selecione o campo...', value: '' },
                  ...availableFields.map(f => ({ label: f, value: f }))
                ]}
                className="w-full h-9 text-sm"
              />
            </div>
            <div className="w-1/2">
              <Select 
                value={filter.operator}
                onChange={(e) => updateFilter(filter.id, { operator: e.target.value as FilterOperator })}
                options={operatorOptions}
                className="w-full h-9 text-sm"
              />
            </div>
          </div>
          <div className="flex space-x-2 w-full">
            <Input 
              value={filter.value}
              onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
              placeholder="Valor"
              className="flex-1 h-9 text-sm"
            />
            <button 
              onClick={() => removeFilter(filter.id)}
              className="text-red-400 hover:text-red-600 p-2"
              title="Remover filtro"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
      <Button variant="secondary" onClick={addFilter} className="w-full h-9 text-sm border-dashed">
        <Plus size={16} className="mr-2" /> Adicionar Filtro
      </Button>
    </div>
  );
};

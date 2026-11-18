import React from 'react';
import { UniversalFilter } from '../../../types/index';

interface UniversalFiltersSectionProps {
  universalFilters: UniversalFilter[];
  setUniversalFilters: (filters: UniversalFilter[]) => void;
  extractedFields: string[];
  customFieldOptions?: { value: string; label: string }[];
}

export const UniversalFiltersSection: React.FC<UniversalFiltersSectionProps> = ({
  universalFilters,
  setUniversalFilters,
  extractedFields,
  customFieldOptions
}) => {
  const fieldOptions = customFieldOptions || extractedFields.map(f => ({ value: f, label: f }));

  return (
    <div className="mt-8 border-t border-[var(--color-border-default)] pt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h5 className="text-sm font-semibold text-[var(--color-content-primary)] mb-1">Filtros Universais</h5>
          <p className="text-xs text-[var(--color-content-secondary)]">Aplica filtros fixos para todos os dados lidos (não visível ao usuário final).</p>
        </div>
        <button 
          type="button" 
          onClick={() => setUniversalFilters([...universalFilters, { id: crypto.randomUUID(), column: '', value: '', operator: '==' }])}
          className="px-3 py-1.5 text-xs font-semibold bg-[var(--color-background-light)] border border-[var(--color-border-default)] rounded-lg hover:bg-slate-50 transition-colors"
        >
          + Adicionar Filtro
        </button>
      </div>
      
      <div className="space-y-4">
        {universalFilters.map((filter, index) => (
          <div key={filter.id || index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50/50 p-4 rounded-xl border border-[var(--color-border-default)]">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-2">Coluna base</label>
              <select 
                className="w-full bg-white border border-[var(--color-border-default)] p-3 rounded-lg text-sm"
                value={filter.column}
                onChange={(e) => {
                  const newFilters = [...universalFilters];
                  newFilters[index].column = e.target.value;
                  setUniversalFilters(newFilters);
                }}
              >
                <option value="">Selecione uma coluna original...</option>
                {fieldOptions.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-2">Operador</label>
              <select 
                className="w-full bg-white border border-[var(--color-border-default)] p-3 rounded-lg text-sm"
                value={filter.operator || '=='}
                onChange={(e) => {
                  const newFilters = [...universalFilters];
                  newFilters[index].operator = e.target.value as any;
                  setUniversalFilters(newFilters);
                }}
              >
                <option value="==">Igual a (==)</option>
                <option value="!=">Diferente de (!=)</option>
                <option value="contains">Contém</option>
                <option value="not-contains">Não contém</option>
                <option value="starts-with">Começa com</option>
                <option value="ends-with">Termina com</option>
                <option value=">">Maior que (&gt;)</option>
                <option value="<">Menor que (&lt;)</option>
                <option value=">=">Maior ou igual (&gt;=)</option>
                <option value="<=">Menor ou igual (&lt;=)</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-2">Valor esperado</label>
              <input 
                type="text"
                className="w-full bg-white border border-[var(--color-border-default)] p-3 rounded-lg text-sm"
                value={filter.value} 
                onChange={(e) => {
                  const newFilters = [...universalFilters];
                  newFilters[index].value = e.target.value;
                  setUniversalFilters(newFilters);
                }} 
                placeholder="Ex: 2026" 
              />
            </div>
            <div className="md:col-span-1 flex justify-end pb-1">
              <button 
                type="button" 
                onClick={() => {
                  setUniversalFilters(universalFilters.filter((_, i) => i !== index));
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                title="Remover filtro"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
        {universalFilters.length === 0 && (
          <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-[var(--color-border-default)]">
            <p className="text-sm text-[var(--color-content-secondary)]">Nenhum filtro universal configurado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

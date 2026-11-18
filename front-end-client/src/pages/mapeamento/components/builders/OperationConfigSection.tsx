import React from 'react';
import { Select } from '../../../../components/ui/Select';
import { FilterBuilder } from '../FilterBuilder';
import { ResultadoAggregateType } from '../../../../types';
import { Trash2, Plus } from 'lucide-react';
import { useWidgetBindingBuilder } from './useWidgetBindingBuilder';

export const OperationConfigSection = ({
  selectedWidget,
  handleUpdateWidget,
  getExtractedFields
}: any) => {
  const { updateBinding, updateTargetFieldConfig, removeTargetFieldConfig, addTargetFieldConfig, updateFieldConfig } = useWidgetBindingBuilder(selectedWidget, handleUpdateWidget);
  return (
    <div className="border-t border-[var(--color-border-default)] pt-4">
      <h4 className="font-semibold text-sm mb-4 text-[var(--color-content-main)]">Camada 2: Operação</h4>
      <Select 
        value={selectedWidget.binding.aggregate}
        onChange={(e) => updateBinding({ aggregate: e.target.value })}
        options={[
          { label: 'Contar (COUNT)', value: 'COUNT' },
          { label: 'Somar (SUM)', value: 'SUM' },
          { label: 'Média (AVG)', value: 'AVG' },
          { label: 'Máximo (MAX)', value: 'MAX' },
          { label: 'Mínimo (MIN)', value: 'MIN' },
        ]}
      />
      
      <div className="mt-4">
        <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Campo Alvo Principal (Necessário para a Operação)</label>
        <Select 
          value={selectedWidget.binding.targetField || ''}
          onChange={(e) => updateBinding({ targetField: e.target.value })}
          options={[
            { label: 'Selecione um campo...', value: '' },
            ...getExtractedFields(selectedWidget.binding.collection).map((f: any) => ({ label: f, value: f }))
          ]}
        />
      </div>
      {selectedWidget.type === 'METRIC_CARD' && (
        <div className="mt-4">
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Campos Adicionais para Soma (Opcional)</label>
          <p className="text-[10px] text-gray-500 mb-2">Junte mais de uma coluna para compor o valor do card.</p>
          {(() => {
             const configs = selectedWidget.binding.targetFieldConfigs || 
                (selectedWidget.binding.targetFields || []).map((tf: string) => ({ field: tf }));
             
             return configs.map((tfc: any, i: number) => (
               <div key={i} className="mb-4 border border-[var(--color-border-default)] rounded-lg p-3 bg-white">
                 <div className="flex gap-2">
                   <Select 
                     value={tfc.field}
                     onChange={(e) => updateTargetFieldConfig(i, e.target.value)}
                     options={[
                       { label: 'Selecione um campo...', value: '' },
                       ...getExtractedFields(selectedWidget.binding.collection).map((f: any) => ({ label: f, value: f }))
                     ]}
                   />
                   <button 
                     onClick={() => removeTargetFieldConfig(i)} 
                     className="px-3 border border-[var(--color-border-default)] rounded-lg text-red-500 hover:bg-red-50"
                   >
                     <Trash2 size={14}/>
                   </button>
                 </div>
                 <div className="mt-2">
                    <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Filtros (Específicos para esta coluna)</label>
                    <FilterBuilder 
                      filters={tfc.filters || []}
                      onChange={(newFilters: any) => updateFieldConfig(tfc.field, i, "filters", newFilters, "targetFieldConfigs")}
                      availableFields={getExtractedFields(selectedWidget.binding.collection)}
                    />
                 </div>
               </div>
             ));
          })()}
          <button 
            onClick={() => {
              const configs = selectedWidget.binding.targetFieldConfigs || 
                (selectedWidget.binding.targetFields || []).map((tf: string) => ({ field: tf }));
              handleUpdateWidget(selectedWidget.id, { 
                binding: { ...selectedWidget.binding, targetFieldConfigs: [...configs, { field: '', filters: [] }] } 
              })
            }} 
            className="w-full mt-2 py-2 border border-dashed border-[var(--color-border-default)] rounded-lg text-xs font-semibold text-[var(--color-brand-main)] hover:bg-[var(--color-brand-light)] flex justify-center items-center"
          >
            <Plus size={14} className="mr-2" /> Adicionar outro campo Alvo
          </button>
        </div>
      )}
    </div>
  );
};

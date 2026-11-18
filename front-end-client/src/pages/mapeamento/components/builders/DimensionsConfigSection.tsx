import React from 'react';
import { Select } from '../../../../components/ui/Select';
import { FieldConfigItem } from './FieldConfigItem';
import { Plus, Trash2 } from 'lucide-react';
import { useWidgetBindingBuilder } from './useWidgetBindingBuilder';

export const DimensionsConfigSection = ({

  selectedWidget,
  handleUpdateWidget,
  getExtractedFields
}: any) => {
  const { updateBinding, addGroupByField, updateGroupByField, removeGroupByField } = useWidgetBindingBuilder(selectedWidget, handleUpdateWidget);
  const isPivot = selectedWidget.type === 'PIVOT_TABLE';

  return (
    <div className="border-t border-[var(--color-border-default)] pt-4">
      <h4 className="font-semibold text-sm mb-4 text-[var(--color-content-main)]">
        {isPivot ? 'Camada 3: Configuração da Tabela' : 'Camada 3: Dimensões (Opcional)'}
      </h4>
      
      <div className="mb-4">
        <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">
          {isPivot ? 'Coluna de Data (1ª Coluna)' : 'Agrupar por (Group By principal)'}
        </label>
        <div className="flex gap-2">
          <Select 
            value={selectedWidget.binding.groupByField || ''}
            onChange={(e) => updateGroupByField(0, e.target.value)}
            options={[
              { label: 'Sem agrupamento', value: '' },
              ...getExtractedFields(selectedWidget.binding.collection).map((f: any) => ({ label: f, value: f }))
            ]}
          />
        </div>

        {selectedWidget.binding.groupByField && !isPivot && (selectedWidget.binding.groupByFields?.length > 1) && (
          <div className="mt-2 pl-4 border-l-2 border-gray-200">
            <FieldConfigItem 
              field={selectedWidget.binding.groupByField}
              configIndex={0}
              configs={selectedWidget.binding.groupByFieldConfigs}
              handleUpdateWidget={handleUpdateWidget}
              selectedWidget={selectedWidget}
              getExtractedFields={getExtractedFields}
            />
          </div>
        )}

        {selectedWidget.binding.groupByField && !isPivot && (
          <div className="mt-2 space-y-2">
            {(selectedWidget.binding.groupByFields || []).slice(1).map((f: string, i: number) => (
              <div key={i} className="space-y-2 border-t border-dashed border-gray-200 pt-2">
                <div className="flex gap-2">
                  <Select 
                    value={f} 
                    onChange={e => updateGroupByField(i + 1, e.target.value)} 
                    options={[ {label:'Selecione...', value:''}, ...getExtractedFields(selectedWidget.binding.collection).map((f: any) => ({ label: f, value: f })) ]} 
                  />
                  <button aria-label="Remover campo de agrupamento" onClick={() => removeGroupByField(i + 1)} className="px-3 border border-[var(--color-border-default)] rounded-lg text-red-500 hover:bg-red-50 flex-shrink-0 focus:ring-2 focus:ring-red-500 outline-none">
                    <Trash2 size={14}/>
                  </button>
                </div>
                {f && (
                  <div className="pl-4 border-l-2 border-gray-200 space-y-2">
                    <FieldConfigItem 
                      field={f}
                      configIndex={i + 1}
                      configs={selectedWidget.binding.groupByFieldConfigs}
                      handleUpdateWidget={handleUpdateWidget}
                      selectedWidget={selectedWidget}
                      getExtractedFields={getExtractedFields}
                    />
                  </div>
                )}
              </div>
            ))}
            {(!selectedWidget.binding.groupByCategory) && (
              <button 
                onClick={() => {
                  const current = selectedWidget.binding.groupByFields || [selectedWidget.binding.groupByField];
                  handleUpdateWidget(selectedWidget.id, { binding: { ...selectedWidget.binding, groupByFields: [...current, ''] } })
                }} 
                className="w-full mt-2 py-2 border border-dashed border-[var(--color-border-default)] rounded-lg text-xs font-semibold text-[var(--color-brand-main)] hover:bg-[var(--color-brand-light)] flex justify-center items-center"
              >
                <Plus size={14} className="mr-2" /> Adicionar outro campo (Mesmo Eixo)
              </button>
            )}
          </div>
        )}
      </div>

      {selectedWidget.binding.groupByField && (
        <>
          <div className="mt-4">
            <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Formato de Data (Se for data)</label>
            <Select 
              value={selectedWidget.binding.dateGrouping || ''}
              onChange={(e) => updateBinding({ dateGrouping: e.target.value || undefined })}
              options={isPivot ? [
                { label: 'Por Mês (MM/YYYY)', value: 'MONTH' },
                { label: 'Por Ano (YYYY) - Expansível', value: 'YEAR' },
              ] : [
                { label: 'Não aplicar (Valor exato)', value: '' },
                { label: 'Por Dia (DD/MM/YYYY)', value: 'DAY' },
                { label: 'Por Mês (MM/YYYY)', value: 'MONTH' },
                { label: 'Por Ano (YYYY)', value: 'YEAR' },
              ]}
            />
          </div>

          {(!selectedWidget.binding.groupByFields || selectedWidget.binding.groupByFields.length <= 1 || isPivot) && (
            <div className="mt-4 pt-4 border-t border-[var(--color-border-default)]">
              {isPivot ? (
                <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">
                  Coluna Secundária (Gera Múltiplas Colunas)
                </label>
              ) : (
                <label className="flex items-center gap-2 text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">
                  <input 
                    type="checkbox" 
                    checked={selectedWidget.binding.groupByCategory || false} 
                    onChange={e => updateBinding({ groupByCategory: e.target.checked })} 
                  />
                  Sub-agrupar por Categoria (Múltiplas colunas)
                </label>
              )}
              
              {(selectedWidget.binding.groupByCategory || isPivot) && (
                <Select 
                  value={selectedWidget.binding.categoryField || ''}
                  onChange={(e) => updateBinding({ categoryField: e.target.value, groupByCategory: true })}
                  options={[
                    { label: 'Selecione a categoria...', value: '' },
                    ...getExtractedFields(selectedWidget.binding.collection).map((f: any) => ({ label: f, value: f }))
                  ]}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

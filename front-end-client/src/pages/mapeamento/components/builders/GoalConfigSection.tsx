import React from 'react';
import { Select } from '../../../../components/ui/Select';
import { useWidgetBindingBuilder } from './useWidgetBindingBuilder';

export const GoalConfigSection = ({
  selectedWidget,
  handleUpdateWidget,
  getExtractedFields,
  title
}: any) => {
  const { updateBinding, updateGranularityGoal, removeGranularityGoal, addGranularityGoal } = useWidgetBindingBuilder(selectedWidget, handleUpdateWidget);
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-sm mb-4 text-[var(--color-content-main)]">{title || "4. Meta"}</h4>
      
      <div className="mb-4">
        <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Meta (Gera Barra de Progresso)</label>
        <input 
          type="number"
          className="w-full bg-white border border-[var(--color-border-default)] text-[var(--color-content-primary)] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--color-brand-main)] focus:ring-0"
          value={selectedWidget.binding.targetGoal || ''}
          onChange={(e) => updateBinding({ targetGoal: e.target.value ? Number(e.target.value) : undefined })}
          placeholder="Ex: 1000"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Campo de Granularidade</label>
        <Select 
          value={selectedWidget.binding.granularityText || ''}
          onChange={(e) => updateBinding({ granularityText: e.target.value })}
          options={[
            { label: 'Selecione um campo...', value: '' },
            ...getExtractedFields(selectedWidget.binding.collection).map((f: any) => ({ label: f, value: f }))
          ]}
        />
      </div>

      {selectedWidget.binding.granularityText && (
        <div className="mt-4">
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">
            Metas da Granularidade
          </label>
          <div className="space-y-2 mb-2">
            {(selectedWidget.binding.granularityGoals || []).map((goal: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <input 
                  type="text"
                  className="flex-1 bg-white border border-[var(--color-border-default)] text-[var(--color-content-primary)] text-sm rounded-lg px-2 py-1.5 focus:outline-none focus:border-[var(--color-brand-main)]"
                  placeholder="Valor (ex: Pessoas Físicas)"
                  value={goal.value}
                  onChange={(e) => updateGranularityGoal(idx, "value", e.target.value)}
                />
                <input 
                  type="number"
                  className="flex-1 bg-white border border-[var(--color-border-default)] text-[var(--color-content-primary)] text-sm rounded-lg px-2 py-1.5 focus:outline-none focus:border-[var(--color-brand-main)]"
                  placeholder="Meta"
                  value={goal.goal || ''}
                  onChange={(e) => updateGranularityGoal(idx, "goal", Number(e.target.value))}
                />
                <button aria-label="Remover meta específica" onClick={() => removeGranularityGoal(idx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded focus:ring-2 focus:ring-red-500 outline-none">
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const newGoals = [...(selectedWidget.binding.granularityGoals || []), { value: '', goal: 0 }];
              handleUpdateWidget(selectedWidget.id, {
                binding: { ...selectedWidget.binding, granularityGoals: newGoals }
              });
            }}
            className="text-xs font-semibold text-[var(--color-brand-main)] hover:underline"
          >
            + Adicionar Meta Específica
          </button>
        </div>
      )}
    </div>
  );
};

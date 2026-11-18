import React from 'react';
import { FilterBuilder } from '../../FilterBuilder';

export const ColaboradorWidgetPerformance = ({
  selectedWidget,
  handleUpdateWidget,
  getExtractedFields,
  tabConfig
}: any) => {
  return (
    <>
      <div className="border-t border-[var(--color-border-default)] pt-4">
        <h4 className="font-semibold text-sm mb-4 text-[var(--color-content-main)]">Configuração do Colaborador</h4>
        
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">E-mail do Responsável</label>
          <input 
            type="email"
            value={selectedWidget.binding.responsibleEmailValue || ''}
            onChange={(e) => handleUpdateWidget(selectedWidget.id, { 
              binding: { ...selectedWidget.binding, responsibleEmailValue: e.target.value } 
            })}
            className="w-full text-sm p-2 border border-[var(--color-border-default)] rounded-md outline-none focus:border-[var(--color-brand-main)]"
            placeholder="example@email.com"
          />
        </div>

        {tabConfig?.performanceCardsConfig?.metrics && tabConfig.performanceCardsConfig.metrics.length > 0 && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Métricas Atribuídas</label>
            <p className="text-[10px] text-gray-500 mb-2">Selecione quais métricas devem aparecer para este colaborador (se nenhuma selecionada, todas aparecerão).</p>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
              {tabConfig.performanceCardsConfig.metrics.map((m: any) => {
                const isChecked = !selectedWidget.binding.activeMetricIds || selectedWidget.binding.activeMetricIds.length === 0 || selectedWidget.binding.activeMetricIds.includes(m.id);
                return (
                  <label key={m.id} className="flex items-center space-x-2 text-xs">
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={(e) => {
                        let current = selectedWidget.binding.activeMetricIds || tabConfig.performanceCardsConfig.metrics.map((metric: any) => metric.id);
                        if (e.target.checked) {
                          current = [...current, m.id];
                          if (current.length === tabConfig.performanceCardsConfig.metrics.length) {
                            current = [];
                          }
                        } else {
                          current = current.filter((id: string) => id !== m.id);
                        }
                        handleUpdateWidget(selectedWidget.id, {
                          binding: { ...selectedWidget.binding, activeMetricIds: current }
                        });
                      }}
                    />
                    <span>{m.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-[var(--color-border-default)] pt-4">
        <h4 className="font-semibold text-sm mb-4 text-[var(--color-content-main)]">Filtros Locais (Opcional)</h4>
        <FilterBuilder 
          filters={selectedWidget.binding.filters || []}
          onChange={(newFilters: any) => handleUpdateWidget(selectedWidget.id, {
            binding: { ...selectedWidget.binding, filters: newFilters }
          })}
          availableFields={getExtractedFields(selectedWidget.binding.collection)}
        />
      </div>
    </>
  );
};

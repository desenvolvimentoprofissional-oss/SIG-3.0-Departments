import React from 'react';
import { FilterBuilder } from '../../FilterBuilder';
import { OperationConfigSection } from '../OperationConfigSection';
import { DimensionsConfigSection } from '../DimensionsConfigSection';
import { GoalConfigSection } from '../GoalConfigSection';

export const ColaboradorWidgetStandard = ({
  selectedWidget,
  handleUpdateWidget,
  getExtractedFields
}: any) => {
  return (
    <div className="space-y-6">
      <OperationConfigSection
        selectedWidget={selectedWidget}
        handleUpdateWidget={handleUpdateWidget}
        getExtractedFields={getExtractedFields}
      />
      {selectedWidget.type === 'METRIC_CARD' && (
        <GoalConfigSection
          selectedWidget={selectedWidget}
          handleUpdateWidget={handleUpdateWidget}
          getExtractedFields={getExtractedFields}
          title="Configurações Adicionais (Card Numérico)"
        />
      )}
      <DimensionsConfigSection
        selectedWidget={selectedWidget}
        handleUpdateWidget={handleUpdateWidget}
        getExtractedFields={getExtractedFields}
      />
      <div className="border-t border-[var(--color-border-default)] pt-4">
        <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Filtros Locais</label>
        <FilterBuilder 
          filters={selectedWidget.binding.filters || []}
          onChange={(newFilters: any) => handleUpdateWidget(selectedWidget.id, {
            binding: { ...selectedWidget.binding, filters: newFilters }
          })}
          availableFields={getExtractedFields(selectedWidget.binding.collection)}
        />
      </div>
    </div>
  );
};


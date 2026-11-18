import React from 'react';
import { ColorSelector } from '../IconColorSelectors';
import { FilterBuilder } from '../FilterBuilder';
import { useWidgetBindingBuilder } from './useWidgetBindingBuilder';

export const FieldConfigItem = ({
  field,
  configIndex,
  configs,
  handleUpdateWidget,
  selectedWidget,
  getExtractedFields
}: any) => {
  const { updateFieldConfig } = useWidgetBindingBuilder(selectedWidget, handleUpdateWidget);
  const currentConfig = configs?.[configIndex] || {};
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-1">Rótulo (Legenda)</label>
          <input 
            type="text" 
            className="w-full bg-white border border-[var(--color-border-default)] text-[var(--color-content-primary)] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--color-brand-main)]"
            value={currentConfig.label || ''} 
            onChange={(e) => updateFieldConfig(field, configIndex, "label", e.target.value)}
            placeholder={field}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-1">Cor</label>
          <ColorSelector 
            value={currentConfig.color || ''}
            onChange={(newColor: string) => updateFieldConfig(field, configIndex, "color", newColor)}
          />
        </div>
      </div>
      <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Filtros para {field}</label>
      <FilterBuilder 
        filters={currentConfig.filters || []}
        onChange={(newFilters: any) => updateFieldConfig(field, configIndex, "filters", newFilters)}
        availableFields={getExtractedFields(selectedWidget.binding.collection)}
      />
    </div>
  );
};

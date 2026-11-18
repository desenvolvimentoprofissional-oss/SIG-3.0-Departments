import React from 'react';
import { Settings, X } from 'lucide-react';
import { Select } from '../../../../../components/ui/Select';
import { Input } from '../../../../../components/ui/Input';
import { IconSelector, ColorSelector } from '../../IconColorSelectors';
import { FilterBuilder } from '../../FilterBuilder';
import { OperationConfigSection } from '../OperationConfigSection';
import { DimensionsConfigSection } from '../DimensionsConfigSection';
import { GoalConfigSection } from '../GoalConfigSection';
import { PerformanceCardConfig } from './sections/PerformanceCardConfig';

export const SerieHistoricaWidgetConfig = ({
  selectedWidget,
  setSelectedWidgetId,
  handleUpdateWidget,
  availableCollections,
  getExtractedFields
}: any) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-[var(--color-border-default)] flex justify-between items-center bg-gray-50">
        <h3 className="font-semibold text-sm text-[var(--color-content-main)] flex items-center">
          <Settings size={16} className="mr-2" /> Propriedades
        </h3>
        <button onClick={() => setSelectedWidgetId(null)} className="text-gray-400 hover:text-gray-700">
          <X size={16} />
        </button>
      </div>
      
      <div className="p-4 flex-1 overflow-auto space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-sm mb-4 text-[var(--color-content-main)]">0. Propriedades</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Título do Widget</label>
              <Input 
                value={selectedWidget.title}
                onChange={(e) => handleUpdateWidget(selectedWidget.id, { title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Largura da Coluna</label>
              <Select 
                value={selectedWidget.layout.w.toString()}
                onChange={(e) => handleUpdateWidget(selectedWidget.id, { layout: { ...selectedWidget.layout, w: parseInt(e.target.value) } })}
                options={[
                  { label: '25% - 4 por linha', value: '3' },
                  { label: '33% - 3 por linha', value: '4' },
                  { label: '50% - 2 por linha', value: '6' },
                  { label: '66% - 2/3 da linha', value: '8' },
                  { label: '100% - 1 por linha', value: '12' },
                ]}
              />
            </div>

            {(selectedWidget.type === 'METRIC_CARD' || selectedWidget.type === 'BAR' || selectedWidget.type === 'LINE') && (
              <div className="grid grid-cols-2 gap-4 border-t border-[var(--color-border-default)] pt-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Ícone</label>
                  <IconSelector 
                    value={selectedWidget.icon || 'LayoutTemplate'}
                    onChange={(val: any) => handleUpdateWidget(selectedWidget.id, { icon: val })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Cor Principal</label>
                  <ColorSelector 
                    value={selectedWidget.color || '#45556C'}
                    onChange={(val: any) => handleUpdateWidget(selectedWidget.id, { color: val })}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-sm mb-4 text-[var(--color-content-main)]">1. Fonte de Dados</h4>
            <Select 
              value={selectedWidget.binding.collection}
              onChange={(e) => handleUpdateWidget(selectedWidget.id, { 
                binding: { ...selectedWidget.binding, collection: e.target.value, targetField: '', groupByField: '', filterField: '' } 
              })}
              options={availableCollections.map((c: any) => ({ label: c.friendlyName || c.collectionName, value: c.collectionName }))}
            />
          </div>
        </div>

        {selectedWidget.type === 'PERFORMANCE_CARD' ? (
          <PerformanceCardConfig 
            selectedWidget={selectedWidget} 
            handleUpdateWidget={handleUpdateWidget} 
            getExtractedFields={getExtractedFields} 
          />
        ) : (
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-sm mb-4 text-[var(--color-content-main)]">2. Operação e Dimensão</h4>
            
            <OperationConfigSection 
              selectedWidget={selectedWidget}
              handleUpdateWidget={handleUpdateWidget}
              getExtractedFields={getExtractedFields}
            />
            
            <DimensionsConfigSection 
              selectedWidget={selectedWidget}
              handleUpdateWidget={handleUpdateWidget}
              getExtractedFields={getExtractedFields}
            />

            <div className="mt-4 border-t border-[var(--color-border-default)] pt-4">
              <h4 className="font-semibold text-sm mb-4 text-[var(--color-content-main)]">3. Filtros Locais</h4>
              <FilterBuilder 
                filters={selectedWidget.binding.filters || []}
                onChange={(newFilters: any) => handleUpdateWidget(selectedWidget.id, {
                  binding: { ...selectedWidget.binding, filters: newFilters }
                })}
                availableFields={getExtractedFields(selectedWidget.binding.collection)}
              />
            </div>

            {selectedWidget.type === 'METRIC_CARD' && (
              <div className="mt-4 border-t border-[var(--color-border-default)] pt-4">
                <GoalConfigSection 
                  selectedWidget={selectedWidget}
                  handleUpdateWidget={handleUpdateWidget}
                  getExtractedFields={getExtractedFields}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


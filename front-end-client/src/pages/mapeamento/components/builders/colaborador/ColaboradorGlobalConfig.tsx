import React from 'react';
import { Select } from '../../../../../components/ui/Select';
import { Plus } from 'lucide-react';
import { FilterBuilder } from '../../FilterBuilder';
import { ColaboradorMetricConfigItem } from './ColaboradorMetricConfigItem';

export const ColaboradorGlobalConfig = ({
  tabConfig,
  onChange,
  config,
  availableCollections,
  globalFilters,
  handleGlobalFiltersChange
}: any) => {
  return (
    <>
      <div className="p-4 border-b border-[var(--color-border-default)] bg-gray-50">
        <h3 className="font-bold text-sm text-[var(--color-content-main)]">Filtros Globais</h3>
        <p className="text-xs text-[var(--color-content-secondary)]">Aplicados a todos os widgets</p>
      </div>
      <div className="flex-1 p-4 overflow-auto space-y-6">
        <div>
          <h4 className="font-semibold text-sm mb-2 text-[var(--color-content-main)]">Configurações Globais (Colaborador)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Campo de E-mail (Obrigatório)</label>
              <Select 
                value={tabConfig.performanceCardsConfig?.responsibleEmailField || ''}
                onChange={(e) => {
                  const newPcConf = { ...(tabConfig.performanceCardsConfig || {}), responsibleEmailField: e.target.value };
                  onChange({ ...config, colaboradorConfig: { ...tabConfig, performanceCardsConfig: newPcConf } });
                }}
                options={[
                  { label: 'Selecione um campo...', value: '' },
                  ...availableCollections.flatMap((c: any) => c.extractedFields || []).map((f: any) => ({ label: f, value: f }))
                ]}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Campo de Nome (Opcional)</label>
              <Select 
                value={tabConfig.performanceCardsConfig?.responsibleNameField || ''}
                onChange={(e) => {
                  const newPcConf = { ...(tabConfig.performanceCardsConfig || {}), responsibleNameField: e.target.value };
                  onChange({ ...config, colaboradorConfig: { ...tabConfig, performanceCardsConfig: newPcConf } });
                }}
                options={[
                  { label: 'Selecione um campo...', value: '' },
                  ...availableCollections.flatMap((c: any) => c.extractedFields || []).map((f: any) => ({ label: f, value: f }))
                ]}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Campo de Avatar (Opcional)</label>
              <Select 
                value={tabConfig.performanceCardsConfig?.avatarField || ''}
                onChange={(e) => {
                  const newPcConf = { ...(tabConfig.performanceCardsConfig || {}), avatarField: e.target.value };
                  onChange({ ...config, colaboradorConfig: { ...tabConfig, performanceCardsConfig: newPcConf } });
                }}
                options={[
                  { label: 'Selecione um campo...', value: '' },
                  ...availableCollections.flatMap((c: any) => c.extractedFields || []).map((f: any) => ({ label: f, value: f }))
                ]}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Campo de Função/Carteira (Opcional)</label>
              <Select 
                value={tabConfig.performanceCardsConfig?.roleField || ''}
                onChange={(e) => {
                  const newPcConf = { ...(tabConfig.performanceCardsConfig || {}), roleField: e.target.value };
                  onChange({ ...config, colaboradorConfig: { ...tabConfig, performanceCardsConfig: newPcConf } });
                }}
                options={[
                  { label: 'Selecione um campo...', value: '' },
                  ...availableCollections.flatMap((c: any) => c.extractedFields || []).map((f: any) => ({ label: f, value: f }))
                ]}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Campo Agrupador de KPIs (Opcional)</label>
              <p className="text-xs text-gray-500 mb-2">O sistema criará automaticamente até 3 Mini KPIs contando os registros com base nos valores distintos deste campo para todos os colaboradores.</p>
              <Select 
                value={tabConfig.performanceCardsConfig?.kpiGroupingField || ''}
                onChange={(e) => {
                  const newPcConf = { ...(tabConfig.performanceCardsConfig || {}), kpiGroupingField: e.target.value };
                  onChange({ ...config, colaboradorConfig: { ...tabConfig, performanceCardsConfig: newPcConf } });
                }}
                options={[
                  { label: 'Sem KPIs Automáticos (Usar Total e Score)', value: '' },
                  ...availableCollections.flatMap((c: any) => c.extractedFields || []).map((f: any) => ({ label: f, value: f }))
                ]}
              />
              
              {tabConfig.performanceCardsConfig?.kpiGroupingField && (
                <div className="mt-4 p-3 border border-[var(--color-border-default)] rounded-md bg-white">
                  <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Filtros para KPIs Automáticos (Opcional)</label>
                  <p className="text-xs text-gray-500 mb-3">Defina filtros adicionais para a contagem dos KPIs automáticos (ex: apenas registros com status "Concluído").</p>
                  <FilterBuilder 
                    filters={tabConfig.performanceCardsConfig?.kpiFilters || []}
                    onChange={(newFilters: any) => {
                      const newPcConf = { ...(tabConfig.performanceCardsConfig || {}), kpiFilters: newFilters };
                      onChange({ ...config, colaboradorConfig: { ...tabConfig, performanceCardsConfig: newPcConf } });
                    }}
                    availableFields={availableCollections.flatMap((c: any) => c.extractedFields || [])}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-[var(--color-border-default)] pt-4">
          <h4 className="font-semibold text-sm mb-2 text-[var(--color-content-main)]">Métricas e Metas (Barras de Progresso)</h4>
          <p className="text-xs text-gray-500 mb-4">Adicione métricas que serão calculadas e exibidas como barras de progresso (Ex: Produtividade, Qualidade).</p>
          <div className="space-y-3">
            {(tabConfig.performanceCardsConfig?.metrics || []).map((metric: any, idx: number) => (
              <ColaboradorMetricConfigItem 
                key={metric.id}
                metric={metric}
                idx={idx}
                tabConfig={tabConfig}
                config={config}
                onChange={onChange}
                availableCollections={availableCollections}
              />
            ))}
            
            <button
              onClick={() => {
                const newMetrics = [...(tabConfig.performanceCardsConfig?.metrics || []), {
                  id: Date.now().toString(36),
                  label: 'Nova Métrica',
                  type: 'COUNT' as 'COUNT',
                  goal: 100
                }];
                const newPcConf = { ...(tabConfig.performanceCardsConfig || {}), metrics: newMetrics };
                onChange({ ...config, colaboradorConfig: { ...tabConfig, performanceCardsConfig: newPcConf } });
              }}
              className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex justify-center items-center font-medium"
            >
              <Plus size={16} className="mr-2" /> Adicionar Métrica
            </button>
          </div>
        </div>

        <div className="border-t border-[var(--color-border-default)] pt-4">
          <h4 className="font-semibold text-sm mb-2 text-[var(--color-content-main)]">Filtros Globais</h4>
          <FilterBuilder 
            filters={globalFilters}
            onChange={handleGlobalFiltersChange}
            availableFields={Array.from(new Set(availableCollections.flatMap((c: any) => c.extractedFields || [])))}
          />
        </div>
      </div>
    </>
  );
};

import React, { useState } from 'react';
import { DataSourceConfig } from '../../../types';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { CollapsibleCard } from '../../../components/ui/CollapsibleCard';
import { Plus, Trash2, LayoutTemplate } from 'lucide-react';

interface MetricaBuilderProps {
  config: DataSourceConfig;
  onChange: (config: DataSourceConfig) => void;
}

export const MetricaBuilder: React.FC<MetricaBuilderProps> = ({ config, onChange }) => {
  const mainCol = config.mainCollection || {
    id: crypto.randomUUID(),
    collectionName: '',
    friendlyName: '',
    docName: 'parte',
    docNameType: 'PREFIX',
    sourceType: 'FIREBASE',
    isRelational: false,
    extractedFields: [],
    metricaTabs: []
  };

  const tabs = mainCol.metricaTabs || [];
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  const updateMain = (updates: any) => {
    onChange({
      ...config,
      mainCollection: { ...mainCol, ...updates }
    });
  };

  const addTab = () => {
    const newTabs = [...tabs, { id: crypto.randomUUID(), name: `Nova Guia ${tabs.length + 1}`, fields: [] }];
    updateMain({ metricaTabs: newTabs });
    setActiveTabIndex(newTabs.length - 1);
  };

  const updateTabName = (index: number, name: string) => {
    const newTabs = [...tabs];
    newTabs[index] = { ...newTabs[index], name };
    updateMain({ metricaTabs: newTabs });
  };

  const removeTab = (index: number) => {
    const newTabs = [...tabs];
    newTabs.splice(index, 1);
    updateMain({ metricaTabs: newTabs });
    if (activeTabIndex >= newTabs.length) {
      setActiveTabIndex(Math.max(0, newTabs.length - 1));
    }
  };

  const addFieldToTab = (tabIndex: number) => {
    const newTabs = [...tabs];
    newTabs[tabIndex].fields.push('');
    updateMain({ metricaTabs: newTabs });
  };

  const updateFieldInTab = (tabIndex: number, fieldIndex: number, val: string) => {
    const newTabs = [...tabs];
    newTabs[tabIndex].fields[fieldIndex] = val;
    updateMain({ metricaTabs: newTabs });
  };

  const removeFieldFromTab = (tabIndex: number, fieldIndex: number) => {
    const newTabs = [...tabs];
    newTabs[tabIndex].fields.splice(fieldIndex, 1);
    updateMain({ metricaTabs: newTabs });
  };

  return (
    <CollapsibleCard 
      title="Configuração da Métrica" 
      subtitle="Configure coleções de dados e guias de preenchimento para planilhas de métricas" 
      defaultOpen={true}
    >
      <div className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-[11px] font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">
            Nome da Coleção Principal (Firebase)
          </label>
          <Input 
            value={mainCol.collectionName} 
            onChange={e => updateMain({ collectionName: e.target.value })} 
            placeholder="ex: metricas_2024" 
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">
            Nome da Coleção Principal (Usuário)
          </label>
          <Input 
            value={mainCol.friendlyName || ''} 
            onChange={e => updateMain({ friendlyName: e.target.value })} 
            placeholder="ex: Resultados 2024" 
          />
        </div>
      </div>

      <div className="mt-8 border-t border-[var(--color-border-default)] pt-6">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-[11px] font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider">
            Guias/Abas de Preenchimento
          </label>
          <Button variant="secondary" onClick={addTab} className="h-8 px-3 text-xs">
            <Plus size={14} className="mr-1" />
            Adicionar Guia
          </Button>
        </div>

        {tabs.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-[var(--color-border-default)] rounded-lg text-[var(--color-content-secondary)] text-sm flex flex-col items-center">
            <LayoutTemplate size={32} className="mb-3 text-[var(--color-content-tertiary)]" />
            <p>Nenhuma guia configurada.</p>
            <p className="text-xs mt-1">Crie guias para organizar os campos que o usuário irá preencher.</p>
          </div>
        ) : (
          <div>
            <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabIndex(idx)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                    activeTabIndex === idx 
                      ? 'bg-[var(--color-brand-main)] text-white' 
                      : 'bg-slate-100 text-[var(--color-content-secondary)] hover:bg-slate-200'
                  }`}
                >
                  {tab.name || `Guia ${idx + 1}`}
                </button>
              ))}
            </div>

            {tabs[activeTabIndex] && (
              <div className="bg-slate-50 border border-[var(--color-border-default)] rounded-xl p-5 animate-in fade-in">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">
                      Nome da Guia
                    </label>
                    <Input 
                      value={tabs[activeTabIndex].name} 
                      onChange={e => updateTabName(activeTabIndex, e.target.value)} 
                      placeholder="Ex: Financeiro" 
                    />
                  </div>
                  <div className="flex items-end pb-0.5">
                    <Button 
                      variant="danger" 
                      onClick={() => removeTab(activeTabIndex)} 
                      className="h-10 px-4"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Remover Guia
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-[11px] font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider">
                      Campos desta Guia (Colunas)
                    </label>
                    <Button variant="secondary" onClick={() => addFieldToTab(activeTabIndex)} className="h-8 px-3 text-xs bg-white border border-[var(--color-border-default)]">
                      <Plus size={14} className="mr-1" />
                      Adicionar Campo
                    </Button>
                  </div>

                  {tabs[activeTabIndex].fields.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-[var(--color-border-default)] bg-white rounded-lg text-[var(--color-content-secondary)] text-sm">
                      Nenhum campo nesta guia.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tabs[activeTabIndex].fields.map((f, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="flex-1">
                            <Input 
                              value={f} 
                              onChange={e => updateFieldInTab(activeTabIndex, i, e.target.value)} 
                              placeholder={`Nome do Campo ${i + 1}`} 
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => removeFieldFromTab(activeTabIndex, i)}
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-[var(--color-border-default)] text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </CollapsibleCard>
  );
};

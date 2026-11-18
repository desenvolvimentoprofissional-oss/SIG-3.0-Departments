import React from 'react';
import { Select } from '../../../../../components/ui/Select';
import { Trash2 } from 'lucide-react';
import { FilterBuilder } from '../../FilterBuilder';

export const ColaboradorMetricConfigItem = ({ metric, idx, tabConfig, config, onChange, availableCollections }: any) => {
  const handleUpdateMetric = (updates: any) => {
    const newMetrics = [...(tabConfig.performanceCardsConfig?.metrics || [])];
    newMetrics[idx] = { ...newMetrics[idx], ...updates };
    const newPcConf = { ...(tabConfig.performanceCardsConfig || {}), metrics: newMetrics };
    onChange({ ...config, colaboradorConfig: { ...tabConfig, performanceCardsConfig: newPcConf } });
  };

  const handleRemove = () => {
    const newMetrics = (tabConfig.performanceCardsConfig?.metrics || []).filter((m: any) => m.id !== metric.id);
    const newPcConf = { ...(tabConfig.performanceCardsConfig || {}), metrics: newMetrics };
    onChange({ ...config, colaboradorConfig: { ...tabConfig, performanceCardsConfig: newPcConf } });
  };

  return (
    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-gray-700">Métrica {idx + 1}</span>
        <button 
          onClick={handleRemove}
          className="text-red-400 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-2">
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Rótulo</label>
          <input 
            type="text" 
            className="w-full text-xs p-1.5 border border-gray-300 rounded"
            value={metric.label}
            onChange={(e) => handleUpdateMetric({ label: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Tipo</label>
          <Select
            value={metric.type}
            onChange={(e) => handleUpdateMetric({ type: e.target.value as any })}
            options={[
              { label: 'Contagem (COUNT)', value: 'COUNT' },
              { label: 'Soma (SUM)', value: 'SUM' },
              { label: 'Média (AVG)', value: 'AVG' }
            ]}
          />
        </div>
      </div>
      
      {metric.type !== 'COUNT' && (
        <div className="mb-2">
          <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Campo Alvo</label>
          <Select
            value={metric.targetField || ''}
            onChange={(e) => handleUpdateMetric({ targetField: e.target.value })}
            options={[
              { label: 'Selecione...', value: '' },
              ...availableCollections.flatMap((c: any) => c.extractedFields || []).map((f: any) => ({ label: f, value: f }))
            ]}
          />
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-2">Filtros (Opcional)</label>
        <FilterBuilder 
          filters={metric.filters || []}
          onChange={(filters: any) => handleUpdateMetric({ filters })}
          availableFields={availableCollections.flatMap((c: any) => c.extractedFields || [])}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-2">
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Campo de Meta (Dinâmica)</label>
          <Select
            value={metric.goalField || ''}
            onChange={(e) => handleUpdateMetric({ goalField: e.target.value })}
            options={[
              { label: 'Nenhum (Usar Fixo)', value: '' },
              ...availableCollections.flatMap((c: any) => c.extractedFields || []).map((f: any) => ({ label: f, value: f }))
            ]}
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Meta Fixa (Se não houver campo)</label>
          <input 
            type="number" 
            className="w-full text-xs p-1.5 border border-gray-300 rounded"
            value={metric.goal || 0}
            onChange={(e) => handleUpdateMetric({ goal: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>
      
      <div className="mb-2">
        <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Direção da Meta</label>
        <Select
          value={metric.direction || 'HIGHER_IS_BETTER'}
          onChange={(e) => handleUpdateMetric({ direction: e.target.value as any })}
          options={[
            { label: 'Quanto maior, melhor (Ex: Produtividade)', value: 'HIGHER_IS_BETTER' },
            { label: 'Quanto menor, melhor (Ex: Tempo/Dias)', value: 'LOWER_IS_BETTER' }
          ]}
        />
      </div>
    </div>
  );
};

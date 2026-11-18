import React, { useState } from 'react';
import { ResultadosConfig, DataSourceConfig } from '../../../types';
import { ResultadosColaboradorBuilder } from './ResultadosColaboradorBuilder';
import { ResultadosDepartamentoBuilder } from './ResultadosDepartamentoBuilder';
import { ResultadosSerieHistoricaBuilder } from './ResultadosSerieHistoricaBuilder';
import { Users, Building, History } from 'lucide-react';

interface ResultadosBuilderProps {
  config: ResultadosConfig | undefined;
  onChange: (config: ResultadosConfig) => void;
  dataSources: DataSourceConfig[];
  tenantId: string;
}

export const ResultadosBuilder: React.FC<ResultadosBuilderProps> = ({ config, onChange, dataSources, tenantId }) => {
  const [activeTab, setActiveTab] = useState<'COLABORADOR' | 'DEPARTAMENTO' | 'SERIE_HISTORICA'>('DEPARTAMENTO');

  const safeConfig = config || {};

  return (
    <div className="flex flex-col h-full min-h-[600px] border border-[var(--color-border-default)] rounded-xl overflow-hidden bg-white">
      
      <div className="flex border-b border-[var(--color-border-default)] bg-gray-50">
        <button
          onClick={() => setActiveTab('DEPARTAMENTO')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold transition-colors ${
            activeTab === 'DEPARTAMENTO'
              ? 'bg-white text-[var(--color-brand-main)] border-b-2 border-[var(--color-brand-main)]'
              : 'text-[var(--color-content-secondary)] hover:bg-gray-100 hover:text-[var(--color-content-main)]'
          }`}
        >
          <Building size={18} />
          Ângulo Departamento
        </button>
        <button
          onClick={() => setActiveTab('COLABORADOR')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold transition-colors ${
            activeTab === 'COLABORADOR'
              ? 'bg-white text-[var(--color-brand-main)] border-b-2 border-[var(--color-brand-main)]'
              : 'text-[var(--color-content-secondary)] hover:bg-gray-100 hover:text-[var(--color-content-main)]'
          }`}
        >
          <Users size={18} />
          Ângulo Colaboradores
        </button>
        <button
          onClick={() => setActiveTab('SERIE_HISTORICA')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold transition-colors ${
            activeTab === 'SERIE_HISTORICA'
              ? 'bg-white text-[var(--color-brand-main)] border-b-2 border-[var(--color-brand-main)]'
              : 'text-[var(--color-content-secondary)] hover:bg-gray-100 hover:text-[var(--color-content-main)]'
          }`}
        >
          <History size={18} />
          Ângulo Série Histórica
        </button>
      </div>

      
      <div className="flex-1 bg-white relative">
        {activeTab === 'DEPARTAMENTO' && (
          <ResultadosDepartamentoBuilder 
            config={safeConfig} 
            onChange={onChange} 
            dataSources={dataSources} 
            tenantId={tenantId} 
          />
        )}
        {activeTab === 'COLABORADOR' && (
          <ResultadosColaboradorBuilder 
            config={safeConfig} 
            onChange={onChange} 
            dataSources={dataSources} 
            tenantId={tenantId} 
          />
        )}
        {activeTab === 'SERIE_HISTORICA' && (
          <ResultadosSerieHistoricaBuilder 
            config={safeConfig} 
            onChange={onChange} 
            dataSources={dataSources} 
            tenantId={tenantId} 
          />
        )}
      </div>
    </div>
  );
};

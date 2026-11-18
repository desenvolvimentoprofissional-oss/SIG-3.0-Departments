import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PageMapping, TenantConfig } from '../types';
import { getTenantFirestore } from '../api/tenant.factory';
import { getMetricasDocument, saveMetricasDocument } from '../api/metricas.api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Save, Loader2 } from 'lucide-react';
import { prepareMetricasForSave } from '../lib/metrics.util';
import { logger, sanitizeErrorForTelemetry } from '../lib/logger.util';

interface MetricaTemplateProps {
  mapping: PageMapping;
  tenant: TenantConfig;
  portalTarget?: HTMLElement | null;
}

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const YEARS = Array.from({ length: 10 }, (_, i) => 2021 + i);

export const MetricaTemplate: React.FC<MetricaTemplateProps> = ({ mapping, tenant, portalTarget }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [data, setData] = useState<Record<string, Record<string, any>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTabIdx, setActiveTabIdx] = useState<number>(0);

  const dataSource = mapping.dataSources?.[0];
  const collectionName = dataSource?.mainCollection?.collectionName;
  const docName = dataSource?.mainCollection?.docName || 'parte1';

  const metricaTabs = dataSource?.mainCollection?.metricaTabs || [];
  const extractedFields = dataSource?.mainCollection?.extractedFields || [];
  
  const currentFields = metricaTabs.length > 0 && metricaTabs[activeTabIdx]
    ? metricaTabs[activeTabIdx].fields
    : extractedFields;

  useEffect(() => {
    const loadData = async () => {
      if (!collectionName) {
        setLoading(false);
        return;
      }
      
      const db = getTenantFirestore(tenant);
      
      try {
        const docData = await getMetricasDocument(db, collectionName, docName);
        if (docData) {
          const arrayField = Object.keys(docData).find(k => Array.isArray(docData[k])) || 'metricas';
          const arr = docData[arrayField] || [];
          
          const initialData: Record<string, Record<string, any>> = {};
          arr.forEach((item: any) => {
            const ano = item.ano || currentYear;
            if (item.mes) {
              initialData[`${ano}-${item.mes}`] = { ...item, ano };
            }
          });
          setData(initialData);
        }
      } catch (err) {
        logger.error('ERR_LOAD_METRICA', sanitizeErrorForTelemetry(err));
        setErrorMsg('Erro ao processar requisição. Falha de infraestrutura.');
        setTimeout(() => setErrorMsg(''), 5000);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [collectionName, tenant, currentYear]);

  const handleChange = (mes: string, mesIndex: number, field: string, value: string) => {
    const key = `${selectedYear}-${mes}`;
    
    const lastDay = new Date(selectedYear, mesIndex + 1, 0).getDate();
    const dataReferencia = `${selectedYear}-${String(mesIndex + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}T23:59:59Z`;

    setData(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        mes,
        mes_numero: mesIndex + 1,
        ano: selectedYear,
        data_referencia: dataReferencia,
        createdAt: dataReferencia,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!collectionName) return;
    setSaving(true);
    setSuccessMsg('');

    const db = getTenantFirestore(tenant);

    try {
      const arrayData = prepareMetricasForSave(data, selectedYear, MESES);

      await saveMetricasDocument(db, collectionName, docName, { metricas: arrayData });
      
      const updatedData: Record<string, any> = {};
      arrayData.forEach(item => {
        updatedData[`${item.ano}-${item.mes}`] = item;
      });
      setData(updatedData);

      setSuccessMsg('Métricas salvas com sucesso!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      logger.error('ERR_SAVE_METRICA', sanitizeErrorForTelemetry(err));
      setErrorMsg('Erro ao processar requisição. Falha de infraestrutura.');
      setTimeout(() => setErrorMsg(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-[var(--color-brand-main)] animate-spin" />
      </div>
    );
  }

  const controls = (
    <div className="flex items-center space-x-3">
      <select 
        value={selectedYear} 
        onChange={e => setSelectedYear(parseInt(e.target.value, 10))}
        className="h-9 px-3 rounded-md border border-[var(--color-border-default)] bg-white text-sm font-medium text-[var(--color-content-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-main)]"
      >
        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {portalTarget && createPortal(controls, portalTarget)}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        {metricaTabs.length > 0 ? (
          <div className="flex space-x-1 overflow-x-auto flex-1 w-full sm:mr-4">
            {metricaTabs.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveTabIdx(idx)}
                className={`flex-1 min-w-[100px] px-2 py-1.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${
                  activeTabIdx === idx 
                    ? 'border-[var(--color-brand-main)] text-[var(--color-brand-main)] bg-[var(--color-brand-main)]/5' 
                    : 'border-transparent text-[var(--color-content-secondary)] hover:text-[var(--color-content-primary)] hover:bg-slate-50'
                }`}
              >
                {tab.name || `Guia ${idx + 1}`}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex-1"></div>
        )}

        <div className="flex items-center space-x-3 shrink-0">
          {errorMsg && (
            <span className="text-sm text-red-600 font-medium animate-in fade-in">
              {errorMsg}
            </span>
          )}
          {successMsg && (
            <span className="text-sm text-green-600 font-medium animate-in fade-in">
              {successMsg}
            </span>
          )}
          <Button onClick={handleSave} disabled={saving} className="h-9 px-4 flex items-center justify-center space-x-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Salvar Métricas</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border-default)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 border-b border-[var(--color-border-default)] text-[11px] uppercase text-[var(--color-content-secondary)] font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Mês</th>
                {currentFields.map(field => (
                  <th key={field} className="px-6 py-4">{field}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-default)]">
              {MESES.map((mes, mesIdx) => {
                const key = `${selectedYear}-${mes}`;
                return (
                  <tr key={mes} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-[var(--color-content-primary)] w-32">
                      {mes}
                    </td>
                    {currentFields.map(field => (
                      <td key={field} className="px-6 py-3">
                        <Input
                          value={data[key]?.[field] || ''}
                          onChange={(e) => handleChange(mes, mesIdx, field, e.target.value)}
                          placeholder="0"
                          className="h-9 w-full min-w-[120px]"
                          type="number"
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

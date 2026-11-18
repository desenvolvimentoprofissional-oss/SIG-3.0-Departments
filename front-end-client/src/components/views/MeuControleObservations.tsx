import React from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { SecondaryFieldConfig } from '../../types/index';
import { isFieldVisible } from '../../lib/fieldValidation.util';

interface Observation {
  id: string;
  date: string;
  userId: string;
  userName: string;
  text: string;
  [key: string]: any;
}

interface MeuControleObservationsProps {
  hasObservations: boolean;
  isLoadingMc: boolean;
  observations: Observation[];
  observationFields?: SecondaryFieldConfig[];
  selectedItem?: any;
}

export const MeuControleObservations: React.FC<MeuControleObservationsProps> = ({
  hasObservations,
  isLoadingMc,
  observations,
  observationFields = [],
  selectedItem
}) => {
  if (!hasObservations) return null;

  const getFieldLabel = (key: string) => {
    const field = observationFields.find(f => f.field === key);
    return field ? field.label : key;
  };

  return (
    <div className="bg-[var(--color-brand-main)]/5 p-4 rounded-xl border border-[var(--color-brand-main)]/20">
      <h4 className="text-xs uppercase font-bold text-[var(--color-brand-main)] mb-3 flex items-center">
        Histórico de Observações
      </h4>

      {isLoadingMc ? (
        <p className="text-xs text-[var(--color-content-tertiary)] italic text-center py-4">Carregando...</p>
      ) : (
        <div className="space-y-3 max-h-[300px] overflow-y-auto hidden-scrollbar pr-1">
          {observations.length === 0 ? (
            <p className="text-xs text-[var(--color-content-tertiary)] italic text-center py-4">
              Nenhuma observação registrada.
            </p>
          ) : (
            observations.map((obs) => {
              const blocklist = ['id', '_id', 'date', 'userId', 'userName', 'text', 'relationalId', 'processId'];
              const allowedKeys = observationFields.map(f => f.field);
              
              const customFields = Object.keys(obs).filter(key => {
                if (blocklist.includes(key)) return false;
                if (obs[key] === undefined || obs[key] === '') return false;
                if (!allowedKeys.includes(key)) return false;
                const fieldConfig = observationFields.find(f => f.field === key);
                if (fieldConfig && !isFieldVisible(fieldConfig, obs, selectedItem)) return false;
                return true;
              });
              
              return (
                <details key={obs._id || obs.id} className="bg-white p-3 rounded-lg border border-[var(--color-border-default)] group">
                  <summary className="flex items-center justify-between cursor-pointer list-none hover:opacity-80 transition-opacity">
                    <span className="text-xs font-semibold text-[var(--color-content-secondary)]">
                      {obs.userName}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-[var(--color-content-tertiary)] flex items-center">
                        <Clock size={10} className="mr-1" />
                        {new Date(obs.date).toLocaleString('pt-BR')}
                      </span>
                      <ChevronDown size={14} className="text-[var(--color-content-tertiary)] group-open:rotate-180 transition-transform" />
                    </div>
                  </summary>
                  
                  <div className="pt-3 mt-3 border-t border-[var(--color-border-default)]">
                    {customFields.length > 0 && (
                      <div className="mb-2 grid grid-cols-2 gap-2">
                        {customFields.map(key => (
                          <div key={key} className="text-xs">
                            <span className="font-semibold text-[var(--color-content-tertiary)] uppercase">{getFieldLabel(key)}: </span>
                            <span className="text-[var(--color-content-secondary)]">
                              {typeof obs[key] === 'boolean' ? (obs[key] ? 'Sim' : 'Não') : obs[key]}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {obs.text && (
                      <p className="text-sm text-[var(--color-content-primary)] whitespace-pre-wrap mt-2">
                        {obs.text}
                      </p>
                    )}
                  </div>
                </details>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

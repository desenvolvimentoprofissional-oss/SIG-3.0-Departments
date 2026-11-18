import React, { useState, useMemo, useEffect } from 'react';
import { ResultadoWidget } from '../../../types';
import { getWidgetColorStyle, renderIcon } from './utils';
import { computeChartDataOrMetric } from '../../../lib/aggregations.util';
import { ChevronDown } from 'lucide-react';

export const MetricCardWidget: React.FC<{ widget: ResultadoWidget, data: any, filteredData: any[] }> = ({ widget, data, filteredData }) => {
  const metricValue = typeof data === 'number' ? data : (data as any[]).reduce(((a: number, b: any) => a + b.value), 0);
  const { targetGoal, granularityText, granularityGoals } = widget.binding;
  const progress = targetGoal ? Math.min(100, Math.max(0, (metricValue / targetGoal) * 100)) : 0;
  
const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setIsExpanded(customEvent.detail);
    };
    window.addEventListener('toggle-metric-details', handleToggle);
    return () => window.removeEventListener('toggle-metric-details', handleToggle);
  }, []);

  const toggleExpanded = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    window.dispatchEvent(new CustomEvent('toggle-metric-details', { detail: newState }));
  };

  const granularData = useMemo(() => {
    if (!granularityText || !filteredData.length) return [];
    const simulatedBinding = {
      ...widget.binding,
      groupByField: granularityText,
    };
    return computeChartDataOrMetric('BAR', simulatedBinding, filteredData) as Array<{name: string, value: number}>;
  }, [granularityText, filteredData, widget.binding]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-2xl font-semibold text-[var(--color-content-primary)]">
            {typeof metricValue === 'number' ? (Number.isInteger(metricValue) ? metricValue.toLocaleString('pt-BR') : metricValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })) : metricValue}
          </div>
          <div className="text-xs font-medium text-[var(--color-content-secondary)] mt-1">
            {widget.title}
          </div>
        </div>
        <div 
          className={widget.color ? "p-2 rounded-lg relative overflow-hidden shrink-0" : "p-2 bg-[var(--color-background-soft)] text-[var(--color-content-tertiary)] rounded-lg shrink-0"}
        >
          {widget.color && (
            <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundColor: getWidgetColorStyle(widget.color) }} />
          )}
          <div className="relative z-10">
            {renderIcon(widget, 'Hash', 20, '', widget.color)}
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-h-[16px]"></div>

      {(targetGoal || (granularityText && granularData.length > 0)) && (
        <div className="mt-auto flex flex-col">
          {targetGoal ? (
            <div className="mb-1">
              <div className="flex justify-between text-[10px] font-semibold mb-1.5">
                <span className="text-[var(--color-content-tertiary)]">Progresso</span>
                <span className="text-[var(--color-content-secondary)]">{progress.toFixed(1)}% de {targetGoal.toLocaleString('pt-BR')}</span>
              </div>
              <div className="w-full h-[3px] bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${progress}%`,
                    backgroundColor: widget.color ? getWidgetColorStyle(widget.color) : 'var(--color-brand-main)'
                  }}
                />
              </div>
            </div>
          ) : null}
          
          {granularityText && granularData.length > 0 && (
            <div className={`flex flex-col ${targetGoal ? 'mt-2' : ''}`}>
              {isExpanded && (
                <div className="mb-2 space-y-3 pt-3 border-t border-[var(--color-border-default)]">
                  {granularData.map((item, idx) => {
                    const goalInfo = granularityGoals?.find(g => String(g.value).trim().toLowerCase() === String(item.name).trim().toLowerCase());
                    const itemGoal = goalInfo?.goal;
                    const hasGoal = typeof itemGoal === 'number' && itemGoal > 0;
                    
                    const itemProgress = hasGoal 
                      ? Math.min(100, Math.max(0, (item.value / itemGoal) * 100)) 
                      : metricValue > 0 
                        ? Math.min(100, Math.max(0, (item.value / metricValue) * 100)) 
                        : 0;
                        
                    return (
                      <div key={idx} className="flex flex-col">
                        <div className="text-[11px] font-medium text-[var(--color-content-secondary)] truncate mb-1" title={item.name}>
                          {item.name}
                        </div>
                        
                        <div className="w-full h-[3px] bg-gray-100 rounded-full overflow-hidden mb-1">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${itemProgress}%`,
                              backgroundColor: widget.color ? getWidgetColorStyle(widget.color) : 'var(--color-brand-main)'
                            }}
                          />
                        </div>

                        <div className="flex justify-between text-[9px] text-[var(--color-content-tertiary)] font-semibold">
                          <span>
                            {Number.isInteger(item.value) ? item.value.toLocaleString('pt-BR') : item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            {hasGoal ? ` / ${itemGoal.toLocaleString('pt-BR')}` : ''}
                          </span>
                          <span className={hasGoal && itemProgress >= 100 ? 'text-[var(--color-status-success)]' : ''}>
                            {itemProgress.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="flex justify-center mt-2 -mb-2">
                <button
                  onClick={toggleExpanded}
                  className="flex items-center text-[10px] font-semibold text-[var(--color-brand-main)] hover:opacity-80 transition-opacity group"
                >
                  {isExpanded ? 'Ocultar Detalhes' : 'Ver Detalhes'}
                  <ChevronDown size={14} className={`ml-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
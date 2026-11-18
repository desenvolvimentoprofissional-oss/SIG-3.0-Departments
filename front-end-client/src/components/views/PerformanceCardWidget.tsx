import React, { useMemo, useState, useEffect } from "react";
import { ResultadoWidget, PerformanceCardsConfig, FilterCondition } from "../../types";
import { evaluateFilter } from '../../lib/widget.util';
import { processPerformanceEmployee } from '../../lib/performance.util';

interface PerformanceCardWidgetProps {
  widget: ResultadoWidget;
  data: any[];
  globalConfig?: PerformanceCardsConfig;
}

const getProgressColor = (value: number) => {
  if (value <= 50) return "#EF4444";
  if (value <= 95) return "#F97316";
  return "#10B981";
};



export const PerformanceCardWidget: React.FC<PerformanceCardWidgetProps> = ({ widget, data, globalConfig }) => {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(timer);
  }, []);
  
  const { collection, responsibleEmailValue } = widget.binding;
  const kpiGroupingField = globalConfig?.kpiGroupingField || widget.binding.kpiGroupingField;
  const responsibleEmailField = globalConfig?.responsibleEmailField || widget.binding.responsibleEmailField;
  const responsibleNameField = globalConfig?.responsibleNameField || widget.binding.responsibleNameField;
  const avatarField = globalConfig?.avatarField || widget.binding.avatarField;
  const roleField = globalConfig?.roleField || widget.binding.roleField;

  const emp = useMemo(() => {
    return processPerformanceEmployee(data, widget.binding, globalConfig);
  }, [data, widget.binding, globalConfig]);

  if (!emp) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-[var(--color-content-tertiary)] p-4 text-center">
        <p className="text-sm">Nenhum dado encontrado para o responsável: <b>{responsibleEmailValue || 'Não configurado'}</b></p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col -mx-2 -my-2">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {emp.avatar ? (
            <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[var(--color-background-soft)] flex items-center justify-center text-lg font-semibold text-[var(--color-content-secondary)]">
              {emp.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold text-[var(--color-content-primary)] leading-tight truncate max-w-[150px]" title={emp.email}>{emp.name}</h3>
            <span className="text-[11px] font-medium text-[var(--color-content-secondary)] truncate max-w-[150px] block mt-0.5">{emp.role}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-black text-[var(--color-content-primary)] leading-none">{emp.score}</span>
          <span className="text-[9px] uppercase font-bold text-[var(--color-content-tertiary)] block mt-1 tracking-wider">Score</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        {emp.kpis.map((kpi: any, idx: number) => (
          <div key={idx} className="bg-[var(--color-background-soft)] p-2 rounded-xl flex flex-col items-start justify-center border border-[var(--color-border-default)]">
            <span className="text-[9px] text-[var(--color-content-tertiary)] font-bold uppercase tracking-wider truncate w-full mb-1" title={kpi.label}>{kpi.label}</span>
            <span className="text-[14px] font-bold text-[var(--color-content-primary)] tracking-tight">{kpi.value}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2 mb-4">
        {emp.metrics.map((metric: any, idx: number) => (
          <div key={idx} className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-medium text-[var(--color-content-secondary)]">{metric.label}</span>
              <span className="text-[var(--color-content-primary)] font-semibold">{metric.displayValue} / {metric.goal} ({metric.displayPercentage.toFixed(0)}%)</span>
            </div>
            <div className="w-full h-[3px] bg-slate-100 rounded-full overflow-hidden">
              <div 
                 className="h-full rounded-full transition-all duration-1000 ease-out" 
                 style={{ 
                   width: animated ? `${metric.barWidth}%` : '0%', 
                   backgroundColor: metric.direction === 'LOWER_IS_BETTER' && metric.displayPercentage > 100 
                      ? '#ef4444' 
                      : '#64748b' 
                 }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

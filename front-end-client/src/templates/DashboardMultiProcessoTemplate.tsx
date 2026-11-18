import React, { useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, ComposedChart } from 'recharts';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import { PageMapping } from '../types';
import { aggregateDashboardMetrics } from '../lib/metrics.util';

interface DashboardMultiProcessoTemplateProps {
  items: any[];
  mapping: PageMapping;
}

export const DashboardMultiProcessoTemplate: React.FC<DashboardMultiProcessoTemplateProps> = ({ items, mapping }) => {
  const tagField = 'status';
  const dateField = 'createdAt';

  const processosData = useMemo(() => {
    const processMap = new Map<string, any[]>();
    items.forEach(item => {
      const pName = item._collection || 'Geral';
      if (!processMap.has(pName)) processMap.set(pName, []);
      processMap.get(pName)!.push(item);
    });

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6'];
    const chartTypes = ['line', 'composed', 'area', 'horizontal-bar'];

    return Array.from(processMap.entries()).map(([title, pItems], index) => {
      const { categories, trend, kpis } = aggregateDashboardMetrics(pItems, tagField, dateField);
      return {
        id: title,
        title: title,
        color: colors[index % colors.length],
        chartType: chartTypes[index % chartTypes.length],
        categories,
        trend,
        kpis: [
          { label: 'Abertos/Novos', value: kpis.abertos, meta: kpis.abertos > 0 ? Math.ceil(kpis.abertos * 1.2) : 10, progress: 85, icon: FileText },
          { label: 'Em Andamento', value: kpis.andamento, meta: kpis.andamento > 0 ? Math.ceil(kpis.andamento * 1.2) : 10, progress: 65, icon: Clock },
          { label: 'Concluídos', value: kpis.concluidos, meta: kpis.concluidos > 0 ? Math.ceil(kpis.concluidos * 1.1) : 10, progress: 95, icon: CheckCircle }
        ]
      };
    });
  }, [items, tagField, dateField]);

  if (!items.length) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-[var(--color-content-tertiary)]">
        <p>Nenhum dado disponível para o Dashboard.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-4 lg:gap-6 flex-1 min-h-0">
        {processosData.map((processo) => (
          <Card key={processo.id} className="flex flex-col !p-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-[var(--color-border-default)] bg-[var(--color-background-light)] h-full min-h-[350px]">
            <div className="px-5 py-3 border-b border-[var(--color-border-default)] bg-[var(--color-content-inverse)] flex items-center justify-between shrink-0">
              <h3 className="text-[15px] font-semibold text-[var(--color-content-primary)] tracking-tight">
                {processo.title}
              </h3>
            </div>
            
            <div className="flex-1 flex flex-col p-4 bg-[var(--color-content-inverse)] overflow-hidden">
              <div className="grid grid-cols-3 gap-2 mb-3 shrink-0">
                {processo.kpis.map((kpi, idx) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={idx} className="flex flex-col p-2 rounded-lg bg-[var(--color-background-light)] border border-[var(--color-border-default)]">
                      <div className="flex items-start justify-between mb-1.5">
                        <div>
                          <div className="text-lg font-semibold text-[var(--color-content-primary)]">
                            {kpi.value}
                          </div>
                          <div className="text-[10px] font-medium text-[var(--color-content-secondary)] mt-0.5">
                            {kpi.label}
                          </div>
                        </div>
                        <div className="p-1 rounded-md relative overflow-hidden shrink-0">
                          <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundColor: processo.color }} />
                          <div className="relative z-10" style={{ color: processo.color }}>
                            <Icon size={14} strokeWidth={2} />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-auto flex flex-col pt-0.5">
                        <div className="flex justify-between text-[9px] font-semibold mb-1">
                           <span className="text-[var(--color-content-tertiary)]">Meta</span>
                           <span className="text-[var(--color-content-secondary)]">{kpi.meta}</span>
                        </div>
                        <div className="w-full h-[2.5px] bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (kpi.value / (kpi.meta || 1)) * 100)}%`, backgroundColor: processo.color }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex-1 min-h-[100px] w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  {processo.chartType === 'line' ? (
                    <LineChart data={processo.trend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-default)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-content-secondary)' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-content-secondary)' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border-default)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--color-content-inverse)' }} 
                        itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                        labelStyle={{ fontSize: '11px', color: 'var(--color-content-secondary)', marginBottom: '4px' }}
                      />
                      <Line type="monotone" dataKey="value" stroke={processo.color} strokeWidth={2.5} dot={{ r: 2, strokeWidth: 1.5, fill: 'var(--color-content-inverse)' }} activeDot={{ r: 4, strokeWidth: 0 }} />
                    </LineChart>
                  ) : processo.chartType === 'area' ? (
                    <AreaChart data={processo.trend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`color-${processo.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={processo.color} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={processo.color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-default)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-content-secondary)' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-content-secondary)' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border-default)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--color-content-inverse)' }} 
                        itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                        labelStyle={{ fontSize: '11px', color: 'var(--color-content-secondary)', marginBottom: '4px' }}
                      />
                      <Area type="monotone" dataKey="value" stroke={processo.color} fillOpacity={1} fill={`url(#color-${processo.id})`} strokeWidth={2.5} activeDot={{ r: 4, strokeWidth: 0 }} />
                    </AreaChart>
                  ) : processo.chartType === 'composed' ? (
                    <ComposedChart data={processo.trend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-default)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-content-secondary)' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-content-secondary)' }} />
                      <Tooltip 
                        cursor={{ fill: 'var(--color-background-light)' }} 
                        contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border-default)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--color-content-inverse)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                        labelStyle={{ fontSize: '11px', color: 'var(--color-content-secondary)', marginBottom: '4px' }}
                      />
                      <Bar dataKey="value" fill={processo.color} radius={[3, 3, 0, 0]} maxBarSize={16} fillOpacity={0.3} />
                      <Line type="monotone" dataKey="value" stroke={processo.color} strokeWidth={2.5} dot={{ r: 2, strokeWidth: 1.5, fill: 'var(--color-content-inverse)' }} activeDot={{ r: 4, strokeWidth: 0 }} />
                    </ComposedChart>
                  ) : (
                    <BarChart data={processo.categories.slice(0, 5)} layout="vertical" margin={{ top: 5, right: 15, left: 0, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border-default)" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-content-secondary)' }} />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={90}
                        axisLine={false} 
                        tickLine={false} 
                        interval={0}
                        tick={{ fontSize: 12, fill: 'var(--color-content-secondary)' }}
                      />
                      <Tooltip 
                        cursor={{ fill: 'var(--color-background-light)' }} 
                        contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border-default)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--color-content-inverse)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                        labelStyle={{ fontSize: '11px', color: 'var(--color-content-secondary)', marginBottom: '4px' }}
                      />
                      <Bar dataKey="value" fill={processo.color} radius={[0, 3, 3, 0]} maxBarSize={8} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};


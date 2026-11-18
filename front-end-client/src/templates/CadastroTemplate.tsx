import React, { useMemo } from 'react';
import { PageMapping } from '../types/index';
import { useMappingStore } from '../store/mappingStore';
import { SummaryCard } from '../components/ui/SummaryCard';
import { Database, Folder, Activity, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CadastroTemplateProps {
  mapping: PageMapping;
  items: any[];
}

export const CadastroTemplate: React.FC<CadastroTemplateProps> = ({ mapping, items }) => {
  const { pageDataLoading, pageDataError } = useMappingStore();

  const metrics = useMemo(() => {
    if (!items) return { total: 0, recentlyAdded: 0, byStatus: [] };

    const total = items.length;
    
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentlyAdded = items.filter((item: any) => {
      const itemConfig = item._colConfig || item._mapping || mapping.viewConfig || (mapping.collections || []).find(c => c.collectionName === item._collection) || (mapping.collections || [])[0];
      const createdAt = itemConfig?.primaryFields?.createdAt ? item[itemConfig.primaryFields.createdAt] : undefined;
      if (!createdAt) return false;
      const date = new Date(createdAt).getTime();
      return date > thirtyDaysAgo;
    }).length;

    const statusCounts: Record<string, number> = {};
    items.forEach((item: any) => {
      const itemConfig = item._colConfig || item._mapping || mapping.viewConfig || (mapping.collections || []).find(c => c.collectionName === item._collection) || (mapping.collections || [])[0];
      const statusField = itemConfig?.primaryFields?.status || 'Status';
      const status = item[statusField] || 'Sem Status';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const byStatus = Object.keys(statusCounts).map(key => ({
      name: key,
      value: statusCounts[key]
    }));

    return { total, recentlyAdded, byStatus };
  }, [items, mapping]);

  if (pageDataLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8 bg-gray-50/50">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[var(--color-brand-main)] rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-gray-500">Injetando Coleções de Cadastro...</p>
        </div>
      </div>
    );
  }

  if (pageDataError) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center bg-red-50 p-6 rounded-xl border border-red-100 max-w-lg">
          <p className="font-bold text-red-600 mb-2">Acesso Negado ou Falha de Conexão</p>
          <p className="text-sm text-red-500 mb-4">{pageDataError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto hidden-scrollbar">
       <div className="max-w-7xl mx-auto space-y-6">
           
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <SummaryCard 
               id="total-cadastros"
               title="Total de Cadastros"
               subtitle="Volume histórico"
               icon={Database}
               metrics={[{ icon: Database, value: metrics.total.toString(), tooltip: 'Total de Registros', highlight: 'success' }]}
             />
             <SummaryCard 
               id="recently-added"
               title="Adicionados Recentemente"
               subtitle="Últimos 30 dias"
               icon={Activity}
               metrics={[{ icon: Activity, value: metrics.recentlyAdded.toString(), tooltip: 'Adicionados em 30d' }]}
             />
             <SummaryCard 
               id="mapped-cols"
               title="Fonte de Dados"
               subtitle="Nesta Visão"
               icon={Folder}
               metrics={[{ icon: Folder, value: mapping.dataSources?.length || (mapping as any).dataSource ? "Relacional" : (mapping.collections?.length || 0).toString(), tooltip: 'Fonte de Dados' }]}
             />
             <SummaryCard 
               id="mapped-fields"
               title="Campos Analisados"
               subtitle="Por documento"
               icon={Users}
               metrics={[{ icon: Users, value: Math.max(1, (mapping.viewConfig || (mapping.collections || [])[0])?.secondaryFieldsReadOnly?.length || 0).toString(), tooltip: 'Campos Lidos' }]}
             />
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-xl border border-[var(--color-border-default)] shadow-sm">
                <h3 className="text-base font-bold text-[var(--color-content-primary)] mb-6">Distribuição por Status</h3>
                {metrics.byStatus.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics.byStatus}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                        <Tooltip 
                           cursor={{fill: 'transparent'}}
                           contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar dataKey="value" fill="var(--color-brand-main)" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-sm text-[var(--color-content-tertiary)]">
                     Nenhum dado com status identificado.
                  </div>
                )}
             </div>

             <div className="bg-white p-6 rounded-xl border border-[var(--color-border-default)] shadow-sm">
                <h3 className="text-base font-bold text-[var(--color-content-primary)] mb-6">Cadastros Recentes</h3>
                <div className="space-y-4">
                  {items.slice(0, 5).map((item: any, idx: number) => (
                    <div key={item._id || idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                       <div>
                         <p className="font-semibold text-sm text-[var(--color-content-primary)]">
                           {item[(item._colConfig || item._mapping || mapping.viewConfig)?.primaryFields?.name] || 'Registro sem nome'}
                         </p>
                         <p className="text-xs text-[var(--color-content-secondary)] mt-0.5">
                           ID: {String(item._id).split('_')[0]}
                         </p>
                       </div>
                       <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-700">
                         {item[(item._colConfig || item._mapping || mapping.viewConfig)?.primaryFields?.status] || 'Sem status'}
                       </span>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <p className="text-sm text-[var(--color-content-tertiary)] text-center py-4">Nenhum registro encontrado.</p>
                  )}
                </div>
             </div>
           </div>

         </div>
    </div>
  );
};

import React from 'react';
import { ResultadoWidget } from '../../../types';
import { renderIcon } from './utils';

export const TableTop5Widget: React.FC<{ widget: ResultadoWidget, data: any }> = ({ widget, data }) => {
  const chartData = Array.isArray(data) ? data : [{ name: 'Total', value: data }];
  const top5 = chartData.slice(0, 5);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center mb-4 shrink-0">
        <div className="mr-2 flex items-center justify-center w-8 h-8 rounded bg-[var(--color-background-light)] text-[var(--color-brand-main)]">
          {renderIcon(widget, 'List', 16, '', widget.color)}
        </div>
        <div>
          <h3 className="text-sm font-bold text-[var(--color-brand-dark)] tracking-tight">{widget.title}</h3>
        </div>
      </div>
      <div className="flex-1 overflow-auto rounded-lg border border-[var(--color-border-default)] shadow-sm custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[var(--color-background-light)] bg-opacity-50 text-[10px] uppercase font-bold text-[var(--color-content-tertiary)] tracking-widest sticky top-0 z-10 border-b border-[var(--color-border-default)]">
            <tr>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-default)] text-[13px]">
            {top5.map((item, i) => (
              <tr key={i} className="hover:bg-[var(--color-background-light)] transition-colors group">
                <td className="px-4 py-2.5 font-medium text-[var(--color-content-primary)]">{item.name}</td>
                <td className="px-4 py-2.5 text-right text-[var(--color-content-secondary)]">{item.value?.toLocaleString() ?? 0}</td>
              </tr>
            ))}
            {top5.length === 0 && (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-[var(--color-content-tertiary)]">Nenhum dado encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

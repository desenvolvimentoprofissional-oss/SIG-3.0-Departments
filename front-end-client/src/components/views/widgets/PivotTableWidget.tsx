import React, { useMemo, useState } from 'react';
import { ResultadoWidget } from '../../../types';
import { renderIcon } from './utils';
import { getConfigs, calcAggregateValue } from '../../../lib/aggregations.util';

export const PivotTableWidget: React.FC<{ widget: ResultadoWidget, filteredData: any[] }> = ({ widget, filteredData }) => {
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({});
  const { binding } = widget;
  const dateField = binding.groupByField;
  const categoryField = binding.categoryField;
  const dateGrouping = binding.dateGrouping;
  const isYearMode = dateGrouping === 'YEAR';

  const tableData = useMemo(() => {
    if (!dateField || !categoryField) return { columns: [], rows: [], grandTotal: {}, overallTotal: 0 };

    const columnsSet = new Set<string>();
    filteredData.forEach(item => {
      const cat = item[categoryField];
      if (cat !== undefined && cat !== null) {
        columnsSet.add(String(cat));
      } else {
        columnsSet.add('N/A');
      }
    });
    
    const columns = Array.from(columnsSet).sort();

    const yearMonthData: Record<string, { 
      items: any[], 
      total: Record<string, any[]>, 
      months: Record<string, { items: any[], columns: Record<string, any[]> }> 
    }> = {};
    const monthData: Record<string, { items: any[], columns: Record<string, any[]> }> = {};
    const grandTotalItems: Record<string, any[]> = {};
    const allItems: any[] = [];

    filteredData.forEach(item => {
      const rawDate = item[dateField];
      let yearKey = 'N/A';
      let monthKey = 'N/A';
      let fullMonthKey = 'N/A';

      if (rawDate) {
        const d = new Date(rawDate);
        if (!isNaN(d.getTime())) {
          yearKey = String(d.getUTCFullYear());
          const m = String(d.getUTCMonth() + 1).padStart(2, '0');
          monthKey = m;
          fullMonthKey = `${m}/${yearKey}`;
        }
      }

      let catKey = item[categoryField];
      if (catKey === undefined || catKey === null) catKey = 'N/A';
      catKey = String(catKey);

      allItems.push(item);

      if (!grandTotalItems[catKey]) grandTotalItems[catKey] = [];
      grandTotalItems[catKey].push(item);

      if (isYearMode) {
        if (!yearMonthData[yearKey]) {
          yearMonthData[yearKey] = { items: [], total: {}, months: {} };
        }
        yearMonthData[yearKey].items.push(item);
        if (!yearMonthData[yearKey].total[catKey]) yearMonthData[yearKey].total[catKey] = [];
        yearMonthData[yearKey].total[catKey].push(item);
        
        if (!yearMonthData[yearKey].months[monthKey]) {
          yearMonthData[yearKey].months[monthKey] = { items: [], columns: {} };
        }
        yearMonthData[yearKey].months[monthKey].items.push(item);
        if (!yearMonthData[yearKey].months[monthKey].columns[catKey]) yearMonthData[yearKey].months[monthKey].columns[catKey] = [];
        yearMonthData[yearKey].months[monthKey].columns[catKey].push(item);
      } else {
        if (!monthData[fullMonthKey]) {
          monthData[fullMonthKey] = { items: [], columns: {} };
        }
        monthData[fullMonthKey].items.push(item);
        if (!monthData[fullMonthKey].columns[catKey]) monthData[fullMonthKey].columns[catKey] = [];
        monthData[fullMonthKey].columns[catKey].push(item);
      }
    });

    const configs = getConfigs(binding);
    const grandTotal: Record<string, number> = {};
    Object.keys(grandTotalItems).forEach(catKey => {
      grandTotal[catKey] = calcAggregateValue(configs, grandTotalItems[catKey], binding.aggregate);
    });
    const overallTotal = calcAggregateValue(configs, allItems, binding.aggregate);

    if (isYearMode) {
      const rows = Object.keys(yearMonthData).sort().reverse().map(year => {
        const data = yearMonthData[year];
        const yearTotal: Record<string, number> = {};
        Object.keys(data.total).forEach(catKey => {
           yearTotal[catKey] = calcAggregateValue(configs, data.total[catKey], binding.aggregate);
        });
        const rowTotalValue = calcAggregateValue(configs, data.items, binding.aggregate);

        const months = Object.keys(data.months).sort().reverse().map(m => {
          const monthVals: Record<string, number> = {};
          Object.keys(data.months[m].columns).forEach(catKey => {
             monthVals[catKey] = calcAggregateValue(configs, data.months[m].columns[catKey], binding.aggregate);
          });
          const subRowTotalValue = calcAggregateValue(configs, data.months[m].items, binding.aggregate);
          return {
            label: `${m}/${year}`,
            values: monthVals,
            rowTotal: subRowTotalValue
          };
        });
        return {
          label: year,
          values: yearTotal,
          rowTotal: rowTotalValue,
          subRows: months,
          isExpandable: true
        };
      });
      return { columns, rows, grandTotal, overallTotal };
    } else {
      const rows = Object.keys(monthData).sort((a, b) => {
        if (a === 'N/A') return 1;
        if (b === 'N/A') return -1;
        const [ma, ya] = a.split('/');
        const [mb, yb] = b.split('/');
        const va = parseInt(ya) * 100 + parseInt(ma);
        const vb = parseInt(yb) * 100 + parseInt(mb);
        return vb - va;
      }).map(mKey => {
        const monthVals: Record<string, number> = {};
        Object.keys(monthData[mKey].columns).forEach(catKey => {
           monthVals[catKey] = calcAggregateValue(configs, monthData[mKey].columns[catKey], binding.aggregate);
        });
        const rowTotalValue = calcAggregateValue(configs, monthData[mKey].items, binding.aggregate);
        return {
          label: mKey,
          values: monthVals,
          rowTotal: rowTotalValue,
          subRows: [],
          isExpandable: false
        };
      });
      return { columns, rows, grandTotal, overallTotal };
    }
  }, [filteredData, dateField, categoryField, isYearMode, binding]);

  const toggleYear = (year: string) => {
    setExpandedYears(prev => ({ ...prev, [year]: !prev[year] }));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center mb-4 shrink-0">
        <div className="mr-2 flex items-center justify-center w-8 h-8 rounded bg-[var(--color-background-light)] text-[var(--color-brand-main)]">
          {renderIcon(widget, 'Table', 16, '', widget.color)}
        </div>
        <div>
          <h3 className="text-sm font-bold text-[var(--color-brand-dark)] tracking-tight">{widget.title}</h3>
        </div>
      </div>
      
      {(!dateField || !categoryField) ? (
        <div className="flex-1 flex items-center justify-center text-sm text-[var(--color-content-secondary)]">
          Configure as colunas de data (primeira coluna) e categoria (colunas adicionais) para exibir a tabela.
        </div>
      ) : (
        <div className="flex-1 overflow-auto rounded-lg border border-[var(--color-border-default)] shadow-sm custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--color-background-light)] bg-opacity-50 text-[10px] uppercase font-bold text-[var(--color-content-tertiary)] tracking-widest sticky top-0 z-10 border-b border-[var(--color-border-default)]">
              <tr>
                <th className="px-4 py-3 border-r border-[var(--color-border-default)] whitespace-nowrap w-40">
                  {isYearMode ? 'Ano / Mês' : 'Mês'}
                </th>
                {tableData.columns.map(col => (
                  <th key={col} className="px-4 py-3 border-r border-[var(--color-border-default)] whitespace-nowrap text-right">
                    {col}
                  </th>
                ))}
                <th className="px-4 py-3 whitespace-nowrap text-right bg-[var(--color-background-light)] bg-opacity-50">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-default)] text-[13px]">
              {tableData.rows.length === 0 ? (
                <tr>
                  <td colSpan={tableData.columns.length + 2} className="px-4 py-8 text-center text-[var(--color-content-tertiary)]">
                    Nenhum dado encontrado para os filtros atuais.
                  </td>
                </tr>
              ) : (
                tableData.rows.map(row => {
                  const isExpanded = expandedYears[row.label];
                  
                  return (
                    <React.Fragment key={row.label}>
                      <tr 
                        className={`hover:bg-[var(--color-background-light)] transition-colors group ${row.isExpandable ? 'font-medium text-[var(--color-content-primary)]' : 'text-[var(--color-content-secondary)]'}`}
                      >
                        <td className="px-0 py-0 border-r border-[var(--color-border-default)] whitespace-nowrap">
                          {row.isExpandable ? (
                            <button 
                              onClick={() => toggleYear(row.label)}
                              className="w-full h-full px-4 py-2.5 flex items-center gap-2 text-left hover:bg-[var(--color-background-light)] focus:outline-none focus:bg-[var(--color-brand-main)]/10"
                            >
                              <span className="text-[var(--color-content-tertiary)] w-4 inline-block text-center text-[10px]">
                                {isExpanded ? '▼' : '▶'}
                              </span>
                              {row.label}
                            </button>
                          ) : (
                            <div className="w-full h-full px-4 py-2.5 flex items-center gap-2">
                              {isYearMode && <span className="w-4 inline-block" />}
                              {row.label}
                            </div>
                          )}
                        </td>
                        {tableData.columns.map(col => (
                          <td key={col} className="px-4 py-2.5 text-right">
                            {row.values[col] != null ? row.values[col].toLocaleString() : '-'}
                          </td>
                        ))}
                        <td className="px-4 py-2.5 text-right font-semibold border-l border-[var(--color-border-default)] bg-[var(--color-background-light)] bg-opacity-30">
                          {row.rowTotal != null ? row.rowTotal.toLocaleString() : '-'}
                        </td>
                      </tr>
                      {isExpanded && row.subRows.map(subRow => (
                        <tr key={subRow.label} className="bg-gray-50/50 hover:bg-[var(--color-background-light)] transition-colors text-[13px] group">
                          <td className="px-4 py-2.5 border-r border-[var(--color-border-default)] whitespace-nowrap pl-10 text-[var(--color-content-secondary)]">
                            {subRow.label}
                          </td>
                          {tableData.columns.map(col => (
                            <td key={col} className="px-4 py-2.5 text-right text-[var(--color-content-secondary)]">
                              {subRow.values[col] != null ? subRow.values[col].toLocaleString() : '-'}
                            </td>
                          ))}
                          <td className="px-4 py-2.5 text-right font-medium border-l border-[var(--color-border-default)] text-[var(--color-content-primary)]">
                            {subRow.rowTotal != null ? subRow.rowTotal.toLocaleString() : '-'}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
            {tableData.rows.length > 0 && (
              <tfoot className="bg-[var(--color-background-light)] bg-opacity-50 text-xs font-semibold text-[var(--color-content-primary)] sticky bottom-0 z-10 border-t-2 border-[var(--color-border-default)]">
                <tr>
                  <td className="px-4 py-3 border-r border-[var(--color-border-default)] whitespace-nowrap uppercase tracking-wider text-[var(--color-content-tertiary)]">
                    Total Geral
                  </td>
                  {tableData.columns.map(col => (
                    <td key={col} className="px-4 py-3 text-right text-[var(--color-brand-dark)]">
                      {tableData.grandTotal[col] != null ? tableData.grandTotal[col].toLocaleString() : 0}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right border-l border-[var(--color-border-default)] bg-[var(--color-background-light)] text-[var(--color-brand-dark)]">
                    {tableData.overallTotal != null ? tableData.overallTotal.toLocaleString() : 0}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
    </div>
  );
};

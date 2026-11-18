import React, { useMemo } from 'react';
import { ResultadoWidget, ResultadosTabConfig } from '../../types';
import { computeChartDataOrMetric } from '../../lib/aggregations.util';
import { aggregateFieldWithFilters, evaluateFilter } from '../../lib/widget.util';
import { PerformanceCardWidget } from './PerformanceCardWidget';
import { MetricCardWidget } from './widgets/MetricCardWidget';
import { TableTop5Widget } from './widgets/TableTop5Widget';
import { PivotTableWidget } from './widgets/PivotTableWidget';
import { BarChartWidget, LineChartWidget, PieChartWidget } from './widgets/ChartWidgets';

interface WidgetRendererProps {
  widget: ResultadoWidget;
  allData: any[];
  activeConfig: ResultadosTabConfig | undefined;
}

const WIDGET_MAP: Record<string, React.FC<{ widget: ResultadoWidget, data: any, filteredData: any[], globalConfig?: any }>> = {
  PERFORMANCE_CARD: PerformanceCardWidget,
  METRIC_CARD: MetricCardWidget,
  TABLE_TOP_5: TableTop5Widget,
  PIVOT_TABLE: PivotTableWidget,
  BAR: BarChartWidget,
  LINE: LineChartWidget,
  PIE: PieChartWidget,
  DONUT: PieChartWidget,
};

export const WidgetRenderer: React.FC<WidgetRendererProps> = React.memo(({ widget, allData, activeConfig }) => {

  const filteredData = useMemo(() => {
    if (!allData || allData.length === 0) return [];
    
    const globalFilters = activeConfig?.globalFilters || [];
    const { collection, filters = [] } = widget.binding;
    
    let filtered = allData.filter(item => item._collection === collection || !collection);

    const allFilters = [...globalFilters, ...filters];
    if (allFilters && allFilters.length > 0) {
      filtered = filtered.filter(item => {
        return allFilters.every(f => evaluateFilter(item, f));
      });
    }
    return filtered;
  }, [allData, activeConfig?.globalFilters, widget.binding.collection, widget.binding.filters]);

  const chartDataOrMetric = useMemo(() => {
    return computeChartDataOrMetric(widget.type, widget.binding, filteredData);
  }, [filteredData, widget.type, widget.binding]);

  const Component = WIDGET_MAP[widget.type];
  if (!Component) return <div>Unsupported widget</div>;

  return <Component widget={widget} data={chartDataOrMetric} filteredData={filteredData} globalConfig={activeConfig?.performanceCardsConfig} />;
});

export type ResultadoWidgetType = 'BAR' | 'LINE' | 'PIE' | 'DONUT' | 'METRIC_CARD' | 'TABLE_TOP_5' | 'PERFORMANCE_CARD' | 'PIVOT_TABLE';
export type ResultadoAggregateType = 'COUNT' | 'SUM' | 'AVG' | 'MAX' | 'MIN';
export type DateGroupingType = 'DAY' | 'MONTH' | 'YEAR';

export type FilterOperator = 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'GREATER_THAN_OR_EQUALS' | 'LESS_THAN_OR_EQUALS' | 'CONTAINS';

export interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string;
}

export interface TargetFieldConfig {
  field: string;
  filters?: FilterCondition[];
  label?: string;
  color?: string;
}

export interface ResultadoDataBinding {
  collection: string;
  aggregate: ResultadoAggregateType;
  targetField?: string;
  targetFields?: string[];
  targetFieldConfigs?: TargetFieldConfig[];
  targetGoal?: number;
  granularityText?: string;
  granularityGoals?: { value: string; goal: number }[];
  groupByField?: string;
  groupByFields?: string[];
  groupByFieldConfigs?: TargetFieldConfig[];
  dateGrouping?: DateGroupingType;
  categoryField?: string;
  groupByCategory?: boolean;
  filters?: FilterCondition[];
  filterField?: string;
  filterValue?: string;
  
  pivotColumnField?: string;
  pivotDateField?: string;
  
  kpiGroupingField?: string;

  responsibleEmailField?: string;
  responsibleEmailValue?: string;
  activeMetricIds?: string[];
  responsibleNameField?: string;
  avatarField?: string;
  roleField?: string;
  metrics?: PerformanceMetricConfig[];
}

export interface ResultadoWidget {
  id: string;
  title: string;
  type: ResultadoWidgetType;
  binding: ResultadoDataBinding;
  layout: {
    w: number;
    h: number;
  };
  icon?: string;
  color?: string;
}

export interface PerformanceMetricConfig {
  id: string;
  label: string;
  type: 'COUNT' | 'SUM' | 'AVG';
  targetField?: string;
  filterField?: string;
  filterValue?: string;
  filters?: FilterCondition[];
  goalField?: string;
  goal: number;
  direction?: 'HIGHER_IS_BETTER' | 'LOWER_IS_BETTER';
}

export interface PerformanceCardsConfig {
  kpiGroupingField?: string;
  kpiFilters?: FilterCondition[];
  responsibleEmailField?: string;
  responsibleNameField?: string;
  selectedEmails?: string[];
  avatarField?: string;
  roleField?: string;
  metrics?: PerformanceMetricConfig[];
}

export interface ResultadosTabConfig {
  enabled: boolean;
  title?: string;
  widgets: ResultadoWidget[];
  globalFilters?: FilterCondition[];
  performanceCardsConfig?: PerformanceCardsConfig;
}

export interface ResultadosConfig {

  globalFilters?: FilterCondition[];
  performanceCardsConfig?: PerformanceCardsConfig;
  widgets?: ResultadoWidget[];

  colaboradorConfig?: ResultadosTabConfig;
  departamentoConfig?: ResultadosTabConfig;
  serieHistoricaConfig?: ResultadosTabConfig;
}

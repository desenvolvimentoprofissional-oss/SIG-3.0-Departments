import { FilterCondition } from '../types';
import { evaluateCondition } from '../templates/partials/ResultadosUtils';

export const evaluateFilter = (item: any, filter: FilterCondition) => {
  let val = item[filter.field];
  if (Array.isArray(val)) {
      val = val.map((v: any) => {
          if (typeof v === 'object' && v !== null) return v.name || v.email || v.title || v.id || JSON.stringify(v);
          return String(v);
      }).join(', ');
  } else if (typeof val === 'object' && val !== null) {
      val = val.name || val.email || val.title || val.id || JSON.stringify(val);
  }
  val = String(val || '');
  return evaluateCondition(val, filter.operator, filter.value);
};

export const aggregateFieldWithFilters = (
  data: any[],
  fieldConfig: { field: string, filters?: FilterCondition[] },
  aggregate: 'COUNT' | 'SUM' | 'AVG' | 'MAX' | 'MIN'
): number => {
  let count = 0;
  let sum = 0;
  let max = -Infinity;
  let min = Infinity;

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    let matches = true;
    if (fieldConfig.filters && fieldConfig.filters.length > 0) {
      for (let j = 0; j < fieldConfig.filters.length; j++) {
        if (!evaluateFilter(item, fieldConfig.filters[j])) {
          matches = false;
          break;
        }
      }
    }
    
    if (matches) {
      if (aggregate === 'COUNT') {
        count++;
      } else {
        const val = parseFloat(item[fieldConfig.field]) || 0;
        sum += val;
        count++;
        if (val > max) max = val;
        if (val < min) min = val;
      }
    }
  }

  if (aggregate === 'COUNT') return count;
  if (aggregate === 'SUM') return sum;
  if (aggregate === 'AVG') return count > 0 ? sum / count : 0;
  if (aggregate === 'MAX') return max === -Infinity ? 0 : max;
  if (aggregate === 'MIN') return min === Infinity ? 0 : min;
  return 0;
};

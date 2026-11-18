import { aggregateFieldWithFilters, evaluateFilter } from './widget.util';
import { extractDateByGranularity } from '../templates/partials/ResultadosUtils';

export const getConfigs = (binding: any) => {
  const configs = binding.targetFieldConfigs ? [...binding.targetFieldConfigs] : [];
  if (configs.length === 0) {
    [binding.targetField, ...(binding.targetFields || [])].filter(Boolean).forEach(f => {
      configs.push({ field: f as string, filters: [] });
    });
  }
  return configs;
};

export const calcAggregateValue = (configs: any[], data: any[], aggregate: "COUNT" | "SUM" | "AVG" | "MAX" | "MIN") => {
  if (aggregate === 'COUNT' && configs.length === 0) return data.length;
  if (configs.length === 0) return 0;
  
  let totalValue = 0, totalCount = 0;
  let totalMax = -Infinity, totalMin = Infinity;
  
  configs.forEach(config => {
    const val = aggregateFieldWithFilters(data, config, aggregate);
    if (aggregate === 'COUNT' || aggregate === 'SUM' || aggregate === 'AVG') {
      totalValue += val;
      totalCount++;
    } else if (aggregate === 'MAX') {
      if (val > totalMax) totalMax = val;
    } else if (aggregate === 'MIN') {
      if (val < totalMin) totalMin = val;
    }
  });
  
  if (aggregate === 'MAX') return totalMax === -Infinity ? 0 : totalMax;
  if (aggregate === 'MIN') return totalMin === Infinity ? 0 : totalMin;
  if (aggregate === 'AVG') return totalCount > 0 ? totalValue / totalCount : 0;
  return totalValue;
};

const parseDateString = (str: string) => {
  if (/^\d{2}\/\d{4}$/.test(str)) {
      const [m, y] = str.split('/');
      return `${y}-${m}-01`;
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
      const [d, m, y] = str.split('/');
      return `${y}-${m}-${d}`;
  }
  return str;
};

const groupData = (filteredData: any[], binding: any) => {
  const groupedData: Record<string, any[]> = {};
  const dateField = binding.groupByField || (binding.groupByFields && binding.groupByFields[0]);
  filteredData.forEach(item => {
    let groupKey = item[dateField] || 'N/A';
    if (binding.dateGrouping && groupKey !== 'N/A') {
        groupKey = extractDateByGranularity(groupKey, binding.dateGrouping);
    }
    if (!groupedData[groupKey]) groupedData[groupKey] = [];
    groupedData[groupKey].push(item);
  });
  return groupedData;
};

const mapGroupedData = (groupedData: Record<string, any[]>, binding: any, configs: any[]) => {
  return Object.keys(groupedData).map(key => {
    const groupItems = groupedData[key];
    const value = calcAggregateValue(configs, groupItems, binding.aggregate);
    return { name: key, value };
  });
};

const sortChartData = (chartData: any[], dateGrouping?: string) => {
  if (dateGrouping) {
     return chartData.sort((a, b) => {
        if (a.name === 'N/A') return 1;
        if (b.name === 'N/A') return -1;
        return parseDateString(a.name).localeCompare(parseDateString(b.name));
     });
  }
  
  return chartData.sort((a, b) => {
    const sumA = Object.keys(a).filter(k => k !== 'name').reduce((acc, k) => acc + (Number(a[k]) || 0), 0);
    const sumB = Object.keys(b).filter(k => k !== 'name').reduce((acc, k) => acc + (Number(b[k]) || 0), 0);
    return sumB - sumA;
  });
};


const buildMultipleFieldsGrouping = (filteredData: any[], binding: any, configs: any[]) => {
  const groupsMap: Record<string, Record<string, any[]>> = {};
  binding.groupByFields.forEach((field: string, index: number) => {
    const uniqueFieldKey = `${field}_${index}`;
    const config = binding.groupByFieldConfigs?.[index] || binding.groupByFieldConfigs?.find((c: any) => c.field === field);
    
    filteredData.forEach(item => {
      if (config && config.filters && config.filters.length > 0) {
         let matches = true;
         for (let j = 0; j < config.filters.length; j++) {
            if (!evaluateFilter(item, config.filters[j])) {
               matches = false;
               break;
            }
         }
         if (!matches) return;
      }
      
      let groupKey = item[field];
      if (!groupKey) return;
      if (binding.dateGrouping && groupKey !== 'N/A') {
          groupKey = extractDateByGranularity(groupKey, binding.dateGrouping);
      }
      if (!groupsMap[groupKey]) groupsMap[groupKey] = {};
      if (!groupsMap[groupKey][uniqueFieldKey]) groupsMap[groupKey][uniqueFieldKey] = [];
      groupsMap[groupKey][uniqueFieldKey].push(item);
    });
  });
  
  let chartData = Object.keys(groupsMap).map(key => {
    const row: any = { name: key };
    binding.groupByFields.forEach((field: string, index: number) => {
      const uniqueFieldKey = `${field}_${index}`;
      const groupItems = groupsMap[key][uniqueFieldKey] || [];
      row[uniqueFieldKey] = calcAggregateValue(configs, groupItems, binding.aggregate);
    });
    return row;
  });
  
  return chartData.filter(row => {
      return binding.groupByFields.some((field: string, index: number) => row[`${field}_${index}`] > 0);
  });
};

const buildCategoryGrouping = (filteredData: any[], binding: any, configs: any[]) => {
  const groupsMap: Record<string, Record<string, any[]>> = {};
  const dateField = binding.groupByField || (binding.groupByFields && binding.groupByFields[0]);
  
  filteredData.forEach(item => {
    let groupKey = item[dateField] || 'N/A';
    if (binding.dateGrouping && groupKey !== 'N/A') {
        groupKey = extractDateByGranularity(groupKey, binding.dateGrouping);
    }
    let catKey = item[binding.categoryField] || 'N/A';
    if (!groupsMap[groupKey]) groupsMap[groupKey] = {};
    if (!groupsMap[groupKey][catKey]) groupsMap[groupKey][catKey] = [];
    groupsMap[groupKey][catKey].push(item);
  });
  return Object.keys(groupsMap).map(key => {
    const row: any = { name: key };
    Object.keys(groupsMap[key]).forEach(catKey => {
      const groupItems = groupsMap[key][catKey];
      row[catKey] = calcAggregateValue(configs, groupItems, binding.aggregate);
    });
    return row;
  });
};

export const computeChartDataOrMetric = (widgetType: string, binding: any, filteredData: any[]) => {
  if (widgetType === 'PERFORMANCE_CARD') return filteredData;
  const configs = getConfigs(binding);
  
  if (!binding.groupByField && !(binding.groupByFields && binding.groupByFields.length > 0)) {
    return calcAggregateValue(configs, filteredData, binding.aggregate);
  }
  
  let chartData: any[] = [];
  if (binding.groupByFields && binding.groupByFields.length > 1) {
    chartData = buildMultipleFieldsGrouping(filteredData, binding, configs);
  } else if (binding.groupByCategory && binding.categoryField) {
    chartData = buildCategoryGrouping(filteredData, binding, configs);
  } else {
    const groupedData = groupData(filteredData, binding);
    chartData = mapGroupedData(groupedData, binding, configs);
  }
  return sortChartData(chartData, binding.dateGrouping);
};

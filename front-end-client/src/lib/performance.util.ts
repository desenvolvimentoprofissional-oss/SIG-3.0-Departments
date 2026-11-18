import { FilterCondition } from '../types';
import { evaluateFilter } from './widget.util';

export const calculatePerformanceMetrics = (records: any[], widgetBinding: any, globalConfig: any, latestRecord: any) => {
  const total = records.length;
  let metrics: any[] = [];
  
  if (globalConfig?.metrics && globalConfig.metrics.length > 0) {
    let filteredMetrics = globalConfig.metrics;
    if (widgetBinding.activeMetricIds && widgetBinding.activeMetricIds.length > 0) {
      filteredMetrics = filteredMetrics.filter((m: any) => widgetBinding.activeMetricIds.includes(m.id));
    }
    
    metrics = filteredMetrics.map((m: any) => {
      let validRecords = records;
      if (m.filters && m.filters.length > 0) {
         validRecords = validRecords.filter(r => m.filters.every((f: FilterCondition) => evaluateFilter(r, f)));
      } else if (m.filterField && m.filterValue) {
         validRecords = validRecords.filter(r => String(r[m.filterField]) === String(m.filterValue));
      }
      
      let val = 0;
      if (m.type === 'COUNT') {
         val = validRecords.length;
      } else if (m.targetField) {
         const values = validRecords.map(r => parseFloat(r[m.targetField] as any) || 0);
         const sum = values.reduce((a, b) => a + b, 0);
         if (m.type === 'SUM') val = sum;
         else if (m.type === 'AVG') val = values.length > 0 ? sum / values.length : 0;
      }
      
      let goal = m.goal;
      if (m.goalField && latestRecord[m.goalField]) {
         const parsedGoal = parseFloat(latestRecord[m.goalField]);
         if (!isNaN(parsedGoal)) goal = parsedGoal;
      }
      
      let percentage = 0;
      let visualPercentage = 0;
      if (m.direction === 'LOWER_IS_BETTER') {
         visualPercentage = goal > 0 ? (val / goal) * 100 : 0;
         if (val <= goal) {
             percentage = 100;
         } else if (goal > 0) {
             percentage = Math.max(0, 100 - ((val - goal) / goal) * 100);
         } else {
             percentage = 0;
         }
      } else {
         percentage = goal > 0 ? (val / goal) * 100 : 0;
         visualPercentage = percentage;
      }
      
      const scoreValue = Math.min(100, Math.max(0, percentage));
      
      return {
         label: m.label,
         scoreValue: scoreValue,
         displayPercentage: visualPercentage,
         barWidth: Math.min(100, visualPercentage),
         displayValue: (Math.round(val * 100) / 100),
         goal: goal,
         direction: m.direction
      };
    });
  } else {
    metrics = [
      { label: "Produtividade", scoreValue: Math.min(100, total * 5), displayPercentage: Math.min(100, total * 5), barWidth: Math.min(100, total * 5), displayValue: total * 5, goal: 100, direction: 'HIGHER_IS_BETTER' },
      { label: "Qualidade", scoreValue: 90, displayPercentage: 90, barWidth: 90, displayValue: 90, goal: 100, direction: 'HIGHER_IS_BETTER' },
    ];
  }
  
  return metrics;
};

export const calculatePerformanceKPIs = (records: any[], kpiGroupingField: string | undefined, globalConfig: any, total: number) => {
  let kpis = [];
  
  if (kpiGroupingField) {
    let kpiRecords = records;
    if (globalConfig?.kpiFilters && globalConfig.kpiFilters.length > 0) {
      kpiRecords = kpiRecords.filter(r => globalConfig.kpiFilters.every((f: FilterCondition) => evaluateFilter(r, f)));
    }
    
    const counts: Record<string, number> = {};
    kpiRecords.forEach(r => {
      const val = String(r[kpiGroupingField] || 'N/A').trim();
      counts[val] = (counts[val] || 0) + 1;
    });
    
    const sortedKeys = Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 3).sort((a, b) => a.localeCompare(b));
    kpis = sortedKeys.map(key => ({ label: key, value: counts[key].toString() }));
    if (kpis.length < 3) {
       kpis.push({ label: 'Total', value: total.toString() });
    }
  } else {
    kpis = [
      { label: "Total Registros", value: total.toString() },
      { label: "Score", value: "0" },
    ];
  }
  
  return kpis;
};

export const computeOverallScore = (metrics: any[]) => {
  const metricsForScore = metrics.filter((m: any) => m.goal !== 0 && m.goal !== null && m.goal !== undefined);
  return metricsForScore.length > 0 ? Math.round(metricsForScore.reduce((acc, m) => acc + m.scoreValue, 0) / metricsForScore.length) : 0;
};

export const getEmployeeRecords = (data: any[], collection: string | undefined, responsibleEmailField: string | undefined, emailToMatch: string) => {
  return data.filter(row => {
    if (collection && row._collection !== collection) return false;
    const rowEmail = responsibleEmailField ? String(row[responsibleEmailField] || "").trim().toLowerCase() : "";
    return rowEmail === emailToMatch;
  });
};

export const extractAvatar = (latestRecord: any, avatarField: string | undefined) => {
  if (!avatarField || !latestRecord[avatarField]) return null;
  const avatarData = latestRecord[avatarField];
  if (Array.isArray(avatarData) && avatarData.length > 0) {
      return avatarData[0]?.url || avatarData[0];
  } else if (typeof avatarData === 'string') {
      return avatarData;
  }
  return null;
};

export const formatName = (latestRecord: any, responsibleNameField: string | undefined) => {
  const rawName = responsibleNameField && latestRecord[responsibleNameField]
    ? String(latestRecord[responsibleNameField])
    : "Unknown";
  return rawName.toLowerCase().replace(/(?:^|\s)\w/g, match => match.toUpperCase());
};

export const extractRole = (latestRecord: any, roleField: string | undefined) => {
  return roleField && latestRecord[roleField] ? String(latestRecord[roleField]) : "Colaborador";
};

export const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
};

export const processPerformanceEmployee = (data: any[], widgetBinding: any, globalConfig: any) => {
    const { collection, responsibleEmailValue } = widgetBinding;
    const kpiGroupingField = globalConfig?.kpiGroupingField || widgetBinding.kpiGroupingField;
    const responsibleEmailField = globalConfig?.responsibleEmailField || widgetBinding.responsibleEmailField;
    const responsibleNameField = globalConfig?.responsibleNameField || widgetBinding.responsibleNameField;
    const avatarField = globalConfig?.avatarField || widgetBinding.avatarField;
    const roleField = globalConfig?.roleField || widgetBinding.roleField;

    if (!responsibleEmailField || !responsibleEmailValue) return null;
    
    const emailToMatch = responsibleEmailValue.trim().toLowerCase();
    const records = getEmployeeRecords(data, collection, responsibleEmailField, emailToMatch);
    
    if (records.length === 0) return null;
    const latestRecord = records[records.length - 1];
    
    const avatar = extractAvatar(latestRecord, avatarField);
    const name = formatName(latestRecord, responsibleNameField);
    const total = records.length;
    
    const metrics = calculatePerformanceMetrics(records, widgetBinding, globalConfig, latestRecord);
    const score = computeOverallScore(metrics);
    let kpis = calculatePerformanceKPIs(records, kpiGroupingField, globalConfig, total);
    
    if (!kpiGroupingField && kpis.length > 1) {
      kpis[1].value = score.toString();
    }
    
    const trend = [60, 70, 80, 85, 92, Math.min(100, total * 5)];
    return {
      id: emailToMatch,
      name,
      email: emailToMatch,
      role: extractRole(latestRecord, roleField),
      avatar,
      records,
      color: stringToColor(emailToMatch),
      score,
      kpis,
      metrics,
      trend
    };
};

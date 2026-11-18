export const extractFilterOptions = (
  filterFields: string[],
  data: any[],
  selectedCollectionFilter: string
): Record<string, string[]> => {
  const options: Record<string, string[]> = {};
  filterFields.forEach(field => {
    const values = new Set<string>();
    data.forEach(item => {
       if (selectedCollectionFilter === 'ALL' || (item._collectionId || item._collection) === selectedCollectionFilter) {
         if (item[field] !== undefined && item[field] !== null && item[field] !== '') {
           values.add(String(item[field]));
         }
       }
    });
    options[field] = Array.from(values).sort();
  });
  return options;
};

export const aggregateDashboardMetrics = (items: any[], groupField: string, dateField: string) => {
  const categoryMap = new Map<string, number>();
  const trendMap = new Map<string, number>();
  let abertos = 0;
  let andamento = 0;
  let concluidos = 0;

  items.forEach(item => {
    const val = String(item[groupField] || 'Sem Categoria').trim();
    categoryMap.set(val, (categoryMap.get(val) || 0) + 1);

    const dateStr = item[dateField] || item.createdAt;
    if (dateStr) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const month = date.toLocaleString('pt-BR', { month: 'short' });
        trendMap.set(month, (trendMap.get(month) || 0) + 1);
      }
    }

    const lowerVal = val.toLowerCase();
    if (lowerVal.includes('concluíd') || lowerVal.includes('finaliz') || lowerVal.includes('arquivad') || lowerVal.includes('deferid')) {
      concluidos++;
    } else if (lowerVal.includes('andamento') || lowerVal.includes('tramita') || lowerVal.includes('process') || lowerVal.includes('analis')) {
      andamento++;
    } else {
      abertos++;
    }
  });

  const categories = Array.from(categoryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const trend = Array.from(trendMap.entries())
    .map(([name, value]) => ({ name, value }))
    .reverse();

  return {
    categories,
    trend,
    kpis: { abertos, andamento, concluidos }
  };
};

export const prepareMetricasForSave = (
  currentData: Record<string, Record<string, any>>,
  selectedYear: number,
  meses: string[]
): any[] => {
  const mergedData = { ...currentData };
  meses.forEach((mes, idx) => {
    const key = `${selectedYear}-${mes}`;
    const mes_numero = idx + 1;
    const lastDay = new Date(selectedYear, mes_numero, 0).getDate();
    const dataReferencia = `${selectedYear}-${String(mes_numero).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}T23:59:59Z`;

    if (!mergedData[key]) {
      mergedData[key] = { 
        mes, 
        mes_numero, 
        ano: selectedYear,
        data_referencia: dataReferencia,
        createdAt: dataReferencia
      };
    } else {
      mergedData[key].mes_numero = mes_numero;
      mergedData[key].data_referencia = dataReferencia;
      mergedData[key].createdAt = dataReferencia;
    }
  });
  
  return Object.values(mergedData);
};

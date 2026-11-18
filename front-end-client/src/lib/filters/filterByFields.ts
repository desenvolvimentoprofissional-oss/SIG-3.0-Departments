export function filterByFields(data: any[], activeFilters: Record<string, string>): any[] {
  const filtersList = Object.entries(activeFilters).filter(([_, value]) => !!value);
  if (filtersList.length === 0) return data;
  
  return data.filter(item => {
    return filtersList.every(([field, value]) => String(item[field] || '') === value);
  });
}

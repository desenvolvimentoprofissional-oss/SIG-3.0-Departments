export function filterByText(data: any[], query: string, searchFields: string[]): any[] {
  const lowerQuery = query.trim().toLowerCase();
  if (lowerQuery.length === 0 || searchFields.length === 0) return data;
  
  return data.filter(item => {
    return searchFields.some(field => 
      String(item[field] || '').toLowerCase().includes(lowerQuery)
    );
  });
}

export function filterByCollection(data: any[], selectedCollection: string): any[] {
  if (!selectedCollection || selectedCollection === 'ALL') return data;
  return data.filter(item => (item._collectionId || item._collection) === selectedCollection);
}

import { useMemo } from 'react';
import { 
  filterByCollection, 
  filterByFields, 
  filterByText, 
  filterByMyProcesses 
} from '../lib/filters';

interface UseMappedPageDataProps {
  data: any[];
  selectedCollectionFilter: string;
  activeFilters: Record<string, string>;
  query: string;
  searchFields: string[];
  showMyProcesses: boolean;
  user: { email?: string | null } | null;
}

export function useMappedPageData({
  data,
  selectedCollectionFilter,
  activeFilters,
  query,
  searchFields,
  showMyProcesses,
  user
}: UseMappedPageDataProps) {
  const filteredData = useMemo(() => {
    let result = filterByCollection(data, selectedCollectionFilter);
    result = filterByFields(result, activeFilters);
    result = filterByText(result, query, searchFields);
    result = filterByMyProcesses(result, showMyProcesses, user?.email);
    
    return result;
  }, [data, selectedCollectionFilter, activeFilters, query, searchFields, showMyProcesses, user?.email]);

  return { filteredData };
}

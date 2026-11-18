import React, { useState, useEffect } from 'react';
import { ViewMappingConfig } from '../../../../types';
import { SearchAndFilterSection } from '../SearchAndFilterSection';

interface ResultadosFilterConfigProps {
  extractedFields: string[];
  customFieldOptions?: { value: string; label: string }[];
  initialConfig?: ViewMappingConfig | null;
  onChange: (config: ViewMappingConfig) => void;
}

export const ResultadosFilterConfig: React.FC<ResultadosFilterConfigProps> = ({
  extractedFields,
  customFieldOptions,
  initialConfig,
  onChange
}) => {
  const [searchFields, setSearchFields] = useState<string[]>(initialConfig?.components?.searchFields || []);
  const [filterFields, setFilterFields] = useState<string[]>(initialConfig?.components?.filterFields || []);
  const [filterLabels, setFilterLabels] = useState<Record<string, string>>(initialConfig?.components?.filterLabels || {});
  const [groupingFields, setGroupingFields] = useState<string[]>(initialConfig?.components?.groupingFields || []);

  useEffect(() => {
    const newConfig = {
      ...initialConfig,
      components: {
        ...(initialConfig?.components || {}),
        enabledViews: initialConfig?.components?.enabledViews || { kanban: true, list: true, calendar: true, table: true, matrix: true, sla: false },
        enableDispatchSystem: initialConfig?.components?.enableDispatchSystem || false,
        searchFields,
        filterFields,
        filterLabels,
        groupingFields
      }
    };
    onChange(newConfig as ViewMappingConfig);
  }, [searchFields, filterFields, filterLabels, groupingFields]);

  return (
    <SearchAndFilterSection
      availableFields={extractedFields}
      customFieldOptions={customFieldOptions}
      searchFields={searchFields}
      setSearchFields={setSearchFields}
      filterFields={filterFields}
      setFilterFields={setFilterFields}
      filterLabels={filterLabels}
      setFilterLabels={setFilterLabels}
      groupingFields={groupingFields}
      setGroupingFields={setGroupingFields}
    />
  );
};

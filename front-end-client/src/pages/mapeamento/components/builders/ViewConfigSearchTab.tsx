import React from 'react';
import { UniversalFilter } from '../../../../types/index';
import { SearchAndFilterSection } from '../SearchAndFilterSection';
import { UniversalFiltersSection } from '../UniversalFiltersSection';
import { CollapsibleCard } from '../../../../components/ui/CollapsibleCard';

interface ViewConfigSearchTabProps {
  extractedFields: string[];
  fieldOptions?: { value: string; label: string }[];
  searchFields: string[];
  setSearchFields: (val: string[]) => void;
  filterFields: string[];
  setFilterFields: (val: string[]) => void;
  filterLabels: Record<string, string>;
  setFilterLabels: (val: Record<string, string>) => void;
  groupingFields: string[];
  setGroupingFields: (val: string[]) => void;
  universalFilters: UniversalFilter[];
  setUniversalFilters: (val: UniversalFilter[]) => void;
}

export const ViewConfigSearchTab: React.FC<ViewConfigSearchTabProps> = ({
  extractedFields,
  fieldOptions,
  searchFields,
  setSearchFields,
  filterFields,
  setFilterFields,
  filterLabels,
  setFilterLabels,
  groupingFields,
  setGroupingFields,
  universalFilters,
  setUniversalFilters
}) => {
  return (
    <CollapsibleCard title="Agrupamento, Buscas e Filtros" defaultOpen={false} compact={true} className="bg-[var(--color-background-light)]">
      <SearchAndFilterSection 
        availableFields={extractedFields} customFieldOptions={fieldOptions} 
        searchFields={searchFields} 
        setSearchFields={setSearchFields} 
        filterFields={filterFields} 
        setFilterFields={setFilterFields} 
        filterLabels={filterLabels}
        setFilterLabels={setFilterLabels}
        groupingFields={groupingFields} 
        setGroupingFields={setGroupingFields} 
      />
      <div className="mt-8 border-t border-[var(--color-border-default)] pt-6">
        <UniversalFiltersSection 
          universalFilters={universalFilters} 
          setUniversalFilters={setUniversalFilters} 
          extractedFields={extractedFields} customFieldOptions={fieldOptions} 
        />
      </div>
    </CollapsibleCard>
  );
};

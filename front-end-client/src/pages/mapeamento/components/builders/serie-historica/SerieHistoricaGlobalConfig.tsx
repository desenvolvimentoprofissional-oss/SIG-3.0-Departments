import React from 'react';
import { FilterBuilder } from '../../FilterBuilder';

export const SerieHistoricaGlobalConfig = ({
  globalFilters,
  handleGlobalFiltersChange,
  availableCollections
}: any) => {
  return (
    <>
      <div className="p-4 border-b border-[var(--color-border-default)] bg-gray-50">
        <h3 className="font-bold text-sm text-[var(--color-content-main)]">Filtros Globais</h3>
        <p className="text-xs text-[var(--color-content-secondary)]">Aplicados a todos os widgets</p>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <FilterBuilder 
          filters={globalFilters}
          onChange={handleGlobalFiltersChange}
          availableFields={Array.from(new Set(availableCollections.flatMap((c: any) => c.extractedFields || [])))}
        />
      </div>
    </>
  );
};

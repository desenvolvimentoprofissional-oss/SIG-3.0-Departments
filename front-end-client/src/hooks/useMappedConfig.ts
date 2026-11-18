import { useMemo } from 'react';
import { PageMapping } from '../types';

export function useMappedConfig(mapping: PageMapping, selectedCollectionFilter: string) {
  const activeCollections = useMemo(() => {
    let base = mapping.collections || [];
    if (mapping.dataSources && mapping.dataSources.length > 0) {
      base = mapping.dataSources.map((ds: any) => {
        return {
           collectionName: ds.mainCollection?.collectionName,
           searchFields: ds.viewConfig?.components?.searchFields || ds.mainCollection?.searchFields,
           filterFields: ds.viewConfig?.components?.filterFields || ds.mainCollection?.filterFields,
           groupingFields: ds.viewConfig?.components?.groupingFields || ds.mainCollection?.groupingFields,
        } as any;
      });
    }
    if (selectedCollectionFilter === 'ALL') return base;
    return base.filter((c: any) => (c.id || c.collectionName) === selectedCollectionFilter);
  }, [mapping, selectedCollectionFilter]);

  const viewConfig = useMemo(() => {
    if (selectedCollectionFilter !== 'ALL' && mapping.dataSources && mapping.dataSources.length > 0) {
      const selectedDs = mapping.dataSources.find((ds: any) => {
        const dsId = ds.id || ds.mainCollection?.id || ds.mainCollection?.collectionName || ds.collectionName;
        return dsId === selectedCollectionFilter;
      });
      if (selectedDs && selectedDs.viewConfig) {
        return selectedDs.viewConfig;
      }
    }
    return mapping.viewConfig;
  }, [mapping, selectedCollectionFilter]);

  const combinedEnabledViews = useMemo(() => {
    let views = {
      kanban: false,
      list: false,
      calendar: false,
      table: false,
      matrix: false,
      sla: false,
      auditoria: false
    };

    let hasExplicitConfig = false;

    const processViewConfig = (v: any) => {
      if (!v) return;
      hasExplicitConfig = true;
      if (v.kanban) views.kanban = true;
      if (v.list) views.list = true;
      if (v.calendar) views.calendar = true;
      if (v.table) views.table = true;
      if (v.matrix) views.matrix = true;
      if (v.sla) views.sla = true;
      if (v.auditoria) views.auditoria = true;
    };

    if (selectedCollectionFilter === 'ALL') {
      if (mapping.viewConfig?.components?.enabledViews) {
        processViewConfig(mapping.viewConfig.components.enabledViews);
      }
      if (mapping.dataSources && mapping.dataSources.length > 0) {
        mapping.dataSources.forEach((ds: any) => {
          if (ds.viewConfig?.components?.enabledViews) {
            processViewConfig(ds.viewConfig.components.enabledViews);
          }
        });
      }
    } else {
      if (mapping.dataSources && mapping.dataSources.length > 0) {
        mapping.dataSources.forEach((ds: any) => {
          const dsId = ds.id || ds.mainCollection?.id || ds.mainCollection?.collectionName || ds.collectionName;
          if (dsId === selectedCollectionFilter) {
            if (ds.viewConfig?.components?.enabledViews) {
              processViewConfig(ds.viewConfig.components.enabledViews);
            }
          }
        });
      }
    }

    activeCollections.forEach((c: any) => {
      if (c.enabledViews) {
         processViewConfig(c.enabledViews);
      }
    });
    
    if (!hasExplicitConfig) {
       return { kanban: true, list: true, calendar: true, table: true, matrix: true, sla: true, auditoria: false };
    }
    
    if (!views.kanban && !views.list && !views.calendar && !views.table && !views.matrix && !views.sla && !views.auditoria) {
        views.table = true;
    }
    return views;
  }, [activeCollections, mapping.viewConfig, mapping.dataSources, selectedCollectionFilter]);

  const searchFields = useMemo(() => {
    const dsFields = activeCollections.flatMap((c: any) => c.searchFields || []).filter((f: string) => !!f);
    if (dsFields.length > 0) return Array.from(new Set(dsFields));
    
    if (viewConfig?.components?.searchFields && viewConfig.components.searchFields.filter((f: string) => !!f).length > 0) return viewConfig.components.searchFields.filter((f: string) => !!f);
    
    return [];
  }, [activeCollections, viewConfig]);

  const filterFields = useMemo(() => {
    const dsFields = activeCollections.flatMap((c: any) => c.filterFields || []).filter((f: string) => !!f);
    if (dsFields.length > 0) return Array.from(new Set(dsFields));
    
    if (viewConfig?.components?.filterFields && viewConfig.components.filterFields.filter((f: string) => !!f).length > 0) return viewConfig.components.filterFields.filter((f: string) => !!f);
    
    return [];
  }, [activeCollections, viewConfig]);

  const groupingFields = useMemo(() => {
    const dsFields = activeCollections.flatMap((c: any) => c.groupingFields || []).filter((f: string) => !!f);
    if (dsFields.length > 0) return Array.from(new Set(dsFields));
    
    if (viewConfig?.components?.groupingFields && viewConfig.components.groupingFields.filter((f: string) => !!f).length > 0) return viewConfig.components.groupingFields.filter((f: string) => !!f);
    
    return [];
  }, [activeCollections, viewConfig]);

  const filterLabels = useMemo(() => {
    let combinedLabels: Record<string, string> = {};
    if (viewConfig?.components?.filterLabels) {
       combinedLabels = { ...viewConfig.components.filterLabels };
    }
    mapping.dataSources?.forEach((ds: any) => {
       if (ds.viewConfig?.components?.filterLabels) {
          combinedLabels = { ...combinedLabels, ...ds.viewConfig.components.filterLabels };
       }
    });
    return combinedLabels;
  }, [viewConfig, mapping.dataSources]);

  return {
    viewConfig,
    activeCollections,
    combinedEnabledViews,
    searchFields,
    filterFields,
    filterLabels,
    groupingFields
  };
}

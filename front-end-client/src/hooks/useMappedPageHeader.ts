import { useState, useMemo, useEffect } from 'react';
import { PageMapping, TenantConfig } from '../types/index';
import { useMappingStore } from '../store/mappingStore';

export const useMappedPageHeader = (tenant: TenantConfig, mapping: PageMapping) => {
  const { 
    pageData: rawData, 
    pageDataLoading: loading, 
    pageDataError: error, 
    listenToMappingCollections, 
    updateMappedDate, 
    ultimaAtualizacaoDoc, 
    setUltimaAtualizacaoDoc, 
    subscribeToCollectionUpdate 
  } = useMappingStore();

  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState<string>(() => {
    if (mapping.dataSources && mapping.dataSources.length > 0) {
      const defaultDs = mapping.dataSources.find(ds => ds.isDefault);
      if (defaultDs && defaultDs.mainCollection) {
        return defaultDs.mainCollection.id || defaultDs.mainCollection.collectionName;
      }
    }
    return 'ALL';
  });

  const mainCol = useMemo(() => {
    let colName = '';
    if (selectedCollectionFilter !== 'ALL') {
      const ds = mapping.dataSources?.find(d => (d.mainCollection?.id || d.mainCollection?.collectionName) === selectedCollectionFilter);
      if (ds && ds.mainCollection) {
        colName = ds.mainCollection.collectionName || ds.mainCollection.id;
      } else {
        const col = mapping.collections?.find(c => ((c as any).id || c.collectionName) === selectedCollectionFilter);
        if (col) colName = col.collectionName || (col as any).id;
      }
    }
    
    if (!colName) {
      if (mapping.dataSources && mapping.dataSources.length > 0) {
        const defaultDs = mapping.dataSources.find(ds => ds.isDefault) || mapping.dataSources[0];
        if (defaultDs && defaultDs.mainCollection) {
          colName = defaultDs.mainCollection.collectionName || defaultDs.mainCollection.id;
        }
      } else if (mapping.collections && mapping.collections.length > 0) {
        colName = mapping.collections[0].collectionName || (mapping.collections[0] as any).id;
      }
    }
    return colName;
  }, [mapping, selectedCollectionFilter]);

  const atualizacaoDoc = useMemo(() => {
    if (!mainCol) return null;
    return rawData.find(d => (d._id === 'atualizacao' || d.id === 'atualizacao') && d._collection === mainCol);
  }, [rawData, mainCol]);
  
  let ultimaAtualizacao = null;
  const atualizacaoDocData = atualizacaoDoc || ultimaAtualizacaoDoc;
  if (atualizacaoDocData) {
    if (Array.isArray(atualizacaoDocData.historico) && atualizacaoDocData.historico.length > 0) {
      ultimaAtualizacao = atualizacaoDocData.historico[atualizacaoDocData.historico.length - 1];
    } else {
      ultimaAtualizacao = atualizacaoDocData.data || atualizacaoDocData.updatedAt || atualizacaoDocData.date || atualizacaoDocData.timestamp || atualizacaoDocData.ultimaAtualizacao || atualizacaoDocData.status || atualizacaoDocData.updated_at || atualizacaoDocData.dataAtualizacao || atualizacaoDocData.lastUpdate;
    }
  }
  
  const formatDataAtualizacao = (val: any) => {
    if (!val) return null;
    if (typeof val === 'object') {
      if (val.toDate) return val.toDate().toLocaleString('pt-BR');
      if (val.seconds) return new Date(val.seconds * 1000).toLocaleString('pt-BR');
      if (val._seconds) return new Date(val._seconds * 1000).toLocaleString('pt-BR');
      return JSON.stringify(val);
    }
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toLocaleString('pt-BR');
    }
    return String(val);
  };
  
  const ultimaAtualizacaoText = ultimaAtualizacao ? formatDataAtualizacao(ultimaAtualizacao) : null;
  const data = useMemo(() => rawData.filter(d => d._id !== 'atualizacao' && d.id !== 'atualizacao'), [rawData]);
  
  useEffect(() => {
    if (!tenant || !mainCol) {
      setUltimaAtualizacaoDoc(null);
      return;
    }
    const unsub = subscribeToCollectionUpdate(tenant, mainCol);
    return () => unsub();
  }, [tenant, mainCol, subscribeToCollectionUpdate, setUltimaAtualizacaoDoc]);

  return {
    loading,
    error,
    listenToMappingCollections,
    updateMappedDate,
    selectedCollectionFilter,
    setSelectedCollectionFilter,
    mainCol,
    ultimaAtualizacao,
    ultimaAtualizacaoText,
    data
  };
};

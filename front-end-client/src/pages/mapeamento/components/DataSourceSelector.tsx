import React, { useState, useEffect } from 'react';
import { renderExtractedPills } from './builders/ExtractedPills';
import { RelationalCollectionItem } from './builders/RelationalCollectionItem';
import { DataSourceToolbar } from './builders/DataSourceToolbar';
import { MainCollectionFields } from './builders/MainCollectionFields';
import { DataSourceConfig, CollectionSource, TenantConfig } from '../../../types/index';
import { useMappingStore } from '../../../store/mappingStore';

interface DataSourceSelectorProps {
  tenant: TenantConfig;
  config: DataSourceConfig | undefined;
  onChange: (config: DataSourceConfig, extractedFields: string[]) => void;
  index?: number;
  totalSources?: number;
  pageType?: string;
  isDefault?: boolean;
  onSetDefault?: () => void;
  onRemove?: () => void;
}

export const DataSourceSelector: React.FC<DataSourceSelectorProps> = ({ 
  tenant, 
  config, 
  onChange,
  index = 0,
  totalSources = 1,
  pageType = '',
  isDefault = false,
  onSetDefault,
  onRemove
}) => {
  const { extractSchema } = useMappingStore();
  
  const [loadingCol, setLoadingCol] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [isMainOpen, setIsMainOpen] = useState(true);
  const [openRels, setOpenRels] = useState<Record<string, boolean>>({});

  const toggleRel = (id: string) => setOpenRels(prev => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => {
    if (config?.mainCollection?.extractedFields && config.mainCollection.extractedFields.length > 0) {
      setIsMainOpen(false);
    }
  }, [config?.mainCollection?.collectionName]);

  const safeConfig: DataSourceConfig = config || { mainCollection: null, relationalCollections: [] };

  const computeAllFields = (cfg: DataSourceConfig) => {
    const list: string[] = [];
    if (cfg.mainCollection?.collectionName && cfg.mainCollection.extractedFields) {
      cfg.mainCollection.extractedFields.forEach(f => list.push(f));
    }
    cfg.relationalCollections.forEach(rel => {
      if (rel.collectionName && rel.extractedFields) {
        rel.extractedFields.forEach(f => list.push(f));
      }
    });
    return Array.from(new Set(list));
  };

  const updateMain = (updates: Partial<CollectionSource>) => {
    const main = safeConfig.mainCollection || {
      id: crypto.randomUUID(),
      collectionName: '',
      sourceType: 'FIREBASE',
      isRelational: false
    };
    const newConfig = { ...safeConfig, mainCollection: { ...main, ...updates } };
    onChange(newConfig, computeAllFields(newConfig));
  };

  const addRelational = () => {
    const newRel: CollectionSource = {
      id: crypto.randomUUID(),
      collectionName: '',
      sourceType: 'FIREBASE',
      isRelational: true,
    };
    const newConfig = { ...safeConfig, relationalCollections: [...safeConfig.relationalCollections, newRel] };
    onChange(newConfig, computeAllFields(newConfig));
  };

  const updateRelational = (index: number, updates: Partial<CollectionSource>) => {
    const arr = [...safeConfig.relationalCollections];
    arr[index] = { ...arr[index], ...updates };
    const newConfig = { ...safeConfig, relationalCollections: arr };
    onChange(newConfig, computeAllFields(newConfig));
  };

  const removeRelational = (index: number) => {
    const arr = [...safeConfig.relationalCollections];
    arr.splice(index, 1);
    const newConfig = { ...safeConfig, relationalCollections: arr };
    onChange(newConfig, computeAllFields(newConfig));
  };

  const fetchCollectionSchema = async (collectionName: string, isMain: boolean, idx?: number, docName?: string, docNameType?: 'EXACT' | 'PREFIX' | '') => {
    if (!collectionName) {
      setErrorMsg('Informe o nome da coleção antes de conectar.');
      return;
    }

    setLoadingCol(collectionName);
    setErrorMsg('');
    try {
      const validDocNameType = docNameType === '' ? undefined : docNameType;
      const fields = await extractSchema(tenant, collectionName, docName, validDocNameType);
      if (fields.length === 0) {
        setErrorMsg(`Nenhum campo encontrado para a coleção "${collectionName}".`);
      } else {
        if (isMain) {
           updateMain({ extractedFields: fields });
           setIsMainOpen(true);
        } else if (idx !== undefined) {
           updateRelational(idx, { extractedFields: fields });
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || `Erro ao conectar na coleção ${collectionName}`);
    } finally {
      setLoadingCol(null);
    }
  };

  const suggestFriendlyName = (name: string) => {
    if (!name) return '';
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const hasMainFields = safeConfig.mainCollection?.extractedFields && safeConfig.mainCollection.extractedFields.length > 0;

  return (
    <div className="space-y-6">
      <div className="w-full">
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-xs border border-red-200">
            {errorMsg}
          </div>
        )}

        <DataSourceToolbar
          totalSources={totalSources}
          pageType={pageType}
          index={index}
          isDefault={isDefault}
          onSetDefault={onSetDefault}
          onConnect={() => fetchCollectionSchema(safeConfig.mainCollection?.collectionName || '', true, undefined, safeConfig.mainCollection?.docName, safeConfig.mainCollection?.docNameType)}
          loadingCol={loadingCol}
          currentColName={safeConfig.mainCollection?.collectionName || ''}
          hasMainFields={hasMainFields}
          isMainOpen={isMainOpen}
          onToggleMainOpen={() => setIsMainOpen(!isMainOpen)}
          onAddRelational={addRelational}
          onRemove={onRemove}
        />

        <MainCollectionFields
          collectionName={safeConfig.mainCollection?.collectionName || ''}
          friendlyName={safeConfig.mainCollection?.friendlyName || ''}
          docName={safeConfig.mainCollection?.docName || ''}
          docNameType={safeConfig.mainCollection?.docNameType || ''}
          onUpdate={updateMain}
          suggestFriendlyName={suggestFriendlyName}
        />

        {hasMainFields && isMainOpen && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {renderExtractedPills(safeConfig.mainCollection?.extractedFields)}
          </div>
        )}

        {safeConfig.relationalCollections.map((rel, idx) => {
          const hasRelFields = rel.extractedFields && rel.extractedFields.length > 0;
          const isRelOpen = openRels[rel.id] !== false;
          return (
            <RelationalCollectionItem
              key={rel.id}
              rel={rel}
              idx={idx}
              updateRelational={updateRelational}
              suggestFriendlyName={suggestFriendlyName}
              fetchCollectionSchema={fetchCollectionSchema}
              loadingCol={loadingCol}
              hasRelFields={hasRelFields}
              toggleRel={toggleRel}
              isRelOpen={isRelOpen}
              removeRelational={removeRelational}
            />
          );
        })}
      </div>
    </div>
  );
};



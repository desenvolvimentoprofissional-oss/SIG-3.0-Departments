import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useMappingStore } from '../store/mappingStore';
import { useTenantStore } from '../store/tenantStore';
import { useAuthStore } from '../store/authStore';
import { useSearchStore } from '../store/useSearchStore';
import { useIamStore } from '../store/iamStore';
import { PageMapping } from '../types/index';
import { ModalAlert } from '../components/ui/ModalAlert';
import { DEPARTMENT_TAXONOMY } from '../lib/taxonomia-icones';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Filter, Plus } from 'lucide-react';
import { canManageMapping } from '../lib/permissions';
import { HeaderPortal } from '../components/layout/HeaderPortal';
import { HeaderButton } from '../components/layout/AppHeader';

import { MapeamentoList } from './mapeamento/components/MapeamentoList';
import { MapeamentoForm } from './mapeamento/components/MapeamentoForm';

export const DataMappingView: React.FC = () => {
  const { user } = useAuthStore();
  const { mappings, subscribeToMappings, saveMapping, deleteMapping } = useMappingStore();
  const { tenants, subscribeToTenants } = useTenantStore();
  const { initializeSync } = useIamStore();
  const { query, filterArea, filterDept } = useSearchStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingMapping, setEditingMapping] = useState<PageMapping | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, mapping: null as PageMapping | null });
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById('header-portal-target'));
  }, []);

  const activeTenants = tenants.filter(t => t.isActive && (!!t.firebaseConfig || user?.role === 'MASTER'));
  const areas = useMemo(() => Array.from(new Set(DEPARTMENT_TAXONOMY.map(d => d.area))), []);

  useEffect(() => {
    const unsubTenants = subscribeToTenants();
    const unsubUsers = initializeSync();
    return () => {
      unsubTenants();
      unsubUsers();
    };
  }, [subscribeToTenants, initializeSync]);

  useEffect(() => {
    if (activeTenants.length > 0) {
      const unsubMappings = subscribeToMappings(activeTenants);
      return () => unsubMappings();
    }
  }, [activeTenants.length, subscribeToMappings]);

  useEffect(() => {
    const handleOpenNew = () => {
      setEditingMapping(null);
      setIsCreating(true);
    };
    window.addEventListener('open-nova-pagina', handleOpenNew);
    return () => window.removeEventListener('open-nova-pagina', handleOpenNew);
  }, []);

  const handleEditMapping = (mapping: PageMapping) => {
    setEditingMapping(mapping);
    setIsCreating(true);
  };

  const confirmDeleteMapping = (m: PageMapping) => {
    setDeleteModal({ isOpen: true, mapping: m });
  };

  const executeDeleteMapping = async () => {
    const m = deleteModal.mapping;
    if (!m) return;
    const targetTenant = tenants.find(t => t.id === m.departmentId);
    if (!targetTenant) return;

    try {
      await deleteMapping(targetTenant, m.id);
    } catch (error: any) {
      console.error('[DATA_MAPPING] - Operação interrompida devido a falhas de comunicação ou resposta de infraestrutura.');
    } finally {
      setDeleteModal({ isOpen: false, mapping: null });
    }
  };

  const handleSaveMappingForm = async (newMapping: PageMapping, targetTenant: any) => {
    await saveMapping(targetTenant, newMapping);
    setIsCreating(false);
    setEditingMapping(null);
  };

  const formTenants = user?.role === 'MASTER' ? activeTenants : activeTenants.filter(t => t.area === user?.assignedArea);

  if (isCreating) {
    return (
      <MapeamentoForm
        initialMapping={editingMapping}
        tenants={formTenants}
        onCancel={() => setIsCreating(false)}
        onSave={handleSaveMappingForm}
      />
    );
  }

  const filteredMappings = mappings.filter(m => {
    const dept = DEPARTMENT_TAXONOMY.find(d => d.id === m.departmentId);
    if (!dept) return false;
    if (user?.role === 'ADMIN' && dept.area !== user?.assignedArea) return false;
    if (filterArea && dept.area !== filterArea) return false;
    if (filterDept && dept.id !== filterDept) return false;
    if (query) {
      const lowerQuery = query.toLowerCase();
      return m.pageName.toLowerCase().includes(lowerQuery) || dept.name.toLowerCase().includes(lowerQuery);
    }
    return true;
  });

  const viewingMap = viewingId ? mappings.find(m => m.id === viewingId) : null;

  return (
    <>
      {(user?.role === 'MASTER' || user?.role === 'ADMIN') && !isCreating && (
        <HeaderPortal>
          <HeaderButton
            icon={Plus}
            onClick={() => { setEditingMapping(null); setIsCreating(true); }}
            title="Nova Página"
          />
        </HeaderPortal>
      )}
      <div className="h-full p-4 md:p-8 overflow-auto custom-scrollbar flex flex-col items-center">
        <div className="w-full max-w-7xl flex flex-col h-full">
      <MapeamentoList 

        mappings={filteredMappings}
        onAddNew={() => { setEditingMapping(null); setIsCreating(true); }}
        onView={(id) => {
          const map = mappings.find(m => m.id === id);
          if (map) handleEditMapping(map);
        }}
        onDelete={(id) => {
          const map = mappings.find(m => m.id === id);
          if (map) confirmDeleteMapping(map);
        }}
      />
      </div>
      
      <ModalAlert 
        isOpen={deleteModal.isOpen}
        title="Excluir Mapeamento"
        description="Deseja realmente excluir este mapeamento? O painel central deixará de exibir e consumir as informações atreladas a ele."
        onConfirm={executeDeleteMapping}
        onCancel={() => setDeleteModal({ isOpen: false, mapping: null })}
        confirmLabel="Excluir"
      />
    </div>
    </>
  );
};


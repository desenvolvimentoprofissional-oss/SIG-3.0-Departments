import { logger } from "../lib/logger.util";
import React, { useState, useEffect, useMemo } from 'react';
import { DEPARTMENT_TAXONOMY } from '../lib/taxonomia-icones';
import { useTenantStore } from '../store/tenantStore';
import { useMappingStore } from '../store/mappingStore';
import { useIamStore } from '../store/iamStore';
import { useAuthStore } from '../store/authStore';
import { useSearchStore } from '../store/useSearchStore';
import { Button } from '../components/ui/Button';
import { TenantConfig } from '../types/index';

import { Slideover } from '../components/ui/Slideover';
import { CheckCircle2, AlertCircle, Edit2, Trash2, } from 'lucide-react';
import { CreateDepartmentModal } from '../components/layout/CreateDepartmentModal';
import { HeaderPortal } from '../components/layout/HeaderPortal';
import { HeaderButton } from '../components/layout/AppHeader';
import { combineDepartments, filterDepartments } from '../lib/filters.util';

import { LinkedPagesSection } from './departamentos/components/LinkedPagesSection';
import { DeptUsersSection } from './departamentos/components/DeptUsersSection';
import { ShareAccessModal } from "./departamentos/components/ShareAccessModal";
import { DepartmentGrid } from "./departamentos/components/DepartmentGrid";
import { FirebaseConfigSection } from './departamentos/components/FirebaseConfigSection';

import * as Icons from 'lucide-react';
import { DepartmentManagementSlideover } from '../components/views/DepartmentManagementSlideover';

export const DepartmentManagementView: React.FC = () => {
  const { user, activeTenantDb } = useAuthStore();
  const { query, filterArea, filterDept, filterStatus } = useSearchStore();
  const { tenants, subscribeToTenants, deleteTenantConfig } = useTenantStore();
  const { mappings, subscribeToMappings } = useMappingStore();
  const { users, initializeSync, updateUser } = useIamStore();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sdkInput, setSdkInput] = useState('');
  const [firebaseConfigForm, setFirebaseConfigForm] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  });
  const [showSdk, setShowSdk] = useState(false);

  const activeTenants = tenants.filter(t => !!t.firebaseConfig && t.isActive);

  useEffect(() => {
    if (!activeTenantDb) return;
    const unsubTenants = subscribeToTenants();
    const unsubUsers = initializeSync();
    
    return () => {
      unsubTenants();
      unsubUsers();
    };
  }, [activeTenantDb]);

  const confirmDeleteDept = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este departamento? Esta ação não pode ser desfeita.')) {
      try {
        await deleteTenantConfig(id);
        setSelectedDeptId(null);
      } catch (e) {
        logger.error("DELETE_DEPARTMENT_FAILED");
      }
    }
  };

  useEffect(() => {
    if (activeTenants.length > 0) {
      const unsubMappings = subscribeToMappings(activeTenants);
      return () => {
        unsubMappings();
      };
    }
  }, [activeTenants.length, subscribeToMappings]);

  useEffect(() => {
    const handleOpen = () => setShowCreateModal(true);
    window.addEventListener('open-novo-departamento', handleOpen);
    return () => window.removeEventListener('open-novo-departamento', handleOpen);
  }, []);

  const combinedDepts = useMemo(() => {
    return combineDepartments(DEPARTMENT_TAXONOMY, tenants, Icons);
  }, [tenants]);

  const rawDepts = useMemo(() => {
    return combinedDepts.map(d => ({ id: d.id, name: d.name, area: d.area }));
  }, [combinedDepts]);

  const filteredDepts = useMemo(() => {
    const wd = filterDepartments(rawDepts, user, tenants, query, filterArea, filterDept, filterStatus);
    return wd.map(w => combinedDepts.find(c => c.id === w.id) || w);
  }, [rawDepts, user, tenants, query, filterArea, filterDept, filterStatus, combinedDepts]);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { saveFirebaseConfig, deleteTenantFirebaseConfig } = useTenantStore();

  const handleOpenConfig = (deptId: string) => {
    setErrorMsg('');
    setSuccessMsg('');
    setSdkInput('');
    const existing = tenants.find(t => t.id === deptId);
    if (existing && existing.firebaseConfig) {
      setFirebaseConfigForm({
        apiKey: existing.firebaseConfig.apiKey || '',
        authDomain: existing.firebaseConfig.authDomain || '',
        projectId: existing.firebaseConfig.projectId || '',
        storageBucket: existing.firebaseConfig.storageBucket || '',
        messagingSenderId: existing.firebaseConfig.messagingSenderId || '',
        appId: existing.firebaseConfig.appId || ''
      });
    } else {
      setFirebaseConfigForm({
        apiKey: '', authDomain: '', projectId: '', storageBucket: '', messagingSenderId: '', appId: ''
      });
    }
    setSelectedDeptId(deptId);
  };

  const handleSaveSDK = async () => {
    if (!selectedDeptId) return;
    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const deptInfo = combinedDepts.find(d => d.id === selectedDeptId);
      const savedConfig = await saveFirebaseConfig(selectedDeptId, deptInfo, sdkInput, firebaseConfigForm);
      setFirebaseConfigForm(savedConfig);
      setSuccessMsg('SDK configurado com sucesso e isolamento de tenant Ativado.');
    } catch (e: any) {
      setErrorMsg(e.message || 'Erro ao salvar configuração.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveSDK = async () => {
    if (!selectedDeptId) return;
    if (window.confirm('Tem certeza que deseja remover as credenciais do SDK deste departamento?')) {
      setIsSaving(true);
      setErrorMsg('');
      setSuccessMsg('');
      try {
        await deleteTenantFirebaseConfig(selectedDeptId);
        setFirebaseConfigForm({
          apiKey: '', authDomain: '', projectId: '', storageBucket: '', messagingSenderId: '', appId: ''
        });
        setSdkInput('');
        setSuccessMsg('SDK removido com sucesso.');
      } catch (e: any) {
        setErrorMsg(e.message || 'Erro ao excluir configuração do SDK.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const selectedDeptNode = combinedDepts.find(d => d.id === selectedDeptId);

  const deptMappings = mappings.filter(m => m.departmentId === selectedDeptId).map(m => {
    let inferredType = m.pageType;
    if (!inferredType) {
      if (m.iframeUrl) {
        inferredType = 'INTEGRACAO';
      } else {
        inferredType = 'PROCESSO';
      }
    }

    const formatType = (typeStr: string) => {
      switch (typeStr) {
        case 'PROCESSO': return 'Processo';
        case 'RESULTADOS': return 'Resultado';
        case 'METRICA': return 'Métrica';
        case 'CADASTRO': return 'Cadastro';
        case 'GALERIA': return 'Galeria';
        case 'LINHA_DO_TEMPO': return 'Linha do Tempo';
        case 'INTEGRACAO': return 'Integração';
        default: return typeStr;
      }
    };

    return { id: m.id, name: m.pageName, type: formatType(inferredType) };
  });

  const totalAssetsInDept = [...deptMappings];
  const deptUsers = users.filter(u => {
    const hasViewerPages = (u.viewerPages || []).some(pageId => mappings.some(m => m.id === pageId && m.departmentId === selectedDeptId));
    const hasDeptAccess = (u.viewerDepartments || []).includes(selectedDeptId as string);
    const isDirectlyInDept = u.departmentId === selectedDeptId;
    const isAdminInArea = u.role === 'ADMIN' && selectedDeptNode && u.assignedArea === selectedDeptNode.area;
    
    if (u.role === 'MASTER') {
       return hasDeptAccess || hasViewerPages;
    }
    return isDirectlyInDept || hasDeptAccess || hasViewerPages || isAdminInArea;
  });

  return (
    <>
      {user?.role === 'MASTER' && (
        <HeaderPortal>
          <HeaderButton
            icon={Icons.Plus}
            onClick={() => window.dispatchEvent(new Event('open-novo-departamento'))}
            title="New Department"
          />
        </HeaderPortal>
      )}
      <div className="h-full p-4 md:p-8 overflow-auto custom-scrollbar flex flex-col items-center">
        <div className="w-full max-w-7xl flex flex-col h-full">
          {filteredDepts.length === 0 ? (
            <div className="text-center py-10 bg-[var(--color-content-inverse)] border border-[var(--color-border-default)] rounded-xl shadow-sm">
              <p className="text-sm text-[var(--color-content-secondary)] font-medium">Nenhum departamento encontrado.</p>
            </div>
          ) : (
            <DepartmentGrid 
              filteredDepts={filteredDepts}
              tenants={tenants}
              mappings={mappings}
              users={users}
              handleOpenConfig={handleOpenConfig}
            />
          )}
        </div>

      {selectedDeptId && selectedDeptNode && (
        <DepartmentManagementSlideover
          selectedDeptId={selectedDeptId}
          selectedDeptNode={selectedDeptNode}
          setSelectedDeptId={setSelectedDeptId}
          user={user}
          confirmDeleteDept={confirmDeleteDept}
          showSdk={showSdk}
          setShowSdk={setShowSdk}
          firebaseConfigForm={firebaseConfigForm}
          setFirebaseConfigForm={setFirebaseConfigForm}
          sdkInput={sdkInput}
          setSdkInput={setSdkInput}
          isSaving={isSaving}
          handleSaveSDK={handleSaveSDK}
          handleRemoveSDK={handleRemoveSDK}
          totalAssetsInDept={totalAssetsInDept}
          deptUsers={deptUsers}
          mappings={mappings}
          setIsShareModalOpen={setIsShareModalOpen}
          errorMsg={errorMsg}
          successMsg={successMsg}
          isShareModalOpen={isShareModalOpen}
          users={users}
          updateUser={updateUser}
        />
      )}

      {showCreateModal && <CreateDepartmentModal onClose={() => setShowCreateModal(false)} />}
    </div>
    </>
  );
};


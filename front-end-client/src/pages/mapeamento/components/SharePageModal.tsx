import React, { useState, useMemo } from 'react';
import { Search, X, UserPlus, Users, Building, Briefcase } from 'lucide-react';
import { useIamStore } from '../../../store/iamStore';
import { useAuthStore } from '../../../store/authStore';
import { useTenantStore } from '../../../store/tenantStore';
import { DEPARTMENT_TAXONOMY } from '../../../lib/taxonomia-icones';
import { Slideover } from '../../../components/ui/Slideover';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { SharePageBatchTab } from './SharePageBatchTab';
import { SharePageIndividualTab } from './SharePageIndividualTab';

interface SharePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  mappingId: string;
  departmentId: string;
  departmentArea: string;
  pageName: string;
}

export const SharePageModal: React.FC<SharePageModalProps> = ({ isOpen, onClose, mappingId, departmentId, departmentArea, pageName }) => {
  const { users, updateUser } = useIamStore();
  const { user: currentUser } = useAuthStore();
  const { tenants } = useTenantStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsersToShare, setSelectedUsersToShare] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'individual' | 'batch'>('individual');
  
  const [batchType, setBatchType] = useState<'role' | 'department' | 'area' | ''>('');
  const [batchRole, setBatchRole] = useState('');
  const [batchDept, setBatchDept] = useState('');
  const [batchArea, setBatchArea] = useState('');
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  
  const areas = useMemo(() => Array.from(new Set(DEPARTMENT_TAXONOMY.map(d => d.area))), []);

  const usersWithAccess = useMemo(() => {
    return users.filter(u => u.viewerPages?.includes(mappingId));
  }, [users, mappingId]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return [];
    const lower = searchTerm.toLowerCase();
    return users.filter(u => {
      if (u.status !== 'ACTIVE') return false;
      
      const isFromDept = u.departmentId === departmentId || 
                         u.primaryTenantId === departmentId || 
                         (u.role === 'ADMIN' && u.assignedArea === departmentArea) ||
                         (u.role === 'MASTER' && u.viewerDepartments?.includes(departmentId || ''));
      if (isFromDept) return false;
      if (u.viewerPages?.includes(mappingId)) return false;
      if (selectedUsersToShare.find(s => s.uid === u.uid)) return false;
      return u.name?.toLowerCase().includes(lower) || u.email?.toLowerCase().includes(lower);
    }).slice(0, 10);
  }, [users, searchTerm, departmentId, departmentArea, mappingId, selectedUsersToShare]);

  const handleSelectUser = (user: any) => {
    setSelectedUsersToShare(prev => [...prev, user]);
    setSearchTerm('');
  };

  const handleRemoveSelectedUser = (uid: string) => {
    setSelectedUsersToShare(prev => prev.filter(u => u.uid !== uid));
  };

  const handleGrantAccess = async () => {
    if (selectedUsersToShare.length === 0) return;
    
    for (const user of selectedUsersToShare) {
      const newViewerPages = [...(user.viewerPages || []), mappingId];
      await updateUser(user.uid, { viewerPages: newViewerPages }, {
        action: "GRANT_PAGE_ACCESS",
        details: "Acesso de visualização concedido à página via configurações de mapeamento",
        performedBy: currentUser?.role || "ADMIN"
      });
    }
    
    setSelectedUsersToShare([]);
    setSearchTerm('');
  };
  
  const handleBatchGrantAccess = async () => {
    if (!batchType) return;
    setIsProcessingBatch(true);
    
    try {
      const targetUsers = users.filter(u => {
        if (u.status !== 'ACTIVE') return false;
        
        const isFromDept = u.departmentId === departmentId || 
                           u.primaryTenantId === departmentId || 
                           (u.role === 'ADMIN' && u.assignedArea === departmentArea) ||
                           (u.role === 'MASTER' && u.viewerDepartments?.includes(departmentId || ''));
        if (isFromDept) return false;
        if (u.viewerPages?.includes(mappingId)) return false;
        
        if (batchType === 'role') {
          return u.role === batchRole;
        } else if (batchType === 'department') {
          return (u.role !== 'CONVIDADO' && (u.role as string) !== 'GUEST') && (u.departmentId === batchDept || u.primaryTenantId === batchDept);
        } else if (batchType === 'area') {
          const uDept = tenants.find(t => t.id === u.departmentId || t.id === u.primaryTenantId);
          const uArea = uDept?.area || u.assignedArea;
          return (u.role !== 'CONVIDADO' && (u.role as string) !== 'GUEST') && uArea === batchArea;
        }
        return false;
      });
      
      for (const user of targetUsers) {
        const newViewerPages = [...(user.viewerPages || []), mappingId];
        await updateUser(user.uid, { viewerPages: newViewerPages }, {
          action: "GRANT_PAGE_ACCESS",
          details: `Acesso de visualização concedido à página em lote (${batchType})`,
          performedBy: currentUser?.role || "MASTER"
        });
      }
      
      setBatchType('');
      setBatchRole('');
      setBatchDept('');
      setBatchArea('');
    } finally {
      setIsProcessingBatch(false);
    }
  };

  const handleRevokeAccess = async (userId: string) => {
    const user = users.find(u => u.uid === userId);
    if (!user) return;
    const newViewerPages = (user.viewerPages || []).filter(id => id !== mappingId);
    await updateUser(userId, { viewerPages: newViewerPages }, {
      action: "REVOKE_PAGE_ACCESS",
      details: "Acesso de visualização removido da página via configurações de mapeamento",
      performedBy: currentUser?.role || "ADMIN"
    });
  };

  if (!mappingId || !departmentId) return null;

  return (
    <Slideover isOpen={isOpen} onClose={onClose} title={`Compartilhar: ${pageName || 'Página'}`}>
      <div className="p-6 space-y-6">
        <div>
          <p className="text-sm text-[var(--color-content-secondary)] mb-4">
            Compartilhe com usuários ativos de outros departamentos. O acesso será apenas de visualização.
          </p>
          
          {currentUser?.role === 'MASTER' && (
            <div className="flex space-x-1 p-1 bg-[var(--color-background-soft)] rounded-lg mb-6">
              <button
                onClick={() => setActiveTab('individual')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'individual'
                    ? 'bg-white text-[var(--color-brand-main)] shadow-sm'
                    : 'text-[var(--color-content-tertiary)] hover:text-[var(--color-content-secondary)] hover:bg-white/50'
                }`}
              >
                Individual
              </button>
              <button
                onClick={() => setActiveTab('batch')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'batch'
                    ? 'bg-white text-[var(--color-brand-main)] shadow-sm'
                    : 'text-[var(--color-content-tertiary)] hover:text-[var(--color-content-secondary)] hover:bg-white/50'
                }`}
              >
                Em Lote (Master)
              </button>
            </div>
          )}

          {activeTab === 'individual' ? (
            <SharePageIndividualTab
              selectedUsersToShare={selectedUsersToShare}
              handleRemoveSelectedUser={handleRemoveSelectedUser}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filteredUsers={filteredUsers}
              handleSelectUser={handleSelectUser}
              handleGrantAccess={handleGrantAccess}
            />
          ) : (
            <SharePageBatchTab
              batchType={batchType} setBatchType={setBatchType}
              batchRole={batchRole} setBatchRole={setBatchRole}
              batchDept={batchDept} setBatchDept={setBatchDept}
              batchArea={batchArea} setBatchArea={setBatchArea}
              tenants={tenants} departmentId={departmentId}
              departmentArea={departmentArea} areas={areas}
              isProcessingBatch={isProcessingBatch}
              handleBatchGrantAccess={handleBatchGrantAccess}
            />
          )}
        </div>

        {usersWithAccess.length > 0 && (
          <div className="pt-6 border-t border-[var(--color-border-default)]">
            <h4 className="text-xs font-bold text-[var(--color-content-secondary)] uppercase tracking-wider mb-3">
              Pessoas com Acesso
            </h4>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {usersWithAccess.map(u => (
                <div key={u.uid} className="flex items-center justify-between p-3 border border-[var(--color-border-default)] rounded-md bg-[var(--color-background-soft)]">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 shrink-0">
                      <div className="absolute inset-0 rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand-main)] flex items-center justify-center font-bold text-xs uppercase border border-[var(--color-border-default)]">
                        {u.name.substring(0, 2)}
                      </div>
                      {u.avatarUrl && (
                        <img src={u.avatarUrl} alt={u.name} referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none'; }} className="absolute inset-0 w-8 h-8 rounded-full object-cover border border-[var(--color-border-default)] z-10 bg-[var(--color-background-light)]" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-content-primary)]">{u.name}</p>
                      <p className="text-[11px] text-[var(--color-content-tertiary)]">
                        {u.role === 'MASTER' ? 'Master' : 
                         u.role === 'ADMIN' ? 'Administrador' : 
                         u.role === 'COLABORADOR' ? 'Colaborador' : 'Convidado'} • {u.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevokeAccess(u.uid)}
                    className="text-[var(--color-content-tertiary)] hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                    title="Remover acesso"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Slideover>
  );
};

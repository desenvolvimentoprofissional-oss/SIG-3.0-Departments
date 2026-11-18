import React, { useState, useEffect, useMemo } from 'react';
import { useIamStore } from '../store/iamStore';
import { useAuthStore } from '../store/authStore';
import { useSearchStore } from '../store/useSearchStore';
import { UserSessionProfile, UserStatus } from '../types/index';
import { UserApprovalSlideover } from '../components/iam/UserApprovalSlideover';
import { CreateUserModal } from '../components/iam/CreateUserModal';
import { HeaderPortal } from '../components/layout/HeaderPortal';
import { HeaderButton } from '../components/layout/AppHeader';
import { DEPARTMENT_TAXONOMY, AreaName } from '../lib/taxonomia-icones';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatusIcon } from '../components/ui/StatusIcon';
import { Card } from '../components/ui/Card';
import { Tooltip } from '../components/ui/Tooltip';
import {
  Clock,
  UserCheck,
  ThumbsUp,
  ThumbsDown,
  Pause,
  UserX,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Settings,
  Plus,
} from 'lucide-react';
import { Select } from '../components/ui/Select';
import { filterUsers, mapRoleName, mapStatusName } from '../lib/filters.util';
import { canEditUser } from '../lib/permissions';
import { UsersTable } from '../components/iam/UsersTable';
import { useTenantStore } from '../store/tenantStore';

export const IamDashboard: React.FC = () => {
  const { users, updateUser, initializeSync } = useIamStore();
  const { user: currentUser } = useAuthStore();
  const { tenants } = useTenantStore();
  const { query, filterArea, filterDept, filterStatus } = useSearchStore();

  const [selectedUser, setSelectedUser] = useState<UserSessionProfile | null>(
    null,
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => setShowCreateModal(true);
    window.addEventListener('open-novo-usuario', handleOpenModal);
    return () =>
      window.removeEventListener('open-novo-usuario', handleOpenModal);
  }, []);

  useEffect(() => {
    const unsubscribe = initializeSync();
    return () => unsubscribe();
  }, [initializeSync]);

  const areas = useMemo(() => {
    const dynamicAreas = tenants.map((t) => t.area).filter(Boolean);
    return Array.from(
      new Set([...DEPARTMENT_TAXONOMY.map((d) => d.area), ...dynamicAreas]),
    );
  }, [tenants]);

  const baseFilteredUsers = useMemo(() => {
    return filterUsers(users, currentUser, tenants, query, filterArea, filterDept, '');
  }, [users, currentUser, tenants, query, filterArea, filterDept]);

  const filteredUsers = useMemo(() => {
    const wd = baseFilteredUsers.filter(u => filterStatus ? u.status === filterStatus : true);
    return wd.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [baseFilteredUsers, filterStatus]);

  const pendingCount = baseFilteredUsers.filter(
    (u) => u.status === 'PENDING_APPROVAL',
  ).length;
  const activeCount = baseFilteredUsers.filter((u) => u.status === 'ACTIVE').length;
  const inactiveCount = baseFilteredUsers.filter(
    (u) =>
      u.status === 'INACTIVE' ||
      u.status === 'REJECTED' ||
      u.status === 'REJEITADO',
  ).length;
  const suspendedCount = baseFilteredUsers.filter(
    (u) => u.status === 'SUSPENDED',
  ).length;

  const handleSaveUser = (updates: Partial<UserSessionProfile>) => {
    if (selectedUser) {
      const details = [];
      let actionLabel = 'Atualização de Perfil';

      if (updates.status && updates.status !== selectedUser.status) {
        details.push(`Status: ${mapStatusName(updates.status)}`);
        if (
          selectedUser.status === 'PENDING_APPROVAL' &&
          updates.status === 'ACTIVE'
        ) {
          actionLabel = 'Aprovação de Acesso';
        } else if (
          selectedUser.status === 'ACTIVE' &&
          updates.status === 'INACTIVE'
        ) {
          actionLabel = 'Inativação de Acesso';
        } else if (
          selectedUser.status === 'INACTIVE' &&
          updates.status === 'ACTIVE'
        ) {
          actionLabel = 'Reativação de Acesso';
        } else {
          actionLabel = 'Alteração de Status';
        }
      }

      if (updates.role && updates.role !== selectedUser.role)
        details.push(`Perfil: ${mapRoleName(updates.role)}`);

      if (
        'assignedArea' in updates &&
        updates.assignedArea !== selectedUser.assignedArea
      ) {
        details.push(`Área: ${updates.assignedArea || 'Nenhuma'}`);
      }
      if (
        'departmentId' in updates &&
        updates.departmentId !== selectedUser.departmentId
      ) {
        const dynamicTenant = tenants.find(
          (t) => t.id === updates.departmentId,
        );
        const deptName = dynamicTenant
          ? dynamicTenant.name
          : DEPARTMENT_TAXONOMY.find((d) => d.id === updates.departmentId)
              ?.name || 'Nenhum';
        details.push(`Departamento: ${deptName}`);
      }

      if (updates.viewerDepartments) {
        const oldDepts = selectedUser.viewerDepartments || [];
        const newDepts = updates.viewerDepartments;
        if (
          JSON.stringify(oldDepts.sort()) !== JSON.stringify(newDepts.sort())
        ) {
          details.push(`Outros Deptos: ${newDepts.length}`);
        }
      }

      const detailsString =
        details.length > 0
          ? details.join(' | ')
          : `Perfil atualizado sem alterações estruturais`;

      updateUser(selectedUser.uid, updates, {
        action: actionLabel,
        details: detailsString,
        performedBy: currentUser?.name || 'Sistema',
      });
      setSelectedUser(null);
    }
  };

  const canEdit = (u: UserSessionProfile) => {
    if (currentUser?.role === 'MASTER') return true;
    if (currentUser?.role === 'ADMIN' && u.uid !== currentUser?.uid)
      return true;
    return false;
  };

  return (
    <>
      {(currentUser?.role === 'MASTER' || currentUser?.role === 'ADMIN') && (
        <HeaderPortal>
          <HeaderButton
            icon={Plus}
            onClick={() => window.dispatchEvent(new Event('open-novo-usuario'))}
            title="Novo Usuário"
          />
        </HeaderPortal>
      )}
      <div className="p-4 md:p-8 flex-1 flex flex-col h-full overflow-auto custom-scrollbar items-center">
        <div className="w-full max-w-7xl flex flex-col h-full">
          <div className="flex-none grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold text-[var(--color-content-primary)]">
                  {activeCount}
                </div>
                <div className="text-xs uppercase font-semibold text-[var(--color-content-tertiary)] mt-1 tracking-wider">
                  Usuários Ativos
                </div>
              </div>
              <div className="p-2 bg-[var(--color-brand-main)]/10 text-[var(--color-brand-main)] rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                <UserCheck className="w-5 h-5" />
              </div>
            </Card>
            <Card className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold text-[var(--color-content-primary)]">
                  {inactiveCount}
                </div>
                <div className="text-xs uppercase font-semibold text-[var(--color-content-tertiary)] mt-1 tracking-wider">
                  Usuários Inativos
                </div>
              </div>
              <div className="p-2 bg-[var(--color-status-error)]/10 text-[var(--color-status-error)] rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                <UserX className="w-5 h-5" />
              </div>
            </Card>
            <Card className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold text-[var(--color-content-primary)]">
                  {suspendedCount}
                </div>
                <div className="text-xs uppercase font-semibold text-[var(--color-content-tertiary)] mt-1 tracking-wider">
                  Usuários Suspensos
                </div>
              </div>
              <div className="p-2 bg-[var(--color-status-warning)]/10 text-[var(--color-status-warning)] rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                <Pause className="w-5 h-5" />
              </div>
            </Card>
            <Card className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold text-[var(--color-content-primary)]">
                  {pendingCount}
                </div>
                <div className="text-xs uppercase font-semibold text-[var(--color-content-tertiary)] mt-1 tracking-wider">
                  Aguardando Análise
                </div>
              </div>
              <div className="p-2 bg-[var(--color-status-success)]/10 text-[var(--color-status-success)] rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                <Clock className="w-5 h-5" />
              </div>
            </Card>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-10 bg-[var(--color-content-inverse)] border border-[var(--color-border-default)] rounded-xl shadow-sm">
              <p className="text-sm text-[var(--color-content-secondary)] font-medium">Nenhum usuário encontrado.</p>
            </div>
          ) : (
            <UsersTable
              users={filteredUsers}
              currentUser={currentUser}
              onSelectUser={setSelectedUser}
            />
          )}
        </div>

        {selectedUser && (
          <UserApprovalSlideover
            isOpen={!!selectedUser}
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onSave={handleSaveUser}
            readOnly={
              (selectedUser.uid === currentUser?.uid &&
                currentUser?.role !== 'MASTER') ||
              (currentUser?.role !== 'MASTER' &&
                (selectedUser.role === 'MASTER' ||
                  selectedUser.role === 'ADMIN'))
            }
          />
        )}

        {showCreateModal && (
          <CreateUserModal onClose={() => setShowCreateModal(false)} />
        )}
      </div>
    </>
  );
};

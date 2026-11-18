import React from 'react';
import { UserSessionProfile } from '../../types';
import { Badge } from '../ui/Badge';
import { StatusIcon } from '../ui/StatusIcon';
import { Tooltip } from '../ui/Tooltip';
import { Button } from '../ui/Button';
import { Edit2 } from 'lucide-react';
import { canEditUser } from '../../lib/permissions';
import { DEPARTMENT_TAXONOMY } from '../../lib/taxonomia-icones';
import { useTenantStore } from '../../store/tenantStore';

interface UsersTableProps {
  users: UserSessionProfile[];
  currentUser: UserSessionProfile | null;
  onSelectUser: (user: UserSessionProfile) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  currentUser,
  onSelectUser,
}) => {
  const { tenants } = useTenantStore();

  const getDepartmentName = (id: string) => {
    const dynamicTenant = tenants.find((t) => t.id === id);
    if (dynamicTenant) return dynamicTenant.name;
    const staticDept = DEPARTMENT_TAXONOMY.find((d) => d.id === id);
    return staticDept?.name || id;
  };

  return (
    <div className="bg-[var(--color-content-inverse)] border border-[var(--color-border-default)] rounded-xl shadow-sm overflow-hidden flex-shrink-0">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[var(--color-background-light)] bg-opacity-50 text-[10px] uppercase font-bold text-[var(--color-content-tertiary)] tracking-widest border-b border-[var(--color-border-default)]">
              <th className="px-6 py-4 font-bold">Usuário</th>
              <th className="px-6 py-4 font-bold">Perfil</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 text-right font-bold">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-default)]">
            {users.map((u) => (
              <tr
                key={u.uid}
                className="hover:bg-[var(--color-background-light)] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    {u.avatarUrl ? (
                      <img
                        src={u.avatarUrl}
                        alt=""
                        className="w-9 h-9 rounded-full border border-[var(--color-border-default)] object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[var(--color-border-default)] flex items-center justify-center font-bold text-[var(--color-brand-dark)] text-sm">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-content-primary)]">
                        {u.name}
                      </p>
                      <p className="text-xs text-[var(--color-content-secondary)]">
                        {u.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant={
                      u.role === 'MASTER'
                        ? 'system'
                        : u.role === 'ADMIN'
                          ? 'info'
                          : u.role === 'COLABORADOR'
                            ? 'success'
                            : u.role === 'CONVIDADO' ||
                                (u.role as string) === 'GUEST'
                              ? 'draft'
                              : 'legacy'
                    }
                  >
                    {u.role === 'MASTER'
                      ? 'Master'
                      : u.role === 'ADMIN'
                        ? 'Administrador'
                        : u.role === 'COLABORADOR'
                          ? 'Colaborador'
                          : u.role === 'CONVIDADO' ||
                              (u.role as string) === 'GUEST'
                            ? 'Convidado'
                            : u.role}
                  </Badge>
                  {u.assignedArea && (
                    <div className="text-[10px] text-[var(--color-content-tertiary)] mt-1.5">
                      {u.assignedArea}
                    </div>
                  )}
                  {u.departmentId && (
                    <div className="text-[10px] text-[var(--color-content-tertiary)] mt-1.5">
                      {getDepartmentName(u.departmentId)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <StatusIcon
                    variant={
                      u.status === 'ACTIVE'
                        ? 'active'
                        : u.status === 'PENDING_APPROVAL'
                          ? 'pending'
                          : u.status === 'SUSPENDED'
                            ? 'suspended'
                            : u.status === 'REJECTED' ||
                                u.status === 'REJEITADO'
                              ? 'rejected'
                              : u.status === 'INACTIVE'
                                ? 'inactive'
                                : 'none'
                    }
                    label={
                      u.status === 'ACTIVE'
                        ? 'Ativo'
                        : u.status === 'PENDING_APPROVAL'
                          ? 'Aguardando Análise'
                          : u.status === 'SUSPENDED'
                            ? 'Suspenso'
                            : u.status === 'REJECTED' ||
                                u.status === 'REJEITADO'
                              ? 'Recusado'
                              : u.status === 'INACTIVE'
                                ? 'Inativo'
                                : u.status
                    }
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    {canEditUser(currentUser, u) ? (
                      <Tooltip content="Editar" position="top">
                        <button
                          onClick={() => onSelectUser(u)}
                          className="p-2 bg-white hover:bg-[var(--color-brand-main)]/5 text-[var(--color-content-secondary)] hover:text-[var(--color-brand-main)] border border-[var(--color-border-default)] hover:border-[var(--color-brand-main)]/30 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all"
                          aria-label="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    ) : u.uid === currentUser?.uid ? (
                      <Button
                        variant="secondary"
                        onClick={() => onSelectUser(u)}
                      >
                        <Edit2 className="w-4 h-4 mr-2 text-[var(--color-content-secondary)]" />{' '}
                        Visualizar
                      </Button>
                    ) : (
                      <Button variant="disabled">Bloqueado</Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

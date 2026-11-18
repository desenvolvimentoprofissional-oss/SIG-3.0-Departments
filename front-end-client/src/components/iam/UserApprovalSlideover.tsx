import React from 'react';
import { UserSessionProfile, UserRole, UserStatus } from '../../types/index';
import { Select } from './../ui/Select';
import { Button } from './../ui/Button';
import { Slideover } from '../ui/Slideover';
import { AuditHistory } from '../ui/AuditHistory';
import { useUserApproval } from '../../hooks/useUserApproval';
import {
  AdminAreaSection,
  CollaboratorDeptSection,
  GuestPagesSection,
  SharedPagesSection,
  MasterDeptSection,
} from './UserApprovalSections';

interface Props {
  user: UserSessionProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<UserSessionProfile>) => void;
  readOnly?: boolean;
}


export const UserApprovalSlideover: React.FC<Props> = ({
  user,
  isOpen,
  onClose,
  onSave,
  readOnly = false,
}) => {
  const {
    role,
    setRole,
    status,
    setStatus,
    assignedArea,
    setAssignedArea,
    departmentId,
    setDepartmentId,
    viewerDepartments,
    setViewerDepartments,
    viewerPages,
    setViewerPages,
    availablePages,
    availableAreas,
    availableDepartments,
    mappings,
    handleSave,
    statusOptions,
    roleOptions,
  } = useUserApproval(user, isOpen, onSave);

  const avatarImage = user.avatarUrl ? (
    <img
      src={user.avatarUrl}
      alt=""
      className="w-10 h-10 rounded-full border border-[var(--color-border-default)] object-cover"
    />
  ) : (
    <div className="w-10 h-10 rounded-full bg-[var(--color-background-light)] border border-[var(--color-border-default)] flex items-center justify-center font-bold text-[var(--color-brand-dark)] text-sm">
      {user.name?.[0]?.toUpperCase()}
    </div>
  );

  return (
    <Slideover
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-4">
          {avatarImage}
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[var(--color-content-primary)]">
              {user.name}
            </span>
            <span className="text-xs text-[var(--color-content-secondary)] lowercase">
              {user.email.toLowerCase()}
            </span>
          </div>
        </div>
      }
      subtitle=""
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider">
              Status do Usuário
            </label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as UserStatus)}
              disabled={readOnly}
              options={statusOptions}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider">
              Perfil
            </label>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              disabled={readOnly || user.status !== 'PENDING_APPROVAL'}
              options={roleOptions}
            />
          </div>
        </div>

        <AdminAreaSection
          role={role}
          assignedArea={assignedArea}
          setAssignedArea={setAssignedArea}
          setViewerDepartments={setViewerDepartments}
          availableAreas={availableAreas}
          readOnly={readOnly}
        />

        <CollaboratorDeptSection
          role={role}
          departmentId={departmentId}
          setDepartmentId={setDepartmentId}
          availableDepartments={availableDepartments}
          readOnly={readOnly}
        />

        <GuestPagesSection
          role={role}
          departmentId={departmentId}
          availablePages={availablePages}
          viewerPages={viewerPages}
          setViewerPages={setViewerPages}
          readOnly={readOnly}
        />

        <SharedPagesSection
          viewerPages={viewerPages}
          mappings={mappings}
          availableDepartments={availableDepartments}
        />

        <MasterDeptSection
          role={role}
          assignedArea={assignedArea}
          viewerDepartments={viewerDepartments}
          setViewerDepartments={setViewerDepartments}
          availableDepartments={availableDepartments}
          readOnly={readOnly}
        />

        {!readOnly && (
          <div className="pt-6 border-t border-[var(--color-border-default)] flex justify-end">
            <Button
              variant="primary"
              onClick={handleSave}
              className="w-full sm:w-auto"
            >
              Salvar Configurações
            </Button>
          </div>
        )}

        <AuditHistory
          createdByName={user.name}
          createdAt={user.createdAt}
          updatedAt={user.updatedAt}
          historyLog={user.historyLog}
        />
      </div>
    </Slideover>
  );
};


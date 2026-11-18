import React from 'react';
import { UserRole } from '../../types/index';
import { Select } from '../ui/Select';

export const AdminAreaSection: React.FC<{
  role: UserRole;
  assignedArea: string;
  setAssignedArea: (val: string) => void;
  setViewerDepartments: (val: string[]) => void;
  availableAreas: string[];
  readOnly: boolean;
}> = ({ role, assignedArea, setAssignedArea, setViewerDepartments, availableAreas, readOnly }) => {
  if (role !== 'ADMIN' && role !== 'MASTER') return null;
  return (
    <div className="space-y-2 pt-4 border-t border-[var(--color-border-default)]">
      <label className="text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider">
        Área de Vínculo Principal
      </label>
      <Select
        value={assignedArea}
        onChange={(e) => {
          setAssignedArea(e.target.value);
          if (role === 'MASTER') setViewerDepartments([]);
        }}
        disabled={readOnly}
        options={[
          { label: '-- Selecione a Área --', value: '' },
          ...availableAreas.map((a) => ({ label: a, value: a })),
        ]}
      />
    </div>
  );
};

export const CollaboratorDeptSection: React.FC<{
  role: UserRole;
  departmentId: string;
  setDepartmentId: (val: string) => void;
  availableDepartments: any[];
  readOnly: boolean;
}> = ({ role, departmentId, setDepartmentId, availableDepartments, readOnly }) => {
  if (role !== 'COLABORADOR' && role !== 'CONVIDADO') return null;
  return (
    <div className="space-y-2 pt-4 border-t border-[var(--color-border-default)]">
      <label className="text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider">
        Departamento de Vínculo Principal
      </label>
      <Select
        value={departmentId}
        onChange={(e) => setDepartmentId(e.target.value)}
        disabled={readOnly}
        options={[
          { label: '-- Selecione o Departamento --', value: '' },
          ...availableDepartments.map((d) => ({
            label: d.name,
            value: d.id,
          })),
        ]}
      />
    </div>
  );
};

export const GuestPagesSection: React.FC<{
  role: UserRole;
  departmentId: string;
  availablePages: any[];
  viewerPages: string[];
  setViewerPages: (val: string[]) => void;
  readOnly: boolean;
}> = ({ role, departmentId, availablePages, viewerPages, setViewerPages, readOnly }) => {
  const isGuestPagesVisible = role === 'CONVIDADO' && !!departmentId && availablePages.length > 0;
  if (!isGuestPagesVisible) return null;
  return (
    <div className="pt-4 border-t border-[var(--color-border-default)]">
      <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">
        Páginas Liberadas
      </label>
      <div className="flex flex-col gap-2 max-h-40 overflow-y-auto p-3 border border-[var(--color-border-default)] rounded-md bg-[var(--color-background-soft)]">
        {availablePages.map((page) => (
          <label key={page.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-[var(--color-brand-main)] focus:ring-[var(--color-brand-main)] w-4 h-4"
              checked={viewerPages.includes(page.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setViewerPages([...viewerPages, page.id]);
                } else {
                  setViewerPages(viewerPages.filter((id) => id !== page.id));
                }
              }}
              disabled={readOnly}
            />
            <span className="text-sm text-[var(--color-content-primary)]">{page.pageName}</span>
          </label>
        ))}
      </div>
      <p className="text-[10px] text-[var(--color-content-tertiary)] mt-1">
        Selecione as páginas específicas que o convidado poderá acessar.
        Se nenhuma for selecionada, o acesso ao conteúdo do departamento será negado.
      </p>
    </div>
  );
};

export const SharedPagesSection: React.FC<{
  viewerPages: string[];
  mappings: any[];
  availableDepartments: any[];
}> = ({ viewerPages, mappings, availableDepartments }) => {
  if (viewerPages.length === 0) return null;
  return (
    <div className="pt-4 border-t border-[var(--color-border-default)]">
      <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">
        Páginas Compartilhadas
      </label>
      <p className="text-[10px] text-[var(--color-content-tertiary)] mb-3">
        Páginas de outros departamentos com permissão de visualização.
      </p>
      <div className="flex flex-col gap-2 p-3 border border-[var(--color-border-default)] rounded-md bg-[var(--color-background-soft)]">
        {viewerPages.map((pageId) => {
          const page = mappings.find((m) => m.id === pageId);
          if (!page) return null;
          const dept = availableDepartments.find((d) => d.id === page.departmentId);
          return (
            <div key={pageId} className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-[var(--color-content-primary)]">{page.pageName}</span>
              <span className="text-[10px] text-[var(--color-content-tertiary)] uppercase tracking-wide">
                {dept?.name || 'Outro departamento'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const MasterDeptSection: React.FC<{
  role: UserRole;
  assignedArea: string;
  viewerDepartments: string[];
  setViewerDepartments: (val: string[]) => void;
  availableDepartments: any[];
  readOnly: boolean;
}> = ({ role, assignedArea, viewerDepartments, setViewerDepartments, availableDepartments, readOnly }) => {
  if (role !== 'MASTER' || !assignedArea) return null;
  return (
    <div className="pt-4 border-t border-[var(--color-border-default)]">
      <label className="text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider block mb-2">
        Departamento Vinculado
      </label>
      <Select
        value={viewerDepartments[0] || ''}
        onChange={(e) => setViewerDepartments(e.target.value ? [e.target.value] : [])}
        disabled={readOnly}
        options={[
          { label: '-- Selecione o Departamento --', value: '' },
          ...availableDepartments
            .filter((d) => d.area === assignedArea)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((dept) => ({ label: dept.name, value: dept.id })),
        ]}
      />
    </div>
  );
};

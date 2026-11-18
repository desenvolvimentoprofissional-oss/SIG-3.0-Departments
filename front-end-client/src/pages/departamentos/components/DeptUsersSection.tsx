import React from 'react';
import { Users } from 'lucide-react';
import { UserSessionProfile } from '../../../types/index';
import { Badge } from '../../../components/ui/Badge';

interface DeptUsersSectionProps {
  deptUsers: UserSessionProfile[];
  selectedDeptId: string | null;
  mappings: any[];
  selectedDeptArea?: string;
  onManageAccess?: () => void;
}

export const DeptUsersSection: React.FC<DeptUsersSectionProps> = ({ deptUsers, selectedDeptId, mappings, selectedDeptArea, onManageAccess }) => {
  const sortedUsers = [...deptUsers].sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  const isUserFromDept = (u: UserSessionProfile) => {
    if (u.role === 'MASTER') { 
      return u.viewerDepartments?.includes(selectedDeptId || '');
    }
    return u.departmentId === selectedDeptId || (u.role === 'ADMIN' && u.assignedArea === selectedDeptArea);
  };

  const getRoleBadge = (u: UserSessionProfile) => (
    <Badge variant={ 
      u.role === 'MASTER' ? 'system' : 
       u.role === 'ADMIN' ? 'info' : 
       u.role === 'COLABORADOR' ? 'success' : 
       (u.role === 'CONVIDADO' || (u.role as string) === 'GUEST') ? 'draft' : 'legacy'
    }>
      {u.role === 'MASTER' ? 'Master' : 
       u.role === 'ADMIN' ? 'Administrador' : 
       u.role === 'COLABORADOR' ? 'Colaborador' : 
       (u.role === 'CONVIDADO' || (u.role as string) === 'GUEST') ? 'Convidado' : u.role}
    </Badge>
  );

  return (
    <div className="pt-4 border-t border-[var(--color-border-default)]">
       <h3 className="text-sm font-semibold text-[var(--color-content-primary)] mb-5 flex items-center">
         <Users size={16} className="mr-2 text-[var(--color-brand-main)]" />
         Usuários Vinculados ({sortedUsers.length})
       </h3>
       
       {sortedUsers.filter(isUserFromDept).length > 0 && (
         <div className="mb-4">
           <h4 className="text-xs font-bold text-[var(--color-content-secondary)] mb-2 uppercase tracking-wider">Do Departamento</h4>
           <div className="space-y-3">
             {sortedUsers.filter(isUserFromDept).map(u => (
               <div key={u.uid} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-[var(--color-background-light)] rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-brand-main)]/30 transition-colors gap-3">
                 <div className="flex items-center space-x-3">
                   <div className="relative w-10 h-10 shrink-0">
                     <div className="absolute inset-0 rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand-main)] flex items-center justify-center font-bold text-sm uppercase border border-[var(--color-border-default)]">
                       {u.name.substring(0, 2)}
                     </div>
                     {u.avatarUrl && (
                       <img src={u.avatarUrl} alt={u.name} referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none'; }} className="absolute inset-0 w-10 h-10 rounded-full object-cover border border-[var(--color-border-default)] z-10 bg-[var(--color-background-light)]" />
                     )}
                   </div>
                   <div>
                     <p className="font-semibold text-sm text-[var(--color-content-primary)] leading-tight">{u.name}</p>
                     <p className="text-[11px] text-[var(--color-content-tertiary)] mt-1 tracking-wide">{u.email}</p>
                   </div>
                 </div>
                 <div className="flex items-center space-x-2 shrink-0 sm:ml-4 pl-13 sm:pl-0">
                   {getRoleBadge(u)}
                 </div>
               </div>
             ))}
           </div>
         </div>
       )}
       
       <div className="mt-8 mb-2">
        <div className="flex items-center justify-between mb-4">
           <h4 className="text-xs font-bold text-[var(--color-content-secondary)] uppercase tracking-wider">De Outros Departamentos</h4>
           {onManageAccess && (
             <button onClick={onManageAccess} className="text-xs font-semibold text-[var(--color-brand-main)] hover:text-[var(--color-brand-dark)] transition-colors">
               Compartilhamento / Acessos
             </button>
           )}
        </div>
        {(() => {
          const otherUsersWithAccess = sortedUsers.filter(u => {
            if (isUserFromDept(u)) return false;
            const hasDeptAccess = u.viewerDepartments?.includes(selectedDeptId || '');
            const hasPageAccess = mappings.some(m => u.viewerPages?.includes(m.id) && m.departmentId === selectedDeptId);
            return hasDeptAccess || hasPageAccess;
          });

          if (otherUsersWithAccess.length > 0) {
            return (
              <div className="space-y-3">
                {otherUsersWithAccess.map(u => {
                  const viewerDeptsPages = mappings.filter(m => u.viewerDepartments?.includes(m.departmentId) && m.departmentId === selectedDeptId).map(m => m.pageName);
                  const viewerIndividualPages = mappings.filter(m => u.viewerPages?.includes(m.id) && m.departmentId === selectedDeptId).map(m => m.pageName);
                  const viewerPages = Array.from(new Set([...viewerDeptsPages, ...viewerIndividualPages]));
                                 
                  return (
                    <div key={u.uid} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-[var(--color-background-light)] rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-brand-main)]/30 transition-colors gap-3 opacity-80 hover:opacity-100">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-10 h-10 shrink-0">
                          <div className="absolute inset-0 rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand-main)] flex items-center justify-center font-bold text-sm uppercase border border-[var(--color-border-default)]">
                            {u.name.substring(0, 2)}
                          </div>
                          {u.avatarUrl && (
                            <img src={u.avatarUrl} alt={u.name} referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none'; }} className="absolute inset-0 w-10 h-10 rounded-full object-cover border border-[var(--color-border-default)] z-10 bg-[var(--color-background-light)]" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-[var(--color-content-primary)] leading-tight">{u.name}</p>
                          <p className="text-[11px] text-[var(--color-content-tertiary)] mt-1 tracking-wide">{u.email}</p>
                          {viewerPages.length > 0 && (
                             <p className="text-[10px] text-[var(--color-content-secondary)] mt-1 tracking-wide">
                               Pode visualizar: <span className="font-medium text-[var(--color-content-primary)]">{viewerPages.join(', ')}</span>
                             </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0 sm:ml-4 pl-13 sm:pl-0">
                        {getRoleBadge(u)}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }
          return (
             <p className="text-xs text-[var(--color-content-tertiary)] italic p-4 bg-[var(--color-background-light)] rounded-lg">Nenhum usuário de outro departamento tem acesso a este departamento.</p>
          );
        })()}
      </div>
      
      {sortedUsers.length === 0 && (
         <p className="text-xs text-[var(--color-content-tertiary)] italic bg-[var(--color-background-light)] p-4 rounded-lg">Nenhum colaborador atribuído.</p>
      )}
    </div>
  );
};

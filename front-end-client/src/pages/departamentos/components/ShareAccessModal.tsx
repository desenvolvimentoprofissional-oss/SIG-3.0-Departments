import React, { useState, useMemo } from 'react';
import { Search, X, Check } from 'lucide-react';
import { UserSessionProfile } from '../../../types/index';
import { Slideover } from '../../../components/ui/Slideover';
import { Button } from '../../../components/ui/Button';

interface ShareAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserSessionProfile[];
  mappings: any[];
  selectedDeptId: string | null;
  selectedDeptArea?: string;
  onSaveAccess: (userId: string, newViewerPages: string[]) => void;
}

export const ShareAccessModal: React.FC<ShareAccessModalProps> = ({
  isOpen,
  onClose,
  users,
  mappings,
  selectedDeptId,
  selectedDeptArea,
  onSaveAccess,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const deptMappings = useMemo(() => {
    return mappings.filter(m => m.departmentId === selectedDeptId);
  }, [mappings, selectedDeptId]);

  const selectedUser = useMemo(() => {
    return users.find(u => u.uid === selectedUserId) || null;
  }, [users, selectedUserId]);

  const [localViewerPages, setLocalViewerPages] = useState<string[]>([]);

  React.useEffect(() => {
    if (selectedUser) {
      setLocalViewerPages(selectedUser.viewerPages || []);
    } else {
      setLocalViewerPages([]);
    }
  }, [selectedUser]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return [];
    const lower = searchTerm.toLowerCase();
    return users.filter(u => {
      const isFromDept = u.departmentId === selectedDeptId || 
                         u.primaryTenantId === selectedDeptId || 
                         (u.role === 'ADMIN' && u.assignedArea === selectedDeptArea) ||
                         (u.role === 'MASTER' && u.viewerDepartments?.includes(selectedDeptId || ''));
      if (isFromDept) return false;
      return u.name?.toLowerCase().includes(lower) || u.email?.toLowerCase().includes(lower);
    }).slice(0, 10);
  }, [users, searchTerm, selectedDeptId, selectedDeptArea]);

  const handleTogglePage = (pageId: string) => {
    setLocalViewerPages(prev => 
      prev.includes(pageId) ? prev.filter(id => id !== pageId) : [...prev, pageId]
    );
  };

  const handleSave = () => {
    if (selectedUserId) {
      onSaveAccess(selectedUserId, localViewerPages);
      setSelectedUserId(null);
      setSearchTerm('');
      onClose();
    }
  };

  return (
    <Slideover isOpen={isOpen} onClose={onClose} title="Compartilhar Acesso">
      <div className="space-y-6">
        {!selectedUserId ? (
          <div>
            <p className="text-sm text-[var(--color-content-secondary)] mb-4">
              Busque um usuário de outro departamento para conceder acesso às páginas deste departamento.
            </p>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Pesquisar por nome ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[var(--color-border-default)] rounded-md focus:ring-[var(--color-brand-main)] focus:border-[var(--color-brand-main)]"
              />
            </div>
            {searchTerm && filteredUsers.length === 0 && (
              <p className="text-sm text-gray-500 italic">Nenhum usuário encontrado.</p>
            )}
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {filteredUsers.map(u => (
                <button
                  key={u.uid}
                  onClick={() => setSelectedUserId(u.uid)}
                  className="flex items-center gap-3 p-3 border border-[var(--color-border-default)] rounded-md hover:bg-[var(--color-background-light)] cursor-pointer transition-colors"
                  type="button">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand-main)] flex items-center justify-center font-bold text-xs uppercase">
                    {u.name.substring(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-content-primary)]">{u.name}</p>
                    <p className="text-[11px] text-[var(--color-content-tertiary)]">{u.email}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-3 bg-[var(--color-background-light)] rounded-lg">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand-main)] flex items-center justify-center font-bold text-sm uppercase">
                   {selectedUser?.name.substring(0, 2)}
                 </div>
                 <div>
                   <p className="text-sm font-medium text-[var(--color-content-primary)]">{selectedUser?.name}</p>
                   <p className="text-xs text-[var(--color-content-tertiary)]">{selectedUser?.email}</p>
                 </div>
               </div>
               <button 
                 onClick={() => setSelectedUserId(null)}
                 className="text-[var(--color-content-tertiary)] hover:text-[var(--color-content-primary)]"
               >
                 <X size={20} />
               </button>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[var(--color-content-primary)] mb-3">Páginas deste departamento</h4>
              {deptMappings.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Nenhuma página mapeada para este departamento.</p>
              ) : (
                <div className="space-y-2">
                  {deptMappings.map(page => (
                    <label key={page.id} className="flex items-center gap-3 p-3 border border-[var(--color-border-default)] rounded-md cursor-pointer hover:bg-[var(--color-background-light)] transition-colors">
                      <input 
                        type="checkbox"
                        checked={localViewerPages.includes(page.id)}
                        onChange={() => handleTogglePage(page.id)}
                        className="rounded border-gray-300 text-[var(--color-brand-main)] focus:ring-[var(--color-brand-main)] w-4 h-4"
                      />
                      <span className="text-sm text-[var(--color-content-primary)]">{page.pageName}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border-default)]">
              <Button variant="secondary" onClick={() => setSelectedUserId(null)}>Voltar</Button>
              <Button onClick={handleSave}>Salvar Acessos</Button>
            </div>
          </div>
        )}
      </div>
    </Slideover>
  );
};

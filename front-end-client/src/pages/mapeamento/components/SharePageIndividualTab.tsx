import React from 'react';
import { Search, X, UserPlus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const SharePageIndividualTab = ({
  selectedUsersToShare,
  handleRemoveSelectedUser,
  searchTerm,
  setSearchTerm,
  filteredUsers,
  handleSelectUser,
  handleGrantAccess
}: any) => {
  return (
    <div className="mb-4">
      {selectedUsersToShare.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedUsersToShare.map((u: any) => (
            <div key={u.uid} className="flex items-center gap-1.5 bg-[var(--color-brand-light)] text-[var(--color-brand-dark)] px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--color-brand-main)]/20">
              <span>{u.name}</span>
              <button onClick={() => handleRemoveSelectedUser(u.uid)} className="hover:text-red-600 focus:outline-none flex items-center justify-center">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Adicionar pessoas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-[var(--color-border-default)] rounded-md focus:ring-[var(--color-brand-main)] focus:border-[var(--color-brand-main)] text-sm"
        />
      </div>
      {searchTerm && filteredUsers.length === 0 && (
        <div className="mt-2 p-3 bg-white border border-[var(--color-border-default)] rounded-md shadow-sm">
          <p className="text-sm text-gray-500 italic">Nenhum usuário correspondente encontrado.</p>
        </div>
      )}
      {filteredUsers.length > 0 && (
        <div className="mt-2 border border-[var(--color-border-default)] rounded-md divide-y divide-[var(--color-border-default)] shadow-sm max-h-60 overflow-y-auto">
          {filteredUsers.map((u: any) => (
            <button
              key={u.uid} 
              onClick={() => handleSelectUser(u)}
              className="w-full flex items-center justify-between p-3 hover:bg-[var(--color-background-light)] transition-colors text-left"
            >
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
                  <p className="text-[11px] text-[var(--color-content-tertiary)]">{u.email}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {selectedUsersToShare.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Button onClick={handleGrantAccess} className="flex items-center">
            <UserPlus size={16} className="mr-2" />
            Compartilhar ({selectedUsersToShare.length})
          </Button>
        </div>
      )}
    </div>
  );
};

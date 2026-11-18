import React from 'react';
import { Layers } from 'lucide-react';

interface LinkedPagesSectionProps {
  totalAssetsInDept: any[];
}

export const LinkedPagesSection: React.FC<LinkedPagesSectionProps> = ({ totalAssetsInDept }) => {
  const sortedAssets = [...totalAssetsInDept].sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  return (
    <div className="pt-4 border-t border-[var(--color-border-default)]">
       <h3 className="text-sm font-semibold text-[var(--color-content-primary)] mb-3 flex items-center">
         <Layers size={16} className="mr-2 text-[var(--color-brand-main)]" />
         Páginas Vinculadas ({sortedAssets.length})
       </h3>
       {sortedAssets.length > 0 ? (
         <div className="grid grid-cols-2 gap-3">
           {sortedAssets.map(asset => (
             <div key={asset.id} className="flex justify-between items-center text-sm p-3 bg-[var(--color-background-light)] rounded-lg border border-[var(--color-border-default)]">
               <span className="font-semibold text-[var(--color-content-primary)] truncate max-w-[150px]">{asset.name}</span>
               <span className="text-xs font-medium tracking-wide bg-[var(--color-background-main)] px-2 py-1 rounded text-[var(--color-content-secondary)] border border-[var(--color-border-default)] shrink-0 ml-2">
                 {asset.type}
               </span>
             </div>
           ))}
         </div>
       ) : (
         <p className="text-xs text-[var(--color-content-tertiary)] italic bg-[var(--color-background-light)] p-4 rounded-lg">Nenhum ativo mapeado neste departamento.</p>
       )}
    </div>
  );
};

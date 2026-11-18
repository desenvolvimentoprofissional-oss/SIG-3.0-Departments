import React from 'react';
import { Input } from '../../../components/ui/Input';

interface RelationalConfigSectionProps {
  item: any;
  onChange: (key: string, value: any) => void;
  label: string;
}

export const RelationalConfigSection: React.FC<RelationalConfigSectionProps> = ({ item, onChange, label }) => {
  return (
    <div className="flex flex-col space-y-2 pt-3 mt-3 border-t border-[var(--color-brand-main)]/20 bg-blue-50/50 p-3 rounded-lg overflow-hidden shadow-sm">
      <label className="flex items-center space-x-2 text-xs font-semibold text-[var(--color-brand-main)] cursor-pointer">
        <input 
          type="checkbox" 
          checked={!!item.isRelational}
          onChange={(e) => onChange('isRelational', e.target.checked)}
          className="rounded border-[var(--color-brand-main)] text-[var(--color-brand-main)] focus:ring-[var(--color-brand-main)] h-4 w-4"
        />
        <span className="text-sm">{label} 💡</span>
      </label>
      {item.isRelational && (
         <div className="flex flex-col space-y-3 mt-3 bg-white p-3 rounded border border-blue-100 pl-6">
           <div className="flex space-x-3 items-end">
             <div className="flex-1">
               <label className="block text-[11px] uppercase font-bold text-[var(--color-brand-main)] mb-1">Coleção de Destino (Ex: ies_cadastradas)</label>
               <Input value={item.relationalCollection || ''} onChange={(e) => onChange('relationalCollection', e.target.value)} placeholder="Firebase collection to fetch" />
             </div>
             <div className="flex-1">
               <label className="block text-[11px] uppercase font-bold text-[var(--color-brand-main)] mb-1">Campo para Exibir (Rótulo)</label>
               <Input value={item.relationalDisplayField || ''} onChange={(e) => onChange('relationalDisplayField', e.target.value)} placeholder="Ex: nome_fantasia" />
             </div>
           </div>
           <div className="flex space-x-3 items-end">
             <div className="flex-1">
               <label className="block text-[11px] uppercase font-bold text-[var(--color-brand-main)] mb-1">Depende do Campo (Atual)</label>
               <Input value={item.dependsOnField || ''} onChange={(e) => onChange('dependsOnField', e.target.value)} placeholder="Ex: nomeIES" />
             </div>
             <div className="flex-1">
               <label className="block text-[11px] uppercase font-bold text-[var(--color-brand-main)] mb-1">Filtro no Destino</label>
               <Input value={item.relationalFilterField || ''} onChange={(e) => onChange('relationalFilterField', e.target.value)} placeholder="Ex: vinculadoA" />
             </div>
           </div>
         </div>
      )}
    </div>
  );
};

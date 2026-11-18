import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { GripVertical, Trash2, Upload } from 'lucide-react';

export const SortableContentItem = ({ item, index, pageType, updateItem, removeItem, handleFileUpload, uploadingIndex }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="p-4 bg-[var(--color-background-light)] border border-[var(--color-border-default)] rounded-xl relative flex gap-3 group">
      <div 
        {...attributes} 
        {...listeners} 
        className="mt-2 cursor-grab text-[var(--color-content-tertiary)] hover:text-[var(--color-content-primary)] active:cursor-grabbing"
      >
        <GripVertical size={20} />
      </div>

      <div className="flex-1">
        <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-1 bg-white rounded shadow-sm border border-red-100">
            <Trash2 size={16} />
          </button>
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-content-secondary)] mb-1">Título</label>
                <Input 
                  value={item.title} 
                  onChange={(e) => updateItem(index, { title: e.target.value })} 
                  placeholder="Ex: Novo Projeto" 
                />
              </div>
              {pageType === 'LINHA_DO_TEMPO' ? (
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-content-secondary)] mb-1">Data / Período</label>
                  <Input 
                    value={item.date || ''} 
                    onChange={(e) => updateItem(index, { date: e.target.value })} 
                    placeholder="Ex: 2026 ou 10/10/2026" 
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-content-secondary)] mb-1">Escopo</label>
                  <select 
                    value={item.scope || 'INTERNO'}
                    onChange={(e) => updateItem(index, { scope: e.target.value as "INTERNO" | "EXTERNO" | "NAO_PUBLICADO" })}
                    className="w-full bg-[var(--color-background-light)] border border-[var(--color-border-default)] px-3 py-2 rounded-md text-sm h-10 outline-none focus:ring-2 focus:ring-[var(--color-brand-main)]"
                  >
                    <option value="INTERNO">Interno</option>
                    <option value="EXTERNO">Externo</option>
                    <option value="NAO_PUBLICADO">Não publicado</option>
                  </select>
                </div>
              )}
            </div>

            {pageType === 'LINHA_DO_TEMPO' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-content-secondary)] mb-1">Objetivo</label>
                  <textarea
                    className="w-full bg-[var(--color-background-light)] border border-[var(--color-border-default)] p-3 rounded-lg text-sm min-h-[80px]"
                    value={item.description}
                    onChange={(e) => updateItem(index, { description: e.target.value })}
                    placeholder="What is the goal of this delivery?"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-content-secondary)] mb-1">Resultado</label>
                  <textarea
                    className="w-full bg-[var(--color-background-light)] border border-[var(--color-border-default)] p-3 rounded-lg text-sm min-h-[80px]"
                    value={item.result || ''}
                    onChange={(e) => updateItem(index, { result: e.target.value })}
                    placeholder="What were the practical results?"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-[var(--color-content-secondary)] mb-1">Texto Explicativo</label>
                <textarea
                  className="w-full bg-[var(--color-background-light)] border border-[var(--color-border-default)] p-3 rounded-lg text-sm min-h-[80px]"
                  value={item.description}
                  onChange={(e) => updateItem(index, { description: e.target.value })}
                  placeholder="Detailed description..."
                />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-content-secondary)] mb-1">Texto do Botão (Opcional)</label>
                <Input 
                  value={item.buttonText || ''} 
                  onChange={(e) => updateItem(index, { buttonText: e.target.value })} 
                  placeholder="Ex: Documento de Acesso" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-content-secondary)] mb-1">Link (URL do Documento)</label>
                <Input 
                  value={item.buttonLink || ''} 
                  onChange={(e) => updateItem(index, { buttonLink: e.target.value })} 
                  placeholder="https://..." 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-content-secondary)] mb-1">URL da Imagem ou Upload</label>
              <div className="flex gap-2">
                <Input 
                  value={item.imageUrl || ''} 
                  onChange={(e) => updateItem(index, { imageUrl: e.target.value })} 
                  placeholder="https://..." 
                />
                <div className="relative">
                  <Button variant="secondary" type="button" disabled={uploadingIndex === index}>
                    {uploadingIndex === index ? 'Enviando...' : <Upload size={16} />}
                  </Button>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(index, file);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {item.imageUrl && (
            <div className={`${pageType === 'LINHA_DO_TEMPO' ? 'w-40' : 'w-32'} shrink-0 pt-6`}>
              <div className={`${pageType === 'LINHA_DO_TEMPO' ? 'aspect-video' : 'aspect-square'} rounded-lg border border-[var(--color-border-default)] overflow-hidden bg-[var(--color-background-main)] flex items-center justify-center`}>
                  <img src={item.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="text-xs text-gray-400">Erro na URL</span>'; }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

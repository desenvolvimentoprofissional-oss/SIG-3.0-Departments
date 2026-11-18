import React from 'react';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { Select } from '../../ui/Select';
import { Button } from '../../ui/Button';
import { Loader2, UploadCloud } from 'lucide-react';

interface BannerFormProps {
  imageUrl: string;
  setImageUrl: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  tag?: string;
  setTag?: (val: string) => void;
  tagColor?: 'blue-light' | 'blue-dark' | 'orange';
  setTagColor?: (val: 'blue-light' | 'blue-dark' | 'orange') => void;
  buttonText?: string;
  setButtonText?: (val: string) => void;
  buttonLink?: string;
  setButtonLink?: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  isPublished: boolean;
  setIsPublished: (val: boolean) => void;
  filterType?: 'none' | 'default' | 'dark';
  setFilterType?: (val: 'none' | 'default' | 'dark') => void;
  uploading: boolean;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BannerForm: React.FC<BannerFormProps> = ({
  imageUrl, setImageUrl,
  title, setTitle,
  description, setDescription,
  tag, setTag,
  tagColor, setTagColor,
  buttonText, setButtonText,
  buttonLink, setButtonLink,
  startDate, setStartDate,
  endDate, setEndDate,
  isPublished, setIsPublished,
  filterType, setFilterType,
  uploading, handleFileUpload
}) => {
  return (
    <div className="space-y-4">
       <div>
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">URL da Foto / Imagem</label>
          <div className="flex gap-2">
            <Input className="flex-1" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/photo.jpg" disabled={uploading} />
            <div className="relative">
              <Button variant="secondary" className="shrink-0 relative overflow-hidden" disabled={uploading}>
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </Button>
            </div>
          </div>
          <p className="text-[10px] text-[var(--color-content-tertiary)] mt-1">Insira um link direto ou envie uma imagem para o Storage</p>
       </div>
       <div>
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">Título</label>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título da campanha..." />
       </div>
       <div>
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">Texto Explicativo</label>
          <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Detalhes do banner..." rows={3} />
       </div>
       <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">Tag (Opcional)</label>
            <Input value={tag || ''} onChange={e => setTag?.(e.target.value)} placeholder="Ex: Novo" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">Cor da Tag</label>
            <Select 
              value={tagColor || 'blue-light'} 
              onChange={e => setTagColor?.(e.target.value as 'blue-light' | 'blue-dark' | 'orange')}
              options={[
                { label: 'Azul Claro', value: 'blue-light' },
                { label: 'Azul Escuro', value: 'blue-dark' },
                { label: 'Laranja', value: 'orange' }
              ]}
            />
          </div>
       </div>
       <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">Texto do Botão (Opcional)</label>
            <Input value={buttonText || ''} onChange={e => setButtonText?.(e.target.value)} placeholder="Ex: Saiba mais" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">Link do Botão (Opcional)</label>
            <Input value={buttonLink || ''} onChange={e => setButtonLink?.(e.target.value)} placeholder="https://..." />
          </div>
       </div>
       <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">Filtro de Escurecimento</label>
            <Select 
              value={filterType || 'default'} 
              onChange={e => setFilterType?.(e.target.value as 'none' | 'default' | 'dark')}
              options={[
                { label: 'Padrão (Suave)', value: 'default' },
                { label: 'Escuro (Forte)', value: 'dark' },
                { label: 'Nenhum (Sem filtro)', value: 'none' }
              ]}
            />
          </div>
       </div>
       <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">Data Publicação</label>
            <Input type="date" min={new Date().toISOString().split('T')[0]} value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">Data Vencimento</label>
            <Input type="date" min={startDate || new Date().toISOString().split('T')[0]} value={endDate} onChange={e => {
              if (startDate && e.target.value < startDate) {
                setEndDate(startDate);
              } else {
                setEndDate(e.target.value);
              }
            }} />
          </div>
       </div>
    </div>
  );
};

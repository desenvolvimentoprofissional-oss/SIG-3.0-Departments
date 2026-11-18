import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Edit2 } from 'lucide-react';
import { BannerForm } from '../../../components/views/banners/BannerForm';
import { Slideover } from '../../../components/ui/Slideover';
import { AuditHistory } from '../../../components/ui/AuditHistory';
import { useBannersStore, BannerItem } from '../../../store/bannersStore';
import { logger } from '../../../lib/logger.util';
import { getLocalISODate } from '../../../lib/date.util';

interface EditBannerSlideoverProps {
  item: BannerItem;
  onClose: () => void;
}

export const EditBannerSlideover: React.FC<EditBannerSlideoverProps> = ({ item, onClose }) => {
  const { updateItem } = useBannersStore();
  const [imageUrl, setImageUrl] = useState(item.imageUrl);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description || '');
  const [tag, setTag] = useState(item.tag || '');
  const [tagColor, setTagColor] = useState<'blue-light' | 'blue-dark' | 'orange'>(item.tagColor || 'blue-light');
  const [buttonText, setButtonText] = useState(item.buttonText || '');
  const [buttonLink, setButtonLink] = useState(item.buttonLink || '');
  const [startDate, setStartDate] = useState(item.startDate);
  const [endDate, setEndDate] = useState(item.endDate || '');
  const [isPublished, setIsPublished] = useState(item.isPublished);
  const [filterType, setFilterType] = useState<'none' | 'default' | 'dark'>(item.filterType || 'default');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setImageUrl(item.imageUrl);
    setTitle(item.title);
    setDescription(item.description || '');
    setTag(item.tag || '');
    setTagColor(item.tagColor || 'blue-light');
    setButtonText(item.buttonText || '');
    setButtonLink(item.buttonLink || '');
    setStartDate(item.startDate);
    setEndDate(item.endDate || '');
    setIsPublished(item.isPublished);
    setFilterType(item.filterType || 'default');
  }, [item]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { uploadImage } = useBannersStore.getState();
      const url = await uploadImage(file, 'banners');
      setImageUrl(url);
    } catch (error) {
      logger.error('ERR_UPDATE_BANNER_500', { origin: 'handleFileUpload', details: 'Image upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    const today = getLocalISODate();
    if (startDate && startDate < today && startDate !== item.startDate) {
      alert("A data de publicação não pode ser anterior à data de hoje.");
      return;
    }
    if (startDate && endDate && endDate < startDate) {
      alert("A data de vencimento não pode ser menor que a data de publicação.");
      return;
    }
    if (!title || !imageUrl) return;
    updateItem(item.id, {
      imageUrl,
      title,
      description,
      tag,
      tagColor,
      buttonText,
      buttonLink,
      startDate,
      endDate,
      isPublished,
      filterType
    });
    onClose();
  };

  return (
    <Slideover
      isOpen={true}
      onClose={onClose}
      title="Editar Banner"
      subtitle="Detalhes e Histórico"
      icon={Edit2}
    >
      <div className="space-y-4">
          <BannerForm 
            imageUrl={imageUrl} setImageUrl={setImageUrl}
            title={title} setTitle={setTitle}
            description={description} setDescription={setDescription}
            tag={tag} setTag={setTag}
            tagColor={tagColor} setTagColor={setTagColor}
            buttonText={buttonText} setButtonText={setButtonText}
            buttonLink={buttonLink} setButtonLink={setButtonLink}
            startDate={startDate} setStartDate={setStartDate}
            endDate={endDate} setEndDate={setEndDate}
            isPublished={isPublished} setIsPublished={setIsPublished}
            filterType={filterType} setFilterType={setFilterType}
            uploading={uploading} handleFileUpload={handleFileUpload}
          />
          <AuditHistory 
            createdByName={item.createdByName} 
            createdAt={item.createdAt} 
            updatedByName={item.updatedByName} 
            updatedAt={item.updatedAt} 
          />
          <div className="pt-6 flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsPublished(!isPublished)}
                className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${isPublished ? 'bg-[var(--color-brand-main)]' : 'bg-[var(--color-border-default)]'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isPublished ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
              <span className="text-sm font-medium text-[var(--color-content-secondary)] whitespace-nowrap">{isPublished ? 'Publicado (Visível)' : 'Rascunho (Oculto)'}</span>
            </div>
            <div className="flex space-x-3 max-w-full">
              <Button variant="secondary" onClick={onClose}>Cancelar</Button>
              <Button variant="primary" onClick={handleSave} disabled={uploading}>Salvar Alterações</Button>
            </div>
          </div>
      </div>
    </Slideover>
  );
};

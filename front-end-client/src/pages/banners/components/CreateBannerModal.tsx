import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Plus } from 'lucide-react';
import { BannerForm } from '../../../components/views/banners/BannerForm';
import { useBannersStore } from '../../../store/bannersStore';
import { logger } from '../../../lib/logger.util';
import { getLocalISODate } from '../../../lib/date.util';
import { Slideover } from '../../../components/ui/Slideover';

interface CreateBannerModalProps {
  onClose: () => void;
}

export const CreateBannerModal: React.FC<CreateBannerModalProps> = ({ onClose }) => {
  const { addItem } = useBannersStore();
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [tagColor, setTagColor] = useState<'blue-light' | 'blue-dark' | 'orange'>('blue-light');
  const [buttonText, setButtonText] = useState('');
  const [buttonLink, setButtonLink] = useState('');
  const [startDate, setStartDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [endDate, setEndDate] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [filterType, setFilterType] = useState<'none' | 'default' | 'dark'>('default');
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { uploadImage } = useBannersStore.getState();
      const url = await uploadImage(file, 'banners');
      setImageUrl(url);
    } catch (error) {
      logger.error('ERR_CREATE_BANNER_500', { origin: 'handleFileUpload', details: 'Image upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    const today = getLocalISODate();
    if (startDate && startDate < today) {
      alert("A data de publicação não pode ser anterior à data de hoje.");
      return;
    }
    if (startDate && endDate && endDate < startDate) {
      alert("A data de vencimento não pode ser menor que a data de publicação.");
      return;
    }
    if (!title || !imageUrl) return;
    addItem({
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
      title="Novo Banner" 
      icon={Plus}
    >
      <div className="flex flex-col h-full space-y-6">
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
        <div className="flex items-center space-x-3 pt-2">
          <button 
            onClick={() => setIsPublished(!isPublished)}
            className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${isPublished ? 'bg-[var(--color-brand-main)]' : 'bg-[var(--color-border-default)]'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isPublished ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
          <span className="text-sm font-medium text-[var(--color-content-secondary)]">
            {isPublished ? 'Publicado' : 'Rascunho'}
          </span>
        </div>
        <div className="pt-4 border-t border-[var(--color-border-default)] flex justify-end gap-3 mt-auto">
           <Button variant="secondary" onClick={onClose}>Cancelar</Button>
           <Button variant="primary" onClick={handleSave} disabled={uploading}>Salvar Banner</Button>
        </div>
      </div>
    </Slideover>
  );
};

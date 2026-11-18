import React, { useState, useEffect } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { useBannersStore } from '../store/bannersStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DocumentModal, DocumentType } from '../components/auth/DocumentModal';
import { motion } from 'motion/react';

export const LoginView: React.FC = () => {
  const { items, subscribeToItems } = useBannersStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [documentType, setDocumentType] = useState<DocumentType>('privacidade');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const cyclesRef = React.useRef(0);

  const openDocument = (type: DocumentType) => {
    setDocumentType(type);
    setIsDocumentModalOpen(true);
  };

  useEffect(() => {
    const unsub = subscribeToItems();
    return () => unsub();
  }, [subscribeToItems]);

  const activeItems = items.filter(item => {
    if (!item.isPublished) return false;
    const today = new Date().toLocaleDateString('en-CA');
    if (item.startDate && item.startDate > today) return false;
    if (item.endDate && item.endDate < today) return false;
    return true;
  });

  useEffect(() => {
    if (activeItems.length <= 1 || !isAutoPlaying) return;
    
    const timer = setInterval(() => {
      cyclesRef.current += 1;
      
      if (cyclesRef.current >= activeItems.length * 3) {
        setIsAutoPlaying(false);
        setCurrentIndex(0);
        return;
      }
      
      setCurrentIndex((prev) => (prev + 1) % activeItems.length);
    }, 7000);
    
    return () => clearInterval(timer);
  }, [activeItems.length, isAutoPlaying]);

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? activeItems.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % activeItems.length);
  };

  const getTagStyle = (color?: string) => {
    switch (color) {
      case 'blue-dark':
        return 'border border-[var(--color-brand-dark)]/50 text-[var(--color-brand-light)] bg-[var(--color-brand-dark)]/70 backdrop-blur-md';
      case 'orange':
        return 'border border-[var(--color-accent-dark)]/20 text-[var(--color-accent-main)] bg-[var(--color-accent-dark)]/30 backdrop-blur-md';
      case 'blue-light':
      default:
        return 'border border-cyan-500/20 text-cyan-300 bg-cyan-500/20 backdrop-blur-md';
    }
  };

  const getOverlayStyle = (filterType?: 'none' | 'default' | 'dark') => {
    switch (filterType) {
      case 'none':
        return 'bg-gradient-to-t from-black/30 to-transparent';
      case 'dark':
        return 'bg-gradient-to-t from-black/85 via-black/60 to-black/30';
      case 'default':
      default:
        return 'bg-gradient-to-t from-black/85 via-black/40 to-transparent';
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[var(--color-background-light)]">
      
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--color-background-light)] relative overflow-hidden items-center justify-center group">
        {activeItems.length > 0 ? (
          <>
            {activeItems.map((item, idx) => {
              const isActive = idx === currentIndex;
              return (
               <div 
                 key={item.id}
                 className={`absolute inset-0 transition-opacity duration-500 bg-cover bg-center ${isActive ? 'z-10 opacity-100' : 'z-0 opacity-0'}`}
                 style={{ backgroundImage: `url('${item.imageUrl}')` }}
               >
                  <div className={`absolute inset-0 flex flex-col justify-end px-16 pt-12 pb-28 ${getOverlayStyle(item.filterType)}`}>
                     <div className="flex flex-col">
                       {item.tag && (
                         <span className={`inline-block self-start mb-8 px-3 py-1 border text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm ${getTagStyle(item.tagColor)}`}>
                           {item.tag}
                         </span>
                       )}
                       <h2 className="text-4xl font-bold text-white mb-3 tracking-tight whitespace-pre-line">{item.title}</h2>
                       <p className="text-base text-gray-200 max-w-xl leading-relaxed whitespace-pre-line">{item.description}</p>
                       {item.buttonText && (
                         <a 
                           href={item.buttonLink || '#'} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="mt-8 inline-block self-start px-7 py-3 bg-[var(--color-brand-main)] hover:bg-[var(--color-brand-dark)] text-white text-sm font-semibold rounded-lg shadow-sm"
                         >
                           {item.buttonText}
                         </a>
                       )}
                     </div>
                  </div>
               </div>
            )})}
            
            {activeItems.length > 1 && (
              <>
                <button 
                  onClick={prevSlide}
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                >
                  <ChevronLeft size={24} strokeWidth={2} />
                </button>
                <button 
                  onClick={nextSlide}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                >
                  <ChevronRight size={24} strokeWidth={2} />
                </button>
                
                <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center space-x-3">
                  {activeItems.map((_, idx) => (
                     <button
                       key={idx}
                       onClick={() => {
                         setIsAutoPlaying(false);
                         setCurrentIndex(idx);
                       }}
                       className={`h-1 overflow-hidden rounded-full transition-all duration-300 relative shadow-sm ${idx === currentIndex ? 'w-12 bg-white/30' : 'w-2 bg-white/40 hover:bg-white/80'}`}
                     >
                       {idx === currentIndex && (
                         <motion.div
                           key={`progress-${idx}-${isAutoPlaying}`}
                           initial={{ scaleX: isAutoPlaying ? 0 : 1 }}
                           animate={{ scaleX: 1 }}
                           transition={isAutoPlaying ? { duration: 7, ease: 'linear' } : { duration: 0 }}
                           className="absolute inset-0 bg-white origin-left"
                         />
                       )}
                     </button>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="text-[var(--color-content-tertiary)] flex flex-col items-center">
            <span className="font-semibold text-xl mb-2">SIG 3.0</span>
            <span>Espaço para comunicação institucional</span>
          </div>
        )}
      </div>

      <div className="w-full lg:w-1/2 flex flex-col p-8 sm:p-12 lg:px-16 lg:pt-16 lg:pb-8 bg-[var(--color-content-inverse)] z-20 relative">
        <div className="flex-1 flex flex-col justify-center items-center w-full">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>

        <div className="mt-auto pt-8 shrink-0 flex flex-col items-center justify-center text-[11px] text-[var(--color-content-tertiary)] gap-3 w-full">
          <div className="flex items-center justify-center gap-3 sm:gap-4 w-full">
            <button onClick={() => openDocument('privacidade')} className="hover:text-[var(--color-brand-main)] transition-colors whitespace-nowrap">Política de Privacidade</button>
            <span className="opacity-40">•</span>
            <button onClick={() => openDocument('seguranca')} className="hover:text-[var(--color-brand-main)] transition-colors whitespace-nowrap">Política de Segurança</button>
            <span className="opacity-40">•</span>
            <button onClick={() => openDocument('termos')} className="hover:text-[var(--color-brand-main)] transition-colors whitespace-nowrap">Termos de Uso</button>
          </div>
          <span className="whitespace-nowrap w-full text-center truncate sm:text-clip sm:overflow-visible">&copy; {new Date().getFullYear()} Conselho Regional de Administração de São Paulo. Todos os direitos reservados.</span>
        </div>
      </div>

      <DocumentModal 
        isOpen={isDocumentModalOpen} 
        onClose={() => setIsDocumentModalOpen(false)} 
        initialDocument={documentType} 
      />
    </div>
  );
};


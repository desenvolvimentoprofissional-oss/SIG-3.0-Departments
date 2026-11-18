import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { PageMapping } from '../../types/mapping.types';
import { Button } from '../ui/Button';
import { Calendar, FileText, ExternalLink, X, Image as ImageIcon, ArrowRight } from 'lucide-react';

interface ContentDisplayViewProps {
  mapping: PageMapping;
}

export const ContentDisplayView: React.FC<ContentDisplayViewProps> = ({ mapping }) => {
  const isTimeline = mapping.pageType === 'LINHA_DO_TEMPO';
  const items = mapping.contentItems || [];
  const [selectedItemLink, setSelectedItemLink] = useState<string | null>(null);

  const sortedItems = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleLinkClick = (link: string) => {
    setSelectedItemLink(link);
  };

  const modalContent = selectedItemLink && (
    <div className="fixed inset-0 z-[9999] flex">
      <button
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => setSelectedItemLink(null)}
        type="button" />
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-[600px] lg:w-[800px] bg-white shadow-2xl flex flex-col border-l border-[var(--color-border-default)] animate-slide-in-right">
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-default)] bg-white z-10">
          <h2 className="font-semibold text-lg text-[var(--color-content-primary)]">Visualizar Documento</h2>
          <button onClick={() => setSelectedItemLink(null)} className="p-2 hover:bg-[var(--color-background-light)] rounded-full text-gray-500">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 bg-gray-50 h-full overflow-hidden">
           <iframe 
             src={selectedItemLink.includes('drive.google.com/file/d/') ? selectedItemLink.replace(/\/view.*/, '/preview') : selectedItemLink} 
             className="w-full h-full border-0" 
             allow="autoplay" 
           />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-auto custom-scrollbar items-center relative bg-transparent">
      <div className="w-full max-w-7xl flex flex-col h-full">
        {items.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl border border-[var(--color-border-default)]">
             <FileText className="w-12 h-12 mx-auto text-[var(--color-content-tertiary)] mb-4" />
             <p className="text-[var(--color-content-secondary)]">Nenhum conteúdo disponível no momento.</p>
          </div>
        ) : isTimeline ? (
          <div className="relative w-full">
            
            <div className="absolute left-[24px] md:left-[32px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[var(--color-brand-main)]/20 to-transparent" />

            <div className="space-y-6 md:space-y-8">
              {sortedItems.map((item) => {
                return (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative flex items-start w-full group/timeline"
                  >
                    
                    <div className="absolute left-[24px] md:left-[32px] top-8 md:top-10 w-3.5 h-3.5 rounded-full bg-white border-2 border-[var(--color-brand-main)] shadow-[0_0_0_3px_rgba(255,255,255,1),0_0_10px_rgba(0,67,162,0.15)] transform -translate-x-1/2 z-10 transition-all duration-300 group-hover/timeline:scale-[1.5] group-hover/timeline:bg-[var(--color-brand-main)] group-hover/timeline:shadow-[0_0_0_3px_rgba(255,255,255,1),0_0_15px_rgba(0,67,162,0.3)]" />

                    <div className="w-full pl-12 md:pl-20">
                      <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-[var(--color-border-default)] hover:border-[var(--color-brand-main)]/40 hover:shadow-lg transition-all duration-300 group overflow-hidden relative">
                        
                        <div className="relative z-10 flex flex-col items-start w-full">
                          {item.date && (
                             <div className="inline-flex items-center text-[10px] font-semibold tracking-wider uppercase text-[var(--color-brand-main)] mb-3 bg-[var(--color-brand-main)]/5 px-2.5 py-1 rounded-full">
                               <Calendar size={12} className="mr-1.5" /> {item.date}
                             </div>
                          )}
                          <div className="flex flex-col md:flex-row gap-5 md:gap-8 items-start w-full">
                            <div className="flex-1 flex flex-col items-start w-full">
                              <h3 className="font-semibold text-sm text-[var(--color-content-primary)] mb-2 group-hover:text-[var(--color-brand-main)] transition-colors duration-300">
                                {item.title}
                              </h3>
                              
                              {item.description && (
                                <p className="text-xs text-[var(--color-content-secondary)] leading-relaxed mb-4 text-left">
                                  {item.description}
                                </p>
                              )}
                              
                              {item.result && (
                                <div className="w-full p-3.5 rounded-lg bg-gray-50/80 border border-gray-100 text-left">
                                  <strong className="text-[10px] uppercase tracking-wider text-[var(--color-brand-main)] block mb-1">Resultado</strong>
                                  <p className="text-xs text-[var(--color-content-secondary)] font-medium leading-relaxed">{item.result}</p>
                                </div>
                              )}

                              {!item.imageUrl && item.buttonLink && item.buttonText && (
                                <div className="mt-4">
                                  <button 
                                    onClick={() => handleLinkClick(item.buttonLink!)} 
                                    className="flex items-center justify-center gap-1.5 px-3 py-1 border border-[var(--color-border-default)] rounded-full text-[var(--color-content-secondary)] text-[11px] font-medium hover:border-[var(--color-brand-main)] hover:text-[var(--color-brand-main)] hover:bg-[var(--color-brand-main)]/5 transition-all shadow-sm w-fit group/btn"
                                  >
                                    <FileText size={12} className="text-[var(--color-content-tertiary)] group-hover/btn:text-[var(--color-brand-main)] transition-colors" /> {item.buttonText}
                                  </button>
                                </div>
                              )}
                            </div>
                            
                            {item.imageUrl && (
                              <div className="w-full md:w-[320px] shrink-0 rounded-lg overflow-hidden border border-[var(--color-border-default)] relative aspect-video group/image">
                                <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-700 ease-out" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-50" />
                                
                                {item.buttonLink && item.buttonText && (
                                  <div className="absolute bottom-4 left-0 w-full flex justify-center z-10">
                                    <button 
                                      onClick={() => handleLinkClick(item.buttonLink!)} 
                                      className="flex items-center justify-center gap-1.5 px-3 py-0.5 border border-white/40 rounded-full text-white text-[10px] font-medium hover:bg-white/20 hover:border-white/80 transition-all backdrop-blur-md shadow-sm"
                                    >
                                      <FileText size={10} /> {item.buttonText}
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedItems.map(item => {
              let scopeText = 'Interno';
              let scopeColor = 'text-[var(--color-brand-main)]';
              
              if (item.scope === 'EXTERNO') {
                scopeText = 'Externo';
                scopeColor = 'text-[var(--color-status-warning)]';
              } else if (item.scope === 'NAO_PUBLICADO') {
                scopeText = 'Não publicado';
                scopeColor = 'text-[var(--color-content-tertiary)]';
              }
                
              return (
                <div key={item.id} className="relative hover:z-50">
                  <div className="bg-[var(--color-content-inverse)] border border-[var(--color-border-default)] rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative group">

                    <div className="relative h-40 bg-[var(--color-border-default)] rounded-t-xl shrink-0 w-full group overflow-hidden">
                      {item.imageUrl ? (
                        <>
                          <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-50" />
                        </>
                      ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-content-tertiary)] gap-2">
                           <ImageIcon size={32} />
                           <span className="text-xs font-medium">Sem imagem</span>
                         </div>
                      )}
                      
                      {item.buttonLink && item.buttonText && (
                        <div className="absolute bottom-4 left-0 w-full flex justify-center z-10">
                          <button 
                            onClick={() => handleLinkClick(item.buttonLink!)} 
                            className="flex items-center justify-center gap-1.5 px-3 py-0.5 border border-white/40 rounded-full text-white text-[10px] font-medium hover:bg-white/20 hover:border-white/80 transition-all backdrop-blur-md shadow-sm"
                          >
                            <FileText size={10} /> {item.buttonText}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      
                      <div className="flex items-center justify-between mb-2">
                        <div className={`flex items-center gap-1.5 uppercase text-[10px] font-semibold tracking-wider ${scopeColor}`}>
                           <div className="w-2 h-2 rounded-full border border-current" />
                           <span>{scopeText}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-sm text-[var(--color-content-primary)] mb-1">{item.title}</h3>
                      <p className="text-xs text-[var(--color-content-secondary)] mb-3 whitespace-pre-wrap leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedItemLink && createPortal(modalContent, document.body)}
    </div>
  );
};

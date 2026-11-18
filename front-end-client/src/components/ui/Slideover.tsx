import React from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export interface SlideoverProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  maxWidthClass?: string;
  headerActions?: React.ReactNode;
}

function Slideover({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: IconComponent,
  children,
  maxWidthClass = 'md:w-[768px] max-w-full',
  headerActions
}: SlideoverProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.button 
            type="button"
            aria-label="Fechar sobreposição do modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm w-full h-full cursor-default"
            onClick={onClose}
          />
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full ${maxWidthClass} bg-[var(--color-content-inverse)] h-full shadow-2xl flex flex-col border-l border-[var(--color-border-default)]`}
          >
            
            <div className="p-6 border-b border-[var(--color-border-default)] flex items-center justify-between shrink-0 bg-[var(--color-background-light)]">
              <div className="flex items-center space-x-3">
                {IconComponent && (
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-light)] text-[var(--color-brand-main)] flex items-center justify-center">
                     <IconComponent size={20} strokeWidth={1.5} />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-content-primary)] tracking-tight">{title}</h2>
                  {subtitle && <p className="text-xs text-[var(--color-content-tertiary)] uppercase tracking-wider">{subtitle}</p>}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {headerActions}
                <button 
                  onClick={onClose}
                  className="p-2 text-[var(--color-content-tertiary)] hover:text-[var(--color-content-primary)] hover:bg-[var(--color-border-default)] rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar p-6 space-y-8">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const _Slideover = React.memo(Slideover);
export { _Slideover as Slideover };

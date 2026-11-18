import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNoticeStore, Notice } from '../../store/noticeStore';
import { filterRelevantNotices, sortNoticesByPriority } from '../../lib/notice.util';
import { getLocalISODate } from '../../lib/date.util';
import { BellRing, EyeOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'motion/react';

export const NoticePopup: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { notices, dismissedNoticeIds, sessionDismissedIds, dismissNotice, dismissNoticeSession } = useNoticeStore();
  const [activePopup, setActivePopup] = useState<Notice | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
       const today = getLocalISODate();
       const userDismissed = [...(dismissedNoticeIds[user.uid] || []), ...(sessionDismissedIds[user.uid] || [])];
       
       const relevantNotices = filterRelevantNotices(notices, user, userDismissed, today);
       const sortedNotices = sortNoticesByPriority(relevantNotices);
       
       setActivePopup(sortedNotices.length > 0 ? sortedNotices[0] : null);
    }
  }, [isAuthenticated, user, notices, dismissedNoticeIds, sessionDismissedIds]);

  return (
    <AnimatePresence mode="wait">
      {activePopup && (
        <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end justify-end pointer-events-none sm:p-0 p-4">
          <motion.div 
            key={activePopup.id}
            initial={{ opacity: 0, x: 50, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="pointer-events-auto relative bg-[var(--color-content-inverse)] rounded-xl shadow-[0_20px_40px_-15px_rgb(0,0,0,0.3)] w-full sm:w-[400px] overflow-hidden flex flex-col border border-[var(--color-border-default)]"
          >
            <div className={`h-1.5 w-full ${
              activePopup.type === 'error' ? 'bg-[var(--color-status-error)]' : 
              activePopup.type === 'warning' ? 'bg-[var(--color-status-warning)]' : 
              'bg-[var(--color-status-info)]'
            }`} />

            <div className="p-5">
              <div className="flex items-center space-x-4 mb-3">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.15, duration: 0.5 }}
                  className="shrink-0 flex items-center justify-center drop-shadow-sm"
                >
                  {activePopup.type === 'error' ? <span className="text-3xl" role="img" aria-label="Erro">🚨</span> : 
                   activePopup.type === 'warning' ? <span className="text-3xl" role="img" aria-label="Aviso">⚠️</span> : 
                   <span className="text-3xl" role="img" aria-label="Informação">💡</span>}
                </motion.div>
                
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="flex items-center gap-1.5 mb-1"
                  >
                    <BellRing size={13} className="text-[var(--color-content-tertiary)]" />
                    <span className="text-[10px] font-bold text-[var(--color-content-tertiary)] uppercase tracking-widest">
                      {activePopup.type === 'error' ? 'Aviso de Erro' : activePopup.type === 'warning' ? 'Alerta do Sistema' : 'Aviso Informativo'}
                    </span>
                  </motion.div>
                  <motion.h2 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                    className="text-[16px] font-bold tracking-tight text-[var(--color-content-primary)]"
                  >
                    {activePopup.title}
                  </motion.h2>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="prose prose-sm max-w-none text-[14px] leading-relaxed text-[var(--color-content-secondary)] whitespace-pre-line line-clamp-3"
              >
                {activePopup.text}
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="px-5 py-3 border-t border-[var(--color-border-default)] bg-[var(--color-background-light)]/50 flex flex-row items-center justify-end gap-2"
            >
               <Button 
                 variant="secondary" 
                 onClick={() => dismissNotice(user?.uid || '', activePopup.id)}
                 className="text-[13px] py-1.5 px-3 h-auto text-[var(--color-content-tertiary)] hover:text-[var(--color-content-secondary)] hover:bg-[var(--color-border-default)]/50 border-transparent shadow-none"
                 icon={<EyeOff size={14} />}
               >
                  Ocultar
               </Button>
               <Button 
                 variant={activePopup.type === 'error' ? 'primary' : 'primary'} 
                 onClick={() => dismissNoticeSession(user?.uid || '', activePopup.id)}
                 className="text-[13px] py-1.5 px-4 h-auto shadow-sm hover:shadow-md transition-shadow"
               >
                  Entendi
               </Button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

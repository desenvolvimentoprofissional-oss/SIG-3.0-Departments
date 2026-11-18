import React, { useState, useEffect } from 'react';
import { Info, ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';
import { Slideover } from '../ui/Slideover';
import { useAuthStore } from '../../store/authStore';
import { useConnectionStore } from '../../store/connectionStore';
import { getPageFeedbackAPI, getUserVoteAPI, submitVoteAPI } from '../../api/page_feedbacks.api';

interface PageInfoModalProps {
  isOpen: boolean;
  pageId: string;
  pageTitle: string;
  pageInfo: React.ReactNode;
  onClose: () => void;
}

export const PageInfoModal: React.FC<PageInfoModalProps> = ({ isOpen, pageId, pageTitle, pageInfo, onClose }) => {
  const [hasVoted, setHasVoted] = useState<'up' | 'down' | null>(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { centralDb } = useConnectionStore();

  useEffect(() => {
    if (!user || !pageId) {
      setLoading(false);
      return;
    }
    
    let isMounted = true;
    
    const fetchVoteData = async () => {
      try {
        setLoading(true);

        const stats = await getPageFeedbackAPI(centralDb, pageId);
        if (isMounted) {
          setUpvotes(stats.upvotes);
          setDownvotes(stats.downvotes);
        }

        const userVote = await getUserVoteAPI(centralDb, pageId, user.uid);
        if (isMounted) {
          setHasVoted(userVote);
        }
      } catch (error: any) {
        console.error('[SIG3_ERROR]: Loading failed. Metadata suppressed by LGPD/GRC policy.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchVoteData();
    return () => { isMounted = false; };
  }, [user, pageId]);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user || hasVoted || loading) return;

    setHasVoted(voteType);
    if (voteType === 'up') setUpvotes(prev => prev + 1);
    else setDownvotes(prev => prev + 1);

    try {
      await submitVoteAPI(centralDb, pageId, user.uid, voteType, hasVoted);
    } catch (error: any) {
      console.error('[SIG3_ERROR]: Registration failed. Metadata suppressed by LGPD/GRC policy.');

      setHasVoted(null);
      if (voteType === 'up') setUpvotes(prev => prev - 1);
      else setDownvotes(prev => prev - 1);
    }
  };

  const totalVotes = upvotes + downvotes;
  const upvotePercentage = totalVotes > 0 ? Math.round((upvotes / totalVotes) * 100) : 0;

  return (
    <Slideover
      isOpen={isOpen}
      onClose={onClose}
      title={`Sobre: ${pageTitle}`}
      icon={Info}
    >
      <div className="flex flex-col min-h-full space-y-6">
        <div className="text-[14px] text-[var(--color-content-secondary)] leading-relaxed space-y-4 flex-1">
          {pageInfo}
        </div>
        
        <div className="pt-6 border-t border-[var(--color-border-default)] mt-auto shrink-0 min-h-[120px] flex flex-col justify-center">
          {loading ? (
             <div className="flex items-center justify-center py-4">
               <div className="w-6 h-6 border-2 border-[var(--color-brand-main)] border-t-transparent rounded-full animate-spin" />
             </div>
          ) : !hasVoted ? (
            <div className="flex flex-col gap-3">
              <span className="text-[13px] font-semibold text-[var(--color-content-primary)] text-center">
                Essa informação foi útil?
              </span>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => handleVote('up')}
                  className="w-10 h-10 rounded-full border border-[var(--color-border-default)] flex items-center justify-center text-[var(--color-content-secondary)] hover:text-[var(--color-status-success)] hover:bg-[var(--color-status-success)]/10 hover:border-[var(--color-status-success)]/30 transition-all cursor-pointer disabled:opacity-50"
                  aria-label="Sim, útil"
                  disabled={loading}
                >
                  <ThumbsUp size={16} />
                </button>
                <button
                  onClick={() => handleVote('down')}
                  className="w-10 h-10 rounded-full border border-[var(--color-border-default)] flex items-center justify-center text-[var(--color-content-secondary)] hover:text-[var(--color-status-error)] hover:bg-[var(--color-status-error)]/10 hover:border-[var(--color-status-error)]/30 transition-all cursor-pointer disabled:opacity-50"
                  aria-label="Não, não foi útil"
                  disabled={loading}
                >
                  <ThumbsDown size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-2 text-[var(--color-content-primary)] animate-in fade-in zoom-in duration-300">
              <CheckCircle2 size={24} className="text-[var(--color-status-success)] mb-1" />
              <span className="text-[13px] font-medium text-center">
                Agradecemos o seu feedback!
              </span>
              <div className="flex flex-col items-center w-full max-w-[200px] mt-2">
                 <div className="flex justify-between w-full text-[11px] text-[var(--color-content-tertiary)] font-medium mb-1.5">
                   <span className="flex items-center gap-1.5"><ThumbsUp size={12} className={hasVoted === 'up' ? "text-[var(--color-status-success)]" : ""} /> {upvotes}</span>
                   <span className="flex items-center gap-1.5">{downvotes} <ThumbsDown size={12} className={hasVoted === 'down' ? "text-[var(--color-status-error)]" : ""} /></span>
                 </div>
                 <div className="w-full h-1.5 bg-[var(--color-status-error)]/20 rounded-full overflow-hidden flex">
                   <div 
                     className="h-full bg-[var(--color-status-success)] transition-all duration-1000 ease-out rounded-full"
                     style={{ width: `${upvotePercentage}%` }}
                   />
                 </div>
                 <span className="text-[10px] text-[var(--color-content-tertiary)] mt-2">
                   {upvotePercentage}% acharam útil
                 </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Slideover>
  );
};

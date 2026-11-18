import React from 'react';
import { Button } from '../ui/Button';
import { CheckCircle2 } from 'lucide-react';

interface Vote {
  userId: string;
  userName: string;
  voteValue: string;
  date: string;
  userAvatar?: string;
}

interface MeuControleVotingProps {
  hasVoting: boolean;
  userHasVoted: boolean;
  isLoadingMc: boolean;
  isSaving: boolean;
  votingOptionsList: string[];
  votes: Vote[];
  handleVote: (voteValue: string) => void;
}

export const MeuControleVoting: React.FC<MeuControleVotingProps> = ({
  hasVoting,
  userHasVoted,
  isLoadingMc,
  isSaving,
  votingOptionsList,
  votes,
  handleVote,
}) => {
  if (!hasVoting) return null;

  const getVotePercentages = () => {
    if (votes.length === 0) return [];
    const counts: Record<string, number> = {};
    votingOptionsList.forEach((opt: string) => counts[opt] = 0);
    votes.forEach(v => {
      if (counts[v.voteValue] !== undefined) counts[v.voteValue]++;
    });
    
    return votingOptionsList.map((opt: string) => ({
      option: opt,
      count: counts[opt],
      percentage: Math.round((counts[opt] / votes.length) * 100)
    }));
  };

  return (
    <div className="bg-[var(--color-brand-main)]/5 p-4 rounded-xl border border-[var(--color-brand-main)]/20">
      <h4 className="text-xs uppercase font-bold text-[var(--color-brand-main)] mb-3 flex items-center">
        Votação
        {userHasVoted && <CheckCircle2 size={12} className="ml-2 text-green-500" />}
      </h4>
      {isLoadingMc ? (
        <p className="text-xs text-[var(--color-content-tertiary)] italic text-center py-4">Carregando...</p>
      ) : !userHasVoted ? (
        <div className="grid grid-cols-2 gap-2">
          {votingOptionsList.map((opt: string) => (
            <Button
              key={opt}
              variant="secondary"
              className="w-full text-xs py-2 h-auto"
              onClick={() => handleVote(opt)}
              disabled={isSaving || isLoadingMc}
            >
              {opt}
            </Button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            {getVotePercentages().map((res: any) => (
              <div key={res.option} className="space-y-1">
                <div className="flex justify-between text-xs text-[var(--color-content-secondary)]">
                  <span>{res.option}</span>
                  <span className="font-bold">{res.percentage}% ({res.count})</span>
                </div>
                <div className="w-full bg-[var(--color-border-default)] rounded-full h-2">
                  <div className="bg-[var(--color-brand-main)] h-2 rounded-full transition-all duration-500" style={{ width: `${res.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[var(--color-border-default)]">
            {votes.map(v => (
              <div key={v.userId} className="flex items-center space-x-2 bg-white rounded-full pr-3 pl-1 py-1 border border-[var(--color-border-default)] shadow-sm" title={v.voteValue}>
                 <div className="relative w-6 h-6 shrink-0 rounded-full bg-[var(--color-brand-main)] flex items-center justify-center text-white font-bold text-[10px] overflow-hidden">
                   {v.userName.charAt(0).toUpperCase()}
                   {v.userAvatar && (
                     <img src={v.userAvatar} alt={v.userName} referrerPolicy="no-referrer" className="absolute inset-0 w-6 h-6 object-cover bg-white" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                   )}
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[10px] font-semibold leading-tight text-[var(--color-content-primary)]">{v.userName.split(' ')[0]}</span>
                   <span className="text-[9px] text-[var(--color-brand-main)] leading-tight font-medium">{v.voteValue}</span>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

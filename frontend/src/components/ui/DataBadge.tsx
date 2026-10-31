import React from 'react';
import { DataClassification } from '../../types';

interface Props {
  classification: DataClassification['type'];
  className?: string;
}

const BADGE_CONFIG = {
  VERIFIED: {
    label: 'VERIFIED DATA',
    bg: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300',
    dot: 'bg-emerald-400',
  },
  SIMULATED: {
    label: 'SIMULATED MODEL',
    bg: 'bg-blue-950/70 border-blue-500/40 text-blue-300',
    dot: 'bg-blue-400',
  },
  ASSUMPTION: {
    label: 'ASSUMPTION',
    bg: 'bg-amber-950/70 border-amber-500/40 text-amber-300',
    dot: 'bg-amber-400',
  },
  PREDICTION: {
    label: 'ML PREDICTION',
    bg: 'bg-purple-950/70 border-purple-500/40 text-purple-300',
    dot: 'bg-purple-400',
  },
  AI_EXPLANATION: {
    label: 'AI REASONING',
    bg: 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300',
    dot: 'bg-cyan-400',
  },
};

export const DataBadge: React.FC<Props> = ({ classification, className = '' }) => {
  const conf = BADGE_CONFIG[classification] || BADGE_CONFIG.VERIFIED;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold border ${conf.bg} ${className}`}
      title={`Data classification: ${conf.label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
      {conf.label}
    </span>
  );
};


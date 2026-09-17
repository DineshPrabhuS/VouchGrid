import React from 'react';
import { CheckCircle2, Clock, XCircle, PlayCircle, CircleDashed } from 'lucide-react';

export function StatusBadge({ status, className = '' }) {
  const normalized = (status || '').toUpperCase();

  switch (normalized) {
    case 'VERIFIED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${className}`}>
          <CheckCircle2 className="w-3 h-3" />
          VERIFIED
        </span>
      );

    case 'PENDING':
    case 'PENDING_VERIFICATION':
    case 'SUBMITTED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30 ${className}`}>
          <Clock className="w-3 h-3" />
          PENDING
        </span>
      );

    case 'REJECTED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30 ${className}`}>
          <XCircle className="w-3 h-3" />
          REJECTED
        </span>
      );

    case 'IN_PROGRESS':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 ${className}`}>
          <PlayCircle className="w-3 h-3" />
          IN_PROGRESS
        </span>
      );

    case 'UNASSIGNED':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700/80 ${className}`}>
          <CircleDashed className="w-3 h-3" />
          {status || 'UNASSIGNED'}
        </span>
      );
  }
}

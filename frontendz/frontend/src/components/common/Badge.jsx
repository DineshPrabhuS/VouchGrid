import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const styles = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    leader: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    member: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    verified: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    skill: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25 font-mono text-xs',
    hash: 'bg-slate-900 text-slate-400 border-slate-800 font-mono text-xs',
  };

  const currentStyle = styles[variant] || styles.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentStyle} ${className}`}
    >
      {children}
    </span>
  );
}

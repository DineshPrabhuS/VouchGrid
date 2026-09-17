import React from 'react';

export function LoadingSkeleton({ type = 'card', count = 3, className = '' }) {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {items.map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/80 animate-pulse space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 bg-slate-800 rounded w-1/2"></div>
              <div className="h-4 bg-slate-800 rounded w-16"></div>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="h-3 bg-slate-800/60 rounded w-full"></div>
              <div className="h-3 bg-slate-800/60 rounded w-4/5"></div>
            </div>
            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
              <div className="h-3 bg-slate-800/80 rounded w-20"></div>
              <div className="h-3 bg-slate-800/80 rounded w-14"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'row') {
    return (
      <div className={`space-y-2.5 ${className}`}>
        {items.map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-lg bg-slate-900/50 border border-slate-800/80 animate-pulse flex items-center justify-between"
          >
            <div className="space-y-1 w-1/3">
              <div className="h-3.5 bg-slate-800 rounded w-full"></div>
              <div className="h-2.5 bg-slate-800/60 rounded w-2/3"></div>
            </div>
            <div className="h-4 bg-slate-800 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'stats') {
    return (
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {items.map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/80 animate-pulse space-y-2"
          >
            <div className="h-3 bg-slate-800 rounded w-24"></div>
            <div className="h-7 bg-slate-800 rounded w-16 mt-2"></div>
            <div className="h-2.5 bg-slate-800/60 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-2 animate-pulse ${className}`}>
      <div className="h-4 bg-slate-800 rounded w-full"></div>
      <div className="h-4 bg-slate-800 rounded w-5/6"></div>
      <div className="h-4 bg-slate-800 rounded w-2/3"></div>
    </div>
  );
}

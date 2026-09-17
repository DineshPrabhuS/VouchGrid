import React from 'react';

export function Card({ children, className = '', hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm transition-all ${
        hover
          ? 'hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-black/40 cursor-pointer'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', action }) {
  return (
    <div className={`p-5 pb-3 flex items-start justify-between gap-4 border-b border-slate-800/60 ${className}`}>
      <div className="space-y-1 flex-1">{children}</div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-sm font-semibold text-slate-100 tracking-tight ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-xs text-slate-400 leading-relaxed ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`p-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500 ${className}`}>
      {children}
    </div>
  );
}

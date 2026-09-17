import { useState } from 'react';
import { Copy, Check, Fingerprint } from 'lucide-react';

export function HashChip({ hash, label, truncate = true, length = 8 }) {
  const [copied, setCopied] = useState(false);

  if (!hash) return null;

  const displayHash = truncate && hash.length > length * 2
    ? `${hash.substring(0, length)}...${hash.substring(hash.length - length)}`
    : hash;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={handleCopy}
      title="Click to copy full hash"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700/60 text-slate-300 font-mono text-xs cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800 transition-all group"
    >
      <Fingerprint className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-300" />
      {label && <span className="text-slate-400 font-sans text-[11px]">{label}:</span>}
      <span className="text-slate-200">{displayHash}</span>
      {copied ? (
        <Check className="w-3 h-3 text-emerald-400 ml-0.5" />
      ) : (
        <Copy className="w-3 h-3 text-slate-500 group-hover:text-slate-300 ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </div>
  );
}

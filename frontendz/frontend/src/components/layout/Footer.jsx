import { Shield, GitCommit, Lock, CheckCircle2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950/60 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400 font-medium">VouchGrid Ledger Architecture</span>
          <span>•</span>
          <span>UUIDv7 PKs</span>
          <span>•</span>
          <span>SHA-256 Decision Hashing</span>
          <span>•</span>
          <span>Tamper-Evident Chains</span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            Zero Password Surface
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Anti-Collusion Guard Active
          </span>
        </div>
      </div>
    </footer>
  );
}

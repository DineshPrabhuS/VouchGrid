import { useState } from 'react';
import { Mail, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';

export function EmailRecoveryModal() {
  const { showEmailModal, setShowEmailModal, saveRecoveryEmail, user } = useAuth();
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSaving(true);
    try {
      await saveRecoveryEmail(email);
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    setShowEmailModal(false);
  };

  return (
    <Modal
      isOpen={showEmailModal}
      onClose={handleSkip}
      title="Add Notification & Recovery Email"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-indigo-200 text-xs leading-relaxed">
          <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
          <span>
            <strong>GitHub-Primary Identity:</strong> GitHub OAuth remains your sole login method. Your email is only used for verification notifications and emergency account recovery.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Contact / Recovery Email <span className="text-slate-500">(Optional)</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                placeholder="developer@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">
              No password needed. You will never need to enter this email to sign in.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              Skip for now
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={saving}
              disabled={!email || !email.includes('@')}
              icon={ArrowRight}
            >
              Save Email
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

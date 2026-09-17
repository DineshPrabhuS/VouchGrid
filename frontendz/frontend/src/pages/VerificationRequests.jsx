import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Shield,
  GitCommit,
  Sparkles,
  AlertTriangle,
  Fingerprint,
  ExternalLink,
  Lock,
  Search,
  Filter,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { verificationService } from '../services/verificationService';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { HashChip } from '../components/common/HashChip';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export function VerificationRequests() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'completed'
  const [pendingList, setPendingList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Approve Modal State
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [approveComment, setApproveComment] = useState('');
  const [selectedContrib, setSelectedContrib] = useState(null);
  const [approving, setApproving] = useState(false);

  // Reject Modal State
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('INSUFFICIENT_EVIDENCE');
  const [rejectComment, setRejectComment] = useState('');
  const [rejecting, setRejecting] = useState(false);

  // Toast / notification feedback
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  useEffect(() => {
    loadVerifications();
  }, [user]);

  const loadVerifications = async () => {
    setLoading(true);
    try {
      const [pending, completed] = await Promise.all([
        verificationService.getPendingRequests(user?.userId),
        verificationService.getCompletedReviews(),
      ]);
      setPendingList(pending || []);
      setCompletedList(completed || []);
    } catch (err) {
      console.error('Error loading verification queue:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (text, type = 'success') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleOpenApprove = (contrib) => {
    setSelectedContrib(contrib);
    setApproveComment('Verified engineering implementation, test suite passes, and commit diffs align with claimed skills.');
    setIsApproveOpen(true);
  };

  const handleOpenReject = (contrib) => {
    setSelectedContrib(contrib);
    setRejectReason('INSUFFICIENT_EVIDENCE');
    setRejectComment('');
    setIsRejectOpen(true);
  };

  const handleConfirmApprove = async (e) => {
    e.preventDefault();
    if (!selectedContrib || !user) return;
    setApproving(true);
    try {
      const updated = await verificationService.approve(
        selectedContrib.contributionId,
        user,
        approveComment
      );
      setIsApproveOpen(false);
      showNotification(`Verified contribution "${selectedContrib.title}". Decision hash generated.`);
      await loadVerifications();
    } catch (err) {
      alert(err.message);
    } finally {
      setApproving(false);
    }
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!selectedContrib || !user) return;
    if (!rejectComment.trim()) {
      alert('A technical explanation is required for rejection per Section 18.');
      return;
    }
    setRejecting(true);
    try {
      await verificationService.reject(selectedContrib.contributionId, user, {
        reasonCategory: rejectReason,
        comment: rejectComment,
      });
      setIsRejectOpen(false);
      showNotification(`Contribution rejected under ${rejectReason}. Feedback sent to contributor.`, 'warning');
      await loadVerifications();
    } catch (err) {
      alert(err.message);
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Toast Alert */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-medium animate-fade-in ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
              : 'bg-amber-950/50 border-amber-500/40 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Peer Verification Queue
                </h1>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Section 17 & 18
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit GitHub commits, evaluate claimed skills, and seal decisions with cryptographic hashes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadVerifications}
              icon={RotateCcw}
            >
              Refresh Queue
            </Button>
          </div>
        </div>

        {/* Anti-Collusion Banner (Section 18) */}
        <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-3">
          <Shield className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-[11px] leading-relaxed">
            <p className="font-semibold text-indigo-100">Anti-Collusion & Integrity Security Rules:</p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-300">
              <li>
                <strong>Self-Verification Guard:</strong> Authors cannot verify their own contributions (self-verification is blocked in code and UI).
              </li>
              <li>
                <strong>Active Membership Check:</strong> Only verified project members can cast verification votes.
              </li>
              <li>
                <strong>Immutable Decision Hash:</strong> Every approval generates a SHA-256 hash sealing author, verifier, decision, and timestamp.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Pending Reviews</span>
          <span className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 text-[10px] font-mono">
            {pendingList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === 'completed'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Completed Ledger</span>
          <span className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 text-[10px] font-mono">
            {completedList.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Pending Queue */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Awaiting peer verification actions:</span>
            <span className="font-mono text-slate-500">Reviewer context: @{user?.githubUsername}</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              <LoadingSkeleton className="h-44 w-full rounded-xl" />
              <LoadingSkeleton className="h-44 w-full rounded-xl" />
            </div>
          ) : pendingList.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="Verification Queue is Clear"
              description="There are currently no contributions awaiting review. When teammates submit work units with Git commits, they will appear here for audit."
            />
          ) : (
            <div className="space-y-4">
              {pendingList.map((contrib) => {
                const isSelf = contrib.authorId === user?.userId;

                return (
                  <div
                    key={contrib.contributionId}
                    className="p-6 rounded-xl glass-card border border-slate-800 hover:border-slate-700/80 transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-base font-bold text-white">{contrib.title}</h3>
                          <Badge variant="pending">Awaiting Peer Audit</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>Author:</span>
                          <span className="font-semibold text-slate-200">
                            {contrib.authorDisplayName || contrib.authorUsername} (@{contrib.authorUsername})
                          </span>
                          {isSelf && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium">
                              (You — Author Verification Disabled)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-xs font-mono text-slate-500">
                        Submitted {new Date(contrib.submittedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80 leading-relaxed">
                      {contrib.summary}
                    </p>

                    {/* Claimed Git Commit Evidence */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <GitCommit className="w-3.5 h-3.5 text-indigo-400" />
                        Claimed Commit Evidence ({contrib.claimedCommitShas?.length || 0}):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {contrib.claimedCommitShas?.map((sha) => (
                          <HashChip key={sha} label="git" hash={sha} length={7} />
                        ))}
                      </div>
                    </div>

                    {/* Attested Skills */}
                    {contrib.confirmedSkills && contrib.confirmedSkills.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          Claimed Engineering Skills:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {contrib.confirmedSkills.map((sk) => (
                            <Badge key={sk} variant="skill">
                              {sk}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Review Actions Bar */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-3">
                      {isSelf ? (
                        <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/30 px-3 py-1.5 rounded-lg border border-rose-500/20">
                          <Lock className="w-4 h-4 shrink-0" />
                          <span>
                            <strong>Anti-Collusion Guard:</strong> You cannot verify your own work. Switch persona from the top navbar to verify as another teammate.
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">
                          Ready to certify as independent reviewer: <strong className="text-slate-300">@{user?.githubUsername}</strong>
                        </span>
                      )}

                      <div className="flex items-center gap-2.5">
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={isSelf}
                          onClick={() => handleOpenReject(contrib)}
                          icon={XCircle}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          disabled={isSelf}
                          onClick={() => handleOpenApprove(contrib)}
                          icon={CheckCircle2}
                        >
                          Approve & Sign Hash
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Completed Reviews */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Historical verified & rejected records sealed with cryptographic hashes:</span>
            <span className="font-mono text-slate-500">{completedList.length} total</span>
          </div>

          {completedList.length === 0 ? (
            <EmptyState
              icon={Shield}
              title="No Completed Reviews"
              description="Approved and rejected contributions will be recorded in this permanent ledger."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedList.map((contrib) => {
                const isApproved = contrib.status === 'VERIFIED';

                return (
                  <div
                    key={contrib.contributionId}
                    className="p-5 rounded-xl glass-card border border-slate-800/80 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-white line-clamp-1">{contrib.title}</h4>
                        {isApproved ? (
                          <Badge variant="verified">✓ VERIFIED</Badge>
                        ) : (
                          <Badge variant="rejected">✕ REJECTED</Badge>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {contrib.summary}
                      </p>

                      {contrib.verifierComment && (
                        <div
                          className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                            isApproved
                              ? 'bg-emerald-950/20 border border-emerald-500/20 text-emerald-300'
                              : 'bg-rose-950/20 border border-rose-500/20 text-rose-300'
                          }`}
                        >
                          <span className="font-semibold">Reviewer Note: </span>
                          <span className="italic">"{contrib.verifierComment}"</span>
                        </div>
                      )}

                      {/* Cryptographic Decision Hash */}
                      {contrib.decisionHash && (
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1 text-xs font-mono">
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>Verifier: @{contrib.verifierUsername}</span>
                            <span className="text-emerald-400">Tamper-Evident</span>
                          </div>
                          <HashChip label="decision_hash" hash={contrib.decisionHash} length={7} />
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Author: @{contrib.authorUsername}</span>
                      {isApproved && (
                        <button
                          onClick={() => navigate(`/verify/${contrib.contributionId}`)}
                          className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium cursor-pointer"
                        >
                          Certificate <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Approve Modal */}
      <Modal
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        title="Approve Contribution & Seal Decision Hash"
      >
        <form onSubmit={handleConfirmApprove} className="space-y-4">
          <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <Fingerprint className="w-4 h-4 text-emerald-400" />
              Cryptographic Attestation Notice:
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Approving computes an immutable SHA-256 hash sealing your verifier user ID, decision timestamp, claimed Git commits, and review comment.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Verifier Technical Review Comment <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={approveComment}
              onChange={(e) => setApproveComment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setIsApproveOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="success"
              size="sm"
              loading={approving}
              icon={CheckCircle2}
            >
              Sign & Approve
            </Button>
          </div>
        </form>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        title="Reject Contribution (Structured Rejection)"
      >
        <form onSubmit={handleConfirmReject} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Rejection Category (Section 18 Specification) <span className="text-rose-400">*</span>
            </label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
            >
              <option value="INSUFFICIENT_EVIDENCE">
                INSUFFICIENT_EVIDENCE (Diffs not substantial / commit proofs missing)
              </option>
              <option value="CLAIM_MISMATCH">
                CLAIM_MISMATCH (Claimed skills do not match actual diff code)
              </option>
              <option value="POOR_QUALITY">
                POOR_QUALITY (Fails basic quality, test coverage, or lint criteria)
              </option>
              <option value="UNRELATED_COMMITS">
                UNRELATED_COMMITS (Commits do not belong to this milestone)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Required Technical Explanation <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Explain to the contributor what changes or proofs are required before resubmitting..."
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setIsRejectOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
              loading={rejecting}
              icon={XCircle}
            >
              Submit Rejection
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default VerificationRequests;

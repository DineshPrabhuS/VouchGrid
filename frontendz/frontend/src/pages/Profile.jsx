import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Shield,
  Award,
  CheckCircle2,
  Users,
  ExternalLink,
  Download,
  Mail,
  GitCommit,
  Sparkles,
  Layers,
  Lock,
  AlertTriangle,
  GitBranch,
  Check,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import { projectService } from '../services/projectService';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { HashChip } from '../components/common/HashChip';
import { Card } from '../components/common/Card';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export function Profile() {
  const { userId: routeUserId } = useParams();
  const { user: currentUser, saveRecoveryEmail } = useAuth();
  const navigate = useNavigate();

  // Determine target user (either from route param or current session)
  const isOwnProfile = !routeUserId || routeUserId === currentUser?.userId;
  const targetUser = isOwnProfile ? currentUser : null;

  const [profileData, setProfileData] = useState(null);
  const [trustSignals, setTrustSignals] = useState(null);
  const [loading, setLoading] = useState(true);

  // Email form state
  const [emailInput, setEmailInput] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailSavedToast, setEmailSavedToast] = useState(false);
  const [downloadingCert, setDownloadingCert] = useState(false);

  useEffect(() => {
    if (targetUser) {
      setEmailInput(targetUser.email || '');
      loadUserData(targetUser.userId);
    }
  }, [targetUser?.userId]);

  const loadUserData = async (uid) => {
    setLoading(true);
    try {
      const [profile, signals] = await Promise.all([
        profileService.getProfile(uid),
        profileService.getTrustSignals(uid),
      ]);
      setProfileData(profile);
      setTrustSignals(signals);
    } catch (err) {
      console.error('Error fetching profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!targetUser) {
    return <div className="p-8 text-sm text-slate-400">This profile is not available through the current authenticated session.</div>;
  }

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSavingEmail(true);
    try {
      await saveRecoveryEmail(emailInput.trim());
      setEmailSavedToast(true);
      setTimeout(() => setEmailSavedToast(false), 3000);
    } finally {
      setSavingEmail(false);
    }
  };

  const handleDownloadCertificate = async () => {
    setDownloadingCert(true);
    try {
      const blob = await profileService.downloadCertificate(targetUser.userId, 'json');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vouchgrid-certificate-${targetUser.githubUsername}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Certificate export error: ' + err.message);
    } finally {
      setDownloadingCert(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Profile Header */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={targetUser?.avatarUrl}
            alt={targetUser?.displayName}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/40 glow-primary shadow-xl"
          />
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {targetUser?.displayName}
              </h1>
              <a
                href={`https://github.com/${targetUser?.githubUsername}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full bg-slate-900 text-indigo-400 border border-indigo-500/30 hover:border-indigo-400 transition-colors"
              >
                <GitBranch className="w-3.5 h-3.5" />
                @{targetUser?.githubUsername}
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
              {isOwnProfile && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Active Session
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
              {targetUser?.bio || 'Full stack engineer and active open-source collaborator on VouchGrid.'}
            </p>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 pt-0.5">
              <span className="flex items-center gap-1 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {targetUser?.email || 'No email attached'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Shield className="w-3 h-3" />
                Cryptographically Verified
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadCertificate}
            loading={downloadingCert}
            icon={Download}
          >
            Download Certificate
          </Button>
              {profileData?.verifiedContributionCount > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                navigate(`/verify/${profileData.verifiedContributions[0].contributionId}`)
              }
              icon={ExternalLink}
            >
              Public Proof Page
            </Button>
          )}
        </div>
      </div>

      {/* Compounding Trust Signals Grid (Section 20) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Compounding Trust Signals & Anti-Cartel Monitoring
          </h2>
          <span className="text-xs font-mono text-slate-500">Section 20 Protocol Invariants</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LoadingSkeleton className="h-28 rounded-xl" />
            <LoadingSkeleton className="h-28 rounded-xl" />
            <LoadingSkeleton className="h-28 rounded-xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Distinct Verifiers */}
            <div className="p-5 rounded-xl glass-card border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Distinct Peer Verifiers</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {trustSignals?.distinctVerifiersCount || 0} Independent Peers
              </div>
              <p className="text-[11px] text-slate-500">
                Attestations are distributed across multiple unique reviewers to prevent single-source bias.
              </p>
            </div>

            {/* Distinct Projects */}
            <div className="p-5 rounded-xl glass-card border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Distinct Projects</span>
                <Layers className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {trustSignals?.distinctProjectsCount || 0} Codebases
              </div>
              <p className="text-[11px] text-slate-500">
                Evidence verified across separate project repositories and modular architectures.
              </p>
            </div>

            {/* Reciprocal Verification Flag */}
            <div className="p-5 rounded-xl glass-card border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Anti-Cartel Check</span>
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-lg font-bold text-emerald-400">
                {trustSignals?.isReciprocalFlagged ? (
                  <span className="text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Flagged (Mutual Vouches)
                  </span>
                ) : (
                  'Clean (Organic Peer Review)'
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Continuous anti-collusion monitoring detects reciprocal vouching loops (*"A vouches for B, B vouches for A"*).
              </p>
            </div>
          </div>
        )}
      </div>

      {/* SKILLS SECTION: Verified Skills vs Suggested Skills (Section 20 Strict Separation) */}
      <div className="space-y-6 p-6 rounded-2xl glass-panel border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Skills Matrix</h2>
          </div>
          <p className="text-xs text-slate-400">
            Per the VouchGrid specification, verified skills are cryptographically proven through peer review and strictly separated from automated suggestions.
          </p>
        </div>

        {/* 1. Verified Skills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Verified Skills ({profileData?.verifiedSkills?.length || 0}) — Confirmed by Peer Review
            </span>
            <span className="text-[11px] font-mono text-slate-500">Tamper-evident proof records</span>
          </div>

          {loading ? (
            <LoadingSkeleton className="h-14 w-full rounded-xl" />
          ) : profileData?.verifiedSkills?.length > 0 ? (
            <div className="flex flex-wrap gap-2.5">
              {profileData.verifiedSkills.map((sk) => (
                <div
                  key={sk}
                  className="px-3.5 py-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">{sk}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/40">
                    Peer Verified
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-500 italic">
              No skills have been verified yet. Complete milestone work units and submit for peer review to earn verified skill attestations.
            </div>
          )}
        </div>

        <div className="border-t border-slate-800/80 my-4" />

        {/* 2. Suggested Skills (Inferred from Commits) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Suggested Skills ({profileData?.suggestedSkills?.length || 0}) — Inferred from Commit Diffs
            </span>
            <span className="text-[11px] font-mono text-slate-500">Awaiting peer audit</span>
          </div>

          {loading ? (
            <LoadingSkeleton className="h-14 w-full rounded-xl" />
          ) : profileData?.suggestedSkills?.length > 0 ? (
            <div className="flex flex-wrap gap-2.5">
              {profileData.suggestedSkills.map((sk) => (
                <div
                  key={sk.name}
                  className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-dashed border-amber-500/40 text-xs font-mono text-amber-300 flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400/80" />
                  <span>{sk.name}</span>
                  <span className="text-[10px]">{sk.confidenceScore}% progress · {sk.contributionCount} evidence</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300/80 border border-amber-500/30">
                    Unverified Suggestion
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-500 italic">
              No unverified suggestions at this time.
            </div>
          )}
        </div>
      </div>

      {/* Verified Contributions Portfolio */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Verified Contributions Portfolio ({profileData?.verifiedContributions?.length || 0})
          </h2>
          <span className="text-xs font-mono text-slate-500">Cryptographically Sealed Records</span>
        </div>

        {loading ? (
          <div className="space-y-4">
            <LoadingSkeleton className="h-40 rounded-xl" />
            <LoadingSkeleton className="h-40 rounded-xl" />
          </div>
        ) : profileData?.verifiedContributions?.length === 0 ? (
          <div className="p-8 text-center rounded-xl glass-panel border border-dashed border-slate-800 text-slate-500 text-xs">
            No verified contributions yet. Submit milestone code for review in your projects.
          </div>
        ) : (
          <div className="space-y-4">
            {profileData?.verifiedContributions?.map((contrib) => (
              <div
                key={contrib.contributionId}
                className="p-6 rounded-xl glass-card border border-slate-800 hover:border-slate-700/80 transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="text-base font-bold text-white">{contrib.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span>Verified by peer:</span>
                      <span className="text-slate-200 font-semibold font-mono">
                        @{contrib.verifierUsername}
                      </span>
                      <span>•</span>
                      <span>{new Date(contrib.verifiedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Badge variant="verified">✓ Cryptographically Sealed</Badge>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
                  {contrib.summary}
                </p>

                {contrib.verifierComment && (
                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300">
                    <span className="font-semibold text-emerald-400">Peer Endorsement: </span>
                    <span className="italic">"{contrib.verifierComment}"</span>
                  </div>
                )}

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-2 text-xs font-mono">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Cryptographic Evidence:</span>
                    <span className="text-emerald-400 text-[10px]">SHA-256 Anchored</span>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    {contrib.claimedCommitShas?.map((sha) => (
                      <HashChip key={sha} label="git" hash={sha} length={7} />
                    ))}
                    <HashChip label="decision_hash" hash={contrib.decisionHash} length={7} />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/verify/${contrib.contributionId}`)}
                    icon={ExternalLink}
                  >
                    Open Public Proof Certificate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Optional Notification & Recovery Settings (Only for own profile) */}
      {isOwnProfile && (
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400" />
              Notification & Recovery Contact
            </h2>
            <p className="text-xs text-slate-400">
              Per the GitHub-primary authentication model, your email is never used as a login password. It only receives peer review alerts and provides account recovery.
            </p>
          </div>

          <form onSubmit={handleUpdateEmail} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 max-w-md">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="recovery.email@company.com"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
            <Button type="submit" variant="secondary" size="sm" loading={savingEmail}>
              Save Contact
            </Button>
          </form>

          {emailSavedToast && (
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Recovery email saved successfully.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;

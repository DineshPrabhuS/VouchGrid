import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  GitCommit,
  GitBranch,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  FileCode,
  Shield,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Plus,
  Send,
  History,
  Lock,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { moduleService } from '../services/moduleService';
import { contributionService } from '../services/contributionService';
import { projectService } from '../services/projectService';
import { Button } from '../components/common/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { Badge } from '../components/common/Badge';
import { HashChip } from '../components/common/HashChip';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export function ModuleDetail() {
  const { moduleId, projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [module, setModule] = useState(null);
  const [project, setProject] = useState(null);
  const [commits, setCommits] = useState([]);
  const [selectedCommitShas, setSelectedCommitShas] = useState([]);
  const [expandedDiffs, setExpandedDiffs] = useState({});
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [confirmedSkills, setConfirmedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [loading, setLoading] = useState(true);

  // Sync state (Section 13)
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null); // success | error | reauth
  const [syncMessage, setSyncMessage] = useState('');

  // Contribution Form (Section 15 & 16)
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [existingContributions, setExistingContributions] = useState([]);
  const [revisionMode, setRevisionMode] = useState(false);
  const [revisionOfId, setRevisionOfId] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const mod = await moduleService.getModuleById(moduleId, projectId || undefined);
        setModule(mod);
        if (mod?.projectId) {
          const proj = await projectService.getProjectById(mod.projectId);
          setProject(proj);
        }
        const repoCommits = await moduleService.getCommits(mod.projectId);
        setCommits(repoCommits || []);

        const allContribs = await contributionService.getContributions();
        const modContribs = allContribs.filter((c) => c.moduleId === moduleId);
        setExistingContributions(modContribs);

        if (modContribs.length > 0) {
          const latest = modContribs[0];
          setTitle(latest.title);
          setSummary(latest.summary);
          setConfirmedSkills(latest.confirmedSkills || []);
          setSelectedCommitShas(latest.claimedCommitShas || []);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [moduleId, projectId]);

  // Skill suggestion recalculation when commits are toggled (Section 14)
  useEffect(() => {
    if (selectedCommitShas.length === 0) {
      setSkillSuggestions([]);
      return;
    }
    const suggestions = moduleService.suggestSkills(selectedCommitShas);
    setSkillSuggestions(suggestions);

    // Auto-confirm high confidence suggestions initially
    const high = suggestions.filter((s) => s.confidence.includes('High')).map((s) => s.skill);
    setConfirmedSkills((prev) => Array.from(new Set([...prev, ...high])));
  }, [selectedCommitShas]);

  const handleSyncGithub = async () => {
    setSyncing(true);
    setSyncStatus(null);
    setSyncMessage('');
    try {
      const res = await moduleService.syncRepository(module.projectId);
      setSyncStatus('success');
      setSyncMessage('Repository synced successfully.');
    } catch (err) {
      if (err.message?.includes('REAUTH')) {
        setSyncStatus('reauth');
        setSyncMessage('GitHub authorization required. Please reconnect your account.');
      } else {
        setSyncStatus('error');
        setSyncMessage(err.message || 'Failed to sync with GitHub.');
      }
    } finally {
      setSyncing(false);
    }
  };

  const toggleCommit = (sha) => {
    setSelectedCommitShas((prev) =>
      prev.includes(sha) ? prev.filter((s) => s !== sha) : [...prev, sha]
    );
  };

  const toggleDiff = (sha) => {
    setExpandedDiffs((prev) => ({ ...prev, [sha]: !prev[sha] }));
  };

  const toggleSkillConfirmed = (skillName) => {
    setConfirmedSkills((prev) =>
      prev.includes(skillName) ? prev.filter((s) => s !== skillName) : [...prev, skillName]
    );
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (!customSkill.trim()) return;
    setConfirmedSkills((prev) => Array.from(new Set([...prev, customSkill.trim()])));
    setCustomSkill('');
  };

  const handleSubmitContribution = async (e) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || selectedCommitShas.length === 0) {
      setSubmitError('Please provide a title, description, and claim at least one commit.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const newContrib = await contributionService.submitContribution(
        {
          moduleId,
          projectId: module.projectId,
          title: title.trim(),
          summary: summary.trim(),
          claimedCommitShas: selectedCommitShas,
          confirmedSkills,
          revisionOfId: revisionMode ? revisionOfId : null,
        },
        user
      );

      setExistingContributions((prev) => [newContrib, ...prev]);
      setRevisionMode(false);
      setRevisionOfId(null);
      alert('Contribution submitted for peer verification review.');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartRevision = (originalContrib) => {
    setRevisionMode(true);
    setRevisionOfId(originalContrib.contributionId);
    setTitle(`${originalContrib.title} (Revision ${originalContrib.revisionNumber + 1})`);
    setSummary(originalContrib.summary);
    setSelectedCommitShas(originalContrib.claimedCommitShas || []);
    setConfirmedSkills(originalContrib.confirmedSkills || []);
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  if (loading) return <LoadingSkeleton type="card" count={2} />;

  if (!module) {
    return (
      <div className="text-center py-12 text-slate-400">
        Module not found.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back Link */}
      <div>
        <Link
          to={`/projects/${module.projectId}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Project
        </Link>
      </div>

      {/* Module Header (Section 12) */}
      <Card className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">
              Work Unit / Module
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {module.title}
            </h1>
          </div>
          <StatusBadge status={module.status} />
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          {module.description}
        </p>

        {/* GitHub Sync Bar (Section 13) */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono">
            <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
            <span>Repository: nexus-systems/nexus-core</span>
            <span className="text-slate-600">•</span>
            <span>Last synced: just now</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncGithub}
            loading={syncing}
            icon={RefreshCw}
          >
            {syncing ? 'Syncing GitHub...' : 'Sync GitHub'}
          </Button>
        </div>

        {/* Sync Status Banner */}
        {syncStatus && (
          <div
            className={`p-3 rounded-lg text-xs flex items-center justify-between gap-3 ${
              syncStatus === 'success'
                ? 'bg-emerald-950/30 border border-emerald-500/30 text-emerald-200'
                : syncStatus === 'reauth'
                ? 'bg-amber-950/30 border border-amber-500/30 text-amber-200'
                : 'bg-rose-950/30 border border-rose-500/30 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {syncStatus === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
              <span>{syncMessage}</span>
            </div>

            {syncStatus === 'reauth' && (
              <Button variant="github" size="sm" onClick={() => alert('Redirecting to GitHub OAuth Reauthorization...')}>
                Reauthorize GitHub
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* GitHub Commits Evidence Picker (Section 13) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-indigo-400" />
              GitHub Commit Evidence
            </h2>
            <p className="text-xs text-slate-400">
              Claim commits authored for this milestone. Commits cannot be claimed across multiple contributions.
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-400 font-semibold">
            {selectedCommitShas.length} commit{selectedCommitShas.length !== 1 ? 's' : ''} claimed
          </span>
        </div>

        <div className="space-y-2.5">
          {commits.map((commit) => {
            const isSelected = selectedCommitShas.includes(commit.commitSha);
            const isExpanded = expandedDiffs[commit.commitSha];

            return (
              <div
                key={commit.commitSha}
                className={`p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-indigo-950/20 border-indigo-500/40'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleCommit(commit.commitSha)}
                    className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="text-xs font-semibold text-slate-200">{commit.message}</p>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-emerald-400">+{commit.linesAdded}</span>
                        <span className="text-rose-400">-{commit.linesDeleted}</span>
                        <HashChip hash={commit.commitSha} length={4} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <span>@{commit.authorGithubUsername}</span>
                        <span>•</span>
                        <span>{commit.filesChanged?.length || 1} file(s) changed</span>
                      </div>

                      {commit.diffSnippet && (
                        <button
                          type="button"
                          onClick={() => toggleDiff(commit.commitSha)}
                          className="text-indigo-400 hover:text-indigo-300 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          {isExpanded ? (
                            <>
                              Hide Diff <ChevronUp className="w-3 h-3" />
                            </>
                          ) : (
                            <>
                              Inspect Diff <ChevronDown className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {isExpanded && commit.diffSnippet && (
                      <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre overflow-x-auto leading-relaxed">
                        {commit.diffSnippet}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill Suggestions (Section 14) */}
      <Card className="p-6 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Skill Suggestions from Evidence (Section 14)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Suggested skills are derived from diff analysis. <strong>Suggested skill != Verified skill</strong>. Confirm the skills applicable to your contribution.
          </p>
        </div>

        {skillSuggestions.length === 0 ? (
          <p className="text-xs text-slate-500 italic">
            Select commits above to trigger skill suggestions.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {skillSuggestions.map((s) => {
              const isConfirmed = confirmedSkills.includes(s.skill);
              return (
                <div
                  key={s.skill}
                  onClick={() => toggleSkillConfirmed(s.skill)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    isConfirmed
                      ? 'bg-indigo-950/30 border-indigo-500/50 text-indigo-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-100">{s.skill}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isConfirmed ? 'bg-indigo-500/30 text-indigo-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isConfirmed ? 'CONFIRMED' : 'SUGGESTED'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">{s.confidence}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">{s.evidence}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Custom skill adder */}
        <form onSubmit={handleAddCustomSkill} className="flex items-center gap-2 max-w-sm pt-2">
          <input
            type="text"
            placeholder="Add custom confirmed skill..."
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
          />
          <Button type="submit" variant="secondary" size="sm" icon={Plus}>
            Add Skill
          </Button>
        </form>
      </Card>

      {/* Contribution Submission & Revision Chain (Section 15 & 16) */}
      <Card className="p-6 space-y-5">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-400" />
            {revisionMode ? `Submit Revision (Revision of #${revisionOfId})` : 'Submit Contribution for Verification'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Submits code claims to project peers for review and cryptographic decision hashing.
          </p>
        </div>

        {submitError && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmitContribution} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Contribution Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Implemented Cooperative Sticky Assignor & DLQ Route"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Engineering Summary & Technical Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Explain the implementation architecture, benchmarks, and verification instructions for reviewers..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            {revisionMode && (
              <Button variant="ghost" size="sm" onClick={() => setRevisionMode(false)}>
                Cancel Revision Mode
              </Button>
            )}
            <div className="ml-auto">
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={submitting}
                icon={Send}
              >
                {revisionMode ? 'Submit Revision for Review' : 'Submit for Verification'}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Existing Contribution & Revision Chain (Section 16) */}
      {existingContributions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            Contribution Revisions & Verification History (Section 16)
          </h2>

          <div className="space-y-3">
            {existingContributions.map((c) => (
              <Card key={c.contributionId} className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-400">
                        Revision #{c.revisionNumber || 1}
                      </span>
                      <h4 className="text-sm font-bold text-white">{c.title}</h4>
                    </div>
                    {c.revisionOfId && (
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Revision of Contribution #{c.revisionOfId}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={c.status} />
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  {c.summary}
                </p>

                {c.decisionHash && (
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                    <div className="text-[10px] text-slate-400">Decision Hash:</div>
                    <HashChip hash={c.decisionHash} length={8} />
                  </div>
                )}

                {c.status === 'VERIFIED' && (
                  <div className="pt-2 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartRevision(c)}
                      icon={History}
                    >
                      Submit Revision
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ModuleDetail;

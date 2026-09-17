import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderPlus,
  FolderGit2,
  CheckCircle2,
  Boxes,
  Award,
  ArrowRight,
  GitCommit,
  Sparkles,
  Users,
  ExternalLink,
  Shield,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { projectService } from '../services/projectService';
import { moduleService } from '../services/moduleService';
import { verificationService } from '../services/verificationService';
import { profileService } from '../services/profileService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [moduleCount, setModuleCount] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [myProjects, pending, profileData] = await Promise.all([
          projectService.getMyProjects(),
          verificationService.getPendingRequests(user?.userId),
          profileService.getProfile(user?.userId),
        ]);
        setProjects(myProjects || []);
        setPendingRequests(pending || []);
        setProfile(profileData);
        const modules = await Promise.all((myProjects || []).map((project) =>
          moduleService.getModulesByProject(project.projectId)
        ));
        setModuleCount(modules.reduce((total, items) => total + items.length, 0));
        setProjects((myProjects || []).map((project, index) => ({
          ...project,
          moduleCount: modules[index].length,
        })));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    setCreating(true);
    try {
      const created = await projectService.createProject(
        { name: newProjectName.trim(), description: newProjectDesc.trim() },
        user
      );
      setProjects((prev) => [created, ...prev]);
      setNewProjectName('');
      setNewProjectDesc('');
      setCreateModalOpen(false);
    } finally {
      setCreating(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header (Section 9) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {getGreeting()}, {user?.displayName || 'Developer'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here's what's happening across your projects.
          </p>
        </div>

        {/* Quick Actions (Section 9) */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/projects')}
            icon={FolderGit2}
          >
            View Projects
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/verifications')}
            icon={CheckCircle2}
          >
            Review Verifications
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            icon={FolderPlus}
          >
            Create Project
          </Button>
        </div>
      </div>

      {/* Stats Cards (Section 9) */}
      {loading ? (
        <LoadingSkeleton type="stats" count={4} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-medium">Active Projects</span>
            <div className="text-2xl font-bold text-white font-mono">{projects.length}</div>
            <p className="text-[11px] text-slate-500">Collaborative workspaces</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-medium">Modules</span>
            <div className="text-2xl font-bold text-indigo-400 font-mono">{moduleCount}</div>
            <p className="text-[11px] text-slate-500">Milestone work units</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-medium">Verified Contributions</span>
            <div className="text-2xl font-bold text-emerald-400 font-mono">{profile?.verifiedContributionCount || 0}</div>
            <p className="text-[11px] text-emerald-400/80">Sealed with SHA-256 evidence</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-medium">Verified Skills</span>
            <div className="text-2xl font-bold text-amber-400 font-mono">{profile?.skills?.filter((skill) => skill.verified).length || 0}</div>
            <p className="text-[11px] text-slate-500">AST & peer attested</p>
          </div>
        </div>
      )}

      {/* Pending Reviews Alert Banner */}
      {pendingRequests.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-200">
                {pendingRequests.length} Contribution{pendingRequests.length > 1 ? 's' : ''} Awaiting Your Verification
              </p>
              <p className="text-[11px] text-slate-400">
                Audit claimed commit diffs, check substantiveness, and sign off with a cryptographic decision hash.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/verifications')}
            className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold"
          >
            Review Now
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Projects Section (Section 9) - 8 cols */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-indigo-400" />
              Your Projects
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/projects')}
              className="text-xs text-slate-400 hover:text-white"
            >
              All Projects ({projects.length}) →
            </Button>
          </div>

          {loading ? (
            <LoadingSkeleton type="card" count={2} />
          ) : projects.length === 0 ? (
            <EmptyState
              icon={FolderGit2}
              title="No projects yet"
              description="Create your first project to link a repository, assign modules, and verify contributions."
              actionText="Create Project"
              onAction={() => setCreateModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => {
                const pId = proj.projectId || proj.id || proj._id;
                const member = proj.members?.find((m) => m.userId === user?.userId);
                const role = member?.role || 'member';
                const isLeader = role === 'leader';

                return (
                  <Card
                    key={pId}
                    hover
                    onClick={() => navigate(`/projects/${pId}`)}
                    className="flex flex-col justify-between"
                  >
                    <CardHeader
                      action={
                        <Badge variant={isLeader ? 'leader' : 'member'}>
                          {isLeader ? 'Leader' : 'Member'}
                        </Badge>
                      }
                    >
                      <CardTitle className="truncate">{proj.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {proj.description || 'No description provided.'}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3 pt-0">
                      {proj.repositories && proj.repositories[0] && (
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950 p-2 rounded border border-slate-800/80 truncate">
                          <GitCommit className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span className="truncate">
                            {proj.repositories[0].ownerName}/{proj.repositories[0].repositoryName}
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                        <div className="p-2 rounded bg-slate-950/60 border border-slate-800/60">
                          <span className="text-[10px] text-slate-500 block">Members</span>
                          <span className="font-semibold text-slate-200">{proj.members?.length || 1}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-950/60 border border-slate-800/60">
                          <span className="text-[10px] text-slate-500 block">Modules</span>
                          <span className="font-semibold text-slate-200">{proj.moduleCount || 0}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-950/60 border border-slate-800/60">
                          <span className="text-[10px] text-slate-500 block">Repos</span>
                          <span className="font-semibold text-slate-200">{proj.repositories?.length || 1}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Active Workspace
                      </span>
                      <span className="text-indigo-400 text-xs font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Open Project →
                      </span>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity Timeline (Section 9) - 4 cols */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Recent Activity
          </h2>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-500">
            Activity history will appear here after real contributions, assignments, and verification decisions are recorded.
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Project Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Nexus Core — Distributed Event Mesh"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Architecture, domain scope, and key technologies..."
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
            <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Role Model:</strong> You will be designated as <code className="text-amber-300">leader</code> with module creation and member management privileges.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={creating}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Dashboard;

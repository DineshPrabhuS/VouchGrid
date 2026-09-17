import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FolderGit2,
  GitBranch,
  Users,
  Boxes,
  Activity,
  Plus,
  ArrowLeft,
  Shield,
  Trash2,
  UserCheck,
  Lock,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { projectService } from '../services/projectService';
import { moduleService } from '../services/moduleService';
import { authService } from '../services/authService';
import { Button } from '../components/common/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';

export function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [modules, setModules] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview | members | repositories | modules | activity

  // Modals
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [selectedUserToAdd, setSelectedUserToAdd] = useState('');
  const [memberRole, setMemberRole] = useState('member');

  const [createModuleOpen, setCreateModuleOpen] = useState(false);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDesc, setModuleDesc] = useState('');
  const [moduleAssignee, setModuleAssignee] = useState('');

  const [linkRepoOpen, setLinkRepoOpen] = useState(false);
  const [repoOwner, setRepoOwner] = useState('');
  const [repoName, setRepoName] = useState('');

  useEffect(() => {
    async function load() {
      if (!projectId || projectId === 'undefined') {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [proj, mods, usersList] = await Promise.all([
          projectService.getProjectById(projectId),
          moduleService.getModulesByProject(projectId),
          authService.getUsers(),
        ]);
        setProject(proj);
        setModules(mods || []);
        setRegisteredUsers(usersList || []);
        if (proj?.members?.[0]?.githubUsername) {
          setRepoOwner((prev) => prev || proj.members[0].githubUsername);
        }
      } catch (err) {
        console.error('Error loading project details:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [projectId]);

  if (loading) {
    return <LoadingSkeleton type="card" count={3} />;
  }

  if (!project) {
    return (
      <EmptyState
        icon={FolderGit2}
        title="Project not found"
        description="The requested project does not exist or you do not have access."
        actionText="Back to Projects"
        onAction={() => navigate('/projects')}
      />
    );
  }

  const myMembership = project.members?.find((m) => m.userId === user?.userId);
  const isLeader = myMembership?.role === 'leader';

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUserToAdd) return;
    try {
      const added = await projectService.addMember(projectId, { userId: selectedUserToAdd }, memberRole);
      setProject((prev) => ({
        ...prev,
        members: Array.isArray(added) ? added : [...(prev.members || []), added],
      }));
      setAddMemberOpen(false);
      setSelectedUserToAdd('');
    } catch (err) {
      alert(err.message || 'Failed to add member.');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (confirm('Are you sure you want to remove this member from the project?')) {
      try {
        await projectService.removeMember(projectId, userId);
        setProject((prev) => ({
          ...prev,
          members: (prev.members || []).filter((m) => m.userId !== userId),
        }));
      } catch (err) {
        alert(err.message || 'Failed to remove member.');
      }
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await projectService.changeMemberRole(projectId, userId, newRole);
      setProject((prev) => ({
        ...prev,
        members: (prev.members || []).map((m) => (m.userId === userId ? { ...m, role: newRole } : m)),
      }));
    } catch (err) {
      alert(err.message || 'Failed to change role.');
    }
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!moduleTitle.trim()) return;
    try {
      const created = await moduleService.createModule(
        projectId,
        { title: moduleTitle.trim(), description: moduleDesc.trim() }
      );
      if (moduleAssignee && created?.moduleId) {
        try {
          await moduleService.assignModule(projectId, created.moduleId, moduleAssignee);
        } catch (assignErr) {
          console.error('Assign module warning:', assignErr);
        }
      }
      setModules((prev) => [...prev, created]);
      setModuleTitle('');
      setModuleDesc('');
      setModuleAssignee('');
      setCreateModuleOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to create module.');
    }
  };

  const handleLinkRepo = async (e) => {
    e.preventDefault();
    if (!repoName.trim()) return;
    const defaultOwner = repoOwner.trim() || user?.githubUsername || project.members?.[0]?.githubUsername || 'vouchgrid';
    try {
      const newRepo = await projectService.linkRepository(projectId, {
        provider: 'github', ownerName: defaultOwner, repositoryName: repoName.trim(),
      });
      try {
        await projectService.syncGithub(projectId);
      } catch (syncErr) {
        console.error('GitHub sync warning:', syncErr);
      }
      setProject((prev) => ({ ...prev, repositories: [...(prev.repositories || []), newRepo] }));
      setLinkRepoOpen(false);
      setRepoName('');
    } catch (err) {
      alert(err.message || 'Failed to link repository.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Breadcrumb */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Projects
        </Link>
      </div>

      {/* Project Header (Section 11) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-white">{project.name}</h1>
            <Badge variant={isLeader ? 'leader' : 'member'}>
              {isLeader ? '👑 Leader' : '👤 Member'}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Action button based on leader status */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLinkRepoOpen(true)}
            icon={GitBranch}
          >
            Link Repository
          </Button>

          {isLeader ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCreateModuleOpen(true)}
              icon={Plus}
            >
              Create Module
            </Button>
          ) : (
            <div
              title="Only leaders can create modules per the role model"
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-500 flex items-center gap-1.5 cursor-not-allowed"
            >
              <Lock className="w-3.5 h-3.5" />
              Leader Action
            </div>
          )}
        </div>
      </div>

      {/* Tabs (Section 11: Overview, Members, Repositories, Modules, Activity) */}
      <div className="flex items-center gap-1 border-b border-slate-800/80 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: FolderGit2 },
          { id: 'members', label: `Members (${project.members?.length || 0})`, icon: Users },
          { id: 'repositories', label: `Repositories (${project.repositories?.length || 0})`, icon: GitBranch },
          { id: 'modules', label: `Modules (${modules.length})`, icon: Boxes },
          { id: 'activity', label: 'Activity', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 space-y-4">
            <CardHeader>
              <CardTitle>About this Project</CardTitle>
              <CardDescription>Mission, domain scope, and verifiable deliverables.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <p>{project.description}</p>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  VouchGrid Verification Rules
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
                  <li>Contributions are peer-reviewed by active project members.</li>
                  <li>Authors are strictly barred from verifying their own work.</li>
                  <li>Every approval computes an immutable SHA-256 decision hash.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="space-y-4">
            <CardHeader>
              <CardTitle>Quick Specs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Your Role</span>
                <Badge variant={isLeader ? 'leader' : 'member'}>{isLeader ? 'Leader' : 'Member'}</Badge>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Total Members</span>
                <span className="text-slate-200 font-mono font-semibold">{project.members?.length || 1}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Active Modules</span>
                <span className="text-slate-200 font-mono font-semibold">{modules.length}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Primary Provider</span>
                <span className="text-slate-200 font-mono">GitHub</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Members (Section 11) */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Project Members</h3>
              <p className="text-xs text-slate-400">Restricted role model: leader or member only.</p>
            </div>
            {isLeader && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddMemberOpen(true)}
                icon={Plus}
              >
                Add Member
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.members?.map((m) => {
              const isMe = m.userId === user?.userId;
              return (
                <Card key={m.userId} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200">
                      {m.displayName?.charAt(0) || m.githubUsername?.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        {m.displayName}
                        {isMe && <span className="text-[10px] text-indigo-400">(You)</span>}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">@{m.githubUsername}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={m.role === 'leader' ? 'leader' : 'member'}>
                      {m.role === 'leader' ? 'Leader' : 'Member'}
                    </Badge>

                    {/* Leader actions: change role, remove member (Section 11) */}
                    {isLeader && !isMe && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleChangeRole(m.userId, m.role === 'leader' ? 'member' : 'leader')}
                          title={m.role === 'leader' ? 'Demote to Member' : 'Promote to Leader'}
                          className="p-1 rounded text-slate-500 hover:text-indigo-400 hover:bg-slate-800 cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemoveMember(m.userId)}
                          title="Remove Member"
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Repositories (Section 11) */}
      {activeTab === 'repositories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Linked GitHub Repositories</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLinkRepoOpen(true)}
              icon={Plus}
            >
              Link Repository
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.repositories?.map((repo) => (
              <Card key={repo.repositoryId} className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-indigo-400" />
                    <span className="font-mono text-xs font-semibold text-white">
                      {repo.ownerName}/{repo.repositoryName}
                    </span>
                  </div>
                  <Badge variant="verified">Connected</Badge>
                </div>
                <div className="text-[11px] text-slate-400 font-mono space-y-1">
                  <div>Provider: {repo.provider || 'github'}</div>
                  <div>Default Branch: {repo.defaultBranch || 'main'}</div>
                  <div>Last Synced: {repo.lastSynced ? new Date(repo.lastSynced).toLocaleTimeString() : 'Just now'}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Modules (Section 11) */}
      {activeTab === 'modules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Work Units & Milestones</h3>
            {isLeader && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCreateModuleOpen(true)}
                icon={Plus}
              >
                Create Module
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((mod) => (
              <Card
                key={mod.moduleId}
                hover
                onClick={() => navigate(`/projects/${projectId}/modules/${mod.moduleId}`)}
                className="p-5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-white hover:text-indigo-300 transition-colors">
                      {mod.title}
                    </h4>
                    <StatusBadge status={mod.status} />
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{mod.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                  <span>Assignee: {mod.assignedTo ? 'Assigned' : 'Unassigned'}</span>
                  <span className="text-indigo-400 font-medium">Open Module →</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Activity Log */}
      {activeTab === 'activity' && (
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Project Activity Ledger
          </h3>
          <p className="text-xs text-slate-400">
            Immutable chronological record of milestone changes and peer verifications.
          </p>
          <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 text-center text-xs text-slate-500">
            No activity recorded yet for this project. Activity will appear when modules are assigned or contributions are verified.
          </div>
        </Card>
      )}

      {/* Add Member Modal */}
      <Modal
        isOpen={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        title="Add Project Member (Leader Only)"
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Select Registered User
            </label>
            <select
              required
              value={selectedUserToAdd}
              onChange={(e) => setSelectedUserToAdd(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select a registered developer...</option>
              {registeredUsers
                .filter((u) => u.userId && !project.members?.some((m) => m.userId === u.userId))
                .map((u) => (
                  <option key={u.userId} value={u.userId}>
                    {u.displayName || u.githubUsername} (@{u.githubUsername})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Designate Role (leader or member)
            </label>
            <select
              value={memberRole}
              onChange={(e) => setMemberRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="member">Member (Can claim work & verify peers)</option>
              <option value="leader">Leader (Can manage project & assign modules)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setAddMemberOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Add Member
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Module Modal */}
      <Modal
        isOpen={createModuleOpen}
        onClose={() => setCreateModuleOpen(false)}
        title="Create Work Module (Leader Only)"
      >
        <form onSubmit={handleCreateModule} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Module Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Lock Provider with Redis Redlock"
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Detail deliverables and code scope..."
              value={moduleDesc}
              onChange={(e) => setModuleDesc(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Assignee
            </label>
            <select
              value={moduleAssignee}
              onChange={(e) => setModuleAssignee(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Leave Unassigned</option>
              {project.members?.map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.displayName || m.githubUsername} (@{m.githubUsername}) - {m.role}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setCreateModuleOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create Module
            </Button>
          </div>
        </form>
      </Modal>

      {/* Link Repo Modal */}
      <Modal
        isOpen={linkRepoOpen}
        onClose={() => setLinkRepoOpen(false)}
        title="Link GitHub Repository"
      >
        <form onSubmit={handleLinkRepo} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              GitHub Owner Name <span className="text-slate-500">(Defaults to Leader Username)</span>
            </label>
            <input
              type="text"
              placeholder={user?.githubUsername || project.members?.[0]?.githubUsername || 'vouchgrid'}
              value={repoOwner}
              onChange={(e) => setRepoOwner(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Repository Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. vouchgrid-backend"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setLinkRepoOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Link Repository
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ProjectDetail;

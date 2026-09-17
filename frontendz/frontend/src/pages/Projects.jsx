import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  FolderPlus,
  Users,
  Boxes,
  GitBranch,
  Shield,
  ArrowRight,
  Clock,
  Plus,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { projectService } from '../services/projectService';
import { moduleService } from '../services/moduleService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';

export function Projects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await projectService.getMyProjects();
        const list = data || [];
        const modulesPerProject = await Promise.all(
          list.map((p) => moduleService.getModulesByProject(p.projectId || p.id || p._id))
        );
        const enriched = list.map((p, idx) => ({
          ...p,
          moduleCount: (modulesPerProject[idx] || []).length,
        }));
        setProjects(enriched);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const created = await projectService.createProject(
        { name: name.trim(), description: description.trim() },
        user
      );
      setProjects((prev) => [created, ...prev]);
      setName('');
      setDescription('');
      setCreateModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FolderGit2 className="w-6 h-6 text-indigo-400" />
            Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Role-governed workspaces linking GitHub repos to verifiable units of work.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setCreateModalOpen(true)}
          icon={FolderPlus}
        >
          Create Project
        </Button>
      </div>

      {/* Projects Grid (Section 10) */}
      {loading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No projects yet"
          description="Create a project to connect GitHub repositories, assign modules, and verify peer contributions."
          actionText="Create First Project"
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => {
            const pId = proj.projectId || proj.id || proj._id;
            const memberRecord = proj.members?.find((m) => m.userId === user?.userId);
            // Strict role restriction per Section 10: ONLY 'leader' or 'member'
            const role = memberRecord?.role === 'leader' ? 'leader' : 'member';
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
                      {isLeader ? '👑 Leader' : '👤 Member'}
                    </Badge>
                  }
                >
                  <CardTitle>{proj.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {proj.description || 'No description provided.'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  {proj.repositories && proj.repositories[0] && (
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950 p-2 rounded border border-slate-800/80 truncate">
                      <GitBranch className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">
                        {proj.repositories[0].ownerName}/{proj.repositories[0].repositoryName}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded bg-slate-950/60 border border-slate-800/60">
                      <span className="text-[10px] text-slate-500 block">Members</span>
                      <span className="font-semibold text-slate-200">{proj.members?.length || 1}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950/60 border border-slate-800/60">
                      <span className="text-[10px] text-slate-500 block">Modules</span>
                      <span className="font-semibold text-slate-200">{proj.moduleCount || 0}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950/60 border border-slate-800/60">
                      <span className="text-[10px] text-slate-500 block">Repositories</span>
                      <span className="font-semibold text-slate-200">{proj.repositories?.length || 0}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-600" />
                    Active Workspace
                  </span>
                  <span className="text-indigo-400 text-xs font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    View Project <ArrowRight className="w-3 h-3" />
                  </span>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Project Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Nexus Core — Distributed Event Mesh"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Detail the repository scope and architecture..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
            <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Role Model (Section 10):</strong> As creator, you will receive the <code className="text-amber-300 font-mono">leader</code> role. Other collaborators default to <code className="text-blue-300 font-mono">member</code>.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={submitting}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Projects;

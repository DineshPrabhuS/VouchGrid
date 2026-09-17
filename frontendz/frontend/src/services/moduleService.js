import api from './api';

export const moduleService = {
  async getModulesByProject(projectId) {
    try {
      const response = await api.get(`/projects/${projectId}/modules`);
      return response.data || [];
    } catch {
      return [];
    }
  },
  async getModuleById(moduleId, projectId) {
    const modules = await this.getModulesByProject(projectId);
    const module = modules.find((item) => (item.moduleId || item.id || item._id) === moduleId);
    if (!module) throw new Error('Module not found.');
    return module;
  },
  async createModule(projectId, { title, description }) {
    const response = await api.post(`/projects/${projectId}/modules`, { title, description });
    return response.data;
  },
  async assignModule(projectId, moduleId, userId) {
    const response = await api.post(`/projects/${projectId}/modules/${moduleId}/assign`, { userId });
    return response.data;
  },
  async syncRepository(projectId) {
    const response = await api.post(`/github/sync/${projectId}`);
    return response.data;
  },
  async getCommits(projectId) {
    try {
      const response = await api.get(`/github/projects/${projectId}/commits`);
      return response.data || [];
    } catch {
      return [];
    }
  },
  suggestSkills() {
    return [];
  },
};

export default moduleService;

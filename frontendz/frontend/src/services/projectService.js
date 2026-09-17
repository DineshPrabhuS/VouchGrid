import api from './api';

export const projectService = {
  async getMyProjects() {
    const response = await api.get('/projects');
    return response.data;
  },
  async getProjectById(projectId) {
    const response = await api.get(`/projects/${projectId}`);
    let members = [];
    let repositories = [];
    try {
      const results = await Promise.allSettled([
        api.get(`/projects/${projectId}/members`),
        api.get(`/projects/${projectId}/repositories`),
      ]);
      if (results[0].status === 'fulfilled') {
        members = results[0].value.data || [];
      }
      if (results[1].status === 'fulfilled') {
        repositories = results[1].value.data || [];
      }
    } catch {
      // Sub-resource fetch errors should not prevent returning project data
    }
    return { ...response.data, members, repositories };
  },
  async createProject({ name, description }) {
    const response = await api.post('/projects', { name, description });
    return response.data;
  },
  async addMember(projectId, userToAdd, role = 'member') {
    const response = await api.post(`/projects/${projectId}/members`, { userId: userToAdd.userId, role });
    return response.data;
  },
  async changeMemberRole(projectId, userId, role) {
    const response = await api.put(`/projects/${projectId}/members/${userId}/role`, { role });
    return response.data;
  },
  async removeMember(projectId, userId) {
    await api.delete(`/projects/${projectId}/members/${userId}`);
    return { success: true };
  },
  async linkRepository(projectId, { provider = 'github', ownerName, repositoryName }) {
    const response = await api.post(`/projects/${projectId}/link-repository`, { provider, ownerName, repositoryName });
    return response.data;
  },
  async syncGithub(projectId) {
    const response = await api.post(`/github/sync/${projectId}`);
    return response.data;
  },
};

export default projectService;

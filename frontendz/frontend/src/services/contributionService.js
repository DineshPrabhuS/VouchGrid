import api from './api';

export const contributionService = {
  async getContributions(projectId) {
    try {
      if (projectId) {
        const response = await api.get(`/projects/${projectId}/contributions`);
        return response.data || [];
      }
      const response = await api.get('/contributions/me');
      return response.data || [];
    } catch {
      return [];
    }
  },
  async getContributionById(contributionId) {
    try {
      const response = await api.get(`/contributions/${contributionId}/verification`);
      return response.data;
    } catch {
      return null;
    }
  },
  async submitContribution({ moduleId, projectId, title, summary, claimedCommitShas, provider = 'github', ownerName = 'vouchgrid', repositoryName = 'vouchgrid-core' }) {
    const sha = Array.isArray(claimedCommitShas) && claimedCommitShas.length > 0 ? claimedCommitShas[0] : 'main-commit-sha';
    const response = await api.post(`/projects/${projectId}/contributions`, {
      moduleId: moduleId || null,
      provider: provider || 'github',
      ownerName: ownerName || 'vouchgrid',
      repositoryName: repositoryName || 'vouchgrid-core',
      commitSha: sha,
      title: title || 'Code Contribution',
      evidence: summary || title || 'Contribution evidence',
    });
    return response.data;
  },
};

export default contributionService;

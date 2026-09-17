import api from './api';

export const verificationService = {
  async request(contributionId, verifierUserId = null) {
    const response = await api.post(`/contributions/${contributionId}/verification`, { verifierUserId });
    return response.data;
  },
  async getPendingRequests() {
    try {
      const response = await api.get('/verifications/pending');
      return response.data || [];
    } catch {
      return [];
    }
  },
  async getCompletedReviews() {
    try {
      const response = await api.get('/verifications/completed');
      return response.data || [];
    } catch {
      return [];
    }
  },
  async approve(verificationId, _verifierUser, comment = 'Approved peer contribution.') {
    const response = await api.post(`/verifications/${verificationId}/approve`, {
      comment: comment || 'Approved peer contribution.',
    });
    return response.data;
  },
  async reject(verificationId, _verifierUser, { reasonCategory = 'QUALITATIVE_INSUFFICIENCY', comment = 'Contribution requires revision.' } = {}) {
    const response = await api.post(`/verifications/${verificationId}/reject`, {
      rejectionReason: reasonCategory,
      comment: comment || 'Contribution requires revision.',
    });
    return response.data;
  },
  async getForContribution(contributionId) {
    try {
      const response = await api.get(`/contributions/${contributionId}/verification`);
      return response.data;
    } catch {
      return null;
    }
  },
};

export default verificationService;

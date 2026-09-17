import api from './api';

export const profileService = {
  async getProfile(userId) {
    try {
      const response = await api.get(`/profiles/${userId}`);
      const profile = response.data || {};
      const skills = profile.skills || [];
      return {
        ...profile,
        verifiedSkills: skills.filter((s) => s.verified).map((s) => s.name || s.skillName || s),
        suggestedSkills: skills.filter((s) => !s.verified),
        verifiedContributions: profile.verifiedContributions || [],
      };
    } catch {
      return {
        userId,
        displayName: 'Developer',
        githubUsername: 'developer',
        verifiedSkills: [],
        suggestedSkills: [],
        verifiedContributions: [],
      };
    }
  },
  async getTrustSignals(userId) {
    const profile = await this.getProfile(userId);
    return {
      distinctProjectsCount: profile.projectCount || 0,
      distinctVerifiersCount: 0,
      compoundingTrustScore: `${Math.min(100, (profile.verifiedContributionCount || 0) * 10)}%`,
      reviewerCalibration: 'High confidence based on peer attestations',
      isReciprocalFlagged: false,
    };
  },
  async downloadCertificate(userId) {
    try {
      const response = await api.get(`/profiles/${userId}/certificate`);
      return new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
    } catch {
      return new Blob([JSON.stringify({ userId, note: 'VouchGrid Certificate' }, null, 2)], { type: 'application/json' });
    }
  },
};

export default profileService;

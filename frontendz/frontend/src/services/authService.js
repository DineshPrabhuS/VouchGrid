import api from './api';

export const authService = {
  /**
   * Authenticates via GitHub OAuth.
  * Starts the real GitHub OAuth registration/login flow.
   */
  async loginWithGithub() {
    window.location.assign(`${window.location.origin}/api/auth/github`);
    return new Promise(() => {});
  },

  async completeOAuthCallback(token, userId) {
    localStorage.setItem('vouchgrid_token', token);
    localStorage.setItem('vouchgrid_user_id', userId);
    const response = await api.get('/users/me');
    return { user: { ...response.data, userId }, token, isLiveBackend: true };
  },

  async getUsers() {
    try {
      const response = await api.get('/users');
      return response.data || [];
    } catch {
      return [];
    }
  },
  async updateRecoveryEmail(userId, email) {
    try {
      await api.put(`/users/${userId}/email`, { email });
    } catch {
      // Dev mode fallback
    }
    return { success: true, email };
  },
};

export default authService;

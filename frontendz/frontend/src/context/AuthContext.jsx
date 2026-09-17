import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const oauthToken = params.get('token');
    const oauthUserId = params.get('userId');
    if (oauthToken && oauthUserId) {
      authService.completeOAuthCallback(oauthToken, oauthUserId)
        .then((result) => {
          setUser(result.user);
          setToken(result.token);
          setIsLiveBackend(true);
          localStorage.setItem('vouchgrid_user', JSON.stringify(result.user));
          window.history.replaceState({}, '', window.location.pathname);
        })
        .catch(() => {
          localStorage.removeItem('vouchgrid_token');
          localStorage.removeItem('vouchgrid_user_id');
        })
        .finally(() => setLoading(false));
      return undefined;
    }
    // Session restoration from localStorage
    const savedToken = localStorage.getItem('vouchgrid_token');
    const savedUser = localStorage.getItem('vouchgrid_user');

    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setToken(savedToken);
      } catch {
        localStorage.removeItem('vouchgrid_token');
        localStorage.removeItem('vouchgrid_user');
      }
    }
    // Newcomer begins unauthenticated: user = null, token = null
    setLoading(false);

    // Listen for global 401 unauthorized events from Axios interceptor
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('vouchgrid_token');
      localStorage.removeItem('vouchgrid_user');
    };

    window.addEventListener('vouchgrid:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('vouchgrid:unauthorized', handleUnauthorized);
  }, []);

  /**
   * Authentic GitHub OAuth login.
  * Starts the GitHub OAuth flow handled by the backend.
   * No manual username entry, no role picker, no fake demo users.
   */
  const loginWithGithub = async () => {
    setLoading(true);
    try {
      const res = await authService.loginWithGithub();
      setUser(res.user);
      setToken(res.token);
      setIsLiveBackend(res.isLiveBackend);
      localStorage.setItem('vouchgrid_token', res.token);
      localStorage.setItem('vouchgrid_user', JSON.stringify(res.user));

      // Optional recovery email capture if none set
      if (!res.user.email) {
        setShowEmailModal(true);
      }
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('vouchgrid_token');
    localStorage.removeItem('vouchgrid_user');
  };

  const saveRecoveryEmail = async (email) => {
    if (!user) return;
    await authService.updateRecoveryEmail(user.userId, email);
    const updatedUser = { ...user, email };
    setUser(updatedUser);
    localStorage.setItem('vouchgrid_user', JSON.stringify(updatedUser));
    setShowEmailModal(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        loading,
        isLiveBackend,
        loginWithGithub,
        logout,
        showEmailModal,
        setShowEmailModal,
        saveRecoveryEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

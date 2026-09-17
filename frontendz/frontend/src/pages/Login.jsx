import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  CheckCircle2,
  Lock,
  GitBranch,
  Award,
  Sparkles,
  ArrowRight,
  Fingerprint,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GithubIcon } from '../components/common/GithubIcon';

export function Login() {
  const { loginWithGithub, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loggingIn, setLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already authenticated, redirect directly to dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleContinueWithGithub = async () => {
    setLoggingIn(true);
    setErrorMessage('');
    try {
      await loginWithGithub();
      navigate('/dashboard');
    } catch (err) {
      console.error('GitHub authentication failed:', err);
      setErrorMessage(err.message || 'GitHub authentication could not be completed. Please try again.');
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* SaaS Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-emerald-400 p-[1.5px]">
                <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <span className="font-bold text-base tracking-tight text-white">VouchGrid</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs text-slate-400 font-medium">
              <Link to="/#features" className="hover:text-slate-200 transition-colors">Features</Link>
              <Link to="/#how-it-works" className="hover:text-slate-200 transition-colors">How It Works</Link>
              <Link to="/#for-students" className="hover:text-slate-200 transition-colors">For Students</Link>
              <Link to="/#for-recruiters" className="hover:text-slate-200 transition-colors">For Recruiters</Link>
              <Link to="/#faqs" className="hover:text-slate-200 transition-colors">FAQs</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleContinueWithGithub}
              disabled={loggingIn}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main SaaS Hero & Login Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          {/* Left Column: Hero Copy & Feature Highlights */}
          <div className="lg:col-span-7 space-y-8">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-semibold tracking-wider">
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GITHUB-POWERED</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-1">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
                Build.<br />
                Verify.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-200 to-emerald-400">
                  Vouch.
                </span>
              </h1>
            </div>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
              Turn your GitHub contributions into trusted, verifiable proof of your skills.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-4 pt-2 max-w-lg">
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <GithubIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    GitHub-backed identity
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sign in securely using your GitHub account.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Verified contributions
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Build trustworthy proof from real work.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Shareable profile
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Showcase your verified skills and contributions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Premium Login Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-6">
              {/* Subtle Ambient Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Login Card Header */}
              <div className="space-y-2 relative">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="font-bold text-sm text-slate-200 tracking-tight">VouchGrid</span>
                </div>

                <h2 className="text-2xl font-extrabold text-white tracking-tight pt-2">
                  Welcome to VouchGrid
                </h2>
                <p className="text-xs text-slate-400">
                  Use your GitHub account to get started.
                </p>
              </div>

              {/* Error Alert if any */}
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300">
                  {errorMessage}
                </div>
              )}

              {/* Primary Action Button */}
              <div className="space-y-4 pt-2 relative">
                <button
                  type="button"
                  id="btn-continue-github"
                  onClick={handleContinueWithGithub}
                  disabled={loggingIn}
                  className="w-full h-12 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 hover:border-indigo-500/60 flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/10 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <GithubIcon className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  <span>{loggingIn ? 'Connecting to GitHub...' : 'Continue with GitHub'}</span>
                </button>

                {/* Footnote Copy (Exact Spec) */}
                <div className="text-center space-y-1 pt-1">
                  <p className="text-xs text-slate-400 font-medium">
                    No password required.
                  </p>
                  <p className="text-xs text-slate-500">
                    Your GitHub account is your identity.
                  </p>
                </div>
              </div>

              {/* Trust & Security Badge */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Protected by GitHub OAuth & SHA-256 Ledger</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;

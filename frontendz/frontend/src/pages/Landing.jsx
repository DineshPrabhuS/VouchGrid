import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  CheckCircle2,
  Lock,
  ArrowRight,
  GitBranch,
  Users,
  Award,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Code2,
  Fingerprint,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { GithubIcon } from '../components/common/GithubIcon';
import { useAuth } from '../context/AuthContext';

export function Landing() {
  const { loginWithGithub, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loggingIn, setLoggingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleContinueWithGithub = async () => {
    setLoggingIn(true);
    setErrorMsg('');
    try {
      await loginWithGithub();
      navigate('/dashboard');
    } catch (err) {
      console.error('GitHub authentication failed:', err);
      setErrorMsg(err.message || 'GitHub authentication could not be completed.');
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Public Navbar (Section 6) */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-emerald-400 p-[1.5px]">
                <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <span className="font-bold text-base tracking-tight text-white">VouchGrid</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs text-slate-400 font-medium">
              <a href="#features" className="hover:text-slate-200 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-slate-200 transition-colors">How It Works</a>
              <a href="#for-students" className="hover:text-slate-200 transition-colors">For Students</a>
              <a href="#for-recruiters" className="hover:text-slate-200 transition-colors">For Recruiters</a>
              <a href="#faqs" className="hover:text-slate-200 transition-colors">FAQs</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/verify/contrib-901')}
              icon={ExternalLink}
            >
              Public Proof
            </Button>
            <button
              onClick={handleContinueWithGithub}
              disabled={loggingIn}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>{loggingIn ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section (Section 6) */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-semibold tracking-wider">
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GITHUB-POWERED</span>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                  Build. Verify. Vouch.
                </h1>
                <p className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-100 to-emerald-300">
                  Verifiable Developer Collaboration & Proof of Contribution.
                </p>
              </div>

              {/* Subheading */}
              <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
                Turn your GitHub contributions into trusted, verifiable proof of your skills.
                Connect repositories, analyze commits, and earn peer-attested proof certificates backed by SHA-256 cryptographic hashes.
              </p>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <GithubIcon className="w-3.5 h-3.5 text-indigo-400" />
                    GitHub-Backed Identity
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Sign in securely using your GitHub account.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Contributions
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Build trustworthy proof from real work.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    Shareable Profile
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Showcase your verified skills and contributions.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Direct Login Card */}
            <div className="lg:col-span-5">
              <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">VouchGrid</h3>
                    <p className="text-xs text-slate-400">Welcome to VouchGrid</p>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-xs text-slate-300">
                    Use your GitHub account to get started.
                  </p>

                  <button
                    type="button"
                    onClick={handleContinueWithGithub}
                    disabled={loggingIn}
                    className="w-full h-12 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 hover:border-indigo-500/60 flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/10 active:scale-[0.99] disabled:opacity-50"
                  >
                    <GithubIcon className="w-5 h-5 text-white" />
                    <span>{loggingIn ? 'Connecting to GitHub...' : 'Continue with GitHub'}</span>
                  </button>

                  <div className="text-center space-y-0.5 pt-1">
                    <p className="text-xs text-slate-400 font-medium">No password required.</p>
                    <p className="text-xs text-slate-500">Your GitHub account is your identity.</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Join real developer projects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Get your work verified by peers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Build your immutable engineering reputation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section (Section 6) */}
      <section className="py-12 border-y border-slate-900 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">10K+</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Developers</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 font-mono">2K+</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Projects</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">50K+</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Verified Contributions</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono">100+</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Hiring Partners</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;

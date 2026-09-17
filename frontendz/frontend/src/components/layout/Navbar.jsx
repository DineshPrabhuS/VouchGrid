import React, { useState } from 'react';
import { Menu, Search, Shield, ChevronDown, User, LogOut, GitBranch, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NotificationDropdown } from '../notifications/NotificationDropdown';

export function Navbar({ onMenuClick }) {
  const { user, logout, isLiveBackend } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Hamburger & Search */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 lg:hidden"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Quick Search */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 w-64 focus-within:border-indigo-500/60 focus-within:ring-1 focus-within:ring-indigo-500/60 transition-all">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search projects, modules, commits..."
              className="bg-transparent border-0 focus:outline-none text-slate-200 placeholder:text-slate-500 text-xs w-full"
            />
          </div>
        </div>

        {/* Right: Notifications, Live indicator, User avatar & Name */}
        <div className="flex items-center gap-3">
          {/* Live Backend status badge */}
          <div
            title={
              isLiveBackend
                ? 'Connected to Spring Boot API'
                : 'Interactive developer demo mode'
            }
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isLiveBackend ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'
              }`}
            />
            <span>{isLiveBackend ? 'Live: Spring Boot' : 'VouchGrid Core'}</span>
          </div>

          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* User Profile & Persona Switcher */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1 sm:px-2.5 py-1 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all text-left cursor-pointer"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.displayName}
                  className="w-7 h-7 rounded-full object-cover border border-slate-700"
                />
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-slate-200 leading-none">
                    {user.displayName}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    @{user.githubUsername}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-500 hidden sm:block" />
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-fade-in"
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <div className="px-3.5 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-slate-200">
                      {user.displayName}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      @{user.githubUsername}
                    </p>
                  </div>

                  <div className="p-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors text-left"
                    >
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      View Public Profile
                    </button>
                    <a
                      href={`https://github.com/${user.githubUsername}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors text-left"
                    >
                      <span className="flex items-center gap-2">
                        <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                        GitHub Profile
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  </div>

                  <div className="mt-1 pt-1 border-t border-slate-800 px-1">
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

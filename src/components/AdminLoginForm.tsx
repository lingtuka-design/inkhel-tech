import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { loginAdmin } from '../lib/auth';

interface AdminLoginFormProps {
  onSuccess: () => void;
  title?: string;
  subtitle?: string;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  onSuccess,
  title = 'Inkhel Tech Admin',
  subtitle = 'Sign in with your administrator credentials to continue',
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    const success = loginAdmin(username, password);
    if (success) {
      onSuccess();
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 shadow-2xl transition-all">
        {/* Logo / Badge */}
        <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/25 text-accent flex items-center justify-center mx-auto mb-5 shadow-sm">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white text-center tracking-tight mb-1.5">
          {title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-[#8b949e] text-center mb-6 max-w-xs mx-auto">
          {subtitle}
        </p>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 text-xs font-semibold text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-[#8b949e] mb-1.5">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                autoFocus
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-[#8b949e] mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-slate-950 font-black text-sm tracking-wide transition-all shadow-md active:scale-[0.99]"
          >
            Sign In to Dashboard
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10 text-center">
          <Link
            to="/"
            className="text-xs text-slate-500 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
};

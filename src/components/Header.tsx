import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Search, Menu, X, Sun, Moon, Sparkles, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onSearchClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toggleTheme, isDark } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors duration-150">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="flex items-center gap-2 group transition-opacity hover:opacity-90"
          >
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-slate-950 font-black text-sm shadow-sm tracking-tight">
              iT
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-tight text-xl sm:text-2xl text-slate-900 dark:text-white font-sans flex items-center">
                <span className="text-accent">i</span>TECH
              </span>
            </div>
          </Link>

          {/* Network Navigation (Desktop) */}
          <nav className="hidden md:flex items-center space-x-2 pl-4 border-l border-slate-200 dark:border-white/10">
            <a
              href="https://news.inkhel.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200/80 dark:border-white/5 rounded-full transition-all duration-150"
            >
              <span>⚽</span> Inkhel News
            </a>
            <a
              href="https://quiz.inkhel.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200/80 dark:border-white/5 rounded-full transition-all duration-150"
            >
              <span>🎯</span> Inkhel Quiz
            </a>
          </nav>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          {/* Quick Search Button */}
          {onSearchClick && (
            <button
              onClick={onSearchClick}
              aria-label="Search articles"
              className="p-2 text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          {/* Admin Panel Direct Link */}
          <Link
            to="/admin"
            title="Admin Panel"
            className="p-2 text-slate-600 dark:text-[#8b949e] hover:text-accent hover:bg-slate-100 dark:hover:bg-white/[0.06] rounded-lg transition-colors"
          >
            <Lock className="w-4 h-4" />
          </Link>

          {/* Theme Toggle Button (Desktop & Mobile) */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle light/dark theme"
            className="p-2 rounded-lg text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors border border-slate-200 dark:border-white/10"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <Sun className="w-5 h-5 fill-amber-400/20" />
            ) : (
              <Moon className="w-5 h-5 fill-slate-700/20" />
            )}
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1117] px-4 py-4 space-y-4 animate-in fade-in duration-150 shadow-lg">
          {/* Mobile Theme Switch Button */}
          <button
            onClick={() => {
              toggleTheme();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-[#161b22] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white"
          >
            <span className="flex items-center gap-2">
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              <span>{isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}</span>
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-accent/20 text-accent font-bold uppercase">
              {isDark ? 'Dark Active' : 'Light Active'}
            </span>
          </button>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
              Inkhel Network
            </span>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="https://news.inkhel.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 text-xs font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-200 dark:hover:bg-white/[0.08]"
              >
                <span>⚽</span> Inkhel News
              </a>
              <a
                href="https://quiz.inkhel.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 text-xs font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-200 dark:hover:bg-white/[0.08]"
              >
                <span>🎯</span> Inkhel Quiz
              </a>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Independent Tech Publication</span>
            <span className="flex items-center gap-1 text-accent font-medium">
              <Sparkles className="w-3.5 h-3.5" /> tech.inkhel.com
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

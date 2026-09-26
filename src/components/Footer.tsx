import React from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowUp, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCategories } from '../data/postsStore';

interface FooterProps {
  onCategorySelect?: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onCategorySelect }) => {
  const { toggleTheme, isDark } = useTheme();
  const { categories } = useCategories();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#090d13] text-slate-600 dark:text-[#8b949e] pt-12 pb-16 transition-colors duration-150">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-200/80 dark:border-white/10">
          
          {/* Brand Col */}
          <div className="md:col-span-6 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-slate-950 font-black text-xs shadow-sm tracking-tight">
                iT
              </div>
              <span className="font-black tracking-tight text-xl text-slate-900 dark:text-white font-sans">
                <span className="text-accent">i</span>TECH
              </span>
            </Link>

            <p className="text-sm text-slate-600 dark:text-[#8b949e] max-w-sm leading-relaxed">
              Technology, gadgets, buying guides, and useful tech updates for readers in Mizoram and across India.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-[#8b949e]">
              <span>Domain: <strong className="text-slate-800 dark:text-slate-200 font-mono">tech.inkhel.com</strong></span>
              <span>•</span>
              <span className="text-accent font-medium">Part of Inkhel Network</span>
            </div>
          </div>

          {/* Editorial Categories Col */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Categories</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-[#8b949e]">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to="/"
                    search={{ category: cat }}
                    onClick={() => onCategorySelect?.(cat)}
                    className="hover:text-accent transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / Publication Col */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Publication</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-[#8b949e]">
              <li>
                <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <a href="#about" onClick={(e) => { e.preventDefault(); alert("iTECH is an independent tech publication providing trusted consumer electronics reviews."); }} className="hover:text-slate-900 dark:hover:text-white transition-colors">About</a>
              </li>
              <li>
                <a href="mailto:contact@inkhel.com" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</a>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Privacy Policy: iTECH respects your privacy. We use standard analytics and affiliate partner tracking without collecting personal identifiers."); }} className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms of Service: All content copyright 2026 iTECH. Reviews and test findings are independent."); }} className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</a>
              </li>
              <li>
                <Link to="/admin" className="text-accent hover:underline transition-colors flex items-center gap-1 font-medium">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-[#8b949e]">
          <div>
            © 2026 <strong className="text-slate-700 dark:text-slate-300">iTECH</strong> (tech.inkhel.com). All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button in Footer */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:text-accent transition-colors shadow-sm"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
              <span>{isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}</span>
            </button>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors py-1.5 px-2.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/[0.04]"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

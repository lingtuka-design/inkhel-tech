import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { usePosts } from '../data/postsStore';
import { checkIsAuthenticated, logoutAdmin, getLoggedInUser } from '../lib/auth';
import { AdminLoginForm } from '../components/AdminLoginForm';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  LogOut,
  Copy,
  Check,
  ShoppingBag,
  ShoppingCart,
  FileText,
  User,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { posts, deletePost, resetToDefault } = usePosts();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => checkIsAuthenticated());
  const [copiedCode, setCopiedCode] = useState(false);

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
  };

  const handleExportPosts = () => {
    const code = `export const POSTS = ${JSON.stringify(posts, null, 2)};`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // 1. Username & Password Login Screen
  if (!isAuthenticated) {
    return <AdminLoginForm onSuccess={() => setIsAuthenticated(true)} />;
  }

  // 2. Admin Dashboard Table
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-accent/20 border border-accent/30 text-accent font-bold text-xs uppercase tracking-wider">
              Admin Dashboard
            </span>
            <span className="text-xs text-slate-500 dark:text-[#8b949e]">tech.inkhel.com</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-[#f0f6fc] mt-1">
            Article Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8b949e]">
            You have <strong className="text-slate-900 dark:text-white">{posts.length}</strong> published editorial articles.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* New Article Full Page Button */}
          <Link
            to="/admin/editor"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent text-slate-950 font-bold text-xs sm:text-sm hover:bg-accent-hover transition-transform active:scale-95 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>New Article (Full Page)</span>
          </Link>

          <button
            onClick={handleExportPosts}
            title="Copy all posts as TypeScript code"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#161b22] hover:bg-slate-50 dark:hover:bg-white/[0.06] text-slate-700 dark:text-[#c9d1d9] border border-slate-200 dark:border-white/10 text-xs font-semibold transition-colors shadow-sm"
          >
            {copiedCode ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCode ? 'Code Copied!' : 'Export Code'}</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-[#c9d1d9]">
            <User className="w-3.5 h-3.5 text-accent" />
            <span>{getLoggedInUser() || 'lingtuka'}</span>
          </div>

          <button
            onClick={handleLogout}
            title="Log out of admin"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#161b22] hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-500 hover:text-rose-600 dark:text-[#8b949e] dark:hover:text-rose-400 border border-slate-200 dark:border-white/10 text-xs font-semibold transition-colors shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Posts Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#161b22] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#090d13] text-[11px] uppercase tracking-wider text-slate-500 dark:text-[#8b949e]">
                <th className="py-3.5 px-4 sm:px-6">Article</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Affiliate</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-white/10 text-xs sm:text-sm">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt=""
                        className="w-14 h-10 object-cover rounded-lg bg-slate-100 dark:bg-[#21262d] shrink-0 border border-slate-200 dark:border-white/5"
                      />
                      <div className="min-w-0">
                        <Link
                          to="/admin/editor"
                          search={{ id: p.id }}
                          className="font-bold text-slate-900 dark:text-[#f0f6fc] hover:text-accent line-clamp-1 block transition-colors"
                        >
                          {p.title}
                        </Link>
                        <span className="text-[11px] font-mono text-slate-400 dark:text-[#8b949e] block">
                          /post/{p.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/5 text-[11px] font-semibold text-slate-700 dark:text-[#c9d1d9]">
                      {p.category}
                    </span>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap text-slate-500 dark:text-[#8b949e] text-xs">
                    {p.publishedAt}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {p.affiliateLinks?.amazon && (
                        <span className="p-1 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20" title="Amazon link active">
                          <ShoppingCart className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {p.affiliateLinks?.flipkart && (
                        <span className="p-1 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20" title="Flipkart link active">
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {!p.affiliateLinks?.amazon && !p.affiliateLinks?.flipkart && (
                        <span className="text-[11px] text-slate-400 dark:text-[#8b949e]">-</span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to="/post/$slug"
                        params={{ slug: p.slug }}
                        target="_blank"
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white transition-colors"
                        title="View Live Article"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {/* Edit opens full-page editor */}
                      <Link
                        to="/admin/editor"
                        search={{ id: p.id }}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-accent hover:text-accent-hover transition-colors"
                        title="Open Full Page Editor"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
                            deletePost(p.id);
                          }
                        }}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 dark:bg-white/[0.04] dark:hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 transition-colors"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom helper */}
      <div className="mt-8 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#161b22]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-[#8b949e]">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent shrink-0" />
          <span>Click <strong>New Article</strong> or <strong>Edit (✏️)</strong> to open the full-screen distraction-free studio.</span>
        </div>
        <button
          onClick={() => {
            if (confirm('Reset all articles back to original starter posts?')) {
              resetToDefault();
            }
          }}
          className="text-slate-500 dark:text-[#8b949e] hover:text-rose-500 underline transition-colors"
        >
          Reset to default starter articles
        </button>
      </div>
    </div>
  );
};

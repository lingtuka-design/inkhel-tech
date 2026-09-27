import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { usePosts, useCategories } from '../data/postsStore';
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
  Tag,
  X,
  Cloud,
  Sparkles,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { posts, deletePost, resetToDefault, triggerFullSync, isSyncing } = usePosts();
  const { categories, addCategory, deleteCategory, resetCategories } = useCategories();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => checkIsAuthenticated());
  const [copiedCode, setCopiedCode] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [categoryError, setCategoryError] = useState('');

  // Auto-sync any existing local post edits to Cloudflare D1
  React.useEffect(() => {
    if (isAuthenticated) {
      triggerFullSync();
    }
  }, [isAuthenticated]);

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
            <span>New Article</span>
          </Link>

          {/* AI Magic Post Button */}
          <Link
            to="/admin/editor"
            search={{ ai: 'true' }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-blue-500/20 border border-emerald-500/40 hover:border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-sm hover:scale-105 transition-all shadow-md active:scale-95"
            title="Auto-generate article from English text using Gemini AI"
          >
            <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>✨ AI Post (Gemini)</span>
          </Link>

          {/* Manage Categories Button */}
          <button
            onClick={() => setShowCategoryManager(!showCategoryManager)}
            title="Manage website categories"
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-colors shadow-sm ${
              showCategoryManager
                ? 'bg-accent/15 border-accent text-accent'
                : 'bg-white dark:bg-[#161b22] hover:bg-slate-50 dark:hover:bg-white/[0.06] text-slate-700 dark:text-[#c9d1d9] border-slate-200 dark:border-white/10'
            }`}
          >
            <Tag className="w-4 h-4 text-accent" />
            <span>Categories ({categories.length})</span>
          </button>

          {/* Sync to Cloud Button */}
          <button
            onClick={async () => {
              const ok = await triggerFullSync();
              if (ok) {
                setSyncSuccess(true);
                setTimeout(() => setSyncSuccess(false), 2500);
              }
            }}
            disabled={isSyncing}
            title="Sync all articles directly to Cloudflare D1 Database"
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-colors shadow-sm ${
              syncSuccess
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'bg-white dark:bg-[#161b22] hover:bg-slate-50 dark:hover:bg-white/[0.06] text-slate-700 dark:text-[#c9d1d9] border-slate-200 dark:border-white/10'
            }`}
          >
            <Cloud className={`w-4 h-4 ${isSyncing ? 'animate-pulse text-accent' : syncSuccess ? 'text-emerald-500' : 'text-blue-500'}`} />
            <span>{isSyncing ? 'Syncing...' : syncSuccess ? 'Synced to Cloud!' : 'Sync to Cloud'}</span>
          </button>

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

      {/* Category Management Panel */}
      {showCategoryManager && (
        <div className="mb-8 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#161b22] shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 mb-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#f0f6fc] flex items-center gap-2">
                <Tag className="w-4 h-4 text-accent" />
                <span>Category Management (Siam / Enkawl)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#8b949e] mt-0.5">
                Category thar siam la, website pumpui leh article editor-ah an lang nghal zel ang.
              </p>
            </div>
            <button
              onClick={() => setShowCategoryManager(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Add Category Form */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const res = await addCategory(newCategoryInput);
              if (res.success) {
                setNewCategoryInput('');
                setCategoryError('');
              } else {
                setCategoryError(res.message || 'Error adding category');
              }
            }}
            className="flex flex-col sm:flex-row gap-2.5 mb-5"
          >
            <input
              type="text"
              value={newCategoryInput}
              onChange={(e) => {
                setNewCategoryInput(e.target.value);
                setCategoryError('');
              }}
              placeholder="Category hming thar (e.g. Gaming, Laptops, AI, Mizo Tech)..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-[#f0f6fc] focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-accent text-slate-950 font-bold text-xs sm:text-sm hover:bg-accent-hover transition-transform active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Category Siam Thar</span>
            </button>
          </form>

          {categoryError && (
            <p className="text-xs text-rose-500 mb-4 -mt-2 font-medium">{categoryError}</p>
          )}

          {/* Categories Badges List */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Category awm mekte ({categories.length}):
            </label>
            <div className="flex flex-wrap gap-2.5">
              {categories.map((cat) => {
                const count = posts.filter((p) => p.category === cat).length;
                return (
                  <div
                    key={cat}
                    className="flex items-center gap-2 pl-3.5 pr-2 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-800 dark:text-[#c9d1d9]"
                  >
                    <span>{cat}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-slate-200/80 dark:bg-white/10 text-[10px] text-slate-600 dark:text-[#8b949e]">
                      {count} {count === 1 ? 'post' : 'posts'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (count > 0) {
                          if (!confirm(`Category "${cat}" ah hian article ${count} a awm a, i paih duh tak tak em?`)) {
                            return;
                          }
                        } else if (!confirm(`Category "${cat}" hi i paih duh em?`)) {
                          return;
                        }
                        deleteCategory(cat);
                      }}
                      title={`Delete "${cat}"`}
                      className="p-1 rounded-md hover:bg-rose-100 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-500 transition-colors ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Category te hi a hmasa (default: Smartphones, Audio & Gadgets, Buying Guides, Deals) ah dah let leh i duh em?')) {
                    resetCategories();
                  }
                }}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-[#8b949e] underline"
              >
                Reset categories to default
              </button>
            </div>
          </div>
        </div>
      )}

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
                        <div className="flex items-center gap-2">
                          <Link
                            to="/admin/editor"
                            search={{ id: p.id }}
                            className="font-bold text-slate-900 dark:text-[#f0f6fc] hover:text-accent line-clamp-1 transition-colors"
                          >
                            {p.title}
                          </Link>
                          {p.featured && (
                            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-extrabold uppercase">
                              ★ Featured
                            </span>
                          )}
                        </div>
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
                        onClick={async () => {
                          if (confirm(`He thuziak "${p.title}" hi paih (delete) hlen i duh takzet em?`)) {
                            await deletePost(p.id);
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

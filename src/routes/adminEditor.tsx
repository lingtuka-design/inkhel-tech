import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { usePosts, useCategories } from '../data/postsStore';
import type { Post } from '../data/posts';
import { QuickSpecs } from '../components/QuickSpecs';
import { ProsCons } from '../components/ProsCons';
import { AffiliateDealCard } from '../components/AffiliateDealCard';
import { AuthorBio } from '../components/AuthorBio';
import { ShareButtons } from '../components/ShareButtons';
import { RichTextEditor } from '../components/RichTextEditor';
import { checkIsAuthenticated } from '../lib/auth';
import { AdminLoginForm } from '../components/AdminLoginForm';
import {
  ArrowLeft,
  Eye,
  Edit3,
  Save,
  Sparkles,
  ShoppingCart,
  CheckCircle2,
  Plus,
  Loader2,
  X,
  Wand2,
  UploadCloud,
  Smartphone,
  Laptop,
  Tablet,
  Camera,
  Watch,
  Mic,
  Trash2,
  Star,
} from 'lucide-react';

export const AdminEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { id?: string; ai?: string };
  const editId = search.id;

  useEffect(() => {
    if (search.ai === 'true') {
      setShowAiModal(true);
    }
  }, [search.ai]);

  const { posts, addPost, updatePost } = usePosts();
  const { categories, addCategory } = useCategories();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => checkIsAuthenticated());

  // Tab: 'editor' | 'preview'
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Category creation inline state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');

  // Gemini AI Auto-Generator State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiRawText, setAiRawText] = useState('');
  const [aiImageUrl, setAiImageUrl] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiSuccessToast, setAiSuccessToast] = useState(false);

  // Image Upload State
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingAiImage, setIsUploadingAiImage] = useState(false);

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to upload image');
        return null;
      }
      return data.url;
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
      return null;
    }
  };

  const handleGenerateWithAi = async () => {
    if (!aiRawText.trim()) return;
    setIsAiGenerating(true);
    setAiError('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiRawText }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate article');
      }

      const gen = data.data;

      if (gen.title) setTitle(gen.title);
      if (gen.slug) setSlug(gen.slug);
      if (gen.category) {
        setCategory(gen.category);
        await addCategory(gen.category);
      }
      if (gen.excerpt) setExcerpt(gen.excerpt);
      if (gen.content) setContent(gen.content);
      if (gen.readTime) setReadTime(Number(gen.readTime) || 5);
      if (gen.tags && Array.isArray(gen.tags)) {
        setTags(gen.tags.join(', '));
      }
      if (aiImageUrl.trim()) {
        setImage(aiImageUrl.trim());
      }

      // Specs
      if (gen.specs && typeof gen.specs === 'object') {
        const generatedRows = Object.entries(gen.specs).map(([k, v]) => ({
          id: Math.random().toString(36).substring(2, 9),
          key: k,
          value: String(v || ''),
        }));
        if (generatedRows.length > 0) {
          setSpecRows(generatedRows);
        }
      }

      // Pros & Cons
      if (Array.isArray(gen.pros)) {
        setProsText(gen.pros.join('\n'));
      }
      if (Array.isArray(gen.cons)) {
        setConsText(gen.cons.join('\n'));
      }

      setShowAiModal(false);
      setAiRawText('');
      setAiImageUrl('');
      setAiSuccessToast(true);
      setTimeout(() => setAiSuccessToast(false), 4000);
    } catch (err: any) {
      setAiError(err.message || 'Error communicating with Gemini AI');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<string>('Phone');
  const [author, setAuthor] = useState('iTECH Editorial');
  const [publishedAt, setPublishedAt] = useState('');
  const [readTime, setReadTime] = useState(5);
  const [image, setImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [isFeatured, setIsFeatured] = useState<boolean>(false);

  // Dynamic Specs Rows
  interface SpecRow {
    id: string;
    key: string;
    value: string;
  }

  const [specRows, setSpecRows] = useState<SpecRow[]>([
    { id: '1', key: 'Display', value: '' },
    { id: '2', key: 'Processor', value: '' },
    { id: '3', key: 'Camera', value: '' },
    { id: '4', key: 'Battery', value: '' },
    { id: '5', key: 'Charging', value: '' },
  ]);

  const applySpecPreset = (presetType: 'phone' | 'laptop' | 'tablet' | 'camera' | 'smartwatch' | 'mic' | 'clear') => {
    if (presetType === 'clear') {
      setSpecRows([]);
      return;
    }
    const presets: Record<string, string[]> = {
      phone: ['Display', 'Processor', 'Camera', 'Battery', 'Charging'],
      laptop: ['Processor / CPU', 'RAM & Storage', 'Graphics / GPU', 'Display', 'Battery Life', 'Weight & Ports'],
      tablet: ['Display & Screen', 'Processor / Chip', 'Stylus Support', 'Cameras', 'Battery Life'],
      camera: ['Sensor & Megapixels', 'Video Recording', 'Lens Mount', 'ISO Range', 'Stabilization (IBIS)'],
      smartwatch: ['Display', 'Health & Sensors', 'Battery Life', 'Water Resistance', 'Connectivity'],
      mic: ['Polar Pattern', 'Frequency Response', 'Connectivity / Output', 'Sensitivity'],
    };
    const keys = presets[presetType] || [];
    setSpecRows(
      keys.map((k) => ({
        id: Math.random().toString(36).substring(2, 9),
        key: k,
        value: '',
      }))
    );
  };

  const addSpecRow = () => {
    setSpecRows((prev) => [
      ...prev,
      { id: Math.random().toString(36).substring(2, 9), key: '', value: '' },
    ]);
  };

  const updateSpecRow = (id: string, field: 'key' | 'value', val: string) => {
    setSpecRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  };

  const removeSpecRow = (id: string) => {
    setSpecRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Affiliate
  const [amazonUrl, setAmazonUrl] = useState('');
  const [flipkartUrl, setFlipkartUrl] = useState('');

  // Pros & Cons
  const [prosText, setProsText] = useState('');
  const [consText, setConsText] = useState('');

  // Load existing post if editId is provided
  useEffect(() => {
    if (editId) {
      const existing = posts.find((p) => p.id === editId);
      if (existing) {
        setTitle(existing.title);
        setSlug(existing.slug);
        setCategory(existing.category);
        setAuthor(existing.author);
        setPublishedAt(existing.publishedAt);
        setReadTime(existing.readTime);
        setImage(existing.image);
        setExcerpt(existing.excerpt);
        setTags(existing.tags ? existing.tags.join(', ') : '');
        setContent(existing.content);
        if (existing.specs && typeof existing.specs === 'object') {
          const loadedRows = Object.entries(existing.specs).map(([k, v]) => ({
            id: Math.random().toString(36).substring(2, 9),
            key: k,
            value: String(v || ''),
          }));
          setSpecRows(loadedRows);
        } else {
          setSpecRows([]);
        }
        setAmazonUrl(existing.affiliateLinks?.amazon || '');
        setFlipkartUrl(existing.affiliateLinks?.flipkart || '');
        setProsText(existing.pros ? existing.pros.join('\n') : '');
        setConsText(existing.cons ? existing.cons.join('\n') : '');
        setIsFeatured(Boolean(existing.featured));
        return;
      }
    }

    // Clean empty starting state for new post (no unwanted pre-filled text)
    setPublishedAt(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    setImage('');
    setProsText('');
    setConsText('');
    setContent('');
    setIsFeatured(false);
  }, [editId, posts]);

  // Authentication Gate
  if (!isAuthenticated) {
    return (
      <AdminLoginForm
        onSuccess={() => setIsAuthenticated(true)}
        title="iTECH Editor"
        subtitle="Sign in with your administrator credentials to access the article studio"
      />
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const pros = prosText.split('\n').map((s) => s.trim()).filter(Boolean);
    const cons = consText.split('\n').map((s) => s.trim()).filter(Boolean);
    const tagList = tags.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
    const finalSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const compiledSpecs: Record<string, string> = {};
    specRows.forEach((r) => {
      if (r.key.trim() && r.value.trim()) {
        compiledSpecs[r.key.trim()] = r.value.trim();
      }
    });

    const postData: Post = {
      id: editId || Date.now().toString(),
      slug: finalSlug,
      title,
      excerpt,
      category,
      author,
      publishedAt: publishedAt || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: Number(readTime) || 5,
      image,
      content,
      tags: tagList,
      specs: Object.keys(compiledSpecs).length > 0 ? compiledSpecs : undefined,
      pros: pros.length > 0 ? pros : undefined,
      cons: cons.length > 0 ? cons : undefined,
      featured: isFeatured,
      affiliateLinks: {
        ...(amazonUrl && { amazon: amazonUrl }),
        ...(flipkartUrl && { flipkart: flipkartUrl }),
      },
    };

    if (editId) {
      updatePost(postData);
    } else {
      addPost(postData);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      navigate({ to: '/admin' });
    }, 1200);
  };

  // Word count & read time estimator
  const wordCount = content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  const compiledPreviewSpecs: Record<string, string> = {};
  specRows.forEach((r) => {
    if (r.key.trim() && r.value.trim()) {
      compiledPreviewSpecs[r.key.trim()] = r.value.trim();
    }
  });

  const previewPost: Post = {
    id: editId || 'preview',
    slug: slug || 'preview-slug',
    title: title || 'Untitled Story',
    excerpt: excerpt || 'Article excerpt summary will appear here...',
    category,
    author,
    publishedAt,
    readTime: Number(readTime) || estimatedReadTime,
    image,
    content,
    featured: isFeatured,
    tags: tags.split(',').map((s) => s.trim()).filter(Boolean),
    specs: compiledPreviewSpecs,
    pros: prosText.split('\n').map((s) => s.trim()).filter(Boolean),
    cons: consText.split('\n').map((s) => s.trim()).filter(Boolean),
    affiliateLinks: {
      ...(amazonUrl && { amazon: amazonUrl }),
      ...(flipkartUrl && { flipkart: flipkartUrl }),
    },
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Sticky Top Editor Action Bar */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Back & Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-700 dark:text-[#c9d1d9] transition-colors shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>

            <span className="text-slate-300 dark:text-white/20 hidden sm:inline">|</span>

            <div className="min-w-0 hidden sm:block">
              <h1 className="text-sm font-bold text-slate-900 dark:text-[#f0f6fc] truncate max-w-sm">
                {editId ? `Editing: ${title || 'Post'}` : 'New Editorial Post'}
              </h1>
              <span className="text-[11px] text-slate-500 dark:text-[#8b949e]">
                {wordCount} words · ~{estimatedReadTime} min read
              </span>
            </div>
          </div>

          {/* Right: Write / Preview Tab & Publish */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Magic Studio Button */}
            <button
              type="button"
              onClick={() => {
                setShowAiModal(true);
                setAiError('');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-blue-500/15 border border-emerald-500/30 hover:border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold text-xs shadow-sm transition-all active:scale-95"
              title="Generate full Mizo article with Gemini AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
              <span className="hidden sm:inline">AI Magic Studio</span>
              <span className="sm:hidden">AI Auto</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#161b22] border border-slate-200 dark:border-white/10 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'editor'
                    ? 'bg-white dark:bg-[#21262d] text-slate-900 dark:text-white shadow-sm font-bold'
                    : 'text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Write</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-white dark:bg-[#21262d] text-slate-900 dark:text-white shadow-sm font-bold'
                    : 'text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-accent hover:bg-accent-hover text-slate-950 active:scale-95'
              }`}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Published!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{editId ? 'Update Story' : 'Publish Story'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* TAB 1: WRITE & COMPOSE */}
        {activeTab === 'editor' && (
          <form onSubmit={handleSave} className="space-y-8">
            
            {/* 1. Primary Story Header Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
                <Sparkles className="w-4 h-4" />
                <span>Article Title & Core Details</span>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-[#8b949e] mb-1.5">
                  Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!editId) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }
                  }}
                  placeholder="e.g. Apple MacBook Air M4 Review: The Standard Laptop for Creators and Students"
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-[#f0f6fc] text-lg sm:text-xl font-bold placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:border-accent"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-[#8b949e] mb-1.5">
                  Excerpt / Subdeck Summary (1-2 sentences) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A clear, compelling 1-2 sentence hook explaining the review or tech guide..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-[#c9d1d9] text-sm leading-relaxed placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:border-accent"
                />
              </div>

              {/* Grid: Category, Slug, Author, ReadTime */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-[#8b949e]">
                      Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCategory(!isAddingCategory);
                        setCategoryError('');
                      }}
                      className="text-[11px] font-semibold text-accent hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isAddingCategory ? 'Select' : 'New'}</span>
                    </button>
                  </div>

                  {isAddingCategory ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => {
                            setNewCategoryName(e.target.value);
                            setCategoryError('');
                          }}
                          placeholder="New category..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-[#f0f6fc] focus:outline-none focus:border-accent"
                          onKeyDown={async (e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const res = await addCategory(newCategoryName);
                              if (res.success) {
                                setCategory(newCategoryName.trim());
                                setNewCategoryName('');
                                setIsAddingCategory(false);
                                setCategoryError('');
                              } else {
                                setCategoryError(res.message || 'Error');
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            const res = await addCategory(newCategoryName);
                            if (res.success) {
                              setCategory(newCategoryName.trim());
                              setNewCategoryName('');
                              setIsAddingCategory(false);
                              setCategoryError('');
                            } else {
                              setCategoryError(res.message || 'Error');
                            }
                          }}
                          className="px-2.5 py-2 bg-accent text-slate-950 font-bold rounded-xl text-xs hover:bg-accent-hover transition-colors shrink-0"
                        >
                          Add
                        </button>
                      </div>
                      {categoryError && (
                        <span className="text-[11px] text-rose-500 block leading-tight">{categoryError}</span>
                      )}
                    </div>
                  ) : (
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-[#f0f6fc] text-sm font-medium focus:outline-none focus:border-accent"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-[#8b949e] mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="my-article-slug"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-[#f0f6fc] text-sm font-mono focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-[#8b949e] mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-[#f0f6fc] text-sm focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-[#8b949e] mb-1">
                    Reading Time (Mins)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={readTime}
                    onChange={(e) => setReadTime(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-[#f0f6fc] text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Feature This Post Tick-box */}
              <div className="pt-1">
                <label className={`flex items-start sm:items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                  isFeatured
                    ? 'border-amber-500/40 bg-amber-500/10 dark:bg-amber-500/[0.08]'
                    : 'border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#090d13]/50 hover:border-amber-500/30'
                }`}>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-5 h-5 mt-0.5 sm:mt-0 rounded text-amber-500 accent-amber-500 focus:ring-0 cursor-pointer shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      <Star className={`w-4 h-4 ${isFeatured ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                      <span className={isFeatured ? 'text-amber-600 dark:text-amber-400' : ''}>
                        Feature This Story (Featured Post / Hero Story)
                      </span>
                      {isFeatured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950 uppercase ml-1">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-[#8b949e] mt-0.5 leading-normal">
                      Tick rawh le: He thuziak hi Homepage chung bera chanchin langsar ber (Top Hero Story)-ah a lang nghal ang.
                    </p>
                  </div>
                </label>
              </div>

              {/* Featured Image Upload & URL */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-[#8b949e]">
                    Featured Image *
                  </label>
                  <span className="text-[11px] font-normal text-slate-400">16:9 banner</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#090d13]/70">
                  {image ? (
                    <div className="flex items-center gap-3">
                      {/* Compact Thumbnail Preview */}
                      <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#161b22] shrink-0 shadow-sm">
                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      
                      {/* Details & URL */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Thlalak thlan fel a ni e</span>
                        </div>
                        <input
                          type="text"
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          placeholder="Image URL"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-slate-300 focus:outline-none focus:border-accent"
                        />
                      </div>

                      {/* Replace / Remove buttons */}
                      <div className="flex sm:flex-col gap-1.5 shrink-0">
                        <label className="cursor-pointer inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors">
                          {isUploadingImage ? <Loader2 className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3" />}
                          <span className="hidden sm:inline">{isUploadingImage ? 'Uploading...' : 'Thlak'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingImage}
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setIsUploadingImage(true);
                                const url = await uploadFile(file);
                                if (url) setImage(url);
                                setIsUploadingImage(false);
                              }
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setImage('')}
                          className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
                          title="Paih rawh"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Paih</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      <label className="cursor-pointer shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent text-slate-950 font-bold text-xs shadow-sm hover:bg-accent-hover transition-colors">
                        {isUploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                        <span>{isUploadingImage ? 'Uploading...' : 'Thlalak Upload'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploadingImage}
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setIsUploadingImage(true);
                              const url = await uploadFile(file);
                              if (url) setImage(url);
                              setIsUploadingImage(false);
                            }
                          }}
                        />
                      </label>
                      <span className="hidden sm:inline text-xs text-slate-400 font-medium px-1">or</span>
                      <div className="relative flex-1 min-w-0">
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          placeholder="Paste image URL (https://...)"
                          className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-[#f0f6fc] placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. WYSIWYG Rich Text Article Body Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-[#8b949e]">
                  Article Content (WYSIWYG Rich Text Editor) *
                </label>
                <span className="text-[11px] text-slate-400">
                  TipTap Visual Editor · Direct formatting & preview
                </span>
              </div>
              <RichTextEditor content={content} onChange={setContent} />
            </div>

            {/* 3. Specs & Affiliate Deals Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Quick Specs */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                    <span>Hardware Specifications</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-normal">
                    {specRows.length} {specRows.length === 1 ? 'spec' : 'specs'}
                  </span>
                </div>

                {/* Preset Templates Selector */}
                <div className="space-y-1.5 pt-0.5">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    Quick Presets (Thlang mai rawh):
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => applySpecPreset('phone')}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                    >
                      <Smartphone className="w-3 h-3 text-accent" />
                      <span>Phone</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => applySpecPreset('laptop')}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                    >
                      <Laptop className="w-3 h-3 text-accent" />
                      <span>Laptop</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => applySpecPreset('tablet')}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                    >
                      <Tablet className="w-3 h-3 text-accent" />
                      <span>Tablet</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => applySpecPreset('camera')}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                    >
                      <Camera className="w-3 h-3 text-accent" />
                      <span>Camera</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => applySpecPreset('smartwatch')}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                    >
                      <Watch className="w-3 h-3 text-accent" />
                      <span>Watch</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => applySpecPreset('mic')}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                    >
                      <Mic className="w-3 h-3 text-accent" />
                      <span>Mic / Audio</span>
                    </button>
                    {specRows.length > 0 && (
                      <button
                        type="button"
                        onClick={() => applySpecPreset('clear')}
                        className="px-2 py-1 rounded-lg text-[11px] font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors ml-auto"
                      >
                        Paih fai
                      </button>
                    )}
                  </div>
                </div>

                {/* Dynamic Spec Rows List */}
                <div className="space-y-2 pt-1 max-h-[360px] overflow-y-auto pr-1">
                  {specRows.map((row) => (
                    <div key={row.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Spec Name (e.g. CPU)"
                        value={row.key}
                        onChange={(e) => updateSpecRow(row.id, 'key', e.target.value)}
                        className="w-2/5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-accent"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. Intel Core Ultra 7)"
                        value={row.value}
                        onChange={(e) => updateSpecRow(row.id, 'value', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-accent"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecRow(row.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
                        title="Delete Spec"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {specRows.length === 0 && (
                    <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-white/10 text-center text-xs text-slate-400">
                      Spec a la awm lo. A chunga preset khian thlang la, emaw a hnuaiah hian i duh duh type belh rawh.
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={addSpecRow}
                    className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-white/15 hover:border-accent text-slate-600 dark:text-slate-300 hover:text-accent text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Spec Row Belh Rawh (+ Add Spec)</span>
                  </button>
                </div>
              </div>

              {/* Affiliate Monetization */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Affiliate Deal Links (Optional)</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span>Amazon.in Affiliate URL</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.amazon.in/dp/...?tag=yourtag-21"
                      value={amazonUrl}
                      onChange={(e) => setAmazonUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                      <span>Flipkart Affiliate URL</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.flipkart.com/...?affid=youraffid"
                      value={flipkartUrl}
                      onChange={(e) => setFlipkartUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-[#8b949e] mb-1">
                      Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="smartphones, review, samsung, 2026"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Pros & Cons Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
                <label className="block text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">
                  Pros (One bullet point per line)
                </label>
                <textarea
                  rows={4}
                  value={prosText}
                  onChange={(e) => setProsText(e.target.value)}
                  placeholder="Excellent battery life&#10;Bright outdoor display&#10;S-Pen included"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-[#c9d1d9] text-xs sm:text-sm font-mono leading-relaxed"
                />
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
                <label className="block text-xs font-bold uppercase text-rose-600 dark:text-rose-400">
                  Cons (One bullet point per line)
                </label>
                <textarea
                  rows={4}
                  value={consText}
                  onChange={(e) => setConsText(e.target.value)}
                  placeholder="Expensive pricing&#10;No charging adapter in the box"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-[#c9d1d9] text-xs sm:text-sm font-mono leading-relaxed"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 flex items-center justify-between">
              <Link
                to="/admin"
                className="text-xs text-slate-500 dark:text-[#8b949e] hover:underline"
              >
                Cancel & return to dashboard
              </Link>

              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-slate-950 font-extrabold text-sm shadow-lg transition-transform active:scale-95"
              >
                {editId ? 'Update & Publish Story' : 'Publish Story Now'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: LIVE FULL ARTICLE PREVIEW */}
        {activeTab === 'preview' && (
          <div className="max-w-3xl mx-auto py-6 animate-in fade-in duration-200">
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-accent text-xs font-semibold flex items-center justify-between">
              <span>👁️ Live Editorial Preview: This is exactly how your article will look on tech.inkhel.com</span>
              <button
                onClick={() => setActiveTab('editor')}
                className="px-3 py-1 rounded bg-accent text-slate-950 font-bold hover:bg-accent-hover"
              >
                Back to Edit
              </button>
            </div>

            {/* Rendered Preview Article */}
            <article>
              <div className="mb-3">
                <span className="inline-block px-3 py-1 bg-accent/15 text-accent text-xs font-bold uppercase tracking-wider rounded-md border border-accent/25">
                  {previewPost.category}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#f0f6fc] tracking-tight leading-tight mb-4">
                {previewPost.title}
              </h1>

              <p className="text-lg text-slate-600 dark:text-[#8b949e] leading-relaxed mb-6">
                {previewPost.excerpt}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-[#8b949e] pb-6 border-b border-slate-200 dark:border-white/10 mb-8">
                <span className="font-semibold text-slate-900 dark:text-white">{previewPost.author}</span>
                <span>•</span>
                <span>{previewPost.publishedAt}</span>
                <span>•</span>
                <span>{previewPost.readTime} min read</span>
              </div>

              {previewPost.image && (
                <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 aspect-[16/9] shadow-sm">
                  <img src={previewPost.image} alt={previewPost.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Quick Specs */}
              {previewPost.specs && <QuickSpecs specs={previewPost.specs} />}

              {/* Affiliate Card */}
              {previewPost.affiliateLinks && (
                <AffiliateDealCard
                  title={previewPost.title.split(':')[0]}
                  affiliateLinks={previewPost.affiliateLinks}
                />
              )}

              {/* Body */}
              <div
                className="prose-editorial my-8"
                dangerouslySetInnerHTML={{ __html: previewPost.content }}
              />

              {/* Pros & Cons */}
              <ProsCons pros={previewPost.pros} cons={previewPost.cons} />

              {/* Tags */}
              {previewPost.tags && previewPost.tags.length > 0 && (
                <div className="my-8 pt-6 border-t border-slate-200 dark:border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {previewPost.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] text-xs font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Sharing */}
              <ShareButtons title={previewPost.title} />

              {/* Author Bio */}
              <AuthorBio author={previewPost.author} />
            </article>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {aiSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-600 text-white shadow-xl animate-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div className="text-xs font-semibold">
            <span>Mizo article chu mawi takin buatsaih fel a ni ta e! Endik la, publish rawh le.</span>
          </div>
        </div>
      )}

      {/* Gemini AI Auto-Generator Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#090d13]/70">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-accent">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#f0f6fc] flex items-center gap-2">
                    <span>AI Magic Studio (Gemini Engine)</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-[#8b949e] mt-0.5">
                    English raw text, leak, news, emaw specs rawn dah la, Mizo thuziak puitlingah a chantir vek ang.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!isAiGenerating) setShowAiModal(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                  English Raw Text / Press Release / Leak / Specs *
                </label>
                <textarea
                  rows={9}
                  value={aiRawText}
                  onChange={(e) => setAiRawText(e.target.value)}
                  disabled={isAiGenerating}
                  placeholder="GSMArena, 91mobiles, Twitter, emaw khawi atang pawha i copy English text hetah rawn paste tawp rawh (e.g. phone thar tlangzarh tur, leak, specs, camera, battery, etc.)..."
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-[#f0f6fc] focus:outline-none focus:border-accent font-sans leading-relaxed resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 flex items-center justify-between">
                  <span>Thlalak / Banner (Optional)</span>
                  <span className="text-[11px] font-normal text-slate-400">Phone / PC atangin upload rawh</span>
                </label>

                {aiImageUrl ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10">
                    <img src={aiImageUrl} alt="AI Banner" className="w-16 h-12 object-cover rounded-lg border border-slate-200 dark:border-white/10 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate">{aiImageUrl}</p>
                      <p className="text-[11px] text-emerald-500 font-medium mt-0.5">✓ Thlalak pek fel a ni e</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAiImageUrl('')}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 text-xs transition-colors shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-slate-300 dark:border-white/20 bg-slate-50/70 dark:bg-[#090d13]/70 hover:border-accent hover:bg-emerald-500/5 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all">
                      {isUploadingAiImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-accent" />
                          <span>Thlalak a upload mek e...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4 text-accent" />
                          <span>📷 Thlalak Upload Rawh (Phone / PC)</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingAiImage || isAiGenerating}
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setIsUploadingAiImage(true);
                            const url = await uploadFile(file);
                            if (url) setAiImageUrl(url);
                            setIsUploadingAiImage(false);
                          }
                        }}
                      />
                    </label>
                    <input
                      type="url"
                      value={aiImageUrl}
                      onChange={(e) => setAiImageUrl(e.target.value)}
                      disabled={isAiGenerating}
                      placeholder="Emaw image URL paste rawh: https://..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-[#f0f6fc] focus:outline-none focus:border-accent font-mono"
                    />
                  </div>
                )}
              </div>

              {aiError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500 font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <span className="flex-1">{aiError}</span>
                  <button
                    type="button"
                    onClick={handleGenerateWithAi}
                    disabled={isAiGenerating}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] shadow-sm transition-colors"
                  >
                    <span>Hmet Nawn Leh Rawh</span>
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50/80 dark:bg-[#090d13]/80 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 order-2 sm:order-1">
                ⚡ Powered by Google Gemini Multi-Model AI Engine · Mizo Tech
              </span>

              <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  disabled={isAiGenerating}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerateWithAi}
                  disabled={isAiGenerating || !aiRawText.trim()}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg disabled:opacity-50 disabled:pointer-events-none transition-transform active:scale-95"
                >
                  {isAiGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mizo-in a buatsaih mek e...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>✨ Generate Mizo Article</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

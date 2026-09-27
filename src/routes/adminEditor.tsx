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
      if (gen.specs) {
        if (gen.specs.display) setSpecDisplay(gen.specs.display);
        if (gen.specs.processor) setSpecProcessor(gen.specs.processor);
        if (gen.specs.camera) setSpecCamera(gen.specs.camera);
        if (gen.specs.battery) setSpecBattery(gen.specs.battery);
        if (gen.specs.charging) setSpecCharging(gen.specs.charging);
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
  const [category, setCategory] = useState<string>('Smartphones');
  const [author, setAuthor] = useState('iTECH Editorial');
  const [publishedAt, setPublishedAt] = useState('');
  const [readTime, setReadTime] = useState(5);
  const [image, setImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');

  // Specs
  const [specDisplay, setSpecDisplay] = useState('');
  const [specProcessor, setSpecProcessor] = useState('');
  const [specCamera, setSpecCamera] = useState('');
  const [specBattery, setSpecBattery] = useState('');
  const [specCharging, setSpecCharging] = useState('');

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
        setSpecDisplay(existing.specs?.display || '');
        setSpecProcessor(existing.specs?.processor || '');
        setSpecCamera(existing.specs?.camera || '');
        setSpecBattery(existing.specs?.battery || '');
        setSpecCharging(existing.specs?.charging || '');
        setAmazonUrl(existing.affiliateLinks?.amazon || '');
        setFlipkartUrl(existing.affiliateLinks?.flipkart || '');
        setProsText(existing.pros ? existing.pros.join('\n') : '');
        setConsText(existing.cons ? existing.cons.join('\n') : '');
        return;
      }
    }

    // Clean empty starting state for new post (no unwanted pre-filled text)
    setPublishedAt(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    setImage('');
    setProsText('');
    setConsText('');
    setContent('');
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
      specs: {
        ...(specDisplay && { display: specDisplay }),
        ...(specProcessor && { processor: specProcessor }),
        ...(specCamera && { camera: specCamera }),
        ...(specBattery && { battery: specBattery }),
        ...(specCharging && { charging: specCharging }),
      },
      pros: pros.length > 0 ? pros : undefined,
      cons: cons.length > 0 ? cons : undefined,
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
    tags: tags.split(',').map((s) => s.trim()).filter(Boolean),
    specs: {
      ...(specDisplay && { display: specDisplay }),
      ...(specProcessor && { processor: specProcessor }),
      ...(specCamera && { camera: specCamera }),
      ...(specBattery && { battery: specBattery }),
      ...(specCharging && { charging: specCharging }),
    },
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

              {/* Image URL & Live Thumbnail Preview */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-[#8b949e] mb-1.5 flex items-center justify-between">
                  <span>Featured Image URL *</span>
                  <span className="text-[11px] font-normal text-slate-400">High-resolution banner (16:9 ratio)</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <input
                    type="url"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-[#f0f6fc] text-sm font-mono focus:outline-none focus:border-accent"
                  />
                  {image && (
                    <div className="w-24 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 shrink-0">
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
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
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  <span>Hardware Specifications (Optional)</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-[#8b949e] mb-1">
                      Display
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 6.8-inch Dynamic AMOLED 2X, 120Hz LTPO"
                      value={specDisplay}
                      onChange={(e) => setSpecDisplay(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-[#8b949e] mb-1">
                      Processor / SoC
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Qualcomm Snapdragon 8 Elite (3nm)"
                      value={specProcessor}
                      onChange={(e) => setSpecProcessor(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-[#8b949e] mb-1">
                      Camera Setup
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 200MP Main OIS + 50MP 5x Periscope"
                      value={specCamera}
                      onChange={(e) => setSpecCamera(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-[#8b949e] mb-1">
                        Battery
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5,200mAh"
                        value={specBattery}
                        onChange={(e) => setSpecBattery(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-[#8b949e] mb-1">
                        Charging
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 65W Wired, 15W Wireless"
                        value={specCharging}
                        onChange={(e) => setSpecCharging(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
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
                    <span>AI Magic Studio (Gemini 3.8 Flash)</span>
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                  Thlalak URL (Optional)
                </label>
                <input
                  type="url"
                  value={aiImageUrl}
                  onChange={(e) => setAiImageUrl(e.target.value)}
                  disabled={isAiGenerating}
                  placeholder="https://images.unsplash.com/... emaw /images/thlalak.jpg"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-[#f0f6fc] focus:outline-none focus:border-accent font-mono"
                />
              </div>

              {aiError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500 font-medium">
                  {aiError}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50/80 dark:bg-[#090d13]/80 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 order-2 sm:order-1">
                ⚡ Powered by Google Gemini 3.8 Flash · Mizo Tech Engine
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

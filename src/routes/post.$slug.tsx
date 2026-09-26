import React from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { usePosts } from '../data/postsStore';
import { useSeo } from '../lib/seo';
import { AffiliateDealCard } from '../components/AffiliateDealCard';
import { QuickSpecs } from '../components/QuickSpecs';
import { ProsCons } from '../components/ProsCons';
import { InArticleAd } from '../components/InArticleAd';
import { AdBanner } from '../components/AdBanner';
import { ShareButtons } from '../components/ShareButtons';
import { AuthorBio } from '../components/AuthorBio';
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Home,
  AlertCircle,
} from 'lucide-react';

export const PostDetailPage: React.FC = () => {
  const { posts } = usePosts();
  const { slug } = useParams({ strict: false }) as { slug: string };

  const currentIndex = posts.findIndex((p) => p.slug === slug);
  const post = currentIndex !== -1 ? posts[currentIndex] : null;

  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex !== -1 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  useSeo({
    title: post ? `${post.title} | iTECH` : 'Article Not Found | iTECH',
    description: post?.excerpt,
    canonicalUrl: post ? `https://tech.inkhel.com/post/${post.slug}` : undefined,
    ogType: 'article',
    ogImage: post?.image,
    post: post ?? undefined,
  });

  // Not Found State
  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-editorial-title mb-3">Article Not Found</h1>
        <p className="text-editorial-muted max-w-md mx-auto mb-8">
          The article you are searching for might have been moved, updated, or does not exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-slate-950 font-bold text-sm hover:bg-accent-hover transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to iTECH Homepage
        </Link>
      </div>
    );
  }

  // Split content naturally to insert in-article advertisement in the middle
  const splitContent = () => {
    // If there is an <h2> tag in the middle, inject ad before it
    const parts = post.content.split('<h2>');
    if (parts.length > 2) {
      const midPoint = Math.floor(parts.length / 2);
      const firstHalf = parts.slice(0, midPoint).join('<h2>');
      const secondHalf = parts.slice(midPoint).join('<h2>');
      return { firstHalf, secondHalf: `<h2>${secondHalf}`, hasSplit: true };
    }
    return { firstHalf: post.content, secondHalf: '', hasSplit: false };
  };

  const { firstHalf, secondHalf, hasSplit } = splitContent();

  return (
    <main className="min-h-screen py-6 sm:py-10">
      <article className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#8b949e]">
          <Link to="/" className="hover:text-accent flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          <Link to="/" search={{ category: post.category }} className="hover:text-accent transition-colors">
            {post.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          <span className="truncate max-w-[200px] text-slate-800 dark:text-[#f0f6fc] font-medium">{post.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          {/* Category Badge */}
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-accent/15 text-accent text-xs font-bold uppercase tracking-wider rounded-md border border-accent/25">
              {post.category}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-[#f0f6fc] tracking-tight leading-[1.15] mb-4">
            {post.title}
          </h1>

          {/* Excerpt / Deck */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-[#8b949e] leading-relaxed font-normal mb-6">
            {post.excerpt}
          </p>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-500 dark:text-[#8b949e] pb-6 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-xs">
                IT
              </span>
              <span className="font-semibold text-slate-900 dark:text-[#f0f6fc]">{post.author}</span>
            </div>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {post.publishedAt}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime} min read
            </span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#21262d] aspect-[16/9] relative shadow-sm">
          <img
            src={post.image}
            alt={post.title}
            loading="eager"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Optional Quick Specs */}
        {post.specs && <QuickSpecs specs={post.specs} />}

        {/* Primary Affiliate Deal Card (Top Placement) */}
        {post.affiliateLinks && (
          <AffiliateDealCard
            title={post.title.split(':')[0]}
            highlight={
              post.specs
                ? `${post.specs.processor ? post.specs.processor + ' · ' : ''}${post.specs.camera ? post.specs.camera.split('+')[0] + ' · ' : ''}${post.specs.battery || ''}`
                : undefined
            }
            affiliateLinks={post.affiliateLinks}
          />
        )}

        {/* Article Body Content */}
        <div className="prose-editorial">
          <div
            dangerouslySetInnerHTML={{ __html: firstHalf }}
          />

          {/* In-Article Ad Slot */}
          {hasSplit && (
            <InArticleAd slotId={`inkhel-article-mid-${post.id}`} />
          )}

          {hasSplit && (
            <div
              dangerouslySetInnerHTML={{ __html: secondHalf }}
            />
          )}
        </div>

        {/* Optional Pros & Cons */}
        {(post.pros || post.cons) && (
          <ProsCons pros={post.pros} cons={post.cons} />
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="my-8 pt-6 border-t border-slate-200 dark:border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8b949e] block mb-3">
              Filed under
            </span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-[#c9d1d9] font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Sharing Section */}
        <ShareButtons title={post.title} />

        {/* Author Bio Section */}
        <AuthorBio author={post.author} />

        {/* Below Article Ad Slot */}
        <AdBanner slotId="inkhel-post-bottom" format="horizontal" className="my-8" />

        {/* Article Navigation: Previous & Next Article */}
        <nav aria-label="Article pagination" className="my-10 pt-8 border-t border-slate-200 dark:border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevPost ? (
              <Link
                to="/post/$slug"
                params={{ slug: prevPost.slug }}
                className="group p-4 rounded-xl border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-white dark:bg-[#161b22] hover:bg-slate-50 dark:hover:bg-[#1c2129] shadow-sm transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-accent mb-2">
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  <span>Previous Article</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-[#f0f6fc] group-hover:text-accent line-clamp-2 transition-colors">
                  {prevPost.title}
                </h4>
              </Link>
            ) : (
              <div className="hidden sm:block"></div>
            )}

            {nextPost ? (
              <Link
                to="/post/$slug"
                params={{ slug: nextPost.slug }}
                className="group p-4 rounded-xl border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-white dark:bg-[#161b22] hover:bg-slate-50 dark:hover:bg-[#1c2129] shadow-sm transition-all flex flex-col justify-between text-left sm:text-right"
              >
                <div className="flex items-center justify-start sm:justify-end gap-1.5 text-xs font-semibold text-accent mb-2">
                  <span>Next Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-[#f0f6fc] group-hover:text-accent line-clamp-2 transition-colors">
                  {nextPost.title}
                </h4>
              </Link>
            ) : (
              <div className="hidden sm:block"></div>
            )}
          </div>
        </nav>
      </article>
    </main>
  );
};

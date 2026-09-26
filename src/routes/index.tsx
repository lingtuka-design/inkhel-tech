import React, { useState, useMemo, useRef } from 'react';
import type { Category } from '../data/posts';
import { usePosts } from '../data/postsStore';
import { filterPosts } from '../lib/search';
import { useSeo } from '../lib/seo';
import { CategoryNav } from '../components/CategoryNav';
import { SearchBar } from '../components/SearchBar';
import { FeaturedPost } from '../components/FeaturedPost';
import { PostCard } from '../components/PostCard';
import { AdBanner } from '../components/AdBanner';
import { Newspaper, Sparkles, FilterX } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { posts } = usePosts();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useSeo({
    title: 'iTECH — Best Smartphones, Gadgets & Tech Guides',
    description:
      'iTECH is an independent technology publication covering smartphones, audio gadgets, buying guides, deals, and tech insights for readers in Mizoram and beyond.',
    canonicalUrl: 'https://tech.inkhel.com/',
  });

  const filteredPosts = useMemo(() => {
    return filterPosts(posts, searchQuery, selectedCategory);
  }, [posts, searchQuery, selectedCategory]);

  const featured = posts[0];
  const isFiltering = searchQuery.trim() !== '' || selectedCategory !== 'All';

  // For the chronological list, if we are on the default unfiltered view, we can feature the first post and list the rest
  const listPosts = useMemo(() => {
    if (!isFiltering) {
      return posts.slice(1);
    }
    return filteredPosts;
  }, [isFiltering, posts, filteredPosts]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen">
      {/* Category Pills Navigation */}
      <CategoryNav
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          inputRef={searchInputRef}
        />

        {/* When not searching or filtering, show Featured Article Hero */}
        {!isFiltering && featured && (
          <section aria-label="Featured Story">
            <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-accent">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured Story</span>
            </div>
            <FeaturedPost post={featured} />
          </section>
        )}

        {/* Editorial Feed Header */}
        <section aria-label="Recent Articles">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 mb-6">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-accent" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#f0f6fc] tracking-tight">
                {isFiltering
                  ? `Filtered Articles (${filteredPosts.length})`
                  : 'Latest Editorial Stories'}
              </h2>
            </div>
            {isFiltering && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold"
              >
                <FilterX className="w-3.5 h-3.5" /> Clear filters
              </button>
            )}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 ? (
            <div className="py-16 text-center rounded-2xl border border-dashed border-slate-300 dark:border-white/10 bg-white dark:bg-[#161b22]/40 my-8 shadow-sm">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center text-slate-400 dark:text-[#8b949e] mb-3">
                <FilterX className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-[#f0f6fc] mb-1">No articles found</h3>
              <p className="text-sm text-slate-600 dark:text-[#8b949e] max-w-sm mx-auto mb-5">
                We couldn't find any articles matching &ldquo;{searchQuery}&rdquo;. Try another search term or browse all topics.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-accent text-slate-950 font-bold text-xs hover:bg-accent-hover transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200/80 dark:divide-white/10">
              {listPosts.map((post, index) => (
                <React.Fragment key={post.id}>
                  <PostCard post={post} />
                  {/* Subtle Ad banner after the 2nd article */}
                  {index === 1 && (
                    <AdBanner slotId="inkhel-home-feed-mid" format="horizontal" />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

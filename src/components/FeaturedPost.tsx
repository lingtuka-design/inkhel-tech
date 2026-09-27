import React from 'react';
import { Link } from '@tanstack/react-router';
import { Clock, Calendar, ChevronRight } from 'lucide-react';
import type { Post } from '../data/posts';

interface FeaturedPostProps {
  post: Post;
}

export const FeaturedPost: React.FC<FeaturedPostProps> = ({ post }) => {
  return (
    <article className="group mb-12 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-white dark:bg-[#161b22] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <Link
        to="/post/$slug"
        params={{ slug: post.slug }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 lg:p-8 items-center"
      >
        {/* Visual / Image Column */}
        <div className="lg:col-span-7 overflow-hidden rounded-xl bg-slate-100 dark:bg-[#21262d] aspect-[16/10] sm:aspect-[16/9] relative">
          <img
            src={post.image}
            alt={post.title}
            loading="eager"
            className="w-full h-full object-cover transform group-hover:scale-[1.02] transition-transform duration-500 ease-out"
          />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="inline-block px-3 py-1 bg-white/95 dark:bg-[#0d1117]/90 backdrop-blur-md text-accent text-xs font-bold uppercase tracking-wider rounded-md border border-accent/25 shadow-sm">
              {post.category}
            </span>
            {post.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider rounded-md shadow-md">
                ★ Featured
              </span>
            )}
          </div>
        </div>

        {/* Content Column */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-[#8b949e]">
            <span className="font-semibold text-slate-800 dark:text-[#c9d1d9]">{post.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {post.publishedAt}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime} min read
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-slate-900 dark:text-[#f0f6fc] group-hover:text-accent transition-colors duration-200 leading-tight tracking-tight">
            {post.title}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-[#8b949e] leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>

          <div className="pt-2 flex items-center text-sm font-semibold text-accent group-hover:translate-x-1 transition-transform duration-200">
            Read full review <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </Link>
    </article>
  );
};

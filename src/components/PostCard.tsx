import React from 'react';
import { Link } from '@tanstack/react-router';
import { Clock, Calendar } from 'lucide-react';
import type { Post } from '../data/posts';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <article className="group border-b border-slate-200/80 dark:border-white/10 py-6 last:border-b-0 hover:bg-slate-50/80 dark:hover:bg-white/[0.02] px-2 sm:px-4 rounded-xl transition-colors duration-150">
      <Link
        to="/post/$slug"
        params={{ slug: post.slug }}
        className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start"
      >
        {/* Thumbnail: stacked on mobile, horizontal fixed width on desktop */}
        <div className="w-full sm:w-56 lg:w-64 aspect-[16/10] shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-[#21262d] relative shadow-sm">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover transform group-hover:scale-[1.02] transition-transform duration-500 ease-out"
          />
          <div className="absolute top-2.5 left-2.5 sm:hidden">
            <span className="px-2.5 py-0.5 bg-white/95 dark:bg-[#0d1117]/90 text-accent text-[11px] font-semibold uppercase tracking-wider rounded border border-accent/20 shadow-sm">
              {post.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between h-full py-0.5">
          <div>
            <div className="hidden sm:flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                {post.category}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#f0f6fc] group-hover:text-accent transition-colors duration-150 leading-snug tracking-tight mb-2">
              {post.title}
            </h3>

            <p className="text-sm text-slate-600 dark:text-[#8b949e] leading-relaxed line-clamp-2 mb-3">
              {post.excerpt}
            </p>
          </div>

          {/* Metadata Footer */}
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
        </div>
      </Link>
    </article>
  );
};

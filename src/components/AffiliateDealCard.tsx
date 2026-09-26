import React from 'react';
import { ShoppingCart, ShoppingBag, ExternalLink, Sparkles } from 'lucide-react';

interface AffiliateDealCardProps {
  title: string;
  highlight?: string;
  affiliateLinks?: {
    amazon?: string;
    flipkart?: string;
  };
}

export const AffiliateDealCard: React.FC<AffiliateDealCardProps> = ({
  title,
  highlight,
  affiliateLinks,
}) => {
  if (!affiliateLinks?.amazon && !affiliateLinks?.flipkart) {
    return null;
  }

  return (
    <div className="my-8 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#161b22] border border-accent/30 shadow-sm relative overflow-hidden transition-colors">
      {/* Editorial badge */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 mb-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Editor's Deal Pick</span>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-[#8b949e]">Live Verified Pricing</span>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-[#f0f6fc] mb-1.5">{title}</h3>
        {highlight && (
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8b949e]">
            <span className="font-semibold text-slate-800 dark:text-[#c9d1d9]">Key Highlights:</span> {highlight}
          </p>
        )}
      </div>

      {/* Affiliate CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
        {affiliateLinks.amazon && (
          <a
            href={affiliateLinks.amazon}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-sm transition-all duration-150 transform active:scale-[0.98]"
          >
            <ShoppingCart className="w-4 h-4 text-slate-950" />
            <span>Check Price on Amazon.in</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        )}

        {affiliateLinks.flipkart && (
          <a
            href={affiliateLinks.flipkart}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all duration-150 transform active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span>View on Flipkart</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        )}
      </div>

      <div className="mt-3 text-[11px] text-slate-500 dark:text-[#8b949e] text-center sm:text-left">
        * When you purchase through our links, Inkhel Tech may earn an affiliate commission at no extra cost to you.
      </div>
    </div>
  );
};

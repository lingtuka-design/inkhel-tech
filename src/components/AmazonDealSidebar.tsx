import React from 'react';
import { ShoppingCart, ExternalLink, Flame, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface AmazonDealSidebarProps {
  dealUrl?: string;
}

export const AmazonDealSidebar: React.FC<AmazonDealSidebarProps> = ({
  dealUrl = 'https://link.amazon/B03OFfaXS',
}) => {
  return (
    <aside className="space-y-6">
      {/* Main Deal Card */}
      <div className="rounded-2xl bg-white dark:bg-[#161b22] border border-amber-500/30 dark:border-amber-500/25 p-5 shadow-sm relative overflow-hidden transition-all duration-200 hover:border-amber-500/50">
        
        {/* Glow ambient background accent */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Badge */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-white/10 mb-4">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>Amazon Deal of the Day</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-[10px] tracking-wide uppercase">
            64% OFF
          </span>
        </div>

        {/* Product Image with Discount Badge */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-[#0d1117] border border-slate-200/60 dark:border-white/10 mb-4 group">
          <img
            src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80"
            alt="E GATE Atom 3X 4K Home Cinema Projector"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2.5 left-2.5">
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[11px] shadow-sm">
              SAVE ₹14,000
            </span>
          </div>
          <div className="absolute bottom-2.5 right-2.5">
            <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-white font-mono text-[10px]">
              ⭐ 4.3 (Amazon Choice)
            </span>
          </div>
        </div>

        {/* Title & Short Description */}
        <div className="mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#8b949e]">
            Home Entertainment · Projector
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-[#f0f6fc] leading-snug mt-0.5 line-clamp-2">
            E GATE Atom 3X Projector 4K Ultra HD Native 1080p
          </h3>
          <p className="text-xs text-slate-600 dark:text-[#8b949e] mt-1 line-clamp-2">
            Rotatable Design, Android Netflix Prime, ARC-HDMI, WiFi-6 & BT Screen Mirroring.
          </p>
        </div>

        {/* Key Feature Chips */}
        <div className="grid grid-cols-2 gap-1.5 mb-4 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>4K / Native 1080p</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>300 ISO Lumens</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Netflix & Prime</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>WiFi-6 & Bluetooth</span>
          </div>
        </div>

        {/* Price & Savings */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0d1117] border border-slate-200/80 dark:border-white/10 mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              ₹7,990
            </span>
            <span className="text-xs text-slate-400 line-through font-mono">
              ₹21,990
            </span>
            <span className="ml-auto text-xs font-bold text-emerald-600 dark:text-emerald-400">
              64% off
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-[#8b949e] mt-0.5">
            Inclusive of all taxes · Free Prime Delivery
          </p>
        </div>

        {/* Main CTA Button */}
        <a
          href={dealUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-md transition-all duration-150 transform active:scale-[0.98]"
        >
          <ShoppingCart className="w-4 h-4 text-slate-950" />
          <span>Check Deal on Amazon</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </a>

        {/* Micro footer */}
        <div className="mt-3 text-center">
          <span className="text-[10px] text-slate-400 dark:text-[#8b949e]">
            * Price & availability subject to change on Amazon.in
          </span>
        </div>
      </div>

      {/* Quick Category Deals Promo Box */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white p-5 border border-white/10 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-accent">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Electronics Deals Hub</span>
        </div>
        <h4 className="text-sm font-bold text-white mb-1">
          Amazon Great Tech Offers
        </h4>
        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          Smartphones, Earbuds, Smartwatches leh Laptops discount man tlawm zualte en kual rawh le.
        </p>
        <a
          href={dealUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white border border-white/10 transition-colors"
        >
          <span>Explore All Tech Deals</span>
          <ArrowRight className="w-3.5 h-3.5 text-accent" />
        </a>
      </div>
    </aside>
  );
};

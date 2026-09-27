import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, Star } from 'lucide-react';

interface TrendingPhone {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  discountText?: string;
  platform: 'amazon' | 'flipkart';
  imageUrl: string;
  rating?: number;
  url: string;
  isTopDeal?: boolean;
}

const DEFAULT_PHONES: TrendingPhone[] = [
  {
    id: '1',
    name: 'iPhone 16 Pro (256 GB) - Natural Titanium',
    price: '₹1,19,900',
    originalPrice: '₹1,29,900',
    discountText: 'Flat ₹10,000 Discount*',
    platform: 'amazon',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=300&q=80',
    rating: 4.6,
    url: 'https://link.amazon/B03OFfaXS',
    isTopDeal: true,
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB)',
    price: '₹1,21,999',
    originalPrice: '₹1,34,999',
    discountText: 'Flat ₹13,000 Discount*',
    platform: 'amazon',
    imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=300&q=80',
    rating: 4.5,
    url: 'https://link.amazon/B03OFfaXS',
  },
  {
    id: '3',
    name: 'OnePlus 12 (16GB RAM, 512GB) - Silky Black',
    price: '₹64,999',
    originalPrice: '₹69,999',
    discountText: 'Flat ₹5,000 Discount*',
    platform: 'amazon',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=300&q=80',
    rating: 4.4,
    url: 'https://link.amazon/B03OFfaXS',
  },
  {
    id: '4',
    name: 'Motorola Edge 50 Pro 5G (8GB RAM, 256GB)',
    price: '₹29,999',
    originalPrice: '₹36,999',
    discountText: 'Special Price',
    platform: 'flipkart',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
    rating: 4.3,
    url: 'https://link.amazon/B03OFfaXS',
  },
  {
    id: '5',
    name: 'Samsung Galaxy M35 5G (6GB RAM, 128GB)',
    price: '₹15,999',
    originalPrice: '₹19,999',
    discountText: 'Flat ₹4,000 Off*',
    platform: 'amazon',
    imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=300&q=80',
    rating: 4.2,
    url: 'https://link.amazon/B03OFfaXS',
  },
  {
    id: '6',
    name: 'Realme GT 6T 5G (8GB RAM, 128GB)',
    price: '₹30,999',
    originalPrice: '₹33,999',
    discountText: 'Flat ₹3,000 Discount*',
    platform: 'amazon',
    imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=300&q=80',
    rating: 4.4,
    url: 'https://link.amazon/B03OFfaXS',
  },
  {
    id: '7',
    name: 'Redmi Note 13 Pro+ 5G (8GB, 256GB)',
    price: '₹27,999',
    originalPrice: '₹31,999',
    discountText: 'Limited Deal',
    platform: 'amazon',
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&q=80',
    rating: 4.3,
    url: 'https://link.amazon/B03OFfaXS',
  },
];

interface AmazonDealSidebarProps {
  dealUrl?: string;
}

export const AmazonDealSidebar: React.FC<AmazonDealSidebarProps> = ({
  dealUrl = 'https://link.amazon/B03OFfaXS',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPhones = useMemo(() => {
    if (!searchTerm.trim()) return DEFAULT_PHONES;
    const term = searchTerm.toLowerCase();
    return DEFAULT_PHONES.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.platform.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  return (
    <aside className="rounded-2xl overflow-hidden bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 shadow-sm">
      
      {/* 1. Red Header Banner (Matching user reference) */}
      <div className="bg-[#d30f0f] px-4 py-3 flex items-center justify-between">
        <h3 className="text-white font-black text-sm tracking-wider uppercase flex items-center gap-1.5">
          <span>⚡ TRENDING PRODUCTS »</span>
        </h3>
        <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded">
          Mobiles
        </span>
      </div>

      {/* 2. Search Input */}
      <div className="p-3 bg-slate-50 dark:bg-[#0d1117] border-b border-slate-200 dark:border-white/10">
        <div className="relative">
          <Search className="w-4 h-4 text-rose-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search phone (e.g. iPhone, Samsung)..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#161b22] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rose-600 font-sans"
          />
        </div>
      </div>

      {/* 3. Product List */}
      <div className="divide-y divide-slate-100 dark:divide-white/[0.06]">
        {filteredPhones.map((phone) => {
          const itemUrl = phone.url || dealUrl;
          return (
            <div
              key={phone.id}
              className={`p-3.5 flex items-start gap-3 transition-colors ${
                phone.isTopDeal
                  ? 'bg-amber-50/70 dark:bg-amber-500/[0.07]'
                  : 'hover:bg-slate-50/80 dark:hover:bg-white/[0.02]'
              }`}
            >
              {/* Product Thumbnail */}
              <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0d1117] shrink-0 p-1 flex items-center justify-center shadow-xs">
                <img
                  src={phone.imageUrl}
                  alt={phone.name}
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
                {phone.rating && (
                  <div className="absolute bottom-1 left-1 bg-white/95 dark:bg-black/90 px-1 py-0.5 rounded text-[9px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-0.5 shadow-xs border border-slate-200 dark:border-white/10">
                    <span>{phone.rating}</span>
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                <div>
                  <a
                    href={itemUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="text-xs font-bold text-slate-900 dark:text-[#f0f6fc] hover:text-rose-600 dark:hover:text-rose-400 transition-colors line-clamp-2 leading-snug"
                  >
                    {phone.name}
                  </a>

                  {/* Price & Discount */}
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mt-1.5">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {phone.price}
                    </span>
                    {phone.discountText && (
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {phone.discountText}
                      </span>
                    )}
                  </div>
                </div>

                {/* Platform Badge & Buy Now Button */}
                <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-slate-100 dark:border-white/5">
                  {/* Platform Logo */}
                  {phone.platform === 'amazon' ? (
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 tracking-tight flex items-center">
                      amazon<span className="text-amber-500 font-black">.in</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-tight">
                      Flipkart ⚡
                    </span>
                  )}

                  {/* BUY NOW Button */}
                  <a
                    href={itemUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#d30f0f] hover:bg-[#b00c0c] text-white text-[11px] font-black uppercase tracking-wider shadow-xs transition-transform duration-100 active:scale-95"
                  >
                    <span>BUY NOW</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Footer link to see all deals */}
      <div className="p-3 bg-slate-50/80 dark:bg-[#0d1117]/80 border-t border-slate-200 dark:border-white/10 text-center">
        <a
          href={dealUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 inline-flex items-center gap-1.5 transition-colors"
        >
          <span>View All Trending Tech Deals »</span>
        </a>
      </div>
    </aside>
  );
};

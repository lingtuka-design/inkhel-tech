import React from 'react';
import { useCategories } from '../data/postsStore';

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { categories } = useCategories();
  const allCategories = ['All', ...categories];

  return (
    <div className="border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0d1117]/85 sticky top-16 z-40 backdrop-blur-md transition-colors duration-150">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center space-x-2 py-3 overflow-x-auto no-scrollbar scroll-smooth">
          {allCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`whitespace-nowrap px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-150 flex items-center gap-1.5 select-none ${
                  isActive
                    ? 'bg-accent text-slate-950 font-bold shadow-sm shadow-accent/20'
                    : 'text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200/80 dark:border-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

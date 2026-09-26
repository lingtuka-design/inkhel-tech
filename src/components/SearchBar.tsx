import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  inputRef,
}) => {
  return (
    <div className="relative w-full max-w-xl mx-auto mb-8">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-[#8b949e]">
          <Search className="w-4 h-4" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search articles…"
          className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-[#f0f6fc] placeholder-slate-400 dark:placeholder-[#8b949e] focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all shadow-sm"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

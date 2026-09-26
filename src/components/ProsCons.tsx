import React from 'react';
import { Check, X } from 'lucide-react';

interface ProsConsProps {
  pros?: string[];
  cons?: string[];
}

export const ProsCons: React.FC<ProsConsProps> = ({ pros, cons }) => {
  const hasPros = pros && pros.length > 0;
  const hasCons = cons && cons.length > 0;

  if (!hasPros && !hasCons) return null;

  return (
    <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {/* Pros Column */}
      {hasPros && (
        <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 shadow-sm transition-colors">
          <h4 className="text-base font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="p-1 rounded-full bg-emerald-200/60 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </span>
            Pros
          </h4>
          <ul className="space-y-3">
            {pros.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-[#c9d1d9] leading-relaxed">
                <span className="mt-1 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Cons Column */}
      {hasCons && (
        <div className="p-5 sm:p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 shadow-sm transition-colors">
          <h4 className="text-base font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="p-1 rounded-full bg-rose-200/60 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400">
              <X className="w-3.5 h-3.5 stroke-[3]" />
            </span>
            Cons
          </h4>
          <ul className="space-y-3">
            {cons.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-[#c9d1d9] leading-relaxed">
                <span className="mt-1 text-rose-600 dark:text-rose-400 font-bold shrink-0">×</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

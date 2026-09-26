import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';

interface AuthorBioProps {
  author?: string;
}

export const AuthorBio: React.FC<AuthorBioProps> = ({ author = 'Inkhel Tech Editorial' }) => {
  return (
    <section className="my-10 p-6 rounded-2xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
        {/* Author Avatar */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-accent to-emerald-600 p-0.5 shrink-0 shadow-sm">
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-accent font-black text-xl">
            IT
          </div>
        </div>

        {/* Bio details */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              <h4 className="text-base font-bold text-slate-900 dark:text-[#f0f6fc]">{author}</h4>
              <span title="Verified Editorial" className="inline-flex items-center">
                <ShieldCheck className="w-4 h-4 text-accent" />
              </span>
            </div>
            <span className="text-xs text-accent font-semibold">Independent Technology Desk</span>
          </div>

          <p className="text-sm text-slate-600 dark:text-[#8b949e] leading-relaxed">
            Inkhel Tech is a technology publication covering smartphones, gadgets, buying guides, deals, and useful technology updates for readers in Mizoram and beyond. Our tests are conducted independently with genuine consumer-focused recommendations.
          </p>

          <div className="pt-2 flex items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-slate-500 dark:text-[#8b949e]">
            <a
              href="https://inkhel.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent flex items-center gap-1 transition-colors"
            >
              Inkhel Network <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="mailto:contact@inkhel.com"
              className="hover:text-accent transition-colors"
            >
              Contact Editorial
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';

interface InArticleAdProps {
  slotId?: string;
}

export const InArticleAd: React.FC<InArticleAdProps> = ({
  slotId = 'inkhel-in-article-middle',
}) => {
  return (
    <div
      className="my-10 py-4 px-3 sm:px-6 rounded-xl border border-editorial-borderSubtle bg-background-card/50 flex flex-col items-center justify-center text-center not-prose"
      data-ad-slot={slotId}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="h-px w-6 bg-editorial-borderSubtle"></span>
        <span className="text-[10px] uppercase tracking-widest text-editorial-muted/70 font-semibold">
          Sponsored Story / Advertisement
        </span>
        <span className="h-px w-6 bg-editorial-borderSubtle"></span>
      </div>

      <div className="w-full max-w-xl min-h-[140px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-lg bg-background-darker/50 p-4">
        <p className="text-xs text-editorial-muted font-mono mb-1">
          In-Article Fluid AdSense Slot
        </p>
        <p className="text-[11px] text-editorial-muted/60">
          Slot ID: {slotId} · Responsive Native Ad
        </p>
      </div>
    </div>
  );
};

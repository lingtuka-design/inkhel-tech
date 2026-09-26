import React, { useEffect, useRef } from 'react';
import { ADSENSE_CLIENT_ID } from './AdBanner';

interface InArticleAdProps {
  slotId?: string;
  className?: string;
}

export const InArticleAd: React.FC<InArticleAdProps> = ({
  slotId,
  className = '',
}) => {
  const isPushed = useRef(false);

  useEffect(() => {
    if (isPushed.current) return;

    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isPushed.current = true;
      }
    } catch (err) {
      console.warn('AdSense push error in InArticleAd:', err);
    }
  }, [slotId]);

  const isNumericSlot = slotId && /^\d+$/.test(slotId);

  return (
    <div
      className={`my-10 py-4 px-2 sm:px-4 rounded-xl border border-slate-200/70 dark:border-white/5 bg-slate-50/60 dark:bg-white/[0.02] flex flex-col items-center justify-center text-center not-prose transition-all ${className}`}
      data-ad-component="in-article-ad"
    >
      <div className="flex items-center gap-2 mb-2 select-none">
        <span className="h-px w-6 bg-slate-200 dark:bg-white/10"></span>
        <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold">
          Advertisement
        </span>
        <span className="h-px w-6 bg-slate-200 dark:bg-white/10"></span>
      </div>

      <div className="w-full max-w-2xl flex justify-center items-center min-h-[100px] overflow-hidden">
        <ins
          className="adsbygoogle block w-full text-center"
          style={{ display: 'block', textAlign: 'center', minHeight: '90px' }}
          data-ad-client={ADSENSE_CLIENT_ID}
          {...(isNumericSlot ? { 'data-ad-slot': slotId } : {})}
          data-ad-format="fluid"
          data-ad-layout="in-article"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};

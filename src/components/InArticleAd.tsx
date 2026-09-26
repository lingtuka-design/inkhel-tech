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
  const isNumericSlot = slotId && /^\d+$/.test(slotId);

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

  return (
    <div
      className={`my-8 py-2 w-full flex flex-col items-center justify-center text-center not-prose overflow-hidden transition-all ${className}`}
      data-ad-component="in-article-ad"
    >
      <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold mb-1.5 select-none">
        Advertisement
      </span>

      <div className="w-full max-w-3xl flex justify-center items-center overflow-hidden">
        <ins
          className="adsbygoogle block w-full text-center"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={isNumericSlot ? slotId : 'auto'}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};

import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export const ADSENSE_CLIENT_ID = 'ca-pub-2343866392435128';

interface AdBannerProps {
  slotId?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  responsive?: boolean;
  className?: string;
  label?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotId,
  format = 'auto',
  responsive = true,
  className = '',
  label = 'Advertisement',
}) => {
  const isPushed = useRef(false);

  useEffect(() => {
    // Only push once per mounted ins instance
    if (isPushed.current) return;

    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isPushed.current = true;
      }
    } catch (err) {
      // Ad blockers or offline mode gracefully caught
      console.warn('AdSense push error in AdBanner:', err);
    }
  }, [slotId]);

  const isNumericSlot = slotId && /^\d+$/.test(slotId);

  return (
    <div
      className={`my-8 flex flex-col items-center justify-center text-center not-prose ${className}`}
      data-ad-component="ad-banner"
    >
      <span className="text-[10px] tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-1.5 font-semibold select-none">
        {label}
      </span>

      <div className="w-full max-w-4xl flex justify-center items-center min-h-[90px] overflow-hidden rounded-xl bg-slate-100/70 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5 p-2 transition-all">
        <ins
          className="adsbygoogle block w-full text-center"
          style={{
            display: 'block',
            minHeight: format === 'rectangle' ? '250px' : '90px',
          }}
          data-ad-client={ADSENSE_CLIENT_ID}
          {...(isNumericSlot ? { 'data-ad-slot': slotId } : {})}
          data-ad-format={format === 'rectangle' ? 'rectangle' : 'auto'}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    </div>
  );
};

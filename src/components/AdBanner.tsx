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
  const isNumericSlot = Boolean(slotId && /^\d+$/.test(slotId));

  useEffect(() => {
    if (!isNumericSlot || isPushed.current) return;

    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isPushed.current = true;
      }
    } catch (err) {
      console.warn('AdSense push error in AdBanner:', err);
    }
  }, [slotId, isNumericSlot]);

  // If no specific numeric Ad Unit slot ID is provided, let Google Auto Ads handle page placements automatically
  if (!isNumericSlot) {
    return null;
  }

  return (
    <div
      className={`my-8 py-2 w-full flex flex-col items-center justify-center text-center not-prose overflow-hidden transition-all ${className}`}
      data-ad-component="ad-banner"
    >
      <span className="text-[10px] tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-1.5 font-semibold select-none">
        {label}
      </span>

      <div className="w-full max-w-4xl flex justify-center items-center overflow-hidden">
        <ins
          className="adsbygoogle block w-full text-center"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slotId}
          data-ad-format={format === 'rectangle' ? 'rectangle' : 'auto'}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    </div>
  );
};

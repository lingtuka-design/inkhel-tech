import React from 'react';

interface AdBannerProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotId = 'inkhel-ad-slot-default',
  format = 'horizontal',
  className = '',
}) => {
  return (
    <div
      className={`my-8 p-3 rounded-xl border border-white/5 bg-background-card/40 flex flex-col items-center justify-center text-center ${className}`}
      data-ad-slot={slotId}
    >
      <span className="text-[10px] uppercase tracking-widest text-editorial-muted/60 mb-1.5 font-semibold">
        Advertisement
      </span>

      {/* Ad Placeholder Box (Ready for Google AdSense <ins class="adsbygoogle" ...>) */}
      <div
        className={`w-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-lg bg-white/[0.015] p-6 ${
          format === 'horizontal' ? 'min-h-[100px] max-w-4xl' : 'min-h-[250px] max-w-sm'
        }`}
      >
        <span className="text-xs text-editorial-muted font-mono">
          Ad Space ({format === 'horizontal' ? '728x90 Leaderboard / Responsive' : '300x250 Rectangle'})
        </span>
        <span className="text-[11px] text-editorial-muted/60 mt-1">
          Google AdSense Placement Slot #{slotId}
        </span>
      </div>
    </div>
  );
};

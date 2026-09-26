import React from 'react';
import { Cpu, Smartphone, Camera, Battery, Zap, CheckCircle2 } from 'lucide-react';

interface QuickSpecsProps {
  specs?: {
    display?: string;
    processor?: string;
    camera?: string;
    battery?: string;
    charging?: string;
    [key: string]: string | undefined;
  };
}

export const QuickSpecs: React.FC<QuickSpecsProps> = ({ specs }) => {
  if (!specs || Object.keys(specs).length === 0) return null;

  const specIcon = (key: string) => {
    const k = key.toLowerCase();
    if (k.includes('display') || k.includes('screen')) return <Smartphone className="w-4 h-4 text-accent" />;
    if (k.includes('processor') || k.includes('chip') || k.includes('soc')) return <Cpu className="w-4 h-4 text-accent" />;
    if (k.includes('camera')) return <Camera className="w-4 h-4 text-accent" />;
    if (k.includes('battery')) return <Battery className="w-4 h-4 text-accent" />;
    if (k.includes('charge') || k.includes('charging')) return <Zap className="w-4 h-4 text-accent" />;
    return <CheckCircle2 className="w-4 h-4 text-accent" />;
  };

  const formatKey = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="my-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#161b22] p-5 sm:p-6 shadow-sm transition-colors">
      <h3 className="text-base font-bold text-slate-900 dark:text-[#f0f6fc] uppercase tracking-wider mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent"></span>
        Quick Specs
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        {Object.entries(specs).map(([key, value]) => {
          if (!value) return null;
          return (
            <div
              key={key}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200/80 dark:border-white/5 flex items-start gap-3"
            >
              <div className="mt-0.5 p-1.5 rounded-lg bg-accent/10 border border-accent/20">
                {specIcon(key)}
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-[#8b949e] uppercase tracking-wider block mb-0.5">
                  {formatKey(key)}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-[#f0f6fc] leading-snug break-words">
                  {value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

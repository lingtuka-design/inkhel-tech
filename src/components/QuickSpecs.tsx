import React from 'react';
import {
  Cpu,
  Smartphone,
  Laptop,
  Tablet,
  Camera,
  Watch,
  Mic,
  Headphones,
  Battery,
  Zap,
  HardDrive,
  Monitor,
  Layers,
  Aperture,
  Wifi,
  Sparkles,
} from 'lucide-react';

interface QuickSpecsProps {
  specs?: Record<string, string | undefined>;
}

export const QuickSpecs: React.FC<QuickSpecsProps> = ({ specs }) => {
  if (!specs || typeof specs !== 'object') return null;

  const validEntries = Object.entries(specs).filter(
    ([_, val]) => typeof val === 'string' && val.trim() !== ''
  );

  if (validEntries.length === 0) return null;

  const specIcon = (key: string) => {
    const k = key.toLowerCase();

    // 1. Audio & Microphones
    if (k.includes('mic') || k.includes('microphone') || k.includes('polar pattern'))
      return <Mic className="w-4 h-4 text-accent" />;
    if (k.includes('audio') || k.includes('driver') || k.includes('headphone') || k.includes('earbud') || k.includes('anc') || k.includes('noise'))
      return <Headphones className="w-4 h-4 text-accent" />;

    // 2. Camera & Imaging
    if (k.includes('camera') || k.includes('sensor') || k.includes('lens') || k.includes('megapixels'))
      return <Camera className="w-4 h-4 text-accent" />;
    if (k.includes('iso') || k.includes('aperture') || k.includes('shutter') || k.includes('autofocus') || k.includes('stabilization') || k.includes('ibis'))
      return <Aperture className="w-4 h-4 text-accent" />;

    // 3. Computing & Hardware
    if (k.includes('gpu') || k.includes('graphics') || k.includes('card'))
      return <Layers className="w-4 h-4 text-accent" />;
    if (k.includes('ram') || k.includes('storage') || k.includes('ssd') || k.includes('hdd') || k.includes('rom') || k.includes('memory'))
      return <HardDrive className="w-4 h-4 text-accent" />;
    if (k.includes('processor') || k.includes('cpu') || k.includes('chip') || k.includes('soc'))
      return <Cpu className="w-4 h-4 text-accent" />;

    // 4. Displays & Screens
    if (k.includes('display') || k.includes('screen') || k.includes('resolution') || k.includes('panel') || k.includes('oled') || k.includes('hz'))
      return <Monitor className="w-4 h-4 text-accent" />;

    // 5. Smartwatch & Health
    if (k.includes('watch') || k.includes('health') || k.includes('heart') || k.includes('fitness') || k.includes('sensor'))
      return <Watch className="w-4 h-4 text-accent" />;

    // 6. Form Factor devices
    if (k.includes('tablet') || k.includes('ipad') || k.includes('stylus') || k.includes('pencil'))
      return <Tablet className="w-4 h-4 text-accent" />;
    if (k.includes('laptop') || k.includes('notebook') || k.includes('macbook'))
      return <Laptop className="w-4 h-4 text-accent" />;
    if (k.includes('phone') || k.includes('mobile'))
      return <Smartphone className="w-4 h-4 text-accent" />;

    // 7. Power & Battery
    if (k.includes('battery') || k.includes('backup') || k.includes('mah') || k.includes('endurance'))
      return <Battery className="w-4 h-4 text-accent" />;
    if (k.includes('charge') || k.includes('charging') || k.includes('watt') || k.includes('power') || k.includes('fast'))
      return <Zap className="w-4 h-4 text-accent" />;

    // 8. Connectivity
    if (k.includes('wifi') || k.includes('bluetooth') || k.includes('connect') || k.includes('port') || k.includes('usb'))
      return <Wifi className="w-4 h-4 text-accent" />;

    return <Sparkles className="w-4 h-4 text-accent" />;
  };

  const formatKey = (key: string) => {
    // If the key already has uppercase letters or spaces, preserve it; otherwise format nicely
    if (key.includes(' ') || /[A-Z]/.test(key)) {
      return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).trim();
    }
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  return (
    <div className="my-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#161b22] p-5 sm:p-6 shadow-sm transition-colors">
      <h3 className="text-base font-bold text-slate-900 dark:text-[#f0f6fc] uppercase tracking-wider mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent"></span>
        <span>Hardware Specifications</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        {validEntries.map(([key, value]) => {
          return (
            <div
              key={key}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090d13] border border-slate-200/80 dark:border-white/5 flex items-start gap-3 hover:border-accent/40 transition-colors"
            >
              <div className="mt-0.5 p-1.5 rounded-lg bg-accent/10 border border-accent/20 shrink-0">
                {specIcon(key)}
              </div>
              <div className="min-w-0 flex-1">
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

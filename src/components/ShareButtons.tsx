import React, { useState } from 'react';
import { MessageCircle, Copy, Check, Share2 } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url }) => {
  const [copied, setCopied] = useState(false);

  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${title} — ${currentUrl}`
  )}`;

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    currentUrl
  )}`;

  return (
    <div className="my-8 py-5 border-y border-slate-200 dark:border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#8b949e]">
          <Share2 className="w-4 h-4 text-accent" />
          <span>Share This Article</span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 transition-colors duration-150 min-h-[44px]"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp</span>
          </a>

          {/* Facebook */}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#1877F2]/15 hover:bg-[#1877F2]/25 text-[#1877F2] border border-[#1877F2]/30 transition-colors duration-150 min-h-[44px]"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Facebook</span>
          </a>

          {/* Copy Link */}
          <button
            onClick={handleCopy}
            aria-label="Copy article link"
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 min-h-[44px] ${
              copied
                ? 'bg-accent/20 text-accent border-accent/40'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-[#c9d1d9] border-slate-200 dark:border-white/10'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-accent" />
                <span className="text-accent font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

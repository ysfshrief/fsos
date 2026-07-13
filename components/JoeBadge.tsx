'use client';

interface Props {
  variant?: 'footer' | 'compact';
}

/**
 * Joe Industries brand badge — inline SVG monogram (JI) + wordmark.
 * Self-contained, no external image needed.
 */
export default function JoeBadge({ variant = 'footer' }: Props) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className="inline-flex items-center gap-2 group select-none"
      aria-label="Designed & Developed by Youssef Shrief — Joe Industries"
    >
      <svg width="26" height="26" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform group-hover:scale-110">
        <defs>
          <linearGradient id="ji-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E4BE4A" />
            <stop offset="1" stopColor="#C9A227" />
          </linearGradient>
        </defs>
        {/* hexagon frame */}
        <path d="M24 2 L42 12.5 V35.5 L24 46 L6 35.5 V12.5 Z"
          stroke="url(#ji-grad)" strokeWidth="2" fill="rgba(201,162,39,0.08)" strokeLinejoin="round" />
        {/* J */}
        <path d="M20 15 V29 a4 4 0 0 1 -8 0"
          stroke="url(#ji-grad)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        {/* I */}
        <path d="M30 15 V33" stroke="url(#ji-grad)" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="30" cy="11" r="1.8" fill="url(#ji-grad)" />
      </svg>
      <span className="leading-tight">
        <span className="block text-[11px] font-bold tracking-wide text-gold-light">JOE INDUSTRIES</span>
        {variant === 'footer' && (
          <span className="block text-[9px] text-white/40">Designed &amp; Developed by Youssef Shrief</span>
        )}
      </span>
    </a>
  );
}

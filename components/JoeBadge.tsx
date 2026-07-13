'use client';
import Image from 'next/image';

interface Props {
  /** 'dark' → use silver logo (for dark backgrounds). 'light' → use gunmetal logo (for light backgrounds). */
  tone?: 'dark' | 'light';
  width?: number;
}

/**
 * Joe Industries brand logo — real metallic wordmark.
 * Uses the silver variant on dark backgrounds and the gunmetal variant on light ones.
 */
export default function JoeBadge({ tone = 'dark', width = 150 }: Props) {
  const src = tone === 'dark' ? '/joe-industries.png' : '/joe-industries-dark.png';
  const height = Math.round(width * (114 / 755)); // preserve aspect ratio
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className="inline-flex flex-col items-center gap-1 group select-none"
      aria-label="Designed & Developed by Youssef Shrief — Joe Industries"
    >
      <Image
        src={src}
        alt="Joe Industries"
        width={width}
        height={height}
        className="object-contain transition-transform group-hover:scale-105"
      />
      <span className={`text-[9px] tracking-wide ${tone === 'dark' ? 'text-white/40' : 'text-gray-400'}`}>
        Designed &amp; Developed by Youssef Shrief
      </span>
    </a>
  );
}

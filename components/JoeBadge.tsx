'use client';
import Image from 'next/image';

interface Props {
  width?: number;
}

/**
 * Joe Industries brand badge — real metallic wordmark on its own dark rounded panel.
 * Single self-contained asset that reads cleanly on both light and dark backgrounds.
 */
export default function JoeBadge({ width = 150 }: Props) {
  const height = Math.round(width * (193 / 820)); // preserve aspect ratio
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className="inline-flex flex-col items-center gap-1 group select-none"
      aria-label="Designed & Developed by Youssef Shrief — Joe Industries"
    >
      <Image
        src="/joe-industries.png"
        alt="Joe Industries"
        width={width}
        height={height}
        className="object-contain rounded-lg shadow-sm transition-transform group-hover:scale-105"
      />
      <span className="text-[9px] tracking-wide text-gray-400">
        Designed &amp; Developed by Youssef Shrief
      </span>
    </a>
  );
}

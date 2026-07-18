'use client';
import { useState } from 'react';
import { resolveImageUrl, FALLBACK_IMAGE } from '@/lib/drive';

interface Props {
  src?: string | null;
  alt?: string;
  className?: string;
  /** Fallback shown while empty or on error. Defaults to school logo. */
  fallback?: string;
}

/**
 * Renders an image from a pasted Google Drive share link (or any direct URL).
 * Uses a plain <img> (not next/image) because Drive hosts are dynamic and
 * admins paste arbitrary links. Falls back gracefully on error.
 */
export default function DriveImage({ src, alt = '', className = '', fallback = FALLBACK_IMAGE }: Props) {
  const [errored, setErrored] = useState(false);
  const resolved = errored ? fallback : resolveImageUrl(src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}

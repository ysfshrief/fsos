/**
 * Google Drive link helper.
 * Converts any Google Drive share link into a directly-embeddable image URL,
 * so admins can just paste a normal "share" link and it renders on the site.
 *
 * Supported input formats:
 *   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *   https://drive.google.com/open?id=FILE_ID
 *   https://drive.google.com/uc?id=FILE_ID
 *   https://drive.google.com/thumbnail?id=FILE_ID
 *   (also passes through non-Drive URLs unchanged, e.g. direct image links)
 */

const FALLBACK_IMAGE = '/logo.png';

/** Extract the Drive file id from any supported link shape. */
export function extractDriveId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,       // /file/d/ID/view
    /[?&]id=([a-zA-Z0-9_-]+)/,           // ?id=ID or &id=ID
    /\/d\/([a-zA-Z0-9_-]+)/,             // /d/ID
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m && m[1]) return m[1];
  }
  return null;
}

/**
 * Resolve any pasted link (Drive share link OR direct image URL) into a
 * URL that can be used directly in <img src>.
 */
export function resolveImageUrl(url?: string | null): string {
  if (!url || !url.trim()) return FALLBACK_IMAGE;
  const trimmed = url.trim();

  // Already a direct image / non-Drive URL → use as-is
  if (!trimmed.includes('drive.google.com')) return trimmed;

  const id = extractDriveId(trimmed);
  if (!id) return trimmed; // unknown Drive shape, let the browser try

  // Drive's image-serving endpoint (works for public/anyone-with-link files)
  return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
}

/** True if the string looks like a usable image link (Drive or direct). */
export function isValidImageLink(url?: string | null): boolean {
  if (!url || !url.trim()) return false;
  const t = url.trim();
  if (t.includes('drive.google.com')) return extractDriveId(t) !== null;
  return /^https?:\/\/.+/i.test(t);
}

export { FALLBACK_IMAGE };

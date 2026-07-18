import type { ActivityCategory } from '@/lib/types';

export const activityCategories: { key: ActivityCategory; tKey: string; icon: string }[] = [
  { key: 'sports', tKey: 'catSports', icon: '⚽' },
  { key: 'arts', tKey: 'catArts', icon: '🎨' },
  { key: 'cultural', tKey: 'catCultural', icon: '📖' },
  { key: 'trips', tKey: 'catTrips', icon: '🚌' },
  { key: 'competitions', tKey: 'catCompetitions', icon: '🏅' },
  { key: 'celebrations', tKey: 'catCelebrations', icon: '🎉' },
  { key: 'events', tKey: 'catEvents', icon: '📅' },
];

export const categoryMeta = (key: ActivityCategory) =>
  activityCategories.find((c) => c.key === key) ?? activityCategories[0];

/** Convert a Drive/YouTube video link to an embeddable URL. */
export function toEmbedUrl(url: string): string {
  if (!url) return '';
  // YouTube
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  // Google Drive
  const dr = url.match(/\/file\/d\/([\w-]+)/) || url.match(/[?&]id=([\w-]+)/);
  if (dr && url.includes('drive.google.com')) return `https://drive.google.com/file/d/${dr[1]}/preview`;
  return url;
}

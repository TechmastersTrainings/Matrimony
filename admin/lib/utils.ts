/**
 * Returns a fully qualified accessible URL for a photo in admin dashboard.
 */
export function getPhotoUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const cleanPath = url.replace(/^\/+/, '');
  return `http://localhost:8000/media/${cleanPath}`;
}

/**
 * Returns a fully qualified accessible URL for a photo.
 * If the path is relative (e.g. profiles/1/photos/xxx.jpg),
 * it points to the backend /media proxy.
 */
export function getPhotoUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const cleanPath = url.replace(/^\/+/, '');
  return `http://localhost:8000/media/${cleanPath}`;
}

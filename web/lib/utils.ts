/**
 * Fallback branded Christian Matrimony SVG avatar placeholder.
 */
export const DEFAULT_AVATAR_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 100 100'%3E%3Crect width='100%25' height='100%25' fill='%230f172a'/%3E%3Ccircle cx='50' cy='42' r='20' fill='%231e293b' stroke='%23f59e0b' stroke-width='1.5'/%3E%3Cpath d='M22 88c0-15.5 12.5-28 28-28s28 12.5 28 28' fill='%231e293b' stroke='%23f59e0b' stroke-width='1.5'/%3E%3Ctext x='50%25' y='46%25' dominant-baseline='middle' text-anchor='middle' fill='%23f59e0b' font-family='sans-serif' font-weight='bold' font-size='14'%3ECM%3C/text%3E%3C/svg%3E";

/**
 * Returns a fully qualified accessible HTTPS URL for a photo.
 * If the path is relative (e.g. profiles/1/photos/xxx.jpg) or points to localhost:8000,
 * it points to the production backend /media proxy.
 */
export function getPhotoUrl(url?: string | null): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return '';
  }

  const raw = url.trim();

  // Determine production backend base URL
  const backendBase = (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'https://matrimony-hxs5.onrender.com'
  )
    .replace(/\/api\/v1\/?$/, '')
    .replace(/\/+$/, '');

  // If already pointing to localhost:8000, rewrite to production backend
  if (raw.includes('localhost:8000')) {
    return raw.replace(/^https?:\/\/localhost:8000/, backendBase);
  }

  // If already a valid HTTPS URL (e.g. Cloudflare R2 public URL or Render URL)
  if (raw.startsWith('https://')) {
    return raw;
  }

  // Upgrade http to https for non-localhost URLs to prevent browser mixed-content blocking
  if (raw.startsWith('http://')) {
    return raw.replace(/^http:\/\//, 'https://');
  }

  // If relative path (e.g. "profiles/1/photos/abc.jpg" or "/media/profiles/1/photos/abc.jpg")
  const cleanPath = raw.replace(/^\/?(media\/)?/, '');
  return `${backendBase}/media/${cleanPath}`;
}

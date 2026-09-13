/**
 * Returns a fully qualified accessible HTTPS URL for a photo in admin dashboard.
 */
export function getPhotoUrl(url?: string | null): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return '';
  }

  const raw = url.trim();

  const backendBase = (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'https://matrimony-hxs5.onrender.com'
  )
    .replace(/\/api\/v1\/?$/, '')
    .replace(/\/+$/, '');

  if (raw.includes('localhost:8000')) {
    return raw.replace(/^https?:\/\/localhost:8000/, backendBase);
  }

  // If pointing to unconfigured media.christianmatrimony.app domain, rewrite to backend proxy
  if (raw.includes('media.christianmatrimony.app')) {
    const cleanPath = raw.replace(/^https?:\/\/media\.christianmatrimony\.app\/?/, '');
    return `${backendBase}/media/${cleanPath}`;
  }

  if (raw.startsWith('https://')) {
    return raw;
  }

  if (raw.startsWith('http://')) {
    return raw.replace(/^http:\/\//, 'https://');
  }

  const cleanPath = raw.replace(/^\/?(media\/)?/, '');
  return `${backendBase}/media/${cleanPath}`;
}

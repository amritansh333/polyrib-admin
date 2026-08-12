const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const joinBaseUrl = (baseUrl: string, assetPath: string) => {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const normalizedPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  return `${normalizedBase}${normalizedPath}`;
};

export const BLOG_FALLBACK_IMAGE =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225">
      <rect width="400" height="225" fill="#eef3f6"/>
      <rect x="145" y="72" width="110" height="70" rx="4" fill="#d7e2e8"/>
      <circle cx="175" cy="96" r="10" fill="#b7c8d2"/>
      <path d="M155 130l28-28 20 20 14-14 28 22H155z" fill="#9fb5c1"/>
      <text x="200" y="165" text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="12"
        fill="#71838e">
        No image
      </text>
    </svg>
  `);

export function resolveAdminAssetUrl(value?: string | null): string {
  if (!value) {
    return '/placeholder-image.png';
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith('/')) {
    return `${BACKEND_BASE_URL}${value}`;
  }

  return `${BACKEND_BASE_URL}/${value}`;
}

export function resolveBlogImageUrl(value?: string | null): string {
  if (!value || !value.trim()) {
    return BLOG_FALLBACK_IMAGE;
  }

  const trimmed = value.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const sanitized = trimmed
    .replace(/^\/+/, '')
    .replace(/^uploads\/blogs\//i, '')
    .replace(/^uploads\//i, '');

  return joinBaseUrl(BACKEND_BASE_URL, `/uploads/blogs/${sanitized}`);
}

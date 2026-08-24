/**
 * External Professional Profile Links Validation Engine
 * 
 * Validates platform-specific hostnames and URLs for LinkedIn, Upwork, Fiverr, GitHub, Portfolio, and Personal Website.
 * Strictly enforces HTTPS and blocks SSRF / XSS schemes.
 */

export type ExternalPlatform =
  | 'linkedin'
  | 'upwork'
  | 'fiverr'
  | 'github'
  | 'portfolio'
  | 'website';

export interface ValidationResult {
  isValid: boolean;
  sanitizedUrl?: string;
  platform?: ExternalPlatform;
  error?: string;
}

export const PLATFORM_CONFIG: Record<
  ExternalPlatform,
  {
    name: string;
    icon: string;
    brandColor: string;
    placeholder: string;
    allowedHosts: string[];
    pathValidator?: (pathname: string) => boolean;
  }
> = {
  linkedin: {
    name: 'LinkedIn',
    icon: '🔗',
    brandColor: '#0077b5',
    placeholder: 'https://linkedin.com/in/username',
    allowedHosts: ['linkedin.com', 'www.linkedin.com'],
    pathValidator: (path) => path.startsWith('/in/') || path.startsWith('/company/') || path.length > 2
  },
  upwork: {
    name: 'Upwork',
    icon: '💼',
    brandColor: '#14a800',
    placeholder: 'https://upwork.com/freelancers/~...',
    allowedHosts: ['upwork.com', 'www.upwork.com'],
    pathValidator: (path) => path.includes('/freelancers/') || path.includes('/fl/') || path.length > 2
  },
  fiverr: {
    name: 'Fiverr',
    icon: '⚡',
    brandColor: '#1dbf73',
    placeholder: 'https://fiverr.com/username',
    allowedHosts: ['fiverr.com', 'www.fiverr.com'],
    pathValidator: (path) => path.length > 1 && !path.startsWith('/categories')
  },
  github: {
    name: 'GitHub',
    icon: '🐙',
    brandColor: '#24292e',
    placeholder: 'https://github.com/username',
    allowedHosts: ['github.com', 'www.github.com'],
    pathValidator: (path) => path.length > 1
  },
  portfolio: {
    name: 'Portfolio',
    icon: '🌐',
    brandColor: '#8b5cf6',
    placeholder: 'https://myportfolio.dev',
    allowedHosts: [] // Any valid public domain
  },
  website: {
    name: 'Personal Website',
    icon: '💻',
    brandColor: '#000000',
    placeholder: 'https://mywebsite.com',
    allowedHosts: [] // Any valid public domain
  }
};

/**
 * Validates a profile URL for a specified platform
 */
export function validateExternalProfileUrl(
  urlInput: string,
  platform: ExternalPlatform
): ValidationResult {
  if (!urlInput || typeof urlInput !== 'string') {
    return { isValid: false, error: 'URL is required' };
  }

  const trimmed = urlInput.trim();
  const lower = trimmed.toLowerCase();

  // Reject dangerous schemes
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('file:') ||
    lower.startsWith('vbscript:')
  ) {
    return { isValid: false, error: 'Disallowed protocol scheme. Only HTTPS is permitted.' };
  }

  let parsed: URL;
  try {
    const withProtocol = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;

    parsed = new URL(withProtocol);
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }

  // Force HTTPS protocol
  parsed.protocol = 'https:';

  const host = parsed.hostname.toLowerCase();

  // Block localhost, loopbacks, and private/internal IP ranges
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host.startsWith('192.168.') ||
    host.startsWith('10.') ||
    host.startsWith('172.16.') ||
    host.endsWith('.local') ||
    host.endsWith('.internal')
  ) {
    return { isValid: false, error: 'Localhost and private IP addresses are not permitted' };
  }

  // Must have a valid TLD
  if (!host.includes('.')) {
    return { isValid: false, error: 'Invalid domain name' };
  }

  const config = PLATFORM_CONFIG[platform];
  if (!config) {
    return { isValid: false, error: 'Unsupported platform' };
  }

  // Check platform-specific hostnames if restricted
  if (config.allowedHosts.length > 0) {
    const isAllowedHost = config.allowedHosts.some(
      allowed => host === allowed || host.endsWith(`.${allowed}`)
    );

    if (!isAllowedHost) {
      return {
        isValid: false,
        error: `URL must be an authentic ${config.name} link (e.g. ${config.placeholder})`
      };
    }

    if (config.pathValidator && !config.pathValidator(parsed.pathname)) {
      return {
        isValid: false,
        error: `Please provide a valid direct ${config.name} profile link`
      };
    }
  }

  return {
    isValid: true,
    sanitizedUrl: parsed.toString(),
    platform
  };
}

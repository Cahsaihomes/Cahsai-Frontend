/**
 * Cloudinary Video Optimization Service
 * Handles URL transformation, HLS conversion, and adaptive quality
 */

/**
 * Extract public ID from Cloudinary URL
 */
function getCloudinaryPublicId(url: string): string {
  if (!url) return '';

  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');

    // Find the index of 'upload' in the path
    const uploadIndex = pathSegments.indexOf('upload');
    if (uploadIndex === -1) return '';

    // Get everything after /upload/... (skip any transformations)
    let publicId = pathSegments.slice(uploadIndex + 1).join('/');

    // Remove file extension
    publicId = publicId.replace(/\.[^/.]+$/, '');

    return publicId;
  } catch {
    return '';
  }
}

function getCloudinaryCloudName(url: string): string {
  if (!url) return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes("res.cloudinary.com")) {
      return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
    }

    const [, cloudName] = urlObj.pathname.split("/");
    return cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  } catch {
    return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  }
}

/**
 * Check if URL is a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
}

export function isDisabledCloudinaryUrl(url: string): boolean {
  if (!url || !isCloudinaryUrl(url)) return false;

  const disabledClouds = (
    process.env.NEXT_PUBLIC_DISABLED_CLOUDINARY_CLOUDS || "dgp7glwvw"
  )
    .split(",")
    .map((cloudName) => cloudName.trim())
    .filter(Boolean);

  try {
    const urlObj = new URL(url);
    const [, cloudName] = urlObj.pathname.split("/");
    return disabledClouds.includes(cloudName);
  } catch {
    return disabledClouds.some((cloudName) =>
      url.includes(`res.cloudinary.com/${cloudName}/`)
    );
  }
}

/**
 * Quality preset configurations for different connection speeds
 */
const qualityPresets: Record<string, {bitrate: string; quality: string}> = {
  '5g': { bitrate: '8000k', quality: '1080p' },
  '4g': { bitrate: '4500k', quality: '720p' },
  '3g': { bitrate: '1200k', quality: '480p' },
  '2g': { bitrate: '500k', quality: '480p' },
  'slow-4g': { bitrate: '500k', quality: '480p' },
};

/**
 * Detect connection speed and return appropriate quality
 */
function getConnectionSpeed(): string {
  if (typeof navigator === 'undefined') return 'auto';

  const connection = (navigator as any).connection;
  if (!connection) return '720p';

  const downlink = Number(connection.downlink || 0);
  if (downlink >= 18) return '1080p';
  if (downlink >= 5) return '720p';
  if (downlink > 0) return '480p';

  const effectiveType = connection.effectiveType || '4g';
  return qualityPresets[effectiveType]?.quality || 'auto';
}

/**
 * Transform Cloudinary URL for streaming
 */
export function getCloudinaryStreamingUrl(
  url: string,
  options?: { quality?: '480p' | '720p' | '1080p' | '4k' | 'auto'; format?: 'hls' | 'mp4' | 'auto'; streaming?: boolean }
): string {
  if (!isCloudinaryUrl(url)) return url;

  const { quality = 'auto', format = 'hls', streaming = true } = options || {};

  try {
    const urlObj = new URL(url);
    const uploadIndex = urlObj.pathname.indexOf('/upload/');

    if (uploadIndex === -1) return url;

    const base = url.substring(0, uploadIndex + '/upload/'.length);
    const publicId = getCloudinaryPublicId(url);

    if (!publicId) return url;

    // Build transformation parameters
    let transformations = [];

    // Quality parameter
    if (quality && quality !== 'auto') {
      const heightMap: Record<string, number> = {
        '480p': 480,
        '720p': 720,
        '1080p': 1080,
        '4k': 2160,
      };
      const height = heightMap[quality];
      if (height) {
        transformations.push(`h_${height},c_scale`);
      }
    }

    // Format parameter
    let fmt = 'auto';
    if (format === 'hls') {
      fmt = 'hls';
    } else if (format === 'mp4') {
      fmt = 'mp4';
    }

    if (fmt !== 'auto') {
      transformations.push(`f_${fmt}`);
    }

    // Quality setting
    transformations.push('q_auto');

    // Streaming mode
    if (streaming && format === 'hls') {
      transformations.push('so_0s');
    }

    const transformParam = transformations.length > 0 ? transformations.join(',') + '/' : '';
    return `${base}${transformParam}${publicId}.${fmt === 'hls' ? 'm3u8' : 'mp4'}`;
  } catch {
    return url;
  }
}

/**
 * Convert Cloudinary URL to HLS format
 */
export function convertCloudinaryToHLS(url: string): string {
  return getCloudinaryStreamingUrl(url, {
    format: 'hls',
    streaming: true,
    quality: 'auto',
  });
}

/**
 * Get adaptive quality URL based on network connection
 */
export function getAdaptiveCloudinaryUrl(
  url: string,
  options?: { forceQuality?: '480p' | '720p' | '1080p' | '4k' }
): string {
  if (!isCloudinaryUrl(url)) return url;

  const quality = options?.forceQuality || (getConnectionSpeed() as any);

  return getCloudinaryStreamingUrl(url, {
    quality: quality as '480p' | '720p' | '1080p' | '4k' | 'auto',
    format: 'hls',
    streaming: true,
  });
}

/**
 * Batch transform multiple Cloudinary video URLs
 */
export function transformCloudinaryUrls(
  urls: string[],
  options?: { quality?: '480p' | '720p' | '1080p' | '4k'; format?: 'hls' | 'mp4'; streaming?: boolean }
): string[] {
  return urls.map((url) =>
    isCloudinaryUrl(url) ? getCloudinaryStreamingUrl(url, options) : url
  );
}

/**
 * Get video poster/thumbnail from Cloudinary
 */
export function getCloudinaryVideoThumbnail(videoUrl: string, options?: { width?: number; height?: number }): string {
  const publicId = getCloudinaryPublicId(videoUrl);
  const cloudName = getCloudinaryCloudName(videoUrl);
  if (!publicId || !cloudName) return '';

  const { width = 1280, height = 720 } = options || {};
  return `https://res.cloudinary.com/${cloudName}/video/upload/q_auto,f_auto,c_scale,w_${width},h_${height},so_0s/${publicId}.jpg`;
}

/**
 * Get video metadata from Cloudinary
 */
export function getCloudinaryVideoMetadata(videoUrl: string): { duration?: number; width?: number; height?: number } {
  // This would require Cloudinary Admin API
  // For now, return empty metadata
  return {};
}

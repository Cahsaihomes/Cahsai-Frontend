/**
 * Video Optimization Utilities
 * Handles video compression, streaming, and caching
 */

export interface VideoOptimizationOptions {
  maxBitrate?: number;
  enableHLS?: boolean;
  preLoad?: 'none' | 'metadata' | 'auto';
  posterUrl?: string;
}

/**
 * Convert MP4 to HLS stream URL (requires backend conversion)
 * This would typically be handled by your video processing service
 */
export function convertToHLS(videoUrl: string): string {
  // Replace .mp4 with .m3u8 assuming your backend serves HLS
  // Or use a service like Cloudinary, Mux, or AWS MediaConvert
  if (videoUrl.includes('.mp4')) {
    return videoUrl.replace('.mp4', '.m3u8');
  }
  return videoUrl;
}

/**
 * Get optimized video source URL with CDN and compression
 */
export function getOptimizedVideoUrl(
  videoUrl: string,
  options: VideoOptimizationOptions = {}
): string {
  if (!videoUrl) return '';
  
  const { maxBitrate = 5000, enableHLS = true } = options;

  // Example: if using Cloudinary or similar CDN
  // return `${process.env.NEXT_PUBLIC_CDN_URL}${videoUrl}?q=auto&br=${maxBitrate}k`;
  
  // For now, return the URL with HLS conversion if enabled
  return enableHLS ? convertToHLS(videoUrl) : videoUrl;
}

/**
 * Check if browser supports HLS
 */
export function supportsHLS(): boolean {
  const video = document.createElement('video');
  return video.canPlayType('application/vnd.apple.mpegurl') === 'maybe' ||
         video.canPlayType('application/vnd.apple.mpegurl') === 'probably';
}

/**
 * Get adaptive bitrate based on connection speed
 */
export function getAdaptiveBitrate(): number {
  if (typeof window === 'undefined') return 5000;

  const connection = (navigator as any).connection;
  if (!connection) return 5000;

  const effectiveType = connection.effectiveType;
  
  switch (effectiveType) {
    case '4g':
      return 8000; // 8 Mbps
    case '3g':
      return 2500; // 2.5 Mbps
    case '2g':
      return 500;  // 500 Kbps
    default:
      return 5000;
  }
}

/**
 * Preload video metadata only (lightweight)
 */
export function preloadVideoMetadata(videoUrl: string): void {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'video';
  link.href = videoUrl;
  document.head.appendChild(link);
}

/**
 * Cache video using Service Worker
 */
export async function cacheVideo(videoUrl: string, cacheName = 'video-cache-v1'): Promise<void> {
  if (!('caches' in window)) return;

  try {
    const cache = await caches.open(cacheName);
    await cache.add(videoUrl);
  } catch (error) {
    console.warn('Failed to cache video:', error);
  }
}

/**
 * Clear old video cache
 */
export async function clearOldVideoCaches(currentCacheName = 'video-cache-v1'): Promise<void> {
  if (!('caches' in window)) return;

  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter(name => name.startsWith('video-cache-') && name !== currentCacheName)
      .map(name => caches.delete(name))
  );
}

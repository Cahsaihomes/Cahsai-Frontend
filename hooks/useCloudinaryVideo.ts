/**
 * Hook for working with Cloudinary videos
 */

import { useMemo } from 'react';
import {
  isCloudinaryUrl,
  getCloudinaryStreamingUrl,
  getCloudinaryVideoThumbnail,
  getAdaptiveCloudinaryUrl,
} from '@/lib/cloudinary-video';

interface UseCloudinaryVideoOptions {
  quality?: 'auto' | '480p' | '720p' | '1080p' | '4k';
  format?: 'hls' | 'mp4' | 'auto';
  streaming?: boolean;
  adaptive?: boolean;
}

/**
 * Hook to optimize Cloudinary video URLs
 * Automatically handles HLS conversion and adaptive quality
 */
export function useCloudinaryVideo(
  videoUrl: string,
  options: UseCloudinaryVideoOptions = {}
) {
  const {
    quality = 'auto',
    format = 'hls',
    streaming = true,
    adaptive = true,
  } = options;

  const optimizedUrl = useMemo(() => {
    if (!videoUrl) return '';

    if (!isCloudinaryUrl(videoUrl)) {
      return videoUrl;
    }

    // Use adaptive quality if enabled
    if (adaptive) {
      return getAdaptiveCloudinaryUrl(videoUrl);
    }

    // Otherwise use specified settings
    return getCloudinaryStreamingUrl(videoUrl, {
      quality,
      format,
      streaming,
    });
  }, [videoUrl, quality, format, streaming, adaptive]);

  const posterUrl = useMemo(() => {
    if (!videoUrl || !isCloudinaryUrl(videoUrl)) {
      return '';
    }
    return getCloudinaryVideoThumbnail(videoUrl, {
      width: 1280,
      height: 720,
    });
  }, [videoUrl]);

  return {
    videoUrl: optimizedUrl,
    posterUrl,
    isCloudinary: isCloudinaryUrl(videoUrl),
  };
}

/**
 * Hook for bulk Cloudinary URLs
 */
export function useCloudinaryVideos(
  urls: string[],
  options?: UseCloudinaryVideoOptions
) {
  return useMemo(() => {
    return urls.map((url) => {
      if (!isCloudinaryUrl(url)) {
        return { url, posterUrl: '' };
      }

      const videoUrl = options?.adaptive
        ? getAdaptiveCloudinaryUrl(url)
        : getCloudinaryStreamingUrl(url, {
            quality: options?.quality || 'auto',
            format: options?.format || 'hls',
            streaming: options?.streaming !== false,
          });

      return {
        url: videoUrl,
        posterUrl: getCloudinaryVideoThumbnail(url),
      };
    });
  }, [urls, options]);
}

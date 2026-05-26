import { useEffect, useState } from 'react';

/**
 * Hook for initializing video optimization features
 * - Registers service worker for caching
 * - Monitors video performance
 * - Provides adaptive bitrate info
 */
export function useVideoOptimization() {
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);
  const [connectionSpeed, setConnectionSpeed] = useState<string>('unknown');
  const [cacheSize, setCacheSize] = useState<number>(0);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration);
          setIsServiceWorkerReady(true);
        })
        .catch((error) => {
          console.warn('❌ Service Worker registration failed:', error);
        });
    }

    // Monitor connection speed
    const connection = (navigator as any).connection;
    if (connection) {
      const updateConnectionSpeed = () => {
        setConnectionSpeed(connection.effectiveType);
        console.log('📡 Connection type:', connection.effectiveType);
      };

      updateConnectionSpeed();
      connection.addEventListener('change', updateConnectionSpeed);

      return () => {
        connection.removeEventListener('change', updateConnectionSpeed);
      };
    }
  }, []);

  // Get cache size
  const getCacheSize = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        const usedMB = (estimate.usage! / 1024 / 1024).toFixed(2);
        const quotaMB = (estimate.quota! / 1024 / 1024).toFixed(2);
        setCacheSize(Number(usedMB));
        console.log(
          `💾 Cache: ${usedMB}MB / ${quotaMB}MB`,
          `(${((estimate.usage! / estimate.quota!) * 100).toFixed(0)}% full)`
        );
        return { usage: Number(usedMB), quota: Number(quotaMB) };
      } catch (error) {
        console.error('Failed to get storage estimate:', error);
      }
    }
  };

  // Clear old caches
  const clearOldCaches = async () => {
    try {
      const cacheNames = await caches.keys();
      const keepCaches = ['video-cache-v1', 'runtime-cache-v1'];

      await Promise.all(
        cacheNames
          .filter((name) => !keepCaches.includes(name))
          .map((name) => {
            console.log(`🗑️  Clearing old cache: ${name}`);
            return caches.delete(name);
          })
      );
    } catch (error) {
      console.error('Failed to clear old caches:', error);
    }
  };

  // Clear all video cache
  const clearVideoCache = async () => {
    try {
      await caches.delete('video-cache-v1');
      console.log('🗑️  Video cache cleared');
      await getCacheSize();
    } catch (error) {
      console.error('Failed to clear video cache:', error);
    }
  };

  return {
    isServiceWorkerReady,
    connectionSpeed,
    cacheSize,
    getCacheSize,
    clearOldCaches,
    clearVideoCache,
  };
}

/**
 * Hook for monitoring video playback performance
 */
export function useVideoPerformance(videoRef: React.RefObject<HTMLVideoElement>) {
  const [performance, setPerformance] = useState({
    loadTime: 0,
    bufferingCount: 0,
    totalBufferingTime: 0,
    averageBitrate: 0,
  });

  const [bufferingStartTime, setBufferingStartTime] = useState<number | null>(null);
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      const loadTime = Date.now() - startTime.current;
      setPerformance((prev) => ({ ...prev, loadTime }));
      console.log(`⏱️  Video ready in ${loadTime}ms`);
    };

    const handleWaiting = () => {
      setBufferingStartTime(Date.now());
    };

    const handlePlaying = () => {
      if (bufferingStartTime) {
        const bufferingTime = Date.now() - bufferingStartTime;
        setPerformance((prev) => ({
          ...prev,
          bufferingCount: prev.bufferingCount + 1,
          totalBufferingTime: prev.totalBufferingTime + bufferingTime,
        }));
        setBufferingStartTime(null);
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
    };
  }, [videoRef, bufferingStartTime]);

  return performance;
}

/**
 * Hook for adaptive bitrate selection
 */
export function useAdaptiveBitrate() {
  const [recommendedBitrate, setRecommendedBitrate] = useState(5000);

  useEffect(() => {
    const connection = (navigator as any).connection;
    if (!connection) return;

    const updateBitrate = () => {
      const effectiveType = connection.effectiveType;
      let bitrate = 5000;

      switch (effectiveType) {
        case '4g':
          bitrate = 8000; // 8 Mbps for HD
          break;
        case '3g':
          bitrate = 2500; // 2.5 Mbps for SD
          break;
        case '2g':
          bitrate = 500; // 500 Kbps minimum
          break;
        default:
          bitrate = 5000;
      }

      setRecommendedBitrate(bitrate);
      console.log(`📊 Recommended bitrate: ${bitrate}kbps (${effectiveType})`);
    };

    updateBitrate();
    connection.addEventListener('change', updateBitrate);

    return () => {
      connection.removeEventListener('change', updateBitrate);
    };
  }, []);

  return { recommendedBitrate };
}

// useRef import for useVideoPerformance
import { useRef } from 'react';

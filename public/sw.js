/**
 * Service Worker for Video Caching
 * Place this file at: public/sw.js
 * 
 * Register in your layout or app root with:
 * if ('serviceWorker' in navigator) {
 *   navigator.serviceWorker.register('/sw.js');
 * }
 */

const CACHE_NAME = 'video-cache-v1';
const RUNTIME_CACHE = 'runtime-cache-v1';
const VIDEO_EXTENSIONS = ['.mp4', '.m3u8', '.ts'];

// Cache video files on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Cache opened');
      return cache;
    })
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log(`Service Worker: Deleting old cache ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercept fetch requests for video optimization
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Check if this is a video file request
  const isVideoRequest = VIDEO_EXTENSIONS.some((ext) =>
    url.pathname.endsWith(ext)
  );

  if (!isVideoRequest) {
    // For non-video files, use standard caching
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }

        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        });
      })
    );
    return;
  }

  // For video files: Use cache-first strategy with range request support
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(request).then((response) => {
        // If cached and range request is not needed, return cached
        if (response && !request.headers.get('range')) {
          return response;
        }

        // Fetch from network
        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              cache.put(request, responseToCache);
            }
            return response;
          })
          .catch(() => {
            // If offline and no cache, return error
            return new Response('Video unavailable', { status: 503 });
          });
      });
    })
  );
});

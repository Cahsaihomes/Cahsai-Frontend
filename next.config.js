/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  reactStrictMode: true,
  images: { unoptimized: true },
  
  // Video streaming optimization
  headers: async () => {
    return [
      {
        source: '/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // Cache for 1 year
          },
          {
            key: 'Accept-Ranges',
            value: 'bytes', // Enable range requests for streaming
          },
        ],
      },
      {
        source: '/:path*.(m3u8|ts)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600', // Cache HLS manifests for 1 hour
          },
          {
            key: 'Content-Type',
            value: 'application/vnd.apple.mpegurl',
          },
        ],
      },
    ];
  },

  // Turbopack config for Next.js 16
  turbopack: {},
};

module.exports = nextConfig;

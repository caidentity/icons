/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: '/icons/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false, path: false };
    
    // Add copy operation for metadata file during build
    if (isServer) {
      const { copyFileSync, existsSync, mkdirSync } = require('fs');
      const { join, dirname } = require('path');
      
      const source = join(process.cwd(), 'public', 'icons-metadata.json');
      const dest = join(process.cwd(), '.next', 'server', 'public', 'icons-metadata.json');
      
      if (existsSync(source)) {
        // Ensure the destination directory exists
        mkdirSync(dirname(dest), { recursive: true });
        copyFileSync(source, dest);
        console.log('Copied metadata file to build directory');
      } else {
        console.warn('Warning: icons-metadata.json not found in public directory');
      }
    }
    
    return config;
  },
  experimental: {
    allowedRevalidateHeaderKeys: ['my-custom-key'],
  },
  output: 'standalone',
  distDir: '.next',
}

module.exports = nextConfig 
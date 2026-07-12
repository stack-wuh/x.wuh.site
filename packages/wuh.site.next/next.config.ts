import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production';
const nestApiUrl =
  process.env.NEST_API_URL ||
  (isProduction ? 'http://nest:3200/v2' : 'http://localhost:3200/v2');

const nextConfig: NextConfig = {
  distDir: isProduction ? './dist/wuh.site.next' : './dist/wuh.site.next-dev',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.weread.qq.com',
      },
      {
        protocol: 'https',
        hostname: '*.image.myqcloud.com',
      },
      {
        protocol: 'https',
        hostname: '*.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.wuh.site',
      },
    ],
  },
  // API rewrite to NestJS backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${nestApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nestApiUrl =
  process.env.NEST_API_URL ||
  (process.env.NODE_ENV === 'production' ? 'http://nest:3200/v2' : 'http://localhost:3200/v2');

const nextConfig: NextConfig = {
  distDir: './dist/wuh.site.next',
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

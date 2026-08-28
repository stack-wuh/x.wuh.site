import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production';
const nestApiUrl =
  process.env.NEST_API_URL ||
  (isProduction ? 'http://nest:3200/v2' : 'http://localhost:3200/v2');

const nextConfig: NextConfig = {
  // 单 worker 构建：规避 Node 24 下 V8 并发 GC 的 SIGSEGV（本地与 CI 均适用）
  experimental: { cpus: 1 },
  distDir: isProduction ? './dist/site' : './dist/site-dev',
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
      {
        protocol: 'https',
        hostname: 'src.wuh.site',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
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

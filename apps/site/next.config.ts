import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production';
const nestApiUrl =
  process.env.NEST_API_URL ||
  (isProduction ? 'http://nest:3200/v2' : 'http://localhost:3200/v2');

const nextConfig: NextConfig = {
  // 单 worker 构建：规避 Node 24 下 V8 并发 GC 的 SIGSEGV（本地与 CI 均适用）
  experimental: { cpus: 1 },
  // styled-components 必须经 SWC 转换：未开启时组件 ID 按各端 bundle 内的组件
  // 创建顺序编号，服务端与客户端编号不一致 → 水合后类名分叉、SSR 样式表被
  // 重建，最终级联随导航路径漂移（切页样式变化）。开启后 ID 由文件+位置哈希，
  // 两端一致。
  compiler: { styledComponents: true },
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

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 启用 styled-components 支持，但禁用一些可能导致问题的优化
  compiler: {
    styledComponents: {
      displayName: true,
      ssr: true,
    },
  },
  compress: false, // 禁用压缩以避免构建时的内存问题
  distDir: './dist/wuh.site.next',
  generateEtags: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  // 优化包导入
  experimental: {
    optimizePackageImports: ['@wuh.site/components', 'styled-components', '@ant-design/colors'],
    // 限制 worker 数量以避免 SIGSEGV
    workerThreads: false,
    cpus: 1,
  }
};

export default nextConfig;

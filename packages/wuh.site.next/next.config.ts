import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    styledComponents: true
  },
  cacheComponents: true,
  compress: true,
  devIndicators: false,
  distDir: 'wuh.site',
  generateEtags: false,
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: 'tsconfig.json',
  },
  experimental: {
    workerThreads: false,
    cpus: 1
  }
};

export default nextConfig;

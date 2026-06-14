import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: './dist/wuh.site.next',
  typescript: {
    ignoreBuildErrors: true,
  },
  // API rewrite to NestJS backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEST_API_URL || 'http://localhost:3200/v2'}/:path*`,
      },
    ];
  },
};

export default nextConfig;

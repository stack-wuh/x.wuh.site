import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	compress: false,
	distDir: 'dist',
	cleanDistDir: true,
	eslint: {
		ignoreDuringBuilds: true
	},
	generateEtags: false,
	experimental: {
		optimizePackageImports: []
	},
	typescript: {
		ignoreBuildErrors: true
	}
}

export default nextConfig;

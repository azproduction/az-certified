import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // GitHub Pages deployment
  basePath: '/az-certified',

  // Turbopack configuration for Next.js 16+
  turbopack: {
    rules: {
      '*.jsonl': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;

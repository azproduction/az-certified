import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // GitHub Pages deployment (uncomment and set basePath if deploying to a subdirectory)
  // basePath: '/repo-name',

  // Turbopack configuration for Next.js 16+
  turbopack: {},

  // Webpack configuration (fallback for --webpack flag)
  webpack: (config) => {
    // Add custom loader for JSONL files to import as raw strings
    config.module.rules.push({
      test: /\.jsonl$/,
      type: 'asset/source',
    });
    return config;
  },
};

export default nextConfig;

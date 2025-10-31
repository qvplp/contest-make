import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Next.js 16: eslint設定は next.config.ts ではなく eslintrc で管理
  // Next 14+ 互換: app router はデフォルトで有効
  // 画像最適化で remotePatterns を使っているなら既存設定は保持
};

export default nextConfig;

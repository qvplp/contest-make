import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pinyogram.com',
      },
    ],
  },
  // Node.js 24対応: バージョンチェックを緩和
  // Next.js 16: eslint設定は next.config.ts ではなく eslintrc で管理
  // Next 14+ 互換: app router はデフォルトで有効
};

export default nextConfig;

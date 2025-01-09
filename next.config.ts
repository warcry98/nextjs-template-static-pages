import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production"
const nextConfig: NextConfig = {
  output: 'export',
  assetPrefix: isProd ? '/nextjs-template-static-pages/' : '',
  basePath: isProd ? '/nextjs-template-static-pages' : '',
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 600,
  basePath: process.env.NEXT_PUBLIC_ASSET_PREFIX?.replace(/\/$/, ''),
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX?.replace(/\/$/, ''),

  webpack(config, { isServer }) {
    if (!isServer) {
      // This is necessary since storyteller partially relies on dead code elimination
      // At src/_app.tsx -> src/loaders/{file,github}.ts
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        child_process: false,
      };
    }
    return config;
  }
}

module.exports = nextConfig

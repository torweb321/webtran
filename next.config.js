/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/webtran',
  assetPrefix: '/webtran/',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
    return config;
  },
}

module.exports = nextConfig

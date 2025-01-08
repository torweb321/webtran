/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/webtran',
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
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}

module.exports = nextConfig

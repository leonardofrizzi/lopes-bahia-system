/** @type {import('next').NextConfig} */
const nextConfig = {
  // ensure Next.js spins up a server for API routes
  output: 'standalone',
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig

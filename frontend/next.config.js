/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'storage.googleapis.com', 'reportify.ai'],
    unoptimized: true,
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: false, // 💥 důležité – vypne App Router
  },
};

module.exports = nextConfig;

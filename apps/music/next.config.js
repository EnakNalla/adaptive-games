/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  transpilePackages: ["@ag/ui"],
  reactStrictMode: true
};

module.exports = nextConfig;

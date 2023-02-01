/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@ag/ui", "@ag/auth", "@ag/api", "@ag/db"]
};

module.exports = nextConfig;

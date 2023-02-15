const nextSafe = require("next-safe");
/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@ag/ui", "@ag/auth", "@ag/api", "@ag/db"],
  images: {
    domains: ["lh3.googleusercontent.com", "i.ytimg.com", "yt3.ggpht.com"]
  },
  headers: () => [
    {
      source: "/:path*",
      headers: [
        ...nextSafe({
          isDev: process.env.NODE_ENV !== "production",
          contentSecurityPolicy: {
            "img-src": [
              "'self'",
              "data:",
              "lh3.googleusercontent.com",
              "i.ytimg.com",
              "yt3.ggpht.com"
            ],
            "connect-src": ["'self'", "https://www.googleapis.com"],
            "script-src": ["'self'", "https://www.youtube.com"],
            "frame-src": ["'self'", "https://www.youtube-nocookie.com"]
          },
          permissionsPolicy: {
            fullscreen: ["'self'"]
          }
        }),
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload"
        },
        {
          key: "Referrer-Policy",
          value: "origin-when-cross-origin"
        }
      ]
    }
  ]
};

module.exports = nextConfig;

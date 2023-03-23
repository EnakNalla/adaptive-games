const nextSafe = require("next-safe");
/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@ag/ui", "@ag/auth", "@ag/api", "@ag/db"],
  images: {
    domains: ["lh3.googleusercontent.com", "i.ytimg.com", "yt3.ggpht.com"]
  }
  // headers: () => [
  //   {
  //     source: "/:path*",
  //     headers: [
  //       ...nextSafe({
  //         isDev: process.env.NODE_ENV !== "production",
  //         contentSecurityPolicy: {
  //           "img-src": ["'self'", "data:", "i.ytimg.com", "yt3.ggpht.com"],
  //           "connect-src": ["'self'", "https://www.googleapis.com"],
  //           "script-src": [
  //             "'self'",
  //             "https://www.youtube.com",
  //             "'sha256-nP8nHX3KjEA/4qIrGRj1UV7eqwe8XDtvbalJF9qILbw='"
  //           ],
  //           "frame-src": ["'self'", "https://www.youtube-nocookie.com"],
  //           "style-src": [
  //             "'self'",
  //             "'sha256-nP8nHX3KjEA/4qIrGRj1UV7eqwe8XDtvbalJF9qILbw='",
  //             "'sha256-OiWNMa1KUoUcT+GxzETDUh2H7fXMK1CtGDroFtH9JWs='",
  //             "'sha256-R1+xbf9Fdi4eJQpt7oHawCBfsITgJsu3yj/6IeV16e8='"
  //           ]
  //         },
  //         permissionsPolicy: {
  //           fullscreen: ["'self'"]
  //         }
  //       }),
  //       {
  //         key: "Strict-Transport-Security",
  //         value: "max-age=31536000; includeSubDomains; preload"
  //       },
  //       {
  //         key: "Referrer-Policy",
  //         value: "origin-when-cross-origin"
  //       }
  //     ]
  //   }
  // ]
};

module.exports = nextConfig;

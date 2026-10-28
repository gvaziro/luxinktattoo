import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  experimental: {
    globalNotFound: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
  // English is the default locale and lives at the root URL (/, /blog, /blog/:slug).
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/blog", destination: "/blog", permanent: true },
      // Articles only: generated files such as the OG image and RSS feed stay reachable under /en/blog.
      {
        source: "/en/blog/:slug((?!opengraph-image|rss\\.xml)[^/]+)",
        destination: "/blog/:slug",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/", destination: "/en" },
      { source: "/blog", destination: "/en/blog" },
      { source: "/blog/:slug", destination: "/en/blog/:slug" },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

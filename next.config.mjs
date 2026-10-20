/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep the development cache separate so `next build` cannot corrupt a running dev server.
  distDir: process.env.NEXT_DIST_DIR || (process.env.NODE_ENV === "development" ? ".next-dev" : ".next"),
  // Preserve the existing .html URLs as valid Next.js routes.
  trailingSlash: false,
  async rewrites() {
    const apiOrigin = process.env.ACADEMY_API_ORIGIN || "http://localhost:5042";
    return [
      { source: "/api/:path*", destination: `${apiOrigin}/api/:path*` },
      { source: "/uploads/:path*", destination: `${apiOrigin}/uploads/:path*` },
    ];
  },
};

export default nextConfig;

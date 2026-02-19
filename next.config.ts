import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pure static export — outputs to /out
  output: "export",

  // Disable image optimization (not available in static export)
  images: {
    unoptimized: true,
  },

  // Trailing slashes for clean static routing on Cloudflare Pages
  trailingSlash: true,
};

export default nextConfig;

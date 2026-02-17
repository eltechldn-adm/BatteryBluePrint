import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  // Static export configuration
  output: "export",

  // Disable image optimization (requires server)
  images: {
    unoptimized: true,
  },

  // Add trailing slashes for cleaner static routing
  trailingSlash: true,
};

export default nextConfig;

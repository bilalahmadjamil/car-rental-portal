import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove the experimental.turbo configuration
  // This was causing the filesystem path error
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    prerenderEarlyExit: false,
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/backend_api/:path*',
        destination: `${process.env.SECRET_BACKEND_URL}/:path*`,
      },
    ]
  },
};

export default nextConfig;

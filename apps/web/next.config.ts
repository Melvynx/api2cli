import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["twitter-api-v2"],
  async redirects() {
    return [
      {
        source: "/registry",
        destination: "/cli",
        permanent: true,
      },
      {
        source: "/registry/:name",
        destination: "/cli/:name",
        permanent: true,
      },
      {
        source: "/skills",
        destination: "/cli",
        permanent: true,
      },
      {
        source: "/skills/:name",
        destination: "/cli/:name",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

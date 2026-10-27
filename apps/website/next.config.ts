import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects() {
    return [
      { source: "/docs/installation", destination: "/docs/quick-start", permanent: true },
      { source: "/docs/providers", destination: "/docs/theming", permanent: true },
    ];
  },
  transpilePackages: ["@pimolu/react", "@pimolu/core"],
  turbopack: {
    root: process.cwd().replace(/[\\/]apps[\\/]website$/, ""),
  },
};

export default nextConfig;

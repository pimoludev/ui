import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pimolu/react", "@pimolu/core"],
  turbopack: {
    root: process.cwd().replace(/[\\/]apps[\\/]website$/, ""),
  },
};

export default nextConfig;

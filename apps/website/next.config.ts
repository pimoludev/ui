import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects() {
    return [
      { source: "/docs/installation", destination: "/docs/quick-start", permanent: true },
      { source: "/docs/providers", destination: "/docs/theming", permanent: true },
      { source: "/preview/form", has: [{ type: "query", key: "example", value: "setup-custom-submit" }], destination: "/preview/form-submit", permanent: true },
      { source: "/preview/form", has: [{ type: "query", key: "example", value: "setup-field-error" }], destination: "/preview/form-error", permanent: true },
    ];
  },
  transpilePackages: ["@pimolu/react", "@pimolu/core"],
  turbopack: {
    root: process.cwd().replace(/[\\/]apps[\\/]website$/, ""),
  },
};

export default nextConfig;

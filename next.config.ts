import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev badge so it never appears in review screenshots.
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        // CSS modules must stay modules, so Tailwind only processes plain stylesheets.
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

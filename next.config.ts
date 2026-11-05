import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev badge so it never appears in review screenshots.
  devIndicators: false,
  // The site builds to plain files in out/, so any host can serve it, shared cPanel hosting included.
  // Each page is written as about/index.html, which every web server finds for /about/ by default.
  output: "export",
  trailingSlash: true,
  // No server to resize images on request.
  images: { unoptimized: true },
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

/** @type {import('next').NextConfig} */
const { withNextDevtools } = require("@next-devtools/core/plugin");
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = withNextDevtools(nextConfig);

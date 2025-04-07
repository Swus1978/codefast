/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals.push("snappy");
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    forceSwcTransforms: true,
    cpus: 1, // Limit build process to 1 CPU core
  },
};

// For ESM (.mjs files)
export default nextConfig;

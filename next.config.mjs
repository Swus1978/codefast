/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude 'snappy' from the client-side bundle
    if (!isServer) {
      config.externals.push("snappy");
    }
    return config;
  },
  eslint: {
    // Skip ESLint during build for performance
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Force SWC transforms and limit the CPU cores used during build
    forceSwcTransforms: true,
    cpus: 1,
  },
};

// Use ESM export syntax
export default nextConfig;

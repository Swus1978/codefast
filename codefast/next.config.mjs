/** @type {import('next').NextConfig} */
const nextConfig = {
  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true, // Temporarily disable build-time ESLint
  },

  // Improved logging
  logging: {
    fetches: {
      fullUrl: true, // Better debugging for API calls
    },
  },

  // Optional: Recommended for production
  experimental: {
    serverComponentsExternalPackages: ["mongoose"], // If using Mongoose
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable optimizations
    optimizePackageImports: ["lucide-react"],
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;

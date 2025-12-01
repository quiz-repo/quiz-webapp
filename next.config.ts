// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//  images: {
//     domains: ['lh3.googleusercontent.com'],
//   },
// };

// export default nextConfig;

// next.config.ts
// import type { NextConfig } from 'next'

// const nextConfig: NextConfig = {
//   output: 'export', // Enables static HTML export mode
//   distDir: 'out',   // Moves `.next` output to `out` directory
//   reactStrictMode: true,
//   images: {
//     domains: ['lh3.googleusercontent.com'],
//     unoptimized: true, // Required for static export to prevent Image Optimization API
//   },
// }

// export default nextConfig
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
}

export default nextConfig

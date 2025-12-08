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
// import type { NextConfig } from 'next'

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   images: {
//     domains: ['lh3.googleusercontent.com'],
//   },
// }

// export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID,
    FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  },
};

module.exports = nextConfig;


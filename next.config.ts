import withBundleAnalyzer from '@next/bundle-analyzer'
import type { NextConfig } from 'next'

const isAnalyze = process.env.ANALYZE === 'true'

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.credly.com'
      },
      {
        protocol: 'https',
        hostname: '**.medium.com'
      },
      {
        protocol: 'https',
        hostname: 'cdn-images-1.medium.com'
      }
    ],
    unoptimized: true
  },
  compress: true,
  reactStrictMode: true,
  output: 'export',
  // Optimize imports for smaller bundles
  optimizePackageImports: [
    'framer-motion',
    'lucide-react',
    '@headlessui/react'
  ],
  experimental: {
    webpackBuildWorker: true
  }
}

export default isAnalyze
  ? withBundleAnalyzer({ enabled: true })(nextConfig)
  : nextConfig

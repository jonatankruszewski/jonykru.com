import withBundleAnalyzer from '@next/bundle-analyzer'
import type { NextConfig } from 'next'

const isAnalyze = process.env.NODE_ENV !== 'production'

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
      }
    ],
    unoptimized: true
  },
  compress: true,
  reactStrictMode: true,
  output: 'export'
}

export default isAnalyze
  ? withBundleAnalyzer({ enabled: true })(nextConfig)
  : nextConfig

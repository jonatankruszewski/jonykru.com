import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'

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
    ]
  },
  compress: true,
  reactStrictMode: true,
  output: 'standalone'
}

export default isAnalyze
  ? withBundleAnalyzer({ enabled: true })(nextConfig)
  : nextConfig

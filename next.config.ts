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
  // Emits out/<route>/index.html instead of out/<route>.html, so S3 can resolve
  // sub-routes. Bare /certifications is handled by the CloudFront viewer-request
  // function in infra/cloudfront-rewrite.js.
  trailingSlash: true,
  experimental: {
    webpackBuildWorker: true
  }
}

export default isAnalyze
  ? withBundleAnalyzer({ enabled: true })(nextConfig)
  : nextConfig

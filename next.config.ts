import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    devIndicators: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.credly.com',
            },
            {
                protocol: 'https',
                hostname: '**.medium.com',
            }
        ],
    },

};

export default nextConfig;

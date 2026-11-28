/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    optimizeFonts: true,
    eslint: {
        // এটি বিল্ডের সময় ESLint এরর ইগনোর করবে
        ignoreDuringBuilds: true,
    },
    distDir: 'build',
    compress: true,
    poweredByHeader: false,
    images: {
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 2592000,
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        domains: ['admin.grameenkalyan.com', 'admin-grameenkalyan.stitbd.app', 'res.cloudinary.com'],
        remotePatterns: [
            { protocol: 'https', hostname: '**.grameenkalyan.com' },
            { protocol: 'https', hostname: 'grameenkalyan.com' },
            { protocol: 'https', hostname: '**.stitbd.app' },
            { protocol: 'https', hostname: 'res.cloudinary.com' },
        ],
    },
    // experimental: {
    //   appDir: true,
    // },
};

module.exports = nextConfig;
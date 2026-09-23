/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  optimizeFonts: true,
  eslint: {
    // এটি বিল্ডের সময় ESLint এরর ইগনোর করবে
    ignoreDuringBuilds: true,
  },
  distDir: 'build',
 images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'admin.grameenkalyan.com',
      pathname: '/uploads/**',
    },
    {
      protocol: 'https',
      hostname: 'admin-grameenkalyan.stitbd.app',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
      pathname: '/**',
    },
  ],
},
  // experimental: {
  //   appDir: true,
  // },
};

module.exports = nextConfig;

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
    domains: ['admin.grameenkalyan.com', 'res.cloudinary.com'],
  },

};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  optimizeFonts: true,
  eslint: {
    // এটি বিল্ডের সময় ESLint এরর ইগনোর করবে
    ignoreDuringBuilds: true,
  },
  distDir: 'build',
  images: {
<<<<<<< HEAD
    domains: ['admin.grameenkalyan.com', 'admin-grameenkalyan.stitbd.app', 'res.cloudinary.com'],
  },
  // experimental: {
  //   appDir: true,
  // },
=======
    domains: ['admin.grameenkalyan.com', 'res.cloudinary.com'],
  },
  experimental: {
    appDir: true,
  },
>>>>>>> f2096c123a55563548cfd705b9b6ff1b4cf9e9d7
};

module.exports = nextConfig;

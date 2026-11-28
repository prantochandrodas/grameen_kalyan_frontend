import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/login', '/register', '/forgot-password', '/confirm-package', '/cart'],
      },
    ],
    sitemap: 'https://www.grameenkalyan.com/sitemap.xml',
  };
}
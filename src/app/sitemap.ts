import { MetadataRoute } from 'next';

const BASE = 'https://www.grameenkalyan.com';

const routes = [
  '',
  '/about',
  '/health-packages',
  '/healthcare',
  '/services',
  '/locator',
  '/news-events',
  '/stories',
  '/videos',
  '/photo-gallery',
  '/corporate',
  '/health-force',
  '/join-us',
  '/newsletter',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: new Date(),
  }));
}
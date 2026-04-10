import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env['NEXT_PUBLIC_BASE_URL'] ?? 'https://mark-systems.com';
  const locales = ['fr', 'en'];
  const pages = ['', '/experiments', '/showroom', '/notes'];

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'monthly' : 'weekly',
        priority: page === '' ? 1.0 : page === '/showroom' ? 0.95 : 0.8,
      });
    }
  }
  return entries;
}

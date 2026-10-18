import type { MetadataRoute } from 'next';
import { LEGAL_PAGES } from '@/app/config/legal';
import { SITE_URL } from '@/app/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  // Generated at build time, so lastModified is the date of the latest deploy.
  const lastModified = new Date();
  return [
    { url: SITE_URL, lastModified },
    ...LEGAL_PAGES.map((page) => ({ url: `${SITE_URL}${page.href}`, lastModified })),
  ];
}

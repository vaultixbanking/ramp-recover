import type { Metadata } from 'next';

// The site's main public address. Link previews, the sitemap and canonical links use it.
// The site is also served at ramprecover.vercel.app; canonical links tell search engines that
// SITE_URL is the main copy, so the two addresses don't compete as duplicates.
export const SITE_URL = 'https://ramprecover.getfinora.org';
export const SITE_NAME = 'Ramp Recover';
export const HOME_TITLE = 'Ramp Recover | Scam Recovery Support';
export const SITE_DESCRIPTION =
  'Professional scam recovery support for victims of crypto, investment, and payment fraud.';

const SHARE_IMAGE = {
  url: '/brand/ramp-recover-social.png',
  width: 1200,
  height: 630,
  alt: 'Ramp Recover: scam recovery support for fraud victims',
};

/** Title, description, canonical link and link-preview tags for one page. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en_US',
      url: path,
      title,
      description,
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [SHARE_IMAGE.url],
    },
  };
}

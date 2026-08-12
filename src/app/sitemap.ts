import { MetadataRoute } from 'next';
import { getAllArticles, CONTENT_CATEGORIES } from '@/lib/content/mdx';
import { BATTERY_DATABASE } from '@/data/batteries';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://batteryblueprint.com';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/calculator`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/guide`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/editorial-team`,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/editorial-policy`,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/methodology`,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/privacy`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // Decision pages
    {
      url: `${siteUrl}/worth-it`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/when-not-to-buy`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/hidden-costs`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/common-mistakes`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/payback-reality`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/choose-battery`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Add region pages
  const regionPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/regions/uk`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/regions/us`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Add category index pages
  const categoryPages: MetadataRoute.Sitemap = CONTENT_CATEGORIES.map((category) => ({
    url: `${siteUrl}/${category}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Add individual article pages
  const articles = getAllArticles();
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/${article.category}/${article.slug}`,
    lastModified: new Date(article.updated),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // Add battery catalog and dynamic product pages
  const batteryIndexPage: MetadataRoute.Sitemap[0] = {
    url: `${siteUrl}/batteries`,
    changeFrequency: 'monthly',
    priority: 0.7,
  };

  const batteryPages: MetadataRoute.Sitemap = BATTERY_DATABASE.map((battery) => ({
    url: `${siteUrl}/batteries/${battery.id}`,
    lastModified: new Date(battery.dataVerifiedDate),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticPages, ...regionPages, batteryIndexPage, ...batteryPages, ...categoryPages, ...articlePages];
}

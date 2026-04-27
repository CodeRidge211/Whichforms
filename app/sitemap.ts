import { MetadataRoute } from 'next';
import { getAllForms, getAllSituations, getAllIdentityDocs } from '@/lib/queries';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://whichforms.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ['', '/forms', '/situations', '/identity'].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Add agency pages
  const agencies = ['irs', 'uscis', 'ssa', 'dmv', 'sba'];
  const agencyRoutes = agencies.map((slug) => ({
    url: `${BASE_URL}/agency/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Add dynamic form pages
  let formRoutes: MetadataRoute.Sitemap = [];
  try {
    const forms = await getAllForms();
    formRoutes = forms.map((form: any) => ({
      url: `${BASE_URL}/form/${form.slug}`,
      lastModified: new Date(form.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    }));
  } catch (e) {
    // DB not connected
  }

  // Add dynamic situation pages
  let situationRoutes: MetadataRoute.Sitemap = [];
  try {
    const situations = await getAllSituations();
    situationRoutes = situations.map((situation: any) => ({
      url: `${BASE_URL}/situation/${situation.slug}`,
      lastModified: new Date(situation.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    }));
  } catch (e) {
    // DB not connected
  }

  // Add identity doc pages
  let identityRoutes: MetadataRoute.Sitemap = [];
  try {
    const docs = await getAllIdentityDocs();
    identityRoutes = docs.map((doc: any) => ({
      url: `${BASE_URL}/identity/${doc.slug}`,
      lastModified: new Date(doc.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    }));
  } catch (e) {
    // DB not connected
  }

  return [...routes, ...agencyRoutes, ...formRoutes, ...situationRoutes, ...identityRoutes];
}
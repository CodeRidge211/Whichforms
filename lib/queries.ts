import { prisma } from './db';
import { unstable_cache } from 'next/cache';

// Form queries
export async function getFormBySlug(slug: string) {
  return prisma.form.findUnique({
    where: { slug },
    include: {
      faqs: {
        orderBy: { sort_order: 'asc' },
      },
    },
  });
}

export async function getFormsByAgency(agencySlug: string) {
  return prisma.form.findMany({
    where: { agency_slug: agencySlug },
    orderBy: [{ is_featured: 'desc' }, { name: 'asc' }],
  });
}

export async function getFeaturedForms() {
  return prisma.form.findMany({
    where: { is_featured: true, is_published: true },
    take: 10,
    orderBy: { name: 'asc' },
  });
}

export async function getAllForms() {
  return prisma.form.findMany({
    where: { is_published: true },
    orderBy: [{ agency: 'asc' }, { name: 'asc' }],
  });
}

// Situation queries
export async function getSituationBySlug(slug: string) {
  return prisma.situation.findUnique({
    where: { slug },
    include: {
      faqs: {
        orderBy: { sort_order: 'asc' },
      },
      form_situations: {
        include: {
          form: true,
        },
      },
      situation_identity_docs: {
        include: {
          identity_doc: true,
        },
      },
    },
  });
}

export async function getAllSituations() {
  return prisma.situation.findMany({
    orderBy: { title: 'asc' },
  });
}

export async function getSituationsByCategory(category: string) {
  return prisma.situation.findMany({
    where: { category },
    orderBy: { title: 'asc' },
  });
}

// Identity document queries
export async function getIdentityDocBySlug(slug: string) {
  return prisma.identityDoc.findUnique({
    where: { slug },
    include: {
      faqs: {
        orderBy: { sort_order: 'asc' },
      },
    },
  });
}

export async function getIdentityDocsByCategory(category: string) {
  return prisma.identityDoc.findMany({
    where: { category, is_published: true },
    orderBy: [{ is_featured: 'desc' }, { name: 'asc' }],
  });
}

export async function getAllIdentityDocs() {
  return prisma.identityDoc.findMany({
    where: { is_published: true },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });
}

export async function getFeaturedIdentityDocs() {
  return prisma.identityDoc.findMany({
    where: { is_featured: true, is_published: true },
    take: 6,
    orderBy: { name: 'asc' },
  });
}

// State-specific forms
export async function getFormsByState(state: string) {
  return prisma.form.findMany({
    where: {
      states: {
        has: state.toUpperCase(),
      },
    },
    orderBy: [{ is_featured: 'desc' }, { name: 'asc' }],
  });
}

// Search functionality
export async function searchForms(query: string) {
  const searchTerm = `%${query}%`;
  return prisma.form.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { form_number: { contains: query, mode: 'insensitive' } },
        { plain_english: { contains: query, mode: 'insensitive' } },
      ],
    },
    take: 20,
  });
}

// Cached versions for production
export const getCachedFormBySlug = (slug: string) =>
  unstable_cache(() => getFormBySlug(slug), [`form-${slug}`], {
    revalidate: 3600,
    tags: [`form-${slug}`],
  })();

export const getCachedSituationBySlug = (slug: string) =>
  unstable_cache(() => getSituationBySlug(slug), [`situation-${slug}`], {
    revalidate: 3600,
    tags: [`situation-${slug}`],
  })();

export const getCachedIdentityDocBySlug = (slug: string) =>
  unstable_cache(() => getIdentityDocBySlug(slug), [`identity-${slug}`], {
    revalidate: 3600,
    tags: [`identity-${slug}`],
  })();
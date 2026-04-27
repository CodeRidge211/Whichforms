import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import FormCard from '@/components/FormCard';
import SituationCard from '@/components/SituationCard';
import { getFeaturedForms, getAllSituations, getFeaturedIdentityDocs } from '@/lib/queries';

export default async function HomePage() {
  const t = await getTranslations('home');

  // Fetch data (gracefully handle if DB not connected)
  let featuredForms: any[] = [];
  let situations: any[] = [];
  let identityDocs: any[] = [];

  try {
    [featuredForms, situations, identityDocs] = await Promise.all([
      getFeaturedForms().catch(() => []),
      getAllSituations().catch(() => []),
      getFeaturedIdentityDocs().catch(() => []),
    ]);
  } catch (e) {
    // DB not connected yet - show placeholder content
  }

  const agencies = [
    { slug: 'irs', name: 'IRS', description: 'Tax forms for individuals and businesses', color: 'bg-red-500' },
    { slug: 'uscis', name: 'USCIS', description: 'Immigration and citizenship forms', color: 'bg-blue-500' },
    { slug: 'ssa', name: 'Social Security', description: 'SSN cards, benefits, and more', color: 'bg-purple-500' },
    { slug: 'dmv', name: 'DMV', description: 'Driver licenses and vehicle registration', color: 'bg-green-500' },
    { slug: 'sba', name: 'SBA', description: 'Small business loans and resources', color: 'bg-orange-500' },
  ];

  return (
    <div className=\"flex flex-col\">
      {/* Hero Section */}
      <section className=\"bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20\">
        <div className=\"max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center\">
          <h1 className=\"text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6\">
            {t('hero.title')}
          </h1>
          <p className=\"text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto\">
            {t('hero.subtitle')}
          </p>
          
          {/* Search Bar */}
          <div className=\"max-w-2xl mx-auto\">
            <div className=\"relative\">
              <input
                type=\"text\"
                placeholder={t('hero.searchPlaceholder')}
                className=\"w-full px-6 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white\"
              />
              <button className=\"absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg\">
                <svg className=\"w-5 h-5\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                  <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z\" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Agency Categories */}
      <section className=\"py-16 bg-white dark:bg-gray-900\">
        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
          <h2 className=\"text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center\">
            {t('categories.title')}
          </h2>
          <div className=\"grid grid-cols-2 md:grid-cols-5 gap-4\">
            {agencies.map((agency) => (
              <Link
                key={agency.slug}
                href={`/agency/${agency.slug}`}
                className=\"group p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all text-center\"
              >
                <div className={`w-12 h-12 ${agency.color} rounded-lg mx-auto mb-4 flex items-center justify-center`}>
                  <svg className=\"w-6 h-6 text-white\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                    <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z\" />
                  </svg>
                </div>
                <h3 className=\"font-semibold text-gray-900 dark:text-white group-hover:text-blue-600\">
                  {agency.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Forms */}
      {featuredForms.length > 0 && (
        <section className=\"py-16 bg-gray-50 dark:bg-gray-800\">
          <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
            <h2 className=\"text-2xl font-bold text-gray-900 dark:text-white mb-8\">
              {t('featured.title')}
            </h2>
            <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">
              {featuredForms.slice(0, 6).map((form) => (
                <FormCard key={form.slug} form={form} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Situations */}
      {situations.length > 0 && (
        <section className=\"py-16 bg-white dark:bg-gray-900\">
          <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
            <div className=\"flex items-center justify-between mb-8\">
              <h2 className=\"text-2xl font-bold text-gray-900 dark:text-white\">
                Browse by Situation
              </h2>
              <Link href=\"/situations\" className=\"text-blue-600 hover:text-blue-700 font-medium\">
                View all →
              </Link>
            </div>
            <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">
              {situations.slice(0, 6).map((situation) => (
                <SituationCard key={situation.slug} situation={situation} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Identity Documents */}
      {identityDocs.length > 0 && (
        <section className=\"py-16 bg-gray-50 dark:bg-gray-800\">
          <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
            <div className=\"flex items-center justify-between mb-8\">
              <h2 className=\"text-2xl font-bold text-gray-900 dark:text-white\">
                Identity & Documents
              </h2>
              <Link href=\"/identity\" className=\"text-blue-600 hover:text-blue-700 font-medium\">
                View all →
              </Link>
            </div>
            <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">
              {identityDocs.map((doc) => (
                <Link
                  key={doc.slug}
                  href={`/identity/${doc.slug}`}
                  className=\"bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 card-hover\"
                >
                  <h3 className=\"text-lg font-semibold text-gray-900 dark:text-white mb-2\">
                    {doc.name}
                  </h3>
                  {doc.plain_english && (
                    <p className=\"text-sm text-gray-600 dark:text-gray-400 line-clamp-2\">
                      {doc.plain_english}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Placeholder content for development */}
      {featuredForms.length === 0 && (
        <section className=\"py-16 bg-gray-50 dark:bg-gray-800\">
          <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
            <div className=\"bg-blue-50 dark:bg-blue-900/30 rounded-xl p-8 text-center\">
              <h2 className=\"text-2xl font-bold text-gray-900 dark:text-white mb-4\">
                Ready to Launch
              </h2>
              <p className=\"text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto\">
                Deploy to Railway and set up your PostgreSQL database. Once connected, the seed data will populate all forms, situations, and identity documents.
              </p>
              <div className=\"flex flex-wrap gap-4 justify-center\">
                <div className=\"bg-white dark:bg-gray-800 rounded-lg p-4 text-left\">
                  <h4 className=\"font-semibold text-gray-900 dark:text-white mb-2\">1. Connect Database</h4>
                  <p className=\"text-sm text-gray-600 dark:text-gray-400\">Add PostgreSQL plugin in Railway and copy connection string to DATABASE_URL</p>
                </div>
                <div className=\"bg-white dark:bg-gray-800 rounded-lg p-4 text-left\">
                  <h4 className=\"font-semibold text-gray-900 dark:text-white mb-2\">2. Deploy</h4>
                  <p className=\"text-sm text-gray-600 dark:text-gray-400\">Push to GitHub and Railway will auto-deploy with migrations and seed</p>
                </div>
                <div className=\"bg-white dark:bg-gray-800 rounded-lg p-4 text-left\">
                  <h4 className=\"font-semibold text-gray-900 dark:text-white mb-2\">3. Domain</h4>
                  <p className=\"text-sm text-gray-600 dark:text-gray-400\">Add whichforms.com in Railway and update DNS CNAME</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
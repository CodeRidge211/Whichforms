import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllIdentityDocs } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Identity & Documents — Find What You Need | WhichForms',
  description: 'Passports, Real ID, Social Security cards, birth certificates and more — explained in plain English.',
};

const categories = [
  { key: 'travel-identity', name: 'Travel & Identity', icon: '✈️' },
  { key: 'domestic-identity', name: 'Domestic ID', icon: '🪪' },
  { key: 'vital-records', name: 'Vital Records', icon: '📋' },
  { key: 'federal-identity', name: 'Federal', icon: '🏛️' },
  { key: 'business-identity', name: 'Business', icon: '💼' },
];

export default async function IdentityHubPage() {
  const docs = await getAllIdentityDocs().catch(() => []);
  
  const groupedDocs: Record<string, typeof docs> = {};
  docs.forEach((doc: any) => {
    const cat = doc.category || 'other';
    if (!groupedDocs[cat]) groupedDocs[cat] = [];
    groupedDocs[cat].push(doc);
  });

  return (
    <div className=\"bg-white dark:bg-gray-900 min-h-screen\">
      {/* Header */}
      <div className=\"bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-16\">
        <div className=\"max-w-4xl mx-auto px-4 text-center\">
          <h1 className=\"text-4xl font-bold text-gray-900 dark:text-white mb-4\">
            Identity & Documents
          </h1>
          <p className=\"text-xl text-gray-600 dark:text-gray-400 mb-8\">
            Passports, driver's licenses, Social Security cards and more — explained simply.
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className=\"max-w-7xl mx-auto px-4 py-12\">
        <div className=\"grid grid-cols-2 md:grid-cols-5 gap-4 mb-12\">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={`#${cat.key}`}
              className=\"bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors\"
            >
              <div className=\"text-3xl mb-2\">{cat.icon}</div>
              <div className=\"font-medium text-gray-900 dark:text-white\">{cat.name}</div>
            </Link>
          ))}
        </div>

        {/* Document Lists by Category */}
        {docs.length > 0 ? (
          <div className=\"space-y-12\">
            {Object.entries(groupedDocs).map(([category, categoryDocs]) => (
              <section key={category} id={category}>
                <h2 className=\"text-2xl font-bold text-gray-900 dark:text-white mb-6\">
                  {category.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </h2>
                <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">
                  {(categoryDocs as any[]).map((doc) => (
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
                      {doc.cost && (
                        <div className=\"mt-4 text-sm text-gray-500\">
                          {doc.cost}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className=\"bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center\">
            <p className=\"text-gray-600 dark:text-gray-400\">
              Identity documents will appear here once the database is seeded.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
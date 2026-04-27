import Link from 'next/link';
import type { Metadata } from 'next';
import FormCard from '@/components/FormCard';
import { getAllForms } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'All Forms — Browse Government Forms | WhichForms',
  description: 'Browse all government forms from IRS, USCIS, SSA, DMV, and more.',
};

const agencies = [
  { slug: 'irs', name: 'IRS', color: 'bg-red-500' },
  { slug: 'uscis', name: 'USCIS', color: 'bg-blue-500' },
  { slug: 'ssa', name: 'SSA', color: 'bg-purple-500' },
  { slug: 'dmv', name: 'DMV', color: 'bg-green-500' },
  { slug: 'sba', name: 'SBA', color: 'bg-orange-500' },
];

export default async function FormsPage() {
  const forms = await getAllForms().catch(() => []);

  return (
    <div className=\"bg-white dark:bg-gray-900 min-h-screen\">
      {/* Header */}
      <div className=\"bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-16\">
        <div className=\"max-w-4xl mx-auto px-4 text-center\">
          <h1 className=\"text-4xl font-bold text-gray-900 dark:text-white mb-4\">
            All Forms
          </h1>
          <p className=\"text-xl text-gray-600 dark:text-gray-400\">
            Browse government forms explained in plain English.
          </p>
        </div>
      </div>

      {/* Agency Filter */}
      <div className=\"max-w-7xl mx-auto px-4 py-8\">
        <div className=\"flex flex-wrap gap-4 mb-8\">
          {agencies.map((agency) => (
            <Link
              key={agency.slug}
              href={`/agency/${agency.slug}`}
              className=\"flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors\"
            >
              <div className={`w-3 h-3 ${agency.color} rounded-full`} />
              <span className=\"font-medium text-gray-900 dark:text-white\">{agency.name}</span>
            </Link>
          ))}
        </div>

        {/* Forms Grid */}
        {forms.length > 0 ? (
          <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">
            {forms.map((form) => (
              <FormCard key={form.slug} form={form} />
            ))}
          </div>
        ) : (
          <div className=\"bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center\">
            <p className=\"text-gray-600 dark:text-gray-400\">
              Forms will appear here once the database is seeded.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
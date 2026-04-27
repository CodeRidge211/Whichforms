import Link from 'next/link';
import type { Metadata } from 'next';
import SituationCard from '@/components/SituationCard';
import { getAllSituations } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Browse by Situation — Find the Forms You Need | WhichForms',
  description: 'Not sure which forms you need? Browse by situation — starting a business, filing taxes, applying for a green card, and more.',
};

const categories = [
  { key: 'business', name: 'Business', color: 'bg-orange-500' },
  { key: 'tax', name: 'Taxes', color: 'bg-green-500' },
  { key: 'immigration', name: 'Immigration', color: 'bg-blue-500' },
  { key: 'employment', name: 'Employment', color: 'bg-purple-500' },
  { key: 'identity', name: 'Identity', color: 'bg-pink-500' },
  { key: 'financial', name: 'Financial', color: 'bg-cyan-500' },
];

export default async function SituationsPage() {
  const situations = await getAllSituations().catch(() => []);
  
  const groupedSituations: Record<string, typeof situations> = {};
  situations.forEach((sit: any) => {
    const cat = sit.category || 'other';
    if (!groupedSituations[cat]) groupedSituations[cat] = [];
    groupedSituations[cat].push(sit);
  });

  return (
    <div className=\"bg-white dark:bg-gray-900 min-h-screen\">
      {/* Header */}
      <div className=\"bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-16\">
        <div className=\"max-w-4xl mx-auto px-4 text-center\">
          <h1 className=\"text-4xl font-bold text-gray-900 dark:text-white mb-4\">
            Browse by Situation
          </h1>
          <p className=\"text-xl text-gray-600 dark:text-gray-400 mb-8\">
            Not sure which forms you need? Find them here — organized by what you're trying to do.
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className=\"max-w-7xl mx-auto px-4 py-12\">
        <div className=\"grid grid-cols-2 md:grid-cols-6 gap-4 mb-12\">
          {categories.map((cat) => (
            <div
              key={cat.key}
              className=\"flex items-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-800\"
            >
              <div className={`w-3 h-3 ${cat.color} rounded-full`} />
              <span className=\"font-medium text-gray-900 dark:text-white\">{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Situation Lists by Category */}
        {situations.length > 0 ? (
          <div className=\"space-y-12\">
            {Object.entries(groupedSituations).map(([category, categorySituations]) => (
              <section key={category}>
                <h2 className=\"text-2xl font-bold text-gray-900 dark:text-white mb-6 capitalize\">
                  {category}
                </h2>
                <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">
                  {(categorySituations as any[]).map((situation) => (
                    <SituationCard key={situation.slug} situation={situation} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className=\"bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center\">
            <p className=\"text-gray-600 dark:text-gray-400\">
              Situations will appear here once the database is seeded.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
import Link from 'next/link';

interface SituationCardProps {
  situation: {
    slug: string;
    title: string;
    description: string | null;
    plain_english: string | null;
    category: string | null;
    form_slugs?: string[];
  };
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  business: { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-800 dark:text-orange-200' },
  tax: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200' },
  immigration: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200' },
  employment: { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-200' },
  identity: { bg: 'bg-pink-100 dark:bg-pink-900', text: 'text-pink-800 dark:text-pink-200' },
  financial: { bg: 'bg-cyan-100 dark:bg-cyan-900', text: 'text-cyan-800 dark:text-cyan-200' },
};

export default function SituationCard({ situation }: SituationCardProps) {
  const colors = categoryColors[situation.category || 'business'] || categoryColors.business;

  return (
    <Link href={`/situation/${situation.slug}`}>
      <div className=\"bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 card-hover h-full\">
        <div className=\"flex items-start justify-between mb-4\">
          <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
            {situation.category?.charAt(0).toUpperCase() + (situation.category?.slice(1) || 'Other')}
          </span>
          <svg className=\"w-5 h-5 text-gray-400\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
            <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M9 5l7 7-7 7\" />
          </svg>
        </div>

        <h3 className=\"text-lg font-semibold text-gray-900 dark:text-white mb-2\">
          {situation.title}
        </h3>

        {situation.plain_english && (
          <p className=\"text-sm text-gray-600 dark:text-gray-400 line-clamp-3\">
            {situation.plain_english}
          </p>
        )}
      </div>
    </Link>
  );
}
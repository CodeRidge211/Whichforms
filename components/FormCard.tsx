import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface FormCardProps {
  form: {
    slug: string;
    form_number: string | null;
    name: string;
    agency: string;
    agency_slug: string;
    plain_english: string | null;
    difficulty_level: string | null;
    cost: string | null;
    is_featured?: boolean;
  };
}

export default function FormCard({ form }: FormCardProps) {
  const t = useTranslations('form');

  const agencyColors: Record<string, string> = {
    irs: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    uscis: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    ssa: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    dmv: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    sba: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'state-sos': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  };

  const difficultyColors: Record<string, string> = {
    easy: 'text-green-600 dark:text-green-400',
    moderate: 'text-yellow-600 dark:text-yellow-400',
    complex: 'text-red-600 dark:text-red-400',
  };

  return (
    <Link href={`/form/${form.slug}`}>
      <div className=\"bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 card-hover h-full\">
        <div className=\"flex items-start justify-between mb-4\">
          <div>
            {form.form_number && (
              <span className=\"inline-block text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded mb-2\">
                {form.form_number}
              </span>
            )}
            <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${agencyColors[form.agency_slug] || 'bg-gray-100 text-gray-800'}`}>
              {form.agency}
            </span>
          </div>
          {form.is_featured && (
            <span className=\"inline-flex items-center text-xs font-medium text-accent\">
              <svg className=\"w-4 h-4 mr-1\" fill=\"currentColor\" viewBox=\"0 0 20 20\">
                <path d=\"M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z\" />
              </svg>
              Featured
            </span>
          )}
        </div>

        <h3 className=\"text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2\">
          {form.name}
        </h3>

        {form.plain_english && (
          <p className=\"text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2\">
            {form.plain_english}
          </p>
        )}

        <div className=\"flex items-center gap-4 text-sm\">
          {form.difficulty_level && (
            <div className={`flex items-center ${difficultyColors[form.difficulty_level]}`}>
              <svg className=\"w-4 h-4 mr-1\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z\" />
              </svg>
              {form.difficulty_level.charAt(0).toUpperCase() + form.difficulty_level.slice(1)}
            </div>
          )}
          {form.cost && (
            <div className=\"flex items-center text-gray-500 dark:text-gray-400\">
              <svg className=\"w-4 h-4 mr-1\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z\" />
              </svg>
              {form.cost}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
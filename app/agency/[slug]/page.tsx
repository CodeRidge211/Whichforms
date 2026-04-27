import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import FormCard from '@/components/FormCard';
import { getFormsByAgency } from '@/lib/queries';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const agencies: Record<string, { name: string; description: string; color: string }> = {
  irs: {
    name: 'IRS',
    description: 'Internal Revenue Service — tax forms for individuals and businesses',
    color: 'bg-red-500',
  },
  uscis: {
    name: 'USCIS',
    description: 'US Citizenship and Immigration Services — immigration and citizenship forms',
    color: 'bg-blue-500',
  },
  ssa: {
    name: 'Social Security Administration',
    description: 'Social Security — SSN cards, benefits, and retirement',
    color: 'bg-purple-500',
  },
  dmv: {
    name: 'DMV',
    description: 'Department of Motor Vehicles — driver licenses and vehicle registration',
    color: 'bg-green-500',
  },
  sba: {
    name: 'SBA',
    description: 'Small Business Administration — business loans and resources',
    color: 'bg-orange-500',
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const agency = agencies[slug];

  if (!agency) {
    return { title: 'Agency Not Found' };
  }

  return {
    title: `${agency.name} Forms — ${agency.description.split(' — ')[0]} | WhichForms`,
    description: agency.description,
  };
}

export default async function AgencyPage({ params }: PageProps) {
  const { slug } = await params;
  const agency = agencies[slug];

  if (!agency) {
    notFound();
  }

  const forms = await getFormsByAgency(slug).catch(() => []);

  return (
    <div className=\"bg-white dark:bg-gray-900 min-h-screen\">
      {/* Header */}
      <div className=\"bg-gray-50 dark:bg-gray-800 border-b\">
        <div className=\"max-w-7xl mx-auto px-4 py-12\">
          <div className=\"flex items-center gap-4 mb-4\">
            <div className={`w-12 h-12 ${agency.color} rounded-lg flex items-center justify-center`}>
              <svg className=\"w-6 h-6 text-white\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4\" />
              </svg>
            </div>
            <div>
              <h1 className=\"text-3xl font-bold text-gray-900 dark:text-white\">{agency.name}</h1>
              <p className=\"text-gray-600 dark:text-gray-400\">{agency.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Forms Grid */}
      <div className=\"max-w-7xl mx-auto px-4 py-12\">
        <h2 className=\"text-2xl font-bold text-gray-900 dark:text-white mb-6\">
          {forms.length} {forms.length === 1 ? 'Form' : 'Forms'} Available
        </h2>

        {forms.length > 0 ? (
          <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">
            {forms.map((form) => (
              <FormCard key={form.slug} form={form} />
            ))}
          </div>
        ) : (
          <div className=\"bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center\">
            <p className=\"text-gray-600 dark:text-gray-400\">
              No forms available for this agency yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
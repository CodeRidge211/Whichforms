import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ state: string }>;
}

const stateNames: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state } = await params;
  const stateName = stateNames[state.toUpperCase()];

  if (!stateName) {
    return { title: 'State Not Found' };
  }

  return {
    title: `${stateName} Forms — DMV, Secretary of State | WhichForms`,
    description: `Find ${stateName} government forms for DMV, Secretary of State, and more.`,
  };
}

export default async function StatePage({ params }: PageProps) {
  const { state } = await params;
  const stateCode = state.toUpperCase();
  const stateName = stateNames[stateCode];

  if (!stateName) {
    notFound();
  }

  // Placeholder forms for demonstration - in production, these would come from the database
  const stateForms = [
    { slug: `${stateCode.toLowerCase()}-drivers-license`, name: 'Driver License Application', agency: 'DMV', description: 'Apply for a new or renewal driver license' },
    { slug: `${stateCode.toLowerCase()}-vehicle-registration`, name: 'Vehicle Registration', agency: 'DMV', description: 'Register a new or transfer vehicle ownership' },
    { slug: `${stateCode.toLowerCase()}-business-registration`, name: 'Business Registration', agency: 'Secretary of State', description: 'Register a new business entity' },
    { slug: `${stateCode.toLowerCase()}/voter-registration`, name: 'Voter Registration', agency: 'Elections', description: 'Register to vote or update voter information' },
  ];

  return (
    <div className=\"bg-white dark:bg-gray-900 min-h-screen\">
      {/* Header */}
      <div className=\"bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-16\">
        <div className=\"max-w-4xl mx-auto px-4\">
          <nav className=\"flex items-center gap-2 text-sm mb-6\">
            <Link href=\"/state\" className=\"text-gray-500 hover:text-blue-600\">All States</Link>
            <span className=\"text-gray-400\">/</span>
            <span className=\"text-gray-900 dark:text-gray-300\">{stateName}</span>
          </nav>
          <h1 className=\"text-4xl font-bold text-gray-900 dark:text-white mb-4\">
            {stateName} Forms
          </h1>
          <p className=\"text-xl text-gray-600 dark:text-gray-400\">
            Government forms for {stateName}. DMV, Secretary of State, and more.
          </p>
        </div>
      </div>

      {/* Forms Grid */}
      <div className=\"max-w-4xl mx-auto px-4 py-12\">
        <div className=\"grid gap-4\">
          {stateForms.map((form) => (
            <Link
              key={form.slug}
              href={`/state/${stateCode}/${form.slug}`}
              className=\"block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors\"
            >
              <div className=\"flex items-start justify-between\">
                <div>
                  <span className=\"inline-block text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded mb-2\">
                    {form.agency}
                  </span>
                  <h3 className=\"text-lg font-semibold text-gray-900 dark:text-white mb-2\">
                    {form.name}
                  </h3>
                  <p className=\"text-gray-600 dark:text-gray-400\">
                    {form.description}
                  </p>
                </div>
                <svg className=\"w-5 h-5 text-gray-400 mt-1\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                  <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M9 5l7 7-7 7\" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
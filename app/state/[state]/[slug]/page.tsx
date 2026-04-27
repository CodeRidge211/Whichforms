import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ state: string; slug: string }>;
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
  const { state, slug } = await params;
  const stateName = stateNames[state.toUpperCase()];

  if (!stateName) {
    return { title: 'Form Not Found' };
  }

  const formName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    title: `${formName} — ${stateName} | WhichForms`,
    description: `Learn about the ${formName} in ${stateName}. What it is, who needs it, and how to get it.`,
  };
}

export default async function StateFormPage({ params }: PageProps) {
  const { state, slug } = await params;
  const stateCode = state.toUpperCase();
  const stateName = stateNames[stateCode];

  if (!stateName) {
    notFound();
  }

  // JSON-LD Schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentPermit',
    name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    issuingAuthority: `${stateName} Government`,
    jurisdiction: {
      '@type': 'State',
      name: stateName,
    },
  };

  const formName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Sample content - in production this would come from database
  const formData = {
    name: formName,
    agency: 'State DMV',
    description: 'This form is required for residents of ' + stateName + '.',
    who_needs_it: 'All residents who meet the eligibility requirements.',
    deadline: 'Varies by application type',
    processing_time: '2-4 weeks typically',
    cost: 'Check with local DMV for current fees',
    difficulty: 'Moderate',
    official_url: `https://www.dmv.ca.gov/portal/dmvdetail/${slug}`,
    states: [stateCode],
    situations: ['getting-driver-license', 'registering-vehicle'],
    faqs: [
      { q: 'How long does processing take?', a: 'Processing typically takes 2-4 weeks after submission.' },
      { q: 'Can I apply online?', a: 'Many applications can be completed online through the state DMV portal.' },
      { q: 'What documents do I need?', a: 'Typically you need proof of identity, residency, and Social Security number.' },
    ],
  };

  return (
    <div className=\"bg-white dark:bg-gray-900 min-h-screen\">
      {/* JSON-LD Schema */}
      <script
        type=\"application/ld+json\"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className=\"bg-gray-50 dark:bg-gray-800 border-b\">
        <div className=\"max-w-4xl mx-auto px-4 py-3\">
          <nav className=\"flex items-center gap-2 text-sm\">
            <Link href=\"/\" className=\"text-gray-500 hover:text-blue-600\">Home</Link>
            <span className=\"text-gray-400\">/</span>
            <Link href=\"/state\" className=\"text-gray-500 hover:text-blue-600\">States</Link>
            <span className=\"text-gray-400\">/</span>
            <Link href={`/state/${stateCode}`} className=\"text-gray-500 hover:text-blue-600\">{stateName}</Link>
            <span className=\"text-gray-400\">/</span>
            <span className=\"text-gray-900 dark:text-gray-300 font-medium\">{formData.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className=\"max-w-4xl mx-auto px-4 py-12\">
        {/* Header */}
        <header className=\"mb-8\">
          <span className=\"inline-block text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2.5 py-0.5 rounded-full mb-3\">
            {stateName}
          </span>
          <h1 className=\"text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4\">
            {formData.name}
          </h1>
          <p className=\"text-lg text-gray-600 dark:text-gray-400\">
            {formData.description}
          </p>
        </header>

        {/* Key Information Grid */}
        <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4 mb-8\">
          <div className=\"bg-gray-50 dark:bg-gray-800 rounded-lg p-4\">
            <div className=\"text-sm text-gray-500 mb-1\">Agency</div>
            <div className=\"font-medium text-gray-900 dark:text-white\">{formData.agency}</div>
          </div>
          <div className=\"bg-gray-50 dark:bg-gray-800 rounded-lg p-4\">
            <div className=\"text-sm text-gray-500 mb-1\">Difficulty</div>
            <div className=\"font-medium text-gray-900 dark:text-white\">{formData.difficulty}</div>
          </div>
          <div className=\"bg-gray-50 dark:bg-gray-800 rounded-lg p-4\">
            <div className=\"text-sm text-gray-500 mb-1\">Processing Time</div>
            <div className=\"font-medium text-gray-900 dark:text-white\">{formData.processing_time}</div>
          </div>
          <div className=\"bg-gray-50 dark:bg-gray-800 rounded-lg p-4\">
            <div className=\"text-sm text-gray-500 mb-1\">Cost</div>
            <div className=\"font-medium text-gray-900 dark:text-white\">{formData.cost}</div>
          </div>
        </div>

        {/* Sections */}
        <div className=\"space-y-8\">
          {/* Who Needs It */}
          <section>
            <h2 className=\"text-xl font-bold text-gray-900 dark:text-white mb-4\">Who needs it?</h2>
            <div className=\"bg-gray-50 dark:bg-gray-800 rounded-lg p-6\">
              <p className=\"text-gray-700 dark:text-gray-300\">{formData.who_needs_it}</p>
            </div>
          </section>

          {/* Deadline */}
          <section>
            <h2 className=\"text-xl font-bold text-gray-900 dark:text-white mb-4\">Deadline</h2>
            <div className=\"bg-gray-50 dark:bg-gray-800 rounded-lg p-6\">
              <p className=\"text-gray-700 dark:text-gray-300\">{formData.deadline}</p>
            </div>
          </section>

          {/* Official Site */}
          <section>
            <h2 className=\"text-xl font-bold text-gray-900 dark:text-white mb-4\">Official site</h2>
            <a
              href={formData.official_url}
              target=\"_blank\"
              rel=\"noopener noreferrer\"
              className=\"inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors\"
            >
              Download or fill out on official site
              <svg className=\"w-4 h-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14\" />
              </svg>
            </a>
          </section>

          {/* FAQs */}
          {formData.faqs && formData.faqs.length > 0 && (
            <section className=\"mt-12\">
              <h2 className=\"text-2xl font-bold text-gray-900 dark:text-white mb-6\">
                Frequently Asked Questions
              </h2>
              <div className=\"space-y-4\">
                {formData.faqs.map((faq, index) => (
                  <details
                    key={index}
                    className=\"group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700\"
                  >
                    <summary className=\"flex items-center justify-between cursor-pointer p-6 font-medium text-gray-900 dark:text-white hover:text-blue-600 transition-colors list-none\">
                      <span>{faq.q}</span>
                      <svg
                        className=\"w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform\"
                        fill=\"none\"
                        stroke=\"currentColor\"
                        viewBox=\"0 0 24 24\"
                      >
                        <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M19 9l-7 7-7-7\" />
                      </svg>
                    </summary>
                    <div className=\"px-6 pb-6 text-gray-600 dark:text-gray-400\">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
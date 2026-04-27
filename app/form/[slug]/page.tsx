import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getFormBySlug } from '@/lib/queries';
import AffiliateBlock from '@/components/AffiliateBlock';
import FAQSection from '@/components/FAQSection';

interface PageProps {
  params: Promise<{ slug: string; locale?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const form = await getFormBySlug(slug).catch(() => null);

  if (!form) {
    return { title: 'Form Not Found' };
  }

  return {
    title: `${form.name} — What It Is, Who Needs It | WhichForms`,
    description: form.plain_english || form.description || `${form.name} explained in plain English.`,
    openGraph: {
      title: `${form.name} — What It Is, Who Needs It | WhichForms`,
      description: form.plain_english || form.description || '',
      type: 'article',
    },
  };
}

export default async function FormPage({ params }: PageProps) {
  const { slug } = await params;
  const form = await getFormBySlug(slug).catch(() => null);

  if (!form) {
    notFound();
  }

  // Generate JSON-LD for form page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: form.name,
    description: form.plain_english || form.description,
    author: {
      '@type': 'Organization',
      name: 'WhichForms',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sovereign Ridge Partners LLC',
    },
  };

  const agencyColors: Record<string, string> = {
    irs: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    uscis: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    ssa: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    dmv: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  return (
    <>
      <script
        type=\"application/ld+json\"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className=\"bg-white dark:bg-gray-900 min-h-screen\">
        {/* Breadcrumb */}
        <div className=\"bg-gray-50 dark:bg-gray-800 border-b\">
          <div className=\"max-w-4xl mx-auto px-4 py-3\">
            <nav className=\"flex items-center gap-2 text-sm\">
              <Link href=\"/\" className=\"text-gray-500 hover:text-blue-600\">Home</Link>
              <span className=\"text-gray-400\">/</span>
              <Link href=\"/forms\" className=\"text-gray-500 hover:text-blue-600\">Forms</Link>
              <span className=\"text-gray-400\">/</span>
              <Link href={`/agency/${form.agency_slug}`} className=\"text-gray-500 hover:text-blue-600\">
                {form.agency}
              </Link>
              <span className=\"text-gray-400\">/</span>
              <span className=\"text-gray-900 dark:text-gray-300 font-medium truncate\">{form.name}</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className=\"max-w-4xl mx-auto px-4 py-12\">
          {/* Header */}
          <header className=\"mb-8\">
            <div className=\"flex items-center gap-3 mb-4\">
              {form.form_number && (
                <span className=\"inline-block text-sm font-mono bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded\">
                  {form.form_number}
                </span>
              )}
              <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${agencyColors[form.agency_slug] || 'bg-gray-100 text-gray-800'}`}>
                {form.agency}
              </span>
            </div>
            <h1 className=\"text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4\">
              {form.name}
            </h1>
          </header>

          {/* Quick Info Grid */}
          <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4 mb-8\">
            {form.cost && (
              <div className=\"bg-gray-50 dark:bg-gray-800 rounded-lg p-4\">
                <div className=\"text-sm text-gray-500 dark:text-gray-400 mb-1\">Cost</div>
                <div className=\"font-semibold text-gray-900 dark:text-white\">{form.cost}</div>
              </div>
            )}
            {form.deadline && (
              <div className=\"bg-gray-50 dark:bg-gray-800 rounded-lg p-4\">
                <div className=\"text-sm text-gray-500 dark:text-gray-400 mb-1\">Deadline</div>
                <div className=\"font-semibold text-gray-900 dark:text-white\">{form.deadline}</div>
              </div>
            )}
            {form.processing_time && (
              <div className=\"bg-gray-50 dark:bg-gray-800 rounded-lg p-4\">
                <div className=\"text-sm text-gray-500 dark:text-gray-400 mb-1\">Processing</div>
                <div className=\"font-semibold text-gray-900 dark:text-white\">{form.processing_time}</div>
              </div>
            )}
            {form.difficulty_level && (
              <div className=\"bg-gray-50 dark:bg-gray-800 rounded-lg p-4\">
                <div className=\"text-sm text-gray-500 dark:text-gray-400 mb-1\">Difficulty</div>
                <div className=\"font-semibold text-gray-900 dark:text-white capitalize\">{form.difficulty_level}</div>
              </div>
            )}
          </div>

          {/* Plain English Explanation */}
          <div className=\"prose dark:prose-invert max-w-none mb-8\">
            {form.plain_english && (
              <div className=\"bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8\">
                <h2 className=\"text-xl font-bold text-gray-900 dark:text-white mb-3\">What is it?</h2>
                <p className=\"text-gray-700 dark:text-gray-300 leading-relaxed text-lg\">
                  {form.plain_english}
                </p>
              </div>
            )}

            {form.who_needs_it && (
              <div className=\"mb-8\">
                <h2 className=\"text-xl font-bold text-gray-900 dark:text-white mb-3\">Who needs it?</h2>
                <p className=\"text-gray-700 dark:text-gray-300\">{form.who_needs_it}</p>
              </div>
            )}
          </div>

          {/* Official Links */}
          <div className=\"flex flex-wrap gap-4 mb-8\">
            {form.official_url && (
              <a
                href={form.official_url}
                target=\"_blank\"
                rel=\"noopener noreferrer\"
                className=\"inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors\"
              >
                <svg className=\"w-5 h-5 mr-2\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                  <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4\" />
                </svg>
                Download Form
              </a>
            )}
            {form.instructions_url && (
              <a
                href={form.instructions_url}
                target=\"_blank\"
                rel=\"noopener noreferrer\"
                className=\"inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg transition-colors\"
              >
                <svg className=\"w-5 h-5 mr-2\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                  <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z\" />
                </svg>
                Instructions
              </a>
            )}
          </div>

          {/* Affiliate CTA */}
          {form.affiliate_type && <AffiliateBlock affiliateType={form.affiliate_type} />}

          {/* FAQ Section */}
          <FAQSection faqs={form.faqs || []} pageType=\"form\" />
        </div>
      </div>
    </>
  );
}
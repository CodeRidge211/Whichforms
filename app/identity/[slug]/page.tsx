import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getIdentityDocBySlug } from '@/lib/queries';
import FAQSection from '@/components/FAQSection';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getIdentityDocBySlug(slug).catch(() => null);

  if (!doc) {
    return { title: 'Document Not Found' };
  }

  return {
    title: `${doc.name} — What It Is, How to Get It | WhichForms`,
    description: doc.plain_english || '',
  };
}

export default async function IdentityPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = await getIdentityDocBySlug(slug).catch(() => null);

  if (!doc) {
    notFound();
  }

  return (
    <div className=\"bg-white dark:bg-gray-900 min-h-screen\">
      {/* Breadcrumb */}
      <div className=\"bg-gray-50 dark:bg-gray-800 border-b\">
        <div className=\"max-w-4xl mx-auto px-4 py-3\">
          <nav className=\"flex items-center gap-2 text-sm\">
            <Link href=\"/\" className=\"text-gray-500 hover:text-blue-600\">Home</Link>
            <span className=\"text-gray-400\">/</span>
            <Link href=\"/identity\" className=\"text-gray-500 hover:text-blue-600\">Identity</Link>
            <span className=\"text-gray-400\">/</span>
            <span className=\"text-gray-900 dark:text-gray-300 font-medium\">{doc.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className=\"max-w-4xl mx-auto px-4 py-12\">
        {/* Header */}
        <header className=\"mb-8\">
          {doc.category && (
            <span className=\"inline-block text-sm font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full mb-4\">
              {doc.category.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </span>
          )}
          <h1 className=\"text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4\">
            {doc.name}
          </h1>
        </header>

        {/* Quick Info Grid */}
        <div className=\"grid grid-cols-2 md:grid-cols-3 gap-4 mb-8\">
          {doc.cost && (
            <div className=\"bg-gray-50 dark:bg-gray-800 rounded-lg p-4\">
              <div className=\"text-sm text-gray-500 dark:text-gray-400 mb-1\">Cost</div>
              <div className=\"font-semibold text-gray-900 dark:text-white\">{doc.cost}</div>
            </div>
          )}
          {doc.processing_time && (
            <div className=\"bg-gray-50 dark:bg-gray-800 rounded-lg p-4\">
              <div className=\"text-sm text-gray-500 dark:text-gray-400 mb-1\">Processing Time</div>
              <div className=\"font-semibold text-gray-900 dark:text-white\">{doc.processing_time}</div>
            </div>
          )}
          {doc.renewal_period && (
            <div className=\"bg-gray-50 dark:bg-gray-800 rounded-lg p-4\">
              <div className=\"text-sm text-gray-500 dark:text-gray-400 mb-1\">Renewal</div>
              <div className=\"font-semibold text-gray-900 dark:text-white\">{doc.renewal_period}</div>
            </div>
          )}
        </div>

        {/* Plain English Explanation */}
        {doc.plain_english && (
          <div className=\"bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8\">
            <p className=\"text-gray-700 dark:text-gray-300 text-lg leading-relaxed\">
              {doc.plain_english}
            </p>
          </div>
        )}

        {/* Who Needs It */}
        {doc.who_needs_it && (
          <div className=\"mb-8\">
            <h2 className=\"text-xl font-bold text-gray-900 dark:text-white mb-3\">Who needs it?</h2>
            <p className=\"text-gray-700 dark:text-gray-300\">{doc.who_needs_it}</p>
          </div>
        )}

        {/* Required Documents */}
        {doc.required_documents && doc.required_documents.length > 0 && (
          <div className=\"mb-8\">
            <h2 className=\"text-xl font-bold text-gray-900 dark:text-white mb-4\">What you'll need</h2>
            <ul className=\"space-y-3\">
              {doc.required_documents.map((doc_item, index) => (
                <li key={index} className=\"flex items-start gap-3\">
                  <svg className=\"w-5 h-5 text-green-500 flex-shrink-0 mt-0.5\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                    <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z\" />
                  </svg>
                  <span className=\"text-gray-700 dark:text-gray-300\">{doc_item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Official Link */}
        {doc.official_url && (
          <div className=\"mb-8\">
            <a
              href={doc.official_url}
              target=\"_blank\"
              rel=\"noopener noreferrer\"
              className=\"inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors\"
            >
              <svg className=\"w-5 h-5 mr-2\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14\" />
              </svg>
              Visit Official Website
            </a>
          </div>
        )}

        {/* FAQ Section */}
        <FAQSection faqs={doc.faqs || []} pageType=\"identity\" />
      </div>
    </div>
  );
}
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getSituationBySlug } from '@/lib/queries';
import FAQSection from '@/components/FAQSection';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const situation = await getSituationBySlug(slug).catch(() => null);

  if (!situation) {
    return { title: 'Situation Not Found' };
  }

  return {
    title: `${situation.title} — What Forms Do You Need? | WhichForms`,
    description: situation.plain_english || situation.description || '',
  };
}

export default async function SituationPage({ params }: PageProps) {
  const { slug } = await params;
  const situation = await getSituationBySlug(slug).catch(() => null);

  if (!situation) {
    notFound();
  }

  const categoryColors: Record<string, { bg: string; text: string }> = {
    business: { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-800 dark:text-orange-200' },
    tax: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200' },
    immigration: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200' },
    employment: { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-200' },
    identity: { bg: 'bg-pink-100 dark:bg-pink-900', text: 'text-pink-800 dark:text-pink-200' },
    financial: { bg: 'bg-cyan-100 dark:bg-cyan-900', text: 'text-cyan-800 dark:text-cyan-200' },
  };

  const colors = categoryColors[situation.category || 'business'] || categoryColors.business;

  return (
    <div className=\"bg-white dark:bg-gray-900 min-h-screen\">
      {/* Breadcrumb */}
      <div className=\"bg-gray-50 dark:bg-gray-800 border-b\">
        <div className=\"max-w-4xl mx-auto px-4 py-3\">
          <nav className=\"flex items-center gap-2 text-sm\">
            <Link href=\"/\" className=\"text-gray-500 hover:text-blue-600\">Home</Link>
            <span className=\"text-gray-400\">/</span>
            <Link href=\"/situations\" className=\"text-gray-500 hover:text-blue-600\">Situations</Link>
            <span className=\"text-gray-400\">/</span>
            <span className=\"text-gray-900 dark:text-gray-300 font-medium\">{situation.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className=\"max-w-4xl mx-auto px-4 py-12\">
        {/* Header */}
        <header className=\"mb-8\">
          <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${colors.bg} ${colors.text} mb-4`}>
            {situation.category?.charAt(0).toUpperCase() + (situation.category?.slice(1) || 'Other')}
          </span>
          <h1 className=\"text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4\">
            {situation.title}
          </h1>
          {situation.plain_english && (
            <p className=\"text-xl text-gray-600 dark:text-gray-400\">{situation.plain_english}</p>
          )}
        </header>

        {/* Forms Section */}
        {situation.form_situations && situation.form_situations.length > 0 && (
          <section className=\"mb-12\">
            <h2 className=\"text-2xl font-bold text-gray-900 dark:text-white mb-6\">Forms you'll need</h2>
            <div className=\"space-y-4\">
              {situation.form_situations.map((fs: any) => (
                <Link
                  key={fs.form.slug}
                  href={`/form/${fs.form.slug}`}
                  className=\"block bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700\"
                >
                  <div className=\"flex items-start justify-between\">
                    <div>
                      {fs.form.form_number && (
                        <span className=\"inline-block text-xs font-mono bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded mb-2\">
                          {fs.form.form_number}
                        </span>
                      )}
                      <h3 className=\"text-lg font-semibold text-gray-900 dark:text-white mb-1\">
                        {fs.form.name}
                      </h3>
                      {fs.form.plain_english && (
                        <p className=\"text-sm text-gray-600 dark:text-gray-400 line-clamp-2\">
                          {fs.form.plain_english}
                        </p>
                      )}
                    </div>
                    <svg className=\"w-5 h-5 text-gray-400 flex-shrink-0\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                      <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M9 5l7 7-7 7\" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Identity Documents Section */}
        {situation.situation_identity_docs && situation.situation_identity_docs.length > 0 && (
          <section className=\"mb-12\">
            <h2 className=\"text-2xl font-bold text-gray-900 dark:text-white mb-6\">Documents you'll need</h2>
            <div className=\"space-y-4\">
              {situation.situation_identity_docs.map((sid: any) => (
                <Link
                  key={sid.identity_doc.slug}
                  href={`/identity/${sid.identity_doc.slug}`}
                  className=\"block bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700\"
                >
                  <div className=\"flex items-start justify-between\">
                    <div>
                      <h3 className=\"text-lg font-semibold text-gray-900 dark:text-white mb-1\">
                        {sid.identity_doc.name}
                      </h3>
                      {sid.identity_doc.plain_english && (
                        <p className=\"text-sm text-gray-600 dark:text-gray-400 line-clamp-2\">
                          {sid.identity_doc.plain_english}
                        </p>
                      )}
                    </div>
                    <svg className=\"w-5 h-5 text-gray-400 flex-shrink-0\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                      <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M9 5l7 7-7 7\" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <FAQSection faqs={situation.faqs || []} pageType=\"situation\" />
      </div>
    </div>
  );
}
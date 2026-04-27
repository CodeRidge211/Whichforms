interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  pageType: 'form' | 'situation' | 'identity';
}

export default function FAQSection({ faqs, pageType }: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  // Generate JSON-LD schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      {/* JSON-LD Schema for SEO */}
      <script
        type=\"application/ld+json\"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className=\"mt-12\">
        <h2 className=\"text-2xl font-bold text-gray-900 dark:text-white mb-6\">
          Frequently Asked Questions
        </h2>
        <div className=\"space-y-4\">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className=\"group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700\"
            >
              <summary className=\"flex items-center justify-between cursor-pointer p-6 font-medium text-gray-900 dark:text-white hover:text-primary transition-colors list-none\">
                <span>{faq.question}</span>
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
                <p className=\"leading-relaxed\">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
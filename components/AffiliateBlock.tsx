import Link from 'next/link';

interface AffiliateBlockProps {
  affiliateType: string;
  affiliateUrl?: string;
}

const affiliates: Record<string, { name: string; description: string; cta: string; defaultUrl: string }> = {
  turbotax: {
    name: 'TurboTax',
    description: 'Let a pro handle your tax filing. Guaranteed accurate, maximum refund.',
    cta: 'Start Free with TurboTax',
    defaultUrl: 'https://turbotax.intuit.com',
  },
  hrblock: {
    name: 'H&R Block',
    description: 'Expert tax help from real tax pros. In-person or online.',
    cta: 'Get Expert Tax Help',
    defaultUrl: 'https://www.hrblock.com',
  },
  legalzoom: {
    name: 'LegalZoom',
    description: 'File your business paperwork online in minutes. No lawyer needed.',
    cta: 'Start Your Business Today',
    defaultUrl: 'https://www.legalzoom.com',
  },
  northwest: {
    name: 'Northwest Registered Agent',
    description: 'Wyoming LLC specialists with excellent privacy protection.',
    cta: 'Form Your Wyoming LLC',
    defaultUrl: 'https://www.northwestregisteredagent.com',
  },
  boundless: {
    name: 'Boundless',
    description: 'Immigration help from licensed attorneys. Simple process, real experts.',
    cta: 'Get Immigration Help',
    defaultUrl: 'https://www.boundless.com',
  },
  rocketlawyer: {
    name: 'Rocket Lawyer',
    description: 'Have an attorney review your documents. Legal help made simple.',
    cta: 'Talk to an Attorney',
    defaultUrl: 'https://www.rocketlawyer.com',
  },
};

// Server component that reads environment variables and passes to client
export default function AffiliateBlock({ affiliateType, affiliateUrl }: AffiliateBlockProps) {
  const affiliate = affiliates[affiliateType];

  if (!affiliate) return null;

  // Use passed URL, or fall back to env var, or use default
  const url = affiliateUrl || process.env[`NEXT_PUBLIC_${affiliateType.toUpperCase()}_URL`] || affiliate.defaultUrl;

  return (
    <div className=\"bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-xl p-6 my-8\">
      <div className=\"flex flex-col sm:flex-row sm:items-center justify-between gap-4\">
        <div>
          <div className=\"flex items-center gap-2 mb-2\">
            <span className=\"text-sm font-medium text-primary\">Sponsored</span>
            <span className=\"text-xs text-gray-500\">•</span>
            <span className=\"text-xs text-gray-500\">Affiliate link</span>
          </div>
          <h4 className=\"text-lg font-semibold text-gray-900 dark:text-white mb-1\">
            {affiliate.name}
          </h4>
          <p className=\"text-sm text-gray-600 dark:text-gray-400\">
            {affiliate.description}
          </p>
        </div>
        <Link
          href={url}
          target=\"_blank\"
          rel=\"noopener noreferrer nofollow sponsored\"
          className=\"inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors whitespace-nowrap\"
        >
          {affiliate.cta}
          <svg className=\"w-4 h-4 ml-2\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
            <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14\" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
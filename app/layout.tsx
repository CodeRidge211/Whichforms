import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'WhichForms — The paperwork you need, explained',
    template: '%s | WhichForms',
  },
  description: 'Find any government form explained in plain English. IRS, DMV, USCIS, SSA — we tell you exactly what you need and how to get it.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://whichforms.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'WhichForms',
  },
};

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
    { locale: 'ru' },
    { locale: 'zh' },
    { locale: 'pt' },
  ];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className=\"antialiased\">
        <NextIntlClientProvider messages={messages}>
          <div className=\"min-h-screen flex flex-col\">
            <Header locale={locale} />
            <main className=\"flex-1\">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

import Link from 'next/link';

function Header({ locale }: { locale: string }) {
  const navItems = [
    { href: '/forms', label: 'Forms' },
    { href: '/situations', label: 'Situations' },
    { href: '/identity', label: 'Identity' },
  ];

  return (
    <header className=\"border-b bg-white dark:bg-gray-900 sticky top-0 z-50\">
      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
        <div className=\"flex h-16 items-center justify-between\">
          <Link href={locale === 'en' ? '/' : `/${locale}`} className=\"flex items-center gap-2\">
            <div className=\"w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center\">
              <svg className=\"w-5 h-5 text-white\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z\" />
              </svg>
            </div>
            <span className=\"text-xl font-bold text-gray-900 dark:text-white\">WhichForms</span>
          </Link>

          <nav className=\"hidden md:flex items-center gap-8\">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={locale === 'en' ? item.href : `/${locale}${item.href}`}
                className=\"text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400\"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className=\"flex items-center gap-4\">
            <div className=\"flex items-center gap-2 text-sm text-gray-500\">
              {locale !== 'en' && (
                <span className=\"px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded\">
                  {locale.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className=\"border-t bg-gray-50 dark:bg-gray-900\">
      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12\">
        <div className=\"grid grid-cols-1 md:grid-cols-4 gap-8\">
          <div className=\"md:col-span-2\">
            <div className=\"flex items-center gap-2 mb-4\">
              <div className=\"w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center\">
                <svg className=\"w-5 h-5 text-white\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                  <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z\" />
                </svg>
              </div>
              <span className=\"text-xl font-bold text-gray-900 dark:text-white\">WhichForms</span>
            </div>
            <p className=\"text-gray-600 dark:text-gray-400 mb-4\">
              Making government paperwork less confusing, one form at a time.
            </p>
            <p className=\"text-sm text-gray-500 dark:text-gray-500\">
              © {new Date().getFullYear()} Sovereign Ridge Partners LLC
            </p>
          </div>
          <div>
            <h3 className=\"font-semibold text-gray-900 dark:text-white mb-4\">Browse</h3>
            <ul className=\"space-y-2\">
              <li><Link href=\"/forms\" className=\"text-gray-600 dark:text-gray-400 hover:text-blue-600\">Forms</Link></li>
              <li><Link href=\"/situations\" className=\"text-gray-600 dark:text-gray-400 hover:text-blue-600\">Situations</Link></li>
              <li><Link href=\"/identity\" className=\"text-gray-600 dark:text-gray-400 hover:text-blue-600\">Identity</Link></li>
            </ul>
          </div>
          <div>
            <h3 className=\"font-semibold text-gray-900 dark:text-white mb-4\">Legal</h3>
            <ul className=\"space-y-2\">
              <li><Link href=\"/privacy\" className=\"text-gray-600 dark:text-gray-400 hover:text-blue-600\">Privacy Policy</Link></li>
              <li><Link href=\"/terms\" className=\"text-gray-600 dark:text-gray-400 hover:text-blue-600\">Terms of Service</Link></li>
              <li><Link href=\"/affiliate-disclosure\" className=\"text-gray-600 dark:text-gray-400 hover:text-blue-600\">Affiliate Disclosure</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
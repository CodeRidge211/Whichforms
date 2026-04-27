'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const t = useTranslations('nav');

  return (
    <div className=\"min-h-screen flex flex-col\">
      <Header />
      <main className=\"flex-1\">{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  const t = useTranslations('nav');
  const tMeta = useTranslations('metadata');

  return (
    <header className=\"border-b bg-white dark:bg-gray-900 sticky top-0 z-50\">
      <div className=\"container-wide\">
        <div className=\"flex h-16 items-center justify-between\">
          <Link href=\"/\" className=\"flex items-center gap-2\">
            <div className=\"w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center\">
              <svg className=\"w-5 h-5 text-white\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z\" />
              </svg>
            </div>
            <span className=\"text-xl font-bold text-gray-900 dark:text-white\">
              {tMeta('siteName')}
            </span>
          </Link>

          <nav className=\"hidden md:flex items-center gap-8\">
            <Link href=\"/forms\" className=\"text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary\">
              {t('forms')}
            </Link>
            <Link href=\"/situations\" className=\"text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary\">
              {t('situations')}
            </Link>
            <Link href=\"/identity\" className=\"text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary\">
              {t('identity')}
            </Link>
          </nav>

          <div className=\"flex items-center gap-4\">
            <button className=\"p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800\">
              <svg className=\"w-5 h-5 text-gray-600 dark:text-gray-400\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z\" />
              </svg>
            </button>
            <button className=\"md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800\">
              <svg className=\"w-6 h-6 text-gray-600 dark:text-gray-400\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M4 6h16M4 12h16M4 18h16\" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className=\"border-t bg-gray-50 dark:bg-gray-900\">
      <div className=\"container-wide py-12\">
        <div className=\"grid grid-cols-1 md:grid-cols-4 gap-8\">
          <div className=\"md:col-span-2\">
            <div className=\"flex items-center gap-2 mb-4\">
              <div className=\"w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center\">
                <svg className=\"w-5 h-5 text-white\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                  <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z\" />
                </svg>
              </div>
              <span className=\"text-xl font-bold text-gray-900 dark:text-white\">WhichForms</span>
            </div>
            <p className=\"text-gray-600 dark:text-gray-400 mb-4\">{t('tagline')}</p>
            <p className=\"text-sm text-gray-500 dark:text-gray-500\">
              © {new Date().getFullYear()} Sovereign Ridge Partners LLC. All rights reserved.
            </p>
          </div>

          <div>
            <h3 className=\"font-semibold text-gray-900 dark:text-white mb-4\">Browse</h3>
            <ul className=\"space-y-2\">
              <li><Link href=\"/forms\" className=\"text-gray-600 dark:text-gray-400 hover:text-primary\">Forms</Link></li>
              <li><Link href=\"/situations\" className=\"text-gray-600 dark:text-gray-400 hover:text-primary\">Situations</Link></li>
              <li><Link href=\"/identity\" className=\"text-gray-600 dark:text-gray-400 hover:text-primary\">Identity</Link></li>
            </ul>
          </div>

          <div>
            <h3 className=\"font-semibold text-gray-900 dark:text-white mb-4\">Legal</h3>
            <ul className=\"space-y-2\">
              <li><Link href=\"/privacy\" className=\"text-gray-600 dark:text-gray-400 hover:text-primary\">{t('privacy')}</Link></li>
              <li><Link href=\"/terms\" className=\"text-gray-600 dark:text-gray-400 hover:text-primary\">{t('terms')}</Link></li>
              <li><Link href=\"/affiliate-disclosure\" className=\"text-gray-600 dark:text-gray-400 hover:text-primary\">{t('affiliate')}</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className=\"min-h-screen flex items-center justify-center bg-white dark:bg-gray-900\">
      <div className=\"text-center px-4\">
        <div className=\"text-8xl font-bold text-gray-200 dark:text-gray-700 mb-4\">404</div>
        <h1 className=\"text-3xl font-bold text-gray-900 dark:text-white mb-4\">
          Page Not Found
        </h1>
        <p className=\"text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto\">
          Sorry, we couldn't find the form or page you're looking for. Try searching or browse our categories.
        </p>
        <div className=\"flex flex-wrap gap-4 justify-center\">
          <Link
            href=\"/\"
            className=\"px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors\"
          >
            Go Home
          </Link>
          <Link
            href=\"/forms\"
            className=\"px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg transition-colors\"
          >
            Browse Forms
          </Link>
        </div>
      </div>
    </div>
  );
}
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'State Forms — DMV, Secretary of State | WhichForms',
  description: 'Find state-specific government forms for all 50 states. DMV, Secretary of State, and more.',
};

const states = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

export default function StateHubPage() {
  return (
    <div className=\"bg-white dark:bg-gray-900 min-h-screen\">
      {/* Header */}
      <div className=\"bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-16\">
        <div className=\"max-w-4xl mx-auto px-4 text-center\">
          <h1 className=\"text-4xl font-bold text-gray-900 dark:text-white mb-4\">
            State Forms
          </h1>
          <p className=\"text-xl text-gray-600 dark:text-gray-400 mb-8\">
            Find state-specific government forms for all 50 states.
          </p>
          
          {/* State Categories */}
          <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-2xl mx-auto\">
            <Link
              href=\"/state/CA\"
              className=\"p-4 bg-white dark:bg-gray-800 rounded-lg border hover:border-blue-300 dark:hover:border-blue-600 transition-colors\"
            >
              <div className=\"text-2xl mb-2\">🏛️</div>
              <div className=\"font-medium text-gray-900 dark:text-white\">California</div>
              <div className=\"text-sm text-gray-500\">DMV, SOS</div>
            </Link>
            <Link
              href=\"/state/TX\"
              className=\"p-4 bg-white dark:bg-gray-800 rounded-lg border hover:border-blue-300 dark:hover:border-blue-600 transition-colors\"
            >
              <div className=\"text-2xl mb-2\">🌵</div>
              <div className=\"font-medium text-gray-900 dark:text-white\">Texas</div>
              <div className=\"text-sm text-gray-500\">DMV, SOS</div>
            </Link>
            <Link
              href=\"/state/NY\"
              className=\"p-4 bg-white dark:bg-gray-800 rounded-lg border hover:border-blue-300 dark:hover:border-blue-600 transition-colors\"
            >
              <div className=\"text-2xl mb-2\">🗽</div>
              <div className=\"font-medium text-gray-900 dark:text-white\">New York</div>
              <div className=\"text-sm text-gray-500\">DMV, SOS</div>
            </Link>
            <Link
              href=\"/state/FL\"
              className=\"p-4 bg-white dark:bg-gray-800 rounded-lg border hover:border-blue-300 dark:hover:border-blue-600 transition-colors\"
            >
              <div className=\"text-2xl mb-2\">🌴</div>
              <div className=\"font-medium text-gray-900 dark:text-white\">Florida</div>
              <div className=\"text-sm text-gray-500\">DMV, SOS</div>
            </Link>
          </div>
        </div>
      </div>

      {/* All States */}
      <div className=\"max-w-4xl mx-auto px-4 py-12\">
        <h2 className=\"text-2xl font-bold text-gray-900 dark:text-white mb-6\">
          All States
        </h2>
        <div className=\"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3\">
          {states.map((state) => (
            <Link
              key={state.code}
              href={`/state/${state.code}`}
              className=\"flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg border hover:border-blue-300 dark:hover:border-blue-600 transition-colors\"
            >
              <span className=\"text-lg\">{state.code}</span>
              <span className=\"text-sm text-gray-700 dark:text-gray-300 truncate\">{state.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
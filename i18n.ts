import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'es', 'ru', 'zh', 'pt'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
  timeZone: 'America/New_York',
}));
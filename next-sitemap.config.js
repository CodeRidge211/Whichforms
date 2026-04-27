/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://whichforms.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  exclude: ['/api/*', '/admin/*'],
  changefreq: 'weekly',
  priority: 0.7,
  sitemapBaseFileName: 'sitemap',
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: 'weekly',
      priority: path === '/' ? 1.0 : path.includes('/form/') || path.includes('/situation/') ? 0.9 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
const fs = require('fs');
const path = require('path');

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://floralwhispers.co.ke';

const staticPages = [
  '',
  '/collections',
  '/collections/flowers',
  '/collections/teddy-bears',
  '/collections/gift-hampers',
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap);

console.log('Sitemap generated at', sitemapPath);


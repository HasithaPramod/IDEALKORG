import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🗺️ Generating advanced sitemaps...');

try {
  const baseUrl = 'https://idealk.org';
  const currentDate = new Date().toISOString();

  // Generate main sitemap with advanced features
  const staticPages = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.8 },
    { url: '/projects', changefreq: 'weekly', priority: 0.9 },
    { url: '/news', changefreq: 'daily', priority: 0.9 },
    { url: '/downloads', changefreq: 'weekly', priority: 0.7 },
    { url: '/contact', changefreq: 'monthly', priority: 0.6 }
  ];

  // Main sitemap with images
  const mainSitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${page.url === '/' ? `    <image:image>
      <image:loc>${baseUrl}/assets/hero-community.jpg</image:loc>
      <image:caption>IDEA Community Development</image:caption>
      <image:title>Integrated Development Association</image:title>
    </image:image>
    <image:image>
      <image:loc>${baseUrl}/assets/logo/logo.png</image:loc>
      <image:caption>IDEA Logo</image:caption>
      <image:title>IDEA Logo</image:title>
    </image:image>` : ''}
  </url>`).join('\n')}
</urlset>`;

  // News sitemap
  const newsSitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>${baseUrl}/news</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <news:news>
      <news:publication>
        <news:name>IDEA News</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${currentDate}</news:publication_date>
      <news:title>Latest News from IDEA</news:title>
      <news:keywords>IDEA, Sri Lanka, development, NGO, sustainable development</news:keywords>
    </news:news>
  </url>
</urlset>`;

  // Projects sitemap
  const projectsSitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}/projects</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${baseUrl}/assets/project-garden.jpg</image:loc>
      <image:caption>IDEA Garden Project</image:caption>
      <image:title>Garden Project</image:title>
    </image:image>
    <image:image>
      <image:loc>${baseUrl}/assets/project-renewable.jpg</image:loc>
      <image:caption>IDEA Renewable Energy Project</image:caption>
      <image:title>Renewable Energy Project</image:title>
    </image:image>
  </url>
</urlset>`;

  // Images sitemap
  const imagesSitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${baseUrl}/assets/hero-community.jpg</image:loc>
      <image:caption>IDEA Community Development</image:caption>
      <image:title>Integrated Development Association</image:title>
    </image:image>
    <image:image>
      <image:loc>${baseUrl}/assets/logo/logo.png</image:loc>
      <image:caption>IDEA Logo</image:caption>
      <image:title>IDEA Logo</image:title>
    </image:image>
    <image:image>
      <image:loc>${baseUrl}/assets/team-photo.jpg</image:loc>
      <image:caption>IDEA Team</image:caption>
      <image:title>IDEA Team Photo</image:title>
    </image:image>
    <image:image>
      <image:loc>${baseUrl}/assets/project-garden.jpg</image:loc>
      <image:caption>IDEA Garden Project</image:caption>
      <image:title>Garden Project</image:title>
    </image:image>
    <image:image>
      <image:loc>${baseUrl}/assets/project-renewable.jpg</image:loc>
      <image:caption>IDEA Renewable Energy Project</image:caption>
      <image:title>Renewable Energy Project</image:title>
    </image:image>
  </url>
</urlset>`;

  // Sitemap index
  const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-news.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-projects.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-images.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

  // Advanced robots.txt
  const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-news.xml
Sitemap: ${baseUrl}/sitemap-projects.xml
Sitemap: ${baseUrl}/sitemap-images.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /login
Disallow: /api/
Disallow: /_next/
Disallow: /static/

# Allow important pages
Allow: /
Allow: /news/
Allow: /projects/
Allow: /downloads/
Allow: /about/
Allow: /contact/

# Allow assets
Allow: /assets/
Allow: /images/
Allow: /css/
Allow: /js/

# Crawl delay (optional)
Crawl-delay: 1

# Host
Host: ${baseUrl}

# Additional rules for specific bots
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: YandexBot
Allow: /

# Block bad bots
User-agent: MJ12bot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /`;

  // Write all sitemap files
  const distPath = path.join(__dirname, '..', 'dist');
  
  fs.writeFileSync(path.join(distPath, 'sitemap-news.xml'), newsSitemapXML);
  fs.writeFileSync(path.join(distPath, 'sitemap-projects.xml'), projectsSitemapXML);
  fs.writeFileSync(path.join(distPath, 'sitemap-images.xml'), imagesSitemapXML);
  fs.writeFileSync(path.join(distPath, 'sitemap-index.xml'), sitemapIndexXML);
  fs.writeFileSync(path.join(distPath, 'robots.txt'), robotsTxt);

  console.log('✅ Advanced sitemaps generated successfully!');
  console.log('📄 Generated files:');
  console.log('  • sitemap-news.xml');
  console.log('  • sitemap-projects.xml');
  console.log('  • sitemap-images.xml');
  console.log('  • sitemap-index.xml');
  console.log('  • robots.txt (advanced)');

} catch (error) {
  console.error('❌ Error generating advanced sitemaps:', error);
  process.exit(1);
} 
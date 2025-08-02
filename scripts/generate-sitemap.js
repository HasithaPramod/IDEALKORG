import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🗺️ Generating sitemap...');

try {
  // Generate a comprehensive sitemap for the IDEALK website
  const baseUrl = 'https://idealk.org';
  const currentDate = new Date().toISOString();
  
  // Define static pages with their priorities and change frequencies
  const staticPages = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.8 },
    { url: '/projects', changefreq: 'weekly', priority: 0.9 },
    { url: '/news', changefreq: 'daily', priority: 0.9 },
    { url: '/downloads', changefreq: 'weekly', priority: 0.7 },
    { url: '/contact', changefreq: 'monthly', priority: 0.6 },
    { url: '/admin', changefreq: 'monthly', priority: 0.3 },
    { url: '/login', changefreq: 'monthly', priority: 0.3 }
  ];

  // Generate the main sitemap XML
  const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write the sitemap to the dist directory
  const sitemapPath = path.join(__dirname, '..', 'dist', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXML);
  console.log('✅ Main sitemap generated:', sitemapPath);

  // Also create a robots.txt file if it doesn't exist
  const robotsPath = path.join(__dirname, '..', 'dist', 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    const robotsContent = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /login

# Crawl delay (optional)
Crawl-delay: 1`;
    
    fs.writeFileSync(robotsPath, robotsContent);
    console.log('✅ Robots.txt generated:', robotsPath);
  }

  console.log('🎉 Sitemap generation completed successfully!');

} catch (error) {
  console.error('❌ Error generating sitemap:', error);
  
  // Fallback: Generate a basic static sitemap
  console.log('🔄 Generating fallback static sitemap...');
  const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://idealk.org/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://idealk.org/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://idealk.org/projects</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://idealk.org/news</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://idealk.org/downloads</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://idealk.org/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

  const fallbackPath = path.join(__dirname, '..', 'dist', 'sitemap.xml');
  fs.writeFileSync(fallbackPath, fallbackSitemap);
  console.log('✅ Fallback sitemap generated:', fallbackPath);
} 
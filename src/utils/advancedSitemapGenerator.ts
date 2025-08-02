import { generateAdvancedSitemapXML } from '@/lib/advanced-seo';
import { firebaseStorage } from '@/lib/firebaseStorage';

// Advanced Sitemap Configuration
interface AdvancedSitemapConfig {
  baseUrl: string;
  includeImages: boolean;
  includeNews: boolean;
  includeProjects: boolean;
  maxUrls: number;
  priority: {
    home: number;
    pages: number;
    news: number;
    projects: number;
    downloads: number;
  };
  changefreq: {
    home: string;
    pages: string;
    news: string;
    projects: string;
    downloads: string;
  };
}

// Default configuration
const DEFAULT_CONFIG: AdvancedSitemapConfig = {
  baseUrl: 'https://idealk.org',
  includeImages: true,
  includeNews: true,
  includeProjects: true,
  maxUrls: 1000,
  priority: {
    home: 1.0,
    pages: 0.8,
    news: 0.9,
    projects: 0.9,
    downloads: 0.7
  },
  changefreq: {
    home: 'daily',
    pages: 'monthly',
    news: 'daily',
    projects: 'weekly',
    downloads: 'weekly'
  }
};

// Static pages configuration
const STATIC_PAGES = [
  { url: '/', name: 'Home' },
  { url: '/about', name: 'About' },
  { url: '/projects', name: 'Projects' },
  { url: '/news', name: 'News' },
  { url: '/downloads', name: 'Downloads' },
  { url: '/contact', name: 'Contact' }
];

// Generate advanced sitemap
export const generateAdvancedSitemap = async (config: Partial<AdvancedSitemapConfig> = {}): Promise<string> => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const urls: Array<{
    url: string;
    lastmod?: string;
    changefreq?: string;
    priority?: number;
    images?: Array<{ url: string; caption?: string; title?: string }>;
    news?: { title: string; publication_date: string; keywords?: string };
  }> = [];

  // Add static pages
  STATIC_PAGES.forEach(page => {
    const isHome = page.url === '/';
    urls.push({
      url: `${finalConfig.baseUrl}${page.url}`,
      lastmod: new Date().toISOString(),
      changefreq: isHome ? finalConfig.changefreq.home : finalConfig.changefreq.pages,
      priority: isHome ? finalConfig.priority.home : finalConfig.priority.pages,
      images: isHome ? [
        {
          url: `${finalConfig.baseUrl}/assets/hero-community.jpg`,
          caption: 'IDEA Community Development',
          title: 'Integrated Development Association'
        },
        {
          url: `${finalConfig.baseUrl}/assets/logo/logo.png`,
          caption: 'IDEA Logo',
          title: 'IDEA Logo'
        }
      ] : undefined
    });
  });

  // Add news articles if enabled
  if (finalConfig.includeNews) {
    try {
      const news = await firebaseStorage.getAllNews();
      news.slice(0, 100).forEach(article => {
        urls.push({
          url: `${finalConfig.baseUrl}/news/${article.slug || article.title.toLowerCase().replace(/\s+/g, '-')}`,
          lastmod: article.date || new Date().toISOString(),
          changefreq: finalConfig.changefreq.news,
          priority: finalConfig.priority.news,
          images: article.images ? article.images.map(img => ({
            url: img,
            caption: article.title,
            title: article.title
          })) : undefined,
          news: {
            title: article.title,
            publication_date: article.date || new Date().toISOString(),
            keywords: `${article.category}, IDEA, Sri Lanka, development`
          }
        });
      });
    } catch (error) {
      console.warn('Failed to fetch news for sitemap:', error);
    }
  }

  // Add projects if enabled
  if (finalConfig.includeProjects) {
    try {
      const projects = await firebaseStorage.getAllProjects();
      projects.slice(0, 100).forEach(project => {
        urls.push({
          url: `${finalConfig.baseUrl}/projects/${project.slug || project.title.toLowerCase().replace(/\s+/g, '-')}`,
          lastmod: project.updatedAt || new Date().toISOString(),
          changefreq: finalConfig.changefreq.projects,
          priority: finalConfig.priority.projects,
          images: project.images ? project.images.map(img => ({
            url: img,
            caption: project.title,
            title: project.title
          })) : undefined
        });
      });
    } catch (error) {
      console.warn('Failed to fetch projects for sitemap:', error);
    }
  }

  // Limit URLs if needed
  const limitedUrls = urls.slice(0, finalConfig.maxUrls);

  // Generate XML
  return generateAdvancedSitemapXML(limitedUrls);
};

// Generate sitemap index
export const generateSitemapIndex = (sitemaps: Array<{ url: string; lastmod?: string }>): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `  <sitemap>
    <loc>${sitemap.url}</loc>
    ${sitemap.lastmod ? `    <lastmod>${sitemap.lastmod}</lastmod>` : ''}
  </sitemap>`).join('\n')}
</sitemapindex>`;
};

// Generate specialized sitemaps
export const generateNewsSitemap = async (baseUrl: string = 'https://idealk.org'): Promise<string> => {
  try {
    const news = await firebaseStorage.getAllNews();
    const urls = news.map(article => ({
      url: `${baseUrl}/news/${article.slug || article.title.toLowerCase().replace(/\s+/g, '-')}`,
      lastmod: article.date || new Date().toISOString(),
      changefreq: 'daily' as const,
      priority: 0.9,
      news: {
        title: article.title,
        publication_date: article.date || new Date().toISOString(),
        keywords: `${article.category}, IDEA, Sri Lanka, development`
      }
    }));

    return generateAdvancedSitemapXML(urls);
  } catch (error) {
    console.error('Failed to generate news sitemap:', error);
    return generateAdvancedSitemapXML([]);
  }
};

export const generateProjectsSitemap = async (baseUrl: string = 'https://idealk.org'): Promise<string> => {
  try {
    const projects = await firebaseStorage.getAllProjects();
    const urls = projects.map(project => ({
      url: `${baseUrl}/projects/${project.slug || project.title.toLowerCase().replace(/\s+/g, '-')}`,
      lastmod: project.updatedAt || new Date().toISOString(),
      changefreq: 'weekly' as const,
      priority: 0.9,
      images: project.images ? project.images.map(img => ({
        url: img,
        caption: project.title,
        title: project.title
      })) : undefined
    }));

    return generateAdvancedSitemapXML(urls);
  } catch (error) {
    console.error('Failed to generate projects sitemap:', error);
    return generateAdvancedSitemapXML([]);
  }
};

export const generateImagesSitemap = async (baseUrl: string = 'https://idealk.org'): Promise<string> => {
  const urls: Array<{
    url: string;
    lastmod?: string;
    changefreq?: string;
    priority?: number;
    images?: Array<{ url: string; caption?: string; title?: string }>;
  }> = [];

  // Add static images
  const staticImages = [
    {
      url: `${baseUrl}/assets/hero-community.jpg`,
      caption: 'IDEA Community Development',
      title: 'Integrated Development Association'
    },
    {
      url: `${baseUrl}/assets/logo/logo.png`,
      caption: 'IDEA Logo',
      title: 'IDEA Logo'
    },
    {
      url: `${baseUrl}/assets/team-photo.jpg`,
      caption: 'IDEA Team',
      title: 'IDEA Team Photo'
    },
    {
      url: `${baseUrl}/assets/project-garden.jpg`,
      caption: 'IDEA Garden Project',
      title: 'Garden Project'
    },
    {
      url: `${baseUrl}/assets/project-renewable.jpg`,
      caption: 'IDEA Renewable Energy Project',
      title: 'Renewable Energy Project'
    }
  ];

  urls.push({
    url: baseUrl,
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: 1.0,
    images: staticImages
  });

  // Add project images
  try {
    const projects = await firebaseStorage.getAllProjects();
    projects.forEach(project => {
      if (project.images && project.images.length > 0) {
        urls.push({
          url: `${baseUrl}/projects/${project.slug || project.title.toLowerCase().replace(/\s+/g, '-')}`,
          lastmod: project.updatedAt || new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.8,
          images: project.images.map(img => ({
            url: img,
            caption: project.title,
            title: project.title
          }))
        });
      }
    });
  } catch (error) {
    console.warn('Failed to fetch project images for sitemap:', error);
  }

  return generateAdvancedSitemapXML(urls);
};

// Generate robots.txt with advanced features
export const generateAdvancedRobotsTxt = (baseUrl: string = 'https://idealk.org'): string => {
  return `User-agent: *
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
};

// Generate sitemap with all features
export const generateCompleteSitemap = async (baseUrl: string = 'https://idealk.org'): Promise<{
  main: string;
  news: string;
  projects: string;
  images: string;
  index: string;
  robots: string;
}> => {
  const [main, news, projects, images] = await Promise.all([
    generateAdvancedSitemap({ baseUrl }),
    generateNewsSitemap(baseUrl),
    generateProjectsSitemap(baseUrl),
    generateImagesSitemap(baseUrl)
  ]);

  const index = generateSitemapIndex([
    { url: `${baseUrl}/sitemap.xml`, lastmod: new Date().toISOString() },
    { url: `${baseUrl}/sitemap-news.xml`, lastmod: new Date().toISOString() },
    { url: `${baseUrl}/sitemap-projects.xml`, lastmod: new Date().toISOString() },
    { url: `${baseUrl}/sitemap-images.xml`, lastmod: new Date().toISOString() }
  ]);

  const robots = generateAdvancedRobotsTxt(baseUrl);

  return {
    main,
    news,
    projects,
    images,
    index,
    robots
  };
};

// Export all functions
export {
  generateAdvancedSitemap,
  generateSitemapIndex,
  generateNewsSitemap,
  generateProjectsSitemap,
  generateImagesSitemap,
  generateAdvancedRobotsTxt,
  generateCompleteSitemap
}; 
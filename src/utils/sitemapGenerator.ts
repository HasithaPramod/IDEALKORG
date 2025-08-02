import { firebaseStorage } from '@/lib/firebaseStorage';
import { generateSitemapXML } from '@/lib/seo';

export interface SitemapURL {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export class SitemapGenerator {
  private baseUrl: string;
  private urls: SitemapURL[] = [];

  constructor(baseUrl: string = 'https://idealk.org') {
    this.baseUrl = baseUrl;
    this.initializeStaticPages();
  }

  private initializeStaticPages() {
    // Static pages with high priority
    this.urls = [
      {
        url: this.baseUrl,
        changefreq: 'daily',
        priority: 1.0
      },
      {
        url: `${this.baseUrl}/about`,
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        url: `${this.baseUrl}/projects`,
        changefreq: 'weekly',
        priority: 0.9
      },
      {
        url: `${this.baseUrl}/news`,
        changefreq: 'daily',
        priority: 0.9
      },
      {
        url: `${this.baseUrl}/downloads`,
        changefreq: 'weekly',
        priority: 0.7
      },
      {
        url: `${this.baseUrl}/contact`,
        changefreq: 'monthly',
        priority: 0.6
      }
    ];
  }

  async addNewsArticles() {
    try {
      const allNews = await firebaseStorage.getAllNews();
      
      allNews.forEach(article => {
        const slug = article.title.toLowerCase().replace(/\s+/g, '-');
        this.urls.push({
          url: `${this.baseUrl}/news/${slug}`,
          lastmod: article.date,
          changefreq: 'weekly',
          priority: 0.8
        });
      });
    } catch (error) {
      console.error('Error fetching news articles for sitemap:', error);
    }
  }

  async addProjects() {
    try {
      const allProjects = await firebaseStorage.getAllProjects();
      
      allProjects.forEach(project => {
        const slug = project.title.toLowerCase().replace(/\s+/g, '-');
        this.urls.push({
          url: `${this.baseUrl}/projects/${slug}`,
          lastmod: project.updatedAt || project.createdAt,
          changefreq: 'monthly',
          priority: 0.7
        });
      });
    } catch (error) {
      console.error('Error fetching projects for sitemap:', error);
    }
  }

  async addDownloads() {
    try {
      // Fetch downloads from the API
      const response = await fetch(`${this.baseUrl}/downloads/upload.php`);
      const data = await response.json();
      
      if (data.success && data.files) {
        data.files.forEach((file: any) => {
          this.urls.push({
            url: `${this.baseUrl}/downloads/${file.id}`,
            lastmod: file.uploadedAt,
            changefreq: 'monthly',
            priority: 0.5
          });
        });
      }
    } catch (error) {
      console.error('Error fetching downloads for sitemap:', error);
    }
  }

  async generateFullSitemap(): Promise<string> {
    await this.addNewsArticles();
    await this.addProjects();
    await this.addDownloads();
    
    return generateSitemapXML(this.urls);
  }

  generateStaticSitemap(): string {
    return generateSitemapXML(this.urls);
  }

  getURLs(): SitemapURL[] {
    return this.urls;
  }

  addURL(url: SitemapURL) {
    this.urls.push(url);
  }

  addURLs(urls: SitemapURL[]) {
    this.urls.push(...urls);
  }

  // Generate sitemap index for large sites
  generateSitemapIndex(sitemaps: Array<{ url: string; lastmod?: string }>): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `  <sitemap>
    <loc>${sitemap.url}</loc>
    ${sitemap.lastmod ? `    <lastmod>${sitemap.lastmod}</lastmod>` : ''}
  </sitemap>`).join('\n')}
</sitemapindex>`;
  }

  // Generate news sitemap specifically for Google News
  async generateNewsSitemap(): Promise<string> {
    try {
      const allNews = await firebaseStorage.getAllNews();
      const newsUrls = allNews.slice(0, 1000).map(article => ({
        url: `${this.baseUrl}/news/${article.title.toLowerCase().replace(/\s+/g, '-')}`,
        lastmod: article.date,
        changefreq: 'daily' as const,
        priority: 0.9
      }));

      return generateSitemapXML(newsUrls);
    } catch (error) {
      console.error('Error generating news sitemap:', error);
      return '';
    }
  }

  // Generate image sitemap
  async generateImageSitemap(): Promise<string> {
    try {
      const allNews = await firebaseStorage.getAllNews();
      const allProjects = await firebaseStorage.getAllProjects();
      
      const imageUrls: Array<{
        url: string;
        lastmod?: string;
        changefreq?: string;
        priority?: number;
        images?: Array<{ loc: string; title?: string; caption?: string }>;
      }> = [];

      // Add news images
      allNews.forEach(article => {
        if (article.images && article.images.length > 0) {
          const slug = article.title.toLowerCase().replace(/\s+/g, '-');
          imageUrls.push({
            url: `${this.baseUrl}/news/${slug}`,
            lastmod: article.date,
            changefreq: 'weekly',
            priority: 0.8,
            images: article.images.map(image => ({
              loc: image,
              title: article.title,
              caption: article.excerpt || article.title
            }))
          });
        }
      });

      // Add project images
      allProjects.forEach(project => {
        if (project.images && project.images.length > 0) {
          const slug = project.title.toLowerCase().replace(/\s+/g, '-');
          imageUrls.push({
            url: `${this.baseUrl}/projects/${slug}`,
            lastmod: project.updatedAt || project.createdAt,
            changefreq: 'monthly',
            priority: 0.7,
            images: project.images.map(image => ({
              loc: image,
              title: project.title,
              caption: project.description
            }))
          });
        }
      });

      // Generate image sitemap XML
      return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageUrls.map(({ url, lastmod, changefreq, priority, images }) => `  <url>
    <loc>${url}</loc>
    ${lastmod ? `    <lastmod>${lastmod}</lastmod>` : ''}
    ${changefreq ? `    <changefreq>${changefreq}</changefreq>` : ''}
    ${priority ? `    <priority>${priority}</priority>` : ''}
    ${images?.map(image => `    <image:image>
      <image:loc>${image.loc}</image:loc>
      ${image.title ? `      <image:title>${image.title}</image:title>` : ''}
      ${image.caption ? `      <image:caption>${image.caption}</image:caption>` : ''}
    </image:image>`).join('\n') || ''}
  </url>`).join('\n')}
</urlset>`;

    } catch (error) {
      console.error('Error generating image sitemap:', error);
      return '';
    }
  }
}

// Utility function to generate sitemap on demand
export const generateSitemap = async (baseUrl: string = 'https://idealk.org'): Promise<string> => {
  const generator = new SitemapGenerator(baseUrl);
  return await generator.generateFullSitemap();
};

// Utility function to generate news sitemap
export const generateNewsSitemap = async (baseUrl: string = 'https://idealk.org'): Promise<string> => {
  const generator = new SitemapGenerator(baseUrl);
  return await generator.generateNewsSitemap();
};

// Utility function to generate image sitemap
export const generateImageSitemap = async (baseUrl: string = 'https://idealk.org'): Promise<string> => {
  const generator = new SitemapGenerator(baseUrl);
  return await generator.generateImageSitemap();
}; 
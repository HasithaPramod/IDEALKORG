// SEO Configuration and Utilities
export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'organization';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

// Default SEO configuration
export const DEFAULT_SEO: SEOConfig = {
  title: 'Integrated Development Association (IDEA) - Sustainable Development in Sri Lanka',
  description: 'IDEA is a leading non-governmental organization in Sri Lanka, contributing to sustainable development since 1990. We focus on community development, environmental conservation, and social empowerment.',
  keywords: 'IDEA, Integrated Development Association, Sri Lanka, sustainable development, NGO, community development, environmental conservation, social empowerment',
  image: '/og-image.jpg',
  url: 'https://idealk.org',
  type: 'organization',
  canonical: 'https://idealk.org'
};

// Organization structured data
export const ORGANIZATION_STRUCTURED_DATA: StructuredData = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: 'Integrated Development Association (IDEA)',
  alternateName: 'IDEA',
  description: 'A leading non-governmental organization in Sri Lanka, contributing to sustainable development since 1990.',
  url: 'https://idealk.org',
  logo: 'https://idealk.org/logo.png',
  foundingDate: '1990',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'LK',
    addressLocality: 'Colombo',
    addressRegion: 'Western Province'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'info@idealk.org'
  },
  sameAs: [
    'https://www.facebook.com/idealk',
    'https://twitter.com/idealk',
    'https://www.linkedin.com/company/idealk'
  ],
  areaServed: {
    '@type': 'Country',
    name: 'Sri Lanka'
  },
  serviceArea: {
    '@type': 'Country',
    name: 'Sri Lanka'
  }
};

// Website structured data
export const WEBSITE_STRUCTURED_DATA: StructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Integrated Development Association (IDEA)',
  url: 'https://idealk.org',
  description: 'Official website of IDEA - Integrated Development Association, a leading NGO in Sri Lanka.',
  publisher: {
    '@type': 'Organization',
    name: 'Integrated Development Association (IDEA)',
    logo: {
      '@type': 'ImageObject',
      url: 'https://idealk.org/logo.png'
    }
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://idealk.org/search?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  }
};

// Generate article structured data
export const generateArticleStructuredData = (article: {
  title: string;
  description: string;
  content: string;
  image?: string;
  url: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  category: string;
}): StructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image || DEFAULT_SEO.image,
    url: article.url,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    author: {
      '@type': 'Person',
      name: article.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'Integrated Development Association (IDEA)',
      logo: {
        '@type': 'ImageObject',
        url: 'https://idealk.org/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url
    },
    articleSection: article.category,
    keywords: `${article.category}, IDEA, Sri Lanka, development`
  };
};

// Generate project structured data
export const generateProjectStructuredData = (project: {
  title: string;
  description: string;
  image?: string;
  url: string;
  location: string;
  startDate?: string;
  endDate?: string;
  status: string;
  beneficiaries: string;
}): StructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Project',
    name: project.title,
    description: project.description,
    image: project.image || DEFAULT_SEO.image,
    url: project.url,
    location: {
      '@type': 'Place',
      name: project.location
    },
    startDate: project.startDate,
    endDate: project.endDate,
    status: project.status,
    funder: {
      '@type': 'Organization',
      name: 'Integrated Development Association (IDEA)'
    },
    contributor: {
      '@type': 'Organization',
      name: 'Integrated Development Association (IDEA)'
    },
    audience: {
      '@type': 'Audience',
      name: project.beneficiaries
    }
  };
};

// Generate breadcrumb structured data
export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{ name: string; url: string }>): StructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  };
};

// SEO utility functions
export const generateMetaTags = (config: SEOConfig): Record<string, string> => {
  const tags: Record<string, string> = {
    title: config.title,
    description: config.description,
    'og:title': config.title,
    'og:description': config.description,
    'og:type': config.type || 'website',
    'og:url': config.url || DEFAULT_SEO.url,
    'twitter:card': 'summary_large_image',
    'twitter:title': config.title,
    'twitter:description': config.description,
  };

  if (config.image) {
    tags['og:image'] = config.image;
    tags['twitter:image'] = config.image;
  }

  if (config.keywords) {
    tags.keywords = config.keywords;
  }

  if (config.canonical) {
    tags['link[rel="canonical"]'] = config.canonical;
  }

  if (config.noindex) {
    tags['robots'] = 'noindex';
  }

  if (config.nofollow) {
    tags['robots'] = tags['robots'] ? `${tags['robots']}, nofollow` : 'nofollow';
  }

  // Article-specific meta tags
  if (config.type === 'article') {
    if (config.publishedTime) {
      tags['article:published_time'] = config.publishedTime;
      tags['og:article:published_time'] = config.publishedTime;
    }
    if (config.modifiedTime) {
      tags['article:modified_time'] = config.modifiedTime;
      tags['og:article:modified_time'] = config.modifiedTime;
    }
    if (config.author) {
      tags['article:author'] = config.author;
      tags['og:article:author'] = config.author;
    }
    if (config.section) {
      tags['article:section'] = config.section;
      tags['og:article:section'] = config.section;
    }
    if (config.tags) {
      tags['article:tag'] = config.tags.join(', ');
      tags['og:article:tag'] = config.tags.join(', ');
    }
  }

  return tags;
};

// Generate sitemap XML
export const generateSitemapXML = (urls: Array<{ url: string; lastmod?: string; changefreq?: string; priority?: number }>): string => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, lastmod, changefreq, priority }) => `  <url>
    <loc>${url}</loc>
    ${lastmod ? `    <lastmod>${lastmod}</lastmod>` : ''}
    ${changefreq ? `    <changefreq>${changefreq}</changefreq>` : ''}
    ${priority ? `    <priority>${priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

// Generate robots.txt content
export const generateRobotsTxt = (baseUrl: string): string => {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /login
Disallow: /api/

# Allow important pages
Allow: /
Allow: /news/
Allow: /projects/
Allow: /downloads/
Allow: /about/
Allow: /contact/

# Crawl delay (optional)
Crawl-delay: 1`;
};

// SEO optimization utilities
export const optimizeTitle = (title: string, maxLength: number = 60): string => {
  if (title.length <= maxLength) return title;
  
  // Try to cut at word boundary
  const words = title.split(' ');
  let optimized = '';
  
  for (const word of words) {
    if ((optimized + ' ' + word).length <= maxLength) {
      optimized += (optimized ? ' ' : '') + word;
    } else {
      break;
    }
  }
  
  return optimized || title.substring(0, maxLength - 3) + '...';
};

export const optimizeDescription = (description: string, maxLength: number = 160): string => {
  if (description.length <= maxLength) return description;
  
  // Try to cut at sentence boundary
  const sentences = description.split(/[.!?]/);
  let optimized = '';
  
  for (const sentence of sentences) {
    if ((optimized + sentence + '.').length <= maxLength) {
      optimized += sentence + '.';
    } else {
      break;
    }
  }
  
  return optimized || description.substring(0, maxLength - 3) + '...';
};

export const generateKeywords = (text: string, maxKeywords: number = 10): string => {
  // Simple keyword extraction (in production, use a proper NLP library)
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  const wordCount: Record<string, number> = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word)
    .join(', ');
};

// Social media optimization
export const generateSocialMetaTags = (config: SEOConfig): Record<string, string> => {
  const tags: Record<string, string> = {
    'og:site_name': 'Integrated Development Association (IDEA)',
    'og:locale': 'en_US',
    'twitter:site': '@idealk',
    'twitter:creator': '@idealk',
  };

  if (config.image) {
    tags['og:image:width'] = '1200';
    tags['og:image:height'] = '630';
    tags['og:image:alt'] = config.title;
  }

  return tags;
};

// Performance optimization for SEO
export const preloadCriticalResources = (): string[] => {
  return [
    '/fonts/inter-var.woff2',
    '/css/critical.css',
    '/js/critical.js'
  ];
};

// SEO-friendly URL generation
export const generateSEOFriendlyURL = (title: string, id?: string): string => {
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return id ? `${slug}-${id}` : slug;
};

// Schema.org markup helpers
export const generateFAQStructuredData = (faqs: Array<{ question: string; answer: string }>): StructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};

export const generateLocalBusinessStructuredData = (): StructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Integrated Development Association (IDEA)',
    description: 'A leading NGO in Sri Lanka focused on sustainable development',
    url: 'https://idealk.org',
    telephone: '+94-11-1234567',
    email: 'info@idealk.org',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Development Street',
      addressLocality: 'Colombo',
      addressRegion: 'Western Province',
      postalCode: '10000',
      addressCountry: 'LK'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 6.9271,
      longitude: 79.8612
    },
    openingHours: 'Mo-Fr 09:00-17:00',
    sameAs: [
      'https://www.facebook.com/idealk',
      'https://twitter.com/idealk',
      'https://www.linkedin.com/company/idealk'
    ]
  };
}; 
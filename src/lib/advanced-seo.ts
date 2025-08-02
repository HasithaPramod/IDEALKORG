// Advanced SEO Configuration and Utilities
import { SEOConfig, StructuredData } from './seo';

// Advanced SEO Configuration Interface
export interface AdvancedSEOConfig extends SEOConfig {
  // Performance optimization
  preload?: string[];
  prefetch?: string[];
  dnsPrefetch?: string[];
  
  // Advanced meta tags
  language?: string;
  region?: string;
  geoRegion?: string;
  geoPosition?: string;
  geoPlacename?: string;
  
  // Social media advanced
  twitterCreator?: string;
  twitterSite?: string;
  facebookAppId?: string;
  
  // Analytics and tracking
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  facebookPixelId?: string;
  
  // Advanced structured data
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  reviews?: Array<{ author: string; rating: number; review: string; date: string }>;
  
  // Performance metrics
  coreWebVitals?: {
    lcp?: number;
    fid?: number;
    cls?: number;
  };
}

// Advanced Organization Structured Data
export const ADVANCED_ORGANIZATION_STRUCTURED_DATA: StructuredData = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  '@id': 'https://idealk.org/#organization',
  name: 'Integrated Development Association (IDEA)',
  alternateName: 'IDEA',
  description: 'A leading non-governmental organization in Sri Lanka, contributing to sustainable development since 1990. We focus on community development, environmental conservation, and social empowerment.',
  url: 'https://idealk.org',
  logo: {
    '@type': 'ImageObject',
    url: 'https://idealk.org/assets/logo/logo.png',
    width: 400,
    height: 200
  },
  image: {
    '@type': 'ImageObject',
    url: 'https://idealk.org/assets/hero-community.jpg',
    width: 1200,
    height: 630
  },
  foundingDate: '1990-01-01',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '10-1/11, 3rd Lane, Galmaduwawatte Kundasale',
    addressLocality: 'Kandy',
    addressRegion: 'Central Province',
    postalCode: '20000',
    addressCountry: 'LK'
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'info@idea.org.lk',
      telephone: '+94-812-423-396',
      availableLanguage: 'English'
    },
    {
      '@type': 'ContactPoint',
      contactType: 'general',
      email: 'info@idea.org.lk',
      availableLanguage: ['English', 'Sinhala', 'Tamil']
    }
  ],
  sameAs: [
    'https://www.facebook.com/profile.php?id=61578749545222',
    'https://lk.linkedin.com/company/integrated-development-association-idea'
  ],
  areaServed: {
    '@type': 'Country',
    name: 'Sri Lanka'
  },
  serviceArea: {
    '@type': 'Country',
    name: 'Sri Lanka'
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'IDEA Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Community Development',
          description: 'Sustainable community development programs'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Environmental Conservation',
          description: 'Environmental protection and conservation initiatives'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Social Empowerment',
          description: 'Programs to empower communities and individuals'
        }
      }
    ]
  },
  funder: {
    '@type': 'Organization',
    name: 'Various International Donors and Partners'
  },
  employee: {
    '@type': 'Person',
    name: 'IDEA Team',
    jobTitle: 'Development Professionals'
  }
};

// Advanced Website Structured Data
export const ADVANCED_WEBSITE_STRUCTURED_DATA: StructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://idealk.org/#website',
  name: 'Integrated Development Association (IDEA)',
  url: 'https://idealk.org',
  description: 'Official website of IDEA - Integrated Development Association, a leading NGO in Sri Lanka focused on sustainable development.',
  inLanguage: 'en-US',
  publisher: {
    '@type': 'Organization',
    '@id': 'https://idealk.org/#organization',
    name: 'Integrated Development Association (IDEA)',
    logo: {
      '@type': 'ImageObject',
      url: 'https://idealk.org/assets/logo/logo.png'
    }
  },
  potentialAction: [
    {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://idealk.org/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    {
      '@type': 'DonateAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://idealk.org/donate'
      }
    },
    {
      '@type': 'VolunteerAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://idealk.org/volunteer'
      }
    }
  ],
  mainEntity: {
    '@type': 'Organization',
    '@id': 'https://idealk.org/#organization'
  }
};

// Advanced Article Structured Data
export const generateAdvancedArticleStructuredData = (article: {
  title: string;
  description: string;
  content: string;
  image?: string;
  url: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  category: string;
  tags?: string[];
  wordCount?: number;
  readingTime?: number;
}): StructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': article.url + '#article',
    headline: article.title,
    description: article.description,
    image: article.image ? {
      '@type': 'ImageObject',
      url: article.image,
      width: 1200,
      height: 630
    } : undefined,
    url: article.url,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    author: {
      '@type': 'Person',
      name: article.author,
      url: `https://idealk.org/team/${article.author.toLowerCase().replace(/\s+/g, '-')}`
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://idealk.org/#organization',
      name: 'Integrated Development Association (IDEA)',
      logo: {
        '@type': 'ImageObject',
        url: 'https://idealk.org/assets/logo/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url
    },
    articleSection: article.category,
    keywords: article.tags ? article.tags.join(', ') : `${article.category}, IDEA, Sri Lanka, development`,
    wordCount: article.wordCount,
    timeRequired: article.readingTime ? `PT${article.readingTime}M` : undefined,
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://idealk.org/#website'
    }
  };
};

// Advanced Project Structured Data
export const generateAdvancedProjectStructuredData = (project: {
  title: string;
  description: string;
  image?: string;
  url: string;
  location: string;
  startDate?: string;
  endDate?: string;
  status: string;
  beneficiaries: string;
  budget?: string;
  partners?: string[];
  impact?: string;
  category: string;
}): StructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Project',
    '@id': project.url + '#project',
    name: project.title,
    description: project.description,
    image: project.image ? {
      '@type': 'ImageObject',
      url: project.image,
      width: 1200,
      height: 630
    } : undefined,
    url: project.url,
    location: {
      '@type': 'Place',
      name: project.location,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'LK'
      }
    },
    startDate: project.startDate,
    endDate: project.endDate,
    status: project.status,
    funder: {
      '@type': 'Organization',
      '@id': 'https://idealk.org/#organization',
      name: 'Integrated Development Association (IDEA)'
    },
    contributor: project.partners ? project.partners.map(partner => ({
      '@type': 'Organization',
      name: partner
    })) : {
      '@type': 'Organization',
      '@id': 'https://idealk.org/#organization',
      name: 'Integrated Development Association (IDEA)'
    },
    audience: {
      '@type': 'Audience',
      name: project.beneficiaries
    },
    category: project.category,
    budget: project.budget ? {
      '@type': 'MonetaryAmount',
      value: project.budget,
      currency: 'LKR'
    } : undefined,
    result: project.impact ? {
      '@type': 'Text',
      text: project.impact
    } : undefined
  };
};

// Advanced FAQ Structured Data
export const generateAdvancedFAQStructuredData = (faqs: Array<{ 
  question: string; 
  answer: string;
  category?: string;
}>, pageUrl?: string): StructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': pageUrl ? pageUrl + '#faq' : 'https://idealk.org/faq',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      },
      ...(faq.category && { category: faq.category })
    }))
  };
};

// Advanced Local Business Structured Data
export const generateAdvancedLocalBusinessStructuredData = (): StructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://idealk.org/#localbusiness',
    name: 'Integrated Development Association (IDEA)',
    description: 'A leading NGO in Sri Lanka focused on sustainable development, community empowerment, and environmental conservation.',
    url: 'https://idealk.org',
    telephone: '+94-812-423-396',
    email: 'info@idea.org.lk',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '10-1/11, 3rd Lane, Galmaduwawatte Kundasale',
      addressLocality: 'Kandy',
      addressRegion: 'Central Province',
      postalCode: '20000',
      addressCountry: 'LK'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 7.2810998,
      longitude: 80.6776645
    },
    openingHours: 'Mo-Fr 08:00-17:00',
    sameAs: [
      'https://www.facebook.com/profile.php?id=61578749545222',
      'https://lk.linkedin.com/company/integrated-development-association-idea'
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'IDEA Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Community Development',
            description: 'Sustainable community development programs'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Environmental Conservation',
            description: 'Environmental protection and conservation initiatives'
          }
        }
      ]
    }
  };
};

// Performance optimization utilities
export const generatePerformanceMetaTags = (config: AdvancedSEOConfig): Record<string, string> => {
  const tags: Record<string, string> = {};

  // DNS prefetch
  if (config.dnsPrefetch) {
    config.dnsPrefetch.forEach(domain => {
      tags[`dns-prefetch-${domain}`] = domain;
    });
  }

  // Preconnect
  if (config.preload) {
    config.preload.forEach(resource => {
      tags[`preload-${resource}`] = resource;
    });
  }

  return tags;
};

// Advanced social media optimization
export const generateAdvancedSocialMetaTags = (config: AdvancedSEOConfig): Record<string, string> => {
  const tags: Record<string, string> = {
    'og:site_name': 'Integrated Development Association (IDEA)',
    'og:locale': config.language || 'en_US',
    'twitter:site': config.twitterSite || '@idealk',
    'twitter:creator': config.twitterCreator || '@idealk',
    'twitter:card': 'summary_large_image',
  };

  if (config.facebookAppId) {
    tags['fb:app_id'] = config.facebookAppId;
  }

  if (config.geoRegion) {
    tags['geo.region'] = config.geoRegion;
  }

  if (config.geoPosition) {
    tags['geo.position'] = config.geoPosition;
  }

  if (config.geoPlacename) {
    tags['geo.placename'] = config.geoPlacename;
  }

  return tags;
};

// Core Web Vitals optimization
export const generateCoreWebVitalsStructuredData = (metrics: {
  lcp?: number;
  fid?: number;
  cls?: number;
}): StructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://idealk.org/#webpage',
    mainEntity: {
      '@type': 'Organization',
      '@id': 'https://idealk.org/#organization'
    },
    ...(metrics.lcp && { lcp: metrics.lcp }),
    ...(metrics.fid && { fid: metrics.fid }),
    ...(metrics.cls && { cls: metrics.cls })
  };
};

// Advanced sitemap generation
export const generateAdvancedSitemapXML = (urls: Array<{
  url: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
  images?: Array<{ url: string; caption?: string; title?: string }>;
  news?: { title: string; publication_date: string; keywords?: string };
}>): string => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls.map(({ url, lastmod, changefreq, priority, images, news }) => `  <url>
    <loc>${url}</loc>
    ${lastmod ? `    <lastmod>${lastmod}</lastmod>` : ''}
    ${changefreq ? `    <changefreq>${changefreq}</changefreq>` : ''}
    ${priority ? `    <priority>${priority}</priority>` : ''}
    ${images ? images.map(image => `    <image:image>
      <image:loc>${image.url}</image:loc>
      ${image.caption ? `      <image:caption>${image.caption}</image:caption>` : ''}
      ${image.title ? `      <image:title>${image.title}</image:title>` : ''}
    </image:image>`).join('\n') : ''}
    ${news ? `    <news:news>
      <news:publication>
        <news:name>IDEA News</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${news.publication_date}</news:publication_date>
      <news:title>${news.title}</news:title>
      ${news.keywords ? `      <news:keywords>${news.keywords}</news:keywords>` : ''}
    </news:news>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

// SEO-friendly URL generation with advanced features
export const generateAdvancedSEOFriendlyURL = (
  title: string, 
  options: {
    id?: string;
    category?: string;
    date?: string;
    language?: string;
  } = {}
): string => {
  const { id, category, date, language } = options;
  
  let slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  // Add category prefix if provided
  if (category) {
    slug = `${category}/${slug}`;
  }
  
  // Add date prefix if provided
  if (date) {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    slug = `${year}/${month}/${slug}`;
  }
  
  // Add language prefix if provided and not English
  if (language && language !== 'en') {
    slug = `${language}/${slug}`;
  }
  
  // Add ID suffix if provided
  if (id) {
    slug = `${slug}-${id}`;
  }
  
  return slug;
};

// Advanced keyword optimization
export const generateAdvancedKeywords = (
  text: string, 
  options: {
    maxKeywords?: number;
    minLength?: number;
    excludeWords?: string[];
    includeBrand?: boolean;
    language?: string;
  } = {}
): string => {
  const {
    maxKeywords = 15,
    minLength = 3,
    excludeWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'],
    includeBrand = true,
    language = 'en'
  } = options;

  // Clean and tokenize text
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => 
      word.length >= minLength && 
      !excludeWords.includes(word) &&
      !/^\d+$/.test(word)
    );
  
  // Count word frequency
  const wordCount: Record<string, number> = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // Get top keywords
  let keywords = Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
  
  // Add brand keywords if requested
  if (includeBrand) {
    const brandKeywords = ['IDEA', 'Integrated Development Association', 'Sri Lanka', 'NGO', 'sustainable development'];
    keywords = [...new Set([...brandKeywords, ...keywords])];
  }
  
  // Add language-specific keywords
  if (language === 'si') {
    keywords.push('ශ්‍රී ලංකාව', 'සංවර්ධනය', 'ප්‍රජාව');
  } else if (language === 'ta') {
    keywords.push('இலங்கை', 'வளர்ச்சி', 'சமூகம்');
  }
  
  return keywords.slice(0, maxKeywords).join(', ');
};

 
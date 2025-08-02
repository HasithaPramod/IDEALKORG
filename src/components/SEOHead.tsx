import { Helmet } from 'react-helmet-async';
import { 
  SEOConfig, 
  StructuredData, 
  DEFAULT_SEO, 
  ORGANIZATION_STRUCTURED_DATA,
  WEBSITE_STRUCTURED_DATA,
  generateMetaTags,
  generateSocialMetaTags,
  optimizeTitle,
  optimizeDescription
} from '@/lib/seo';

interface SEOHeadProps {
  config: SEOConfig;
  structuredData?: StructuredData[];
  children?: React.ReactNode;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ 
  config, 
  structuredData = [], 
  children 
}) => {
  // Merge with default SEO config
  const seoConfig = { ...DEFAULT_SEO, ...config };
  
  // Optimize title and description
  const optimizedTitle = optimizeTitle(seoConfig.title);
  const optimizedDescription = optimizeDescription(seoConfig.description);
  
  // Generate meta tags
  const metaTags = generateMetaTags({
    ...seoConfig,
    title: optimizedTitle,
    description: optimizedDescription
  });
  
  // Generate social meta tags
  const socialTags = generateSocialMetaTags(seoConfig);
  
  // Combine all structured data
  const allStructuredData = [
    ORGANIZATION_STRUCTURED_DATA,
    WEBSITE_STRUCTURED_DATA,
    ...structuredData
  ];

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{optimizedTitle}</title>
      <meta name="description" content={optimizedDescription} />
      {seoConfig.keywords && <meta name="keywords" content={seoConfig.keywords} />}
      
      {/* Canonical URL */}
      {seoConfig.canonical && <link rel="canonical" href={seoConfig.canonical} />}
      
      {/* Robots */}
      {seoConfig.noindex && <meta name="robots" content="noindex" />}
      {seoConfig.nofollow && <meta name="robots" content="nofollow" />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={optimizedTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:type" content={seoConfig.type || 'website'} />
      <meta property="og:url" content={seoConfig.url || DEFAULT_SEO.url} />
      {seoConfig.image && <meta property="og:image" content={seoConfig.image} />}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={optimizedTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      {seoConfig.image && <meta name="twitter:image" content={seoConfig.image} />}
      
      {/* Social Media Meta Tags */}
      {Object.entries(socialTags).map(([key, value]) => (
        <meta key={key} property={key} content={value} />
      ))}
      
      {/* Article-specific meta tags */}
      {seoConfig.type === 'article' && (
        <>
          {seoConfig.publishedTime && (
            <meta property="article:published_time" content={seoConfig.publishedTime} />
          )}
          {seoConfig.modifiedTime && (
            <meta property="article:modified_time" content={seoConfig.modifiedTime} />
          )}
          {seoConfig.author && (
            <meta property="article:author" content={seoConfig.author} />
          )}
          {seoConfig.section && (
            <meta property="article:section" content={seoConfig.section} />
          )}
          {seoConfig.tags && (
            <meta property="article:tag" content={seoConfig.tags.join(', ')} />
          )}
        </>
      )}
      
      {/* Structured Data */}
      {allStructuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data)
          }}
        />
      ))}
      
      {/* Additional meta tags for better SEO */}
      <meta name="author" content="Integrated Development Association (IDEA)" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      
      {/* Language and region */}
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="Integrated Development Association (IDEA)" />
      
      {/* Performance optimization */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://firebase.googleapis.com" />
      
      {/* Favicon and app icons */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {children}
    </Helmet>
  );
};

// Specialized SEO components for different page types
export const HomePageSEO: React.FC = () => (
  <SEOHead
    config={{
      title: 'Integrated Development Association (IDEA) - Leading NGO in Sri Lanka',
      description: 'IDEA is a leading non-governmental organization in Sri Lanka, contributing to sustainable development since 1990. We focus on community development, environmental conservation, and social empowerment.',
      keywords: 'IDEA, Integrated Development Association, Sri Lanka, sustainable development, NGO, community development, environmental conservation, social empowerment, non-profit',
      type: 'website',
      url: 'https://idealk.org'
    }}
  />
);

export const NewsPageSEO: React.FC = () => (
  <SEOHead
    config={{
      title: 'News & Updates - Integrated Development Association (IDEA)',
      description: 'Stay updated with the latest news, events, and developments from IDEA. Read about our projects, achievements, and impact in Sri Lanka.',
      keywords: 'IDEA news, Sri Lanka NGO news, development news, community updates, IDEA events, sustainable development news',
      type: 'website',
      url: 'https://idealk.org/news'
    }}
  />
);

export const ProjectsPageSEO: React.FC = () => (
  <SEOHead
    config={{
      title: 'Our Projects - Integrated Development Association (IDEA)',
      description: 'Explore IDEA\'s impactful projects across Sri Lanka. From community development to environmental conservation, discover how we create positive change.',
      keywords: 'IDEA projects, Sri Lanka development projects, community development, environmental projects, NGO projects, sustainable development projects',
      type: 'website',
      url: 'https://idealk.org/projects'
    }}
  />
);

export const AboutPageSEO: React.FC = () => (
  <SEOHead
    config={{
      title: 'About IDEA - Integrated Development Association',
      description: 'Learn about IDEA\'s mission, vision, and 30+ years of commitment to sustainable development in Sri Lanka. Discover our team, values, and impact.',
      keywords: 'about IDEA, IDEA mission, IDEA vision, Sri Lanka NGO, sustainable development organization, IDEA history, IDEA team',
      type: 'website',
      url: 'https://idealk.org/about'
    }}
  />
);

export const ContactPageSEO: React.FC = () => (
  <SEOHead
    config={{
      title: 'Contact IDEA - Get in Touch',
      description: 'Contact IDEA for partnerships, donations, volunteering opportunities, or general inquiries. We\'re here to help create positive change in Sri Lanka.',
      keywords: 'contact IDEA, IDEA contact, Sri Lanka NGO contact, partnership opportunities, volunteer IDEA, donate IDEA',
      type: 'website',
      url: 'https://idealk.org/contact'
    }}
  />
);

export const DownloadsPageSEO: React.FC = () => (
  <SEOHead
    config={{
      title: 'Downloads - Resources & Documents - IDEA',
      description: 'Access IDEA\'s resources, reports, publications, and documents. Download materials related to our projects, research, and development work.',
      keywords: 'IDEA downloads, Sri Lanka NGO resources, development reports, IDEA publications, NGO documents, sustainable development resources',
      type: 'website',
      url: 'https://idealk.org/downloads'
    }}
  />
);

// SEO component for news articles
export const NewsArticleSEO: React.FC<{
  article: {
    title: string;
    excerpt?: string;
    content: string;
    author: string;
    date: string;
    category: string;
    images?: string[];
    seoKeywords?: string;
  };
  structuredData?: StructuredData[];
}> = ({ article, structuredData = [] }) => {
  const description = article.excerpt || 
    article.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...';
  
  const keywords = article.seoKeywords || 
    `${article.category}, IDEA, Sri Lanka, development, ${article.author}`;

  return (
    <SEOHead
      config={{
        title: `${article.title} - IDEA News`,
        description,
        keywords,
        type: 'article',
        publishedTime: article.date,
        author: article.author,
        section: article.category,
        image: article.images?.[0],
        url: window.location.href,
        canonical: `https://idealk.org/news/${article.title.toLowerCase().replace(/\s+/g, '-')}`
      }}
      structuredData={structuredData}
    />
  );
};

// SEO component for project details
export const ProjectDetailSEO: React.FC<{
  project: {
    title: string;
    description: string;
    location: string;
    status: string;
    images?: string[];
  };
  structuredData?: StructuredData[];
}> = ({ project, structuredData = [] }) => {
  return (
    <SEOHead
      config={{
        title: `${project.title} - IDEA Project`,
        description: project.description,
        keywords: `${project.title}, IDEA project, ${project.location}, ${project.status}, Sri Lanka development`,
        type: 'website',
        image: project.images?.[0],
        url: window.location.href
      }}
      structuredData={structuredData}
    />
  );
}; 
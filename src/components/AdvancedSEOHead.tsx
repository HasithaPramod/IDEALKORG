import { Helmet } from 'react-helmet-async';
import { 
  AdvancedSEOConfig,
  ADVANCED_ORGANIZATION_STRUCTURED_DATA,
  ADVANCED_WEBSITE_STRUCTURED_DATA,
  generateAdvancedArticleStructuredData,
  generateAdvancedProjectStructuredData,
  generateAdvancedFAQStructuredData,
  generateAdvancedLocalBusinessStructuredData,
  generatePerformanceMetaTags,
  generateAdvancedSocialMetaTags,
  generateCoreWebVitalsStructuredData,
  generateAdvancedKeywords
} from '@/lib/advanced-seo';
import { StructuredData } from '@/lib/seo';

interface AdvancedSEOHeadProps {
  config: AdvancedSEOConfig;
  structuredData?: StructuredData[];
  children?: React.ReactNode;
}

export const AdvancedSEOHead: React.FC<AdvancedSEOHeadProps> = ({ 
  config, 
  structuredData = [], 
  children 
}) => {
  // Generate advanced keywords if not provided
  const keywords = config.keywords || generateAdvancedKeywords(
    `${config.title} ${config.description}`,
    { includeBrand: true, maxKeywords: 20 }
  );

  // Generate performance meta tags
  const performanceTags = generatePerformanceMetaTags(config);
  
  // Generate advanced social meta tags
  const socialTags = generateAdvancedSocialMetaTags(config);
  
  // Combine all structured data
  const allStructuredData = [
    ADVANCED_ORGANIZATION_STRUCTURED_DATA,
    ADVANCED_WEBSITE_STRUCTURED_DATA,
    ...structuredData
  ];

  // Add breadcrumb structured data if provided
  if (config.breadcrumbs && config.breadcrumbs.length > 0) {
    allStructuredData.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: config.breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url
      }))
    });
  }

  // Add FAQ structured data if provided
  if (config.faqs && config.faqs.length > 0) {
    allStructuredData.push(generateAdvancedFAQStructuredData(config.faqs, config.url));
  }

  // Add Core Web Vitals structured data if provided
  if (config.coreWebVitals) {
    allStructuredData.push(generateCoreWebVitalsStructuredData(config.coreWebVitals));
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{config.title}</title>
      <meta name="description" content={config.description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      {config.canonical && <link rel="canonical" href={config.canonical} />}
      
      {/* Robots */}
      {config.noindex && <meta name="robots" content="noindex" />}
      {config.nofollow && <meta name="robots" content="nofollow" />}
      
      {/* Language and Region */}
      {config.language && <meta property="og:locale" content={config.language} />}
      {config.region && <meta name="geo.region" content={config.region} />}
      {config.geoRegion && <meta name="geo.region" content={config.geoRegion} />}
      {config.geoPosition && <meta name="geo.position" content={config.geoPosition} />}
      {config.geoPlacename && <meta name="geo.placename" content={config.geoPlacename} />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={config.title} />
      <meta property="og:description" content={config.description} />
      <meta property="og:type" content={config.type || 'website'} />
      <meta property="og:url" content={config.url || 'https://idealk.org'} />
      {config.image && <meta property="og:image" content={config.image} />}
      {config.image && <meta property="og:image:width" content="1200" />}
      {config.image && <meta property="og:image:height" content="630" />}
      {config.image && <meta property="og:image:alt" content={config.title} />}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={config.title} />
      <meta name="twitter:description" content={config.description} />
      {config.image && <meta name="twitter:image" content={config.image} />}
      
      {/* Advanced Social Media Meta Tags */}
      {Object.entries(socialTags).map(([key, value]) => (
        <meta key={key} property={key} content={value} />
      ))}
      
      {/* Performance Optimization Meta Tags */}
      {Object.entries(performanceTags).map(([key, value]) => (
        <link key={key} rel="dns-prefetch" href={value} />
      ))}
      
      {/* Preload Critical Resources */}
      {config.preload && config.preload.map((resource, index) => (
        <link key={index} rel="preload" href={resource} as="style" />
      ))}
      
      {/* Prefetch Resources */}
      {config.prefetch && config.prefetch.map((resource, index) => (
        <link key={index} rel="prefetch" href={resource} />
      ))}
      
      {/* Article-specific meta tags */}
      {config.type === 'article' && (
        <>
          {config.publishedTime && (
            <meta property="article:published_time" content={config.publishedTime} />
          )}
          {config.modifiedTime && (
            <meta property="article:modified_time" content={config.modifiedTime} />
          )}
          {config.author && (
            <meta property="article:author" content={config.author} />
          )}
          {config.section && (
            <meta property="article:section" content={config.section} />
          )}
          {config.tags && (
            <meta property="article:tag" content={config.tags.join(', ')} />
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
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="IDEA" />
      
      {/* Language and region */}
      <meta property="og:site_name" content="Integrated Development Association (IDEA)" />
      
      {/* Performance optimization */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://firebase.googleapis.com" />
      <link rel="dns-prefetch" href="https://maps.googleapis.com" />
      
      {/* Favicon and app icons */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Analytics and Tracking */}
      {config.googleAnalyticsId && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}`} />
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${config.googleAnalyticsId}');
            `}
          </script>
        </>
      )}
      
      {config.googleTagManagerId && (
        <>
          <script>
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${config.googleTagManagerId}');
            `}
          </script>
        </>
      )}
      
      {config.facebookPixelId && (
        <script>
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${config.facebookPixelId}');
            fbq('track', 'PageView');
          `}
        </script>
      )}
      
      {children}
    </Helmet>
  );
};

// Specialized Advanced SEO components for different page types
export const AdvancedHomePageSEO: React.FC = () => (
  <AdvancedSEOHead
    config={{
      title: 'Integrated Development Association (IDEA) - Leading NGO in Sri Lanka | Sustainable Development Since 1990',
      description: 'IDEA is a leading non-governmental organization in Sri Lanka, contributing to sustainable development since 1990. We focus on community development, environmental conservation, and social empowerment across Sri Lanka.',
      keywords: generateAdvancedKeywords(
        'IDEA Integrated Development Association Sri Lanka sustainable development NGO community development environmental conservation social empowerment non-profit organization',
        { includeBrand: true, maxKeywords: 25 }
      ),
      type: 'website',
      url: 'https://idealk.org',
      image: 'https://idealk.org/assets/hero-community.jpg',
      language: 'en_US',
      region: 'LK',
      geoRegion: 'LK',
      geoPosition: '7.2810998;80.6776645',
      geoPlacename: 'Kandy, Sri Lanka',
      twitterCreator: '@idealk',
      twitterSite: '@idealk',
      facebookAppId: '61578749545222',
      googleAnalyticsId: 'G-89VNK6P5FL',
      preload: [
        '/assets/hero-community.jpg',
        '/assets/logo/logo.png'
      ],
      dnsPrefetch: [
        'https://www.google-analytics.com',
        'https://firebase.googleapis.com',
        'https://maps.googleapis.com'
      ],
      breadcrumbs: [
        { name: 'Home', url: 'https://idealk.org' }
      ],
      faqs: [
        {
          question: 'What is IDEA?',
          answer: 'IDEA (Integrated Development Association) is a leading non-governmental organization in Sri Lanka, contributing to sustainable development since 1990.'
        },
        {
          question: 'What are IDEA\'s main focus areas?',
          answer: 'IDEA focuses on community development, environmental conservation, and social empowerment across Sri Lanka.'
        },
        {
          question: 'How can I get involved with IDEA?',
          answer: 'You can get involved by volunteering, donating, or partnering with IDEA on our various development projects.'
        }
      ]
    }}
  />
);

export const AdvancedNewsPageSEO: React.FC = () => (
  <AdvancedSEOHead
    config={{
      title: 'News & Updates - Integrated Development Association (IDEA) | Latest Development News Sri Lanka',
      description: 'Stay updated with the latest news, events, and developments from IDEA. Read about our projects, achievements, and impact in sustainable development across Sri Lanka.',
      keywords: generateAdvancedKeywords(
        'IDEA news Sri Lanka NGO news development news community updates IDEA events sustainable development news Sri Lanka development updates',
        { includeBrand: true, maxKeywords: 20 }
      ),
      type: 'website',
      url: 'https://idealk.org/news',
      image: 'https://idealk.org/assets/hero-community.jpg',
      language: 'en_US',
      breadcrumbs: [
        { name: 'Home', url: 'https://idealk.org' },
        { name: 'News', url: 'https://idealk.org/news' }
      ]
    }}
  />
);

export const AdvancedProjectsPageSEO: React.FC = () => (
  <AdvancedSEOHead
    config={{
      title: 'Our Projects - Integrated Development Association (IDEA) | Sustainable Development Projects Sri Lanka',
      description: 'Explore IDEA\'s impactful projects across Sri Lanka. From community development to environmental conservation, discover how we create positive change and sustainable impact.',
      keywords: generateAdvancedKeywords(
        'IDEA projects Sri Lanka development projects community development environmental projects NGO projects sustainable development projects Sri Lanka',
        { includeBrand: true, maxKeywords: 20 }
      ),
      type: 'website',
      url: 'https://idealk.org/projects',
      image: 'https://idealk.org/assets/project-garden.jpg',
      language: 'en_US',
      breadcrumbs: [
        { name: 'Home', url: 'https://idealk.org' },
        { name: 'Projects', url: 'https://idealk.org/projects' }
      ]
    }}
  />
);

export const AdvancedAboutPageSEO: React.FC = () => (
  <AdvancedSEOHead
    config={{
      title: 'About IDEA - Integrated Development Association | 30+ Years of Sustainable Development Sri Lanka',
      description: 'Learn about IDEA\'s mission, vision, and 30+ years of commitment to sustainable development in Sri Lanka. Discover our team, values, impact, and journey since 1990.',
      keywords: generateAdvancedKeywords(
        'about IDEA IDEA mission IDEA vision Sri Lanka NGO sustainable development organization IDEA history IDEA team IDEA values',
        { includeBrand: true, maxKeywords: 20 }
      ),
      type: 'website',
      url: 'https://idealk.org/about',
      image: 'https://idealk.org/assets/team-photo.jpg',
      language: 'en_US',
      breadcrumbs: [
        { name: 'Home', url: 'https://idealk.org' },
        { name: 'About', url: 'https://idealk.org/about' }
      ]
    }}
  />
);

export const AdvancedContactPageSEO: React.FC = () => (
  <AdvancedSEOHead
    config={{
      title: 'Contact IDEA - Get in Touch | Integrated Development Association Sri Lanka',
      description: 'Contact IDEA for partnerships, donations, volunteering opportunities, or general inquiries. We\'re here to help create positive change in Sri Lanka. Reach out to our team today.',
      keywords: generateAdvancedKeywords(
        'contact IDEA IDEA contact Sri Lanka NGO contact partnership opportunities volunteer IDEA donate IDEA IDEA phone IDEA email',
        { includeBrand: true, maxKeywords: 20 }
      ),
      type: 'website',
      url: 'https://idealk.org/contact',
      image: 'https://idealk.org/assets/hero-community.jpg',
      language: 'en_US',
      geoRegion: 'LK',
      geoPosition: '7.2810998;80.6776645',
      geoPlacename: 'Kandy, Sri Lanka',
      breadcrumbs: [
        { name: 'Home', url: 'https://idealk.org' },
        { name: 'Contact', url: 'https://idealk.org/contact' }
      ]
    }}
  />
);

export const AdvancedDownloadsPageSEO: React.FC = () => (
  <AdvancedSEOHead
    config={{
      title: 'Downloads - Resources & Documents - IDEA | NGO Resources Sri Lanka',
      description: 'Access IDEA\'s resources, reports, publications, and documents. Download materials related to our projects, research, development work, and sustainable development initiatives.',
      keywords: generateAdvancedKeywords(
        'IDEA downloads Sri Lanka NGO resources development reports IDEA publications NGO documents sustainable development resources IDEA reports',
        { includeBrand: true, maxKeywords: 20 }
      ),
      type: 'website',
      url: 'https://idealk.org/downloads',
      image: 'https://idealk.org/assets/hero-community.jpg',
      language: 'en_US',
      breadcrumbs: [
        { name: 'Home', url: 'https://idealk.org' },
        { name: 'Downloads', url: 'https://idealk.org/downloads' }
      ]
    }}
  />
);

// Advanced SEO component for news articles
export const AdvancedNewsArticleSEO: React.FC<{
  article: {
    title: string;
    excerpt?: string;
    content: string;
    author: string;
    date: string;
    category: string;
    images?: string[];
    seoKeywords?: string;
    wordCount?: number;
    readingTime?: number;
  };
  structuredData?: StructuredData[];
}> = ({ article, structuredData = [] }) => {
  const description = article.excerpt || 
    article.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...';
  
  const keywords = article.seoKeywords || 
    generateAdvancedKeywords(
      `${article.title} ${article.content}`,
      { includeBrand: true, maxKeywords: 15 }
    );

  const articleStructuredData = generateAdvancedArticleStructuredData({
    title: article.title,
    description,
    content: article.content,
    image: article.images?.[0],
    url: window.location.href,
    publishedTime: article.date,
    author: article.author,
    category: article.category,
    wordCount: article.wordCount,
    readingTime: article.readingTime
  });

  return (
    <AdvancedSEOHead
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
        canonical: `https://idealk.org/news/${article.title.toLowerCase().replace(/\s+/g, '-')}`,
        language: 'en_US',
        breadcrumbs: [
          { name: 'Home', url: 'https://idealk.org' },
          { name: 'News', url: 'https://idealk.org/news' },
          { name: article.title, url: window.location.href }
        ]
      }}
      structuredData={[articleStructuredData, ...structuredData]}
    />
  );
};

// Advanced SEO component for project details
export const AdvancedProjectDetailSEO: React.FC<{
  project: {
    title: string;
    description: string;
    location: string;
    status: string;
    images?: string[];
    startDate?: string;
    endDate?: string;
    beneficiaries: string;
    budget?: string;
    partners?: string[];
    impact?: string;
    category: string;
  };
  structuredData?: StructuredData[];
}> = ({ project, structuredData = [] }) => {
  const projectStructuredData = generateAdvancedProjectStructuredData({
    title: project.title,
    description: project.description,
    image: project.images?.[0],
    url: window.location.href,
    location: project.location,
    startDate: project.startDate,
    endDate: project.endDate,
    status: project.status,
    beneficiaries: project.beneficiaries,
    budget: project.budget,
    partners: project.partners,
    impact: project.impact,
    category: project.category
  });

  return (
    <AdvancedSEOHead
      config={{
        title: `${project.title} - IDEA Project | ${project.location}`,
        description: project.description,
        keywords: generateAdvancedKeywords(
          `${project.title} IDEA project ${project.location} ${project.status} Sri Lanka development ${project.category}`,
          { includeBrand: true, maxKeywords: 20 }
        ),
        type: 'website',
        image: project.images?.[0],
        url: window.location.href,
        language: 'en_US',
        breadcrumbs: [
          { name: 'Home', url: 'https://idealk.org' },
          { name: 'Projects', url: 'https://idealk.org/projects' },
          { name: project.title, url: window.location.href }
        ]
      }}
      structuredData={[projectStructuredData, ...structuredData]}
    />
  );
};

// Advanced SEO component for login page
export const AdvancedLoginPageSEO: React.FC = () => (
  <AdvancedSEOHead
    config={{
      title: 'Admin Login - Integrated Development Association (IDEA) | Secure Access',
      description: 'Secure admin login portal for IDEA (Integrated Development Association). Access the admin dashboard to manage projects, news, and organizational content.',
      keywords: generateAdvancedKeywords(
        'IDEA admin login secure access dashboard management Sri Lanka NGO admin portal',
        { includeBrand: true, maxKeywords: 15 }
      ),
      type: 'website',
      url: 'https://idealk.org/login',
      image: 'https://idealk.org/assets/logo/logo.png',
      language: 'en_US',
      robots: 'noindex, nofollow',
      canonical: 'https://idealk.org/login',
      breadcrumbs: [
        { name: 'Home', url: 'https://idealk.org' },
        { name: 'Admin Login', url: 'https://idealk.org/login' }
      ]
    }}
  />
);

// Advanced SEO component for admin dashboard
export const AdvancedAdminPageSEO: React.FC = () => (
  <AdvancedSEOHead
    config={{
      title: 'Admin Dashboard - Integrated Development Association (IDEA) | Content Management',
      description: 'IDEA admin dashboard for managing projects, news, applications, and organizational content. Secure content management system for IDEA administrators.',
      keywords: generateAdvancedKeywords(
        'IDEA admin dashboard content management projects news applications Sri Lanka NGO admin panel',
        { includeBrand: true, maxKeywords: 15 }
      ),
      type: 'website',
      url: 'https://idealk.org/admin',
      image: 'https://idealk.org/assets/logo/logo.png',
      language: 'en_US',
      robots: 'noindex, nofollow',
      canonical: 'https://idealk.org/admin',
      breadcrumbs: [
        { name: 'Home', url: 'https://idealk.org' },
        { name: 'Admin Dashboard', url: 'https://idealk.org/admin' }
      ]
    }}
  />
);

// Advanced SEO component for 404 page
export const AdvancedNotFoundPageSEO: React.FC = () => (
  <AdvancedSEOHead
    config={{
      title: 'Page Not Found - Integrated Development Association (IDEA) | 404 Error',
      description: 'The page you are looking for could not be found. Return to IDEA\'s homepage to explore our sustainable development projects and initiatives.',
      keywords: generateAdvancedKeywords(
        'IDEA 404 page not found error Sri Lanka NGO sustainable development',
        { includeBrand: true, maxKeywords: 10 }
      ),
      type: 'website',
      url: 'https://idealk.org/404',
      image: 'https://idealk.org/assets/logo/logo.png',
      language: 'en_US',
      robots: 'noindex, nofollow',
      canonical: 'https://idealk.org/404',
      breadcrumbs: [
        { name: 'Home', url: 'https://idealk.org' },
        { name: 'Page Not Found', url: 'https://idealk.org/404' }
      ]
    }}
  />
);

// Advanced SEO component for unauthorized page
export const AdvancedUnauthorizedPageSEO: React.FC = () => (
  <AdvancedSEOHead
    config={{
      title: 'Access Denied - Integrated Development Association (IDEA) | Unauthorized Access',
      description: 'You do not have permission to access this page. This area is restricted to authorized IDEA administrators only.',
      keywords: generateAdvancedKeywords(
        'IDEA access denied unauthorized admin restricted Sri Lanka NGO',
        { includeBrand: true, maxKeywords: 10 }
      ),
      type: 'website',
      url: 'https://idealk.org/unauthorized',
      image: 'https://idealk.org/assets/logo/logo.png',
      language: 'en_US',
      robots: 'noindex, nofollow',
      canonical: 'https://idealk.org/unauthorized',
      breadcrumbs: [
        { name: 'Home', url: 'https://idealk.org' },
        { name: 'Access Denied', url: 'https://idealk.org/unauthorized' }
      ]
    }}
  />
);
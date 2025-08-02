import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, Clock, User, ExternalLink, Loader2, Image as ImageIcon } from 'lucide-react';
import { firebaseStorage, type News } from '@/lib/firebaseStorage';
import { generateSlug, generateUniqueSlug } from '@/lib/utils';
import { sanitizeHTML } from '@/lib/security';
import { AdvancedNewsArticleSEO } from '@/components/AdvancedSEOHead';
import { generateArticleStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo';

const NewsArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<News | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) {
        setError('Article slug is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔍 Looking for news article with slug:', slug);
        
        // Get all news articles and find the one with matching slug
        const allNews = await firebaseStorage.getAllNews();
        console.log('📋 All news articles:', allNews.map(n => ({ title: n.title, id: n.id })));
        
        // First try to find by exact slug match
        let foundArticle = allNews.find(n => {
          const titleSlug = generateSlug(n.title || '');
          return titleSlug === slug;
        });

        // If not found, try to find by unique slug match (with ID)
        if (!foundArticle) {
          console.log('🔍 Trying unique slug match...');
          foundArticle = allNews.find(n => {
            const uniqueSlug = generateUniqueSlug(n.title || '', n.id || '');
            return uniqueSlug === slug;
          });
        }

        // If not found, try to find by partial match (for backward compatibility)
        if (!foundArticle) {
          console.log('🔍 Trying partial match for backward compatibility...');
          foundArticle = allNews.find(n => {
            const titleSlug = generateSlug(n.title || '');
            return titleSlug.includes(slug) || slug.includes(titleSlug);
          });
        }

        if (foundArticle) {
          console.log('✅ Found article:', foundArticle);
          setArticle(foundArticle);
          
          // Fetch related articles (same category, excluding current article)
          const related = allNews
            .filter(item => 
              item.id !== foundArticle.id && 
              item.category === foundArticle.category
            )
            .slice(0, 3); // Show max 3 related articles
          setRelatedArticles(related);
        } else {
          console.log('❌ Article not found for slug:', slug);
          console.log('🔍 Available slugs:', allNews.map(n => ({
            title: n.title,
            slug: generateSlug(n.title || '')
          })));
          setError('Article not found');
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading article...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error || 'Article not found'}</p>
            <Button onClick={() => navigate('/news')}>Back to News</Button>
          </div>
        </div>
      </div>
    );
  }

  // Generate structured data for SEO
  const articleStructuredData = generateArticleStructuredData({
    title: article.title,
    description: article.excerpt || article.seoDescription || 'Read the full article on IDEA',
    content: article.content,
    image: article.images?.[0],
    url: window.location.href,
    publishedTime: article.date,
    author: article.author,
    category: article.category
  });

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: 'https://idealk.org' },
    { name: 'News', url: 'https://idealk.org/news' },
    { name: article.title, url: window.location.href }
  ]);

  return (
    <>
      <AdvancedNewsArticleSEO 
        article={article}
        structuredData={[articleStructuredData, breadcrumbStructuredData]}
      />
      
      <div className="min-h-screen py-20">
        {/* Breadcrumb Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/news" className="hover:text-foreground transition-colors">
            News
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-xs">
            {article.title}
          </span>
        </nav>
        
        <Button 
          variant="ghost" 
          onClick={() => navigate('/news')}
          className="hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to News
        </Button>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-6">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(article.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {article.author}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {new Date(article.date).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge variant="outline" className="text-sm font-medium bg-primary/5 border-primary/20 text-primary">
                {article.category}
              </Badge>
              <Badge className={`text-sm font-medium ${
                article.type === 'Event' ? 'bg-green-100 text-green-800 border-green-200' :
                article.type === 'Symposium' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                'bg-orange-100 text-orange-800 border-orange-200'
              }`}>
                {article.type}
              </Badge>
              {article.featured && (
                <Badge className="text-sm font-medium bg-yellow-100 text-yellow-800 border-yellow-200">
                  Featured
                </Badge>
              )}
            </div>

            {/* Title */}
            <CardTitle className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
              {article.title}
            </CardTitle>

            {/* Excerpt */}
            {article.excerpt && (
              <CardDescription className="text-lg text-muted-foreground leading-relaxed">
                {article.excerpt}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="pt-0">
            {/* Images */}
            {article.images && article.images.length > 0 && (
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {article.images.map((image, index) => (
                    <div key={index} className="relative group overflow-hidden rounded-lg">
                      {image.startsWith('data:') ? (
                        // Base64 image
                        <img 
                          src={image} 
                          alt={`${article.title} - Image ${index + 1}`}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        // URL image
                        <img 
                          src={image} 
                          alt={`${article.title} - Image ${index + 1}`}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-base leading-relaxed text-foreground"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.content) }}
              />
            </div>

            {/* SEO Content (if available) */}
            {article.seoDescription && (
              <div className="mt-8 p-4 bg-muted/30 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Summary</h3>
                <p className="text-muted-foreground">{article.seoDescription}</p>
              </div>
            )}

            {/* Tags/Keywords */}
            {article.seoKeywords && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {article.seoKeywords.split(',').map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="mt-8 pt-6 border-t border-muted">
              <h3 className="text-lg font-semibold mb-3">Share this article</h3>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    navigator.share?.({
                      title: article.title,
                      text: article.excerpt,
                      url: window.location.href,
                    }).catch(() => {
                      // Fallback: copy to clipboard
                      navigator.clipboard.writeText(window.location.href);
                    });
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                >
                  Copy Link
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Related Articles</h2>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {relatedArticles.map((relatedArticle) => (
                 <Link key={relatedArticle.id} to={`/news/${generateBestSlug(relatedArticle.title, relatedArticle.id || '', relatedArticles.map(n => generateSlug(n.title)))}`} className="block">
                  <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105 cursor-pointer">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="outline" className="text-xs font-medium bg-primary/5 border-primary/20 text-primary">
                          {relatedArticle.category}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(relatedArticle.date).toLocaleDateString()}
                        </div>
                      </div>
                      <CardTitle className="text-foreground text-base leading-tight mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                        {relatedArticle.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                        {relatedArticle.excerpt}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <Badge className={`text-xs font-medium ${
                          relatedArticle.type === 'Event' ? 'bg-green-100 text-green-800 border-green-200' :
                          relatedArticle.type === 'Symposium' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          'bg-orange-100 text-orange-800 border-orange-200'
                        }`}>
                          {relatedArticle.type}
                        </Badge>
                        <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                          Read More 
                          <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
                 )}
       </div>
     </div>
     </>
   );
 };

export default NewsArticle; 
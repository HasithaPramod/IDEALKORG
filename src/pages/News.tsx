import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ExternalLink, Clock, Loader2 } from 'lucide-react';
import { firebaseStorage, type News } from '@/lib/firebaseStorage';
import { generateSlug, generateBestSlug } from '@/lib/utils';
import { AdvancedNewsPageSEO } from '@/components/AdvancedSEOHead';

const News = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const fetchedNews = await firebaseStorage.getAllNews();
        setNews(fetchedNews);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Generate slugs for all news to check for conflicts
  const generateNewsSlugs = () => {
    const slugs = news.map(item => generateSlug(item.title));
    return slugs;
  };

  return (
    <>
      <AdvancedNewsPageSEO />
      <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-muted/30 via-background to-muted/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            News & Events
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Stay updated with IDEA's latest activities, workshops, and contributions to 
            sustainable development in Sri Lanka and the region.
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading news...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No news articles found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <Link key={item.id} to={`/news/${generateBestSlug(item.title, item.id || '', generateNewsSlugs())}`} className="block">
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:scale-105 cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="outline" className="text-xs font-medium bg-primary/5 border-primary/20 text-primary">
                        {item.category}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                    </div>
                    <CardTitle className="text-foreground text-lg leading-tight mb-3 group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                      {truncateText(item.excerpt)}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <Badge className={`text-xs font-medium ${
                        item.type === 'Event' ? 'bg-green-100 text-green-800 border-green-200' :
                        item.type === 'Symposium' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        'bg-orange-100 text-orange-800 border-orange-200'
                      }`}>
                        {item.type}
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
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">
            Together We Can Make A Difference
          </h2>
          <p className="text-xl mb-8 opacity-90">
            When individuals associate with a shared purpose, their collective efforts can create meaningful change. 
            Join IDEA in addressing climate and environmental challenges across Sri Lanka.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
            Contact Us
          </Button>
        </div>
      </section>
      </div>
    </>
  );
};

export default News;
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, TreePine, Recycle, ExternalLink, Calendar, MapPin, Loader2, ChevronDown, Target, Award, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { JoinUsForm } from '@/components/JoinUsForm';
import HeroCarousel from '@/components/HeroCarousel';
import { getFeaturedProjects, truncateText, type Project } from '@/data/projects';
import { generateSlug, generateBestSlug } from '@/lib/utils';
import { firebaseStorage, type News } from '@/lib/firebaseStorage';
import logoImage from '@/assets/logo/logo.png';
import { AdvancedHomePageSEO } from '@/components/AdvancedSEOHead';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';

const Home = () => {
  const [joinFormOpen, setJoinFormOpen] = useState(false);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [featuredNews, setFeaturedNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [showFloatingNav, setShowFloatingNav] = useState(false);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setLoading(true);
        const projects = await getFeaturedProjects();
        setFeaturedProjects(projects);
      } catch (error) {
        console.error('Error fetching featured projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  useEffect(() => {
    const fetchFeaturedNews = async () => {
      try {
        setNewsLoading(true);
        const allNews = await firebaseStorage.getAllNews();
        // Get the latest 3 news articles
        const featured = allNews.slice(0, 3);
        setFeaturedNews(featured);
      } catch (error) {
        console.error('Error fetching featured news:', error);
      } finally {
        setNewsLoading(false);
      }
    };

    fetchFeaturedNews();
  }, []);

  // Handle scroll for floating navigation
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowFloatingNav(scrollPosition > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enable smooth scrolling for anchor links
  useSmoothScroll();

  return (
    <>
      <AdvancedHomePageSEO />
      <div className="min-h-screen">
        {/* Hero Carousel Section */}
        <HeroCarousel />

        {/* Quick Navigation Section */}
        <section className="py-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Quick Navigation</h2>
              <p className="text-muted-foreground">Explore our key sections and resources</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="#impact-stats" className="group">
                <div className="bg-background border border-border rounded-lg p-4 text-center hover:shadow-lg transition-all duration-300 group-hover:border-primary/50">
                  <Target className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">Impact Stats</h3>
                </div>
              </Link>
              
              <Link to="#featured-projects" className="group">
                <div className="bg-background border border-border rounded-lg p-4 text-center hover:shadow-lg transition-all duration-300 group-hover:border-primary/50">
                  <Award className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">Projects</h3>
                </div>
              </Link>
              
              <Link to="#latest-news" className="group">
                <div className="bg-background border border-border rounded-lg p-4 text-center hover:shadow-lg transition-all duration-300 group-hover:border-primary/50">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">News</h3>
                </div>
              </Link>
              
              <Link to="/contact" className="group">
                <div className="bg-background border border-border rounded-lg p-4 text-center hover:shadow-lg transition-all duration-300 group-hover:border-primary/50">
                  <Heart className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">Contact</h3>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="py-6 bg-muted/20 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <span className="font-semibold text-foreground">Page Sections:</span>
              <Link 
                to="#impact-stats" 
                className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
              >
                Impact Statistics
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link 
                to="#featured-projects" 
                className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
              >
                Featured Projects
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link 
                to="#latest-news" 
                className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
              >
                Latest News
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link 
                to="/about" 
                className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
              >
                About Us
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link 
                to="/contact" 
                className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
              >
                Contact
              </Link>
            </div>
          </div>
        </section>

      {/* Impact Stats */}
      <section id="impact-stats" className="py-20 bg-gradient-to-br from-primary/10 via-background to-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Impact Over the Years
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Transforming lives and communities through sustainable development initiatives across Sri Lanka
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/about">
                <Button variant="outline" size="sm" className="group">
                  <Users className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Learn About Our Mission
                </Button>
              </Link>
              <Link to="/projects">
                <Button variant="outline" size="sm" className="group">
                  <Award className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  View All Projects
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center group">
              <div className="relative">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Users className="h-10 w-10 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-accent-foreground">+</span>
                </div>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                35+
              </h3>
              <p className="text-muted-foreground font-medium">Years of Experience</p>
            </div>
            
            <div className="text-center group">
              <div className="relative">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-600 to-green-500 rounded-full mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <TreePine className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">+</span>
                </div>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-2 group-hover:text-green-600 transition-colors duration-300">
                50+
              </h3>
              <p className="text-muted-foreground font-medium">Projects Completed</p>
            </div>
            
            <div className="text-center group">
              <div className="relative">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Recycle className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">+</span>
                </div>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-2 group-hover:text-blue-600 transition-colors duration-300">
                300K+
              </h3>
              <p className="text-muted-foreground font-medium">Lives Impacted</p>
            </div>
            
            <div className="text-center group">
              <div className="relative">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-600 to-orange-500 rounded-full mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">+</span>
                </div>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-2 group-hover:text-orange-600 transition-colors duration-300">
                75+
              </h3>
              <p className="text-muted-foreground font-medium">Communities Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="featured-projects" className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our latest impactful initiatives in sustainable development, renewable energy, 
              and environmental conservation across Sri Lanka.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Loading featured projects...</p>
                </div>
              </div>
            ) : featuredProjects.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No featured projects available.</p>
              </div>
            ) : (
              featuredProjects.map((project) => (
                <Card key={project.id} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:scale-105 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 overflow-hidden">
                  {/* Image Container with Gradient Overlay */}
                  <div className="relative overflow-hidden h-56">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                    <img 
                      src={project.image || logoImage} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = logoImage;
                        target.className = "w-full h-full object-contain p-8 bg-gradient-to-br from-primary/10 to-primary/5 group-hover:scale-110 transition-transform duration-700";
                      }}
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <Badge className={`text-xs font-semibold px-3 py-1 shadow-lg border-0 ${
                        project.status === 'Active' 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      }`}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <Badge className="text-xs font-semibold px-3 py-1 bg-white/90 text-gray-800 shadow-lg border-0 backdrop-blur-sm">
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-3">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed text-gray-600 line-clamp-3">
                      {truncateText(project.description)}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 pt-0">
                    {/* Project Details */}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-primary/70" />
                        <span className="font-medium">{project.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2 text-primary/70" />
                        <span className="font-medium">{project.beneficiaries}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-primary/70" />
                        <span className="font-medium">{project.duration}</span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Link to={`/projects/${generateSlug(project.title)}`}>
                        <Button 
                          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 group/btn h-12"
                          onClick={() => {
                            const slug = generateSlug(project.title);
                            console.log('🔗 Home page - Linking to project:', project.title, 'with slug:', slug);
                          }}
                        >
                          <span className="group-hover/btn:translate-x-1 transition-transform duration-300">
                            Learn More
                          </span>
                          <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </Link>
                      
                      <div className="flex gap-2">
                        <Link to="/projects" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            View All Projects
                          </Button>
                        </Link>
                        <Link to="/about" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            About Us
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
              ))
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/projects">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 group/btn">
                <span className="group-hover/btn:translate-x-1 transition-transform duration-300">
                  View All Projects
                </span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section id="latest-news" className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Latest News & Events
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Stay updated with our latest activities, workshops, and contributions to sustainable development.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/downloads">
                <Button variant="outline" size="sm" className="group">
                  <Calendar className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Download Resources
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="sm" className="group">
                  <Heart className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Get Involved
                </Button>
              </Link>
            </div>
          </div>
          
          {newsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading news...</p>
              </div>
            </div>
          ) : featuredNews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No news articles found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredNews.map((item) => (
                <Link key={item.id} to={`/news/${generateBestSlug(item.title, item.id || '', featuredNews.map(n => generateSlug(n.title)))}`} className="block">
                  <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:scale-105 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 overflow-hidden relative cursor-pointer">
                  {/* Header with Badges */}
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <Badge className="text-xs font-semibold px-3 py-1 bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg border-0">
                        {item.category}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(item.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-3">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed text-gray-600 line-clamp-3">
                      {truncateText(item.excerpt || item.content || '')}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={`text-xs font-semibold px-3 py-1 shadow-lg border-0 ${
                          item.type === 'Event' 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                          item.type === 'Symposium' 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' :
                            'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        }`}>
                          {item.type}
                        </Badge>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                        >
                          <span className="group-hover/btn:translate-x-1 transition-transform duration-300">
                            Read More
                          </span>
                          <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link to="/news" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            All News
                          </Button>
                        </Link>
                        <Link to="/downloads" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            Resources
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
                  </Link>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/news">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group/btn">
                <span className="group-hover/btn:translate-x-1 transition-transform duration-300">
                  View All News
                </span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>


      
      {/* Floating Navigation */}
      {showFloatingNav && (
        <div className="fixed left-8 top-1/2 transform -translate-y-1/2 bg-background/95 backdrop-blur-sm border border-border rounded-full shadow-lg z-40 p-2">
          <div className="flex flex-col space-y-2">
            <Link 
              to="#impact-stats"
              className="p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
              title="Impact Stats"
            >
              <Target className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </Link>
            <Link 
              to="#featured-projects"
              className="p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
              title="Featured Projects"
            >
              <Award className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </Link>
            <Link 
              to="#latest-news"
              className="p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
              title="Latest News"
            >
              <Calendar className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </Link>
            <Link 
              to="/about"
              className="p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
              title="About Us"
            >
              <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 group"
        aria-label="Back to top"
      >
        <ChevronDown className="h-6 w-6 rotate-180 group-hover:animate-bounce" />
      </button>

      <JoinUsForm open={joinFormOpen} onOpenChange={setJoinFormOpen} />
      </div>
    </>
  );
};

export default Home;
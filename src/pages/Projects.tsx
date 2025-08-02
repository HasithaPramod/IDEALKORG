import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, MapPin, Users, Loader2, ArrowRight, Clock, Target } from 'lucide-react';
import { getAllProjects, truncateText, type Project } from '@/data/projects';
import { generateSlug } from '@/lib/utils';
import logoImage from '@/assets/logo/logo.png';
import { AdvancedProjectsPageSEO } from '@/components/AdvancedSEOHead';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const fetchedProjects = await getAllProjects();
        setProjects(fetchedProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      case 'Completed':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
      case 'Planning':
        return 'bg-gradient-to-r from-orange-500 to-amber-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-600 text-white';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-gradient-to-r from-purple-500 to-pink-600',
      'bg-gradient-to-r from-cyan-500 to-blue-600',
      'bg-gradient-to-r from-emerald-500 to-teal-600',
      'bg-gradient-to-r from-orange-500 to-red-600',
      'bg-gradient-to-r from-indigo-500 to-purple-600',
      'bg-gradient-to-r from-pink-500 to-rose-600'
    ];
    const index = category.length % colors.length;
    return colors[index];
  };

  return (
    <>
      <AdvancedProjectsPageSEO />
      <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-muted/30 via-background to-muted/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Our Projects
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Discover IDEA's impactful initiatives in sustainable development, renewable energy, 
            and environmental conservation across Sri Lanka and South Asia.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading projects...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No projects found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Card key={project.id} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
                  {/* Image Container */}
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
                      <Badge className={`${getStatusColor(project.status)} shadow-lg border-0 font-semibold text-xs px-3 py-1`}>
                        {project.status}
                      </Badge>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <Badge className={`${getCategoryColor(project.category)} text-white shadow-lg border-0 font-semibold text-xs px-3 py-1`}>
                        {project.category}
                      </Badge>
                    </div>

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 z-5" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <CardTitle className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {project.title}
                    </CardTitle>
                    
                    <CardDescription className="text-sm leading-relaxed text-muted-foreground mb-6 line-clamp-3">
                      {truncateText(project.description, 120)}
                    </CardDescription>
                    
                    {/* Project Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-3 text-primary/70" />
                        <span className="font-medium">{project.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-3 text-primary/70" />
                        <span className="font-medium">{project.beneficiaries}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-3 text-primary/70" />
                        <span className="font-medium">{project.duration}</span>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <Link to={`/projects/${generateSlug(project.title)}`}>
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                        onClick={() => {
                          const slug = generateSlug(project.title);
                          console.log('🔗 Linking to project:', project.title, 'with slug:', slug);
                        }}
                      >
                        <span className="group-hover/btn:translate-x-1 transition-transform duration-300">
                          Learn More
                        </span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      </div>
    </>
  );
};

export default Projects;
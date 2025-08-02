import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  ExternalLink,
  Loader2,
  DollarSign,
  Handshake,
  Target,
  TrendingUp,
  Clock,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { firebaseStorage, type Project as FirebaseProject } from '@/lib/firebaseStorage';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { generateSlug } from '@/lib/utils';
import { AdvancedProjectDetailSEO } from '@/components/AdvancedSEOHead';

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<FirebaseProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        console.log('🔍 Looking for project with slug:', slug);
        
        if (!slug) {
          setError('Project slug is required');
          setLoading(false);
          return;
        }

        // Get all projects and find the one with matching slug
        const allProjects = await firebaseStorage.getAllProjects();
        console.log('📋 All projects:', allProjects.map(p => ({ title: p.title, id: p.id })));
        
        const foundProject = allProjects.find(p => {
          // Generate slug from title using the same function as other pages
          const titleSlug = generateSlug(p.title || '');
          
          console.log(`🔍 Project: "${p.title}"`);
          console.log(`   - Title slug: "${titleSlug}"`);
          console.log(`   - Looking for: "${slug}"`);
          console.log(`   - Match: ${titleSlug === slug}`);
          
          if (titleSlug === slug) {
            console.log('✅ MATCH FOUND!');
          }
          
          return titleSlug === slug;
        });

        if (foundProject) {
          console.log('✅ Found project:', foundProject);
          console.log('📝 Project data:', JSON.stringify(foundProject, null, 2));
          setProject(foundProject);
        } else {
          console.log('❌ Project not found for slug:', slug);
          console.log('🔍 Available slugs:', allProjects.map(p => ({
            title: p.title,
            slug: generateSlug(p.title || '')
          })));
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Planning':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const nextImage = () => {
    if (project?.images && project.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === project.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (project?.images && project.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? project.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground text-lg">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="text-center max-w-md mx-auto">
          <Alert variant="destructive">
            <AlertDescription>
              {error || 'Project not found'}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => navigate('/projects')} 
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdvancedProjectDetailSEO 
        project={{
          title: project.title || '',
          description: project.description || '',
          location: project.location || '',
          status: project.status || '',
          images: project.images,
          startDate: project.startDate,
          endDate: project.endDate,
          beneficiaries: project.beneficiaries || '',
          budget: project.budget,
          partners: project.partners ? [project.partners] : undefined,
          impact: '',
          category: project.categories?.[0] || ''
        }} 
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative min-h-[60vh] md:h-96 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative h-full flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 md:py-0">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/projects')}
              className="mb-6 md:mb-8 text-white hover:bg-white/20 text-sm md:text-base"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
            
            <div className="text-white">
              <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4">
                <Badge className={`${getStatusColor(project.status)} !text-white !bg-white/20 text-xs md:text-sm`}>
                  {project.status}
                </Badge>
                {project.categories && project.categories.length > 0 && (
                  <Badge variant="outline" className="border-white/30 text-white text-xs md:text-sm">
                    {project.categories[0]}
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 leading-tight">
                {project.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Project Images */}
            {project.images && project.images.length > 0 && (
              <Card className="overflow-hidden shadow-lg">
                <CardHeader className="px-4 md:px-6">
                  <CardTitle className="flex items-center text-lg md:text-xl">
                    <ImageIcon className="h-5 w-5 mr-2" />
                    Project Gallery
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={project.images[currentImageIndex]}
                      alt={`${project.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-48 sm:h-64 md:h-96 object-cover"
                    />
                    
                    {/* Image Navigation */}
                    {project.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 md:p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 md:p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
                        </button>
                        <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 bg-black/50 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                          {currentImageIndex + 1} of {project.images.length}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Thumbnail Navigation */}
                  {project.images.length > 1 && (
                    <div className="p-3 md:p-4">
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {project.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                              currentImageIndex === index 
                                ? 'border-primary' 
                                : 'border-transparent hover:border-primary/50'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-16 md:h-20 object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Project Description */}
            <Card className="shadow-lg">
              <CardHeader className="px-4 md:px-6">
                <CardTitle className="text-lg md:text-xl">About This Project</CardTitle>
              </CardHeader>
              <CardContent className="px-4 md:px-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                    {project.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Project Objectives */}
            {project.objectives && (
              <Card className="shadow-lg">
                <CardHeader className="px-4 md:px-6">
                  <CardTitle className="flex items-center text-lg md:text-xl">
                    <Target className="h-5 w-5 mr-2 text-blue-600" />
                    Project Objectives
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 md:px-6">
                  <div className="prose prose-lg max-w-none">
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {project.objectives}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Expected Outcomes */}
            {project.outcomes && (
              <Card className="shadow-lg">
                <CardHeader className="px-4 md:px-6">
                  <CardTitle className="flex items-center text-lg md:text-xl">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                    Expected Outcomes
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 md:px-6">
                  <div className="prose prose-lg max-w-none">
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {project.outcomes}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Project Details */}
            <Card className="shadow-lg">
              <CardHeader className="px-4 md:px-6">
                <CardTitle className="text-lg md:text-xl">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="px-4 md:px-6 space-y-4 md:space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">Location</p>
                    <p className="text-sm text-muted-foreground break-words">{project.location}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start">
                  <Users className="h-4 w-4 md:h-5 md:w-5 mr-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">Beneficiaries</p>
                    <p className="text-sm text-muted-foreground break-words">{project.beneficiaries}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 mr-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">Duration</p>
                    <p className="text-sm text-muted-foreground break-words">{project.duration}</p>
                  </div>
                </div>

                {project.startDate && (
                  <>
                    <Separator />
                    <div className="flex items-start">
                      <Calendar className="h-4 w-4 md:h-5 md:w-5 mr-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">Start Date</p>
                        <p className="text-sm text-muted-foreground break-words">
                          {formatDate(project.startDate)}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {project.endDate && (
                  <>
                    <Separator />
                    <div className="flex items-start">
                      <Calendar className="h-4 w-4 md:h-5 md:w-5 mr-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">End Date</p>
                        <p className="text-sm text-muted-foreground break-words">
                          {formatDate(project.endDate)}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {project.budget && (
                  <>
                    <Separator />
                    <div className="flex items-start">
                      <DollarSign className="h-4 w-4 md:h-5 md:w-5 mr-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">Budget</p>
                        <p className="text-sm text-muted-foreground break-words">{project.budget}</p>
                      </div>
                    </div>
                  </>
                )}

                {project.partners && (
                  <>
                    <Separator />
                    <div className="flex items-start">
                      <Handshake className="h-4 w-4 md:h-5 md:w-5 mr-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">Partners</p>
                        <p className="text-sm text-muted-foreground break-words">{project.partners}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Categories */}
            {project.categories && project.categories.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader className="px-4 md:px-6">
                  <CardTitle className="text-lg md:text-xl">Categories</CardTitle>
                </CardHeader>
                <CardContent className="px-4 md:px-6">
                  <div className="flex flex-wrap gap-2">
                    {project.categories.map((category, index) => (
                      <Badge key={index} variant="outline" className="text-xs md:text-sm">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}



            {/* Project Status Timeline */}
            <Card className="shadow-lg">
              <CardHeader className="px-4 md:px-6">
                <CardTitle className="text-lg md:text-xl">Project Timeline</CardTitle>
              </CardHeader>
              <CardContent className="px-4 md:px-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 ${
                      project.status === 'Completed' ? 'bg-green-500' : 
                      project.status === 'Active' ? 'bg-blue-500' : 'bg-orange-500'
                    }`}></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{project.status}</p>
                      <p className="text-xs text-muted-foreground">
                        {project.status === 'Completed' ? 'Project completed successfully' :
                         project.status === 'Active' ? 'Currently in progress' : 'In planning phase'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default ProjectDetail; 
import { useLocation } from 'react-router-dom';
import { Home, Users, Award, Calendar, Download, Mail, Settings, FileText } from 'lucide-react';

interface PageHeaderProps {
  title?: string;
  description?: string;
  showBreadcrumbs?: boolean;
}

const PageHeader = ({ title, description, showBreadcrumbs = true }: PageHeaderProps) => {
  const location = useLocation();
  
  const getPageInfo = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/':
        return {
          title: 'Home',
          description: 'Welcome to Integrated Development Association - Transforming lives through sustainable development',
          icon: Home
        };
      case '/about':
        return {
          title: 'About Us',
          description: 'Learn about our mission, vision, and the team behind our sustainable development initiatives',
          icon: Users
        };
      case '/projects':
        return {
          title: 'Our Projects',
          description: 'Explore our impactful projects in sustainable development, renewable energy, and environmental conservation',
          icon: Award
        };
      case '/news':
        return {
          title: 'News & Events',
          description: 'Stay updated with our latest activities, workshops, and contributions to sustainable development',
          icon: Calendar
        };
      case '/downloads':
        return {
          title: 'Downloads',
          description: 'Access our resources, reports, and educational materials',
          icon: Download
        };
      case '/contact':
        return {
          title: 'Contact Us',
          description: 'Get in touch with us to learn more about our work or get involved',
          icon: Mail
        };
      case '/admin':
        return {
          title: 'Admin Panel',
          description: 'Manage projects, news, and website content',
          icon: Settings
        };
      default:
        if (path.startsWith('/projects/')) {
          return {
            title: 'Project Details',
            description: 'Detailed information about this sustainable development project',
            icon: Award
          };
        }
        if (path.startsWith('/news/')) {
          return {
            title: 'Article',
            description: 'Read our latest news article or event details',
            icon: FileText
          };
        }
        return {
          title: title || 'Page',
          description: description || 'Page content',
          icon: Home
        };
    }
  };

  const pageInfo = getPageInfo();
  const IconComponent = pageInfo.icon;

  return (
    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{pageInfo.title}</h1>
            <p className="text-muted-foreground mt-1">{pageInfo.description}</p>
          </div>
        </div>
        
        {showBreadcrumbs && (
          <div className="flex items-center text-sm text-muted-foreground">
            <span>You are here:</span>
            <span className="mx-2">•</span>
            <span className="text-primary font-medium">{pageInfo.title}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader; 
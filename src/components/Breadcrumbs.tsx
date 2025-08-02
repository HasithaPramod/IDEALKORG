import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbItem {
  name: string;
  path: string;
  isCurrent?: boolean;
}

const Breadcrumbs = () => {
  const location = useLocation();
  
  // Define breadcrumb mappings for different routes
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    if (pathSegments.length === 0) {
      return [{ name: 'Home', path: '/', isCurrent: true }];
    }

    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Home', path: '/' }
    ];

    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Map segment to readable name
      let name = segment;
      switch (segment) {
        case 'about':
          name = 'About Us';
          break;
        case 'projects':
          name = 'Projects';
          break;
        case 'news':
          name = 'News & Events';
          break;
        case 'downloads':
          name = 'Downloads';
          break;
        case 'contact':
          name = 'Contact';
          break;
        case 'login':
          name = 'Login';
          break;
        case 'admin':
          name = 'Admin';
          break;
        case 'new':
          name = 'New';
          break;
        case 'edit':
          name = 'Edit';
          break;
        default:
          // For dynamic routes like project slugs, try to get a better name
          if (pathSegments[index - 1] === 'projects') {
            name = 'Project Details';
          } else if (pathSegments[index - 1] === 'news') {
            name = 'Article';
          } else {
            // Capitalize first letter and replace hyphens with spaces
            name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
          }
      }
      
      const isCurrent = index === pathSegments.length - 1;
      breadcrumbs.push({ name, path: currentPath, isCurrent });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="bg-muted/30 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <div key={item.path} className="flex items-center">
                <BreadcrumbItem>
                  {item.isCurrent ? (
                    <BreadcrumbPage className="flex items-center gap-1">
                      {index === 0 && <Home className="h-4 w-4" />}
                      {item.name}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link 
                        to={item.path}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        {index === 0 && <Home className="h-4 w-4" />}
                        {item.name}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </BreadcrumbSeparator>
                )}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default Breadcrumbs; 
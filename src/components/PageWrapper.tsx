import { useLocation } from 'react-router-dom';
import PageHeader from './PageHeader';

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  const location = useLocation();
  
  // Don't show PageHeader on the home page since it has its own hero section
  const shouldShowHeader = location.pathname !== '/';
  
  return (
    <>
      {shouldShowHeader && <PageHeader />}
      {children}
    </>
  );
};

export default PageWrapper; 
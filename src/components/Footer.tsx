import { Link } from 'react-router-dom';
import { Facebook, Linkedin, MapPin, Phone, Mail, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/logo/logo.png';

const Footer = () => {
  const { currentUser, isAdmin } = useAuth();
  
  return (
    <footer className="bg-background border-t border-border">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column - Organization Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src={logo} 
                alt="IDEA Logo" 
                className="h-12 w-12 rounded-full"
              />
              <div>
                <h3 className="text-lg font-bold text-foreground">Integrated Development Association</h3>
                <p className="text-sm text-muted-foreground">IDEA</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering communities through sustainable development initiatives and environmental conservation projects.
            </p>
            
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61578749545222" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://lk.linkedin.com/company/integrated-development-association-idea" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Middle Column - Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Quick Links</h3>
            <nav className="space-y-2">
              <Link 
                to="/" 
                className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                About Us
              </Link>
              <Link 
                to="/projects" 
                className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Projects
              </Link>
              <Link 
                to="/news" 
                className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                News & Events
              </Link>
              <Link 
                to="/downloads" 
                className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Downloads
              </Link>
              <Link 
                to="/contact" 
                className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Contact
              </Link>
            </nav>
          </div>
          
          {/* Right Column - Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  10-1/11, 3rd Lane, Galmaduwawatte Kundasale, Kandy Sri Lanka 20000
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a 
                  href="tel:+94812423396" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  +94 812 423 396
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a 
                  href="mailto:info@idea.org.lk" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  info@idea.org.lk
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Section - Copyright and Policy */}
      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2025 Integrated Development Association. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link 
                to="/privacy" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Terms of Service
              </Link>
              {currentUser && isAdmin && (
                <Link 
                  to="/admin" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1"
                >
                  <Shield className="h-3 w-3" />
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
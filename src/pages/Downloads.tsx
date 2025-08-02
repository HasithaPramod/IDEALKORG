import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Download, 
  FileText, 
  FileImage, 
  Calendar, 
  FileType, 
  Loader2,
  Search,
  ExternalLink,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdvancedDownloadsPageSEO } from '@/components/AdvancedSEOHead';

interface DownloadFile {
  id: string;
  title: string;
  description: string;
  filename: string;
  originalName: string;
  url: string;
  uploadedAt: string;
  size: number;
  type: string;
  category: string;
}



const API_BASE_URL = 'https://idealk.org/downloads/upload.php';

const Downloads = () => {
  const [files, setFiles] = useState<DownloadFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  // Fetch files from API
  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      
      if (data.success) {
        setFiles(data.files || []);
      } else {
        console.error('Failed to fetch files:', data.error);
        toast({
          title: 'Error',
          description: 'Failed to load files. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: 'Error',
        description: 'Failed to load files. Please check your connection.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);



  // Download file
  const handleDownload = (file: DownloadFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.originalName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get file type icon
  const getFileTypeIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-4 w-4" />;
    if (type.includes('image')) return <FileImage className="h-4 w-4" />;
    if (type.includes('spreadsheet') || type.includes('excel')) return <FileText className="h-4 w-4" />;
    if (type.includes('word') || type.includes('document')) return <FileText className="h-4 w-4" />;
    return <FileType className="h-4 w-4" />;
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'reports':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'guidelines':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'forms':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'presentations':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filter files
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'reports', 'guidelines', 'forms', 'presentations', 'other'];

  return (
    <>
      <AdvancedDownloadsPageSEO />
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Downloads & Resources
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Access important documents, reports, guidelines, and resources related to IDEA's sustainable development initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Search and Upload */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Available Files ({files.length})
              </h2>
              <p className="text-gray-600">
                Browse and download resources from our collection
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              

            </div>
          </div>

          {/* Files Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-gray-600">Loading files...</p>
              </div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {files.length === 0 ? 'No files available' : 'No files match your search'}
              </h3>
              <p className="text-gray-600 mb-6">
                {files.length === 0 
                  ? 'Files will appear here once they are uploaded.' 
                  : 'Try adjusting your search terms or category filter.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFiles.map((file) => (
                <Card key={file.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 overflow-hidden relative">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-3">
                      <Badge className={`text-xs font-semibold px-3 py-1 shadow-lg border-0 ${getCategoryColor(file.category)}`}>
                        {file.category}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(file.uploadedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-2">
                      {file.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed text-gray-600 line-clamp-3">
                      {file.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 pt-0">
                    {/* File Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        {getFileTypeIcon(file.type)}
                        <span className="ml-2 font-medium">{file.originalName}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <FileType className="h-3 w-3 mr-1" />
                        <span className="text-xs">{formatFileSize(file.size)}</span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 flex-1"
                        onClick={() => handleDownload(file)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(file.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Need Help Accessing Files?
          </h3>
          <p className="text-gray-600 mb-6">
            If you're having trouble downloading files or need assistance with specific documents, 
            please contact our team for support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <CheckCircle className="h-4 w-4 mr-2" />
              View Guidelines
            </Button>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Downloads; 
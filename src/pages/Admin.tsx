import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  BarChart3, 
  FileText, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  TrendingUp,
  Activity,
  Target,
  Award,
  Globe,
  Shield,
  Zap,
  Star,
  CheckCircle,
  Clock,
  DollarSign,
  Menu,
  X,
  Home,
  Newspaper,
  FolderOpen,
  UserCheck,
  Bell,
  Search,
  Filter,
  MoreHorizontal,
  ChevronRight,
  AlertCircle,
  Info,
  Mail,
  Download,
  FileImage,
  FileType,
  Upload,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { firebaseStorage, type Project, type News, type JoinApplication } from '@/lib/firebaseStorage';
import { generateSlug } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { validateFile, sanitizeInput, logSecurityEvent, SECURITY_CONFIG } from '@/lib/security';
import { AdvancedAdminPageSEO } from '@/components/AdvancedSEOHead';

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

interface UploadFormData {
  title: string;
  description: string;
  category: string;
  file: File | null;
}

// API endpoints configuration
const REMOTE_API_URL = 'https://idealk.org/downloads/upload.php';
const LOCAL_API_URL = 'http://localhost:8080/downloads/upload.php';
const CORS_PROXY_URL = 'https://cors-anywhere.herokuapp.com/https://idealk.org/downloads/upload.php';

// Use local proxy for development, direct URL for production
const API_BASE_URL = import.meta.env.DEV 
  ? '/api/downloads/upload.php'
  : REMOTE_API_URL;

const Admin = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [joinApplications, setJoinApplications] = useState<JoinApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // File management states
  const [files, setFiles] = useState<DownloadFile[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fileSearchTerm, setFileSearchTerm] = useState('');
  const [selectedFileCategory, setSelectedFileCategory] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [fileDeleteLoading, setFileDeleteLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const [uploadForm, setUploadForm] = useState<UploadFormData>({
    title: '',
    description: '',
    category: 'Other',
    file: null
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Test all API endpoints
  const testEndpoints = async () => {
    const endpoints = [
      { name: 'Vite Proxy', url: '/api/downloads/upload.php' },
      { name: 'Local Endpoint', url: LOCAL_API_URL },
      { name: 'CORS Proxy', url: CORS_PROXY_URL },
      { name: 'Remote URL', url: REMOTE_API_URL }
    ];

    console.log('Testing all endpoints...');
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Testing ${endpoint.name}: ${endpoint.url}`);
        const response = await fetch(endpoint.url, { method: 'GET' });
        console.log(`${endpoint.name} status:`, response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`${endpoint.name} success:`, data.success);
        }
      } catch (error) {
        console.error(`${endpoint.name} failed:`, error);
      }
    }
  };

  // Toggle Firebase Storage
  const toggleFirebaseStorage = () => {
    // For now, just enable it for testing
    firebaseStorage.setFirebaseStorageEnabled(true);
    toast({
      title: 'Firebase Storage',
      description: 'Firebase Storage enabled for testing',
    });
  };

  // Test Firebase Storage
  const testFirebaseStorage = async () => {
    console.log('Testing Firebase Storage...');
    
    try {
      // Create a simple test file
      const testBlob = new Blob(['test content'], { type: 'text/plain' });
      const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
      
      console.log('Test file created:', testFile.name, testFile.size, 'bytes');
      
      // Test with base64 (default)
      console.log('Testing base64 storage...');
      const result = await firebaseStorage.uploadImageWithFallback(testFile, 'test', 'test-id');
      console.log('Base64 test successful:', result.substring(0, 50) + '...');
      
      // Test with Firebase Storage enabled
      console.log('Testing Firebase Storage...');
      firebaseStorage.setFirebaseStorageEnabled(true);
      try {
        const firebaseResult = await firebaseStorage.uploadImageWithFallback(testFile, 'test', 'test-id-2');
        console.log('Firebase Storage test successful:', firebaseResult.substring(0, 50) + '...');
        toast({
          title: 'Firebase Storage Test',
          description: 'Both base64 and Firebase Storage are working!',
        });
      } catch (firebaseError) {
        console.log('Firebase Storage failed, but base64 works:', firebaseError);
        toast({
          title: 'Firebase Storage Test',
          description: 'Base64 storage works, Firebase Storage has CORS issues.',
        });
      } finally {
        firebaseStorage.setFirebaseStorageEnabled(false);
      }
    } catch (error) {
      console.error('All storage methods failed:', error);
      toast({
        title: 'Firebase Storage Test',
        description: 'All storage methods failed. Check console for details.',
        variant: 'destructive',
      });
    }
  };

  // Fetch projects from Firebase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const fetchedProjects = await firebaseStorage.getAllProjects();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Fetch news from Firebase
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setNewsLoading(true);
        const fetchedNews = await firebaseStorage.getAllNews();
        setNews(fetchedNews);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setNewsLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Fetch join applications from Firebase
  useEffect(() => {
    const fetchJoinApplications = async () => {
      try {
        setApplicationsLoading(true);
        const fetchedApplications = await firebaseStorage.getAllJoinApplications();
        setJoinApplications(fetchedApplications);
      } catch (error) {
        console.error('Error fetching join applications:', error);
      } finally {
        setApplicationsLoading(false);
      }
    };

    fetchJoinApplications();
  }, []);

  // Fetch files from API
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setFilesLoading(true);
        console.log('Fetching files from:', API_BASE_URL);
        
        const response = await fetch(API_BASE_URL);
        console.log('Fetch response status:', response.status);
        
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
        
        // Try fallback options if proxy fails
        if (import.meta.env.DEV && API_BASE_URL.startsWith('/api/')) {
          console.log('Trying fallback options for file fetch...');
          
          // Try local endpoint first
          try {
            console.log('Trying local endpoint for fetch...');
            const localResponse = await fetch(LOCAL_API_URL);
            const localData = await localResponse.json();
            
            if (localData.success) {
              setFiles(localData.files || []);
              return;
            }
          } catch (localError) {
            console.error('Local endpoint fetch failed:', localError);
          }
          
          // Try CORS proxy second
          try {
            console.log('Trying CORS proxy for fetch...');
            const corsResponse = await fetch(CORS_PROXY_URL);
            const corsData = await corsResponse.json();
            
            if (corsData.success) {
              setFiles(corsData.files || []);
              return;
            }
          } catch (corsError) {
            console.error('CORS proxy fetch failed:', corsError);
          }
          
          // Try remote URL as last resort
          try {
            console.log('Trying remote URL for fetch...');
            const remoteResponse = await fetch(REMOTE_API_URL);
            const remoteData = await remoteResponse.json();
            
            if (remoteData.success) {
              setFiles(remoteData.files || []);
              return;
            }
          } catch (remoteError) {
            console.error('Remote URL fetch also failed:', remoteError);
          }
        }
        
        toast({
          title: 'Error',
          description: 'Failed to load files. Please check your connection.',
          variant: 'destructive',
        });
      } finally {
        setFilesLoading(false);
      }
    };

    fetchFiles();
  }, [toast]);

  // Delete news article
  const handleDeleteNews = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this news article? This action cannot be undone.')) {
      try {
        setDeleteLoading(id);
        await firebaseStorage.deleteNews(id);
        setNews(news.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting news:', error);
        alert('Failed to delete news article. Please try again.');
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  // Delete project
  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        setDeleteLoading(id);
        await firebaseStorage.deleteProject(id);
        setProjects(projects.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  // Delete join application
  const handleDeleteApplication = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      try {
        setDeleteLoading(id);
        await firebaseStorage.deleteJoinApplication(id);
        setJoinApplications(joinApplications.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting application:', error);
        alert('Failed to delete application. Please try again.');
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  // Update application status
  const handleUpdateApplicationStatus = async (id: string, status: JoinApplication['status']) => {
    try {
      await firebaseStorage.updateJoinApplication(id, { status });
      setJoinApplications(joinApplications.map(app => 
        app.id === id ? { ...app, status } : app
      ));
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status. Please try again.');
    }
  };

  // File management functions
  const handleFileUpload = async () => {
    if (!uploadForm.file) {
      toast({
        title: 'Error',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
      return;
    }

    // Security validation
    const fileValidation = validateFile(uploadForm.file);
    if (!fileValidation.valid) {
      toast({
        title: 'Security Error',
        description: fileValidation.error || 'File validation failed.',
        variant: 'destructive',
      });
      logSecurityEvent('File upload validation failed', { 
        fileName: uploadForm.file.name, 
        fileType: uploadForm.file.type, 
        fileSize: uploadForm.file.size,
        error: fileValidation.error 
      }, 'medium');
      return;
    }

    // Input sanitization
    const sanitizedTitle = sanitizeInput(uploadForm.title, SECURITY_CONFIG.MAX_TITLE_LENGTH);
    const sanitizedDescription = sanitizeInput(uploadForm.description, SECURITY_CONFIG.MAX_DESCRIPTION_LENGTH);
    const sanitizedCategory = sanitizeInput(uploadForm.category, SECURITY_CONFIG.MAX_CATEGORY_LENGTH);

    if (!sanitizedTitle || !sanitizedDescription || !sanitizedCategory) {
      toast({
        title: 'Error',
        description: 'Please provide valid title, description, and category.',
        variant: 'destructive',
      });
      return;
    }

    // Prepare form data with sanitized inputs
    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('title', sanitizedTitle);
    formData.append('description', sanitizedDescription);
    formData.append('category', sanitizedCategory);

    try {
      setUploading(true);
      
      console.log('Uploading to:', API_BASE_URL);
      console.log('Development mode:', import.meta.env.DEV);

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success',
          description: 'File uploaded successfully!',
        });
        
        // Reset form and close dialog
        setUploadForm({
          title: '',
          description: '',
          category: 'Other',
          file: null
        });
        setUploadDialogOpen(false);
        
        // Refresh file list
        const refreshResponse = await fetch(API_BASE_URL);
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setFiles(refreshData.files || []);
        }
      } else {
        toast({
          title: 'Upload Failed',
          description: data.error || 'Failed to upload file.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Try fallback options if proxy fails
      if (import.meta.env.DEV && API_BASE_URL.startsWith('/api/')) {
        console.log('Trying fallback options...');
        
        // Try local endpoint first
        try {
          console.log('Trying local endpoint...');
          const localResponse = await fetch(LOCAL_API_URL, {
            method: 'POST',
            body: formData,
          });
          
          const localData = await localResponse.json();
          
          if (localData.success) {
            toast({
              title: 'Success',
              description: 'File uploaded successfully! (Used local endpoint)',
            });
            
            // Reset form and close dialog
            setUploadForm({
              title: '',
              description: '',
              category: 'Other',
              file: null
            });
            setUploadDialogOpen(false);
            
            // Refresh file list
            const refreshResponse = await fetch(API_BASE_URL);
            const refreshData = await refreshResponse.json();
            if (refreshData.success) {
              setFiles(refreshData.files || []);
            }
            return;
          }
        } catch (localError) {
          console.error('Local endpoint failed:', localError);
        }
        
        // Try CORS proxy second
        try {
          console.log('Trying CORS proxy...');
          const corsResponse = await fetch(CORS_PROXY_URL, {
            method: 'POST',
            body: formData,
          });
          
          const corsData = await corsResponse.json();
          
          if (corsData.success) {
            toast({
              title: 'Success',
              description: 'File uploaded successfully! (Used CORS proxy)',
            });
            
            // Reset form and close dialog
            setUploadForm({
              title: '',
              description: '',
              category: 'Other',
              file: null
            });
            setUploadDialogOpen(false);
            
            // Refresh file list
            const refreshResponse = await fetch(API_BASE_URL);
            const refreshData = await refreshResponse.json();
            if (refreshData.success) {
              setFiles(refreshData.files || []);
            }
            return;
          }
        } catch (corsError) {
          console.error('CORS proxy failed:', corsError);
        }
        
        // Try remote URL as last resort
        try {
          console.log('Trying remote URL...');
          const remoteResponse = await fetch(REMOTE_API_URL, {
            method: 'POST',
            body: formData,
          });
          
          const remoteData = await remoteResponse.json();
          
          if (remoteData.success) {
            toast({
              title: 'Success',
              description: 'File uploaded successfully! (Used remote URL)',
            });
            
            // Reset form and close dialog
            setUploadForm({
              title: '',
              description: '',
              category: 'Other',
              file: null
            });
            setUploadDialogOpen(false);
            
            // Refresh file list
            const refreshResponse = await fetch(API_BASE_URL);
            const refreshData = await refreshResponse.json();
            if (refreshData.success) {
              setFiles(refreshData.files || []);
            }
            return;
          }
        } catch (remoteError) {
          console.error('Remote URL also failed:', remoteError);
        }
      }
      
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return;
    }

    try {
      setFileDeleteLoading(fileId);
      
      const response = await fetch(API_BASE_URL, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: fileId }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success',
          description: 'File deleted successfully!',
        });
        
        // Remove file from state
        setFiles(files.filter(file => file.id !== fileId));
      } else {
        toast({
          title: 'Delete Failed',
          description: data.error || 'Failed to delete file.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setFileDeleteLoading(null);
    }
  };

  const handleFileDownload = (file: DownloadFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.originalName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // File utility functions
  const getFileTypeIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-4 w-4" />;
    if (type.includes('image')) return <FileImage className="h-4 w-4" />;
    if (type.includes('spreadsheet') || type.includes('excel')) return <FileText className="h-4 w-4" />;
    if (type.includes('word') || type.includes('document')) return <FileText className="h-4 w-4" />;
    return <FileType className="h-4 w-4" />;
  };

  const getFileCategoryColor = (category: string) => {
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filter files
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.title.toLowerCase().includes(fileSearchTerm.toLowerCase()) ||
                         file.description.toLowerCase().includes(fileSearchTerm.toLowerCase());
    const matchesCategory = selectedFileCategory === 'all' || file.category.toLowerCase() === selectedFileCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const fileCategories = ['all', 'reports', 'guidelines', 'forms', 'presentations', 'other'];

  const sidebarItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: Home, 
      color: 'text-blue-600',
      description: 'Overview and statistics'
    },
    { 
      id: 'news', 
      name: 'News & Events', 
      icon: Newspaper, 
      color: 'text-green-600',
      description: 'Manage articles and events',
      count: news.length
    },
    { 
      id: 'projects', 
      name: 'Projects', 
      icon: FolderOpen, 
      color: 'text-purple-600',
      description: 'Manage development projects',
      count: projects.length
    },
    { 
      id: 'applications', 
      name: 'Join Applications', 
      icon: UserCheck, 
      color: 'text-orange-600',
      description: 'Manage join applications',
      count: joinApplications.length
    },
    { 
      id: 'files', 
      name: 'File Management', 
      icon: Download, 
      color: 'text-indigo-600',
      description: 'Manage downloadable files',
      count: files.length
    },
    { 
      id: 'notifications', 
      name: 'Notifications', 
      icon: Bell, 
      color: 'text-red-600',
      description: 'System notifications'
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: Settings, 
      color: 'text-gray-600',
      description: 'Account and system settings'
    },
  ];

  const stats = [
    { 
      title: 'Total Projects', 
      value: projects.length.toString(), 
      icon: BarChart3, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      gradient: 'from-blue-500 to-blue-600',
      description: 'Active projects',
      change: '+12%',
      changeType: 'positive'
    },
    { 
      title: 'News Articles', 
      value: news.length.toString(), 
      icon: FileText, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      gradient: 'from-green-500 to-green-600',
      description: 'Published articles',
      change: '+8%',
      changeType: 'positive'
    },
    { 
      title: 'Join Applications', 
      value: joinApplications.length.toString(), 
      icon: UserCheck, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      gradient: 'from-purple-500 to-purple-600',
      description: 'Pending applications',
      change: joinApplications.filter(app => app.status === 'Pending').length.toString(),
      changeType: 'positive'
    },
    { 
      title: 'Downloadable Files', 
      value: files.length.toString(), 
      icon: Download, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      gradient: 'from-indigo-500 to-indigo-600',
      description: 'Available files',
      change: '+3',
      changeType: 'positive'
    },
    { 
      title: 'Events This Month', 
      value: '2', 
      icon: Calendar, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      gradient: 'from-orange-500 to-orange-600',
      description: 'Upcoming events',
      change: '+1',
      changeType: 'positive'
    },
  ];

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

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {currentUser?.email?.split('@')[0]}! 👋
            </h1>
            <p className="text-gray-600">
              Here's what's happening with IDEA today. You have {news.length} news articles and {projects.length} projects to manage.
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="bg-white">
              <Info className="h-4 w-4 mr-2" />
              Quick Guide
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className={`${stat.bgColor} ${stat.borderColor} border-2 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient} group-hover:scale-110 transition-transform duration-200`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <Badge className={`text-xs ${
                  stat.changeType === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {stat.change}
                </Badge>
              </div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-lg text-gray-900">
                  <Activity className="h-5 w-5 mr-2 text-blue-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Latest updates and activities
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">Dashboard accessed</p>
                  <p className="text-xs text-green-600">Just now</p>
                </div>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">Projects loaded successfully</p>
                  <p className="text-xs text-blue-600">A few seconds ago</p>
                </div>
                <BarChart3 className="h-4 w-4 text-blue-500" />
              </div>
              <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-800">News articles updated</p>
                  <p className="text-xs text-purple-600">2 minutes ago</p>
                </div>
                <FileText className="h-4 w-4 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-lg text-gray-900">
                  <Zap className="h-5 w-5 mr-2 text-purple-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Common administrative tasks
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <Link to="/admin/projects/new">
                <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12" variant="outline">
                  <Plus className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Add New Project</div>
                    <div className="text-xs opacity-90">Create a new development project</div>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
              </Link>
              <Link to="/admin/news/new">
                <Button className="w-full justify-start bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12" variant="outline">
                  <Plus className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Add News Article</div>
                    <div className="text-xs opacity-90">Publish a new article or event</div>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
              </Link>
              <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12" variant="outline">
                <Users className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Manage Team</div>
                  <div className="text-xs opacity-90">Add or edit team members</div>
                </div>
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderNews = () => (
    <div className="space-y-8">
      {/* Header with Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            News & Events Management
          </h2>
          <p className="text-gray-600">
            Manage your organization's news articles and events. You have {news.length} articles.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Link to="/admin/news/new">
            <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add News
            </Button>
          </Link>
        </div>
      </div>

      <Card className="bg-white shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-lg text-gray-900">
                <FileText className="h-5 w-5 mr-2 text-green-600" />
                All News & Events ({news.length})
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage your organization's news articles and events
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {news.filter(item => item.featured).length} Featured
              </Badge>
              <Badge variant="outline" className="text-xs">
                {news.filter(item => item.published).length} Published
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {newsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
                <p className="text-gray-600">Loading news articles...</p>
              </div>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No news articles found</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first article to share with your community.</p>
              <Link to="/admin/news/new">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Article
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {news
                .filter(item => 
                  searchTerm === '' || 
                  item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.category.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((article, index) => (
                <div 
                  key={article.id} 
                  className="flex items-center justify-between p-6 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl flex items-center justify-center border border-green-100 group-hover:scale-105 transition-transform duration-200">
                      {article.images && article.images.length > 0 ? (
                        <img 
                          src={article.images[0]} 
                          alt={article.title}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <FileText className="h-8 w-8 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-green-600 transition-colors duration-200 mb-1">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center mb-2">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(article.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${
                          article.type === 'Event' ? 'bg-green-100 text-green-800 border-green-200' :
                          article.type === 'Symposium' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          'bg-orange-100 text-orange-800 border-orange-200'
                        }`}>
                          {article.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {article.category}
                        </Badge>
                        {article.featured && (
                          <Badge className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                            Featured
                          </Badge>
                        )}
                        {article.published && (
                          <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                            Published
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all duration-200">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Link to={`/admin/news/edit/${article.id}`}>
                      <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
                      onClick={() => article.id && handleDeleteNews(article.id)}
                      disabled={deleteLoading === article.id}
                    >
                      {deleteLoading === article.id ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-1" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-8">
      {/* Header with Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Projects Management
          </h2>
          <p className="text-gray-600">
            Manage your organization's development projects. You have {projects.length} projects.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Link to="/admin/projects/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </Link>
        </div>
      </div>

      <Card className="bg-white shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-lg text-gray-900">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                All Projects ({projects.length})
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage your organization's development projects
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {projects.filter(p => p.status === 'Active').length} Active
              </Badge>
              <Badge variant="outline" className="text-xs">
                {projects.filter(p => p.status === 'Completed').length} Completed
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Loading projects...</p>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first project to showcase your work.</p>
              <Link to="/admin/projects/new">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Project
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div 
                  key={project.id} 
                  className="flex items-center justify-between p-6 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform duration-200">
                      {project.images && project.images.length > 0 ? (
                        <img 
                          src={project.images[0]} 
                          alt={project.title}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <BarChart3 className="h-8 w-8 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center mb-2">
                        <Globe className="h-3 w-3 mr-1" />
                        {project.location}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                          {project.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {project.category || project.categories?.join(', ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link to={`/projects/${generateSlug(project.title)}`}>
                      <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Link to={`/admin/projects/edit/${project.id}`}>
                      <Button variant="outline" size="sm" className="hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all duration-200">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
                      onClick={() => project.id && handleDeleteProject(project.id)}
                      disabled={deleteLoading === project.id}
                    >
                      {deleteLoading === project.id ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-1" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-8">
      {/* Header with Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Join Applications Management
          </h2>
          <p className="text-gray-600">
            Manage join applications from potential members. You have {joinApplications.length} applications.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Card className="bg-white shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-lg text-gray-900">
                <UserCheck className="h-5 w-5 mr-2 text-orange-600" />
                All Join Applications ({joinApplications.length})
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage join applications from potential members
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {joinApplications.filter(app => app.status === 'Pending').length} Pending
              </Badge>
              <Badge variant="outline" className="text-xs">
                {joinApplications.filter(app => app.status === 'Approved').length} Approved
              </Badge>
              <Badge variant="outline" className="text-xs">
                {joinApplications.filter(app => app.status === 'Contacted').length} Contacted
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {applicationsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
                <p className="text-gray-600">Loading applications...</p>
              </div>
            </div>
          ) : joinApplications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600 mb-6">Join applications will appear here when people submit them.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {joinApplications.map((application) => (
                <div 
                  key={application.id} 
                  className="flex items-center justify-between p-6 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl flex items-center justify-center border border-orange-100 group-hover:scale-105 transition-transform duration-200">
                      <UserCheck className="h-8 w-8 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-orange-600 transition-colors duration-200 mb-1">
                        {application.firstName} {application.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center mb-2">
                        <Mail className="h-3 w-3 mr-1" />
                        {application.email}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${
                          application.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          application.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                          application.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                          'bg-blue-100 text-blue-800 border-blue-200'
                        }`}>
                          {application.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {application.district}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {application.language}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all duration-200">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <select
                      value={application.status}
                      onChange={(e) => application.id && handleUpdateApplicationStatus(application.id, e.target.value as JoinApplication['status'])}
                      className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
                      onClick={() => application.id && handleDeleteApplication(application.id)}
                      disabled={deleteLoading === application.id}
                    >
                      {deleteLoading === application.id ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-1" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderFiles = () => (
    <div className="space-y-8">
      {/* Header with Search and Upload */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            File Management
          </h2>
          <p className="text-gray-600">
            Manage downloadable files and resources. You have {files.length} files available.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search files..."
              value={fileSearchTerm}
              onChange={(e) => setFileSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={selectedFileCategory} onValueChange={setSelectedFileCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fileCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={testEndpoints}
            className="mr-2"
          >
            Test Endpoints
          </Button>
          <Button 
            variant="outline" 
            onClick={testFirebaseStorage}
            className="mr-2"
          >
            Test Firebase
          </Button>
          <Button 
            variant="outline" 
            onClick={toggleFirebaseStorage}
            className="mr-2"
          >
            Enable Firebase Storage
          </Button>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg">
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Upload New File</DialogTitle>
                <DialogDescription>
                  Upload a new file to the downloads section. Maximum file size is 50MB.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    placeholder="Enter file title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    placeholder="Enter file description"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={uploadForm.category} 
                    onValueChange={(value) => setUploadForm({ ...uploadForm, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Reports">Reports</SelectItem>
                      <SelectItem value="Guidelines">Guidelines</SelectItem>
                      <SelectItem value="Forms">Forms</SelectItem>
                      <SelectItem value="Presentations">Presentations</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="file">File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.svg,.mp4,.mp3,.zip,.rar,.txt"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: PDF, Word, Excel, PowerPoint, Images, Videos, Audio, Archives, Text
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleFileUpload} 
                  disabled={uploading || !uploadForm.file}
                  className="flex-1"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setUploadDialogOpen(false)}
                  disabled={uploading}
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="bg-white shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-lg text-gray-900">
                <Download className="h-5 w-5 mr-2 text-indigo-600" />
                All Files ({files.length})
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage downloadable files and resources
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {filesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
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
              {files.length === 0 && (
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First File
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                      {getFileTypeIcon(file.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 mb-1">
                        {file.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {file.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(file.uploadedAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="flex items-center">
                          <FileType className="h-3 w-3 mr-1" />
                          {formatFileSize(file.size)}
                        </div>
                        <Badge className={`text-xs ${getFileCategoryColor(file.category)}`}>
                          {file.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleFileDownload(file)}
                      className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(file.url, '_blank')}
                      className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleFileDelete(file.id)}
                      disabled={fileDeleteLoading === file.id}
                      className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    >
                      {fileDeleteLoading === file.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'news':
        return renderNews();
      case 'projects':
        return renderProjects();
      case 'applications':
        return renderApplications();
      case 'files':
        return renderFiles();
      case 'notifications':
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Notifications</h2>
            <p className="text-gray-600 mb-6">System notifications and alerts will be displayed here.</p>
            <Button variant="outline">Coming Soon</Button>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-8 w-8 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600 mb-6">Account and system settings will be available here.</p>
            <Button variant="outline">Coming Soon</Button>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <>
      <AdvancedAdminPageSEO />
      <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">IDEA Admin</h1>
                <p className="text-xs text-gray-500">Management Portal</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`h-5 w-5 ${activeSection === item.id ? 'text-white' : item.color}`} />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className={`text-xs ${activeSection === item.id ? 'text-blue-100' : 'text-gray-500'}`}>
                      {item.description}
                    </div>
                  </div>
                </div>
                {item.count !== undefined && (
                  <Badge className={`text-xs ${
                    activeSection === item.id 
                      ? 'bg-white text-blue-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{currentUser?.email}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {sidebarItems.find(item => item.id === activeSection)?.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {sidebarItems.find(item => item.id === activeSection)?.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
              <Button variant="outline" size="sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                Help
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
      </div>
    </>
  );
};

export default Admin; 
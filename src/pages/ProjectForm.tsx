import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { ArrowLeft, Upload, Save, X, Image, Trash2, Move, Loader2, AlertCircle } from 'lucide-react';
import { firebaseStorage, type Project } from '@/lib/firebaseStorage';
import { validateImages, SavedImageInfo } from '@/lib/imageUtils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';

const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  status: z.enum(['Active', 'Completed', 'Planning']),
  location: z.string().min(2, 'Location is required'),
  beneficiaries: z.string().min(2, 'Beneficiaries information is required'),
  duration: z.string().min(2, 'Duration is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  images: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.string().optional(),
  partners: z.string().optional(),
  objectives: z.string().optional(),
  outcomes: z.string().optional(),
  // SEO fields
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  seoImage: z.string().optional(),
  seoUrl: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
}

const ProjectForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedImages, setSavedImages] = useState<SavedImageInfo[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'Planning',
      location: '',
      beneficiaries: '',
      duration: '',
      categories: [],
      images: [],
      startDate: '',
      endDate: '',
      budget: '',
      partners: '',
      objectives: '',
      outcomes: '',
      // SEO fields
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      seoImage: '',
      seoUrl: '',
    },
  });

  const categories = [
    'Energy Efficiency',
    'Climate Action',
    'Community Development',
    'Environmental Conservation',
    'Renewable Energy',
    'Sustainable Agriculture',
    'Water Management',
    'Waste Management',
    'Education & Training',
    'Research & Development'
  ];

  // Load existing project if editing
  useEffect(() => {
    if (id) {
      const loadProject = async () => {
        try {
          const project = await firebaseStorage.getProjectById(id);
          if (project) {
            setIsEditing(true);
            setExistingImages(project.images || []);
            form.reset({
              title: project.title || '',
              description: project.description || '',
              status: project.status || 'Planning',
              location: project.location || '',
              beneficiaries: project.beneficiaries || '',
              duration: project.duration || '',
              categories: project.categories || [project.category || ''],
              images: project.images || [],
              startDate: project.startDate || '',
              endDate: project.endDate || '',
              budget: project.budget || '',
              partners: project.partners || '',
              objectives: project.objectives || '',
              outcomes: project.outcomes || '',
              seoTitle: project.seoTitle || '',
              seoDescription: project.seoDescription || '',
              seoKeywords: project.seoKeywords || '',
              seoImage: project.seoImage || '',
              seoUrl: project.seoUrl || '',
            });
          }
        } catch (error) {
          console.error('Error loading project:', error);
          setError('Failed to load project data');
        }
      };
      
      loadProject();
    }
  }, [id, form]);

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    try {
      // Validate images before processing
      validateImages(Array.from(files));
      
      console.log('Files selected:', files.length, 'files');
      console.log('File names:', Array.from(files).map(f => f.name));

      const newImages: UploadedImage[] = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size
      }));

      setUploadedImages(prev => [...prev, ...newImages]);
      form.setValue('images', [...uploadedImages, ...newImages].map(img => img.name));
      setError(null); // Clear any previous errors
    } catch (error: any) {
      setError(error.message);
      console.error('Image validation error:', error);
    }
  };

  const handleFileInputClick = () => {
    console.log('File input click triggered');
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      form.setValue('images', filtered.map(img => img.name));
      return filtered;
    });
  };

  const removeExistingImage = (index: number) => {
    const newImages = [...existingImages];
    newImages.splice(index, 1);
    setExistingImages(newImages);
    form.setValue('images', newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    setUploadedImages(prev => {
      const newImages = [...prev];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      form.setValue('images', newImages.map(img => img.name));
      return newImages;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('🚀 Starting Firebase project submission...');
      
      // Upload images to Firebase Storage
      let imageUrls: string[] = [];
      
      if (uploadedImages.length > 0) {
        console.log('📸 Uploading images to Firebase Storage...');
        
        for (const image of uploadedImages) {
          try {
            // Generate a unique ID for the project (will be replaced with actual ID after save)
            const tempProjectId = `temp_${Date.now()}`;
            const imageUrl = await firebaseStorage.uploadProjectImage(image.file, tempProjectId);
            
            if (imageUrl) {
              imageUrls.push(imageUrl);
              console.log('✅ Image uploaded to Firebase:', imageUrl);
            }
          } catch (error) {
            console.error('❌ Failed to upload image:', error);
          }
        }
        
        console.log('✅ Images uploaded to Firebase:', imageUrls.length);
      }
      
      // Combine existing images with new uploaded images
      const allImages = [...existingImages, ...imageUrls];
      
      // Create the project object for Firebase
      const projectData = {
        title: data.title,
        description: data.description,
        status: data.status,
        location: data.location,
        beneficiaries: data.beneficiaries,
        duration: data.duration,
        categories: data.categories,
        category: data.categories.join(', '), // Keep for backward compatibility
        images: allImages,
        startDate: data.startDate,
        endDate: data.endDate,
        budget: data.budget,
        partners: data.partners,
        objectives: data.objectives,
        outcomes: data.outcomes,
        // SEO fields
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords,
        seoImage: data.seoImage,
        seoUrl: data.seoUrl,
      };

      console.log('📋 Project data prepared for Firebase:', projectData);

      // Save to Firebase
      try {
        let savedProject: any;
        if (isEditing) {
          savedProject = await firebaseStorage.updateProject(id!, projectData);
          console.log('✅ Project updated to Firebase successfully:', savedProject);
        } else {
          savedProject = await firebaseStorage.addProject(projectData);
          console.log('✅ Project saved to Firebase successfully:', savedProject);
        }
        
        if (savedProject) {
          console.log('🖼️ Images saved to Firebase:', savedProject.images?.length || 0);
          
          // Show success message
          alert(`Project "${data.title}" saved successfully to Firebase!\nImages uploaded: ${savedProject.images?.length || 0}`);
          
          // Navigate back to projects list
          navigate('/admin');
        } else {
          throw new Error('Failed to save project to Firebase');
        }
      } catch (firebaseError: any) {
        console.error('❌ Firebase save failed:', firebaseError);
        
        // Show error message
        alert(`Failed to save project "${data.title}" to Firebase.\nError: ${firebaseError.message}\n\nPlease check your internet connection and try again.`);
        
        // Don't navigate - let user try again
      }
    } catch (error: any) {
      console.error('❌ Error saving project:', error);
      setError(`Failed to save project: ${error.message}`);
      alert(`Error saving project: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {isEditing ? 'Edit Project' : 'Add New Project'}
              </h1>
              <p className="text-muted-foreground">
                {isEditing ? 'Update your project details' : 'Create a new project for your organization'}
              </p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Message for Saved Images */}
        {savedImages.length > 0 && (
          <Alert className="mb-6">
            <Image className="h-4 w-4" />
            <AlertDescription>
              <strong>Images saved successfully!</strong> {savedImages.length} image(s) saved to src/assets/projects/
              <br />
              <span className="text-xs text-muted-foreground">
                Files: {savedImages.map(img => img.fileName).join(', ')}
              </span>
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Essential project details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter project title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the project in detail"
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Planning">Planning</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="categories"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel className="text-base">Categories</FormLabel>
                              <FormDescription>
                                Select one or more categories that apply to this project
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {categories.map((category) => (
                                <FormField
                                  key={category}
                                  control={form.control}
                                  name="categories"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={category}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(category)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, category])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== category
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">
                                          {category}
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="Project location" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="beneficiaries"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Beneficiaries</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 500+ Families" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 2020 - Ongoing" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Additional Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Details</CardTitle>
                    <CardDescription>Optional project information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="objectives"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Objectives</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="List the main objectives of this project"
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="outcomes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Outcomes</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the expected outcomes and impact"
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., $50,000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="partners"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Partners</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Local NGOs, Government" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* SEO Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>SEO Settings</CardTitle>
                    <CardDescription>Optimize your project for search engines</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="seoTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SEO Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Project Name - Key Benefits and Location"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground">
                            Recommended: 50-60 characters. Leave empty to use project title.
                          </p>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seoDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SEO Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Brief description for search engines (150-160 characters)"
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground">
                            Recommended: 150-160 characters. Leave empty to use project description.
                          </p>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seoKeywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SEO Keywords</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., sustainable energy, rural development, Sri Lanka"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground">
                            Separate keywords with commas. Include location, category, and key terms.
                          </p>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="seoImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SEO Image URL</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., /project-image.jpg"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground">
                              Image for social media sharing. Leave empty to use first project image.
                            </p>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="seoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SEO URL Slug</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., improved-cook-stove-project"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground">
                              URL-friendly version of project title. Use hyphens, no spaces.
                            </p>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Multiple Image Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle>Project Images</CardTitle>
                    <CardDescription>Upload multiple images for your project</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Upload Area */}
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer hover:border-primary hover:bg-primary/5 ${
                          isDragOver 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted-foreground/25'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleFileInputClick}
                      >
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          {isDragOver ? 'Drop images here' : 'Click anywhere or drag and drop images here'}
                        </p>
                        <Input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageUpload(e.target.files)}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={handleFileInputClick}
                        >
                          Choose Images
                        </Button>
                      </div>

                      {/* Existing Images */}
                      {existingImages.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Existing Images ({existingImages.length})</h4>
                            <p className="text-xs text-muted-foreground">
                              Click to remove
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            {existingImages.map((imageUrl, index) => (
                              <div
                                key={index}
                                className="relative group border rounded-lg overflow-hidden"
                              >
                                <img
                                  src={imageUrl}
                                  alt={`Existing image ${index + 1}`}
                                  className="w-full h-32 object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = '/placeholder.svg';
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <div className="flex gap-2">
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => removeExistingImage(index)}
                                      className="bg-white/20 hover:bg-white/30"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                  {index + 1}
                                </div>
                                <div className="p-2 bg-background">
                                  <p className="text-xs font-medium truncate">Existing Image {index + 1}</p>
                                  <p className="text-xs text-muted-foreground">Click to remove</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* New Uploaded Images */}
                      {uploadedImages.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">New Uploaded Images ({uploadedImages.length})</h4>
                            <p className="text-xs text-muted-foreground">
                              Drag to reorder • Click to remove
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            {uploadedImages.map((image, index) => (
                              <div
                                key={image.id}
                                className="relative group border rounded-lg overflow-hidden"
                                draggable
                                onDragStart={(e) => {
                                  e.dataTransfer.setData('text/plain', index.toString());
                                }}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                                  moveImage(fromIndex, index);
                                }}
                              >
                                <img
                                  src={image.preview}
                                  alt={image.name}
                                  className="w-full h-32 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <div className="flex gap-2">
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => removeImage(image.id)}
                                      className="bg-white/20 hover:bg-white/30"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                  {existingImages.length + index + 1}
                                </div>
                                <div className="p-2 bg-background">
                                  <p className="text-xs font-medium truncate">{image.name}</p>
                                  <p className="text-xs text-muted-foreground">{formatFileSize(image.size)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Project
                        </>
                      )}
                    </Button>
                    <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/admin')}>
                      Cancel
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProjectForm; 
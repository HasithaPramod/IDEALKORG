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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { ArrowLeft, Upload, Save, X, Image, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { firebaseStorage } from '@/lib/firebaseStorage';

const newsSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['News', 'Event', 'Symposium']),
  date: z.string().min(1, 'Date is required'),
  author: z.string().min(2, 'Author is required'),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  // SEO fields
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  seoImage: z.string().optional(),
  seoUrl: z.string().optional(),
});

type NewsFormData = z.infer<typeof newsSchema>;

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
}

const NewsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const form = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      category: '',
      type: 'News',
      date: new Date().toISOString().split('T')[0],
      author: '',
      featured: false,
      published: true,
      // SEO fields
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      seoImage: '',
      seoUrl: '',
    },
  });

  const categories = [
    'Sustainable Development',
    'Renewable Energy',
    'Environmental Conservation',
    'Community Development',
    'Climate Action',
    'Education & Training',
    'Research & Innovation',
    'Partnerships',
    'Events & Workshops',
    'Success Stories'
  ];

  // Load existing news if editing
  useEffect(() => {
    if (id) {
      const loadNews = async () => {
        try {
          const news = await firebaseStorage.getNewsById(id);
          if (news) {
            setIsEditing(true);
            setExistingImages(news.images || []);
            form.reset({
              title: news.title || '',
              excerpt: news.excerpt || '',
              content: news.content || '',
              category: news.category || '',
              type: news.type || 'News',
              date: news.date || '',
              author: news.author || '',
              featured: news.featured || false,
              published: news.published || true,
              seoTitle: news.seoTitle || '',
              seoDescription: news.seoDescription || '',
              seoKeywords: news.seoKeywords || '',
              seoImage: news.seoImage || '',
              seoUrl: news.seoUrl || '',
            });
          }
        } catch (error) {
          console.error('Error loading news:', error);
          setError('Failed to load news data');
        }
      };
      loadNews();
    }
  }, [id, form]);

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newImages: UploadedImage[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }));
    
    setUploadedImages(prev => [...prev, ...newImages]);
    setError(null);
  };

  const handleFileInputClick = () => {
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
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const removeExistingImage = (index: number) => {
    const newImages = [...existingImages];
    newImages.splice(index, 1);
    setExistingImages(newImages);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onSubmit = async (data: NewsFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('🚀 Starting news submission...');
      
      // Upload images to Firebase Storage
      let imageUrls: string[] = [];
      if (uploadedImages.length > 0) {
        console.log('📸 Uploading images to Firebase Storage...');
        for (const image of uploadedImages) {
          try {
            const tempNewsId = `temp_${Date.now()}`;
            const imageUrl = await firebaseStorage.uploadNewsImage(image.file, tempNewsId);
            if (imageUrl) {
              imageUrls.push(imageUrl);
              console.log('✅ Image uploaded:', imageUrl.substring(0, 50) + '...');
            }
          } catch (error) {
            console.error('❌ Failed to upload image:', error);
          }
        }
      }
      
      // Combine existing images with new uploaded images
      const allImages = [...existingImages, ...imageUrls];
      
      // Create the news object for Firebase
      const newsData = {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        type: data.type,
        date: data.date,
        author: data.author,
        featured: data.featured,
        published: data.published,
        images: allImages,
        // SEO fields
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords,
        seoImage: data.seoImage,
        seoUrl: data.seoUrl,
      };
      
      console.log('📋 News data prepared for Firebase:', newsData);
      
      // Save to Firebase
      try {
        if (isEditing) {
          await firebaseStorage.updateNews(id!, newsData);
          console.log('✅ News updated to Firebase successfully');
        } else {
          await firebaseStorage.addNews(newsData);
          console.log('✅ News saved to Firebase successfully');
        }
        
        alert(`News "${data.title}" saved successfully!`);
        navigate('/admin');
      } catch (firebaseError: any) {
        console.error('❌ Firebase save failed:', firebaseError);
        alert(`Failed to save news "${data.title}" to Firebase.\nError: ${firebaseError.message}`);
      }
    } catch (error: any) {
      console.error('❌ Error saving news:', error);
      setError(`Failed to save news: ${error.message}`);
      alert(`Error saving news: ${error.message}`);
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
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {isEditing ? 'Edit News Article' : 'Add New News Article'}
              </h1>
              <p className="text-muted-foreground">
                {isEditing ? 'Update your news article' : 'Create a new news article for your organization'}
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Essential news article details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Article Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter article title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Brief summary of the article" 
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
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Full article content" 
                              className="min-h-[200px]" 
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
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="News">News</SelectItem>
                                <SelectItem value="Event">Event</SelectItem>
                                <SelectItem value="Symposium">Symposium</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Publication Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Author</FormLabel>
                            <FormControl>
                              <Input placeholder="Article author" {...field} />
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
                    <CardDescription>Optimize your article for search engines</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="seoTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SEO Title</FormLabel>
                          <FormControl>
                            <Input placeholder="SEO-optimized title" {...field} />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground">
                            Recommended: 50-60 characters. Leave empty to use article title.
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
                            Recommended: 150-160 characters. Leave empty to use article excerpt.
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
                            <Input placeholder="e.g., sustainable development, Sri Lanka, environment" {...field} />
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
                              <Input placeholder="e.g., /news-image.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground">
                              Image for social media sharing. Leave empty to use first article image.
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
                              <Input placeholder="e.g., sustainable-development-news" {...field} />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground">
                              URL-friendly version of article title. Use hyphens, no spaces.
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
                {/* Image Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle>Article Images</CardTitle>
                    <CardDescription>Upload images for your article</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Upload Area */}
                      <div 
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer hover:border-primary hover:bg-primary/5 ${
                          isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
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
                        <Button type="button" variant="outline" size="sm" onClick={handleFileInputClick}>
                          Choose Images
                        </Button>
                      </div>

                      {/* Existing Images */}
                      {existingImages.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium">Existing Images ({existingImages.length})</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {existingImages.map((imageUrl, index) => (
                              <div key={index} className="relative group border rounded-lg overflow-hidden">
                                <img 
                                  src={imageUrl} 
                                  alt={`Existing image ${index + 1}`} 
                                  className="w-full h-32 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
                            ))}
                          </div>
                        </div>
                      )}

                      {/* New Uploaded Images */}
                      {uploadedImages.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium">New Uploaded Images ({uploadedImages.length})</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {uploadedImages.map((image) => (
                              <div key={image.id} className="relative group border rounded-lg overflow-hidden">
                                <img 
                                  src={image.preview} 
                                  alt={image.name} 
                                  className="w-full h-32 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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

                {/* Publication Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Publication Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Featured Article</FormLabel>
                            <FormDescription>
                              Display this article prominently on the homepage
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="published"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Published</FormLabel>
                            <FormDescription>
                              Make this article visible to the public
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
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
                          {isEditing ? 'Update Article' : 'Save Article'}
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => navigate('/admin')}
                    >
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

export default NewsForm; 
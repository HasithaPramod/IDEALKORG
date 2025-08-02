export interface SavedImageInfo {
  fileName: string;
  filePath: string;
  size: number;
  type: string;
}

// Validate uploaded images
export const validateImages = (files: File[]): void => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxFiles = 10;

  if (files.length > maxFiles) {
    throw new Error(`Maximum ${maxFiles} images allowed`);
  }

  files.forEach((file, index) => {
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File ${index + 1}: Only JPEG, PNG, and WebP images are allowed`);
    }

    if (file.size > maxSize) {
      throw new Error(`File ${index + 1}: Maximum file size is 5MB`);
    }
  });
};

// Save images to assets folder (for development)
export const saveImagesToAssets = async (files: File[]): Promise<SavedImageInfo[]> => {
  const savedImages: SavedImageInfo[] = [];

  for (const file of files) {
    try {
      // In a real implementation, you would save to your server
      // For now, we'll just create a mock saved image info
      const fileName = `project_${Date.now()}_${file.name}`;
      const filePath = `/src/assets/projects/${fileName}`;
      
      savedImages.push({
        fileName,
        filePath,
        size: file.size,
        type: file.type
      });
    } catch (error) {
      console.error('Error saving image:', error);
      throw new Error(`Failed to save image: ${file.name}`);
    }
  }

  return savedImages;
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generate unique file name
export const generateFileName = (originalName: string, prefix: string = ''): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  return `${prefix}${timestamp}_${randomString}.${extension}`;
}; 
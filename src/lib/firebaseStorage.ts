import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';

export interface Project {
  id?: string;
  title: string;
  description: string;
  status: 'Active' | 'Completed' | 'Planning';
  location: string;
  beneficiaries: string;
  duration: string;
  categories: string[];
  category?: string; // For backward compatibility
  images: string[];
  startDate?: string;
  endDate?: string;
  budget?: string;
  partners?: string;
  objectives?: string;
  outcomes?: string;
  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoImage?: string;
  seoUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface News {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  type: 'News' | 'Event' | 'Symposium';
  date: string;
  author: string;
  featured?: boolean;
  published?: boolean;
  images: string[];
  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoImage?: string;
  seoUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface JoinApplication {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  district: string;
  address: string;
  language: string;
  interests: string[];
  experience?: string;
  motivation: string;
  status?: 'Pending' | 'Approved' | 'Rejected' | 'Contacted';
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
}

class FirebaseStorage {
  private projectsCollection = collection(db, 'projects');
  private newsCollection = collection(db, 'news');
  private joinApplicationsCollection = collection(db, 'joinApplications');
  
  // Configuration
  private useFirebaseStorage = false; // Set to false to avoid CORS issues
  
  // Method to enable/disable Firebase Storage
  setFirebaseStorageEnabled(enabled: boolean) {
    this.useFirebaseStorage = enabled;
    console.log('Firebase Storage enabled:', enabled);
  }

  constructor() {
    console.log('FirebaseStorage initialized');
    console.log('Projects collection:', this.projectsCollection);
    console.log('News collection:', this.newsCollection);
    console.log('Join applications collection:', this.joinApplicationsCollection);
  }

  // Add a new project
  async addProject(projectData: Omit<Project, 'id'>): Promise<Project> {
    try {
      const docRef = await addDoc(this.projectsCollection, {
        ...projectData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return {
        id: docRef.id,
        ...projectData
      };
    } catch (error) {
      console.error('Error adding project:', error);
      throw new Error('Failed to add project');
    }
  }

  // Update an existing project
  async updateProject(id: string, projectData: Partial<Project>): Promise<Project> {
    try {
      const projectRef = doc(db, 'projects', id);
      await updateDoc(projectRef, {
        ...projectData,
        updatedAt: serverTimestamp()
      });
      
      return {
        id,
        ...projectData
      } as Project;
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error('Failed to update project');
    }
  }

  // Get a project by ID
  async getProjectById(id: string): Promise<Project | null> {
    try {
      const projectRef = doc(db, 'projects', id);
      const projectSnap = await getDoc(projectRef);
      
      if (projectSnap.exists()) {
        return {
          id: projectSnap.id,
          ...projectSnap.data()
        } as Project;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting project:', error);
      throw new Error('Failed to get project');
    }
  }

  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    try {
      const q = query(this.projectsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
    } catch (error) {
      console.error('Error getting projects:', error);
      throw new Error('Failed to get projects');
    }
  }

  // Delete a project
  async deleteProject(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new Error('Failed to delete project');
    }
  }

  // Upload project image
  async uploadProjectImage(file: File, projectId: string): Promise<string> {
    return this.uploadImageWithFallback(file, 'projects', projectId);
  }

  // Delete project image
  async deleteProjectImage(imageUrl: string): Promise<void> {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }

  // Convert image to base64 (for CORS bypass)
  async imageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Compress image before converting to base64
  async compressImage(file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          quality
        );
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  // Utility function to handle image upload with fallback
  async uploadImageWithFallback(file: File, folder: string, id: string): Promise<string> {
    try {
      console.log(`Processing image for ${folder}/${id}`);
      console.log('Original file size:', file.size, 'bytes');
      console.log('File type:', file.type);
      console.log('Firebase Storage enabled:', this.useFirebaseStorage);
      
      // Try Firebase Storage first if enabled
      if (this.useFirebaseStorage) {
        try {
          const timestamp = Date.now();
          const sanitizedName = file.name
            .replace(/[^a-zA-Z0-9.-]/g, '_')
            .replace(/_{2,}/g, '_')
            .replace(/^_|_$/g, '');
          
          const fileName = `${id}_${timestamp}_${sanitizedName}`;
          const storageRef = ref(storage, `${folder}/${fileName}`);
          
          console.log(`Uploading to Firebase Storage: ${folder}/${fileName}`);
          
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
          
          console.log('Firebase Storage upload successful:', downloadURL);
          return downloadURL;
        } catch (firebaseError) {
          console.error('Firebase Storage failed, falling back to base64:', firebaseError);
        }
      }
      
      // Fallback to base64 (default behavior)
      console.log('Using base64 storage...');
      
      // Compress image if it's an image file
      let processedFile = file;
      if (file.type.startsWith('image/')) {
        try {
          console.log('Compressing image...');
          processedFile = await this.compressImage(file);
          console.log('Compressed file size:', processedFile.size, 'bytes');
        } catch (compressError) {
          console.warn('Image compression failed, using original file:', compressError);
        }
      }
      
      const base64Data = await this.imageToBase64(processedFile);
      console.log('Image converted to base64 successfully');
      
      // Check if base64 data is too large (Firestore has 1MB limit per field)
      const base64Size = base64Data.length * 0.75; // Approximate size in bytes
      if (base64Size > 800000) { // 800KB limit to be safe
        console.warn('Base64 data is large:', Math.round(base64Size / 1024), 'KB');
        console.warn('Consider using smaller images or enabling Firebase Storage CORS');
      }
      
      return base64Data;
    } catch (error) {
      console.error('Image processing failed:', error);
      throw new Error(`Failed to process image for ${folder}. Please try again or contact support.`);
    }
  }

  // News Management Methods
  async addNews(newsData: Omit<News, 'id'>): Promise<News> {
    try {
      const docRef = await addDoc(this.newsCollection, {
        ...newsData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return {
        id: docRef.id,
        ...newsData
      };
    } catch (error) {
      console.error('Error adding news:', error);
      throw new Error('Failed to add news');
    }
  }

  async updateNews(id: string, newsData: Partial<News>): Promise<News> {
    try {
      const newsRef = doc(db, 'news', id);
      await updateDoc(newsRef, {
        ...newsData,
        updatedAt: serverTimestamp()
      });
      
      return {
        id,
        ...newsData
      } as News;
    } catch (error) {
      console.error('Error updating news:', error);
      throw new Error('Failed to update news');
    }
  }

  async getNewsById(id: string): Promise<News | null> {
    try {
      const newsRef = doc(db, 'news', id);
      const newsSnap = await getDoc(newsRef);
      
      if (newsSnap.exists()) {
        return {
          id: newsSnap.id,
          ...newsSnap.data()
        } as News;
      }
      return null;
    } catch (error) {
      console.error('Error getting news by ID:', error);
      throw new Error('Failed to get news');
    }
  }

  async getAllNews(): Promise<News[]> {
    try {
      const q = query(this.newsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as News[];
    } catch (error) {
      console.error('Error getting all news:', error);
      throw new Error('Failed to get news');
    }
  }

  async deleteNews(id: string): Promise<void> {
    try {
      const newsRef = doc(db, 'news', id);
      await deleteDoc(newsRef);
    } catch (error) {
      console.error('Error deleting news:', error);
      throw new Error('Failed to delete news');
    }
  }

  async uploadNewsImage(file: File, newsId: string): Promise<string> {
    return this.uploadImageWithFallback(file, 'news', newsId);
  }

  // Join Application Management Methods
  async addJoinApplication(applicationData: Omit<JoinApplication, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<JoinApplication> {
    try {
      console.log('=== FIREBASE ADD JOIN APPLICATION START ===');
      console.log('Input applicationData:', applicationData);
      console.log('Collection reference:', this.joinApplicationsCollection);
      
      // Test if we can read from the collection first
      try {
        console.log('Testing collection access...');
        const testQuery = query(this.joinApplicationsCollection, orderBy('createdAt', 'desc'));
        const testSnapshot = await getDocs(testQuery);
        console.log('Collection read test successful, found', testSnapshot.docs.length, 'documents');
      } catch (readError) {
        console.error('Collection read test failed:', readError);
      }
      
      const dataToSave = {
        ...applicationData,
        status: 'Pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      console.log('Data to save to Firebase:', dataToSave);
      console.log('About to call addDoc...');
      
      const docRef = await addDoc(this.joinApplicationsCollection, dataToSave);
      
      console.log('Document reference:', docRef);
      console.log('Document ID:', docRef.id);
      
      const result: JoinApplication = {
        id: docRef.id,
        ...applicationData,
        status: 'Pending'
      };
      
      console.log('Returning result:', result);
      console.log('=== FIREBASE ADD JOIN APPLICATION SUCCESS ===');
      
      return result;
    } catch (error) {
      console.error('=== FIREBASE ADD JOIN APPLICATION ERROR ===');
      console.error('Error adding join application:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      throw new Error('Failed to submit application');
    }
  }

  async updateJoinApplication(id: string, applicationData: Partial<JoinApplication>): Promise<JoinApplication> {
    try {
      const applicationRef = doc(db, 'joinApplications', id);
      await updateDoc(applicationRef, {
        ...applicationData,
        updatedAt: serverTimestamp()
      });
      
      return {
        id,
        ...applicationData
      } as JoinApplication;
    } catch (error) {
      console.error('Error updating join application:', error);
      throw new Error('Failed to update application');
    }
  }

  async getJoinApplicationById(id: string): Promise<JoinApplication | null> {
    try {
      const applicationRef = doc(db, 'joinApplications', id);
      const applicationSnap = await getDoc(applicationRef);
      
      if (applicationSnap.exists()) {
        return {
          id: applicationSnap.id,
          ...applicationSnap.data()
        } as JoinApplication;
      }
      return null;
    } catch (error) {
      console.error('Error getting join application by ID:', error);
      throw new Error('Failed to get application');
    }
  }

  async getAllJoinApplications(): Promise<JoinApplication[]> {
    try {
      const q = query(this.joinApplicationsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JoinApplication[];
    } catch (error) {
      console.error('Error getting all join applications:', error);
      throw new Error('Failed to get applications');
    }
  }

  async deleteJoinApplication(id: string): Promise<void> {
    try {
      const applicationRef = doc(db, 'joinApplications', id);
      await deleteDoc(applicationRef);
    } catch (error) {
      console.error('Error deleting join application:', error);
      throw new Error('Failed to delete application');
    }
  }
}

export const firebaseStorage = new FirebaseStorage(); 
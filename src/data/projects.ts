import { firebaseStorage } from '@/lib/firebaseStorage';
import type { Project as FirebaseProject } from '@/lib/firebaseStorage';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  status: 'Active' | 'Completed' | 'Planning';
  location: string;
  beneficiaries: string;
  duration: string;
  category: string;
  featured?: boolean;
}

// Convert Firebase project to local project format
const convertFirebaseProject = (firebaseProject: FirebaseProject): Project => {
  return {
    id: firebaseProject.id || '',
    title: firebaseProject.title,
    description: firebaseProject.description,
    image: firebaseProject.images?.[0] || '/placeholder-project.jpg',
    status: firebaseProject.status,
    location: firebaseProject.location,
    beneficiaries: firebaseProject.beneficiaries,
    duration: firebaseProject.duration,
    category: firebaseProject.category || firebaseProject.categories?.join(', ') || '',
    featured: true // You can add a featured field to your Firebase projects if needed
  };
};

// Function to get featured projects (latest 3)
export const getFeaturedProjects = async (): Promise<Project[]> => {
  try {
    const firebaseProjects = await firebaseStorage.getAllProjects();
    return firebaseProjects
      .slice(0, 3)
      .map(convertFirebaseProject);
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
};

// Function to get all projects
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const firebaseProjects = await firebaseStorage.getAllProjects();
    return firebaseProjects.map(convertFirebaseProject);
  } catch (error) {
    console.error('Error fetching all projects:', error);
    return [];
  }
};

// Function to truncate text to 100 characters
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}; 
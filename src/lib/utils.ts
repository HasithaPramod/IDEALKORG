import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate SEO-friendly slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Generate unique slug from title and ID to avoid conflicts
export function generateUniqueSlug(title: string, id: string): string {
  const baseSlug = generateSlug(title);
  const shortId = id.substring(0, 8); // Use first 8 characters of ID
  return `${baseSlug}-${shortId}`;
}

// Generate the best slug for linking (checks for conflicts)
export function generateBestSlug(title: string, id: string, existingSlugs: string[] = []): string {
  const baseSlug = generateSlug(title);
  
  // If no conflicts, use the base slug
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }
  
  // If there are conflicts, use unique slug
  return generateUniqueSlug(title, id);
}

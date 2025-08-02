export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  type: 'Event' | 'News' | 'Workshop' | 'Symposium' | 'Field Work' | 'Training' | 'Site Visit';
  featured?: boolean;
}

export const newsItems: NewsItem[] = [
  // Sample news and events have been removed
];

// Function to get featured news (latest 3)
export const getFeaturedNews = (): NewsItem[] => {
  return newsItems.filter(item => item.featured).slice(0, 3);
};

// Function to get all news
export const getAllNews = (): NewsItem[] => {
  return newsItems;
};

// Function to truncate text to 100 characters
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}; 
import type { Category } from '../../domain/entities/Category';
import { MovieCategory } from '../../domain/entities/Category';

/**
 * Utility functions for handling movie categories and genres
 */

export const CATEGORY_LABELS: Record<MovieCategory, string> = {
  [MovieCategory.POPULAR]: 'Popular',
  [MovieCategory.TOP_RATED]: 'Top Rated',
  [MovieCategory.UPCOMING]: 'Upcoming',
  [MovieCategory.NOW_PLAYING]: 'Now Playing',
};

export const CATEGORY_DESCRIPTIONS: Record<MovieCategory, string> = {
  [MovieCategory.POPULAR]: 'Most popular movies trending now',
  [MovieCategory.TOP_RATED]: 'Highest rated movies of all time',
  [MovieCategory.UPCOMING]: 'Coming soon to theaters',
  [MovieCategory.NOW_PLAYING]: 'Currently playing in theaters',
};

/**
 * Get human-readable label for a movie category
 */
export const getCategoryLabel = (category: MovieCategory): string => {
  return CATEGORY_LABELS[category] || category;
};

/**
 * Get description for a movie category
 */
export const getCategoryDescription = (category: MovieCategory): string => {
  return CATEGORY_DESCRIPTIONS[category] || '';
};

/**
 * Get all available movie categories
 */
export const getAllCategories = (): MovieCategory[] => {
  return Object.values(MovieCategory);
};

/**
 * Get category with label and description
 */
export const getCategoryInfo = (category: MovieCategory) => {
  return {
    value: category,
    label: getCategoryLabel(category),
    description: getCategoryDescription(category),
  };
};

/**
 * Get all categories with their info
 */
export const getAllCategoriesInfo = () => {
  return getAllCategories().map(category => getCategoryInfo(category));
};

/**
 * Find genre by ID from a list of genres
 */
export const findGenreById = (genres: Category[], genreId: number): Category | undefined => {
  return genres.find(genre => genre.id === genreId);
};

/**
 * Get genre names from a list of genre IDs
 */
export const getGenreNames = (genres: Category[], genreIds: number[]): string[] => {
  return genreIds
    .map(id => findGenreById(genres, id)?.name)
    .filter((name): name is string => Boolean(name));
};

/**
 * Format genre names as a comma-separated string
 */
export const formatGenreNames = (genres: Category[], genreIds: number[]): string => {
  const names = getGenreNames(genres, genreIds);
  return names.join(', ') || 'Unknown';
};

/**
 * Check if a category is valid
 */
export const isValidCategory = (category: string): category is MovieCategory => {
  return Object.values(MovieCategory).includes(category as MovieCategory);
};

/**
 * Get category from string with validation
 */
export const getCategoryFromString = (category: string): MovieCategory | null => {
  return isValidCategory(category) ? category : null;
};

/**
 * Sort genres alphabetically
 */
export const sortGenresAlphabetically = (genres: Category[]): Category[] => {
  return [...genres].sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Group genres by first letter
 */
export const groupGenresByLetter = (genres: Category[]): Record<string, Category[]> => {
  return genres.reduce((acc, genre) => {
    const firstLetter = genre.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(genre);
    return acc;
  }, {} as Record<string, Category[]>);
};

/**
 * Search genres by name
 */
export const searchGenres = (genres: Category[], query: string): Category[] => {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return genres;

  return genres.filter(genre =>
    genre.name.toLowerCase().includes(normalizedQuery)
  );
};

/**
 * Get popular genres (you might want to define this based on your app's logic)
 */
export const getPopularGenres = (genres: Category[]): Category[] => {
  // This is a sample implementation - you might want to track popularity differently
  const popularGenreIds = [28, 12, 16, 35, 80, 18, 14, 27, 878, 53]; // Action, Adventure, Animation, Comedy, Crime, Drama, Fantasy, Horror, Sci-Fi, Thriller

  return popularGenreIds
    .map(id => findGenreById(genres, id))
    .filter((genre): genre is Category => Boolean(genre));
};
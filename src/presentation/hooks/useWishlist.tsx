import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Movie } from "../../domain/entities/Movie";

interface WishlistContextType {
  wishlist: Movie[]
  addToWishlist: (movie: Movie) => void
  removeFromWishlist: (movieId: number) => void
  toggleWishlist: (movie: Movie) => void
  isInWishlist: (movieId: number) => boolean
  clearWishlist: () => void
  wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: ReactNode
}

const WISHLIST_STORAGE_KEY = "moviehub-wishlist";
const isBrowser = typeof window !== "undefined";

const readStoredWishlist = (): Movie[] => {
  if (!isBrowser) {
    return [];
  }

  try {
    const savedWishlist = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (savedWishlist) {
      return JSON.parse(savedWishlist) as Movie[];
    }
  } catch (error) {
    console.error("Error loading wishlist from localStorage:", error);
  }

  return [];
};

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const [wishlist, setWishlist] = useState<Movie[]>(() => readStoredWishlist());

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    try {
      const savedWishlist = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist) as Movie[];
        setWishlist(parsedWishlist);
      }
    } catch (error) {
      console.error("Error loading wishlist from localStorage:", error);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error("Error saving wishlist to localStorage:", error);
    }
  }, [wishlist]);

  const addToWishlist = (movie: Movie) => {
    setWishlist(prev => {
      // Check if movie is already in wishlist
      if (prev.find(item => item.id === movie.id)) {
        return prev;
      }

      const newWishlist = [...prev, movie];
      console.log(`Added "${movie.title}" to wishlist`);
      return newWishlist;
    });
  };

  const removeFromWishlist = (movieId: number) => {
    setWishlist(prev => {
      const movieToRemove = prev.find(item => item.id === movieId);
      if (movieToRemove) {
        console.log(`Removed "${movieToRemove.title}" from wishlist`);
      }
      return prev.filter(item => item.id !== movieId);
    });
  };

  const toggleWishlist = (movie: Movie) => {
    if (isInWishlist(movie.id)) {
      removeFromWishlist(movie.id);
    } else {
      addToWishlist(movie);
    }
  };

  const isInWishlist = (movieId: number): boolean => {
    return wishlist.some(item => item.id === movieId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    console.log("Cleared wishlist");
  };

  const value: WishlistContextType = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlist.length,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

// Hook for individual movie wishlist status
export const useMovieWishlist = (movie: Movie) => {
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isWishlisted = isInWishlist(movie.id);

  const toggle = () => {
    toggleWishlist(movie);
  };

  return {
    isWishlisted,
    toggle,
  };
};

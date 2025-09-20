import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Movie } from "../../domain/entities/Movie";

export interface WishlistItem {
  id: number;
  movie: Movie;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;
}

interface WishlistActions {
  addToWishlist: (movie: Movie) => void;
  removeFromWishlist: (movieId: number) => void;
  clearWishlist: () => void;
  isInWishlist: (movieId: number) => boolean;
  getWishlistCount: () => number;
  toggleWishlist: (movie: Movie) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type WishlistStore = WishlistState & WishlistActions;

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addToWishlist: (movie: Movie) => {
        const { items } = get();

        // Check if movie is already in wishlist
        if (items.some(item => item.id === movie.id)) {
          console.warn(`Movie "${movie.title}" is already in wishlist`);
          return;
        }

        const newItem: WishlistItem = {
          id: movie.id,
          movie,
          addedAt: new Date().toISOString(),
        };

        set({
          items: [newItem, ...items],
          error: null,
        });

        console.log(`Added "${movie.title}" to wishlist`);
      },

      removeFromWishlist: (movieId: number) => {
        const { items } = get();
        const movieToRemove = items.find(item => item.id === movieId);

        if (!movieToRemove) {
          console.warn(`Movie with ID ${movieId} not found in wishlist`);
          return;
        }

        set({
          items: items.filter(item => item.id !== movieId),
          error: null,
        });

        console.log(`Removed "${movieToRemove.movie.title}" from wishlist`);
      },

      clearWishlist: () => {
        set({
          items: [],
          error: null,
        });
        console.log("Wishlist cleared");
      },

      isInWishlist: (movieId: number) => {
        const { items } = get();
        return items.some(item => item.id === movieId);
      },

      getWishlistCount: () => {
        const { items } = get();
        return items.length;
      },

      toggleWishlist: (movie: Movie) => {
        const { isInWishlist, addToWishlist, removeFromWishlist } = get();

        if (isInWishlist(movie.id)) {
          removeFromWishlist(movie.id);
        } else {
          addToWishlist(movie);
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: "theresa-wishlist-storage",
      partialize: (state) => ({
        items: state.items,
      }),
    },
  ),
);

// Selectors for better performance
export const useWishlistItems = () => useWishlistStore(state => state.items);
export const useWishlistCount = () => useWishlistStore(state => state.getWishlistCount());
export const useIsInWishlist = (movieId: number) => useWishlistStore(state => state.isInWishlist(movieId));
export const useWishlistActions = () => useWishlistStore(state => ({
  addToWishlist: state.addToWishlist,
  removeFromWishlist: state.removeFromWishlist,
  clearWishlist: state.clearWishlist,
  toggleWishlist: state.toggleWishlist,
}));

export default useWishlistStore;

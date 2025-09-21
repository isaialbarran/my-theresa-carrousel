import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Movie } from "../../domain/entities/Movie";

interface AppState {
  wishlist: Movie[];
}

interface AppActions {
  toggleWishlist: (movie: Movie) => void;
  clearWishlist: () => void;
}

type AppStore = AppState & AppActions;

const createNoopStorage = (): Storage => ({
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
  clear: () => undefined,
  key: () => null,
  length: 0,
}) as Storage;

const getStorage = () => {
  if (typeof window === "undefined") {
    return createNoopStorage();
  }
  return window.localStorage;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      wishlist: [],

      toggleWishlist: (movie: Movie) => {
        const { wishlist } = get();
        const isInWishlist = wishlist.some(item => item.id === movie.id);

        set({
          wishlist: isInWishlist
            ? wishlist.filter(item => item.id !== movie.id)
            : [...wishlist, movie],
        });
      },

      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: "theresa-app",
      storage: createJSONStorage(getStorage),
    },
  ),
);

export const useWishlist = () => useAppStore((state) => state.wishlist);
export const useWishlistActions = () => ({
  toggleWishlist: useAppStore((state) => state.toggleWishlist),
  clearWishlist: useAppStore((state) => state.clearWishlist),
});

export const useWishlistCount = () => useAppStore((state) => state.wishlist.length);
export const useIsInWishlist = (movieId: number) =>
  useAppStore((state) => state.wishlist.some(item => item.id === movieId));

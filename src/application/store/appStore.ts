import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Movie } from "../../domain/entities/Movie";

export type ThemeMode = "light" | "dark" | "auto";
export type ActualTheme = "light" | "dark";
export type Route = "/" | "/wishlist";

interface AppState {
  // Theme state
  theme: {
    mode: ThemeMode;
    actual: ActualTheme;
  };

  // Wishlist state
  wishlist: Movie[];

  // Router state
  currentRoute: Route;
}

interface AppActions {
  // Theme actions
  setTheme: (mode: ThemeMode) => void;
  setActualTheme: (theme: ActualTheme) => void;
  toggleTheme: () => void;

  // Wishlist actions
  addToWishlist: (movie: Movie) => void;
  removeFromWishlist: (movieId: number) => void;
  toggleWishlist: (movie: Movie) => void;
  clearWishlist: () => void;

  // Router actions
  navigate: (route: Route) => void;
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
    (set, get) => {
      // Create stable action functions
      const setTheme = (mode: ThemeMode) =>
        set((state) => ({
          theme: { ...state.theme, mode }
        }));

      const setActualTheme = (actual: ActualTheme) =>
        set((state) => ({
          theme: { ...state.theme, actual }
        }));

      const toggleTheme = () =>
        set((state) => ({
          theme: {
            ...state.theme,
            mode: state.theme.mode === "light"
              ? "dark"
              : state.theme.mode === "dark"
              ? "auto"
              : "light",
          },
        }));

      const addToWishlist = (movie: Movie) => {
        const current = get().wishlist;
        if (current.some(item => item.id === movie.id)) {
          return;
        }
        set({ wishlist: [...current, movie] });
      };

      const removeFromWishlist = (movieId: number) => {
        const current = get().wishlist;
        set({ wishlist: current.filter(item => item.id !== movieId) });
      };

      const clearWishlist = () => set({ wishlist: [] });

      const toggleWishlist = (movie: Movie) => {
        const { wishlist } = get();
        if (wishlist.some(item => item.id === movie.id)) {
          removeFromWishlist(movie.id);
        } else {
          addToWishlist(movie);
        }
      };

      const navigate = (route: Route) => {
        set({ currentRoute: route });
        if (typeof window !== "undefined") {
          window.history.pushState(null, "", route);
        }
      };

      return {
        // Initial state
        theme: {
          mode: "auto",
          actual: "light",
        },
        wishlist: [],
        currentRoute: "/",

        // Actions
        setTheme,
        setActualTheme,
        toggleTheme,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        navigate,
      };
    },
    {
      name: "theresa-app",
      storage: createJSONStorage(getStorage),
      partialize: (state) => ({
        theme: { mode: state.theme.mode },
        wishlist: state.wishlist,
      }),
    }
  )
);

// Convenience selectors
export const useTheme = () => useAppStore((state) => state.theme);
export const useThemeActions = () => {
  const setTheme = useAppStore((state) => state.setTheme);
  const setActualTheme = useAppStore((state) => state.setActualTheme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  return { setTheme, setActualTheme, toggleTheme };
};

export const useWishlist = () => useAppStore((state) => state.wishlist);
export const useWishlistActions = () => {
  const addToWishlist = useAppStore((state) => state.addToWishlist);
  const removeFromWishlist = useAppStore((state) => state.removeFromWishlist);
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);
  const clearWishlist = useAppStore((state) => state.clearWishlist);
  return { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist };
};

export const useRouter = () => {
  const currentRoute = useAppStore((state) => state.currentRoute);
  const navigate = useAppStore((state) => state.navigate);
  return { currentRoute, navigate };
};

// Specific selectors for performance
export const useWishlistCount = () => useAppStore((state) => state.wishlist.length);
export const useIsInWishlist = (movieId: number) =>
  useAppStore((state) => state.wishlist.some(item => item.id === movieId));

// Route resolver utility
export const resolveRoute = (path: string): Route => {
  const normalized = path.split("?")[0] ?? "/";
  if (normalized.startsWith("/wishlist")) {
    return "/wishlist";
  }
  return "/";
};
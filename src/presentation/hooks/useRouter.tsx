import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export type Route = "/" | "/wishlist";

export const resolveRoute = (path: string): Route => {
  const normalized = path.split("?")[0] ?? "/";

  if (normalized.startsWith("/wishlist")) {
    return "/wishlist";
  }
  return "/";
};

interface RouterContextType {
  currentRoute: Route;
  navigate: (route: Route) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

interface RouterProviderProps {
  children: ReactNode;
  initialRoute?: Route;
}

export const RouterProvider = ({
  children,
  initialRoute = "/",
}: RouterProviderProps) => {
  const [currentRoute, setCurrentRoute] = useState<Route>(initialRoute);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Initialize route from URL
    const path = resolveRoute(window.location.pathname);
    setCurrentRoute(path);

    // Listen to popstate events (back/forward browser navigation)
    const handlePopState = () => {
      const nextRoute = resolveRoute(window.location.pathname);
      setCurrentRoute(nextRoute);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (route: Route) => {
    if (route !== currentRoute) {
      setCurrentRoute(route);
      if (typeof window !== "undefined") {
        window.history.pushState(null, "", route);
      }
    }
  };

  return (
    <RouterContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (context === undefined) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
};

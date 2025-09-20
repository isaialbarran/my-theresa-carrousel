import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { resolveRoutePath, type AppRoute } from "../routing/routes";

interface RouterContextType {
  currentRoute: AppRoute;
  navigate: (route: AppRoute) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

interface RouterProviderProps {
  children: ReactNode;
  initialRoute?: AppRoute;
}

export const RouterProvider = ({
  children,
  initialRoute = "/",
}: RouterProviderProps) => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(initialRoute);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Initialize route from URL
    const path = resolveRoutePath(window.location.pathname);
    setCurrentRoute(path);

    // Listen to popstate events (back/forward browser navigation)
    const handlePopState = () => {
      const nextRoute = resolveRoutePath(window.location.pathname);
      setCurrentRoute(nextRoute);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (route: AppRoute) => {
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

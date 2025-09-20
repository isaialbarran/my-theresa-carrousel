import { useEffect, useRef } from "react";
import HomePage from "./presentation/pages/HomePage";
import WishlistPage from "./presentation/pages/WishlistPage";
import { useAppStore, resolveRoute, type Route } from "./application/store/appStore";
import "./styles/globals.scss";
import "./App.css";

const AppRouter = () => {
  const currentRoute = useAppStore(state => state.currentRoute);

  switch (currentRoute) {
    case "/wishlist":
      return <WishlistPage />;
    case "/":
    default:
      return <HomePage />;
  }
};

interface AppProps {
  initialRoute?: Route;
}

function App({ initialRoute }: AppProps) {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;

    const navigate = useAppStore.getState().navigate;

    if (initialRoute && initialRoute !== "/") {
      navigate(initialRoute);
    } else if (typeof window !== "undefined") {
      const currentPath = resolveRoute(window.location.pathname);
      navigate(currentPath);
    }

    hasInitialized.current = true;
  }, [initialRoute]);

  return <AppRouter />;
}

export default App;

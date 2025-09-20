import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import type { AppRoute } from "./presentation/routing/routes";
import HomePage from "./presentation/pages/HomePage";
import WishlistPage from "./presentation/pages/WishlistPage";
import MovieDetailPage from "./presentation/pages/MovieDetailPage";
import "./styles/globals.scss";

interface AppProps {
  initialRoute?: AppRoute;
}

function App({ initialRoute }: AppProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    // Handle initial route from SSR only on first load
    if (
      initialRoute &&
      initialRoute !== location.pathname &&
      typeof window !== "undefined" &&
      !hasNavigatedRef.current
    ) {
      hasNavigatedRef.current = true;
      navigate(initialRoute, { replace: true });
    }
  }, [initialRoute, location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/movie/:id" element={<MovieDetailPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default App;

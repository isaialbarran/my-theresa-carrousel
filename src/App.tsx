import HomePage from "./presentation/pages/HomePage";
// import MovieDetailPage from "./presentation/pages/MovieDetailPage";
import { ThemeProvider } from "./presentation/hooks/useTheme";
import { WishlistProvider } from "./presentation/hooks/useWishlist";
import "./styles/globals.scss";
import "./App.css";

function App() {
  // For now showing both pages - will implement routing later
  return (
    <ThemeProvider defaultTheme="auto">
      <WishlistProvider>
        <HomePage />
        {/* <MovieDetailPage /> */}
      </WishlistProvider>
    </ThemeProvider>
  );
}

export default App;

import HomePage from "./presentation/pages/HomePage";
import WishlistPage from "./presentation/pages/WishlistPage";
import { ThemeProvider } from "./presentation/hooks/useTheme";
import { WishlistProvider } from "./presentation/hooks/useWishlist";
import { RouterProvider, useRouter, type Route } from "./presentation/hooks/useRouter";
import "./styles/globals.scss";
import "./App.css";

const AppRouter = () => {
  const { currentRoute } = useRouter();

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
  return (
    <ThemeProvider defaultTheme="auto">
      <WishlistProvider>
        <RouterProvider initialRoute={initialRoute}>
          <AppRouter />
        </RouterProvider>
      </WishlistProvider>
    </ThemeProvider>
  );
}

export default App;

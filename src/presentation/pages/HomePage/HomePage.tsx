import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout/PageLayout";
import MovieCarousel from "../../components/features/MovieCarousel";
import { useMoviesByCategory } from "../../../application/hooks/useMoviesByCategory";
import type { Movie } from "../../../domain/entities/Movie";
import { MovieCategory } from "../../../domain/entities/Category";
import "./HomePage.scss";

const HomePage = () => {
  const navigate = useNavigate();

  // Use the new simplified hooks
  const { movies: popularMovies, loading: popularLoading, error: popularError } = useMoviesByCategory(MovieCategory.POPULAR);
  const { movies: topRatedMovies, loading: topRatedLoading, error: topRatedError } = useMoviesByCategory(MovieCategory.TOP_RATED);
  const { movies: upcomingMovies, loading: upcomingLoading, error: upcomingError } = useMoviesByCategory(MovieCategory.UPCOMING);

  // Aggregate loading and error states
  const loading = popularLoading || topRatedLoading || upcomingLoading;
  const error = popularError || topRatedError || upcomingError;


  const handleMovieClick = (movie: Movie, category: "popular" | "top-rated" | "upcoming" | "default" = "default") => {
    navigate(`/movie/${movie.id}`);
  };


  if (loading) {
    return (
      <PageLayout>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>🔄 Loading movies...</h2>
          <p>Please wait while we fetch the latest movies</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
          <h2>❌ Error loading movies</h2>
          <p>{error}</p>
          <p>Please try refreshing the page</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <MovieCarousel
        label="Popular Movies"
        movies={popularMovies}
        loading={loading}
        error={error}
        onMovieClick={(movie) => handleMovieClick(movie, "popular")}
        cardSize="medium"
        category="popular"
      />
      <MovieCarousel
        label="Top Rated Movies"
        movies={topRatedMovies}
        loading={loading}
        error={error}
        onMovieClick={(movie) => handleMovieClick(movie, "top-rated")}
        cardSize="medium"
        category="top-rated"
      />
      <MovieCarousel
        label="Upcoming Movies"
        movies={upcomingMovies}
        loading={loading}
        error={error}
        onMovieClick={(movie) => handleMovieClick(movie, "upcoming")}
        cardSize="medium"
        category="upcoming"
      />

    </PageLayout>
  );
};

export default HomePage;

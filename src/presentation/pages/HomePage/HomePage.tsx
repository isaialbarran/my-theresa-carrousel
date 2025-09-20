import { useState } from "react";
import PageLayout from "../../components/layout/PageLayout/PageLayout";
import MovieCarousel from "../../components/features/MovieCarousel";
import MovieDetail from "../../components/features/MovieDetail";
import { useMoviesByCategory } from "../../../application/hooks/useMoviesByCategory";
import type { Movie } from "../../../domain/entities/Movie";
import { MovieCategory } from "../../../domain/entities/Category";
import "./HomePage.scss";

const HomePage = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedMovieCategory, setSelectedMovieCategory] = useState<"popular" | "top-rated" | "upcoming" | "default">("default");

  // Use the new simplified hooks
  const { movies: popularMovies, loading: popularLoading, error: popularError } = useMoviesByCategory(MovieCategory.POPULAR);
  const { movies: topRatedMovies, loading: topRatedLoading, error: topRatedError } = useMoviesByCategory(MovieCategory.TOP_RATED);
  const { movies: upcomingMovies, loading: upcomingLoading, error: upcomingError } = useMoviesByCategory(MovieCategory.UPCOMING);

  // Aggregate loading and error states
  const loading = popularLoading || topRatedLoading || upcomingLoading;
  const error = popularError || topRatedError || upcomingError;


  const handleMovieClick = (movie: Movie, category: "popular" | "top-rated" | "upcoming" | "default" = "default") => {
    setSelectedMovie(movie);
    setSelectedMovieCategory(category);
    document.body.classList.add("modal-open");
  };

  const handleCloseDetail = () => {
    setSelectedMovie(null);
    setSelectedMovieCategory("default");
    document.body.classList.remove("modal-open");
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

      {selectedMovie && (
        <div className="movie-detail-modal">
          <div className="movie-detail-modal__backdrop" onClick={handleCloseDetail} />
          <div className="movie-detail-modal__content">
            <MovieDetail
              movie={selectedMovie}
              onClose={handleCloseDetail}
              category={selectedMovieCategory}
            />
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default HomePage;

import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import MovieCarousel from "../../components/features/MovieCarousel";
import tmdbApi from "../../../infrastructure/api/tmdbApi";
import type { Movie } from "../../../domain/entities/Movie";
import { MovieCategory } from "../../../domain/entities/Category";
import "./HomePage.scss";

const HomePage = () => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Testing TMDB API calls...");

        // Test API calls
        const [popular, topRated, upcoming] = await Promise.all([
          tmdbApi.getMoviesByCategory(MovieCategory.POPULAR),
          tmdbApi.getMoviesByCategory(MovieCategory.TOP_RATED),
          tmdbApi.getMoviesByCategory(MovieCategory.UPCOMING),
        ]);

        console.log("✅ Popular movies:", popular.results.slice(0, 3));
        console.log("✅ Top rated movies:", topRated.results.slice(0, 3));
        console.log("✅ Upcoming movies:", upcoming.results.slice(0, 3));

        setPopularMovies(popular.results);
        setTopRatedMovies(topRated.results);
        setUpcomingMovies(upcoming.results);

        // Test individual movie details
        if (popular.results.length > 0) {
          const movieDetails = await tmdbApi.getMovieDetails(
            popular.results[0].id
          );
          console.log(
            "✅ Movie details for:",
            popular.results[0].title,
            movieDetails
          );
        }

        // Test genres
        const genres = await tmdbApi.getGenres();
        console.log("Genres:", genres.slice(0, 5));
      } catch (err) {
        console.error("API Error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <Header />
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>🔄 Testing TMDB API...</h2>
          <p>Check browser console for API call logs</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Header />
        <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
          <h2>❌ API Error</h2>
          <p>{error}</p>
          <p>Check browser console for more details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Header />
      <MovieCarousel
        label="Popular Movies"
        movies={popularMovies}
        loading={loading}
        error={error}
        onMovieClick={(movie) =>
          console.log("Popular movie clicked:", movie.title)
        }
        cardSize="medium"
      />
      <MovieCarousel
        label="Top Rated Movies"
        movies={topRatedMovies}
        loading={loading}
        error={error}
        onMovieClick={(movie) =>
          console.log("Top rated movie clicked:", movie.title)
        }
        cardSize="medium"
      />
      <MovieCarousel
        label="Upcoming Movies"
        movies={upcomingMovies}
        loading={loading}
        error={error}
        onMovieClick={(movie) =>
          console.log("Upcoming movie clicked:", movie.title)
        }
        cardSize="medium"
      />
    </div>
  );
};

export default HomePage;

import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageLayout from "../../components/layout/PageLayout/PageLayout";
import { useMovieDetails } from "../../../application/hooks/useMovieDetails";
import {
  useWishlistActions,
  useIsInWishlist,
} from "../../../application/store/appStore";
import "./MovieDetailPage.scss";

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleWishlist } = useWishlistActions();

  const movieId = id ? parseInt(id, 10) : undefined;
  const { movie, loading, error } = useMovieDetails(movieId);
  const isInWishlist = useIsInWishlist(movieId || 0);

  useEffect(() => {
    if (!movieId || isNaN(movieId)) {
      navigate("/", { replace: true });
    }
  }, [movieId, navigate]);

  const handleToggleWishlist = () => {
    if (movie) {
      toggleWishlist(movie);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <PageLayout>
        <main className="main-content">
          <Card className="loading-card">
            <div className="loading-spinner">Loading movie details...</div>
          </Card>
        </main>
      </PageLayout>
    );
  }

  if (error || !movie) {
    return (
      <PageLayout>
        <main className="main-content">
          <Card className="error-card">
            <h1>Movie Not Found</h1>
            <p>Sorry, we couldn't find the movie you're looking for.</p>
            <Button onClick={handleGoBack}>Go Back</Button>
          </Card>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <main className="main-content">
        <Card className="image-area">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/placeholder-movie.jpg"
            }
            alt={movie.title}
            className="movie-poster"
          />
        </Card>

        <Card className="button-description-area">
          <div className="movie-info">
            <h1 className="movie-title">{movie.title}</h1>
            <p className="movie-description">{movie.overview}</p>
            <div className="movie-meta">
              <span className="release-date">
                Released: {movie.release_date}
              </span>
              <span className="rating">Rating: {movie.vote_average}/10</span>
              {movie.runtime && (
                <span className="runtime">Runtime: {movie.runtime} min</span>
              )}
            </div>
          </div>
          <div className="action-buttons">
            <Button
              onClick={handleToggleWishlist}
              variant={isInWishlist ? "secondary" : "primary"}
            >
              {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </Button>
            <Button onClick={handleGoBack} variant="secondary">
              Go Back
            </Button>
          </div>
        </Card>
      </main>

      <Card className="additional-info">
        <h3>Additional Information</h3>
        <div className="additional-details">
          <p>
            <strong>Movie ID:</strong> {movie.id}
          </p>
          <p>
            <strong>Vote Count:</strong> {movie.vote_count}
          </p>
          {movie.tagline && (
            <p>
              <strong>Tagline:</strong> {movie.tagline}
            </p>
          )}
          {movie.genres && movie.genres.length > 0 && (
            <p>
              <strong>Genres:</strong>{" "}
              {movie.genres.map((g) => g.name).join(", ")}
            </p>
          )}
        </div>
      </Card>
    </PageLayout>
  );
};

export default MovieDetailPage;

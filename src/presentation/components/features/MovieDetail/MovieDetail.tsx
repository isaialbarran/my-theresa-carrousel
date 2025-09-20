import { useState } from "react";
import type { Movie } from "../../../../domain/entities/Movie";
import Button from "../../ui/Button";
import Card from "../../ui/Card";
import "./MovieDetail.scss";
import WishlistButton from "../../ui/WishlistButton/WishlistButton";

interface MovieDetailProps {
  movie: Movie;
  onClose?: () => void;
  category?: 'popular' | 'top-rated' | 'upcoming' | 'default';
}

const MovieDetail = ({ movie, onClose, category = 'default' }: MovieDetailProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getImageUrl = (posterPath: string | null) => {
    if (!posterPath) return "/placeholder-movie.jpg";
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  };

  const getBackdropUrl = (backdropPath: string | null) => {
    if (!backdropPath) return null;
    return `https://image.tmdb.org/t/p/w1280${backdropPath}`;
  };

  const formatReleaseYear = (releaseDate: string) => {
    return new Date(releaseDate).getFullYear();
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className={`movie-detail movie-detail--${category}`}>
      <div className="movie-detail__backdrop">
        {movie.backdrop_path && getBackdropUrl(movie.backdrop_path) && (
          <img
            src={getBackdropUrl(movie.backdrop_path)!}
            alt={`${movie.title} backdrop`}
            className="movie-detail__backdrop-image"
          />
        )}
        <div className="movie-detail__backdrop-overlay" />
      </div>

      <div className="movie-detail__container">
        {onClose && (
          <Button
            variant="ghost"
            size="small"
            onClick={onClose}
            className="movie-detail__close-button"
            aria-label="Close movie details"
          >
            ✕
          </Button>
        )}

        <div className="movie-detail__content">
          <div className="movie-detail__poster">
            <Card
              variant="elevated"
              padding="none"
              className="movie-detail__poster-card"
            >
              {!imageLoaded && !imageError && (
                <div className="movie-detail__poster-skeleton" />
              )}

              {imageError ? (
                <div className="movie-detail__poster-error">
                  <span>🎬</span>
                </div>
              ) : (
                <img
                  src={getImageUrl(movie.poster_path)}
                  alt={movie.title}
                  className={`movie-detail__poster-image ${
                    imageLoaded ? "loaded" : ""
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              )}
            </Card>
          </div>

          <div className="movie-detail__info">
            <div className="movie-detail__header">
              <h1 className="movie-detail__title">{movie.title}</h1>
              {movie.original_title !== movie.title && (
                <p className="movie-detail__original-title">
                  Original: {movie.original_title}
                </p>
              )}
            </div>

            <div className="movie-detail__meta">
              <div className="movie-detail__meta-item">
                <span className="movie-detail__meta-label">Year:</span>
                <span className="movie-detail__meta-value">
                  {formatReleaseYear(movie.release_date)}
                </span>
              </div>

              <div className="movie-detail__meta-item">
                <span className="movie-detail__meta-label">Rating:</span>
                <div className="movie-detail__rating">
                  <span className="movie-detail__rating-icon">⭐</span>
                  <span className="movie-detail__rating-value">
                    {formatRating(movie.vote_average)}
                  </span>
                  <span className="movie-detail__rating-count">
                    ({movie.vote_count.toLocaleString()} votes)
                  </span>
                </div>
              </div>

              <div className="movie-detail__meta-item">
                <span className="movie-detail__meta-label">Language:</span>
                <span className="movie-detail__meta-value">
                  {movie.original_language.toUpperCase()}
                </span>
              </div>

              <div className="movie-detail__meta-item">
                <span className="movie-detail__meta-label">Popularity:</span>
                <span className="movie-detail__meta-value">
                  {Math.round(movie.popularity)}
                </span>
              </div>
            </div>

            {movie.overview && (
              <div className="movie-detail__overview">
                <h3 className="movie-detail__section-title">Overview</h3>
                <p className="movie-detail__overview-text">{movie.overview}</p>
              </div>
            )}

            <div className="movie-detail__actions">
              <WishlistButton
                movie={movie}
                variant="full"
                size="medium"
                className="movie-detail__wishlist-button"
              />

              <Button
                variant="outline"
                size="medium"
                onClick={() =>
                  window.open(
                    `https://www.themoviedb.org/movie/${movie.id}`,
                    "_blank"
                  )
                }
                className="movie-detail__tmdb-button"
              >
                View on TMDB
              </Button>
            </div>

            {movie.adult && (
              <div className="movie-detail__warning">
                <span className="movie-detail__warning-icon">🔞</span>
                <span className="movie-detail__warning-text">
                  Adult Content
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;

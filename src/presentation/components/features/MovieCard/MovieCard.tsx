import { memo, useCallback, useMemo } from "react";
import type { Movie } from "../../../../domain/entities/Movie";
import Card from "../../ui/Card";
import WishlistButton from "../../ui/WishlistButton/WishlistButton";
import "./MovieCard.scss";

interface MovieCardProps {
  movie: Movie;
  onCardClick?: (movie: Movie) => void;
  className?: string;
  size?: "small" | "medium" | "large";
}

const MovieCard = memo(({
  movie,
  onCardClick,
  className = "",
  size = "medium",
}: MovieCardProps) => {
  const handleClick = useCallback(() => {
    if (onCardClick) {
      onCardClick(movie);
    }
  }, [onCardClick, movie]);

  const releaseYear = useMemo(() => {
    return new Date(movie.release_date).getFullYear();
  }, [movie.release_date]);

  const formattedRating = useMemo(() => {
    return movie.vote_average.toFixed(1);
  }, [movie.vote_average]);

  const imageUrl = useMemo(() => {
    if (!movie.poster_path) return "/placeholder-movie.jpg";
    return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  }, [movie.poster_path]);

  const formattedVoteCount = useMemo(() => {
    return movie.vote_count.toLocaleString();
  }, [movie.vote_count]);

  return (
    <Card
      variant="elevated"
      padding="none"
      onClick={handleClick}
      hoverable
      className={`movie-card movie-card--${size} ${className}`}
    >
      <div className="movie-card__image">
        <img
          src={imageUrl}
          alt={movie.title}
          className="movie-card__poster"
          loading="lazy"
        />
        <div className="movie-card__overlay">
          <div className="movie-card__rating">
            <span className="movie-card__rating-icon">⭐</span>
            <span className="movie-card__rating-value">
              {formattedRating}
            </span>
          </div>

          <div className="movie-card__wishlist">
            <WishlistButton
              movie={movie}
              variant="icon"
              size="small"
              showTooltip={false}
            />
          </div>
        </div>
      </div>

      <div className="movie-card__content">
        <h3 className="movie-card__title" title={movie.title}>
          {movie.title}
        </h3>

        <div className="movie-card__meta">
          <span className="movie-card__year">
            {releaseYear}
          </span>
          {movie.vote_count > 0 && (
            <span className="movie-card__votes">
              {formattedVoteCount} votes
            </span>
          )}
        </div>

        {movie.overview && (
          <p className="movie-card__overview" title={movie.overview}>
            {movie.overview}
          </p>
        )}
      </div>
    </Card>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;

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

const MovieCard = ({
  movie,
  onCardClick,
  className = "",
  size = "medium",
}: MovieCardProps) => {
  const handleClick = () => {
    if (onCardClick) {
      onCardClick(movie);
    }
  };

  const formatReleaseYear = (releaseDate: string) => {
    return new Date(releaseDate).getFullYear();
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  const getImageUrl = (posterPath: string | null) => {
    if (!posterPath) return "/placeholder-movie.jpg";
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  };

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
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="movie-card__poster"
          loading="lazy"
        />
        <div className="movie-card__overlay">
          <div className="movie-card__rating">
            <span className="movie-card__rating-icon">⭐</span>
            <span className="movie-card__rating-value">
              {formatRating(movie.vote_average)}
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
            {formatReleaseYear(movie.release_date)}
          </span>
          {movie.vote_count > 0 && (
            <span className="movie-card__votes">
              {movie.vote_count.toLocaleString()} votes
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
};

export default MovieCard;

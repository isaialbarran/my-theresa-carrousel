import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import PageLayout from "../../components/layout/PageLayout/PageLayout";
import MovieCard from "../../components/features/MovieCard";
import MovieDetail from "../../components/features/MovieDetail";
import Button from "../../components/ui/Button";
import VirtualGrid from "../../components/ui/VirtualGrid";
import Modal from "../../components/ui/Modal";
import {
  useWishlist,
  useWishlistActions,
  useWishlistCount,
} from "../../../application/store/appStore";
import { useDebounce } from "../../hooks/useDebounce";
import { formatReleaseYear } from "../../../shared/utils/format";
import type { Movie } from "../../../domain/entities/Movie";
import "./WishlistPage.scss";

const WishlistPage = () => {
  const wishlist = useWishlist();
  const wishlistCount = useWishlistCount();
  const { clearWishlist } = useWishlistActions();
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [sortBy, setSortBy] = useState<"added" | "title" | "rating" | "year">(
    "added",
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce search query to avoid excessive filtering
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  const handleClearWishlist = useCallback(() => {
    if (
      window.confirm("Are you sure you want to clear your entire wishlist?")
    ) {
      clearWishlist();
    }
  }, [clearWishlist]);

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSortBy(e.target.value as typeof sortBy);
    },
    [],
  );

  const handleNavigateHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [],
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const sortedAndFilteredMovies = useMemo(() => {
    if (wishlist.length === 0) return [];

    let movies = [...wishlist];

    // Apply search filter
    if (debouncedSearchQuery.trim()) {
      const searchTerm = debouncedSearchQuery.toLowerCase().trim();
      movies = movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchTerm) ||
          (movie.overview && movie.overview.toLowerCase().includes(searchTerm)),
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "title":
        movies.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "rating":
        movies.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
        break;
      case "year":
        movies.sort((a, b) => {
          const yearA = formatReleaseYear(a.release_date) || 0;
          const yearB = formatReleaseYear(b.release_date) || 0;
          return yearB - yearA;
        });
        break;
      case "added":
      default:
        // Keep original order (last added first)
        movies.reverse();
        break;
    }

    return movies;
  }, [wishlist, sortBy, debouncedSearchQuery]);

  const EmptyState = useMemo(
    (): ReactNode => (
      <div className="wishlist-page__empty">
        <div className="wishlist-page__empty-icon">🎬</div>
        <h2>Your wishlist is empty</h2>
        <p>Start adding movies you want to watch later!</p>
        <Button variant="primary" onClick={handleNavigateHome}>
          Browse Movies
        </Button>
      </div>
    ),
    [handleNavigateHome],
  );

  // Constants for virtualization
  const ITEM_WIDTH = 280;
  const ITEM_HEIGHT = 420;
  const CONTAINER_HEIGHT = 600;
  const USE_VIRTUALIZATION_THRESHOLD = 20;

  // Render item function for VirtualGrid
  const renderMovieItem = useCallback(
    (movie: Movie) => (
      <MovieCard
        key={movie.id}
        movie={movie}
        onCardClick={handleMovieClick}
        size="medium"
        className="movie-card--wishlist"
      />
    ),
    [handleMovieClick],
  );

  return (
    <PageLayout>
      <div className="wishlist-page">
        <div className="wishlist-page__header">
          <div className="wishlist-page__title">
            <h1>My Wishlist</h1>
            <span className="wishlist-page__count">
              {sortedAndFilteredMovies.length}{" "}
              {sortedAndFilteredMovies.length === 1 ? "movie" : "movies"}
              {debouncedSearchQuery &&
                wishlistCount !== sortedAndFilteredMovies.length && (
                <span className="wishlist-page__count-total">
                  {" "}
                    of {wishlistCount}
                </span>
              )}
            </span>
          </div>

          {wishlistCount > 0 && (
            <div className="wishlist-page__actions">
              <div className="wishlist-page__controls">
                <div className="wishlist-page__search">
                  <label htmlFor="search-input">Search:</label>
                  <div className="wishlist-page__search-input">
                    <input
                      id="search-input"
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search movies..."
                      className="wishlist-page__search-field"
                    />
                    {searchQuery && (
                      <button
                        onClick={handleClearSearch}
                        className="wishlist-page__search-clear"
                        aria-label="Clear search"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                <div className="wishlist-page__sort">
                  <label htmlFor="sort-select">Sort by:</label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={handleSortChange}
                    className="wishlist-page__select"
                  >
                    <option value="added">Recently Added</option>
                    <option value="title">Title (A-Z)</option>
                    <option value="rating">Rating (High to Low)</option>
                    <option value="year">Release Year (Newest)</option>
                  </select>
                </div>
              </div>

              <Button
                variant="outline"
                size="small"
                onClick={handleClearWishlist}
                className="wishlist-page__clear-btn"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        {wishlistCount === 0 ? (
          EmptyState
        ) : sortedAndFilteredMovies.length === 0 ? (
          <div className="wishlist-page__no-results">
            <div className="wishlist-page__no-results-icon">🔍</div>
            <h3>No movies found</h3>
            <p>Try adjusting your search or filter criteria.</p>
            {debouncedSearchQuery && (
              <Button
                variant="outline"
                size="small"
                onClick={handleClearSearch}
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : sortedAndFilteredMovies.length > USE_VIRTUALIZATION_THRESHOLD ? (
          <VirtualGrid
            items={sortedAndFilteredMovies}
            renderItem={renderMovieItem}
            itemWidth={ITEM_WIDTH}
            itemHeight={ITEM_HEIGHT}
            containerHeight={CONTAINER_HEIGHT}
            gap={24}
            className="wishlist-page__virtual-grid"
          />
        ) : (
          <div className="wishlist-page__grid">
            {sortedAndFilteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onCardClick={handleMovieClick}
                size="medium"
                className="movie-card--wishlist"
              />
            ))}
          </div>
        )}

        <Modal
          isOpen={!!selectedMovie}
          onClose={handleCloseDetail}
          size="large"
        >
          {selectedMovie && (
            <MovieDetail
              movie={selectedMovie}
              onClose={handleCloseDetail}
              category="default"
            />
          )}
        </Modal>
      </div>
    </PageLayout>
  );
};

export default WishlistPage;

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MovieCarousel from "./MovieCarousel";
import type { Movie } from "../../../../domain/entities/Movie";
import { createMockMovies } from "../../../../test/factories/movieFactory";

// Mock dependencies
vi.mock("../MovieCard", () => ({
  default: ({ movie, onCardClick }: { movie: Movie; onCardClick?: (movie: Movie) => void }) => (
    <div data-testid={`movie-card-${movie.id}`} onClick={() => onCardClick?.(movie)}>
      {movie.title}
    </div>
  ),
}));

vi.mock("../../ui/Button", () => ({
  default: ({ children, onClick, disabled, ...props }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; [key: string]: unknown }) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

const renderCarousel = (props = {}) => {
  return render(
    <BrowserRouter>
      <MovieCarousel label="Test Movies" {...props} />
    </BrowserRouter>,
  );
};

describe("MovieCarousel", () => {
  it("should render carousel title with label", () => {
    renderCarousel({ label: "Popular Movies" });

    expect(screen.getByText("Popular Movies")).toBeInTheDocument();
  });

  it("should render movies when provided", () => {
    const mockMovies = createMockMovies(2);
    renderCarousel({ movies: mockMovies });

    expect(screen.getByTestId("movie-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("movie-card-2")).toBeInTheDocument();
    expect(screen.getByText("Test Movie 1")).toBeInTheDocument();
    expect(screen.getByText("Test Movie 2")).toBeInTheDocument();
  });

  it("should render loading skeleton when loading", () => {
    renderCarousel({ loading: true, itemsPerView: 3 });

    const skeletons = document.querySelectorAll(".movie-carousel__skeleton");
    expect(skeletons).toHaveLength(3);
  });

  it("should render error state when error is provided", () => {
    renderCarousel({ error: "Failed to load movies" });

    expect(screen.getByText("Failed to load movies")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("should render empty state when no movies", () => {
    renderCarousel({ movies: [] });

    expect(screen.getByText("No movies available")).toBeInTheDocument();
  });

  it("should render category icon for different categories", () => {
    const mockMovies = createMockMovies(2);
    const { rerender } = renderCarousel({ category: "popular", label: "Popular", movies: mockMovies });
    expect(screen.getByText("🔥")).toBeInTheDocument();

    rerender(
      <BrowserRouter>
        <MovieCarousel label="Top Rated" category="top-rated" movies={mockMovies} />
      </BrowserRouter>,
    );
    expect(screen.getByText("⭐")).toBeInTheDocument();

    rerender(
      <BrowserRouter>
        <MovieCarousel label="Upcoming" category="upcoming" movies={mockMovies} />
      </BrowserRouter>,
    );
    expect(screen.getAllByText("🎬")[0]).toBeInTheDocument();
  });

  it("should call onMovieClick when movie card is clicked", () => {
    const onMovieClick = vi.fn();
    const mockMovies = createMockMovies(2);
    renderCarousel({ movies: mockMovies, onMovieClick });

    const movieCard = screen.getByTestId("movie-card-1");
    fireEvent.click(movieCard);

    expect(onMovieClick).toHaveBeenCalledWith(mockMovies[0]);
  });

  it("should render navigation buttons when showNavigation is true", () => {
    const mockMovies = createMockMovies(2);
    renderCarousel({ movies: mockMovies, showNavigation: true });

    expect(screen.getByLabelText("Scroll left")).toBeInTheDocument();
    expect(screen.getByLabelText("Scroll right")).toBeInTheDocument();
  });
});

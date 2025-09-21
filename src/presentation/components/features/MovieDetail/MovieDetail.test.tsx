import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MovieDetail from "./MovieDetail";
import type { Movie } from "../../../../domain/entities/Movie";

// Mock dependencies
vi.mock("../../../../shared/utils/image", () => ({
  getMoviePosterUrl: vi.fn((path) => `https://image.tmdb.org/t/p/w500${path}`),
  getMovieBackdropUrl: vi.fn((path) => `https://image.tmdb.org/t/p/original${path}`),
}));

vi.mock("../../../../shared/utils/format", () => ({
  formatReleaseYear: vi.fn((date) => new Date(date).getFullYear()),
  formatRating: vi.fn((rating) => rating.toFixed(1)),
}));

vi.mock("../../ui/WishlistButton/WishlistButton", () => ({
  default: ({ movie }: { movie: Movie }) => (
    <button data-testid="wishlist-button">{movie.title} Wishlist</button>
  ),
}));

vi.mock("../../ui/Button", () => ({
  default: ({ children, onClick, ...props }: { children: React.ReactNode; onClick?: () => void; [key: string]: unknown }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("../../ui/Card", () => ({
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
}));

const mockMovie: Movie = {
  id: 1,
  title: "Test Movie",
  overview: "This is a detailed test movie overview that explains the plot.",
  release_date: "2023-01-01",
  poster_path: "/test-poster.jpg",
  backdrop_path: "/test-backdrop.jpg",
  vote_average: 8.5,
  vote_count: 1000,
  genre_ids: [1, 2],
  adult: false,
  original_language: "en",
  original_title: "Test Movie Original",
  popularity: 100.5,
  video: false,
};

const renderMovieDetail = (props = {}) => {
  return render(
    <BrowserRouter>
      <MovieDetail movie={mockMovie} {...props} />
    </BrowserRouter>,
  );
};

describe("MovieDetail", () => {
  it("should render movie information correctly", () => {
    renderMovieDetail();

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText("This is a detailed test movie overview that explains the plot.")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("8.5")).toBeInTheDocument();
    expect(screen.getByText("(1,000 votes)")).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getByText("101")).toBeInTheDocument();
  });

  it("should render original title when different from main title", () => {
    renderMovieDetail();

    expect(screen.getByText("Original: Test Movie Original")).toBeInTheDocument();
  });

  it("should render close button when onClose is provided", () => {
    const onClose = vi.fn();
    renderMovieDetail({ onClose });

    const closeButton = screen.getByLabelText("Close movie details");
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it("should not render close button when onClose is not provided", () => {
    renderMovieDetail();

    expect(screen.queryByLabelText("Close movie details")).not.toBeInTheDocument();
  });

  it("should render backdrop image when backdrop_path exists", () => {
    renderMovieDetail();

    const backdropImage = screen.getByAltText("Test Movie backdrop");
    expect(backdropImage).toBeInTheDocument();
    expect(backdropImage).toHaveAttribute("src", "https://image.tmdb.org/t/p/original/test-backdrop.jpg");
  });

  it("should open TMDB link when View on TMDB button is clicked", () => {
    const originalOpen = window.open;
    window.open = vi.fn();

    renderMovieDetail();

    const tmdbButton = screen.getByText("View on TMDB");
    fireEvent.click(tmdbButton);

    expect(window.open).toHaveBeenCalledWith("https://www.themoviedb.org/movie/1", "_blank");

    window.open = originalOpen;
  });

  it("should render adult content warning when movie is adult", () => {
    const adultMovie = { ...mockMovie, adult: true };
    render(
      <BrowserRouter>
        <MovieDetail movie={adultMovie} />
      </BrowserRouter>,
    );

    expect(screen.getByText("Adult Content")).toBeInTheDocument();
    expect(screen.getByText("🔞")).toBeInTheDocument();
  });

  it("should apply correct category class", () => {
    const { container } = renderMovieDetail({ category: "popular" });

    expect(container.firstChild).toHaveClass("movie-detail--popular");
  });
});

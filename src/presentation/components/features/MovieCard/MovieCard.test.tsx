import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MovieCard from "./MovieCard";
import type { Movie } from "../../../../domain/entities/Movie";
import { createMockMovie } from "../../../../test/factories/movieFactory";

// Mock dependencies
vi.mock("../../../../shared/utils/image", () => ({
  getMoviePosterUrl: vi.fn((path) => `https://image.tmdb.org/t/p/w500${path}`),
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

vi.mock("../../ui/Card", () => ({
  default: ({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
    <div data-testid="card" onClick={onClick} className={className}>
      {children}
    </div>
  ),
}));

const renderMovieCard = (props = {}) => {
  const defaultMovie = createMockMovie({
    title: "Test Movie",
    overview: "This is a test movie overview",
    vote_count: 1000,
  });
  return render(
    <BrowserRouter>
      <MovieCard movie={defaultMovie} {...props} />
    </BrowserRouter>,
  );
};

describe("MovieCard", () => {
  it("should render movie information correctly", () => {
    renderMovieCard();

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText("This is a test movie overview")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("8.5")).toBeInTheDocument();
    expect(screen.getByText("1,000 votes")).toBeInTheDocument();
  });

  it("should render movie poster with correct src and alt", () => {
    renderMovieCard();

    const poster = screen.getByRole("img");
    expect(poster).toHaveAttribute("src", "https://image.tmdb.org/t/p/w500/test-poster.jpg");
    expect(poster).toHaveAttribute("alt", "Test Movie");
  });

  it("should call onCardClick when card is clicked", () => {
    const onCardClick = vi.fn();
    const testMovie = createMockMovie({ title: "Click Test Movie" });
    render(
      <BrowserRouter>
        <MovieCard movie={testMovie} onCardClick={onCardClick} />
      </BrowserRouter>,
    );

    const card = screen.getByTestId("card");
    fireEvent.click(card);

    expect(onCardClick).toHaveBeenCalledWith(testMovie);
  });

  it("should apply correct size and className", () => {
    renderMovieCard({ size: "large", className: "custom-class" });

    const card = screen.getByTestId("card");
    expect(card).toHaveClass("movie-card--large");
    expect(card).toHaveClass("custom-class");
  });

  it("should not show vote count when it is zero", () => {
    const movieWithoutVotes = createMockMovie({ vote_count: 0 });
    render(
      <BrowserRouter>
        <MovieCard movie={movieWithoutVotes} />
      </BrowserRouter>,
    );

    expect(screen.queryByText("votes")).not.toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";

// Mock the store hook
vi.mock("../../../../application/store/appStore", () => ({
  useWishlistCount: vi.fn(),
}));

import { useWishlistCount } from "../../../../application/store/appStore";

const renderHeader = (initialRoute = "/") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Header />
    </MemoryRouter>,
  );
};

describe("Header", () => {
  beforeEach(() => {
    vi.mocked(useWishlistCount).mockReturnValue(0);
  });

  it("should render the brand title and logo", () => {
    renderHeader();

    expect(screen.getByText("🎬 MovieApp")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /movieapp/i })).toHaveAttribute("href", "/");
  });

  it("should render navigation links", () => {
    renderHeader();

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /wishlist/i })).toBeInTheDocument();
  });

  it("should highlight Home link when on home route", () => {
    renderHeader("/");

    const homeLink = screen.getByRole("link", { name: "Home" });
    const wishlistLink = screen.getByRole("link", { name: /wishlist/i });

    expect(homeLink).toHaveClass("btn--primary");
    expect(wishlistLink).toHaveClass("btn--ghost");
  });

  it("should highlight Wishlist link when on wishlist route", () => {
    renderHeader("/wishlist");

    const homeLink = screen.getByRole("link", { name: "Home" });
    const wishlistLink = screen.getByRole("link", { name: /wishlist/i });

    expect(homeLink).toHaveClass("btn--ghost");
    expect(wishlistLink).toHaveClass("btn--primary");
  });

  it("should display wishlist count when greater than 0", () => {
    vi.mocked(useWishlistCount).mockReturnValue(5);
    renderHeader();

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("5")).toHaveClass("header__wishlist-count");
  });

  it("should not display wishlist count when 0", () => {
    vi.mocked(useWishlistCount).mockReturnValue(0);
    const { container } = renderHeader();

    expect(screen.queryByText("0")).not.toBeInTheDocument();
    expect(container.querySelector(".header__wishlist-count")).not.toBeInTheDocument();
  });

  it("should render wishlist icon and text", () => {
    renderHeader();

    expect(screen.getByText("❤️")).toBeInTheDocument();
    expect(screen.getByText("Wishlist")).toBeInTheDocument();
  });
});

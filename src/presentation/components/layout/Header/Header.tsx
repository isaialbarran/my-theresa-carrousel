import { Link, useLocation } from "react-router-dom";
import { useWishlistCount } from "../../../../application/store/appStore";
import "./Header.scss";

const Header = () => {
  const wishlistCount = useWishlistCount();
  const location = useLocation();
  const currentRoute = location.pathname;

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__brand">
          <h1 className="header__title">🎬 MovieApp</h1>
        </Link>

        <nav className="header__nav">
          <Link
            to="/"
            className={`header__nav-link header__nav-btn btn btn--medium ${
              currentRoute === "/" ? "btn--primary" : "btn--ghost"
            }`}
          >
            Home
          </Link>

          <Link
            to="/wishlist"
            className={`header__nav-link header__nav-btn header__wishlist-btn btn btn--medium ${
              currentRoute === "/wishlist" ? "btn--primary" : "btn--ghost"
            }`}
          >
            <span className="header__wishlist-icon">❤️</span>
            <span className="header__wishlist-text">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="header__wishlist-count">{wishlistCount}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

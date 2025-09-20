import Button from '../../ui/Button'
import { useWishlistCount, useRouter } from '../../../../application/store/appStore'
import './Header.scss'

const Header = () => {
  const wishlistCount = useWishlistCount()
  const { navigate, currentRoute } = useRouter()

  const navigateToHome = () => {
    navigate('/')
  }

  const navigateToWishlist = () => {
    navigate('/wishlist')
  }

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__brand" onClick={navigateToHome}>
          <h1 className="header__title">🎬 MovieApp</h1>
        </div>

        <nav className="header__nav">
          <Button
            variant={currentRoute === '/' ? 'primary' : 'ghost'}
            size="medium"
            onClick={navigateToHome}
            className="header__nav-btn"
          >
            Home
          </Button>

          <Button
            variant={currentRoute === '/wishlist' ? 'primary' : 'ghost'}
            size="medium"
            onClick={navigateToWishlist}
            className="header__nav-btn header__wishlist-btn"
          >
            <span className="header__wishlist-icon">❤️</span>
            <span className="header__wishlist-text">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="header__wishlist-count">{wishlistCount}</span>
            )}
          </Button>
        </nav>
      </div>
    </header>
  )
}

export default Header
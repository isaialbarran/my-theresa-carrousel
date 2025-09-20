import type { Movie } from '../../../../domain/entities/Movie'
import { useMovieWishlist } from '../../../hooks/useWishlist'
import Button from '../Button'
import './WishlistButton.scss'

interface WishlistButtonProps {
  movie: Movie
  variant?: 'icon' | 'full'
  size?: 'small' | 'medium' | 'large'
  className?: string
  showTooltip?: boolean
}

const WishlistButton = ({
  movie,
  variant = 'icon',
  size = 'medium',
  className = '',
  showTooltip = true
}: WishlistButtonProps) => {
  const { isWishlisted, toggle } = useMovieWishlist(movie)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering parent click events
    toggle()
  }

  const getIcon = () => {
    return isWishlisted ? '💖' : '🤍'
  }

  const getButtonProps = () => {
    const baseProps = {
      onClick: handleClick,
      className: `wishlist-button wishlist-button--${variant} ${className}`,
      size,
      'aria-label': isWishlisted
        ? `Remove ${movie.title} from wishlist`
        : `Add ${movie.title} to wishlist`,
      title: showTooltip
        ? (isWishlisted ? 'Remove from wishlist' : 'Add to wishlist')
        : undefined
    }

    if (variant === 'icon') {
      return {
        ...baseProps,
        variant: 'ghost' as const
      }
    }

    return {
      ...baseProps,
      variant: isWishlisted ? 'secondary' as const : 'primary' as const
    }
  }

  if (variant === 'icon') {
    return (
      <Button {...getButtonProps()}>
        <span className="wishlist-button__icon">
          {getIcon()}
        </span>
      </Button>
    )
  }

  return (
    <Button {...getButtonProps()}>
      <span className="wishlist-button__icon">
        {getIcon()}
      </span>
      <span className="wishlist-button__text">
        {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </span>
    </Button>
  )
}

export default WishlistButton
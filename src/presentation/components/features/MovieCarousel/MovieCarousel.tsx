import { useState, useRef, useEffect } from 'react'
import type { Movie } from '../../../../domain/entities/Movie'
import MovieCard from '../MovieCard'
import Button from '../../ui/Button'
import './MovieCarousel.scss'

interface MovieCarouselProps {
  label: string
  movies?: Movie[]
  loading?: boolean
  error?: string | null
  onMovieClick?: (movie: Movie) => void
  cardSize?: 'small' | 'medium' | 'large'
  showNavigation?: boolean
  itemsPerView?: number
}

const MovieCarousel = ({
  label,
  movies = [],
  loading = false,
  error = null,
  onMovieClick,
  cardSize = 'medium',
  showNavigation = true,
  itemsPerView = 6
}: MovieCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Update scroll button states
  const updateScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  // Handle scroll
  const handleScroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return

    const scrollAmount = carouselRef.current.clientWidth * 0.8
    const newScrollLeft = direction === 'left'
      ? carouselRef.current.scrollLeft - scrollAmount
      : carouselRef.current.scrollLeft + scrollAmount

    carouselRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    })
  }

  // Update button states on scroll
  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener('scroll', updateScrollButtons)
      updateScrollButtons() // Initial check

      return () => carousel.removeEventListener('scroll', updateScrollButtons)
    }
  }, [movies])

  // Handle movie click
  const handleMovieClick = (movie: Movie) => {
    if (onMovieClick) {
      onMovieClick(movie)
    }
  }

  // Render loading skeleton
  const renderLoadingSkeleton = () => (
    <div className="movie-carousel__grid">
      {Array.from({ length: itemsPerView }).map((_, index) => (
        <div key={index} className="movie-carousel__skeleton">
          <div className="movie-carousel__skeleton-image"></div>
          <div className="movie-carousel__skeleton-content">
            <div className="movie-carousel__skeleton-title"></div>
            <div className="movie-carousel__skeleton-meta"></div>
          </div>
        </div>
      ))}
    </div>
  )

  // Render error state
  const renderError = () => (
    <div className="movie-carousel__error">
      <div className="movie-carousel__error-icon">⚠️</div>
      <p className="movie-carousel__error-message">{error}</p>
      <Button variant="outline" size="small">
        Try Again
      </Button>
    </div>
  )

  // Render empty state
  const renderEmpty = () => (
    <div className="movie-carousel__empty">
      <div className="movie-carousel__empty-icon">🎬</div>
      <p className="movie-carousel__empty-message">No movies available</p>
    </div>
  )

  return (
    <section className="movie-carousel">
      <div className="movie-carousel__header">
        <h2 className="movie-carousel__title">{label}</h2>

        {showNavigation && movies.length > 0 && (
          <div className="movie-carousel__navigation">
            <Button
              variant="ghost"
              size="small"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className="movie-carousel__nav-button"
            >
              ←
            </Button>
            <Button
              variant="ghost"
              size="small"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className="movie-carousel__nav-button"
            >
              →
            </Button>
          </div>
        )}
      </div>

      <div className="movie-carousel__content">
        {loading && renderLoadingSkeleton()}

        {error && !loading && renderError()}

        {!loading && !error && movies.length === 0 && renderEmpty()}

        {!loading && !error && movies.length > 0 && (
          <div
            ref={carouselRef}
            className="movie-carousel__grid"
            onScroll={updateScrollButtons}
          >
            {movies.map((movie) => (
              <div key={movie.id} className="movie-carousel__item">
                <MovieCard
                  movie={movie}
                  size={cardSize}
                  onCardClick={handleMovieClick}
                  className="movie-carousel__card"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile scroll indicators */}
      {movies.length > 0 && (
        <div className="movie-carousel__indicators">
          <div className="movie-carousel__indicator-track">
            <div
              className="movie-carousel__indicator-thumb"
              style={{
                transform: `translateX(${(currentIndex / Math.max(movies.length - itemsPerView, 1)) * 100}%)`
              }}
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default MovieCarousel
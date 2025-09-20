import './MovieCarousel.scss'

interface MovieCarouselProps {
  label: string
}

const MovieCarousel = ({ label }: MovieCarouselProps) => {
  return (
    <div className="section carousel-section">
      <div className="content">
        <span className="label">{label}</span>
      </div>
    </div>
  )
}

export default MovieCarousel
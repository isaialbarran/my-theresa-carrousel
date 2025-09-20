import Header from '../../components/layout/Header'
import MovieCarousel from '../../components/features/MovieCarousel'
import './HomePage.scss'

const HomePage = () => {
  return (
    <div className="container">
      <Header />
      <MovieCarousel label="carousel 1" />
      <MovieCarousel label="carousel 2" />
      <MovieCarousel label="carousel 3" />
    </div>
  )
}

export default HomePage
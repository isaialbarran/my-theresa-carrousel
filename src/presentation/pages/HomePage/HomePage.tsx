import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout/PageLayout";
import MovieCarousel from "../../components/features/MovieCarousel";
import { useMoviesByCategory } from "../../../application/hooks/useMoviesByCategory";
import type { Movie } from "../../../domain/entities/Movie";
import { MovieCategory } from "../../../domain/entities/Category";
import "./HomePage.scss";

type CarouselCategory = "popular" | "top-rated" | "upcoming";

const SECTIONS: Array<{
  key: CarouselCategory;
  label: string;
  category: MovieCategory;
}> = [
  { key: "popular", label: "Popular Movies", category: MovieCategory.POPULAR },
  { key: "top-rated", label: "Top Rated Movies", category: MovieCategory.TOP_RATED },
  { key: "upcoming", label: "Upcoming Movies", category: MovieCategory.UPCOMING },
];

const HomePage = () => {
  const navigate = useNavigate();

  const popular = useMoviesByCategory(MovieCategory.POPULAR);
  const topRated = useMoviesByCategory(MovieCategory.TOP_RATED);
  const upcoming = useMoviesByCategory(MovieCategory.UPCOMING);

  const sections = [
    { ...SECTIONS[0], ...popular },
    { ...SECTIONS[1], ...topRated },
    { ...SECTIONS[2], ...upcoming },
  ];

  const loading = sections.some((section) => section.loading);
  const error = sections.find((section) => section.error)?.error ?? null;

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  if (loading) {
    return (
      <PageLayout>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>🔄 Loading movies...</h2>
          <p>Please wait while we fetch the latest movies</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
          <h2>❌ Error loading movies</h2>
          <p>{error}</p>
          <p>Please try refreshing the page</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {sections.map(({ key, label, movies, loading: sectionLoading, error: sectionError }) => (
        <MovieCarousel
          key={key}
          label={label}
          movies={movies}
          loading={sectionLoading}
          error={sectionError}
          onMovieClick={handleMovieClick}
          cardSize="medium"
          category={key}
        />
      ))}
    </PageLayout>
  );
};

export default HomePage;

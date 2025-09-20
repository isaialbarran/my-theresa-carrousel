import Card from "../../components/ui/Card";
import "./MovieDetailPage.scss";

const MovieDetailPage = () => {
  return (
    <div className="container">
      <header className="header">
        <span className="section-label">header</span>
      </header>

      <main className="main-content">
        <Card className="image-area">
          <span className="section-label">image area</span>
        </Card>

        <Card className="button-description-area">
          <span className="section-label">button and description area</span>
        </Card>
      </main>

      <Card className="additional-info">
        <span className="section-label">additional info area</span>
      </Card>
    </div>
  );
};

export default MovieDetailPage;

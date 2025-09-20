import type { ReactNode } from "react";
import Header from "../Header";
import "./PageLayout.scss";

interface PageLayoutProps {
  children: ReactNode;

  className?: string;
}

const PageLayout = ({ children, className = "" }: PageLayoutProps) => {
  return (
    <div className={`container ${className}`}>
      <Header />
      {children}
    </div>
  );
};

export default PageLayout;

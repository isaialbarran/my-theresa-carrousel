import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PageLayout from "./PageLayout";

// Mock Header component
vi.mock("../Header", () => ({
  default: () => <header data-testid="header">Mocked Header</header>,
}));

const renderPageLayout = (props = {}) => {
  return render(
    <BrowserRouter>
      <PageLayout {...props}>
        <div data-testid="children">Test Content</div>
      </PageLayout>
    </BrowserRouter>,
  );
};

describe("PageLayout", () => {
  it("should render Header component", () => {
    renderPageLayout();

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByText("Mocked Header")).toBeInTheDocument();
  });

  it("should render children content", () => {
    renderPageLayout();

    expect(screen.getByTestId("children")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should apply default container class", () => {
    const { container } = renderPageLayout();

    expect(container.firstChild).toHaveClass("container");
  });

  it("should apply custom className when provided", () => {
    const { container } = renderPageLayout({ className: "custom-class" });

    expect(container.firstChild).toHaveClass("container");
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("should render with correct structure", () => {
    renderPageLayout();

    const container = screen.getByTestId("header").parentElement;
    expect(container).toContainElement(screen.getByTestId("header"));
    expect(container).toContainElement(screen.getByTestId("children"));
  });

  it("should handle multiple children", () => {
    render(
      <BrowserRouter>
        <PageLayout>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </PageLayout>
      </BrowserRouter>,
    );

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
    expect(screen.getByTestId("child-3")).toBeInTheDocument();
  });
});

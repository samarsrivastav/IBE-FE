import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";
import "@testing-library/jest-dom";

describe("Footer Component", () => {
  test("renders Footer component without crashing", () => {
    render(<Footer />);
    
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  test("displays the footer logo", () => {
    render(<Footer />);
    
    const logo = screen.getByAltText("logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/kickdrum-footer.png");
  });

  test("renders the copyright text", () => {
    render(<Footer />);
    
    const copyrightText = screen.getByText(
      /Kickdrum Technology Group LLC. All rights reserved./i
    );
    expect(copyrightText).toBeInTheDocument();
  });

  test("applies correct classes for styling", () => {
    render(<Footer />);
    
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("footer");

    const textBox = screen.getByText(/Kickdrum Technology Group LLC/i);
    expect(textBox).toHaveClass("footer__text--body2");
  });
});

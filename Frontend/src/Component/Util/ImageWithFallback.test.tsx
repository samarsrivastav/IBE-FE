import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import ImageWithFallback from "./ImageWithFallback";

describe("ImageWithFallback Component", () => {
  test("renders image with provided src", () => {
    render(<ImageWithFallback src="valid-image-url.jpg" alt="Test Image" />);
    
    const imageElement = screen.getByAltText("Test Image");
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute("src", "valid-image-url.jpg");
  });

  test("renders fallback image when src is missing", () => {
    render(<ImageWithFallback fallback="fallback-image-url.jpg" alt="Fallback Image" />);
    
    const imageElement = screen.getByAltText("Fallback Image");
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute("src", "fallback-image-url.jpg");
  });

 
});

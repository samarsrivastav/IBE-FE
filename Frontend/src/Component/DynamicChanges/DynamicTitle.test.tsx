import { render } from "@testing-library/react";
import { vi } from "vitest";
import DynamicTitle from "./DynamicTitle";
import { useSelector } from "react-redux";

// Mock Redux useSelector
vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

describe("DynamicTitle Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("sets document title to pageTitle from Redux when available", () => {
    const mockPageTitle = "Custom Page Title";
    
    // Correctly mock the state structure
    (useSelector as vi.Mock).mockReturnValue(mockPageTitle);

    render(<DynamicTitle />);

    // Check if the document title is set correctly
    expect(document.title).toBe(mockPageTitle);
  });

  test("sets document title to default value when pageTitle is not available", () => {
    // Mock the state to return undefined or an empty value for pageTitle
    (useSelector as vi.Mock).mockReturnValue(undefined);

    render(<DynamicTitle />);

    // Check if the document title is set to the default
    expect(document.title).toBe("Hotel Booking Engine");
  });

  test("sets document title to default value when pageTitle is undefined", () => {
    // Mock the state to return undefined for pageTitle
    (useSelector as vi.Mock).mockReturnValue(undefined);

    render(<DynamicTitle />);

    // Check if the document title is set to the default
    expect(document.title).toBe("Hotel Booking Engine");
  });

  test("does not change document title when pageTitle remains the same", () => {
    const mockPageTitle = "Custom Page Title";
    (useSelector as vi.Mock).mockReturnValue(mockPageTitle);

    render(<DynamicTitle />);

    // Ensure the title is set once
    expect(document.title).toBe(mockPageTitle);

    // Re-render with the same pageTitle value and check no change
    render(<DynamicTitle />);
    expect(document.title).toBe(mockPageTitle);
  });
});

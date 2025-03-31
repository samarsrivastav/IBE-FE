import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import DynamicBackground from "./DynamicBackground";
import { useSelector } from "react-redux";

// Mock Redux useSelector
vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

describe("DynamicBackground Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test("renders null when config is not loaded", () => {
    (useSelector as vi.Mock).mockReturnValue({
      configId: 0,
      configuration: {},
    });

    const { container } = render(<DynamicBackground />);
    expect(container.firstChild).toBeNull(); // Component should render nothing
  });

});

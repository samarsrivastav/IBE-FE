import { render, screen } from "@testing-library/react";
import { AmenityItem } from "./AmenityItem";

describe("AmenityItem", () => {
  test("renders the component correctly", () => {
    render(<AmenityItem text="Free WiFi" />);
    expect(screen.getByText("Free WiFi")).toBeInTheDocument();
  });

  test("displays the correct text", () => {
    render(<AmenityItem text="Swimming Pool" />);
    const textElement = screen.getByText("Swimming Pool");
    expect(textElement).toBeInTheDocument();
  });


});

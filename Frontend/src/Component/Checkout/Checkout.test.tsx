import { render, screen } from "@testing-library/react";
import { Checkout } from "./Checkout";

describe("Checkout Component", () => {
  test("renders Checkout component without crashing", () => {
    render(<Checkout />);
    
    expect(screen.getByText("Checkout")).toBeInTheDocument();
  });
});

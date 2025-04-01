import { render, screen, fireEvent } from "@testing-library/react";
import { Package } from "./Package";
import { currencySymbolMap } from "../../../../Constant/CurrencyConstant";

describe("Package Component", () => {
  const packageProps = {
    id: "123",
    title: "Luxury Suite",
    description: "A spacious suite with ocean views",
    price: "200",
    currency: "USD",
    type: "standard" as const,
  };

  test("renders the component correctly", () => {
    render(<Package {...packageProps} />);
    expect(screen.getByText(packageProps.title)).toBeInTheDocument();
    expect(screen.getByText(packageProps.description)).toBeInTheDocument();
    expect(screen.getByText("per night")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /SELECT PACKAGE/i })).toBeInTheDocument();
  });


  test("calls handleSelectPackage when 'SELECT PACKAGE' button is clicked", () => {
    console.log = vi.fn(); // Mock console.log
    render(<Package {...packageProps} />);
    const button = screen.getByRole("button", { name: /SELECT PACKAGE/i });
    fireEvent.click(button);
    expect(console.log).toHaveBeenCalledWith("Selected package:", packageProps);
  });
});

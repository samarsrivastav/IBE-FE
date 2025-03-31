import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "./Navbar";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";  // Assuming your store is set up like this
import { BrowserRouter } from "react-router-dom";

const MockNavbar = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Navbar language="en" setLanguage={() => {}} />
    </BrowserRouter>
  </Provider>
);

describe("Navbar Component", () => {
  it("renders the logo correctly", () => {
    render(<MockNavbar />);
    const logo = screen.getByAltText(/logo/i);
    expect(logo).toBeInTheDocument();
  });

  it("renders the 'MY BOOKINGS' text", () => {
    render(<MockNavbar />);
    const bookingsText = screen.getByText(/MY BOOKINGS/i);
    expect(bookingsText).toBeInTheDocument();
  });

  it("renders the login button", () => {
    render(<MockNavbar />);
    const loginButton = screen.getByRole("button", { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });

});

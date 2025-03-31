import { render, screen, fireEvent } from "@testing-library/react";
import PaginationComponent from "./PaginationComponent";
import { vi } from "vitest";

describe("PaginationComponent", () => {
  const totalPages = 5;
  const currentPage = 2;
  const onPageChange = vi.fn();

  test("renders pagination with correct number of pages", () => {
    render(<PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />);
    
    const paginationElement = screen.getByRole("navigation");
    expect(paginationElement).toBeInTheDocument();
    
    const pageButtons = screen.getAllByRole("button");
    expect(pageButtons.length).toBeGreaterThanOrEqual(totalPages); // Includes previous/next buttons
  });


  test("navigates to the previous and next pages correctly", () => {
    render(<PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />);

    const prevButton = screen.getByLabelText("Go to previous page");
    const nextButton = screen.getByLabelText("Go to next page");

    fireEvent.click(prevButton);
    expect(onPageChange).toHaveBeenCalledWith(expect.any(Object), currentPage - 1);

    fireEvent.click(nextButton);
    expect(onPageChange).toHaveBeenCalledWith(expect.any(Object), currentPage + 1);
  });
});

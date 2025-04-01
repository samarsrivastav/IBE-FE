import { render, screen, fireEvent } from "@testing-library/react";
import FilterGroup from "./FilterGroup";
import { vi } from "vitest";

describe("FilterGroup Component", () => {
  const title = "Test Filter";
  const onToggle = vi.fn();

  test("renders component with title", () => {
    render(<FilterGroup title={title} expanded={false} onToggle={onToggle} />);
    
    const titleElement = screen.getByText(title);
    expect(titleElement).toBeInTheDocument();
  });

  test("calls onToggle when header is clicked", () => {
    render(<FilterGroup title={title} expanded={false} onToggle={onToggle} />);
    
    const headerElement = screen.getByText(title);
    fireEvent.click(headerElement);

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  test("shows content when expanded is true", () => {
    render(
      <FilterGroup title={title} expanded={true} onToggle={onToggle}>
        <div data-testid="content">Filter Options</div>
      </FilterGroup>
    );

    const contentElement = screen.getByTestId("content");
    expect(contentElement).toBeInTheDocument();
  });

  test("hides content when expanded is false", () => {
    render(
      <FilterGroup title={title} expanded={false} onToggle={onToggle}>
        <div data-testid="content">Filter Options</div>
      </FilterGroup>
    );

    const contentElement = screen.queryByTestId("content");
    expect(contentElement).toBeNull();
  });

  test("displays correct icon based on expanded state", () => {
    const { rerender } = render(
      <FilterGroup title={title} expanded={false} onToggle={onToggle} />
    );

    const downArrow = screen.getByTestId("KeyboardArrowDownIcon");
    expect(downArrow).toBeInTheDocument();

    rerender(<FilterGroup title={title} expanded={true} onToggle={onToggle} />);

    const upArrow = screen.getByTestId("KeyboardArrowUpIcon");
    expect(upArrow).toBeInTheDocument();
  });
});

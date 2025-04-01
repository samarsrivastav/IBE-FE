import { render, screen } from "@testing-library/react";
import StepsIndicator from "./StepsIndicator";
import styles from "./StepsIndicator.module.scss";

describe("StepsIndicator Component", () => {
  test("renders the component correctly", () => {
    render(<StepsIndicator step={1} />);
    expect(screen.getByText("1: Choose room")).toBeInTheDocument();
    expect(screen.getByText("2. Choose add on")).toBeInTheDocument();
    expect(screen.getByText("3: Checkout")).toBeInTheDocument();
  });

  test("applies active style to step 1 when step is 1", () => {
    render(<StepsIndicator step={1} />);
    const step1 = screen.getByText("1: Choose room");
    expect(step1).toHaveClass(styles.steps__activelabel);
  });

  test("applies active style to step 2 when step is 2", () => {
    render(<StepsIndicator step={2} />);
    const step2 = screen.getByText("2. Choose add on");
    expect(step2).toHaveClass(styles.steps__activelabel);
  });

  test("applies active style to step 3 when step is 3", () => {
    render(<StepsIndicator step={3} />);
    const step3 = screen.getByText("3: Checkout");
    expect(step3).toHaveClass(styles.steps__activelabel);
  });

  
});

import { render, screen, fireEvent } from "@testing-library/react";
import { ImageSlider } from "./ImageSlider";

describe("ImageSlider", () => {
  const sliderImages = ["image1.jpg", "image2.jpg", "image3.jpg"];
  const handleNext = vi.fn();
  const handlePrev = vi.fn();
  const onTransitionEnd = vi.fn();

  test("renders the component correctly", () => {
    render(
      <ImageSlider
        sliderImages={sliderImages}
        currentIndex={0}
        transitionEnabled={true}
        handleNext={handleNext}
        handlePrev={handlePrev}
        onTransitionEnd={onTransitionEnd}
      />
    );
    expect(screen.getByRole("button", { name: /❮/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /❯/ })).toBeInTheDocument();
  });

  test("applies the correct transformation based on currentIndex", () => {
    const { container } = render(
      <ImageSlider
        sliderImages={sliderImages}
        currentIndex={1}
        transitionEnabled={true}
        handleNext={handleNext}
        handlePrev={handlePrev}
        onTransitionEnd={onTransitionEnd}
      />
    );
    const slider = container.querySelector(".room-modal__image-slider");
    expect(slider).toHaveStyle("transform: translateX(-100%)");
  });

  test("calls handleNext when next button is clicked", () => {
    render(
      <ImageSlider
        sliderImages={sliderImages}
        currentIndex={0}
        transitionEnabled={true}
        handleNext={handleNext}
        handlePrev={handlePrev}
        onTransitionEnd={onTransitionEnd}
      />
    );
    const nextButton = screen.getByRole("button", { name: /❯/ });
    fireEvent.click(nextButton);
    expect(handleNext).toHaveBeenCalledTimes(1);
  });

  test("calls handlePrev when previous button is clicked", () => {
    render(
      <ImageSlider
        sliderImages={sliderImages}
        currentIndex={0}
        transitionEnabled={true}
        handleNext={handleNext}
        handlePrev={handlePrev}
        onTransitionEnd={onTransitionEnd}
      />
    );
    const prevButton = screen.getByRole("button", { name: /❮/ });
    fireEvent.click(prevButton);
    expect(handlePrev).toHaveBeenCalledTimes(1);
  });

  test("calls onTransitionEnd when the transition ends", () => {
    const { container } = render(
      <ImageSlider
        sliderImages={sliderImages}
        currentIndex={0}
        transitionEnabled={true}
        handleNext={handleNext}
        handlePrev={handlePrev}
        onTransitionEnd={onTransitionEnd}
      />
    );
    const slider = container.querySelector(".room-modal__image-slider");
    if (slider) fireEvent.transitionEnd(slider);
    expect(onTransitionEnd).toHaveBeenCalledTimes(1);
  });
});

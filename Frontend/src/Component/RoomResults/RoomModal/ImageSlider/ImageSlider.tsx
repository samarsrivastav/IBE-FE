import React from "react";

interface ImageSliderProps {
  sliderImages: string[];
  currentIndex: number;
  transitionEnabled: boolean;
  handleNext: () => void;
  handlePrev: () => void;
  onTransitionEnd: () => void;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({
  sliderImages,
  currentIndex,
  transitionEnabled,
  handleNext,
  handlePrev,
  onTransitionEnd,
}) => {
  return (
    <div className="room-modal__image-container">
      <button
        className="room-modal__nav room-modal__nav--prev"
        onClick={handlePrev}
      >
        &#10094;
      </button>
      <div
        className="room-modal__image-slider"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: transitionEnabled ? "transform 0.5s ease-in-out" : "none",
        }}
        onTransitionEnd={onTransitionEnd}
      >
        {sliderImages.map((image, index) => (
          <div
            key={index}
            className="room-modal__image"
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        ))}
      </div>
      <button
        className="room-modal__nav room-modal__nav--next"
        onClick={handleNext}
      >
        &#10095;
      </button>
    </div>
  );
};
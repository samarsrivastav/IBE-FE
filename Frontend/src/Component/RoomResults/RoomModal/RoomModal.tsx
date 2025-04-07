import React, { useState } from "react";
import { ImageSlider } from "./ImageSlider/ImageSlider";
import { RoomDetails } from "./RoomDetails/RoomDetails";
import "./RoomModal.scss";
import { Package } from "../../../Redux/slice/roomDataSlice";

export interface RoomModalProps {
  room: {
    roomTypeId: string;
    title: string;
    size: string;
    maxOccupancy: string;
    bedSize: string;
    description: string;
    amenities: string[];
    packages: Package[];
    images: string[];
  };
  onClose: () => void;
}

export const RoomModal: React.FC<RoomModalProps> = ({ room, onClose }) => {

  const [currentImageIndex, setCurrentImageIndex] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const sliderImages = [room.images[room.images.length - 1], ...room.images, room.images[0]];

  const handleNextImage = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentImageIndex((prev) => prev + 1);
  };

  const handlePrevImage = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentImageIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    const lastCloneIndex = sliderImages.length - 1;
    if (currentImageIndex === lastCloneIndex) {
      setTransitionEnabled(false);
      setCurrentImageIndex(1);
      setTimeout(() => {
        setTransitionEnabled(true);
        setIsAnimating(false);
      }, 50);
    } else if (currentImageIndex === 0) {
      setTransitionEnabled(false);
      setCurrentImageIndex(sliderImages.length - 2);
      setTimeout(() => {
        setTransitionEnabled(true);
        setIsAnimating(false);
      }, 50);
    } else {
      setIsAnimating(false);
    }
  };

  return (
    <div className="room-modal">
      <div className="room-modal__overlay" onClick={onClose}></div>
      <div className="room-modal__content">
        <button className="room-modal__close" onClick={onClose}>
          ×
        </button>
        <ImageSlider
          sliderImages={sliderImages}
          currentIndex={currentImageIndex}
          transitionEnabled={transitionEnabled}
          handleNext={handleNextImage}
          handlePrev={handlePrevImage}
          onTransitionEnd={handleTransitionEnd}
        />
        <RoomDetails room={room} />
      </div>
    </div>
  );
};

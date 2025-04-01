import { useState } from "react";

interface ImageProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
}

const ImageWithFallback: React.FC<ImageProps> = ({
  src,
  alt = "Image",
  fallback ,
  className,
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={(e) => {
        console.error("Image failed to load:", e.currentTarget.src);
        setImgSrc(fallback);
      }}
    />
  );
};

export default ImageWithFallback;

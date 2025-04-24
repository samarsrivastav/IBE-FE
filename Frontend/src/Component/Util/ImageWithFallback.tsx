import { useState, useEffect } from "react";

interface ImageProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
}

const ImageWithFallback: React.FC<ImageProps> = ({
  src,
  alt = "Image",
  fallback,
  className,
}) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset error state when src changes
    setHasError(false);
    
    // Check if src is a valid URL or string
    if (src) {
      setImgSrc(src);
    } else {
      setImgSrc(fallback);
    }
  }, [src, fallback]);

  const handleError = () => {
    console.error("Image failed to load:", imgSrc);
    setHasError(true);
    setImgSrc(fallback);
  };

  // If we have an error and fallback exists, use fallback
  // If src exists and no error, use src
  // Otherwise use fallback
  const displaySrc = hasError ? fallback : (src || fallback);

  return (
    <img
      src={displaySrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};

export default ImageWithFallback;

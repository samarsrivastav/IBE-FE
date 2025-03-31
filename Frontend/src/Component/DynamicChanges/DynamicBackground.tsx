import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

const DEFAULT_BACKGROUND = "/image.png"; // Set a default fallback image

const DynamicBackground = () => {
  const tenantConfig = useSelector((state: RootState) => state.tenantConfig);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);

  useEffect(() => {
    if (tenantConfig.configId !== 0) {
      setIsConfigLoaded(true);

      let imageUrl = tenantConfig.configuration.bannerImage || localStorage.getItem('backgroundImage') || DEFAULT_BACKGROUND;

      // Check if the image URL is valid
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => setBackgroundImage(imageUrl);
      img.onerror = () => {
        console.warn("Image failed to load, falling back to default:", DEFAULT_BACKGROUND);
        setBackgroundImage(DEFAULT_BACKGROUND);
      };
    }
  }, [tenantConfig.configId, tenantConfig.configuration.bannerImage]);

  if (!isConfigLoaded || !backgroundImage) return null;

  return (
    <style>
      {`
        .main-content {
          background-image: url('${backgroundImage}');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
      `}
    </style>
  );
};

export default DynamicBackground;

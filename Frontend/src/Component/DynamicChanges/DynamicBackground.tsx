import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

const DynamicBackground = () => {
  const tenantConfig = useSelector((state: RootState) => state.tenantConfig);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);

  useEffect(() => {
    // Check if tenant config is loaded (has any data)
    if (tenantConfig.configId !== 0) {
      setIsConfigLoaded(true);
      
      // Try to get image from tenant config first
      if (tenantConfig.configuration.bannerImage) {
        setBackgroundImage(tenantConfig.configuration.bannerImage);
        return;
      }

      // If no tenant config image, try to get from localStorage
      const storedImage = localStorage.getItem('backgroundImage');
      if (storedImage) {
        setBackgroundImage(storedImage);
        return;
      }

      // If no stored image, use default image
      setBackgroundImage('/image.png');
    }
  }, [tenantConfig.configId, tenantConfig.configuration.bannerImage]);

  // Only render the style if we have loaded the config and have a background image
  if (!isConfigLoaded || !backgroundImage) {
    return null;
  }

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
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store"; 

const DynamicTitle = () => {
  const pageTitle = useSelector((state: RootState) => state.tenantConfig.configuration.pageTitle);

  useEffect(() => {
    if (pageTitle) {
      document.title = pageTitle; 
    }
    else{
      document.title = "Hotel Booking Engine";
    }
  }, [pageTitle]);

  return null; 
};

export default DynamicTitle;

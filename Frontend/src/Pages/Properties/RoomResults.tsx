import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./RoomResults.module.scss";
import { RootState } from "../../Redux/store";
import FilterSidebar from "../../Component/RoomResults/FilterSidebar/FilterSidebar";
import ResultsContent from "../../Component/RoomResults/ResultsContent/ResultsContent";
import SearchFilters from "../../Component/RoomResults/SearchFilters/SearchFilters";
import StepsIndicator from "../../Component/RoomResults/StepsIndicator/StepsIndicator";
import BannerArea from "../../Component/RoomResults/BannerArea/BannerArea";
import { useDispatch, useSelector } from "react-redux";
import { DEFAULT_BANNER_IMAGE } from "../../Constant";
import { fetchRoomDetails } from "../../Redux/thunk/roomDataThunk";

const RoomResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();

  const tenantConfig = useSelector((state: RootState) => state.tenantConfig);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [bannerStyle, setBannerStyle] = useState({});
  const [step, setStep] = useState<number>(
    parseInt(localStorage.getItem("step") || "1")
  );

  const [expandedFilters, setExpandedFilters] = useState({
    bedType: true,
    location: false,
    stars: false,
  });

  const { rooms, loading, error } = useSelector(
    (state: RootState) => state.rooms
  );
  const [filteredRooms, setFilteredRooms] = useState(rooms);
  // Fetch rooms on mount
  const propertyIdFromState = useSelector((state: RootState) => state.search.PropertyId);
  const propertyId = searchParams.get("propertyId") ?? propertyIdFromState;
  const searchSliceData=useSelector((state:RootState)=>state.search)
  console.log(searchSliceData)
    

  useEffect(() => {
    setFilteredRooms(rooms);
  }, [rooms]);

  useEffect(() => {
    if (tenantConfig?.configuration.bannerImage) {
      const img = new Image();
      img.src = tenantConfig.configuration.bannerImage;
      img.onload = () => {
        setImageLoaded(true);
        setBannerStyle({
          backgroundImage: `url(${tenantConfig.configuration.bannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        });
      };
      img.onerror = () => {
        setBannerStyle({
          backgroundImage: `url(${DEFAULT_BANNER_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        });
      };
    } else {
      setBannerStyle({
        backgroundImage: `url(${DEFAULT_BANNER_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      });
    }
  }, [tenantConfig]);

  const toggleFilter = (filter: keyof typeof expandedFilters) => {
    setExpandedFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  const applyFilters = (filters: {
    bedTypes: string[];
    locations: string[];
    stars: number[];
  }) => {
    let updatedRooms = rooms;

    if (filters.bedTypes.length) {
      updatedRooms = updatedRooms.filter((room) => {
        const roomBedTypes = room.bedType.toLowerCase();
        return filters.bedTypes.some((filterType) =>
          roomBedTypes.includes(filterType.toLowerCase())
        );
      });

    }
    if (filters.locations.length) {
      updatedRooms = updatedRooms.filter((room) =>
        filters.locations.includes(room.location)
      );
    }
    if (filters.stars.length) {
      updatedRooms = updatedRooms.filter((room) =>
        filters.stars.includes(room.rating)
      );
    }

    setFilteredRooms(updatedRooms);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching rooms: {error}</div>;

  return (
    <div className={styles.page}>
      <BannerArea bannerStyle={bannerStyle} imageLoaded={imageLoaded} />
      <StepsIndicator step={step} />

      <div className={styles.container}>
        <SearchFilters
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
        <div className={styles.content}>
          <FilterSidebar
            expandedFilters={expandedFilters}
            toggleFilter={toggleFilter}
            applyFilters={applyFilters}
          />
          <ResultsContent rooms={filteredRooms} setStep={setStep} />
        </div>
      </div>
    </div>
  );
};

export default RoomResults;
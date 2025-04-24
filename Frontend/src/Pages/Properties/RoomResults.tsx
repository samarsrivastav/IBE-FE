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
import { Box, Button, IconButton, useMediaQuery, Typography } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

const RoomResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useMediaQuery('(max-width:960px)');
  const dispatch = useDispatch();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const tenantConfig = useSelector((state: RootState) => state.tenantConfig);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [bannerStyle, setBannerStyle] = useState({});
  const [step, setStep] = useState<number>(
    parseInt(localStorage.getItem("step") || "1")
  );

  type FilterKeys = "bedType" | "location" | "stars";

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

  // Close mobile filters when screen size changes to desktop
  useEffect(() => {
    if (!isMobile) {
      setShowMobileFilters(false);
    }
  }, [isMobile]);

  const toggleFilter = (filter: FilterKeys) => {
    setExpandedFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
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
    
    // On mobile, close the filters after applying
    if (isMobile) {
      setShowMobileFilters(false);
    }
  };

  if (loading) return (
    <Box
      sx={{
        width: '100%', 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: { xs: '1rem', sm: '2rem' }
      }}
    >
      <Typography
        variant="h5"
        sx={{ 
          marginBottom: '1rem',
          fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
        }}
      >
        Loading accommodations...
      </Typography>
      <Box
        sx={{ 
          width: { xs: '80%', sm: '50%', md: '30%' },
          height: '4px',
          backgroundColor: '#f0f0f0',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '2px'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            backgroundColor: '#1a1a47',
            animation: 'loading 1.5s infinite',
            '@keyframes loading': {
              '0%': { width: '0%', left: '0%' },
              '50%': { width: '50%', left: '25%' },
              '100%': { width: '0%', left: '100%' }
            }
          }}
        />
      </Box>
    </Box>
  );
  if (error) return (
    <Box
      sx={{
        width: '100%', 
        padding: { xs: '1rem', sm: '2rem' },
        textAlign: 'center'
      }}
    >
      <Typography
        variant="h5"
        color="error"
        sx={{ 
          marginBottom: '1rem',
          fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
        }}
      >
        Error fetching rooms:
      </Typography>
      <Typography
        variant="body1"
        sx={{ 
          marginBottom: '2rem',
          fontSize: { xs: '0.875rem', sm: '1rem' }
        }}
      >
        {error}
      </Typography>
      <Button
        variant="contained"
        onClick={() => window.location.reload()}
        sx={{ 
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          padding: { xs: '0.5rem 1rem', sm: '0.75rem 1.5rem' }
        }}
      >
        Try Again
      </Button>
    </Box>
  );

  return (
    <div className={styles.page}>
      <BannerArea bannerStyle={bannerStyle} imageLoaded={imageLoaded} />
      <StepsIndicator step={step} />

      <div className={styles.container}>
        <SearchFilters
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
        
        {isMobile && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2,
            mt: 1
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button 
                variant="outlined" 
                startIcon={<FilterListIcon />}
                onClick={toggleMobileFilters}
                size="small"
                sx={{ 
                  borderRadius: '4px',
                  fontSize: { xs: '12px', sm: '14px' },
                  py: { xs: 0.5, sm: 0.75 },
                  px: { xs: 1, sm: 2 }
                }}
              >
                Filters {filteredRooms.length !== rooms.length && `(${filteredRooms.length}/${rooms.length})`}
              </Button>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontSize: { xs: '12px', sm: '14px' } }}>
                {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} found
              </Typography>
            </Box>
          </Box>
        )}
        
        {isMobile && showMobileFilters ? (
          <Box 
            sx={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1000,
              backgroundColor: '#fff',
              p: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Filters</Typography>
              <IconButton onClick={toggleMobileFilters}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              <FilterSidebar
                expandedFilters={expandedFilters}
                toggleFilter={toggleFilter}
                applyFilters={applyFilters}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                fullWidth 
                onClick={toggleMobileFilters}
                sx={{ textTransform: 'none' }}
              >
                Show Results ({filteredRooms.length})
              </Button>
            </Box>
          </Box>
        ) : (
          <div className={styles.content}>
            {!isMobile && (
              <FilterSidebar
                expandedFilters={expandedFilters}
                toggleFilter={toggleFilter}
                applyFilters={applyFilters}
              />
            )}
            <ResultsContent rooms={filteredRooms} setStep={setStep} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomResults;
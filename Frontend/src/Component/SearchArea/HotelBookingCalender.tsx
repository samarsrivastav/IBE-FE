import React, { useState, useEffect } from 'react';
import './Calender.scss';
import { useDispatch } from 'react-redux';
import { setCheckIn, setCheckOut } from '../../Redux/slice/searchSlice';
import { fetchPropertiesRate } from '../../Redux/thunk/propertyRateThunk';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { AppDispatch } from '../../Redux/store';
import { fetchPromotionRate } from '../../Redux/thunk/promotionThunk';
import { useCurrencyConverter } from '../../Config/CustomHooks/useCurrencyConverter';
import { currencySymbolMap } from '../../Constant/CurrencyConstant';
import { useSearchParams } from 'react-router-dom';

interface PriceData {
  date: string;
  price: number;
}

interface Promotion {
  startDate: [number, number, number];
  endDate: [number, number, number];
  discount: number;
}

const HotelBookingCalendar = ({onClose}: {onClose: () => void}) => {
  const dispatch: AppDispatch = useDispatch();
  // State for tracking selected dates
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [selectionComplete, setSelectionComplete] = useState<boolean>(false);
  const tenantConfig = useSelector((state: RootState) => state.tenantConfig);
  const { convertedPrices, currency } = useCurrencyConverter(priceData);

  // Track the two displayed months separately
  const [firstMonth, setFirstMonth] = useState<number>(5); // May
  const [secondMonth, setSecondMonth] = useState<number>(6); // June
  const [searchParams, setSearchParams] = useSearchParams();
  const propertyIdState = useSelector((state: RootState) => state.search.PropertyId);
  const propertyId=searchParams.get("propertyId")??propertyIdState;
  
  
  
  useEffect(() => {
      if (propertyId) {
        dispatch(fetchPropertiesRate(propertyId.toString()));
      }
      dispatch(fetchPromotionRate());
    }, [dispatch]);
    
  const propertyRate = useSelector((state: RootState) => state.propertyRate);
  const promotionRate = useSelector((state: RootState) => state.promotion);
 

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  

  useEffect(() => {
    // When promotionRate data is available, update promotions state
    if (promotionRate && promotionRate.length > 0) {
      setPromotions(promotionRate);
    }
  }, [promotionRate]);

  useEffect(() => {
    if (propertyRate.property) {
      // Transform object into an array of {date, price}
      const formattedData: PriceData[] = Object.entries(propertyRate.property).map(
        ([date, price]) => ({
          date: new Date(date).toISOString().split('T')[0], // Format date as YYYY-MM-DD
          price: price as unknown as number,
        })
      );
      setPriceData(formattedData);
    }
  }, [propertyRate.property]);
  
  // Month navigation handlers
  const navigateFirstMonthPrev = () => {
    if (firstMonth > 3) { // Don't go below March (3)
      setFirstMonth(prev => prev - 1);
    }
  };

  const navigateFirstMonthNext = () => {
    if (firstMonth < 5) { // Don't go above June (6)
      setFirstMonth(prev => prev + 1);
    }
  };

  const navigateSecondMonthPrev = () => {
    if (secondMonth > firstMonth + 1) { // Don't overlap with first month
      setSecondMonth(prev => prev - 1);
    }
  };

  const navigateSecondMonthNext = () => {
    if (secondMonth < 6) { // Don't go above June (6)
      navigateFirstMonthNext(); // Ensure first month is always before second month
      setSecondMonth(prev => prev + 1);
    }
  };

  // Effect to always keep second month one ahead of first month
  useEffect(() => {
    setSecondMonth(firstMonth + 1);
    
    // Ensure we don't exceed the limits
    if (firstMonth + 1 > 6) {
      setSecondMonth(6);
    }
  }, [firstMonth]);

  // Check if a date falls within any promotion period
  const getPromotion = (dateStr: string): Promotion | null => {
    const date = new Date(dateStr);
    return promotions.find(promo => {
      const startDate = new Date(promo.startDate[0], promo.startDate[1] - 1, promo.startDate[2]);
      const endDate = new Date(promo.endDate[0], promo.endDate[1] - 1, promo.endDate[2]);
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
      return date >= startDate && date <= adjustedEndDate;
    }) || null;
  };

  // Calculate the discounted price for a date
  const getDiscountedPrice = (originalPrice: number, dateStr: string): number | null => {
    const promotion = getPromotion(dateStr);
    if (!promotion) return null;
    
    // Calculate discounted price (assuming discount is percentage)
    return Math.round(originalPrice * (1 - promotion.discount / 100));
  };

  // Get price for a specific date
  const getPriceForDate = (dateStr: string): number | null => {
    const entry = convertedPrices.find(item => item.date === dateStr);
    return entry ? entry.price : null;
  };

  // Helper to format date as YYYY-MM-DD
  const formatDate = (year: number, month: number, day: number): string => {
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  // Helper to check if a date is from a previous month
  const isPreviousMonth = (dateStr: string): boolean => {
    const currentDate = new Date();
    const dateToCheck = new Date(dateStr);
    
    return (
      dateToCheck.getFullYear() < currentDate.getFullYear() ||
      (dateToCheck.getFullYear() === currentDate.getFullYear() && 
       dateToCheck.getMonth() < currentDate.getMonth())
    );
  };

  // Check if date has a valid price
  const hasValidPrice = (dateStr: string): boolean => {
    return getPriceForDate(dateStr) !== null;
  };

  // Find the next date without a price
  const findNextDateWithoutPrice = (dateStr: string): string | null => {
    const startDateObj = new Date(dateStr);
    const maxSearchDays = tenantConfig.configuration.lengthOfStay? tenantConfig.configuration.lengthOfStay : 14; // Don't look beyond max stay length
    
    for (let i = 1; i <= maxSearchDays; i++) {
      const nextDate = new Date(startDateObj);
      nextDate.setDate(startDateObj.getDate() + i);
      const nextDateStr = nextDate.toISOString().split('T')[0];
      
      if (!hasValidPrice(nextDateStr)) {
        return nextDateStr;
      }
    }
    
    return null;
  };

  // Calculate the maximum valid end date based on start date and prices
  const getMaxValidEndDate = (start: string): string | null => {
    const nextInvalidDate = findNextDateWithoutPrice(start);
    if (!nextInvalidDate) {
      // If no invalid dates found, use max days constraint
      const startDate = new Date(start);
      const maxEndDate = new Date(startDate);
      maxEndDate.setDate(startDate.getDate() + max_days);
      return maxEndDate.toISOString().split('T')[0];
    }
    
    // Return the day before the invalid date
    const invalidDate = new Date(nextInvalidDate);
    invalidDate.setDate(invalidDate.getDate() - 1);
    return invalidDate.toISOString().split('T')[0];
  };

  // Handle date selection
  const handleDateClick = (year: number, month: number, day: number): void => {
    const clickedDate = formatDate(year, month, day);
    
    // Don't allow selection of dates without prices
    if (!hasValidPrice(clickedDate)) {
      return;
    }
    
    // If both dates are selected and user clicks again, start over
    if (selectionComplete) {
      setStartDate(clickedDate);
      setEndDate(null);
      setSelectionComplete(false);
      return;
    }
    
    if (!startDate) {
      // Selecting start date
      setStartDate(clickedDate);
      setEndDate(null);
      setSelectionComplete(false);
    } else if (!endDate && clickedDate >= startDate) {
      // Selecting end date
      setEndDate(clickedDate);
      setSelectionComplete(true);
    } else {
      // Reset and start new selection
      setStartDate(clickedDate);
      setEndDate(null);
      setSelectionComplete(false);
    }
  };

  // Handle mouse hover
  const handleDateHover = (year: number, month: number, day: number): void => {
    if (startDate && !endDate) {
      const hoverDate = formatDate(year, month, day);
      setHoveredDate(hoverDate);
    }
  };

  // Handle mouse leave
  const handleDateLeave = (): void => {
    setHoveredDate(null);
  };

  //configurable
  const max_days = tenantConfig.configuration.lengthOfStay? tenantConfig.configuration.lengthOfStay : 14;

  // Check if a date is selectable as end date (within max_days of start and before any date without price)
  const isValidEndDate = (dateStr: string): boolean => {
    if (!startDate) return false;
    
    const start = new Date(startDate);
    const current = new Date(dateStr);
    const diffTime = current.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate max end date based on pricing availability
    const maxEndDate = getMaxValidEndDate(startDate);
    const isBeforeMaxPrice = maxEndDate ? dateStr <= maxEndDate : true;
    
    return diffDays > 0 && diffDays <= max_days && isBeforeMaxPrice && hasValidPrice(dateStr);
  };

  // Check if a date is in the selected range
  const isInRange = (dateStr: string): boolean => {
    if (startDate && endDate) {
      return dateStr >= startDate && dateStr <= endDate;
    }
    if (startDate && hoveredDate && hoveredDate > startDate) {
      return dateStr >= startDate && dateStr <= hoveredDate && isValidEndDate(hoveredDate);
    }
    return false;
  };

  // Render a month calendar
  const renderMonth = (year: number, month: number, position: 'left' | 'right'): React.ReactElement => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['SU', 'M', 'T', 'W', 'TH', 'F', 'S'];
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // Build calendar grid
    const weeks = [];
    let days = [];
    
    // Add header row with day names
    const headerRow = dayNames.map(day => (
      <div key={`header-${day}-${position}`} className="day-name">{day}</div>
    ));
    weeks.push(<div key={`header-${position}`} className="week header-row">{headerRow}</div>);
    
    // Add last month's days
    const lastMonthDays = new Date(year, month - 1, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = lastMonthDays - i;
      const dateStr = formatDate(year, month - 1, day);
      const price = getPriceForDate(dateStr);
      
      
      // Determine cell classes based on selection state
      let cellClasses = ["day", "last-month", "disabled"]; // Always disable previous month's days
      
      if (dateStr === startDate) {
        cellClasses.push("selected-start");
      } else if (dateStr === endDate) {
        cellClasses.push("selected-end");
      } else if (isInRange(dateStr)) {
        cellClasses.push("in-range");
      }
      
      days.push(
        <div 
          key={`last_month-${day}-${position}`}
          className={cellClasses.join(" ")}
        >
          <div className="day-content">
            <div className="day-number">{day}</div>
            {price && <div className="price">{currencySymbolMap.get(currency)}{price}</div>}
          </div>
        </div>
      );
    }
    
    // Add cells for days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(year, month, day);
      const price = getPriceForDate(dateStr);
      const discountedPrice = price ? getDiscountedPrice(price, dateStr) : null;
      const hasPromotion = !!discountedPrice;
      
      // Determine cell classes based on selection state
      let cellClasses = ["day"];
      
      if (dateStr === startDate) {
        cellClasses.push("selected-start");
      } else if (dateStr === endDate) {
        cellClasses.push("selected-end");
      } else if (isInRange(dateStr)) {
        cellClasses.push("in-range");
      }
      
      if (hasPromotion) {
        cellClasses.push("has-promotion");
      }
      
      // Disable dates that can't be selected based on selection state
      const isDisabled = !selectionComplete && startDate !== null && !isValidEndDate(dateStr) && dateStr !== startDate;
      
      // Also disable dates in the past, from previous months, or without prices
      const isPastDate = new Date(dateStr) < new Date();
      const isPrevMonth = isPreviousMonth(dateStr);
      const hasNoPrice = !hasValidPrice(dateStr);
      
      if (isDisabled || isPastDate || isPrevMonth || hasNoPrice) {
        cellClasses.push("disabled");
      }
      
      days.push(
        <div 
          key={`day-${dateStr}-${position}`}
          className={cellClasses.join(" ")}
          onClick={() => !(isDisabled || isPastDate || isPrevMonth || hasNoPrice) && handleDateClick(year, month, day)}
          onMouseEnter={() => !(isDisabled || isPastDate || isPrevMonth || hasNoPrice) && handleDateHover(year, month, day)}
          onMouseLeave={handleDateLeave}
        >
          <div className="day-content">
            <div className="day-number">{day}</div>
            {price !== null ? (
              <div className="price-container">
                {hasPromotion ? (
                  <>
                    <div className="price original-price">{currencySymbolMap.get(currency)}{price}</div>
                    <div className="price discounted-price">{currencySymbolMap.get(currency)}{discountedPrice}</div>
                  </>
                ) : (
                  <div className="price">{currencySymbolMap.get(currency)}{price}</div>
                )}
              </div>
            ) : (
              <div className="price unavailable">N/A</div>
            )}
          </div>
        </div>
      );
      
      // Start a new row after Saturday (or when we reach the end)
      if ((firstDay + day) % 7 === 0 || day === daysInMonth) {
        // If this is the last day, pad with empty cells
        if (day === daysInMonth) {
          const remainingCells = 7 - days.length % 7;
          if (remainingCells < 7) {
            for (let i = 0; i < remainingCells; i++) {
              days.push(<div key={`end-empty-${i}-${position}`} className="day empty"></div>);
            }
          }
        }
        
        weeks.push(<div key={`week-${weeks.length}-${position}`} className="week">{days}</div>);
        days = [];
      }
    }
    
    // Navigation buttons
    const prevButton = (
      <button 
        className="month-nav prev" 
        onClick={position === 'left' ? navigateFirstMonthPrev : navigateSecondMonthPrev}
      >
        &lt;
      </button>
    );
    
    const nextButton = (
      <button 
        className="month-nav next"
        onClick={position === 'left' ? navigateFirstMonthNext : navigateSecondMonthNext}
      >
        &gt;
      </button>
    );
    
    return (
      <div className="month-calendar">
        <div className="month-header">
          <div className="month-title">{monthNames[month - 1]}</div>
          {prevButton}
          {nextButton}
        </div>
        <div className="calendar-grid">{weeks}</div>
      </div>
    );
  };

  // Get message based on selection state
  const getStatusMessage = () => {
    if (startDate && !endDate) {
      const maxEndDate = getMaxValidEndDate(startDate);
      if (maxEndDate) {
        const maxDate = new Date(maxEndDate);
        const startDateObj = new Date(startDate);
        const diffTime = maxDate.getTime() - startDateObj.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include start date
        
        return `Please select end date. Max length of stay: ${Math.min(diffDays, max_days)} days`;
      }
      return `Please select end date. Max length of stay: ${max_days} days`;
    } else if (startDate && endDate) {
      return <span className='selected-total-price'>Total: {currencySymbolMap.get(currency)}{getTotalPriceInRange(startDate,endDate)}</span>;
    } else {
      return "Please select start date";
    }
  };

  const getTotalPriceInRange = (start: string, end: string): number | null => {
    if (!start || !end) return null;
  
    const selectedPrices = convertedPrices
      .filter(({ date }) => date >= start && date <= end)
      .map(({ date, price }) => {
        const discountedPrice = getDiscountedPrice(price, date);
        return discountedPrice ?? price;
      });
  
    const res= selectedPrices.length > 0 ? selectedPrices.reduce((sum, price) => sum + price, 0) : null;
    return Number(res?.toFixed(2));
  };
  
  
  // Handle apply button click
  const handleApplyDates = () => {
    if (startDate && endDate) {
      console.log("Applied dates:", { startDate, endDate });
      dispatch(setCheckIn(startDate));
      dispatch(setCheckOut(endDate));
      // close the calendar
      onClose();
    }
  };

  return (
    <div className="hotel-booking-calendar">
      <div className="calendar-container">
        {renderMonth(2025, firstMonth, 'left')}
        {renderMonth(2025, secondMonth, 'right')}
      </div>
      <div className="booking-actions">
      <hr className="separator" />
        <div className="right-content">
          <button 
            className={`apply-dates-btn ${startDate && endDate ? 'active' : ''}`}
            onClick={handleApplyDates}
            disabled={!startDate || !endDate}
          >
            APPLY DATES
          </button>
          <p className="booking-message">
            {getStatusMessage()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HotelBookingCalendar;
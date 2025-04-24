import React, { useState, useMemo } from "react";
import { Package } from "../Package/Package";
import { AmenityItem } from "../AmenityItem/AmenityItem";
import { useCurrencyConverter } from "../../../../Config/CustomHooks/useCurrency";
import { useDispatch, useSelector } from 'react-redux';
import { validatePromoCode } from '../../../../Redux/thunk/promoCodeThunk';
import { RootState, AppDispatch } from '../../../../Redux/store';
import { Alert, Snackbar } from '@mui/material';

interface PackageType {
  id: string;
  title: string;
  description: string;
  price: string;
  type: string;
}

interface ConvertedPackageType extends PackageType {
  convertedPrice: {
    price: number;
  };
  currency: string;
}

interface RoomDetailsProps {
  room: {
    size: string;
    maxOccupancy: string;
    bedSize: string;
    description: string;
    amenities: string[];
    packages: PackageType[];
  };
}

export const RoomDetails: React.FC<RoomDetailsProps> = ({ room }) => {
  const [promoCode, setPromoCode] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [promoPackage, setPromoPackage] = useState<PackageType | null>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const promoCodeState = useSelector((state: RootState) => state.promoCode);
  const searchState = useSelector((state: RootState) => state.search);
  const { checkOut } = searchState;

  const standardRoom = room.packages.find(pkg => pkg.type === "standard");
  const standardPrice = Number(standardRoom?.price) || 0;
  const { convertedPrice: standardConvertedPrice, currency: standardCurrency } = useCurrencyConverter(standardPrice);

  // Convert all package prices at the top level
  const packagePrices = room.packages.slice(1).map(pkg => ({
    ...pkg,
    price: pkg.price // Keep as string
  }));

  // Convert promo package price at the top level if it exists
  const promoPrice = promoPackage ? Number(promoPackage.price) : 0;
  const { convertedPrice: promoConvertedPrice, currency: promoCurrency } = useCurrencyConverter(promoPrice);

  // Convert each package price individually at the top level
  const convertedPackagePrices: ConvertedPackageType[] = packagePrices.map(pkg => {
    const { convertedPrice, currency } = useCurrencyConverter(Number(pkg.price));
    return {
      ...pkg,
      convertedPrice,
      currency
    };
  });

  const handlePromoCodeApply = async () => {
    if (!promoCode.trim()) {
      setAlertMessage('Please enter a promo code');
      setOpenAlert(true);
      return;
    }

    if (!checkOut) {
      setAlertMessage('Please select check-out date first');
      setOpenAlert(true);
      return;
    }

    try {
      const result = await dispatch(validatePromoCode({ 
        code: promoCode.trim(), 
        usageDate: checkOut 
      })).unwrap();

      if (!result) {
        setAlertMessage('Invalid promo code');
        setOpenAlert(true);
        return;
      }

      // Create a new package with the promo code discount
      const discountedPrice = standardPrice * (1 - result.discount / 100);
      
      // Create new promo package
      const newPromoPackage: PackageType = {
        id: result.id.toString(),
        title: result.title,
        description: result.description,
        price: discountedPrice.toString(),
        type: 'promo'
      };

      setPromoPackage(newPromoPackage);
      setAlertMessage('Promo code applied successfully!');
      setOpenAlert(true);
    } catch (error) {
      console.error('Error validating promo code:', error);
      setAlertMessage('Invalid promo code');
      setOpenAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
    <div className="room-modal__details">
      {/* Left Column */}
      <div className="room-modal__left-column">
        {/* Specifications and Description */}
        <div className="room-modal__specs-and-description">
          <div className="room-modal__specs">
            <div className="room-modal__spec">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.4733 8.47374C11.1269 7.95951 11.604 7.25436 11.8382 6.45637C12.0723 5.65838 12.0519 4.80725 11.7799 4.02139C11.5078 3.23552 10.9975 2.554 10.32 2.07165C9.64259 1.58929 8.83163 1.33008 8 1.33008C7.16836 1.33008 6.35741 1.58929 5.67995 2.07165C5.0025 2.554 4.49223 3.23552 4.22014 4.02139C3.94805 4.80725 3.92767 5.65838 4.16184 6.45637C4.396 7.25436 4.87307 7.95951 5.52666 8.47374C4.40672 8.92244 3.42952 9.66664 2.69926 10.627C1.969 11.5874 1.51304 12.7279 1.38 13.9271C1.37037 14.0146 1.37808 14.1032 1.40268 14.1878C1.42729 14.2723 1.46831 14.3512 1.52341 14.42C1.63468 14.5587 1.79652 14.6476 1.97333 14.6671C2.15014 14.6865 2.32744 14.6349 2.46621 14.5237C2.60499 14.4124 2.69388 14.2506 2.71333 14.0737C2.85972 12.7705 3.48112 11.5669 4.45881 10.6929C5.4365 9.81892 6.70193 9.33576 8.01333 9.33576C9.32473 9.33576 10.5902 9.81892 11.5679 10.6929C12.5455 11.5669 13.1669 12.7705 13.3133 14.0737C13.3315 14.2376 13.4096 14.3888 13.5327 14.4984C13.6559 14.608 13.8152 14.6681 13.98 14.6671H14.0533C14.2281 14.647 14.3878 14.5586 14.4977 14.4212C14.6076 14.2839 14.6587 14.1086 14.64 13.9337C14.5063 12.7312 14.0479 11.5877 13.3139 10.6259C12.5799 9.66402 11.5979 8.92006 10.4733 8.47374ZM8 8.00041C7.47258 8.00041 6.95701 7.84401 6.51848 7.55099C6.07995 7.25798 5.73815 6.8415 5.53632 6.35423C5.33449 5.86696 5.28168 5.33078 5.38457 4.8135C5.48746 4.29622 5.74144 3.82106 6.11438 3.44812C6.48732 3.07518 6.96247 2.82121 7.47976 2.71831C7.99704 2.61542 8.53322 2.66823 9.02049 2.87006C9.50776 3.0719 9.92423 3.41369 10.2173 3.85222C10.5103 4.29075 10.6667 4.80633 10.6667 5.33374C10.6667 6.04099 10.3857 6.71926 9.88562 7.21936C9.38552 7.71946 8.70724 8.00041 8 8.00041Z"
                  fill="#858685"
                />
              </svg>

              <p>1 - {room.maxOccupancy}</p>
            </div>
            <div className="room-modal__spec">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.3333 2.33301H2.66666C2.13622 2.33301 1.62752 2.54372 1.25244 2.91879C0.87737 3.29387 0.666656 3.80257 0.666656 4.33301V12.9997C0.666656 13.1765 0.736894 13.3461 0.861919 13.4711C0.986943 13.5961 1.15651 13.6663 1.33332 13.6663H3.99999C4.10979 13.6658 4.21776 13.6381 4.31429 13.5858C4.41082 13.5334 4.49293 13.458 4.55332 13.3663L5.69332 11.6663H10.3067L11.4467 13.3663C11.507 13.458 11.5892 13.5334 11.6857 13.5858C11.7822 13.6381 11.8902 13.6658 12 13.6663H14.6667C14.8435 13.6663 15.013 13.5961 15.1381 13.4711C15.2631 13.3461 15.3333 13.1765 15.3333 12.9997V4.33301C15.3333 3.80257 15.1226 3.29387 14.7475 2.91879C14.3725 2.54372 13.8638 2.33301 13.3333 2.33301ZM14 12.333H12.36L11.22 10.6663C11.1636 10.5684 11.0832 10.4865 10.9864 10.4282C10.8896 10.3699 10.7796 10.3371 10.6667 10.333H5.33332C5.22352 10.3336 5.11555 10.3613 5.01902 10.4136C4.92249 10.4659 4.84038 10.5413 4.77999 10.633L3.63999 12.333H1.99999V8.99967H14V12.333ZM4.66666 7.66634V6.99967C4.66666 6.82286 4.73689 6.65329 4.86192 6.52827C4.98694 6.40325 5.15651 6.33301 5.33332 6.33301H6.66666C6.84347 6.33301 7.01304 6.40325 7.13806 6.52827C7.26308 6.65329 7.33332 6.82286 7.33332 6.99967V7.66634H4.66666ZM8.66666 7.66634V6.99967C8.66666 6.82286 8.73689 6.65329 8.86192 6.52827C8.98694 6.40325 9.15651 6.33301 9.33332 6.33301H10.6667C10.8435 6.33301 11.013 6.40325 11.1381 6.52827C11.2631 6.65329 11.3333 6.82286 11.3333 6.99967V7.66634H8.66666ZM14 7.66634H12.6667V6.99967C12.6667 6.46924 12.4559 5.96053 12.0809 5.58546C11.7058 5.21039 11.1971 4.99967 10.6667 4.99967H9.33332C8.83995 5.00261 8.36508 5.18781 7.99999 5.51967C7.6349 5.18781 7.16003 5.00261 6.66666 4.99967H5.33332C4.80289 4.99967 4.29418 5.21039 3.91911 5.58546C3.54404 5.96053 3.33332 6.46924 3.33332 6.99967V7.66634H1.99999V4.33301C1.99999 4.1562 2.07023 3.98663 2.19525 3.8616C2.32028 3.73658 2.48985 3.66634 2.66666 3.66634H13.3333C13.5101 3.66634 13.6797 3.73658 13.8047 3.8616C13.9298 3.98663 14 4.1562 14 4.33301V7.66634Z"
                  fill="#5D5D5D"
                />
              </svg>

              <p>{room.bedSize || 0}</p>
            </div>
            <span className="room-modal__spec-size">{room.size} ft</span>
          </div>
          <div className="room-modal__description">
            <p>{room.description}</p>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="room-modal__pricing">
          <div className="room-modal__standard-rate">
            <h3 className="room-modal__rate-title">Standard Rate</h3>
            {standardRoom && (
              <Package
                id={standardRoom.id}
                title={standardRoom.title}
                description={standardRoom.description}
                price={standardConvertedPrice.price.toString()}
                type="standard"
                currency={standardCurrency}
              />
            )}
          </div>
          <div className="room-modal__packages">
            <h3 className="room-modal__section-title">Deals & Packages</h3>
            {/* Regular packages */}
            {convertedPackagePrices.map((pkg, index) => (
              <Package
                key={`regular-${index}`}
                id={pkg.id}
                title={pkg.title}
                description={pkg.description}
                price={pkg.convertedPrice.price.toString()}
                currency={pkg.currency}
                type="package"
              />
            ))}
            
            {/* Promo package if available */}
            {promoPackage && (
              <Package
                key={`promo-${promoPackage.id}`}
                id={promoPackage.id}
                title={promoPackage.title}
                description={promoPackage.description}
                price={promoConvertedPrice.price.toString()}
                currency={promoCurrency}
                type="promo"
              />
            )}
          </div>
        </div>

        {/* Promotions Section */}
        <div className="room-modal__promo">
          <p className="room-modal__promo-text">Enter a promo code</p>
          <div className="room-modal__promo-input-container">
            <input 
              className="room-modal__promo-input" 
              type="text" 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter promo code"
            />
            <button 
              className="room-modal__promo-button"
              onClick={handlePromoCodeApply}
              disabled={promoCodeState.loading}
            >
              {promoCodeState.loading ? 'APPLYING...' : 'APPLY'}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="room-modal__right-column">
        <div className="room-modal__amenities">
          <h3 className="room-modal__section-title">Amenities</h3>
          <div className="room-modal__amenity-grid">
            {room.amenities.map((amenity, index) => (
              <AmenityItem
                key={index}
                text={amenity}
              />
            ))}
          </div>
        </div>
      </div>

      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={promoCodeState.error ? 'error' : 'success'}
          sx={{
            width: '100%',
            backgroundColor: promoCodeState.error ? '#d32f2f' : '#0a157a',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
            '& .MuiAlert-action': {
              color: 'white',
            },
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

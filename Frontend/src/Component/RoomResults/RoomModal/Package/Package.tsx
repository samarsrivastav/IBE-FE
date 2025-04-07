import React from 'react';
import './Package.scss';
import { currencySymbolMap } from '../../../../Constant/CurrencyConstant';
import { useNavigate } from 'react-router-dom';

interface PackageProps {
  id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  type: 'standard' | 'package' | 'promo';
}

export const Package: React.FC<PackageProps> = ({ id, title, currency, description, price, type }) => {
  const navigate = useNavigate()
  const handleSelectPackage = async () => {
    localStorage.setItem("step","3")
    localStorage.setItem("package",JSON.stringify({
      id,
      title,
      description,
      price,
      currency,
      type
    }))
    console.log('Selected package:', {
      id,
      title,
      description,
      price,
      currency,
      type
    });
    navigate("/checkout")
  };

  return (
    <div className="package">
      <div className="package__info">
        <p className="package__title">{title}</p>
        <p className="package__description">{description}</p>
      </div>
      <div className="package__price-section">
        <span className="package__price">
          {currencySymbolMap.get(currency)}{price}
          <p>per night</p>
        </span>
        <button 
          className="package__select-button"
          onClick={handleSelectPackage}
        >
          SELECT PACKAGE
        </button>
      </div>
    </div>
  );
};
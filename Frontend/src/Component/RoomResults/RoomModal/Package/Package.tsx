import React from 'react';
import './Package.scss';
import { currencySymbolMap } from '../../../../Constant/CurrencyConstant';
import { formatCamelText } from '../../../../utils/textFormatUtils';

interface PackageProps {
  title:string;
  description: string;
  price: string;
  currency: string;
  type: 'standard' | 'package';
}

export const Package: React.FC<PackageProps> = ({title,currency, description, price }) => {
  return (
    <div className="package">
      <div className="package__info">
      <p className="package__title">{formatCamelText(title)}</p>
        <p className="package__description">{description}</p>
      </div>
      <div className="package__price-section">
        <span className="package__price">{currencySymbolMap.get(currency)}{price}</span>
        <p>per night</p>
        <button className="package__select-button">
          SELECT PACKAGE
        </button>
      </div>
    </div>
  );
};
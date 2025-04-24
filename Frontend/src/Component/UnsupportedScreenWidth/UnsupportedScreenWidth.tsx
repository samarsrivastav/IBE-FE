import React from 'react';
import './UnsupportedScreenWidth.scss';

const UnsupportedScreenWidth: React.FC = () => {
  return (
    <div className="unsupported-screen">
      <div className="content">
        <div className="icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 10H20M4 14H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h1>Screen Size Not Supported</h1>
        <p>Please use a device with a minimum screen width of 352px to access this website.</p>
        <div className="device-info">
          <p>Current screen width: <span>{window.innerWidth}px</span></p>
          <p>Minimum required width: <span>352px</span></p>
        </div>
      </div>
    </div>
  );
};

export default UnsupportedScreenWidth; 
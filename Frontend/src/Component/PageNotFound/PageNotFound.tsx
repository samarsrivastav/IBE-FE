import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PageNotFound.scss';

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="page-not-found">
      <div className="content">
        <div className="error-code">404</div>
        <h1>Page Not Found</h1>
        <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
        <button onClick={() => navigate('/')} className="back-home">
          Back to Home
        </button>
      </div>
    </div>
  );
} 
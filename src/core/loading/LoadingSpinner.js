import React from 'react';
import './LoadingSpinner.css'; // This will be your CSS file for styles

const LoadingSpinner = () => {
    return (
        <div className="loading-spinner-overlay">
            <div className="loading-spinner"></div>
        </div>
    );
};

export default LoadingSpinner;

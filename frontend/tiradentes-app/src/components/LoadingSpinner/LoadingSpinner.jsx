import React from 'react'
import './LoadingSpinner.css'; // O arquivo CSS onde o estilo estará

const LoadingSpinner = () => {
    return (
        <div className="loading-spinner mr-2">
            <div className="spinner"></div>
        </div>
    );
}

export default LoadingSpinner
import React from "react";
import "./Loader.scss";

const Loader = ({ small, full }) => {
    return (
        <div className={`loader-container ${full ? 'full-screen' : ''}`} style={{ minHeight: small ? '50px' : (full ? '100vh' : '200px') }}>
            <div className="premium-loader" style={{ scale: small ? '0.5' : '1' }}>
                <div className="spinner"></div>
                <div className="pulse"></div>
                <span className="logo-text">Wait...</span>
            </div>
        </div>
    );
};


export default Loader;

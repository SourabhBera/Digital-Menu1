import React from 'react';
import logo from '../assets/images/logo.png'; 
import '../styles/logo.css';  

function Logo() {
  return (
    <div className="logo-container">
      <img src={logo} alt="Restaurant Logo" className="restaurant-logo" />
    </div>
  );
}

export default Logo;
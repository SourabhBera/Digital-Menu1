

import React from 'react';
import './categorybutton.css'; 
import {FaStar} from 'react-icons/fa'; 
import veg_logo from '../assets/images/veg_logo.png';
import nonveg_logo from '../assets/images/nonveg_logo.png';


function CategoryButton() {
  return (
    <div className="category-buttons">
      <button className="category-button">
        <FaStar className="icon" />
        Bestsellers
      </button>
      <button className="category-button" style={{width:'90px'}}>
        <img src={veg_logo} className="icon"  alt='veg-icon'/>
        Veg
      </button>
      <button className="category-button">
        <img src={nonveg_logo} className="icon" alt='nonveg-icon'/>
        Non-Veg
      </button>
    </div>
  );
}

export default CategoryButton;

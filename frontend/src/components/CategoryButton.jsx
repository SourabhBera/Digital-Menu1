import React from 'react';
import '../styles/categorybutton.css'; 
import { FaStar } from 'react-icons/fa'; 
import veg_logo from '../assets/images/veg_logo.png';
import nonveg_logo from '../assets/images/nonveg_logo.png';

const CategoryButton = ({ setFilter }) => {
  return (
    <div className="category-buttons">
      {/* <button className="category-button" onClick={() => setFilter('bestseller')}>
        <FaStar className="icon" />
        Bestsellers
      </button> */}
      <button className="category-button" style={{ width: '90px' }} onClick={() => setFilter('veg')}>
        <img src={veg_logo} className="icon" alt='veg-icon' />
        Veg
      </button>
      <button className="category-button" style={{ width: '130px' }} onClick={() => setFilter('nonveg')}>
        <img src={nonveg_logo} className="icon" alt='nonveg-icon' />
        Non-Veg
      </button>
      <button className="category-button" style={{ width: '70px' }} onClick={() => setFilter(null)}>
        All
      </button>
    </div>
  );
};

export default CategoryButton;

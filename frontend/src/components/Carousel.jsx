// src/components/MenuCarousel.jsx

import React, { useEffect } from 'react';
import img1 from '../assets/images/img1.png';
import img22 from '../assets/images/img22.png';
import img33 from '../assets/images/img33.png';


import './carousel.css'; 

function MenuCarousel() {
  useEffect(() => {
    const interval = setInterval(() => {
      const carousel = document.getElementById('carouselExampleIndicators');
      const carouselInstance = new window.bootstrap.Carousel(carousel);
      carouselInstance.next();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>

      <div id="carouselExampleIndicators" className="carousel slide custom-carousel" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={img1} className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src={img22} className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src={img33} className="d-block w-100" alt="..." />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </>
  );
}

export default MenuCarousel;

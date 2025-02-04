// src/components/MenuCarousel.jsx

import React, { useEffect } from 'react';
import juices_video from '../assets/videos/juices_video.mp4'; // Import your video files

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
          {/* <button
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
          ></button> */}
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <video className="d-block w-100 video-fit" autoPlay muted loop>
              <source src={juices_video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        {/* <button
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
        </button> */}
      </div>
    </>
  );
}

export default MenuCarousel;

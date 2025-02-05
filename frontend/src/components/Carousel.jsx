import React, { useEffect } from 'react';
import juices_video from '../assets/videos/juices_video.mp4'; // Import your video files
import '../styles/carousel.css'; 

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
    <div id="carouselExampleIndicators" className="carousel slide custom-carousel" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <video className="d-block w-100 video-fit" autoPlay muted loop>
            <source src={juices_video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}

export default MenuCarousel;

import React, { useState } from "react";
import "../styles/VideoModal.css";  // You may want to adjust or create styles for video modal
import { MdOutlineClose } from "react-icons/md";
import veg_logo from '../assets/images/veg_logo.png';
import nonveg_logo from '../assets/images/nonveg_logo.png';


function VideoModal({ videoSrc, dishName, price, dish_type }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const logoSrc = dish_type === "Veg" ? veg_logo : nonveg_logo;

  return (
    <div onClick={openModal} className="video-modal-container">
      <div className="video-thumbnail">
        <div className="dish-header">
          <img src={logoSrc} alt={dish_type} className="dish-logo" />
          <p className="dish-name">{dishName}</p>
        </div>

        <p className="dish-description" style={{fontWeight:"100"}}>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        <p className="dish-price" style={{marginBottom:"5px"}}>₹{price}</p>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <MdOutlineClose
              onClick={closeModal}
              style={{ marginBottom: "5px", left: "280px", position: "absolute" }}
            />
            <video controls autoPlay muted className="modal-video" style={{ width: "80%" }}>
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="modal-dish-details" style={{minWidth:"00px", maxWidth:"150px"}}>
              <img src={logoSrc} alt={dish_type} className="modal-dish-logo" />
              <p className="modal-dish-name" style={{marginTop:"15px"}}>{dishName}</p>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoModal;
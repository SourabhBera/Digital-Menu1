import React, { useState } from "react";
import "../styles/ImageModal.css";
import { MdOutlineClose } from "react-icons/md";

function ImageModal({ imageSrc, dishName, price, dish_type }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div onClick={openModal} className="image-modal-container">
      <img src={imageSrc} alt="" className="circularimage" />
      <p className="dish-name">{dishName}</p>
      <p className="dish-price">₹{price}</p>
      <p className="dish-type">{dish_type}</p>
      

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            
            <MdOutlineClose onClick={closeModal} style={{marginBottom: '5px', left:'330px', position:'absolute'}}/>
            <img src={imageSrc} alt={dishName} className="modal-image" />
            <p className="modal-dish-name">{dishName}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageModal;

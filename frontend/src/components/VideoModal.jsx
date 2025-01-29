import React, { useState } from "react";
// import "./VideoModal.css";  // You may want to adjust or create styles for video modal
import { MdOutlineClose } from "react-icons/md";

function VideoModal({ videoSrc, dishName, price, dish_type }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div onClick={openModal} className="video-modal-container">
      {/* Add a thumbnail or placeholder for video */}
      <div className="video-thumbnail">
        <p>{dishName}</p>
        <p className="dish-price">₹{price}</p>
        <p className="dish-type">{dish_type}</p>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <MdOutlineClose
              onClick={closeModal}
              style={{ marginBottom: '5px', left: '280px', position: 'absolute' }}
            />
            {/* Replace image with video, and enable autoplay */}
            <video controls autoPlay muted className="modal-video" style={{width:"80%"}}>
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p className="modal-dish-name">{dishName}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoModal;

import React, { useState, useEffect } from "react";
import ImageModal from "./ImageModal";
import "./MenuSection.css";
import { fetchMenu } from "../api/Menu";  // Adjust the path based on your folder structure
import VideoModal from "./VideoModal";

const MenuSection = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getMenu = async () => {
      try {
        const fetchedMenu = await fetchMenu();
        setMenuItems(fetchedMenu); // Directly set the menu data from the backend
      } catch (err) {
        setError("Failed to fetch menu. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getMenu();
  }, []);

  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    const category = (item.category_name || "Others").trim().toLowerCase();  // Use category_name now
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});


  return (
    <div className="menu-section">
      {Object.keys(groupedMenuItems).map((category) => (
        <div key={category} className="category" style={{marginTop:"20px"}}>
          <button
            className="button-52" role="button"
            onClick={() => toggleCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
          {openCategory === category && (
            <div className="menu-items">
              {groupedMenuItems[category].map((item, index) => (
                <div className="menu-item" key={index}>
                  <img src='http://127.0.0.1:8000/static/images/chicken_biryani.jpg' alt="" className="circularimage" />
                  <VideoModal 
                    videoSrc='http://127.0.0.1:8000/static/videos/chicken_biryani.mp4'  // Pass video path from backend
                    dishName={item.dish_name}
                    price={item.price}
                    dish_type={item.dish_type}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuSection;


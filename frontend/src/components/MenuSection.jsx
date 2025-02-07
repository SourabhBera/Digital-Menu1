import React, { useState, useEffect } from "react";
import ImageModal from "./ImageModal";
import CategoryButton from "./CategoryButton"; // Import the updated CategoryButton component
import "../styles/MenuSection.css";
import { fetchMenu } from "../api/Menu";
import VideoModal from "./VideoModal";

const MenuSection = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState(null);

  const categoryOrder = [
    "starters",
    "soups",
    "main-course",
    "breads",
    "side dishes",
    "beverages",
    "desserts",
    "specials",
    "extras",
  ];

  useEffect(() => {
    const getMenu = async () => {
      try {
        const fetchedMenu = await fetchMenu();
        setMenuItems(fetchedMenu);
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

  const filteredItems = menuItems.filter(item => {
    if (!filter) return true;
    if (filter === "veg") return item.dish_type === "Veg";
    if (filter === "nonveg") return item.dish_type === "Non-Veg";
    return true;
  });

  const groupedMenuItems = filteredItems.reduce((acc, item) => {
    const category = (item.category_name || "Others").trim().toLowerCase(); // Convert to lowercase
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const sortedCategories = Object.keys(groupedMenuItems).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    return indexA === -1 ? 1 : indexB === -1 ? -1 : indexA - indexB;
  });

  return (
    <div className="menu-section">
      <CategoryButton setFilter={setFilter} />
      {sortedCategories.map((category) => (
        <div key={category} className="category" style={{ marginTop: "20px" }}>
          <button className="button-30" role="button" onClick={() => toggleCategory(category)}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
          {openCategory === category && (
            <div className="menu-items">
              {groupedMenuItems[category].map((item, index) => (
                <div className="menu-item" key={index}>  
                  <img
                    src={`data:image/png;base64,${item.image}`}
                    alt={item.dish_name}
                    className="circularimage"
                  />
                  <VideoModal
                    videoSrc={`http://127.0.0.1:8000${item.video_path}`}
                    dishName={item.dish_name}
                    price={item.price}
                    dish_type={item.dish_type}
                    video_path={item.video_path}
                   
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

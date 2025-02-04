import React, { useState, useEffect } from "react";
import "./EditDish.css"; // ✅ Import the CSS file
import { useNavigate } from "react-router-dom";

const EditDish = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDish, setSelectedDish] = useState("");
  const [dishData, setDishData] = useState({
    dish_name: "",
    category_id: "",
    dish_type: "",
    price: "",
    image: "",
    video:""
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);  // New state for delete confirmation

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:8000/categories");
      if (!res.ok) throw new Error(`Error fetching categories: ${res.status}`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);

    if (!categoryId) {
      setDishes([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/dishes/?category_id=${categoryId}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setDishes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching dishes:", error);
      setDishes([]);
    }
  };

  const handleDishChange = async (e) => {
    const dishId = e.target.value;
    setSelectedDish(dishId);

    if (!dishId) return;

    try {
      const res = await fetch(`http://localhost:8000/dish/${dishId}`);
      if (!res.ok) throw new Error(`Error fetching dish details: ${res.status}`);
      const data = await res.json();

      setDishData({
        dish_name: data?.dish_name || "",
        category_id: data?.category_id || selectedCategory,
        dish_type: data?.dish_type || "",
        price: data?.price || "",
        image: "",
        video:"",
      });

      setImagePreview(data?.image_path ? `http://localhost:8000${data.image_path}` : null);
      setVideoPreview(data?.video_path ? `http://localhost:8000${data.video_path}` : null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setDishData({ ...dishData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDishData({ ...dishData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDishData({ ...dishData, video: file });
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDish) {
      alert("Please select a dish to update.");
      return;
    }

    const formData = new FormData();
    formData.append("dish_name", dishData.dish_name);
    formData.append("category_id", selectedCategory);
    formData.append("dish_type", dishData.dish_type);
    formData.append("price", dishData.price);

    if (dishData.image) {
      formData.append("image", dishData.image);
    }

    if (dishData.video) {
      formData.append("video", dishData.video);
    }

    try {
      const res = await fetch(`http://localhost:8000/update-dish/${selectedDish}`, {
        method: "PUT",
        body: formData,
      });
      navigate("/admin");
      if (!res.ok) throw new Error(`Error updating dish: ${res.status}`);
      const data = await res.json();
      alert(data.message);
    } catch (error) {
      console.error("Error updating dish:", error);
      console.log("Error updating dish:", dishData);
    }
  };

  const handleDeleteClick = () => {
    setIsConfirmDelete(true);  // Show confirmation popup
  };

  const handleCancelDelete = () => {
    setIsConfirmDelete(false); // Hide confirmation popup
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:8000/delete/${selectedDish}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Error deleting dish: ${res.status}`);
      const data = await res.json();
      alert(data.message);
      setSelectedDish("");  // Clear selected dish after deletion
      setIsConfirmDelete(false);  // Hide confirmation popup
      navigate("/admin");
    } catch (error) {
      console.error("Error deleting dish:", error);
    }
  };

  return (
    <div className="edit-dish-container">
      <h2 className="title">Edit Dish</h2>

      <label className="label">Category:</label>
      <select className="select" value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">Select Category</option>
        {categories.length > 0 ? (
          categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))
        ) : (
          <option disabled>Loading categories...</option>
        )}
      </select>

      <label className="label">Dish:</label>
      <select className="select" value={selectedDish} onChange={handleDishChange} disabled={!selectedCategory}>
        <option value="">Select Dish</option>
        {dishes.length > 0 ? (
          dishes.map((dish) => (
            <option key={dish.id} value={dish.id}>
              {dish.dish_name}
            </option>
          ))
        ) : (
          <option disabled>No dishes available</option>
        )}
      </select>

      {selectedDish && (
        <form className="edit-form" onSubmit={handleSubmit}>
          <label className="label">Dish Name:</label>
          <input
            className="input"
            type="text"
            name="dish_name"
            value={dishData.dish_name}
            onChange={handleInputChange}
            required
          />

          <label className="label">Dish Type:</label>
          <select
            className="select"
            name="dish_type"
            value={dishData.dish_type}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Dish Type</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>

          <label className="label">Price:</label>
          <input
            className="input"
            type="number"
            name="price"
            value={dishData.price}
            onChange={handleInputChange}
            required
          />

          <label className="label">Thumbnail Image:</label>
          <input className="file-input" type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && <img className="preview-image" src={imagePreview} alt="Preview" />}


          <label className="label">Dish Video:</label>
          <input className="file-input" type="file" accept="video/*" name="video" onChange={handleVideoChange} />
          {videoPreview && (
            <video className="preview-image" controls>
              <source src={videoPreview} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          <button className="submit-btn" type="submit">
            Update Dish
          </button>

          <button className="delete-btn" type="button" onClick={handleDeleteClick}>
            Delete Dish
          </button>
        </form>
      )}

      {/* Confirmation Popup */}
      {isConfirmDelete && (
        <div className="confirmation-popup">
          <div className="popup-content">
            <p>Are you sure you want to delete this dish?</p>
            <button onClick={handleConfirmDelete} className="confirm-btn">Yes</button>
            <button onClick={handleCancelDelete} className="cancel-btn">No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditDish;

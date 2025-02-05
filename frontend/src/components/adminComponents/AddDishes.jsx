import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories, addDish } from "../../api/AddDishes.js"; // Import API functions
import "../../styles/AddDishes.css";


function AddDishes() {
  const navigate = useNavigate();
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [type, setType] = useState("Veg");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((err) => setMessage(err.message));
  }, []);

  const handleImageUpload = (e) => setImage(e.target.files[0]);
  const handleVideoUpload = (e) => setVideo(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dishName || !category || !price || !image || !video) {
      alert("Please fill in all fields and upload both an image and a video.");
      return;
    }

    const formData = new FormData();
    formData.append("dish_name", dishName);
    formData.append("category_id", category);
    formData.append("dish_type", type);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);
    formData.append("video", video);

    try {
      const response = await addDish(formData);
      setMessage(response.message || "Dish added successfully!");
      navigate("/admin");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="add-dish-form">
      <h2>Add New Dish</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="dishName">Dish Name:</label>
          <input
            type="text"
            id="dishName"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            placeholder="Enter dish name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            className="form-select"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Type:</label>
          <select
            className="form-select"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Upload Thumbnail Image:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
          {image && <p>Selected image: {image.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="video">Upload Video:</label>
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={handleVideoUpload}
            required
          />
          {video && <p>Selected video: {video.name}</p>}
        </div>

        <button type="submit" className="submit-button">
          Add Dish
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default AddDishes;

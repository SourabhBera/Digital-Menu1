import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddDishes.css";

function AddDishes() {
  const navigate = useNavigate();

  const [dishName, setDishName] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [type, setType] = useState("Veg");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/categories");
        setCategories(response.data); // Assuming the API returns a list of categories
      } catch (error) {
        console.error("Error fetching categories:", error.response?.data || error.message);
        setMessage("Failed to fetch categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dishName || !category || !price || !image) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("dish_name", dishName);
    formData.append("category_id", category);
    formData.append("dish_type", type);
    formData.append("price", price);
    formData.append("image", image);

    try {
      const response = await axios.post("http://127.0.0.1:8000/admin/add-dishes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(response.data.message || "Dish added successfully!");
      // Clear form fields
      setDishName("");
      setCategory("");
      setType("Veg");
      setPrice("");
      setImage(null);

      // Redirect after success
      navigate("/");
    } catch (error) {
      console.error("Error adding dish:", error.response?.data || error.message);
      setMessage(error.response?.data?.detail || "Failed to add dish. Please try again.");
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
          <label htmlFor="image">Upload Image:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
          {image && <p>Selected file: {image.name}</p>}
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

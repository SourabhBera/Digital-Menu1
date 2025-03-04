import axios from "axios";

const API_BASE_URL = "https://digital-menu-7ohp.onrender.com";

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error.response?.data || error.message);
    throw new Error("Failed to fetch categories.");
  }
};

export const addDish = async (dishData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/add-dishes`, dishData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding dish:", error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || "Failed to add dish. Please try again.");
  }
};

import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

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
    return response.data;
  } catch (error) {
    console.error("Error adding dish:", error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || "Failed to add dish. Please try again.");
  }
};

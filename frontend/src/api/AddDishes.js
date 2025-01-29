import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; // Replace with your FastAPI backend URL

export const addMenuItem = async (menuItem) => {
  const formData = new FormData();
  formData.append("dish_name", menuItem.dish_name);
  formData.append("category_id", menuItem.category_id); // Use 'category_id' as expected by FastAPI
  formData.append("dish_type", menuItem.dish_type);
  formData.append("price", menuItem.price);
  formData.append("image", menuItem.image); // Ensure this is a File object

  try {
    const response = await axios.post(`${API_BASE_URL}/admin/add-dishes`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding menu item:", error.response?.data || error.message);
    throw error;
  }
};

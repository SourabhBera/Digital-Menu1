import axios from "axios";

// Replace this with your actual API URL
const API_URL = "http://127.0.0.1:8000/";

export const fetchMenu = async () => {
    try {
      const response = await axios.get(`${API_URL}`);  // Use '/menu' endpoint
      console.log(response.data)
      return response.data;
    } catch (err) {
      throw new Error("Failed to fetch menu data");
    }
  };
  